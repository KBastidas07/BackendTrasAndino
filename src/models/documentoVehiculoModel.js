import db from "../Conf/dbTasandino.js";

class DocumentoVehiculo {
  // Obtener todos los documentos de vehículos
  static async findAll() {
    const [rows] = await db.execute(`
      SELECT 
        dv.id_documento,
        dv.placa,
        v.marca,
        v.linea,
        tdv.nombre AS tipo_documento,
        dv.fecha_emision,
        dv.fecha_vencimiento
      FROM documentovehiculo dv
      LEFT JOIN vehiculo v ON dv.placa = v.placa
      LEFT JOIN tipodocumentovehiculo tdv ON dv.id_tipo_documento = tdv.id_tipo_documento
      ORDER BY dv.fecha_vencimiento DESC
    `);
    return rows; // Retorna todos los documentos con información del vehículo y tipo
  }

  // Buscar documento por su ID
  /*static async findById(id) {
    const [rows] = await db.execute(
      `
      SELECT 
        dv.id_documento,
        dv.placa,
        v.marca,
        v.linea,
        tdv.nombre AS tipo_documento,
        dv.fecha_emision,
        dv.fecha_vencimiento
      FROM documentovehiculo dv
      LEFT JOIN vehiculo v ON dv.placa = v.placa
      LEFT JOIN tipodocumentovehiculo tdv ON dv.id_tipo_documento = tdv.id_tipo_documento
      WHERE dv.id_documento = ?
      `,
      [id]
    );
    return rows[0]; // Devuelve un solo registro
  };
*/
// Buscar documentos por placa
static async findByPlaca(placa) {
  const [rows] = await db.execute(
    `SELECT 
       d.id_documento,
       d.placa,
       v.marca,
       v.linea,
       td.nombre AS tipo_documento,
       d.fecha_emision,
       d.fecha_vencimiento
     FROM documentovehiculo d
     LEFT JOIN vehiculo v ON d.placa = v.placa
     LEFT JOIN tipodocumentovehiculo td ON d.id_tipo_documento = td.id_tipo_documento
     WHERE d.placa = ?`,
    [placa]
  );
  return rows;
}


  // Crear nuevo documento de vehículo
  static async create(documentoData) {
    const {
      placa,
      id_tipo_documento,
      fecha_emision,
      fecha_vencimiento,
      estado
    } = documentoData;

    const [result] = await db.execute(
      `
      INSERT INTO documentovehiculo (placa, id_tipo_documento, fecha_emision, fecha_vencimiento,estado)
      VALUES (?, ?, ?, ?, ?)
      `,
      [placa, id_tipo_documento, fecha_emision, fecha_vencimiento, estado]
    );

    return result.insertId; // Retorna el ID generado automáticamente
  }

  // Actualizar documento existente
  static async update(id, documentoData) {
    const {
      placa,
      id_tipo_documento,
      fecha_emision,
      fecha_vencimiento
    } = documentoData;

    const [result] = await db.execute(
      `
      UPDATE documentovehiculo
      SET placa = ?, id_tipo_documento = ?, fecha_emision = ?, fecha_vencimiento = ?
      WHERE id_documento = ?
      `,
      [placa, id_tipo_documento, fecha_emision, fecha_vencimiento, id]
    );

    return result.affectedRows; // 1 si se actualizó correctamente
  }

  // Eliminar documento por su ID
  static async delete(id) {
    const [result] = await db.execute(
      `DELETE FROM documentovehiculo WHERE id_documento = ?`,
      [id]
    );
    return result.affectedRows; // 1 si se eliminó correctamente
  }
}

export default DocumentoVehiculo;
