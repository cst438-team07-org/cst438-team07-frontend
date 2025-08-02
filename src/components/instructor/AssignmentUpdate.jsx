import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentUpdate = ({ editAssignment, onClose }) => {


  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState({});
  const dialogRef = useRef();

  /*
   *  dialog for edit of an assignment
   */
  const editOpen = () => {
    setMessage('');
    setAssignment(editAssignment);
    dialogRef.current.showModal();
  };

  const editClose = () => {
    dialogRef.current.close();
    onClose();
  };

  const editChange = (event) => {
    setAssignment({ ...assignment, [event.target.name]: event.target.value })
  }

  const save = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
          body: JSON.stringify(assignment),
        });
      if (response.ok) {
        const body = await response.json();
        setMessage("assignment updated");
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
      <button onClick={editOpen}>Edit</button>
      <dialog ref={dialogRef} >
        <h2>Edit Assignment</h2>
        <Messages response={message} />
        <input type="text" label="id" name="id" value={assignment.id} readOnly />
        <input type="text" placeholder="assignment title" label="title" name="title" value={assignment.title} onChange={editChange} />
        <input type="date" placeholder="due date" label="dueDate" name="dueDate" value={assignment.dueDate} onChange={editChange} />
        <button onClick={editClose}>Close</button>
        <button onClick={save}>Save</button>
      </dialog>
    </>
  )
}

export default AssignmentUpdate;
