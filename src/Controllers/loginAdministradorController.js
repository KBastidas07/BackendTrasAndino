import { errorTypes } from "../middlewares/errorHandler.js";
import { ValidacionLogin } from "../Utils/Validaciones.js";
import jwt from "jsonwebtoken";
import tokenBlacklist from "../middlewares/tokenBlacklist.js";

export const loginAdministrador = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validar campos
    ValidacionLogin.validarUsername(username);
    ValidacionLogin.validarPassword(password);

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminUsername || !adminPassword || !jwtSecret) {
      throw errorTypes.ServerError("Variables de entorno no configuradas");
    }

    // Verificar credenciales
    if (username !== adminUsername || password !== adminPassword) {
      throw errorTypes.AuthenticationError("Credenciales inválidas");
    }

    // Crear token
    const token = jwt.sign({ username }, jwtSecret, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      status: "success",
      message: "Login exitoso",
      token,
    });
  } catch (error) {
    console.error("Error en loginAdministrador:", error.message);
    next(error);
  }
}

export const logoutAdministrador =async (req, res, next)=> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw errorTypes.AuthenticationError("Token no proporcionado");
    }

    const token = authHeader.split(" ")[1];

    // Agregar a la blacklist
    tokenBlacklist.add(token);

    return res.status(200).json({
      status: "success",
      message: "Sesión cerrada exitosamente",
    });
  } catch (error) {
    console.error("Error en logoutAdministrador:", error.message);
    next(error);
  }
}