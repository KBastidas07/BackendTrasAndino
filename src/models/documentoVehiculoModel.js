import db from "../Conf/dbTasandino.js";

class DocumentoVehiculo {
  // Obtener todos los documentos de vehículos
  static async findAll() {
  const [rows] = await db.execute(`
    SELECT 
      dv.idDocumento,
      dv.placa,
      v.marca,
      v.linea,
      tdv.nombre AS tipoDocumento,
      ee.NombreEncargado AS empresaExterna,
      dv.fechaEmision,
      dv.fechaVencimiento,
      dv.estadoDocVehiculo
    FROM documentovehiculo dv
    LEFT JOIN Vehiculo v ON dv.placa = v.placa
    LEFT JOIN tipoDocumentoVehiculo tdv ON dv.idTipoDocumento = tdv.idTipoDocumento
    LEFT JOIN empresaExterna ee ON tdv.idEmpresaExterna = ee.idEmpresaExterna
    ORDER BY dv.fechaVencimiento DESC
  `);
  return rows;
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
       d.idDocumento,
       d.placa,
       v.marca,
       v.linea,
       td.nombre AS tipoDocumento,
       ee.NombreEncargado AS empresaExterna,
       d.fechaEmision,
       d.fechaVencimiento,
       d.estadoDocVehiculo
     FROM documentoVehiculo d
     LEFT JOIN Vehiculo v ON d.placa = v.placa
     LEFT JOIN tipoDocumentoVehiculo td ON d.idTipoDocumento = td.idTipoDocumento
     LEFT JOIN empresaExterna ee ON td.idEmpresaExterna = ee.idEmpresaExterna
     WHERE d.placa = ?`,
    [placa]
  );
  return rows;
}



  // Crear nuevo documento de vehículo
static async create(documentoData) {
  const {
    placa,
    idTipoDocumento,
    fechaEmision,
    fechaVencimiento,
    estadoDocVehiculo
  } = documentoData;

  const [result] = await db.execute(
    `INSERT INTO documentoVehiculo 
      (placa, idTipoDocumento, fechaEmision, fechaVencimiento, estadoDocVehiculo)
     VALUES (?, ?, ?, ?, ?)`,
    [placa, idTipoDocumento, fechaEmision, fechaVencimiento, estadoDocVehiculo]
  );

  return result.insertId;
}


  // Actualizar documento existente
static async update(id, documentoData) {
  const {
    placa,
    idTipoDocumento,
    fechaEmision,
    fechaVencimiento,
    estadoDocVehiculo
  } = documentoData;

  const [result] = await db.execute(
    `UPDATE documentoVehiculo
     SET placa = ?, idTipoDocumento = ?, fechaEmision = ?, fechaVencimiento = ?, estadoDocVehiculo = ?
     WHERE idDocumento = ?`,
    [placa, idTipoDocumento, fechaEmision, fechaVencimiento, estadoDocVehiculo, id]
  );

  return result.affectedRows;
}


  // Eliminar documento por su ID
  static async delete(id) {
    const [result] = await db.execute(
      `DELETE FROM documentoVehiculo WHERE idDocumento = ?`,
      [id]
    );
    return result.affectedRows; // 1 si se eliminó correctamente
  }
}

export default DocumentoVehiculo;
