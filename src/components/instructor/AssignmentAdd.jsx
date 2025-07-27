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

  // method to close dialog box
  const dialogClose = () => {
    dialogRef.current.close();
    onClose();
  };

  // method to keep have the textboxes update as you type
  const editChange = (event) => {
    setAssignment({ ...assignment, [event.target.name]: event.target.value });
  };

  // when clicking save, the contents entered in the box should be sent over to the backend
  const onSave = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(assignment),
      });
      if (response.ok) {
        setMessage("assignment added");
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
        <input
          type="text"
          name="title"
          placeholder="title"
          value={assignment.title}
          onChange={editChange}
        />
        <input
          type="date"
          name="dueDate"
          value={assignment.dueDate}
          onChange={editChange}
        />
        <button onClick={dialogClose}>Close</button>
        <button onClick={onSave}>Save</button>
      </dialog>
    </>
  )
}

export default AssignmentAdd;
