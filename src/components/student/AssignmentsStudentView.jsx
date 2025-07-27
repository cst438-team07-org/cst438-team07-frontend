import { useState, useEffect } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';

const AssignmentsStudentView = () => {

  const [message, setMessage] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [term, setTerm] = useState({ year: '', semester: '' });


  const fetchData = async ({ year, semester }) => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments?year=${year}&semester=${semester}`,
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
        setAssignments(data);
      } else {
        const rc = await response.json();
        setMessage(rc);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const handleGetAssignments = ({ year, semester }) => {
  setTerm({ year, semester });
  fetchData({ year, semester });
  };

  useEffect(() => {
  if(term.year && term.semester) {
    fetchData(term);
  }
  }, [term]);


  const headers = ['Course', 'Title', 'DueDate', 'Score'];

  return (
    <div className="p-6 w-full">
      <h3 className="text-2xl font-bold mb-4 text-center">Assignments</h3>
      <Messages response={message} />

      <SelectTerm buttonText="Get Assignments" onClick={handleGetAssignments} />

      <table className="w-full border border-blue-300 mt-6 text-left">
        <thead className="bg-blue-100">
          <tr>
            {headers.map(h => (
              <th key={h} className="px-4 py-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assignments.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="text-center py-6">
                {term.year && term.semester ? "No assignments found for this term." : "Select a term to view assignments."}
              </td>
            </tr>
          ) : (
            assignments.map((a, idx) => (
              <tr key={a.assignmentId || idx} className="hover:bg-gray-50">
                <td className="px-4 py-2">{a.courseId || a.course || ""}</td>
                <td className="px-4 py-2">{a.title}</td>
                <td className="px-4 py-2">{a.dueDate}</td>
                <td className="px-4 py-2">{a.score !== undefined ? a.score : ''}</td>
              </tr>
            ))
          )}
        </tbody>
    
      </table>
    </div>
  );
}

export default AssignmentsStudentView;