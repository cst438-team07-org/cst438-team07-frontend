import { useState, useRef } from 'react';
import { GRADEBOOK_URL } from '../../Constants';
import Messages from '../Messages';

const AssignmentGrade = ({ assignment }) => {
  const [message, setMessage] = useState('');
  const [grades, setGrades] = useState([]);
  const dialogRef = useRef();

  const gradeOpen = () => {
    setMessage('');
    setGrades([]);
    fetchGrades(assignment.id);
    // to be implemented.  invoke showModal() method on the dialog element.

    dialogRef.current.showModal();
  };

  const gradeClose = () => {
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
  }

  const onSave = async () => {
    try {
      const response = await fetch(`${GRADEBOOK_URL}/grades`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem("jwt"),
        },
        body: JSON.stringify(grades),
      });
      if (response.ok) {
        setMessage("Grades saved");
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }



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
      <button id="gradeButton" onClick={gradeOpen}>Grade</button>
      <dialog ref={dialogRef}>
        <h3>Grade Assignment</h3>
        <Messages response={message} />
        <table className="Center">
          <thead>
          <tr>
            {headers.map((s, idx) => (
              <th key={idx}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grades.map((g) => (
            <tr key={g.gradeId}>
              <td>{g.gradeId}</td>
              <td>{g.studentName}</td>
              <td>{g.studentEmail}</td>
              <td><input type="number" name="score" value={g.score === null ? "" : g.score} onChange={(event) => {
                const newGrades = grades.map(grade => 
                  grade.gradeId === g.gradeId ? { ...grade, score: event.target.value } : grade
                );
                setGrades(newGrades);
              }} /></td>
            </tr>
          ))}
        </tbody>
          
        </table>
        <button onClick={gradeClose}>Close</button>
        <button onClick={onSave}>Save</button>

      </dialog>
    </>

  );
};

export default AssignmentGrade;
