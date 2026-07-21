import { useEffect } from 'react'
const Header = ({ course }) => {
    let sum = 0;
    let sum1 = 0;
    course[0].parts.forEach(course => {
                sum += course.exercises
    })
    course[1].parts.forEach(course => {
                sum1 += course.exercises
    })
  return (
  <>
    <h1>{course[0].name}</h1>
    <ul>
        {course[0].parts.map(part =><li> {part.name} {part.exercises} </li>)}
        {course[1].parts.map(part => <li>{part.name} {part.exercises}</li>)}
    </ul>
    total of {sum} reviews
    <h1>{course[1].name}</h1>
    <ul>
        {course[1].parts.map(part => <li>{part.name} {part.exercises}</li>)}
    </ul>
    total of {sum1} reviews
    </>
  );
}

const Course = (props) => {
  console.log(props)
  const { course } = props  
  return (
    <div>
      <Header course={course} />
    </div>
  )
}
export default Course