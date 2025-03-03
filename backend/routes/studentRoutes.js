const express = require("express");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Professor = require("../models/Professor");
const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, password, age, course, gender, turn, period } = req.body;

    try {
        let existingUser = await Student.findOne({ email }) || await Professor.findOne({ email });

        let userType = existingUser instanceof Student ? "ALUNO" : "PROFESSOR";

        if (existingUser) {
            return res.status(400).json({ msg: `E-mail já cadastrado como ${userType}` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new Student({ name, email, password: hashedPassword, age, course, gender, turn, period });

        await student.save();

        res.status(201).json({ msg: "Aluno cadastrado com sucesso!" });

    } catch (err) {
        console.error("Erro ao cadastrar aluno:", err);
        res.status(500).json({ msg: "Erro ao cadastrar aluno" });
    }
});

module.exports = router;
