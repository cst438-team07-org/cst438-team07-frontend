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
  
  const editChange = (event, enrollmentId) => {
    // Get the new grade the user typed
    const newGrade = event.target.value;
    // Create a new array with the updated grade for the matching enrollment
    const updatedEnrollments = enrollments.map((enrollment) => {
      // If this is the enrollment we want to update...
      if (enrollment.enrollmentId === enrollmentId) {
        // Return a new object with the updated grade
        return {
          ...enrollment,
          grade: newGrade
        };
      }
      // Otherwise, return the enrollment unchanged
      return enrollment;
    });
    // Update the state with the modified array
    setEnrollments(updatedEnrollments);
  };



  const onSave = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/enrollments`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
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


  const headers = ['enrollment id', 'student id', 'name', 'email', 'grade'];

  return (
    <>
      <h3> {courseId}-{secId} Enrollments</h3>
      <Messages response={message} />
      <table className="Center">
        <thead>
          <tr>
            {headers.map((s, idx) => (
              <th key={idx}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => (
            <tr key={e.enrollmentId}>
              <td>{e.enrollmentId}</td>
              <td>{e.studentId}</td>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td><input type="text" name="grade" placeholder="grade" value={e.grade ?? ""} onChange={(event) => editChange(event, e.enrollmentId)}/></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onSave}>Save</button>
    </>
  );
}


//onChange={editChange}
export default EnrollmentsView;
