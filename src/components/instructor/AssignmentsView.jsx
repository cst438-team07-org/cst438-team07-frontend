import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { GRADEBOOK_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';
import Messages from '../Messages';


const AssignmentsView = () => {

  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');

  // get value of state= from the <Link > invoking AssignmentsView
  const location = useLocation();
  const { secNo, courseId, secId } = location.state;


  const fetchAssignments = async () => {

    try {
      const response = await fetch(`${GRADEBOOK_URL}/sections/${secNo}/assignments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem("jwt"),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, []);


  const doDelete = async (id) => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        })
      if (response.ok) {
        setMessage("Assignment deleted");
        fetchAssignments();
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const onDelete = (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Do you really want to delete?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => doDelete(id)
        },
        {
          label: 'No',
        }
      ]
    });
  }

  const headers = ['id', 'Title', 'Due Date', '', '', ''];

  return (
    <div>
      <Messages response={message} />
      {(assignments.length > 0) ?
        <>
          <h3>{courseId}-{secId} Assignments</h3>
          <table className="Center" >
            <thead>
              <tr>
                {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.title}</td>
                  <td>{a.dueDate}</td>
                  <td><AssignmentGrade assignment={a} /></td>
                  <td><AssignmentUpdate editAssignment={a} onClose={fetchAssignments} /></td>
                  <td><button onClick={() => onDelete(a.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
        : null
      }

      <AssignmentAdd secNo={secNo} onClose={fetchAssignments} />
    </div>
  );
}

export default AssignmentsView;
