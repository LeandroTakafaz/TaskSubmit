const express = require("express");
const bcrypt = require("bcryptjs");
const Professor = require("../models/Professor");
const Student = require("../models/Student");
const router = express.Router();

router.post("/register", async (req, res) => {
    console.log("Dados recebidos:", req.body);

    const { name, gender, turn, email, password, cpf, subjects } = req.body;

    try {
        if (!name || !gender || !turn || !email || !password || !cpf || !subjects) {
            return res.status(400).json({ msg: "Todos os campos são obrigatórios." });
        }

        let professorExists = await Professor.findOne({ email });
        if (professorExists) return res.status(400).json({ msg: "E-mail já cadastrado." });

        const hashedPassword = await bcrypt.hash(password, 10);

        const professor = new Professor({
            name,
            gender,
            turn,
            email,
            password: hashedPassword,
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
