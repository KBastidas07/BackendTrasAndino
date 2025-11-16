import express from 'express';
import database from './Conf/dbTasandino.js';
import personaRoutes from './routes/personaRoutes.js';
import vehiculoRoutes from './routes/vehiculoRoutes.js';
import conductorVehiculoRoutes from './routes/conductorVehiculoRoutes.js';
import mantenimientoRoutes from './routes/mantenimientoRoutes.js';
import tipoMantenimientoRoutes from './routes/tipoMantenimientoRoutes.js';
import documentoVehiculoRoutes from './routes/documentoVehiculoRoutes.js';
import tipoDocumentoVehiculoRoutes from './routes/tipoDocumentoVehiculoRoutes.js';
import empresaExternaRoutes from './routes/empresaExternaRoutes.js';
import loginAdministradorRoutes from './routes/loginAdministradorRoutes.js';
import { handleError, notFound } from './middlewares/errorHandler.js';
import dotenv from "dotenv";

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();

//Middleware para leer JSON
app.use(express.json());

//Ruta de prueba
app.get("/api/testdb", async (req, res) => {
  try {
    const [rows] = await database.query("SELECT 1 + 1 AS result");
    res.json({
      status: "success",
      message: "Conexión a la base de datos exitosa",
      results: rows,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error en la consulta a la base de datos",
      error: error.message,
    });
  }
});




//Configuración de rutas
app.use('/api/personas', personaRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/conductorvehiculos', conductorVehiculoRoutes);
app.use('/api/mantenimientos', mantenimientoRoutes);
app.use('/api/tipomantenimientos', tipoMantenimientoRoutes);
app.use('/api/documentovehiculos', documentoVehiculoRoutes);
app.use('/api/tipodocumentovehiculos', tipoDocumentoVehiculoRoutes);
app.use('/api/empresasexternas', empresaExternaRoutes);
app.use('/api/loginadministrador', loginAdministradorRoutes);


//Manejo de rutas no encontradas
app.use(notFound);

//Manejo de errores
app.use(handleError);

export default app;