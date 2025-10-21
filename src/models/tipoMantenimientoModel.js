import db from "../Conf/dbTasandino.js";

class TipoMantenimiento {
     // Obtener todos los tipos
  static async findAll() {
    const [rows] = await db.execute("SELECT * FROM tipomantenimiento ORDER BY id_tipo_mantenimiento ASC");
    return rows;
  }

  // Buscar tipo de mantenimineto por ID
  static async findById(id) {
    const [rows] = await db.execute(
      "SELECT * FROM tipomantenimiento WHERE id_tipo_mantenimiento = ?",
      [id]
    );
    return rows[0];
  }

  // Crear nuevo tipo de mantenimineto
  static async create(data) {
    const { nombre } = data;
    const [result] = await db.execute(
      "INSERT INTO tipomantenimiento (nombre) VALUES (?)",
      [nombre]
    );
    return result.insertId;
  }

  // Actualizar tipo de   mantenimineto
  static async update(id, data) {
    const { nombre } = data;
    const [result] = await db.execute(
      "UPDATE tipomantenimiento SET nombre = ? WHERE id_tipo_mantenimiento = ?",
      [nombre, id]
    );
    return result.affectedRows;
  }

  // Eliminar tipo  mantenimineto
  static async delete(id) {
    const [result] = await db.execute(
      "DELETE FROM tipomantenimiento WHERE id_tipo_mantenimiento = ?",
      [id]
    );
    return result.affectedRows;
  }
}
export default TipoMantenimiento;