const { cargarConfiguracion } = require("../src/config/entorno");
const { conectarDB, desconectarDB } = require("../src/config/base-datos");

async function main() {
  try {
    const config = cargarConfiguracion();
    await conectarDB(config.MONGODB_URI);
    await desconectarDB();
    console.log("Prueba de conexión finalizada con éxito.");
    process.exit(0);
  } catch (error) {
    console.error("Fallo en la prueba de conexión:", error.message);
    process.exit(1);
  }
}

main();
