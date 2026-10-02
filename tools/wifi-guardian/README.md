# WiFi Guardian

Detector de intrusos en tu red WiFi doméstica. Escanea la red, lista los
dispositivos conectados, te deja marcarlos como **confiables** o
**bloqueados**, y te avisa cuando entra alguien que no conoces.

> Herramienta personal, ajena al producto Aromia. Úsala solo en **tu propia red**.

## Instalación

Solo necesita Python 3 (sin librerías extra).

- **PC (Windows/Mac/Linux)**: conectado a tu WiFi, `python guardian.py scan`.
- **Android**: instala [Termux](https://f-droid.org/packages/com.termux/)
  desde F-Droid, y adentro: `pkg install python git`, clona el repo y corre
  el script. Para notificaciones en el celular: `pkg install termux-api` +
  la app Termux:API.

## Flujo de uso

```bash
python guardian.py scan                          # 1. ¿quién está conectado?
python guardian.py trust a4:83:e7:12:34:56 "Mi celular"   # 2. marca lo tuyo
python guardian.py block 3c:22:fb:aa:bb:cc       # 3. marca al intruso
python guardian.py export                        # 4. copia la MAC al router
python guardian.py watch --every 60              # 5. vigilancia continua
```

Para saber qué MAC es de cada aparato tuyo: en el celular, *Ajustes → WiFi →
(tu red) → Dirección MAC*; en la tele/consola, en sus ajustes de red. Un
truco: apaga un aparato, escanea, y mira cuál desapareció.

## Cómo se bloquea de verdad

El script **detecta**; el que **bloquea** es el router, porque es el único
que decide quién entra. Opciones, de mejor a peor:

1. **Cambiar la contraseña WiFi** (con WPA2 o, mejor, WPA3). Echa a todos
   y solo vuelven quienes la sepan. Es la medida más efectiva.
2. **Desactivar WPS** en el router: es un botón/PIN muy fácil de atacar.
3. **Filtro MAC / lista negra**: entra a tu router (normalmente
   `http://192.168.1.1` o `192.168.0.1`, usuario y clave en la etiqueta),
   busca *Filtrado MAC*, *Control de acceso* o *Dispositivos bloqueados* y
   pega las MACs de `export`. Muchos routers de operador lo traen también en
   su app (Movistar, Huawei AI Life, TP-Link Tether, etc.).
4. **Red de invitados** para visitas, separada de tus equipos.
5. Cambia también la **contraseña de administración del router** (la
   que viene por defecto es pública).

## Conceptos que estás aplicando

- **IP vs. MAC**: la IP es la "dirección postal" dentro de la red y puede
  cambiar; la MAC es el "número de serie" de la tarjeta de red. Por eso
  identificamos dispositivos por MAC.
- **Subred /24**: `192.168.1.0/24` significa "las 254 direcciones de
  192.168.1.1 a 192.168.1.254". El script asume /24, que es lo típico en casa.
- **ARP** (Address Resolution Protocol): cuando tu equipo quiere hablar con
  una IP, pregunta "¿quién tiene esta IP?" y el dueño responde con su MAC.
  El sistema guarda esas respuestas en la **tabla ARP**. El script manda un
  paquete vacío a cada IP para forzar esas preguntas y luego lee la tabla.
- **MAC privada / aleatoria**: iPhone y Android modernos inventan una MAC
  distinta por red para que no los rastreen. Se reconoce por un bit
  especial del primer byte (el script la marca como "MAC privada"). Ojo:
  un celular tuyo puede aparecer como desconocido por esto; puedes desactivar
  la MAC privada solo para tu red de casa.
- **Concurrencia**: resolver nombres de 254 IPs una por una sería lento;
  `ThreadPoolExecutor` lo hace en paralelo con 32 hilos.

## Limitaciones honestas

- **Android 10+ sin root** bloquea la lectura de la tabla ARP a las apps
  (incluida Termux), por privacidad. Si el escaneo sale vacío en el celular,
  córrelo desde un PC conectado a la misma WiFi, o revisa la lista de
  "dispositivos conectados" en la app/web de tu router.
- **Filtro MAC no es infalible**: un atacante con conocimientos puede
  copiar la MAC de un equipo tuyo. Por eso la contraseña fuerte + WPA3 es
  la defensa principal y el filtro es una capa extra.
- No usa técnicas de "expulsión" tipo ARP spoofing (lo que hacen apps como
  NetCut): son inestables, pueden tumbar tu propia red y son las mismas
  técnicas que usa un atacante. El camino correcto es el router.
