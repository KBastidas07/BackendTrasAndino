//Clase para manejar errores en la aplicacion

export class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // Marcar el error como operacional para que el middleware lo trate como conocido
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

//Middleware para manejar errores de forma centralizada
export const handleError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // Respuesta detallada en desarrollo
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Respuesta simplificada en producción
    if (err.isOperational) {
      // Error conocido/operacional
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Error de programación o desconocido
      console.error("ERROR", err);
      res.status(500).json({
        status: "error",
        message: "Algo salió mal!",
      });
    }
  }
};

//Middleware para manejar rutas no encontradas
export const notFound = (req, res, next) => {
  const error = new ErrorHandler(
    404,
    `No se encontró la ruta: ${req.originalUrl}`
  );
  next(error);
};

//Errores comunes
export const errorTypes = {
  ValidationError: (message) => new ErrorHandler(400, message),
  AuthenticationError: (message) => new ErrorHandler(401, message),
  ForbiddenError: (message) => new ErrorHandler(403, message),
  NotFoundError: (message) => new ErrorHandler(404, message),
  ConflictError: (message) => new ErrorHandler(409, message),
  ServerError: (message) => new ErrorHandler(500, message),
};
