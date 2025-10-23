import db from "../Conf/dbTasandino.js";

class RolPersona {
    // Obtener todos los registros de RolPersona
    static async findAll() {
        const [rows] = await db.execute(`
            SELECT rp.idRolPersona, rp.idPersona, rp.idRol, r.nombre AS nombreRol
            FROM RolPersona rp
            JOIN Rol r ON rp.idRol = r.idRol
            ORDER BY rp.idRolPersona
        `);
        return rows;
    }

    // Crear un registro de RolPersona
    static async create(idPersona, idRol, connection = db) {
        const [result] = await connection.execute(
            "INSERT INTO RolPersona (idPersona, idRol) VALUES (?, ?)",
            [idPersona, idRol]
        );
        return result.insertId;
    }

    // Eliminar roles de una persona
    static async deleteByPersona(idPersona) {
        const [result] = await db.execute(
            "DELETE FROM RolPersona WHERE idPersona = ?",
            [idPersona]
        );
        return result.affectedRows;
    }

    // Obtener roles de una persona
    static async findByPersona(idPersona) {
        const [rows] = await db.execute(`
            SELECT rp.idRolPersona, r.nombre AS nombreRol
            FROM RolPersona rp
            JOIN Rol r ON rp.idRol = r.idRol
            WHERE rp.idPersona = ?
        `, [idPersona]);
        return rows;
    }
}

export default RolPersona;

