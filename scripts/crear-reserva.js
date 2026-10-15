const { cargarConfiguracion } = require("../src/config/entorno");
const { conectarDB, desconectarDB } = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

async function main() {
  try {
    const config = cargarConfiguracion();
    await conectarDB(config.MONGODB_URI);

    const nuevaReserva = new Reserva({
      estudiante: "Valeria Pérez",
      email: "valeria@ejemplo.com",
      sala: "Sala Multimedia",
      fecha: "2026-10-15",
      turno: "Tarde",
      personas: 4,
    });

    const guardada = await nuevaReserva.save();
    console.log(
      "Reserva creada exitosamente con _id:",
      guardada._id.toString(),
    );

    await desconectarDB();
    process.exit(0);
  } catch (error) {
    console.error("Error al crear la reserva:", error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach((campo) => {
        console.error(`- Campo '${campo}': ${error.errors[campo].message}`);
      });
    }
    try {
      await desconectarDB();
    } catch (errClean) {
      // Ignorar error si la desconexión falla al estar ya rota
    }
    process.exit(1);
  }
}

main();
