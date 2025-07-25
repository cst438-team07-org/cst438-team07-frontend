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
      <div className="p-6 singleCol">
        <Messages response={message} className="errorMessage mb-4"/>
        <SelectTerm buttonText="Get Schedule" onClick={prefetchEnrollments}/>
        <p>To be implemented. Display a table with the sections the student is
          enrolled in for the given term.
          For each section, display the columns as given in headings.
          For each table row, a Drop button will allow the student to drop the
          section.
          Confirm that the user wants to drop before doing the REST delete
          request.
        </p>
        <table className="bg-white shadow-md rounded-lg overflow-hidden w-full">
          <thead>
          <tr className="bg-blue-100">{headings.map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
          {enrollments.map(e => (
              <tr key={e.enrollmentId} className="hover:bg-gray-50">
                <td className="p-2">{e.enrollmentId}</td>
                <td className="p-2">{e.secNo}</td>
                <td className="p-2">{e.courseId}</td>
                <td className="p-2">{e.secId}</td>
                <td className="p-2">{e.building}</td>
                <td className="p-2">{e.room}</td>
                <td className="p-2">{e.times}</td>
                <td className="p-2">
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