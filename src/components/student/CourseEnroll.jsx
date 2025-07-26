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
    <div className= "p-6 singleCol">
       <h3 className='text-2xl font-semibold mb-4 text-center'>Open Sections Available for Enrollment</h3>
      <SelectTerm onTermSelect={({year,semester})=>{setYear(year);setSemester(semester)}} buttonText='Get Sections'/>
      {message && <Messages response={message} className='text-red-600 font-bold mb-4' />}
      <table className='table-auto w-full border-separate border-spacing-y-3'>
        <thead>
          <tr>{headers.map(h=><th key={h} className='text-left'>{h}</th>)}</tr>
        </thead>
        <tbody>
          {sections.map(sec=>(
            <tr key={sec.id} className='hover:bg-gray-50'>
              {[sec.sectionNo,sec.year,sec.semester,sec.courseId,sec.section,sec.title,sec.building,sec.room,sec.times,sec.instructor]
                .map((td,i)=><td key={i}>{td}</td>)}
              <td>
                <button
                  className='border-2 border-indigo-600 text-indigo-600 rounded-lg px-4 py-2 hover:bg-indigo-50'
                  onClick={()=>confirmAdd(sec)}>
                  Add Course
                </button>
              </td>
            </tr>
        ))}
        </tbody>
      </table>

    </div>
  );
};

export default CourseEnroll;