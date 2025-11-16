import db from "../Conf/dbTasandino.js";

class ConductorVehiculo {
  // Obtener todos los registros
  static async findAll() {
    try {
      const [conductorVehiculo] = await db.execute(`
      SELECT cv.*, 
             p.nombreCompleto AS nombreCompleto, 
             p.apellidoCompleto AS apellidoCompleto,
             v.placa,
             v.marca,
             v.linea,
             v.modelo,
             r.nombre AS rol
      FROM ConductorVehiculo cv
      LEFT JOIN Persona p ON cv.idPersona = p.idPersona
      LEFT JOIN Vehiculo v ON cv.idVehiculo = v.idVehiculo
      LEFT JOIN RolPersona rp ON rp.idPersona = p.idPersona
      LEFT JOIN Rol r ON r.idRol = rp.idRol
      ORDER BY cv.idConductorVehiculo DESC
    `);
      return conductorVehiculo;
    } catch (error) {
      console.error("Error en findAll:", error);
      throw error;
    }
  }

  // Obtener un registro por su ID
  static async findById(id) {
    const [conductorVehiculo] = await db.execute(
      `
    SELECT 
      cv.*, 
      p.nombreCompleto,
      p.cedula,
      v.placa
    FROM ConductorVehiculo cv
    INNER JOIN Persona p ON cv.idPersona = p.idPersona
    INNER JOIN Vehiculo v ON cv.idVehiculo = v.idVehiculo
    WHERE cv.idConductorVehiculo = ?
    `,
      [id]
    );
    return conductorVehiculo[0];
  }

  // Crear un nuevo registro
  static async create(data) {
    const {
      idPersona,
      idVehiculo,
      jornada,
      estadoConductor,
      fechaInicio,
      fechaFin,
    } = data;

    // Validar campos obligatorios
    if (!idPersona || !idVehiculo || !jornada || !fechaInicio) {
      throw new Error(
        "Los campos idPersona, idVehiculo, jornada y fechaInicio son obligatorios"
      );
    }

    // Verificar que la persona existe
    const [personaRows] = await db.execute(
      "SELECT idPersona FROM Persona WHERE idPersona = ?",
      [idPersona]
    );
    if (personaRows.length === 0) throw new Error("La persona no existe");

    // Verificar que el vehículo existe
    const [vehiculoRows] = await db.execute(
      "SELECT idVehiculo FROM Vehiculo WHERE idVehiculo = ?",
      [idVehiculo]
    );
    if (vehiculoRows.length === 0) throw new Error("El vehículo no existe");

    // Insertar el registro
    const [result] = await db.execute(
      `INSERT INTO ConductorVehiculo 
        (idPersona, idVehiculo, jornada, estadoConductor, fechaInicio, fechaFin)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        idPersona,
        idVehiculo,
        jornada,
        estadoConductor || "ACTIVO",
        fechaInicio,
        fechaFin || null,
      ]
    );

    return {
      idConductorVehiculo: result.insertId,
      ...data,
    };
  }

  // Actualizar registro existente
  static async update(id, data) {
    const { jornada, estadoConductor, fechaInicio, fechaFin } = data;

    // Filtrar solo los campos que vienen
    const updates = [];
    const values = [];
    if (jornada) {
      updates.push("jornada = ?");
      values.push(jornada);
    }
    if (estadoConductor) {
      updates.push("estadoConductor = ?");
      values.push(estadoConductor);
    }
    if (fechaInicio) {
      updates.push("fechaInicio = ?");
      values.push(fechaInicio);
    }
    if (fechaFin) {
      updates.push("fechaFin = ?");
      values.push(fechaFin);
    }

    if (updates.length === 0)
      throw new Error("No se proporcionaron campos para actualizar");

    const [result] = await db.execute(
      `UPDATE ConductorVehiculo SET ${updates.join(
        ", "
      )} WHERE idConductorVehiculo = ?`,
      [...values, id]
    );

    return result.affectedRows;
  }

  // Eliminar registro
  static async delete(id) {
    const [result] = await db.execute(
      "DELETE FROM ConductorVehiculo WHERE idConductorVehiculo = ?",
      [id]
    );
    return result.affectedRows;
  }
}

export default ConductorVehiculo;
