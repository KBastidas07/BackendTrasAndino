import db from "../Conf/dbTasandino.js";

class ConductorVehiculo {
  // Obtiene todos los registros de la tabla ConductorVehiculo
  // Incluye datos de la tabla Persona y Vehiculo

  static async findAll() {
    const [rows] = await db.execute(`
      SELECT cv.*, 
             p.nombre_completo, 
             p.apellido_completo,
             p.rol,
             v.marca,
             v.linea,
             v.modelo
      FROM conductorvehiculo cv
      LEFT JOIN persona p ON cv.id_persona = p.id_persona
      LEFT JOIN vehiculo v ON cv.placa = v.placa
      ORDER BY cv.id_conductor_vehiculo DESC
    `);
    // Devuelve todos los registros ordenados de más reciente a más antiguo
    return rows;
  }

  //Obtene un registro por su ID
  static async findById(id) {
    const [rows] = await db.execute(
      "SELECT * FROM conductorvehiculo WHERE id_conductor_vehiculo = ?",
      [id]
    );
    // Retorna solo el primer resultado encontrado
    return rows[0];
  }

  //Crea un nuevo registro en la tabla ConductorVehiculo
  static async create(conductorVehiculoData) {
    try {
      const { id_persona, placa, jornada, fecha_inicio, fecha_fin } =
        conductorVehiculoData;

      // Validar campos requeridos
      if (!id_persona || !placa || !jornada || !fecha_inicio) {
        throw new Error(
          "Los campos id_persona, placa, jornada y fecha_inicio son obligatorios"
        );
      }

      // Verificar que la persona existe y es un conductor
      const [personaRows] = await db.execute(
        "SELECT rol FROM persona WHERE id_persona = ?",
        [id_persona]
      );

      if (personaRows.length === 0) {
        throw new Error("La persona no existe");
      }

      if (personaRows[0].rol !== "CONDUCTOR") {
        throw new Error("La persona debe tener el rol de CONDUCTOR");
      }

      // Verificar que el vehículo existe
      const [vehiculoRows] = await db.execute(
        "SELECT placa FROM vehiculo WHERE placa = ?",
        [placa]
      );

      if (vehiculoRows.length === 0) {
        throw new Error("El vehículo no existe");
      }

      const [result] = await db.execute(
        `INSERT INTO conductorvehiculo 
          (id_persona, placa, jornada, fecha_inicio, fecha_fin)
         VALUES (?, ?, ?, ?, ?)`,
        [id_persona, placa, jornada, fecha_inicio, fecha_fin]
      );

      return {
        id: result.insertId,
        ...conductorVehiculoData,
      };
    } catch (error) {
      throw error;
    }
  }

  //Actualiza un registro existente en la tabla ConductorVehiculo
  static async update(id, conductorVehiculoData) {
    const { jornada, fecha_inicio, fecha_fin } = conductorVehiculoData;

    // Validar que los campos requeridos estén presentes
    if (!jornada && !fecha_inicio && !fecha_fin) {
      throw new Error("No se proporcionaron campos para actualizar");
    }

    // Ejecutar el UPDATE sin tocar id_persona ni placa
    const [result] = await db.execute(
      `UPDATE conductorvehiculo
     SET jornada = ?, fecha_inicio = ?, fecha_fin = ?
     WHERE id_conductor_vehiculo = ?`,
      [jornada, fecha_inicio, fecha_fin, id]
    );

    return result.affectedRows;
  }

  //Elimina un registro de la tabla ConductorVehiculo por su ID
  static async delete(id) {
    const [result] = await db.execute(
      "DELETE FROM conductorvehiculo WHERE id_conductor_vehiculo = ?",
      [id]
    );
    // Retorna la cantidad de filas eliminadas
    return result.affectedRows;
  }
}
export default ConductorVehiculo;
