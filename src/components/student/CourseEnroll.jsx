import { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';
import SelectTerm from "../SelectTerm";

const CourseEnroll = () => {
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');

  // For debugging, see the data from backend
  useEffect(() => {
    if (sections && sections.length > 0) {
      console.log("Sections received from backend:", sections);
    }
  }, [sections]);

  const handleGetSections = ({ year, semester }) => {
    setYear(year);
    setSemester(semester);
  };

  useEffect(() => {
    if (!year || !semester) return;
    (async () => {
      try {
        const res = await fetch(
          `${REGISTRAR_URL}/sections/open?year=${year}&semester=${semester}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': sessionStorage.getItem('jwt'),
            },
          }
        );
        if (!res.ok) throw await res.json();
        const data = await res.json();
        setSections(data);
        setMessage('');
      } catch (e) {
        setMessage(e.message || JSON.stringify(e));
      }
    })();
  }, [year, semester]);

  const enroll = async (secNo) => {
    if (!secNo) {
    setMessage('Section number missing.');
    return;
   }
   console.log('Enrolling in section:', secNo);

    try {
      const res = await fetch(`${REGISTRAR_URL}/enrollments/sections/${secNo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('jwt'),
        },
 //       body: JSON.stringify({ secNo }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setMessage('Course added successfully');
      // re-fetch
      setYear(year); 
      setSemester(semester);
    } catch (e) {
      setMessage(e.message);
    }
  };

const confirmAdd = (sec) => {
  if (!sec.secNo) {
    setMessage('Section number is missing. Cannot enroll.');
    return;
  }
  confirmAlert({
    title: 'Confirm to ',
    message: `add ${sec.courseId} (sec ${sec.secNo || sec.sectionNo} )?`,
    buttons: [
      { label: 'Yes', onClick: () => enroll(sec.secNo || sec.sectionNo) },
      { label: 'No' }
    ]
  });
};

  const headers = [
    'Section No', 'Year', 'Semester', 'Course ID', 'Sec ID',
    'Title', 'Building', 'Room', 'Times', 'Instructor', ''
  ];

  return (
    <div className="p-6 w-full">
      <h3 className="text-2xl font-bold mb-4 text-center">
        Open Sections Available for Enrollment
      </h3>
      <SelectTerm 
        buttonText="Get Sections" 
        onClick={handleGetSections} 
      />
      <Messages response={message} />

      <div className="overflow-x-auto">
        <table className="w-full border border-blue-200 text-left">
          <thead className="bg-blue-100">
            <tr>
              {headers.map(h => (
                <th key={h} className="px-4 py-2 text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map(sec => (
              <tr 
                key={sec.secNo ? sec.secNo : `${sec.courseId}-${sec.sectionId}-${sec.building}`}
                className="hover:bg-gray-50 text-left"
              >
                <td className="px-4 py-2 min-w-[70px] text-left">{sec.secNo}</td>
                <td className="px-4 py-2 min-w-[70px] text-left">{sec.year}</td>
                <td className="px-4 py-2 min-w-[70px] text-left">{sec.semester}</td>
                <td className="px-4 py-2 min-w-[70px] text-left">{sec.courseId}</td>
                <td className="px-4 py-2 min-w-[70px] text-left">{sec.secId}</td>
                <td className="px-4 py-2 min-w-[70px] text-left">{sec.title}</td>
                <td className="px-4 py-2 min-w-[70px] text-left">{sec.building}</td>
                <td className="px-4 py-2 min-w-[70px] text-left">{sec.room}</td>
                <td className="px-4 py-2 min-w-[70px] text-left">{sec.times}</td>
                <td className="px-4 py-2 min-w-[70px] text-left">{sec.instructorName}</td>
                <td className="px-4 py-2 min-w-[70px] text-left">
                  <button 
                    className="bg-amber-300 rounded-lg px-4 py-2 hover:bg-amber-400"
                    onClick={() => confirmAdd(sec)}
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseEnroll;