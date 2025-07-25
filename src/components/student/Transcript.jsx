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

  const headers = ['Year', 'Semester', 'CourseId', 'Section', 'Title', 'Credits', 'Grade'];

  return (
    <div className="p-6 singleCol">
      <h3 className="text-2xl font-bold mb-4">Transcript</h3>
      <p>To be implemented.  Display a table showing the course a student has taken.
        The table columns are given in headers.
      </p>
      <Messages response={message} />
      <table className="bg-white shadow-md rounded-lg overflow-hidden w-full">
        <thead>
        <tr className="bg-blue-100">{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
        {courses.map(c => (
            <tr key={c.enrollmentId || c.courseId} className="hover:bg-gray-50">
              <td className="p-2">{c.year}</td>
              <td className="p-2">{c.semester}</td>
              <td className="p-2">{c.courseId}</td>
              <td className="p-2">{c.section}</td>
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