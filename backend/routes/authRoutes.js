const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config.json");
const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "Usuário já existe" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, email, password: hashedPassword });

        await user.save();
        res.status(201).json({ msg: "Usuário cadastrado com sucesso!" });

    } catch (err) {
        res.status(500).json({ msg: "Erro ao cadastrar usuário" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Usuário não encontrado" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Senha incorreta" });

        const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "1h" });

        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });

    } catch (err) {
        res.status(500).json({ msg: "Erro ao fazer login" });
    }
});

module.exports = router;
