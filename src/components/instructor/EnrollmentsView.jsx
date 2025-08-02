import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const EnrollmentsView = () => {

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const { secNo, courseId, secId } = location.state;

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/sections/${secNo}/enrollments`,
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
        setEnrollments(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchEnrollments()
  }, []);

  const saveGrades = async () => {
    try {
      const response = await fetch(
        `${GRADEBOOK_URL}/enrollments`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
          body: JSON.stringify(enrollments),
        });
      if (response.ok) {
        setMessage("Grades saved");
        fetchEnrollments();
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const onGradeChange = (event, idx) => {
    // make copy of enrollments list.  update row with grade value
    const copy_enrollments = enrollments.map((x) => x);
    copy_enrollments[idx] = { ...(copy_enrollments[idx]), grade: event.target.value };
    setEnrollments(copy_enrollments);
  }

  const headers = ['enrollment id', 'student id', 'name', 'email', 'grade'];

  return (
    <>
      <h3> {courseId}-{secId} Enrollments</h3>
      <Messages response={message} />
      <table className="Center" >
        <thead>
          <tr>
            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e, idx) => (
            <tr key={idx}>
              <td>{e.enrollmentId}</td>
              <td>{e.studentId}</td>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td><input id="grade" type="text" name="grade" value={(e.grade) ? e.grade : ''} onChange={(event) => onGradeChange(event, idx)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button id="saveEnrollmentsButton" onClick={saveGrades}>Save Grades</button>
    </>
  );
}

export default EnrollmentsView;
