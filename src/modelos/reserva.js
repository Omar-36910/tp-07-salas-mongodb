const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema(
  {
    estudiante: {
      type: String,
      required: [true, "El nombre del estudiante es obligatorio."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio."],
      trim: true,
      match: [/@/, "El correo electrónico debe contener un carácter '@'."],
    },
    sala: {
      type: String,
      required: [true, "La sala es obligatoria."],
      enum: {
        values: ["Sala Norte", "Sala Sur", "Sala Multimedia"],
        message: "Sala no permitida: {VALUE}",
      },
    },
    fecha: {
      type: String,
      required: [true, "La fecha es obligatoria."],
      trim: true,
    },
    turno: {
      type: String,
      required: [true, "El turno es obligatorio."],
      enum: {
        values: ["Mañana", "Tarde", "Noche"],
        message: "Turno no permitido: {VALUE}",
      },
    },
    personas: {
      type: Number,
      required: [true, "La cantidad de personas es obligatoria."],
      min: [1, "Debe haber al menos 1 persona."],
      max: [6, "Puede haber como máximo 6 personas."],
      validate: {
        validator: Number.isInteger,
        message: "La cantidad de personas debe ser un número entero.",
      },
    },
  },
  {
    collection: "reservas",
    timestamps: false,
  },
);

const Reserva = mongoose.model("Reserva", reservaSchema);

module.exports = Reserva;
