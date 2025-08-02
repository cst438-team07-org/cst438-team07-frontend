import { useState, useEffect } from 'react';
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';


const Transcript = () => {

  const [message, setMessage] = useState('');
  const [courses, setCourses] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/transcripts`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const headers = ['Year', 'Semester', 'CourseId', 'Section', 'Title', 'Credits', 'Grade'];

  return (
    <>
      <h3>Transcript</h3>
      <Messages response={message} />
      {(courses.length > 0) ? (<p>Student id : {courses[0].studentId} <br />  Student name : {courses[0].name} </p>) : ''}
      <table className="Center" >
        <thead>
          <tr>
            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.enrollmentId}>
              <td>{c.year}</td>
              <td>{c.semester}</td>
              <td>{c.courseId}</td>
              <td>{c.sectionId}</td>
              <td>{c.title}</td>
              <td>{c.credits}</td>
              <td id="grade">{c.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Transcript;