function crearServicioReservas(datosIniciales) {
  // Copia independiente en memoria
  let reservas = [...datosIniciales];

  return {
    obtenerTodas: () => reservas,
    obtenerPorId: (id) => reservas.find((r) => r.id === id),
    obtenerCantidad: () => reservas.length,
    crear: (datosValidados) => {
      const nuevoId =
        reservas.length > 0 ? Math.max(...reservas.map((r) => r.id)) + 1 : 1;
      const nuevaReserva = { id: nuevoId, ...datosValidados };
      reservas.push(nuevaReserva);
      return nuevaReserva;
    },
  };
}

module.exports = crearServicioReservas;
