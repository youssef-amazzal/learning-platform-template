// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse : 
// Question : Comment organiser les routes de manière cohérente ?
// Réponse: 

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Routes pour les cours
router.post('/', courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', courseController.updateCourseById);
router.delete('/:id', courseController.deleteCourseById);
router.post('/enroll', courseController.enrollStudentInCourse);
router.get('/stats', courseController.getCourseStats)

module.exports = router;