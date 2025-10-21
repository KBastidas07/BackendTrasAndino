import db from "../Conf/dbTasandino.js";

class TipoDocumentoVehiculo {
     // Obtener todos los tipos de documentos
  static async findAll() {
    const [rows] = await db.execute("SELECT * FROM tipodocumentovehiculo ORDER BY id_tipo_documento ASC");
    return rows;
  }

  // Buscar tipo de documento por ID
  static async findById(id) {
    const [rows] = await db.execute(
      "SELECT * FROM tipodocumentovehiculo WHERE id_tipo_documento = ?",
      [id]
    );
    return rows[0];
  }

  // Crear nuevo tipo de documento
  static async create(data) {
    const { nombre } = data;
    const [result] = await db.execute(
      "INSERT INTO tipodocumentovehiculo (nombre) VALUES (?)",
      [nombre]
    );
    return result.insertId;
  }

  // Actualizar tipo de   mantenimineto
  static async update(id, data) {
    const { nombre } = data;
    const [result] = await db.execute(
      "UPDATE tipodocumentovehiculo SET nombre = ? WHERE id_tipo_documento = ?",
      [nombre, id]
    );
    return result.affectedRows;
  }

  // Eliminar tipo  mantenimineto
  static async delete(id) {
    const [result] = await db.execute(
      "DELETE FROM tipodocumentovehiculo WHERE id_tipo_documento = ?",
      [id]
    );
    return result.affectedRows;
  }
}
export default TipoDocumentoVehiculo;