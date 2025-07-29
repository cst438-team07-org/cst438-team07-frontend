import { useState, useEffect, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentUpdate = ({ editAssignment, onClose }) => {
  const [message, setMessage] = useState('');
  const [assignment, setAssignment] = useState({});
  const dialogRef = useRef();

  const editOpen = () => {
    setMessage('');
    setAssignment(editAssignment);
    // Open the dialog for editing assignment
    dialogRef.current.showModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignment(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(assignment),
      });

      if (response.ok) {
        setMessage("Assignment updated successfully.");
      } else {
        const body = await response.json();
        setMessage(body.message || "Update failed.");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleClose = () => {
    dialogRef.current.close();
    onClose();
  };

  return (
      <>
      <button onClick={editOpen}>Edit</button>
        <dialog ref={dialogRef}>
          <div className="p-4 w-96">
            <h3 className="text-lg font-bold mb-4">Edit Assignment</h3>
            <Messages response={message} />

            <div className="mb-2">
              <label>ID: </label>
              <span>{assignment.id}</span>
            </div>

            <div className="mb-2">
              <label>Title:</label><br />
              <input
                  type="text"
                  name="title"
                  value={assignment.title || ''}
                  onChange={handleChange}
                  className="border p-1 w-full"
              />
            </div>

            <div className="mb-4">
              <label>Due Date:</label><br />
              <input
                  type="date"
                  name="dueDate"
                  value={assignment.dueDate || ''}
                  onChange={handleChange}
                  className="border p-1 w-full"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={handleClose} className="bg-gray-400 text-white px-3 py-1 rounded">Close</button>
              <button onClick={handleSave} className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
            </div>
          </div>
        </dialog>
      </>
  );
};

export default AssignmentUpdate;

