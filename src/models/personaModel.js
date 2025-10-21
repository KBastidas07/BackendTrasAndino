import db from "../Conf/dbTasandino.js";

class Persona {
  //  Obtiene todas las personas registradas en el sistema
  static async findAll() {
    try {
      console.log('🔍 Ejecutando findAll en Persona...');
      const [rows] = await db.execute(
        "SELECT * FROM Persona ORDER BY id_persona DESC"
      );
      console.log(`✅ Personas encontradas: ${rows.length}`);
      if (rows.length === 0) {
        console.log('⚠️ No se encontraron registros en la tabla Persona');
      }
      return rows;
    } catch (error) {
      console.error('❌ Error en findAll:', error.message);
      throw error;
    }
  }

  //Busca una persona por su ID
  static async findById(id) {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM Persona WHERE id_persona = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  //Busca una persona por su número de cédula
  static async findByCedula(cedula) {
    try {
      const [rows] = await db.execute("SELECT * FROM Persona WHERE cedula = ?", [
        cedula,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  //Crea una nueva persona en el sistema
  static async create(personaData) {
    try {
      const query = `
                INSERT INTO Persona (
                    nombre_completo,
                    apellido_completo,
                    direccion,
                    cedula,
                    telefono,
                    correo,
                    fecha_cumpleaños,
                    rol
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
      // Validar campos requeridos
      if (!personaData.nombre_completo || !personaData.apellido_completo || !personaData.cedula) {
        throw new Error('Los campos nombre_completo, apellido_completo y cedula son obligatorios');
      }

      const values = [
        personaData.nombre_completo,
        personaData.apellido_completo,
        personaData.direccion || null,
        personaData.cedula,
        personaData.telefono || null,
        personaData.correo || null,
        personaData.fecha_cumpleaños || null,
        personaData.rol || "EMPLEADO",
      ];

      const [result] = await db.execute(query, values);
      
      if (result.affectedRows === 0) {
        throw new Error('No se pudo crear la persona');
      }
      
      // Retornar el ID de la persona creada y los datos insertados
      return {
        id_persona: result.insertId,
        ...personaData
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Ya existe una persona con esta cédula');
      }
      throw error;
    }
  }

  //Actualiza los datos de una persona existente
  static async update(id, personaData) {
    try {
      // Eliminamos campos no permitidos o undefined
      const cleanData = Object.fromEntries(
        Object.entries(personaData).filter(([_, v]) => v !== undefined)
      );

      const [result] = await db.query(
        "UPDATE Persona SET ? WHERE id_persona = ?",
        [cleanData, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  //Elimina una persona del sistema
  static async delete(id) {
    try {
      const [result] = await db.query(
        "DELETE FROM Persona WHERE id_persona = ?",
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  //Busca personas por su rol (ASOCIADO, CONDUCTOR, EMPLEADO)
  static async findByRol(rol) {
        try {
            const [rows] = await db.execute('SELECT * FROM Persona WHERE rol = ? ORDER BY id_persona DESC', [rol]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}
export default Persona;