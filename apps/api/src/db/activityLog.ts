import { pool } from "./pool";

export async function logActivity(descripcion: string, actor: string = "Brey") {
  await pool.query("INSERT INTO activity_log (descripcion, actor) VALUES ($1, $2)", [
    descripcion,
    actor,
  ]);
}
