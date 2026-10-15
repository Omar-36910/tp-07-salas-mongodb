const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

function validarReserva(req, res, next) {
  let { estudiante, email, sala, fecha, turno, personas } = req.body;

  estudiante = estudiante ? estudiante.trim() : "";
  email = email ? email.trim() : "";
  sala = sala ? sala.trim() : "";
  fecha = fecha ? fecha.trim() : "";
  turno = turno ? turno.trim() : "";
  const numPersonas = Number(personas);

  const valores = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas: req.body.personas,
  };
  const datosVistaError = {
    titulo: "Nueva Reserva",
    valores,
    salasPermitidas,
    turnosPermitidos,
  };

  if (
    !estudiante ||
    !email ||
    !sala ||
    !fecha ||
    !turno ||
    !req.body.personas
  ) {
    return res.status(400).render("reservas/nueva", {
      ...datosVistaError,
      error: "Todos los campos son obligatorios.",
    });
  }
  if (!email.includes("@")) {
    return res.status(400).render("reservas/nueva", {
      ...datosVistaError,
      error: "El correo debe incluir '@'.",
    });
  }
  if (!salasPermitidas.includes(sala) || !turnosPermitidos.includes(turno)) {
    return res.status(400).render("reservas/nueva", {
      ...datosVistaError,
      error: "Sala o turno no válidos.",
    });
  }
  if (!Number.isInteger(numPersonas) || numPersonas < 1 || numPersonas > 6) {
    return res.status(400).render("reservas/nueva", {
      ...datosVistaError,
      error: "Personas debe ser entero entre 1 y 6.",
    });
  }

  req.reservaValidada = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas: numPersonas,
  };
  next();
}

module.exports = {
  prepararAreaReservas,
  validarReserva,
  salasPermitidas,
  turnosPermitidos,
};
