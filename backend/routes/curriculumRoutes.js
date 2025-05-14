const express = require("express");
const Curriculum = require("../models/Curriculum");
const Student = require("../models/Student");

const router = express.Router();

router.post("/", async (req, res) => {
    const { studentId, subjects } = req.body;

    try {
        const studentExists = await Student.findById(studentId);
        if (!studentExists) {
            return res.status(404).json({ msg: "Aluno não encontrado" });
        }

        const existingCurriculum = await Curriculum.findOne({ studentId });
        if (existingCurriculum) {
            return res.status(400).json({ msg: "Grade já cadastrada para este aluno." });
        }

        const newCurriculum = new Curriculum({ studentId, subjects });
        await newCurriculum.save();

        res.status(201).json({
            msg: "Grade curricular criada com sucesso!",
            curriculum: newCurriculum
        });
    } catch (err) {
        console.error("Erro ao criar grade:", err);
        res.status(500).json({ msg: "Erro ao criar grade curricular" });
    }
});

router.get("/:studentId", async (req, res) => {
    try {
        const curriculum = await Curriculum.findOne({ studentId: req.params.studentId })
            .populate("studentId", "name email");

        if (!curriculum) {
            return res.status(404).json({ msg: "Grade não encontrada para este aluno" });
        }

        res.json(curriculum);
    } catch (err) {
        console.error("Erro ao buscar grade:", err);
        res.status(500).json({ msg: "Erro ao buscar grade curricular" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { subjects } = req.body;

        if (!Array.isArray(subjects) || subjects.length === 0) {
            return res.status(400).json({ msg: "Informe as disciplinas para atualizar." });
        }

        const curriculum = await Curriculum.findById(req.params.id);
        if (!curriculum) {
            return res.status(404).json({ msg: "Grade curricular não encontrada." });
        }

        subjects.forEach((updatedSubject) => {
            const subject = curriculum.subjects.id(updatedSubject._id);
            if (subject) {
                if (updatedSubject.frequency !== undefined) {
                    subject.frequency = updatedSubject.frequency;
                }
                if (updatedSubject.grade !== undefined) {
                    subject.grade = updatedSubject.grade;
                }
                if (updatedSubject.status !== undefined) {
                    subject.status = updatedSubject.status;
                }
            }
        });

        await curriculum.save();

        res.json({ msg: "Grade curricular atualizada com sucesso!", curriculum });
    } catch (err) {
        console.error("Erro ao atualizar grade:", err);
        res.status(500).json({ msg: "Erro ao atualizar grade curricular" });
    }
});


module.exports = router;
