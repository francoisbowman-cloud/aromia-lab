#!/usr/bin/env python3
"""WiFi Guardian: detecta dispositivos desconocidos en tu red local.

Uso:
  python guardian.py scan                     # escanea y muestra quién está conectado
  python guardian.py trust <MAC> "Nombre"     # marca un dispositivo como tuyo
  python guardian.py block <MAC>              # lo marca como intruso (para bloquearlo en el router)
  python guardian.py forget <MAC>             # lo saca de la lista
  python guardian.py watch [--every 60]       # vigila en bucle y avisa cuando entra alguien nuevo
  python guardian.py export                   # lista de MACs bloqueadas para pegar en el router
"""
import argparse
import ipaddress
import json
import platform
import re
import socket
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from pathlib import Path

DB_PATH = Path(__file__).with_name("known_devices.json")
MAC_RE = re.compile(r"([0-9a-fA-F]{1,2}[:-]){5}[0-9a-fA-F]{1,2}")
IP_RE = re.compile(r"\b(\d{1,3}(?:\.\d{1,3}){3})\b")


def load_db():
    if DB_PATH.exists():
        return json.loads(DB_PATH.read_text(encoding="utf-8"))
    return {"trusted": {}, "blocked": {}, "seen": {}}


def save_db(db):
    DB_PATH.write_text(json.dumps(db, indent=2, ensure_ascii=False), encoding="utf-8")


def normalize_mac(mac):
    parts = re.split(r"[:-]", mac.strip().lower())
    if len(parts) != 6:
        raise ValueError(f"MAC inválida: {mac}")
    return ":".join(p.zfill(2) for p in parts)


def is_randomized(mac):
    # Bit "locally administered" del primer octeto: lo usan iOS/Android para MACs privadas.
    return int(mac.split(":")[0], 16) & 0b10 != 0


def local_ip():
    # connect() en UDP no envía paquetes: solo hace que el SO elija la interfaz de salida.
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.connect(("10.255.255.255", 1))
        return s.getsockname()[0]


def wake_hosts(network):
    # Mandar un datagrama a cada IP obliga al SO a resolver su MAC por ARP,
    # lo que llena la tabla ARP sin depender de que el equipo responda ping.
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        for host in network.hosts():
            try:
                s.sendto(b"", (str(host), 9))
            except OSError:
                pass
    time.sleep(2)


def read_arp_table():
    entries = {}
    proc_arp = Path("/proc/net/arp")
    if proc_arp.exists():
        try:
            for line in proc_arp.read_text().splitlines()[1:]:
                cols = line.split()
                if len(cols) >= 4 and cols[3] != "00:00:00:00:00:00":
                    entries[cols[0]] = normalize_mac(cols[3])
            if entries:
                return entries
        except PermissionError:
            pass

    for cmd in (["ip", "neigh"], ["arp", "-a"]):
        try:
            out = subprocess.run(cmd, capture_output=True, text=True, timeout=10).stdout
        except (FileNotFoundError, subprocess.TimeoutExpired):
            continue
        for line in out.splitlines():
            ip, mac = IP_RE.search(line), MAC_RE.search(line)
            if ip and mac and "incomplete" not in line.lower():
                mac_n = normalize_mac(mac.group(0))
                if mac_n not in ("ff:ff:ff:ff:ff:ff", "00:00:00:00:00:00"):
                    entries[ip.group(1)] = mac_n
        if entries:
            break
    return entries


def resolve_name(ip):
    try:
        return socket.gethostbyaddr(ip)[0]
    except (socket.herror, socket.gaierror, OSError):
        return ""


def scan(db):
    my_ip = local_ip()
    network = ipaddress.ip_network(f"{my_ip}/24", strict=False)
    print(f"Escaneando {network} (tu IP: {my_ip})...")
    wake_hosts(network)
    table = {ip: mac for ip, mac in read_arp_table().items()
             if ipaddress.ip_address(ip) in network}

    with ThreadPoolExecutor(max_workers=32) as pool:
        names = dict(zip(table, pool.map(resolve_name, table)))

    now = datetime.now().isoformat(timespec="seconds")
    devices = []
    for ip, mac in sorted(table.items(), key=lambda kv: ipaddress.ip_address(kv[0])):
        if mac in db["blocked"]:
            status = "BLOQUEADO"
        elif mac in db["trusted"]:
            status = "confiable"
        else:
            status = "DESCONOCIDO"
        first_seen = db["seen"].get(mac, {}).get("first", now)
        db["seen"][mac] = {"first": first_seen, "last": now, "ip": ip, "host": names[ip]}
        devices.append({"ip": ip, "mac": mac, "host": names[ip], "status": status,
                        "label": db["trusted"].get(mac) or db["blocked"].get(mac, "")})
    save_db(db)
    return my_ip, devices


def print_devices(my_ip, devices):
    if not devices:
        print("\nNo se pudo leer la tabla ARP (¿Android sin root? Ver README).")
        return
    print(f"\n{'IP':<16}{'MAC':<19}{'ESTADO':<13}{'NOMBRE / HOST'}")
    print("-" * 72)
    for d in devices:
        tag = d["label"] or d["host"] or "-"
        rnd = " (MAC privada)" if is_randomized(d["mac"]) else ""
        print(f"{d['ip']:<16}{d['mac']:<19}{d['status']:<13}{tag}{rnd}")
    unknown = [d for d in devices if d["status"] == "DESCONOCIDO"]
    blocked = [d for d in devices if d["status"] == "BLOQUEADO"]
    print(f"\n{len(devices)} dispositivos (+ este equipo, {my_ip}). "
          f"Desconocidos: {len(unknown)}. Bloqueados presentes: {len(blocked)}.")
    if blocked:
        print("¡Atención! Un dispositivo bloqueado sigue conectado: revisa el filtro MAC del router.")


def alert(message):
    print(f"\a[{datetime.now():%H:%M:%S}] {message}")
    try:
        subprocess.run(["termux-notification", "--title", "WiFi Guardian", "--content", message],
                       timeout=5, capture_output=True)
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass


def watch(db, every):
    alerted = set()
    print(f"Vigilando cada {every}s. Ctrl+C para salir.")
    while True:
        _, devices = scan(db)
        for d in devices:
            if d["status"] != "confiable" and d["mac"] not in alerted:
                alerted.add(d["mac"])
                alert(f"{d['status']}: {d['mac']} en {d['ip']} {d['host']}".strip())
        time.sleep(every)


def main():
    parser = argparse.ArgumentParser(description="Detector de intrusos en tu WiFi")
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("scan")
    p = sub.add_parser("trust"); p.add_argument("mac"); p.add_argument("name")
    p = sub.add_parser("block"); p.add_argument("mac"); p.add_argument("note", nargs="?", default="intruso")
    p = sub.add_parser("forget"); p.add_argument("mac")
    p = sub.add_parser("watch"); p.add_argument("--every", type=int, default=60)
    sub.add_parser("export")
    args = parser.parse_args()
    db = load_db()

    if args.cmd == "scan":
        print_devices(*scan(db))
    elif args.cmd == "trust":
        mac = normalize_mac(args.mac)
        db["blocked"].pop(mac, None)
        db["trusted"][mac] = args.name
        save_db(db)
        print(f"{mac} marcado como confiable: {args.name}")
    elif args.cmd == "block":
        mac = normalize_mac(args.mac)
        db["trusted"].pop(mac, None)
        db["blocked"][mac] = args.note
        save_db(db)
        print(f"{mac} marcado como bloqueado.\n"
              "Ahora agrégalo al filtro MAC de tu router (ver README) para cortarle el acceso.")
    elif args.cmd == "forget":
        mac = normalize_mac(args.mac)
        for key in ("trusted", "blocked", "seen"):
            db[key].pop(mac, None)
        save_db(db)
        print(f"{mac} eliminado.")
    elif args.cmd == "watch":
        try:
            watch(db, args.every)
        except KeyboardInterrupt:
            print("\nVigilancia detenida.")
    elif args.cmd == "export":
        for mac, note in db["blocked"].items():
            print(f"{mac}  # {note}")


if __name__ == "__main__":
    sys.exit(main())
