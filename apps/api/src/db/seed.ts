import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";
import { pool } from "./pool";

// nicho_o_comercial no está en el schema (schema/perfume.schema.json) — se
// descarta acá, ver CLAUDE.md para el motivo. categoria_precio="nicho" no es
// un valor válido para esa columna (choca con el CHECK de la migración);
// se remapea a "premium" por decisión explícita, no se inventa sin avisar.
const CATEGORIA_PRECIO_FIX: Record<string, string> = {
  nicho: "premium",
};

interface CsvRow {
  slug: string;
  nombre: string;
  marca: string;
  genero: string;
  familia_olfativa: string;
  notas_salida: string;
  notas_corazon: string;
  notas_fondo: string;
  precio_referencia: string;
  moneda: string;
  categoria_precio: string;
  imagen_url: string;
  link_afiliado: string;
  descripcion_corta: string;
  nicho_o_comercial: string;
}

function splitNotas(value: string): string[] {
  return value
    .split(";")
    .map((nota) => nota.trim())
    .filter(Boolean);
}

async function seed() {
  const csvPath = join(__dirname, "..", "..", "..", "..", "PERFUMES_INITIAL_50.csv");
  const raw = readFileSync(csvPath, "utf-8");

  const rows: CsvRow[] = parse(raw, {
    columns: true,
    skip_empty_lines: true,
  });

  let inserted = 0;
  let updated = 0;

  for (const row of rows) {
    const categoriaPrecio = CATEGORIA_PRECIO_FIX[row.categoria_precio] ?? row.categoria_precio;

    const result = await pool.query(
      `INSERT INTO perfumes (
        slug, nombre, marca, genero, familia_olfativa,
        notas_salida, notas_corazon, notas_fondo,
        precio_referencia, moneda, categoria_precio,
        imagen_url, link_afiliado, descripcion_corta
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (slug) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        marca = EXCLUDED.marca,
        genero = EXCLUDED.genero,
        familia_olfativa = EXCLUDED.familia_olfativa,
        notas_salida = EXCLUDED.notas_salida,
        notas_corazon = EXCLUDED.notas_corazon,
        notas_fondo = EXCLUDED.notas_fondo,
        precio_referencia = EXCLUDED.precio_referencia,
        moneda = EXCLUDED.moneda,
        categoria_precio = EXCLUDED.categoria_precio,
        imagen_url = EXCLUDED.imagen_url,
        link_afiliado = EXCLUDED.link_afiliado,
        descripcion_corta = EXCLUDED.descripcion_corta,
        actualizado_en = now()
      RETURNING (xmax = 0) AS inserted`,
      [
        row.slug,
        row.nombre,
        row.marca,
        row.genero,
        row.familia_olfativa,
        splitNotas(row.notas_salida),
        splitNotas(row.notas_corazon),
        splitNotas(row.notas_fondo),
        row.precio_referencia,
        row.moneda,
        categoriaPrecio,
        row.imagen_url,
        row.link_afiliado,
        row.descripcion_corta,
      ],
    );

    if (result.rows[0]?.inserted) {
      inserted += 1;
    } else {
      updated += 1;
    }
  }

  console.log(`Seed completo: ${inserted} insertados, ${updated} actualizados (de ${rows.length} filas del CSV).`);
  await pool.end();
}

seed().catch((err) => {
  console.error("Error al sembrar datos:", err);
  process.exit(1);
});
