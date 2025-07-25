import { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';
import SelectTerm from "../SelectTerm";

const CourseEnroll = (props) => {

  // student adds a course to their schedule
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSections = async () => {
    // get list of open sections for enrollment
    try {
      const response = await fetch(`${REGISTRAR_URL}/open?year=${year}&semester=${semester}`,
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

  const enroll = async (sectionId) => {
    try {
      const res = await fetch(`${REGISTRAR_URL}/studentSchedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('jwt'),
        },
        body: JSON.stringify({ sectionId }),
      });
      if (res.ok) {
        setMessage('Course added successfully');
        fetchSections();
      } else {
        setMessage('Error adding course: ' + res.status);
      }
    } catch (err) {
      setMessage('Network error: ' + err);
    }
  };

  const confirmAdd = (sec) => {
    confirmAlert({
      title: 'Confirm to add',
      message: `Are you sure you want to add ${sec.courseId} - ${sec.title}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => enroll(sec.id),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const headers = ['section No', 'year', 'semester', 'course Id', 'section', 'title', 'building', 'room', 'times', 'instructor', ''];

  return (
    <div>
      <Messages response={message} />
      <h3>Open Sections Available for Enrollment</h3>
      <p>To be implemented. Display a table of sections that are open for enrollment with columns in headers.
        The last column is an "Add" button that when clicked will first confirm that user want to add
        the course, then adds the course to the students schedule.
      </p>
      <SelectTerm onTermSelect={({ year, semester }) => { setYear(year); setSemester(semester); }} />
      <Messages response={message} />
      <table>
        <thead>
        <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
        {sections.map(sec => (
            <tr key={sec.id}>
              <td>{sec.sectionNo || sec.id}</td>
              <td>{sec.year}</td>
              <td>{sec.semester}</td>
              <td>{sec.courseId}</td>
              <td>{sec.section}</td>
              <td>{sec.title}</td>
              <td>{sec.building}</td>
              <td>{sec.room}</td>
              <td>{sec.times}</td>
              <td>{sec.instructor}</td>
              <td><button onClick={() => confirmAdd(sec)}>Add</button></td>
            </tr>
        ))}
        </tbody>
      </table>

    </div>
  );
};

export default CourseEnroll;