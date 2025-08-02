import { Outlet, Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AssignmentsView from "./AssignmentsView";
import EnrollmentsView from "./EnrollmentsView";
import InstructorSectionsView from "./InstructorSectionsView";
import Logout from "../../Logout";

export const InstructorRouter = ({ logout }) => {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InstructorLayout />}>
            <Route index element={<InstructorSectionsView />} />
            <Route path="assignments" element={<AssignmentsView />} />
            <Route path="enrollments" element={<EnrollmentsView />} />
            <Route path="logout" element={<Logout logout={logout} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const InstructorLayout = () => {
  return (
    <>
      <nav>
        <Link id="homeLink" to="/">Home</Link>&nbsp;|&nbsp;
        <Link id="logoutLink" to="/logout">Logout</Link>
      </nav>
      <h1>Instructor Home</h1>
      Manage assignments and grades.
      <Outlet />
    </>
  );
};



export default InstructorLayout;
