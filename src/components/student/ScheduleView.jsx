import { useState,useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { REGISTRAR_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const ScheduleView = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');
  const [term, setTerm] = useState({ year:'', semester:'' });

  // Called when "Get Schedule" is clicked
  const handleGetSchedule = ({ year, semester }) => {
    setTerm({ year, semester });
    fetchEnrollments(year, semester);
  };

  const fetchEnrollments = async (year, semester) => {
    try {
      const res = await fetch(
        `${REGISTRAR_URL}/enrollments?year=${year}&semester=${semester}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      if (!res.ok) throw await res.json();
      setEnrollments(await res.json());
      setMessage('');
    } catch (e) {
      setMessage(e.message || JSON.stringify(e));
    }
  };

  const drop = async (enrollmentId) => {
    try {
      const res = await fetch(
        `${REGISTRAR_URL}/enrollments/${enrollmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setMessage('Course dropped');
      // refresh
      fetchEnrollments(term.year, term.semester);
    } catch (e) {
      setMessage(e.message);
    }
  };

  const confirmDrop = (e) => {
    confirmAlert({
      title: 'Confirm to drop',
      message: `Drop ${e.courseId} (sec ${e.secId})?`,
      buttons: [
        { label: 'Yes', onClick: () => drop(e.enrollmentId) },
        { label: 'No' }
      ]
    });
  };

  const headers = [
    'Enrollment Id','Section No','Course ID','Sec ID',
    'Building','Room','Times',''
  ];

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4 text-center">My Class Schedule</h3>
      <SelectTerm 
        buttonText="Get Schedule" 
        onClick={handleGetSchedule} 
      />
      <Messages response={message} />

      <table className="w-full table-auto border border-blue-300 mt-6">
        <thead className="bg-blue-100">
          <tr>
            {headers.map(h => (
              <th key={h} className="px-4 py-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {enrollments.map(e => (
            <tr key={e.enrollmentId} className="hover:bg-gray-50">
              <td className="px-4 py-2">{e.enrollmentId}</td>
              <td className="px-4 py-2">{e.sectionNo}</td>
              <td className="px-4 py-2">{e.courseId}</td>
              <td className="px-4 py-2">{e.sectionId}</td>
              <td className="px-4 py-2">{e.building}</td>
              <td className="px-4 py-2">{e.room}</td>
              <td className="px-4 py-2">{e.times}</td>
              <td className="px-4 py-2">
                <button 
                  className="bg-amber-300 rounded-lg px-4 py-2 hover:bg-amber-400"
                  onClick={() => confirmDrop(e)}
                >
                  Drop
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleView;