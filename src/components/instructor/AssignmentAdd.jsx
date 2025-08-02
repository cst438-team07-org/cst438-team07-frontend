import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentAdd = ({ onClose, secNo }) => {

  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState({ title: '', dueDate: '' });
  const dialogRef = useRef();

  /*
   *  dialog for add assignment
   */
  const editOpen = () => {
    setMessage('');
    setAssignment({ ...assignment, secNo: secNo, title: '', dueDate: '' });
    dialogRef.current.showModal();
  };

  const editClose = () => {
    dialogRef.current.close();
    onClose();
  };

  const editChange = (event) => {
    setAssignment({ ...assignment, [event.target.name]: event.target.value })
  }

  const add = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
          body: JSON.stringify(assignment),
        });
      if (response.ok) {
        const body = await response.json();
        setMessage("assignment added. id=" + body.id);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  return (
    <>
      <button id="addAssignmentButton" onClick={editOpen}>Add Assignment</button>
      <dialog ref={dialogRef} >
        <h2>Add Assignment</h2>
        <Messages response={message} />
        <input id="title" type="text" label="title" name="title" value={assignment.title} placeholder="assignment title" onChange={editChange} />
        <input id="dueDate" type="date" label="dueDate" name="dueDate" value={assignment.dueDate} placeholder="due date" onChange={editChange} />
        <button id="closeAssignmentButton" onClick={editClose}>Close</button>
        <button id="saveAssignmentButton" onClick={add}>Save</button>
      </dialog>
    </>
  )
}

export default AssignmentAdd;
