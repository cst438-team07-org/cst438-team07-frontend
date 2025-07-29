import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { GRADEBOOK_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';
import Messages from '../Messages';

const AssignmentsView = () => {
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');

  const location = useLocation();
  const { secNo, courseId, secId } = location.state;

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/sections/${secNo}/assignments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem("jwt"),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this assignment?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const response = await fetch(`${GRADEBOOK_URL}/assignments/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': sessionStorage.getItem("jwt"),
                },
              });
              if (response.ok) {
                setMessage("Assignment deleted");
                fetchAssignments();
              } else {
                const body = await response.json();
                setMessage(body.message || "Error deleting assignment");
              }
            } catch (err) {
              setMessage(err.message);
            }
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const headers = ['id', 'Title', 'Due Date', '', '', ''];

  return (
      <div>
        <h2>Assignments for {courseId} - Section {secNo}</h2>
        <Messages response={message} />

        <table className="min-w-full border border-gray-300 mt-4">
          <thead>
          <tr className="bg-gray-200">
            {headers.map((h, index) => (
                <th key={index} className="p-2 border">{h}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {assignments.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-2 border">{a.id}</td>
                <td className="p-2 border">{a.title}</td>
                <td className="p-2 border">{a.dueDate}</td>
                <td className="p-2 border">
                  <AssignmentGrade assignment={a} onClose={fetchAssignments}/>
                </td>
                <td className="p-2 border">
                  <AssignmentUpdate
                      editAssignment={a}
                      onClose={fetchAssignments}
                  />
                </td>
                <td className="p-2 border">
                  <button
                      onClick={() => handleDelete(a.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>

        <div className="mt-6">
          <AssignmentAdd secNo={secNo} onClose={fetchAssignments} />
        </div>

      </div>
  );
};

export default AssignmentsView;