import jwt from "jsonwebtoken";
import { errorTypes } from "./errorHandler.js";
import tokenBlacklist from "./tokenBlacklist.js";

const validarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw errorTypes.AuthenticationError("Token no proporcionado");
  }

  const token = authHeader.split(" ")[1];

  // Verificar si el token está en blacklist
  if (tokenBlacklist.has(token)) {
    throw errorTypes.AuthenticationError("Token inválido. Inicie sesión nuevamente.");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      throw errorTypes.AuthenticationError("Token inválido o expirado");
    }

    req.user = user;
    next();
  });
};

export default validarToken;
