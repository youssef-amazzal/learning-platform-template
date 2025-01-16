const axios = require('axios');
const prompt = require('prompt-sync')();

const BASE_URL = 'http://localhost:3000';

async function mainMenu() {
    while (true) {
        console.log('\nMENU:\n1) Create Course\n2) Get Courses\n3) Create Student\n4) Get Students\n5) Enroll Student\n6) Course Stats\n0) Exit\n');
        const choice = prompt('Choose an option: ');

        try {
            switch (choice) {
                case '1': {
                    const title = prompt('Course Title: ');
                    const description = prompt('Course Description: ');
                    const teacher = prompt('Teacher: ');
                    const res = await axios.post(`${BASE_URL}/courses`, { title, description, teacher });
                    console.log(res.data);
                    break;
                }
                case '2': {
                    const res = await axios.get(`${BASE_URL}/courses`);
                    console.log(res.data);
                    break;
                }
                case '3': {
                    const name = prompt('Student Name: ');
                    const email = prompt('Student Email: ');
                    const res = await axios.post(`${BASE_URL}/students`, { name, email });
                    console.log(res.data);
                    break;
                }
                case '4': {
                    const res = await axios.get(`${BASE_URL}/students`);
                    console.log(res.data);
                    break;
                }
                case '5': {
                    const coursesRes = await axios.get(`${BASE_URL}/courses`);
                    const studentsRes = await axios.get(`${BASE_URL}/students`);

                    const courses = coursesRes.data;
                    const students = studentsRes.data;

                    console.log('\nCourses:');
                    courses.forEach((course, index) => {
                        console.log(`${index + 1}) ${course.title}`);
                    });

                    const courseChoice = prompt('Choose a course by number: ');
                    const selectedCourse = courses[parseInt(courseChoice) - 1];

                    console.log('\nStudents:');
                    students.forEach((student, index) => {
                        console.log(`${index + 1}) ${student.name}`);
                    });

                    const studentChoice = prompt('Choose a student by number: ');
                    const selectedStudent = students[parseInt(studentChoice) - 1];

                    const res = await axios.post(`${BASE_URL}/courses/enroll`, { courseId: selectedCourse._id, studentId: selectedStudent._id });
                    console.log(res.data);
                    break;
                }
                case '6': {
                    const res = await axios.get(`${BASE_URL}/courses/stats`);
                    console.log(res.data);
                    break;
                }
                case '0': {
                    console.log('Exiting CLI.');
                    return;
                }
                default:
                    console.log('Invalid choice, try again.');
            }
        } catch (err) {
            if (err.response) {
                console.error('Error response:', err.response.data);
                console.error('Status:', err.response.status);
                console.error('Headers:', err.response.headers);
            } else if (err.request) {
                console.error('Error request:', err.request);
            } else {
                console.error('Error message:', err.message);
            }
            console.error('Error config:', err.config);
        }
    }
}

mainMenu();