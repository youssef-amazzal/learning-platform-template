const db = require('../config/db');
const mongoService = require('../services/mongoService');
const errorCodes = require('./errorMessages');

async function createStudent(req, res) {
    try {
        const { name, email } = req.body;
        const newStudent = { name, email };
        const result = await (await db.getDb()).collection('students').insertOne(newStudent);
        res.status(201).json({ _id: result.insertedId, ...newStudent });
    } catch (error) {
        console.error('Failed to create student:', error);
        res.status(errorCodes.STUDENT.FAILED_TO_CREATE.statusCode).json({ error: errorCodes.STUDENT.FAILED_TO_CREATE.message });
    }
}

async function getStudents(req, res) {
    try {
        const database = await db.getDb();
        const students = await database.collection('students').find().toArray();
        res.status(200).json(students);
    } catch (error) {
        console.error('Failed to get students:', error);
        res.status(errorCodes.STUDENT.FAILED_TO_GET.statusCode).json({ error: errorCodes.STUDENT.FAILED_TO_GET.message });
    }
}

async function getStudentById(req, res) {
    try {
        const { id } = req.params;
        const student = await mongoService.findOneById('students', id);
        if (!student) {
            return res.status(errorCodes.STUDENT.NOT_FOUND.statusCode).json({ error: errorCodes.STUDENT.NOT_FOUND.message });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error('Failed to get student by ID:', error);
        res.status(errorCodes.STUDENT.FAILED_TO_GET.statusCode).json({ error: errorCodes.STUDENT.FAILED_TO_GET.message });
    }
}

async function updateStudentById(req, res) {
    try {
        const { id } = req.params;
        const update = req.body; // { name, email, courses? }
        const success = await mongoService.updateOneById('students', id, update);
        if (!success) {
            return res.status(errorCodes.STUDENT.NOT_FOUND.statusCode).json({ error: errorCodes.STUDENT.NOT_FOUND.message });
        }
        res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error('Failed to update student:', error);
        res.status(errorCodes.STUDENT.FAILED_TO_UPDATE.statusCode).json({ error: errorCodes.STUDENT.FAILED_TO_UPDATE.message });
    }
}

async function deleteStudentById(req, res) {
    try {
        const { id } = req.params;
        const success = await mongoService.deleteOneById('students', id);
        if (!success) {
            return res.status(errorCodes.STUDENT.NOT_FOUND.statusCode).json({ error: errorCodes.STUDENT.NOT_FOUND.message });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Failed to delete student:', error);
        res.status(errorCodes.STUDENT.FAILED_TO_DELETE.statusCode).json({ error: errorCodes.STUDENT.FAILED_TO_DELETE.message });
    }
}

module.exports = {
    createStudent,
    getStudentById,
    getStudents,
    updateStudentById,
    deleteStudentById
};