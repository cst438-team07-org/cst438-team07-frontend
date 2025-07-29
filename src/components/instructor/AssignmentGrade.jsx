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
      const response = await fetch(`${GRADEBOOK_URL}/assignments/${assignmentId}/grades`, {
        method: 'GET',
        headers: {
          'Authorization': sessionStorage.getItem('jwt'),
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Add a localScore field to each grade for editing
        setGrades(data.map(grade => ({ ...grade, localScore: grade.score })));
      } else {
        setMessage(data);
      }
    } catch (err) {
      setMessage(err.toString());
    }
  };

  const handleScoreChange = (index, newScore) => {
    const updatedGrades = [...grades];
    updatedGrades[index].localScore = newScore;
    setGrades(updatedGrades);
  };

  const handleSave = async () => {
    try {
      for (const grade of grades) {
        await fetch(`${GRADEBOOK_URL}/grades/${grade.gradeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
          body: JSON.stringify({ score: grade.localScore }),
        });
      }
      setMessage('Grades saved successfully.');
      editClose();
    } catch (err) {
      setMessage(err.toString());
    }
  };

  return (
      <>
        <button id="gradeButton" onClick={editOpen}>Grade</button>

        <dialog ref={dialogRef}>
          <h3>Grade Assignment: {assignment.name}</h3>

          {message && <Messages message={message} />}

          <table>
            <thead>
            <tr>
              <th>Grade ID</th>
              <th>Student Name</th>
              <th>Student Email</th>
              <th>Score</th>
            </tr>
            </thead>
            <tbody>
            {grades.map((grade, index) => (
                <tr key={grade.gradeId}>
                  <td>{grade.gradeId}</td>
                  <td>{grade.studentName}</td>
                  <td>{grade.studentEmail}</td>
                  <td>
                    <input
                        type="number"
                        value={grade.localScore}
                        onChange={(e) => handleScoreChange(index, e.target.value)}
                    />
                  </td>
                </tr>
            ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1rem' }}>
            <button onClick={editClose}>Close</button>
            <button onClick={handleSave}>Save</button>
          </div>
        </dialog>
      </>
  );
};

export default AssignmentGrade;
