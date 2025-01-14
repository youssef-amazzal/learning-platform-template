// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse:
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse :

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createCourse(req, res) {
  // TODO: Implémenter la création d'un cours
  // Utiliser les services pour la logique réutilisable
  try {
    const course = req.body;
    const result = await mongoService.insertOne('courses', course);
    res.status(201).json(result);
  } catch (error) {
    res.status(errorCodes.FAILED_TO_CREATE_COURSE.statusCode).json({ error: errorCodes.FAILED_TO_CREATE_COURSE.message });
  }
}

async function getCourseById(req, res) {
  try {
    const { id } = req.params;
    const course = await mongoService.findOneById('courses', id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get course' });
  }
}
async function getCourseById(req, res) {
  try {
    const { id } = req.params;
    const course = await mongoService.findOneById('courses', id);
    if (!course) {
      return res.status(errorCodes.COURSE_NOT_FOUND.statusCode).json({ error: errorCodes.COURSE_NOT_FOUND.message });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(errorCodes.FAILED_TO_GET_COURSE.statusCode).json({ error: errorCodes.FAILED_TO_GET_COURSE.message });
  }
}

async function getAllCourses(req, res) {
  try {
    const courses = await mongoService.findAll('courses');
    res.status(200).json(courses);
  } catch (error) {
    res.status(errorCodes.FAILED_TO_GET_COURSES.statusCode).json({ error: errorCodes.FAILED_TO_GET_COURSES.message });
  }
}

async function updateCourseById(req, res) {
  try {
    const { id } = req.params;
    const update = req.body;
    const success = await mongoService.updateOneById('courses', id, update);
    if (!success) {
      return res.status(errorCodes.COURSE_NOT_FOUND.statusCode).json({ error: errorCodes.COURSE_NOT_FOUND.message });
    }
    res.status(200).json({ message: 'Course updated successfully' });
  } catch (error) {
    res.status(errorCodes.FAILED_TO_UPDATE_COURSE.statusCode).json({ error: errorCodes.FAILED_TO_UPDATE_COURSE.message });
  }
}

async function deleteCourseById(req, res) {
  try {
    const { id } = req.params;
    const success = await mongoService.deleteOneById('courses', id);
    if (!success) {
      return res.status(errorCodes.COURSE_NOT_FOUND.statusCode).json({ error: errorCodes.COURSE_NOT_FOUND.message });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(errorCodes.FAILED_TO_DELETE_COURSE.statusCode).json({ error: errorCodes.FAILED_TO_DELETE_COURSE.message });
  }
}
// Export des contrôleurs
module.exports = {
  // TODO: Exporter les fonctions du contrôleur
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourseById,
  deleteCourseById
};