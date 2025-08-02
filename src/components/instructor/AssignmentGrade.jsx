import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentGrade = ({ assignment }) => {

  const [message, setMessage] = useState('');
  const [grades, setGrades] = useState([]);
  const dialogRef = useRef();


  const editOpen = () => {
    setMessage('');
    setGrades([]);
    fetchGrades(assignment.id);
    dialogRef.current.showModal();
  };

  const editClose = () => {
    dialogRef.current.close();
  };

  const fetchGrades = async (assignmentId) => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/assignments/${assignmentId}/grades`,
        {
          method: 'GET',
          headers: {
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setGrades(data);
      } else {
        setMessage(data);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const onSave = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/grades`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
          body: JSON.stringify(grades),
        });
      if (response.ok) {
        setMessage("Grades saved");
      } else {
        const rc = await response.json();
        setMessage(rc);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const onChange = (e) => {
    const copy_grades = grades.map((x) => x);
    // find the row that changed.  row 0 is column headings
    const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
    copy_grades[row_idx] = { ...(copy_grades[row_idx]), score: e.target.value };
    setGrades(copy_grades);
  }

  const headers = ['gradeId', 'student name', 'student email', 'score'];

  return (
    <>
      <button id="gradeButton" onClick={editOpen}>Grade</button>
      <dialog ref={dialogRef}>
        <h2>Grade Assignment</h2>
        <Messages response={message} />
        <table className="Center" >
          <thead>
            <tr>
              {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g.gradeId}>
                <td>{g.gradeId}</td>
                <td>{g.studentName}</td>
                <td>{g.studentEmail}</td>
                <td><input id="score" type="text" name="score" value={g.score} onChange={onChange} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button id="closeGradesButton" onClick={editClose}>Close</button>
        <button id="saveGradesButton" onClick={onSave}>Save</button>
      </dialog>
    </>
  );
}

export default AssignmentGrade;