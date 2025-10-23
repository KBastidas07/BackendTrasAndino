import db from "../Conf/dbTasandino.js";

class Rol {
  // Enums de roles y tipos de roles (reflejan la estructura de la BD)
  static ROLES = {
    ASOCIADO: "Asociado",
    CONDUCTOR: "Conductor",
    EMPLEADO: "Empleado",
  };

  static TIPO_ROL = {
    INTERNO: "Interno",
    EXTERNO: "Externo",
  };

  // Obtener todos los roles
   static async findAll() {
        const [roles] = await db.execute('SELECT * FROM Rol ORDER BY idRol');
        return roles;
    }

    // Buscar rol por ID
    static async findById(idRol) {
        const [roles] = await db.execute('SELECT * FROM Rol WHERE idRol = ?', [idRol]);
        return roles[0];
    }

    // Buscar rol por nombre
    static async findByNombre(nombre) {
        const [roles] = await db.execute('SELECT * FROM Rol WHERE nombre = ?', [nombre]);
        return roles[0];
    }

    // Verificar si un rol existe por ID
    static async exists(idRol) {
        const [roles] = await db.execute('SELECT 1 FROM Rol WHERE idRol = ?', [idRol]);
        return roles.length > 0;
    }

    // Validar si un nombre de rol es válido
    static isRolValido(nombreRol) {
        return Object.values(this.ROLES).includes(nombreRol);
    }

    // Validar si un tipo de rol es válido
    static isTipoRolValido(tipoRol) {
        return Object.values(this.TIPO_ROL).includes(tipoRol);
    }
}

export default Rol;
