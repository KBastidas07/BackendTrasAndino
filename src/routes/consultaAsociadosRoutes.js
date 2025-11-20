import express from "express";
import {
    buscarInfoAsociado

} from '../Controllers/consultaAsociadoController.js';


const router = express.Router();

router.get("/buscarInfo/:placa/:cedula", buscarInfoAsociado);

export default router;