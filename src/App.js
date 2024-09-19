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
import Dashboard from './pages/Dashboard';
import Error from "./pages/Error"
import Setting from "./components/core/Dashboard/Settings/Setting"
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses';
import Cart from "./components/core/Dashboard/Cart/index"
import { ACCOUNT_TYPE } from './utils/Constants';
import { useSelector } from 'react-redux';
import AddCourse from "./components/core/Dashboard/AddCourse/index"

function App() {
  const {user} = useSelector( state => state.profile)
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter '>

      <Navbar />

      <Routes >
        <Route path='/' element={<Home />}/>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path='forgot-password' element={<ForgotPassword/>} />
        <Route path='verify-email' element={<VerifyEmail/>} />
        <Route path='update-password/:id' element={<UpdatePassword/>} />
        {/* <Route path='/dashboard/my-profile' element={<MyProfile/>} /> */}
        <Route path="about" element={<About />} />



        <Route  element={<PrivateRoute><Dashboard /></PrivateRoute>} >
          <Route path={'dashboard/my-profile'} element={<MyProfile />} />
          <Route path={'dashboard/settings'} element={<Setting />} />
          

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path={'dashboard/enrolled-courses'} element={<Cart />} />
                <Route path={'dashboard/enrolled-cart'} element={<EnrolledCourses />} />
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path={'dashboard/add-course'} element={<AddCourse />} />
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
