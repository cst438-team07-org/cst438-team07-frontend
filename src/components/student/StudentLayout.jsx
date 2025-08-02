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
        <Routes>
          <Route path="/" element={<StudentLayout />}>
            <Route index element={<StudentHome />} />
            <Route path="studentAssignments" element={<AssignmentsStudentView />} />
            <Route path="schedule" element={<ScheduleView />} />
            <Route path="addCourse" element={<CourseEnroll />} />
            <Route path="transcript" element={<Transcript />} />
            <Route path="logout" element={<Logout logout={logout} />} />
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
      <nav>
        <Link to="/">Home</Link> &nbsp;|&nbsp;
        <Link id="scheduleLink" to="/schedule">View Class Schedule</Link>&nbsp;|&nbsp;
        <Link id="addCourseLink" to="/addCourse">Enroll in a class</Link>&nbsp;|&nbsp;
        <Link id="viewAssignmentsLink" to="/studentAssignments">View Assignments</Link>&nbsp;|&nbsp;
        <Link id="transcriptLink" to="/transcript">View Transcript</Link>&nbsp;|&nbsp;
        <Link id="logoutLink" to="/logout">Logout</Link>
      </nav>
      <Outlet />
    </>
  );
};
