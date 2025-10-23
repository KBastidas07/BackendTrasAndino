import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configurar rutas para que dotenv encuentre el archivo .env correctamente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//// Cargar variables de entorno desde .env
dotenv.config({ path: join(__dirname, '..', '..', '.env'), quiet: true });




// Crear un pool de conexiones usando la interfaz promise

const database = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
   
});

// Probar la conexión a la base de datos
const testConnection = async () => {
    try {
        const connection = await database.getConnection();
        console.log('Conexión a la base de datos establecida correctamente');
        connection.release();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};

// Ejecutar la comprobación una vez al importar este módulo
testConnection();

export default database;