import express from "express";
import validarToken from "../middlewares/validarToken.js";
import {
    getAllTipoDocumentoVehiculo,
    getTipoDocumentoVehiculoById,
    createTipoDocumentoVehiculo,
    updateTipoDocumentoVehiculo,
    deleteTipoDocumentoVehiculo
} from '../Controllers/tipoDocumentoVehiculoController.js';

const router = express.Router();

router.use(validarToken);

// Obtener todos los tipos de documento de vehículo
router.get('/listaTipoDocumentoVehiculo', getAllTipoDocumentoVehiculo);

// Obtener un tipo de documento de vehículo por ID
router.get('/buscarTipoDocumentoVehiculo/:id', getTipoDocumentoVehiculoById);

// Crear un nuevo tipo de documento de vehículo
router.post('/crearTipoDocumentoVehiculo', createTipoDocumentoVehiculo);

// Actualizar un tipo de documento de vehículo existente
router.put('/actualizarTipoDocumentoVehiculo/:id', updateTipoDocumentoVehiculo);

// Eliminar un tipo de documento de vehículo
router.delete('/eliminarTipoDocumentoVehiculo/:id', deleteTipoDocumentoVehiculo);

export default router;
