import db from "../Conf/dbTasandino.js";

class Mantenimiento {
    // Obtener todos los registros de mantenimiento
    static async findAll() {
         const [rows] = await db.execute(`
      SELECT 
        m.id_mantenimiento,
        m.placa,
        v.marca,
        v.linea,
        tm.nombre AS tipo_mantenimiento,
        m.observaciones,
        m.fecha_mantenimiento
      FROM mantenimiento m
      LEFT JOIN vehiculo v ON m.placa = v.placa
      LEFT JOIN tipomantenimiento tm ON m.id_tipo_mantenimiento = tm.id_tipo_mantenimiento
      ORDER BY m.fecha_mantenimiento DESC
    `);
    return rows; // Retorna todos los mantenimientos con información adicional
    }

    //Buscar mantenimiento por su ID
  /*  static async findById(id) {
    const [rows] = await db.execute(
      `
      SELECT 
        m.id_mantenimiento,
        m.placa,
        v.marca,
        v.linea,
        tm.nombre AS tipo_mantenimiento,
        m.observaciones,
        m.fecha_mantenimiento
      FROM mantenimiento m
      LEFT JOIN vehiculo v ON m.placa = v.placa
      LEFT JOIN tipomantenimiento tm ON m.id_tipo_mantenimiento = tm.id_tipo_mantenimiento
      WHERE m.id_mantenimiento = ?
      `,
      [id]
    );
    return rows[0]; // Devuelve un solo registro
  }
*/
  //Buscar mantenimientos por placa
  static async findByPlaca(placa) {
    const [rows] = await db.execute(
      `
      SELECT 
        m.id_mantenimiento,
        m.placa,
        v.marca,
        v.linea,
        tm.nombre AS tipo_mantenimiento,
        m.observaciones,
        m.fecha_mantenimiento
      FROM mantenimiento m
      LEFT JOIN vehiculo v ON m.placa = v.placa
      LEFT JOIN tipomantenimiento tm ON m.id_tipo_mantenimiento = tm.id_tipo_mantenimiento
      WHERE m.placa = ?
      ORDER BY m.fecha_mantenimiento DESC
      `,
      [placa]
    );
    return rows;
  }

  // Crear nuevo registro de mantenimiento
  static async create(mantenimientoData) {
    const { placa, id_tipo_mantenimiento, observaciones, fecha_mantenimiento } =
      mantenimientoData;

    const [result] = await db.execute(
      `
      INSERT INTO mantenimiento (placa, id_tipo_mantenimiento, observaciones, fecha_mantenimiento)
      VALUES (?, ?, ?, ?)
      `,
      [placa, id_tipo_mantenimiento, observaciones, fecha_mantenimiento]
    );

    return result.insertId; // Retorna el ID generado automáticamente
  }

  //actualizar registro de mantenimiento existente
  static async update(id, mantenimientoData) {
    const { placa, id_tipo_mantenimiento, observaciones, fecha_mantenimiento } =
      mantenimientoData;

    const [result] = await db.execute(
      `
      UPDATE mantenimiento
      SET placa = ?, id_tipo_mantenimiento = ?, observaciones = ?, fecha_mantenimiento = ?
      WHERE id_mantenimiento = ?
      `,
      [placa, id_tipo_mantenimiento, observaciones, fecha_mantenimiento, id]
    );

    return result.affectedRows; // 1 si se actualizó correctamente
  }

  // Eliminar registro de mantenimiento por su ID
  static async delete(id) {
    const [result] = await db.execute(
      `DELETE FROM mantenimiento WHERE id_mantenimiento = ?`,
      [id]
    );
    return result.affectedRows; // 1 si se eliminó correctamente
  }
}


export default Mantenimiento;