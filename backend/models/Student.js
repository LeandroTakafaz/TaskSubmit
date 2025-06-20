const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    course: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Masculino", "Feminino", "Outro"] },
    turn: { type: String, required: true, enum: ["Integral", "Noturno", "Vespertino"] },
    period: { type: String, required: true }
});

module.exports = mongoose.model("Student", StudentSchema);
