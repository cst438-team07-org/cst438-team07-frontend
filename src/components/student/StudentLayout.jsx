import { Outlet, Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScheduleView from "./ScheduleView";
import Transcript from "./Transcript";
import CourseEnroll from "./CourseEnroll";
import AssignmentsStudentView from "./AssignmentsStudentView";
import Logout from "../../Logout";

export const StudentRouter = ({ logout }) => {

  return (
    <div className="App">
      <BrowserRouter>
        <nav className="bg-blue-200 p-4 mb-4">
          <Link to="/" className="mr-4 font-medium hover:text-blue-800">Home</Link> |
          <Link to="enroll" className="mr-4 font-medium hover:text-blue-800">Add/Drop Courses</Link> |
          <Link to="schedule" className="mr-4 font-medium hover:text-blue-800">My Schedule</Link> |
          <Link to="transcript" className="mr-4 font-medium hover:text-blue-800">Transcript</Link> |
          <Link to="logout" className="mr-4 font-medium hover:text-blue-600">Logout</Link>
        </nav>
        <Routes>
          <Route path="/" element={<StudentLayout/>}>
            <Route index element={<StudentHome/>}/>
            <Route path="studentAssignments"
                   element={<AssignmentsStudentView/>}/>
            <Route path="schedule" element={<ScheduleView/>}/>
            <Route path="addCourse" element={<CourseEnroll/>}/>
            <Route path="transcript" element={<Transcript/>}/>
            <Route path="logout" element={<Logout logout={logout}/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export const StudentHome = () => {
  return (
      <div>
        <h1>Student Home</h1>
      </div>
  );
};

export const StudentLayout = () => {
  return (
      <>
        <nav className="bg-blue-200 p-4 mb-4">
          <Link to="/" className="mr-4 font-medium hover:text-blue-800">Home</Link> &nbsp;|&nbsp;
        <Link id="scheduleLink" to="/schedule" className="mr-4 font-medium hover:text-blue-800">View Class Schedule</Link>&nbsp;|&nbsp;
        <Link id="addCourseLink" to="/addCourse" className="mr-4 font-medium hover:text-blue-800">Enroll in a class</Link>&nbsp;|&nbsp;
        <Link id="viewAssignmentsLink" to="/studentAssignments" className="mr-4 font-medium hover:text-blue-800">View Assignments</Link>&nbsp;|&nbsp;
        <Link id="transcriptLink" to="/transcript" className="mr-4 font-medium hover:text-blue-800">View Transcript</Link>&nbsp;|&nbsp;
        <Link id="logoutLink" to="/logout" className="font-medium hover:text-red-600">Logout</Link>
      </nav>
      <Outlet />
    </>
  );
};
