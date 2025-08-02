import { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';

const CourseEnroll = (props) => {

  // student adds a course to their schedule

  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSections = async () => {
    // get list of open sections for enrollment
    try {
      const response = await fetch(`${REGISTRAR_URL}/sections/open`,
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
        setSections(data);
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchSections();
  }, []);

  const addSection = async (secNo) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments/sections/${secNo}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        })

      if (response.ok) {
        const data = await response.json();
        setMessage("section added. enrollment id=" + data.enrollmentId);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }

  }

  const onAdd = (secNo) => {
    confirmAlert({
      title: 'Confirm to add',
      message: 'Do you really want to add?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => addSection(secNo)
        },
        {
          label: 'No',
        }
      ]
    });
  }

  const headers = ['section No', 'year', 'semester', 'course Id', 'section', 'title', 'building', 'room', 'times', 'instructor', ''];

  return (
    <div>
      <Messages response={message} />
      <h3>Open Sections Available for Enrollment</h3>
      <table className="Center">
        <thead>
          <tr>
            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
          </tr>
        </thead>
        <tbody>
          {sections.map((s) => (
            <tr key={s.secNo}>
              <td>{s.secNo}</td>
              <td>{s.year}</td>
              <td>{s.semester}</td>
              <td>{s.courseId}</td>
              <td>{s.secId}</td>
              <td>{s.title}</td>
              <td>{s.building}</td>
              <td>{s.room}</td>
              <td>{s.times}</td>
              <td>{s.instructorName}</td>
              <td><button id="addCourseButton" onClick={() => onAdd(s.secNo)}>Add Course</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseEnroll;