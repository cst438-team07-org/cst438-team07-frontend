import { useState } from 'react';
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

  const dropCourse = async (enrollmentId) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments/${enrollmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': sessionStorage.getItem('jwt'),
          },
        });
      if (response.ok) {
        setMessage("course dropped");
        fetchEnrollments(term.year, term.semester);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const onDelete = (enrollmentId) => {
    confirmAlert({
      title: 'Confirm to drop',
      message: 'Do you really want to drop this course?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => dropCourse(enrollmentId)
        },
        {
          label: 'No',
        }
      ]
    });
  }

  const headings = ["enrollmentId", "secNo", "courseId", "secId", "building", "room", "times", ""];

  return (
    <div>
      <Messages response={message} />
      <SelectTerm buttonText="Get Schedule" onClick={prefetchEnrollments} />

      <table className="Center">
        <thead>
          <tr>
            {headings.map((h, idx) => <th key={idx}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {enrollments.map((s) =>
            <tr key={s.enrollmentId}>
              <td>{s.enrollmentId}</td>
              <td>{s.sectionNo}</td>
              <td>{s.courseId}</td>
              <td>{s.sectionId}</td>
              <td>{s.building}</td>
              <td>{s.room}</td>
              <td>{s.times}</td>
              <td><button id="dropButton" onClick={() => onDelete(s.enrollmentId)}>Drop</button></td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );

}

export default ScheduleView;