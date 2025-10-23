import db from "../Conf/dbTasandino.js";

class Persona {

  // 🔹 Obtiene todas las personas junto con sus roles
  static async findAll() {
    try {
      console.log("🔍 Ejecutando findAll en Persona...");
      const [rows] = await db.execute(`
        SELECT p.*, 
               GROUP_CONCAT(r.nombre SEPARATOR ', ') AS roles
        FROM Persona p
        LEFT JOIN RolPersona rp ON p.idPersona = rp.idPersona
        LEFT JOIN Rol r ON rp.idRol = r.idRol
        GROUP BY p.idPersona
        ORDER BY p.idPersona DESC
      `);
      console.log(`✅ Personas encontradas: ${rows.length}`);
      return rows;
    } catch (error) {
      console.error("❌ Error en findAll:", error.message);
      throw error;
    }
  }

  // 🔹 Busca una persona por su ID
  static async findById(id) {
    try {
      const [rows] = await db.execute(`
        SELECT p.*, GROUP_CONCAT(r.nombre SEPARATOR ', ') AS roles
        FROM Persona p
        LEFT JOIN RolPersona rp ON p.idPersona = rp.idPersona
        LEFT JOIN Rol r ON rp.idRol = r.idRol
        WHERE p.idPersona = ?
        GROUP BY p.idPersona
      `, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // 🔹 Busca una persona por su número de cédula
  static async findByCedula(cedula) {
    try {
      const [rows] = await db.execute(`
        SELECT p.*, GROUP_CONCAT(r.nombre SEPARATOR ', ') AS roles
        FROM Persona p
        LEFT JOIN RolPersona rp ON p.idPersona = rp.idPersona
        LEFT JOIN Rol r ON rp.idRol = r.idRol
        WHERE p.cedula = ?
        GROUP BY p.idPersona
      `, [cedula]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // 🔹 Crea una nueva persona y asigna su rol
  static async create(personaData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

         // 🔹 Insertar persona
    const insertPersonaQuery = `
      INSERT INTO Persona (
        nombreCompleto,
        apellidoCompleto,
        direccion,
        cedula,
        telefono,
        correo,
        fechaNacimiento
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute(insertPersonaQuery, [
      personaData.nombreCompleto,
      personaData.apellidoCompleto,
      personaData.direccion || null,
      personaData.cedula,
      personaData.telefono || null,
      personaData.correo || null,
      personaData.fechaNacimiento || null
    ]);

    const idPersona = result.insertId;

    // 🔹 Si viene un rol (por nombre), buscar su idRol
    if (personaData.roles) {
      const [rol] = await connection.execute(
        "SELECT idRol FROM Rol WHERE nombre = ?",
        [personaData.roles]
      );

      if (rol.length > 0) {
        // Insertar en RolPersona
        await connection.execute(`
          INSERT INTO RolPersona (idPersona, idRol)
          VALUES (?, ?)
        `, [idPersona, rol[0].idRol]);
      } else {
        throw new Error(`El rol '${personaData.roles}' no existe en la tabla Rol`);
      }
    }

    await connection.commit();

    // 🔹 Devolver persona creada con su rol
    const [persona] = await connection.execute(`
      SELECT p.*, GROUP_CONCAT(r.nombre SEPARATOR ', ') AS roles
      FROM Persona p
      LEFT JOIN RolPersona rp ON p.idPersona = rp.idPersona
      LEFT JOIN Rol r ON rp.idRol = r.idRol
      WHERE p.idPersona = ?
      GROUP BY p.idPersona
    `, [idPersona]);

    return persona[0];

  } catch (error) {
    await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Ya existe una persona con esta cédula");
    }
    throw error;
  } finally {
    connection.release();
  }
}

  // 🔹 Actualiza los datos de una persona
  static async update(id, personaData) {
    try {
      const cleanData = Object.fromEntries(
        Object.entries(personaData).filter(([_, v]) => v !== undefined)
      );

      const [result] = await db.query(
        "UPDATE Persona SET ? WHERE idPersona = ?",
        [cleanData, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 🔹 Elimina una persona
  static async delete(id) {
    try {
      const [result] = await db.query(
        "DELETE FROM Persona WHERE idPersona = ?",
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 🔹 Busca todas las personas por nombre de rol
  static async findByRol(nombreRol) {
    try {
      const [rows] = await db.execute(`
        SELECT p.*, r.nombre AS rol
        FROM Persona p
        JOIN RolPersona rp ON p.idPersona = rp.idPersona
        JOIN Rol r ON rp.idRol = r.idRol
        WHERE r.nombre = ?
        ORDER BY p.idPersona DESC
      `, [nombreRol]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // 🔹 Actualiza los roles de una persona (elimina los antiguos y asigna nuevos)
  static async updateRoles(idPersona, roles) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      await connection.execute("DELETE FROM RolPersona WHERE idPersona = ?", [idPersona]);

      for (const idRol of roles) {
        await connection.execute(
          "INSERT INTO RolPersona (idPersona, idRol) VALUES (?, ?)",
          [idPersona, idRol]
        );
      }

      await connection.commit();
      return { message: "Roles actualizados correctamente" };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default Persona;
