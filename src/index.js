const { cargarConfiguracion } = require("./config/entorno");
const crearServicioReservas = require("./servicios/reservas");
const crearApp = require("./app");

const datosIniciales = [
  {
    id: 1,
    estudiante: "Carlos Gómez",
    email: "carlos@ejemplo.com",
    sala: "Sala Norte",
    fecha: "2026-09-25",
    turno: "Mañana",
    personas: 3,
  },
  {
    id: 2,
    estudiante: "Ana Martínez",
    email: "ana@ejemplo.com",
    sala: "Sala Sur",
    fecha: "2026-09-25",
    turno: "Tarde",
    personas: 2,
  },
  {
    id: 3,
    estudiante: "Lucas Díaz",
    email: "lucas@ejemplo.com",
    sala: "Sala Multimedia",
    fecha: "2026-09-26",
    turno: "Noche",
    personas: 5,
  },
  {
    id: 4,
    estudiante: "Sofía Rossi",
    email: "sofia@ejemplo.com",
    sala: "Sala Norte",
    fecha: "2026-09-27",
    turno: "Tarde",
    personas: 4,
  },
];

try {
  const config = cargarConfiguracion();
  const servicio = crearServicioReservas(datosIniciales);
  const app = crearApp(servicio, config);

  app.listen(config.PORT, () => {
    console.log(
      `Servidor iniciando en puerto ${config.PORT} | Entorno: ${config.NODE_ENV}`,
    );
  });
} catch (error) {
  console.error("Error al iniciar la aplicación:", error.message);
  process.exit(1);
}
