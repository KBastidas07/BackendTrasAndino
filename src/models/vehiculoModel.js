import db from "../Conf/dbTasandino.js";

class Vehiculo {
  // Obtiene todas los vehiculos registrados en el sistema
  static async findAll() {
    try {
      console.log("🔍 Ejecutando findAll en Vehiculo...");
      const [rows] = await db.execute(
        `SELECT v.*, p.nombre_completo, p.apellido_completo
         FROM vehiculo v
         LEFT JOIN persona p ON v.id_persona = p.id_persona
         ORDER BY v.placa DESC`
      );
      console.log(`✅ Vehiculos encontrados: ${rows.length}`);
      if (rows.length === 0) {
        console.log("⚠️ No se encontraron registros en la tabla Vehiculo");
      }
      return rows;
    } catch (error) {
      console.error("❌ Error en findAll:", error.message);
      throw error;
    }
  }

  //Obtiene un vehiculo por su placa
  static async findByPlaca(placa) {
  try {
    const [rows] = await db.execute(
      `SELECT v.*, p.nombre_completo, p.apellido_completo, p.rol
       FROM vehiculo v
       JOIN persona p ON v.id_persona = p.id_persona
       WHERE v.placa = ?`,
      [placa]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
}

  //Crea un nuevo vehiculo en el sistema
  static async create(vehiculoData) {
  try {
    // Validar campos requeridos
    if (!vehiculoData.placa || !vehiculoData.id_persona) {
      throw new Error("Los campos placa y id_persona son obligatorios");
    }

    // 1️⃣ Verificar que la persona exista y sea ASOCIADO
    const [personaRows] = await db.execute(
      "SELECT rol FROM persona WHERE id_persona = ?",
      [vehiculoData.id_persona]
    );

    if (personaRows.length === 0) {
      throw new Error("La persona no existe");
    }

    const rolPersona = personaRows[0].rol;
    if (rolPersona !== "ASOCIADO") {
      throw new Error("Solo las personas con rol ASOCIADO pueden registrar un vehículo");
    }

    // 2️⃣ Verificar que el asociado no tenga ya un vehículo registrado
    const [existente] = await db.execute(
      "SELECT placa FROM vehiculo WHERE id_persona = ?",
      [vehiculoData.id_persona]
    );

    if (existente.length > 0) {
      throw new Error("Este asociado ya tiene un vehículo registrado");
    }

    // 3️⃣ Insertar el nuevo vehículo
    const query = `
      INSERT INTO vehiculo (
        placa,
        id_persona,
        motor,
        chasis,
        modelo,
        marca,
        linea,
        combustible,
        cilindraje,
        movil
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      vehiculoData.placa,
      vehiculoData.id_persona,
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

    // 4️⃣ Retornar los datos creados
    return {
      placa: vehiculoData.placa,
      ...vehiculoData,
    };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Ya existe un vehículo con esta placa");
    }
    throw error;
  }
}

  //Actualiza los datos de un vehiculo existente
  static async update(placa, vehiculoData) {
    try {
      // Eliminamos campos no permitidos o undefined
      const cleanData = Object.fromEntries(
        Object.entries(vehiculoData).filter(([_, v]) => v !== undefined)
      );

      const [result] = await db.query("UPDATE vehiculo SET ? WHERE placa = ?", [
        cleanData,
        placa,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //Elimina un vehiculo del sistema
  static async delete(placa) {
    try {
      const [result] = await db.execute("DELETE FROM vehiculo WHERE placa = ?", [
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
