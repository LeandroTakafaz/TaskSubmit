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

        res.status(201).json({ msg: "Aluno cadastrado com sucesso!", student });

    } catch (err) {
        console.error("Erro ao cadastrar aluno:", err);
        res.status(500).json({ msg: "Erro ao cadastrar aluno" });
    }
});

router.get("/", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ msg: "Erro ao buscar alunos" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ msg: "Aluno não encontrado" });
        }
        res.json(student);
    } catch (err) {
        res.status(500).json({ msg: "Erro ao buscar aluno" });
    }
});

router.put("/:id", async (req, res) => {
    const { name, email, age, course, gender, turn, period } = req.body;

    try {
        let student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ msg: "Aluno não encontrado" });
        }

        student.name = name || student.name;
        student.email = email || student.email;
        student.age = age || student.age;
        student.course = course || student.course;
        student.gender = gender || student.gender;
        student.turn = turn || student.turn;
        student.period = period || student.period;

        await student.save();

        res.json({ msg: "Aluno atualizado com sucesso!", student });

    } catch (err) {
        res.status(500).json({ msg: "Erro ao atualizar aluno" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ msg: "Aluno não encontrado" });
        }

        await student.deleteOne();
        res.json({ msg: "Aluno removido com sucesso!" });

    } catch (err) {
        res.status(500).json({ msg: "Erro ao remover aluno" });
    }
});

module.exports = router;
