// document.addEventListener("DOMContentLoaded", function() {});
document.addEventListener('DOMContentLoaded', (event) => {

  let mainCourseSidebar = document.querySelector('#course-container')
  let courseStudents = document.querySelector('#course-detail')
  let studentInfo = document.querySelector('#student-form')

  const makeCourseSidebarHtml = (course) => {
    return `<ul class="course-list" data-id="${course.id}">
    Course ID: ${course.id}<br />
    ${course.name}<br />
    ${course.instructor}<br />
    ${course.semester}<br />
    <button class="see-detail" data-id="${course.id}">See Details</button>
    </ul>`
  }

  const makeStudentListHtml = (student) => {
    return `<ul class="student-list">
    <li data-id="${student.id}" class="single-student">${student.name} - ${student.percentage}%</li>
    </ul>`
  }

  const makeStudentInfoPage = (student) => {
    return `<h2>${student.name}</h2>
    <p><b>Class Year:</b> ${student.class_year}</p>
    <p id="grade-text"><b>Grade:</b> ${student.percentage}%</p>
    <form>
    <b>Percentage</b>
    <input type="text" percentage="percentage" data-id="${student.id}"></input>
    <button type='submit' class="edit-student-btn">Edit</button>
    </form>
    `
  }

  const courseFetch = () => {
    return fetch('https://bayside-high.herokuapp.com/api/v1/users/152/courses')
    .then(res => res.json())
    .then(courses => {
      courses.forEach(course => {
        console.log(course.name)
        mainCourseSidebar.innerHTML += makeCourseSidebarHtml(course)
      })
    })
  }
  courseFetch()

  const courseStudentsFetch = (courseId) => {
    return fetch(`https://bayside-high.herokuapp.com/api/v1/users/152/courses/${courseId}`)
    .then(res => res.json())
    .then(course => {
      console.log(course.students.name)
      course.students.forEach(student => {
        console.log(student.name)
        courseStudents.innerHTML += makeStudentListHtml(student)
      })
    })
  }

  mainCourseSidebar.addEventListener('click', (event) => {
    if (event.target.className === 'see-detail') {
      let courseId = event.target.dataset.id
      console.log(courseId)
      courseStudents.innerHTML = ""
      courseStudentsFetch(courseId)
    }
  })

  courseStudents.addEventListener('click', (event) => {
    if (event.target.className === 'single-student') {
      console.log('hello')
      let studentId = event.target.dataset.id
      fetch(`https://bayside-high.herokuapp.com/api/v1/users/152/students/${studentId}`)
      .then(res => res.json())
      .then(student => {
        console.log(student.name)
        studentInfo.innerHTML = makeStudentInfoPage(student)
      })
    }
  })

  // Update student grade
  studentInfo.addEventListener('submit', (event) => {
    event.preventDefault()
    let newGrade = event.target[0].value
    let form = document.querySelector('form')
    let studentId = event.target[0].dataset.id
    form.reset()
    fetch(`https://bayside-high.herokuapp.com/api/v1/users/152/students/${studentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        // id: studentId,
        percentage: newGrade
      })
    })
    .then(res => res.json())
    .then(document.querySelector('#grade-text').innerHTML = `<p><b>Grade:</b> ${newGrade}%</p>`)
  })
})
