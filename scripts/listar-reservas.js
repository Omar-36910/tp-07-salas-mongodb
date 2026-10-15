const { cargarConfiguracion } = require("../src/config/entorno");
const { conectarDB, desconectarDB } = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

async function main() {
  try {
    const config = cargarConfiguracion();
    await conectarDB(config.MONGODB_URI);

    const lista = await Reserva.find({});
    console.log(
      `\n--- LISTADO DE RESERVAS EN ATLAS (Total: ${lista.length}) ---`,
    );
    lista.forEach((r, idx) => {
      console.log(
        `${idx + 1}. ID: ${r._id.toString()} | Estudiante: ${r.estudiante} | Sala: ${r.sala} | Fecha: ${r.fecha} (${r.turno}) - Personas: ${r.personas}`,
      );
    });
    console.log(
      "-----------------------------------------------------------\n",
    );

    await desconectarDB();
    process.exit(0);
  } catch (error) {
    console.error("Error al listar las reservas:", error.message);
    try {
      await desconectarDB();
    } catch (errClean) {
      // Ignorar error si la desconexión falla al estar ya rota la conexión previa
    }
    process.exit(1);
  }
}

main();
