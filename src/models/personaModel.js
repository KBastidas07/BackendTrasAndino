import db from "../Conf/dbTasandino.js";

class Persona {
  // Obtiene todas las personas junto con sus roles
  static async findAll() {
    try {
      console.log("Ejecutando findAll en Persona...");
      const [personas] = await db.execute(`
        SELECT p.*, 
               GROUP_CONCAT(r.nombre SEPARATOR ', ') AS roles
        FROM Persona p
        LEFT JOIN RolPersona rp ON p.idPersona = rp.idPersona
        LEFT JOIN Rol r ON rp.idRol = r.idRol
        GROUP BY p.idPersona
        ORDER BY p.idPersona ASC
      `);
      console.log(`Personas encontradas: ${personas.length}`);
      return personas;
    } catch (error) {
      console.error("Error en findAll:", error.message);
      throw error;
    }
  }

  

 /*
  // Busca una persona por su ID
  static async findById(id) {
    try {
      const [personasId] = await db.execute(
        `
        SELECT p.*, GROUP_CONCAT(r.nombre SEPARATOR ', ') AS roles
        FROM Persona p
        LEFT JOIN RolPersona rp ON p.idPersona = rp.idPersona
        LEFT JOIN Rol r ON rp.idRol = r.idRol
        WHERE p.idPersona = ?
        GROUP BY p.idPersona
      `,
        [id]
      );
      return personasId[0];
    } catch (error) {
      throw error;
    }
  }
    */

  // Busca una persona por su número de cédula
  static async findByCedula(cedula) {
    try {
      const [PersonasCedula] = await db.execute(
        `
        SELECT p.*, GROUP_CONCAT(r.nombre SEPARATOR ', ') AS roles
        FROM Persona p
        LEFT JOIN RolPersona rp ON p.idPersona = rp.idPersona
        LEFT JOIN Rol r ON rp.idRol = r.idRol
        WHERE p.cedula = ?
        GROUP BY p.idPersona
      `,
        [cedula]
      );
      return PersonasCedula[0];
    } catch (error) {
      throw error;
    }
  }

  // Crea una nueva persona y asigna su rol
  static async create(personaData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insertar persona
      const idPersona = await this.insertPersona(personaData, connection);

      // Si viene un rol (por nombre), buscar su idRol
      if (personaData.roles) {
        const [rol] = await connection.execute(
          "SELECT idRol FROM Rol WHERE nombre = ?",
          [personaData.roles]
        );

        if (rol.length > 0) {
          // Insertar en RolPersona
          await connection.execute(
            `
          INSERT INTO RolPersona (idPersona, idRol)
          VALUES (?, ?)
        `,
            [idPersona, rol[0].idRol]
          );
        } else {
          throw new Error(
            `El rol '${personaData.roles}' no existe en la tabla Rol`
          );
        }
      }

      await connection.commit();

      // Devolver persona creada con su rol
      const persona = await this.findByIdWithRoles(idPersona, connection);

      return persona;
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

  // Actualiza los datos de una persona
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

  // Actualiza una persona y sus roles (si se proporciona) dentro de una transacción
  static async updateWithRoles(id, personaData) {
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      const { roles, ...otherData } = personaData;

      // Obtener datos actuales
      const personaActual = await this.findById(id);

      // eliminar la cédula de otherData
      if (otherData.cedula && otherData.cedula === personaActual.cedula) {
        delete otherData.cedula;
      }

      const cleanData = Object.fromEntries(
        Object.entries(otherData).filter(([_, v]) => v !== undefined)
      );

      const [updateResult] = await connection.query(
        "UPDATE Persona SET ? WHERE idPersona = ?",
        [cleanData, id]
      );

      if (updateResult.affectedRows === 0) {
        throw new Error("Persona no encontrada");
      }

      if (roles) {
        // Obtener idRol por nombre
        const [rolRows] = await connection.execute(
          "SELECT idRol FROM Rol WHERE nombre = ?",
          [roles]
        );

        if (rolRows.length === 0) {
          throw new Error(`El rol '${roles}' no existe en la tabla Rol`);
        }

        const idRol = rolRows[0].idRol;

        // Reemplazar relaciones existentes en RolPersona
        await connection.execute("DELETE FROM RolPersona WHERE idPersona = ?", [
          id,
        ]);

        await connection.execute(
          "INSERT INTO RolPersona (idPersona, idRol) VALUES (?, ?)",
          [id, idRol]
        );
      }

      await connection.commit();

      // Devolver persona actualizada con roles
      const persona = await this.findByIdWithRoles(id, connection);
      return persona;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      if (error && error.code === "ER_DUP_ENTRY") {
        const dup = new Error("Ya existe una persona con esta cédula");
        dup.statusCode = 409;
        dup.isOperational = true;
        throw dup;
      }
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // Elimina una persona
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

  // Busca todas las personas por nombre de rol
  static async findByRol(nombreRol) {
    try {
      const [personasRol] = await db.execute(
        `
        SELECT p.*, r.nombre AS rol
        FROM Persona p
        JOIN RolPersona rp ON p.idPersona = rp.idPersona
        JOIN Rol r ON rp.idRol = r.idRol
        WHERE r.nombre = ?
        ORDER BY p.idPersona DESC
      `,
        [nombreRol]
      );
      return personasRol;
    } catch (error) {
      throw error;
    }
  }

  // Crear una nueva persona con sus datos básicos
  static async insertPersona(personaData, connection) {
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
      personaData.fechaNacimiento || null,
    ]);

    return result.insertId;
  }

  // Obtener una persona con sus roles por ID
  static async findByIdWithRoles(idPersona, connection = db) {
    const [personas] = await connection.execute(
      `
      SELECT p.*, GROUP_CONCAT(r.nombre SEPARATOR ', ') AS roles
      FROM Persona p
      LEFT JOIN RolPersona rp ON p.idPersona = rp.idPersona
      LEFT JOIN Rol r ON rp.idRol = r.idRol
      WHERE p.idPersona = ?
      GROUP BY p.idPersona
    `,
      [idPersona]
    );

    return personas[0];
  }

  // Crear persona con transacción (método estático)
  static async createPersonaWithTransaction(personaData) {
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      // Insertar persona
      const idPersona = await this.insertPersona(personaData, connection);

      // Insertar rol si se proporciona
      if (personaData.roles) {
        const [rol] = await connection.execute(
          "SELECT idRol FROM Rol WHERE nombre = ?",
          [personaData.roles]
        );

        if (rol.length > 0) {
          await connection.execute(
            `INSERT INTO RolPersona (idPersona, idRol) VALUES (?, ?)`,
            [idPersona, rol[0].idRol]
          );
        } else {
          throw new Error(
            `El rol '${personaData.roles}' no existe en la tabla Rol`
          );
        }
      }

      await connection.commit();
      return idPersona;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      if (error && error.code === "ER_DUP_ENTRY") {
        const dup = new Error("Ya existe una persona con esta cédula");
        dup.statusCode = 409;
        dup.isOperational = true;
        throw dup;
      }
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

export default Persona;
