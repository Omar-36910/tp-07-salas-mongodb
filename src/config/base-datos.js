const mongoose = require("mongoose");
const dns = require("node:dns");

// Configuración DNS requerida para resolver clústeres Atlas en ciertas redes
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function conectarDB(uri) {
  if (!uri || !uri.startsWith("mongodb")) {
    throw new Error(
      "La URI de MongoDB no está definida o el prefijo es incorrecto.",
    );
  }
  await mongoose.connect(uri);
  console.log("Conexión exitosa a MongoDB Atlas.");
}

async function desconectarDB() {
  await mongoose.disconnect();
  console.log("Desconexión de MongoDB Atlas completada.");
}

module.exports = { conectarDB, desconectarDB };
