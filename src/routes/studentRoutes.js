const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');


router.post('/', studentController.createStudent);
router.get('/:id', studentController.getStudentById);
router.get('/', studentController.getStudents);
router.put('/:id', studentController.updateStudentById);
router.delete('/:id', studentController.deleteStudentById);

module.exports = router;