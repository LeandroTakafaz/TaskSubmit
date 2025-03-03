const express = require("express");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Professor = require("../models/Professor");
const router = express.Router();

router.post("/register", async (req, res) => {
    console.log("Dados recebidos:", req.body);

    const { name, email, password, gender, turn, cpf, subjects } = req.body;

    try {
        let existingUser = await Student.findOne({ email }) || await Professor.findOne({ email });

        if (existingUser) {
            let userType = existingUser.cpf ? "PROFESSOR" : "ALUNO";
            return res.status(400).json({ msg: `E-mail já cadastrado como ${userType}.` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const professor = new Professor({
            name,
            email,
            password: hashedPassword,
            gender,
            turn,
            cpf,
            subjects
        });

        await professor.save();
        res.status(201).json({ msg: "Professor cadastrado com sucesso!" });

    } catch (err) {
        console.error("Erro ao cadastrar professor:", err);
        res.status(500).json({ msg: "Erro ao cadastrar professor" });
    }
});

module.exports = router;
