import jwt from "jsonwebtoken";
import { errorTypes } from "./errorHandler.js";

const validarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw errorTypes.AuthenticationError("Token no proporcionado");
  }

  const token = authHeader.split(" ")[1]; // Formato: Bearer token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      throw errorTypes.AuthenticationError("Token inválido o expirado");
    }

    req.user = user; // Guardamos los datos del usuario

    next();
  });
};

export default validarToken;
