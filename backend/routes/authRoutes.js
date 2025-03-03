const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Professor = require("../models/Professor");
const config = require("../config.json");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Student.findOne({ email }) || await Professor.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "Usuário não encontrado" });
        }

        const role = user instanceof Student ? "student" : "professor";

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Senha incorreta" });
        }

        const token = jwt.sign(
            { id: user._id, role },
            config.jwtSecret,
            { expiresIn: "1h" }
        );

        res.json({
            msg: "Login realizado com sucesso!",
            token,
            user: { id: user._id, name: user.name, email: user.email, role }
        });

    } catch (err) {
        console.error("Erro ao fazer login:", err);
        res.status(500).json({ msg: "Erro ao fazer login" });
    }
});

module.exports = router;
