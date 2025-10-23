import db from "../Conf/dbTasandino.js";

class Vehiculo {
  // Obtener todos los vehículos
  static async findAll() {
    try {
      const [rows] = await db.execute(`
        SELECT v.*, p.nombreCompleto, p.apellidoCompleto
        FROM Vehiculo v
        LEFT JOIN Persona p ON v.idPersona = p.idPersona
        ORDER BY v.idVehiculo ASC
      `);
      return rows;
    } catch (error) {
      console.error("Error en findAll:", error.message);
      throw error;
    }
  }

  // Obtener vehículo por placa
  static async findByPlaca(placa) {
    try {
      const [rows] = await db.execute(
        `SELECT v.*, p.nombreCompleto, p.apellidoCompleto
         FROM Vehiculo v
         LEFT JOIN Persona p ON v.idPersona = p.idPersona
         WHERE v.placa = ?`,
        [placa]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Crear un vehículo
  static async create(vehiculoData) {
    try {
      if (!vehiculoData.placa) {
        throw new Error("El campo placa es obligatorio");
      }

      const query = `
        INSERT INTO Vehiculo (
          placa, idPersona, motor, chasis, modelo, marca, linea, combustible, cilindraje, movil
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        vehiculoData.placa,
        vehiculoData.idPersona || null,
        vehiculoData.motor || null,
        vehiculoData.chasis || null,
        vehiculoData.modelo || null,
        vehiculoData.marca || null,
        vehiculoData.linea || null,
        vehiculoData.combustible || null,
        vehiculoData.cilindraje || null,
        vehiculoData.movil || null,
      ];

      const [result] = await db.execute(query, values);

      if (result.affectedRows === 0) {
        throw new Error("No se pudo crear el vehículo");
      }

      return {
        idVehiculo: result.insertId,
        ...vehiculoData,
      };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("Ya existe un vehículo con esta placa");
      }
      throw error;
    }
  }

  // Actualizar vehículo por placa
static async update(placa, vehiculoData) {
  try {
    const cleanData = Object.fromEntries(
      Object.entries(vehiculoData).filter(([_, v]) => v !== undefined)
    );

    const [result] = await db.query("UPDATE Vehiculo SET ? WHERE placa = ?", [
      cleanData,
      placa,
    ]);

    if (result.affectedRows === 0) {
      throw new Error("No se encontró el vehículo a actualizar");
    }

    return result;
  } catch (error) {
    throw error;
  }
}

// Eliminar vehículo por placa
static async delete(placa) {
  try {
    const [result] = await db.execute("DELETE FROM Vehiculo WHERE placa = ?", [
      placa,
    ]);

    if (result.affectedRows === 0) {
      throw new Error("No se encontró el vehículo a eliminar");
    }

    return result;
  } catch (error) {
    throw error;
  }
}
}

export default Vehiculo;
