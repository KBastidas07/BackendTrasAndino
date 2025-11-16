import db from "../Conf/dbTasandino.js";

class EmpresaExterna {
  // Obtener todos los registros
  static async findAll() {
    const [empresaExterna] = await db.execute(
      "SELECT * FROM EmpresaExterna ORDER BY idEmpresaExterna ASC"
    );
    return empresaExterna;
  }

  // Obtener un registro por ID
  static async findById(id) {
    const [empresaExterna] = await db.execute(
      "SELECT * FROM EmpresaExterna WHERE idEmpresaExterna = ?",
      [id]
    );
    return empresaExterna[0];
  }

  // Crear un nuevo registro
  static async create(data) {
    const { NombreEncargado, Celular, Direccion, Correo } = data;
    const [result] = await db.execute(
      "INSERT INTO EmpresaExterna (NombreEncargado, Celular, Direccion, Correo) VALUES (?, ?, ?, ?)",
      [NombreEncargado, Celular, Direccion, Correo]
    );
    return result.insertId;
  }

  // Actualizar un registro existente por ID
  static async update(id, data) {
    const { NombreEncargado, Celular, Direccion, Correo } = data;

    const cleanData = Object.fromEntries(
      Object.entries({ NombreEncargado, Celular, Direccion, Correo }).filter(
        ([_, v]) => v !== undefined
      )
    );

    const [result] = await db.query(
      "UPDATE EmpresaExterna SET ? WHERE idEmpresaExterna = ?",
      [cleanData, id]
    );

    return result.affectedRows;
  }

  // Eliminar un registro por ID
  static async delete(id) {
    const [result] = await db.execute(
      "DELETE FROM EmpresaExterna WHERE idEmpresaExterna = ?",
      [id]
    );
    return result.affectedRows;
  }
}

export default EmpresaExterna;
