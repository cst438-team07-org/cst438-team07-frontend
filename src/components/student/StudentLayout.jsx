import { Outlet, Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScheduleView from "./ScheduleView";
import Transcript from "./Transcript";
import CourseEnroll from "./CourseEnroll";
import AssignmentsStudentView from "./AssignmentsStudentView";
import Logout from "../../Logout";

const StudentLayout = ({ logout }) => (
  <>
    <nav className='bg-blue-100 p-4 text-center'>
      <Link to=''           className='mx-2 hover:text-blue-800'>Home</Link> |
      <Link to='schedule'   className='mx-2 hover:text-blue-800'>View Class Schedule</Link> |
      <Link to='enroll'     className='mx-2 hover:text-blue-800'>Enroll in a class</Link> |
      <Link to='assignments'className='mx-2 hover:text-blue-800'>View Assignments</Link> |
      <Link to='transcript' className='mx-2 hover:text-blue-800'>View Transcript</Link> |
      <Link to='logout'     className='mx-2 hover:text-red-600'>Logout</Link>
    </nav>
    <div className='p-6'>
      <Outlet />
    </div>
  </>
);

const StudentHome = () => (
  <div className='text-center'>
    <h1 className="text-2xl font-bold mb-4 text-center">Welcome Student!</h1>
  </div>
);

export const StudentRouter = ({ logout }) => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<StudentLayout logout={logout}/>}>        
        <Route index element={<StudentHome />} />
        <Route path='enroll'       element={<CourseEnroll />} />
        <Route path='schedule'     element={<ScheduleView />} />
        <Route path='assignments'  element={<AssignmentsStudentView />} />
        <Route path='transcript'   element={<Transcript />} />
        <Route path='logout'       element={<Logout logout={logout} />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default StudentRouter;
