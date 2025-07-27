import { useState, useEffect } from 'react';
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';


const Transcript = () => {

  const [message, setMessage] = useState('');
  const [courses, setCourses] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/transcripts`,
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
        setCourses(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const studentId = courses.length > 0 ? courses[0].studentId : '';
  const studentName = courses.length > 0 ? courses[0].name : '';

  const headers = ['Year', 'Semester', 'CourseId', 'Section', 'Title', 'Credits', 'Grade'];

  return (
    <div className="overflow-x-auto">
      <h3 className="text-2xl font-bold mb-4 text-center">Transcript</h3>
      {studentId && studentName && (
        <div className="text-center mb-4">
          <div>Student id : {studentId}</div>
          <div>Student name : {studentName}</div>
        </div>
      )}
      <Messages response={message} />
      <table className="w-full border border-blue-200 text-left">
        <thead>
        <tr className="bg-blue-100">{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
        {courses.map(c => (
            <tr key={c.enrollmentId || c.courseId} className="hover:bg-gray-50">
              <td className="p-2">{c.year}</td>
              <td className="p-2">{c.semester}</td>
              <td className="p-2">{c.courseId}</td>
              <td className="p-2">{c.sectionId || c.sectionNo || ''}</td>
              <td className="p-2">{c.title}</td>
              <td className="p-2">{c.credits}</td>
              <td className="p-2">{c.grade}</td>
            </tr>
        ))}
        </tbody>
      </table>

    </div>
  );
};

export default Transcript;