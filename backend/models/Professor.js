const mongoose = require("mongoose");

const ProfessorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Masculino", "Feminino", "Outro"] },
    turn: { type: String, required: true, enum: ["Integral", "Noturno", "Vespertino"] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    subjects: [{ type: String, required: true }]
});

module.exports = mongoose.model("Professor", ProfessorSchema);
