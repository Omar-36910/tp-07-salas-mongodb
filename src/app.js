const express = require("express");
const path = require("path");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");
const crearRouterReservas = require("./rutas/reservas");
const crearControladorReservas = require("./controladores/reservas");

function crearApp(servicio, config) {
  const app = express();
  const controlador = crearControladorReservas(servicio);
  const routerReservas = crearRouterReservas(controlador);

  // Vistas
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("layout", "layouts/main");

  // Pipeline Base
  const formatoMorgan = config.NODE_ENV === "production" ? "combined" : "dev";
  app.use(morgan(formatoMorgan));
  app.use(identificarSolicitud);
  app.use(medirDuracion);
  app.use(expressLayouts);
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Rutas
  app.get("/", controlador.mostrarInicio);
  app.get("/estado", controlador.mostrarEstado);
  app.use("/reservas", routerReservas);

  // 404 Final
  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  return app;
}

module.exports = crearApp;
