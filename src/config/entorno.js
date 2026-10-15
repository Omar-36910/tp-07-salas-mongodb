function cargarConfiguracion() {
  let puerto = process.env.PORT || 3000;
  const entorno = process.env.NODE_ENV || "development";
  const uriMongo = process.env.MONGODB_URI || "";

  puerto = parseInt(puerto, 10);
  if (isNaN(puerto) || puerto < 1 || puerto > 65535) {
    throw new Error(
      "El puerto debe ser un número entero válido entre 1 y 65535.",
    );
  }

  return { PORT: puerto, NODE_ENV: entorno, MONGODB_URI: uriMongo };
}

module.exports = { cargarConfiguracion };
