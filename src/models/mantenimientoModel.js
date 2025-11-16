import db from "../Conf/dbTasandino.js";

class Mantenimiento {
  // Obtener todos los registros de mantenimiento
  static async findAll() {
    const [mantenimientos] = await db.execute(`
    SELECT 
      m.idMantenimiento,
      v.placa,
      v.marca,
      v.linea,
      tm.nombre AS tipoMantenimiento,
      ee.NombreEncargado AS empresaExterna,
      m.observaciones,
      m.fechaMantenimiento
    FROM mantenimiento m
    LEFT JOIN vehiculo v ON m.idVehiculo = v.idVehiculo
    LEFT JOIN tipomantenimiento tm ON m.idTipoMantenimiento = tm.idTipoMantenimiento
    LEFT JOIN empresaexterna ee ON m.idEmpresaExterna = ee.idEmpresaExterna
    ORDER BY m.fechaMantenimiento ASC
  `);
    return mantenimientos;
  }

  // Buscar mantenimientos por placa
  static async findByPlaca(placa) {
    const [mantenimientosPlaca] = await db.execute(
      `SELECT 
       m.idMantenimiento,
       v.placa,
       v.marca,
       v.linea,
       tm.nombre AS tipoMantenimiento,
       m.observaciones,
       m.fechaMantenimiento,
       m.idEmpresaExterna
     FROM Mantenimiento m
     JOIN Vehiculo v ON m.idVehiculo = v.idVehiculo
     JOIN tipoMantenimiento tm ON m.idTipoMantenimiento = tm.idTipoMantenimiento
     WHERE v.placa = ?
     ORDER BY m.fechaMantenimiento DESC`,
      [placa]
    );
    return mantenimientosPlaca;
  }

  // Crear nuevo registro de mantenimiento
  static async create(mantenimientoData) {
    const {
      idTipoMantenimiento,
      idVehiculo,
      idEmpresaExterna,
      observaciones,
      fechaMantenimiento,
    } = mantenimientoData;

    const [result] = await db.execute(
      `
      INSERT INTO mantenimiento (idVehiculo, idTipoMantenimiento, idEmpresaExterna, observaciones, fechaMantenimiento)
      VALUES (?, ?, ?, ?,?)
    `,
      [
        idVehiculo,
        idTipoMantenimiento,
        idEmpresaExterna,
        observaciones,
        fechaMantenimiento,
      ]
    );

    return result.insertId; // Retorna el ID generado automáticamente
  }

  // Actualizar registro de mantenimiento existente
  static async update(id, mantenimientoData) {
    const {
      idVehiculo,
      idTipoMantenimiento,
      idEmpresaExterna,
      observaciones,
      fechaMantenimiento,
    } = mantenimientoData;

    const [result] = await db.execute(
      `
      UPDATE mantenimiento
      SET idVehiculo = ?, idTipoMantenimiento = ?, idEmpresaExterna = ?, observaciones = ?, fechaMantenimiento = ?
      WHERE idMantenimiento = ?
    `,
      [
        idVehiculo,
        idTipoMantenimiento,
        idEmpresaExterna,
        observaciones,
        fechaMantenimiento,
        id,
      ]
    );

    return result.affectedRows; // 1 si se actualizó correctamente
  }

  // Eliminar registro de mantenimiento por su ID
  static async delete(id) {
    const [result] = await db.execute(
      `
      DELETE FROM mantenimiento WHERE idMantenimiento = ?
    `,
      [id]
    );
    return result.affectedRows; // 1 si se eliminó correctamente
  }
}

export default Mantenimiento;
