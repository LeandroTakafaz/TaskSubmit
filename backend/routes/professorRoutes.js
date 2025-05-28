const express = require("express");
const bcrypt = require("bcryptjs");
const Professor = require("../models/Professor");
const Student = require("../models/Student");
const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, password, gender, turn, cpf, subjects } = req.body;

    try {
        let existingUser = await Student.findOne({ email }) || await Professor.findOne({ email });
        if (existingUser) {
            let userType = existingUser.cpf ? "PROFESSOR" : "ALUNO";
            return res.status(400).json({ msg: `E-mail já cadastrado como ${userType}.` });
        }

        let existingCPF = await Professor.findOne({ cpf });
        if (existingCPF) {
            return res.status(400).json({ msg: "CPF já cadastrado para outro professor." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const professor = new Professor({ name, email, password: hashedPassword, gender, turn, cpf, subjects });

        await professor.save();

        res.status(201).json({ msg: "Professor cadastrado com sucesso!" });

    } catch (err) {
        console.error("Erro ao cadastrar professor:", err);
        res.status(500).json({ msg: "Erro ao cadastrar professor" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const professor = await Professor.findById(req.params.id);
        if (!professor) {
            return res.status(404).json({ msg: "Professor não encontrado" });
        }
        res.json(professor);
    } catch (err) {
        res.status(500).json({ msg: "Erro ao buscar professor" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { name, email, gender, turn, cpf, subjects } = req.body;

        let professor = await Professor.findById(req.params.id);
        if (!professor) {
            return res.status(404).json({ msg: "Professor não encontrado" });
        }

        if (email && email !== professor.email) {
            let existingEmail = await Student.findOne({ email }) || await Professor.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ msg: "E-mail já está cadastrado em outro usuário." });
            }
        }

        if (cpf && cpf !== professor.cpf) {
            let existingCPF = await Professor.findOne({ cpf });
            if (existingCPF) {
                return res.status(400).json({ msg: "CPF já cadastrado para outro professor." });
            }
        }

        professor.name = name || professor.name;
        professor.email = email || professor.email;
        professor.gender = gender || professor.gender;
        professor.turn = turn || professor.turn;
        professor.cpf = cpf || professor.cpf;
        professor.subjects = subjects ? subjects.split(",") : professor.subjects;

        await professor.save();

        res.json({ msg: "Professor atualizado com sucesso!", professor });

    } catch (err) {
        console.error("Erro ao atualizar professor:", err);
        res.status(500).json({ msg: "Erro ao atualizar professor" });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        let professor = await Professor.findById(req.params.id);
        if (!professor) {
            return res.status(404).json({ msg: "Professor não encontrado" });
        }

        await professor.deleteOne();
        res.json({ msg: "Professor deletado com sucesso!" });

    } catch (err) {
        res.status(500).json({ msg: "Erro ao deletar professor" });
    }
});

router.get("/", async (req, res) => {
    try {
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Professor.countDocuments();
        const professors = await Professor.find().skip(skip).limit(limit);

        res.json({
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            professors
        });

    } catch (err) {
        res.status(500).json({ msg: "Erro ao buscar professores" });
    }
});

module.exports = router;