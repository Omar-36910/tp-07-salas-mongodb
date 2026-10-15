const { salasPermitidas, turnosPermitidos } = require("../middleware/reservas");

function crearControladorReservas(servicio) {
  return {
    mostrarInicio: (req, res) => {
      res.render("inicio", { titulo: "Inicio - Reserva de Salas" });
    },
    mostrarEstado: (req, res) => {
      res.json({
        servicio: "activo",
        reservas: servicio.obtenerCantidad(),
        solicitudId: res.locals.solicitudId,
      });
    },
    listar: (req, res) => {
      res.render("reservas/lista", {
        titulo: "Listado de Reservas",
        reservas: servicio.obtenerTodas(),
      });
    },
    formulario: (req, res) => {
      res.render("reservas/nueva", {
        titulo: "Nueva Reserva",
        error: null,
        valores: {},
        salasPermitidas,
        turnosPermitidos,
      });
    },
    detalle: (req, res) => {
      const id = parseInt(req.params.id, 10);
      const reserva = servicio.obtenerPorId(id);
      if (!reserva) {
        return res.status(404).render("no-encontrado", {
          titulo: "Página no encontrada",
          mensaje: "La reserva solicitada no existe.",
        });
      }
      res.render("reservas/detalle", {
        titulo: `Detalle de Reserva #${reserva.id}`,
        reserva,
      });
    },
    crear: (req, res) => {
      servicio.crear(req.reservaValidada);
      res.redirect("/reservas");
    },
  };
}

module.exports = crearControladorReservas;
