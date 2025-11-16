import db from "../Conf/dbTasandino.js";


class TipoDocumentoVehiculo {

  // Obtener todos los tipos de documento de vehículo con el nombre de la empresa externa asociada
  static async findAll() {
    const [TipoDocumentos] = await db.execute(`
      SELECT tdv.*, ee.NombreEncargado
      FROM tipodocumentovehiculo tdv
      LEFT JOIN empresaexterna ee ON tdv.idEmpresaExterna = ee.idEmpresaExterna
      ORDER BY tdv.idTipoDocumento ASC
    `);
    return TipoDocumentos;
  }

  // Obtener un tipo de documento de vehículo por ID
  static async findById(id) {
    const [TipoDocumentosId] = await db.execute(
      "SELECT * FROM tipodocumentovehiculo WHERE idTipoDocumento = ?",
      [id]
    );
    return TipoDocumentosId [0];
  }

  //crear un nuevo tipo de documento de vehículo
  static async create(data) {
    const { nombre, idEmpresaExterna } = data;
    if (!nombre || !idEmpresaExterna) throw new Error("Nombre y Empresa Externa son obligatorios");

    const [result] = await db.execute(
      "INSERT INTO tipodocumentovehiculo (nombre, idEmpresaExterna) VALUES (?, ?)",
      [nombre, idEmpresaExterna]
    );
    return result.insertId;
  }

  // Actualizar un tipo de documento de vehículo existente
  static async update(id, data) {
    const { nombre, idEmpresaExterna } = data;
    const [result] = await db.execute(
      "UPDATE tipodocumentovehiculo SET nombre = ?, idEmpresaExterna = ? WHERE idTipoDocumento = ?",
      [nombre, idEmpresaExterna, id]
    );
    return result.affectedRows;
  }

  // Eliminar un tipo de documento de vehículo
  static async delete(id) {
    const [result] = await db.execute(
      "DELETE FROM tipodocumentovehiculo WHERE idTipoDocumento = ?",
      [id]
    );
    return result.affectedRows;
  }
}

export default TipoDocumentoVehiculo;
