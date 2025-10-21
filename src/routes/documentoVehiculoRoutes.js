import express from "express";
import {
    getAllDocumentoVehiculo,
    //getDocumentoVehiculoById,
    getDocumentosByPlaca,
    createDocumentoVehiculo,
    updateDocumentoVehiculo,
    deleteDocumentoVehiculo
} from '../Controllers/documentoVehiculoController.js';

const router = express.Router();

// Ruta para obtener todos los documentos de vehículos
router.get('/listaDocumentoVehiculo', getAllDocumentoVehiculo);

// Ruta para obtener un documento de vehículo por ID
//router.get('/buscarDocumentoVehiculo/:id', getDocumentoVehiculoById);

//Ruta para obtener todos los documentos de vehículos por medio de la placa
router.get('/buscarDocumentoVehiculoPorPlaca/:placa', getDocumentosByPlaca);

//Ruta para crear un nuevo documento de vehículo
router.post('/crearDocumentoVehiculo', createDocumentoVehiculo);

// Ruta para actualizar un documento de vehículo existente
router.put('/actualizarDocumentoVehiculo/:id', updateDocumentoVehiculo);

// Ruta para eliminar un documento de vehículo      
router.delete('/eliminarDocumentoVehiculo/:id', deleteDocumentoVehiculo);

export default router;