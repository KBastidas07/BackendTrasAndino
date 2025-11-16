import express from "express";
import { loginAdministrador, logoutAdministrador } from "../Controllers/loginAdministradorController.js";

const router = express.Router();

// Ruta para iniciar sesión
router.post("/login", loginAdministrador);

// Ruta para cerrar sesión
router.post("/logout", logoutAdministrador);

export default router;