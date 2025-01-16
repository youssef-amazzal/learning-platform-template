// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse:
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse :
const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');
const errorCodes = require('./errorMessages');

async function createCourse(req, res) {
  // TODO: Implémenter la création d'un cours
  // Utiliser les services pour la logique réutilisable
  try {
    const { title, description, teacher } = req.body;
    const newCourse = {
      title,
      description,
      teacher,
      students: []  // initialize with an empty array
    };
    const result = await (await db.getDb()).collection('courses').insertOne(newCourse);
    res.status(201).json({ _id: result.insertedId, ...newCourse });
  } catch (error) {
    console.error('Failed to create course:', error);
    res.status(errorCodes.COURSE.FAILED_TO_CREATE.statusCode).json({ error: errorCodes.COURSE.FAILED_TO_CREATE.message });
  }
}

async function getCourseById(req, res) {
  try {
    const { id } = req.params;
    const course = await mongoService.findOneById('courses', id);
    if (!course) {
      return res.status(errorCodes.COURSE.NOT_FOUND.statusCode).json({ error: errorCodes.COURSE.NOT_FOUND.message });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('Failed to get course:', error);
    res.status(errorCodes.COURSE.FAILED_TO_GET.statusCode).json({ error: errorCodes.COURSE.FAILED_TO_GET.message });
  }
}

async function getAllCourses(req, res) {
  try {
    const cacheKey = 'all_courses';
    const cachedCourses = await redisService.getCachedData(cacheKey);

    if (cachedCourses) {
      return res.status(200).json(cachedCourses);
    }

    const courses = await (await db.getDb()).collection('courses').find().toArray();
    await redisService.cacheData(cacheKey, courses, 3600); // Cache for 1 hour

    res.status(200).json(courses);
  } catch (error) {
    console.error('Failed to get courses:', error);
    res.status(errorCodes.COURSE.FAILED_TO_GET_ALL.statusCode).json({ error: errorCodes.COURSE.FAILED_TO_GET_ALL.message });
  }
}

async function updateCourseById(req, res) {
  try {
    const { id } = req.params;
    const update = req.body; // { title, description, teacher, students? }
    const success = await mongoService.updateOneById('courses', id, { $set: update });
    if (!success) {
      return res.status(errorCodes.COURSE.NOT_FOUND.statusCode).json({ error: errorCodes.COURSE.NOT_FOUND.message });
    }
    res.status(200).json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Failed to update course:', error);
    res.status(errorCodes.COURSE.FAILED_TO_UPDATE.statusCode).json({ error: errorCodes.COURSE.FAILED_TO_UPDATE.message });
  }
}

async function deleteCourseById(req, res) {
  try {
    const { id } = req.params;
    const success = await mongoService.deleteOneById('courses', id);
    if (!success) {
      return res.status(errorCodes.COURSE.NOT_FOUND.statusCode).json({ error: errorCodes.COURSE.NOT_FOUND.message });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Failed to delete course:', error);
    res.status(errorCodes.COURSE.FAILED_TO_DELETE.statusCode).json({ error: errorCodes.COURSE.FAILED_TO_DELETE.message });
  }
}

async function enrollStudentInCourse(req, res) {
  try {
    const { courseId, studentId } = req.body; // in the request body or as route parameters

    const courseUpdated = await mongoService.updateOneById('courses', courseId, {
      $addToSet: { students: mongoService.toObjectId(studentId) }
    });

    const studentUpdated = await mongoService.updateOneById('students', studentId, {
      $addToSet: { courses: mongoService.toObjectId(courseId) }
    });

    if (!courseUpdated || !studentUpdated) {
      return res.status(errorCodes.COURSE.FAILED_TO_ENROLL.statusCode).json({ error: errorCodes.COURSE.FAILED_TO_ENROLL.message });
    }

    res.status(200).json({ message: 'Student enrolled successfully' });
  } catch (error) {
    console.error('Failed to enroll student in course:', error);
    res.status(errorCodes.COURSE.FAILED_TO_ENROLL.statusCode).json({ error: errorCodes.COURSE.FAILED_TO_ENROLL.message });
  }
}

async function getCourseStats(req, res) {
  try {
    const courses = await (await db.getDb()).collection('courses').find().toArray();
    const totalCourses = courses.length;

    let totalStudents = 0;
    for (const course of courses) {
      totalStudents += (course.students || []).length;
    }

    const stats = {
      totalCourses,
      totalStudents,
      averageStudentsPerCourse: totalCourses > 0 ? totalStudents / totalCourses : 0
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Failed to get course stats:', error);
    res.status(errorCodes.COURSE.FAILED_TO_GET_STATS.statusCode).json({ error: errorCodes.COURSE.FAILED_TO_GET_STATS.message });
  }
}

module.exports = {
  // TODO: Exporter les fonctions du contrôleur
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourseById,
  deleteCourseById,
  enrollStudentInCourse,
  getCourseStats
};