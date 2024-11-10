import logo from './logo.svg';
import React,{ useState } from 'react';
import './App.css';
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Navbar from "./components/common/Navbar"
import ForgotPassword from './pages/ForgotPassword';
import { Routes,Route } from 'react-router-dom';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import MyProfile from './components/core/Dashboard/MyProfile';
import About from "./pages/About"
import PrivateRoute from './components/core/Auth/PrivateRoute';
import OpenRoute from './components/core/Auth/OpenRoute';
import Dashboard from './pages/Dashboard';
import Error from "./pages/Error"
import Setting from "./components/core/Dashboard/Settings/Setting"
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses';
import Cart from "./components/core/Dashboard/Cart/index"
import { ACCOUNT_TYPE } from './utils/Constants';
import { useSelector } from 'react-redux';
import AddCourse from "./components/core/Dashboard/AddCourse/index"
import MyCourses from "./components/core/Dashboard/MyCourses"
import EditCourse from './components/core/Dashboard/EditCourse/index';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails';
import ViewCourse from './pages/ViewCourse';
import VideoDetails from './components/core/ViewCourse/VideoDetails';
import Contact from './pages/Contact';
import Instructor from './components/core/Dashboard/InstructorDashboard.js/Instructor'


function App() {
  const {user} = useSelector( state => state.profile)
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter '>

      <Navbar />

      <Routes >
        <Route path='/' element={<Home />}/>
        <Route path='catalog/:catalogName' element={<Catalog />}/>
        <Route path="courses/:courseId" element={<CourseDetails/>} />
        <Route path="about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="login" element={<OpenRoute> <Login /> </OpenRoute>}/>
        <Route path="signup" element={<OpenRoute> <SignUp /> </OpenRoute>}/>
        <Route path="forgot-password" element={<OpenRoute> <ForgotPassword /> </OpenRoute>}/>
        <Route path="verify-email" element={<OpenRoute> <VerifyEmail /> </OpenRoute>}/>
        <Route path="update-password/:id" element={<OpenRoute> <UpdatePassword /> </OpenRoute>}/>

        <Route  element={<PrivateRoute><Dashboard /></PrivateRoute>} >
          <Route path={'dashboard/my-profile'} element={<MyProfile />} />
          <Route path={'dashboard/settings'} element={<Setting />} />

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path={'dashboard/cart'} element={<Cart />} />
                <Route path={'dashboard/enrolled-courses'} element={<EnrolledCourses />} />
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/instructor" element={<Instructor />} />
                <Route path={'dashboard/add-course'} element={<AddCourse />} />
                <Route path={'dashboard/my-courses'} element={<MyCourses />} />
                <Route path={'dashboard/edit-course/:courseId'} element={<EditCourse />} />
              </>
            )
          }

        </Route>

        <Route  element={<PrivateRoute><ViewCourse /></PrivateRoute>}>
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path={'view-course/:courseId/section/:sectionId/sub-section/:subSectionId'} element={<VideoDetails />} />
              </>
            )
          }
        </Route>

        <Route path='*' element={<Error/>} />

      </Routes>
    </div>
  );
}

export default App;
