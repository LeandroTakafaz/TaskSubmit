const mongoose = require("mongoose");

const CurriculumSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subjects: [
        {
            name: { type: String, required: true },
            credits: { type: Number, required: true },
            grade: { type: Number, default: null },
            frequency: { type: Number, default: null },
            status: {
                type: String,
                enum: ["Cursando", "Aprovado", "Reprovado", "Pendente"],
                default: "Pendente"
            }
        }
    ]
});

module.exports = mongoose.model("Curriculum", CurriculumSchema);
