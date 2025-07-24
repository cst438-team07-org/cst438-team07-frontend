import { useState,useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { REGISTRAR_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const ScheduleView = () => {

  // student views their class schedule for a given term

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');
  const [term, setTerm] = useState({});

  const prefetchEnrollments = ({ year, semester }) => {
    setTerm({ year, semester });
    fetchEnrollments(year, semester);
  }

  const fetchEnrollments = async (year, semester) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments?year=${year}&semester=${semester}`,
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
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const drop = async (enrollmentId) => {
    try {
      const response = await fetch(
          `${REGISTRAR_URL}/enrollments/${enrollmentId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': sessionStorage.getItem('jwt'),
            },
          }
      );
      if (response.ok) {
        setMessage('Course dropped successfully');
        fetchEnrollments(term.year, term.semester);
      } else {
        setMessage('Error dropping course: ' + response.status);
      }
    } catch (err) {
      setMessage('Network error: ' + err);
    }
  };

  const confirmDrop = (enrollment) => {
    confirmAlert({
      title: 'Confirm to drop',
      message: `Are you sure you want to drop ${enrollment.courseId}?`,
      buttons: [
        { label: 'Yes', onClick: () => drop(enrollment.enrollmentId) },
        { label: 'No' }
      ]
    });
  };

  const headings = ["enrollmentId", "secNo", "courseId", "secId", "building", "room", "times", ""];

  return (
      <div>
        <Messages response={message}/>
        <SelectTerm buttonText="Get Schedule" onClick={prefetchEnrollments}/>
        <p>To be implemented. Display a table with the sections the student is
          enrolled in for the given term.
          For each section, display the columns as given in headings.
          For each table row, a Drop button will allow the student to drop the
          section.
          Confirm that the user wants to drop before doing the REST delete
          request.
        </p>
        <table>
          <thead>
          <tr>{headings.map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
          {enrollments.map(e => (
              <tr key={e.enrollmentId}>
                <td>{e.enrollmentId}</td>
                <td>{e.secNo}</td>
                <td>{e.courseId}</td>
                <td>{e.secId}</td>
                <td>{e.building}</td>
                <td>{e.room}</td>
                <td>{e.times}</td>
                <td>
                  <button onClick={() => confirmDrop(e)}>Drop</button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
);

};

export default ScheduleView;