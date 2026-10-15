let contadorSolicitudes = 0;

function identificarSolicitud(req, res, next) {
  contadorSolicitudes++;
  res.locals.solicitudId = `BIB-${String(contadorSolicitudes).padStart(4, "0")}`;
  next();
}

function medirDuracion(req, res, next) {
  const tiempoInicio = Date.now();
  res.on("finish", () => {
    const duracion = Date.now() - tiempoInicio;
    console.log(
      `[${res.locals.solicitudId}] ${req.method} ${req.originalUrl} - Estado: ${res.statusCode} - Duración: ${duracion}ms`,
    );
  });
  next();
}

module.exports = { identificarSolicitud, medirDuracion };
