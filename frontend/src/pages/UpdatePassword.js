import React, { useState } from 'react'
import Spinner from "../components/common/Spinner"
import {useSelector} from "react-redux"
import {useLocation,Link} from "react-router-dom"
import {useDispatch} from "react-redux"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import {resetPassword} from "../services/operations/authAPI"
import { BiArrowBack } from "react-icons/bi"



const UpdatePassword = () => {
    const {loading} = useSelector( state => state.auth);
    
    const location = useLocation();
    const dispatch = useDispatch();

    const [formData,setFormData] = useState({
        password:"",
        confirmpassword:"",
    })
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);

    const {password,confirmpassword} = formData;

    const handleOnChange = (e) => {
        setFormData( (prevData) => ({
            ...prevData,
            [e.target.name]:e.target.value,
        }))
    }

    const handleOnSubmit = (e) =>{
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password,confirmpassword,token));
    }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center" >
        {
            loading ? (<Spinner />) : (
                <div className='flex flex-col max-w-[500px] p-4 lg:p-8 '>
                    <h1 className='text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5'>Choose new Password</h1>
                    <p className='my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100'>Almost done. Enter your new password and youre all set</p>
                    <form onSubmit={handleOnSubmit}  >
                        <label className='relative'>
                            <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'> New password <sup className="text-pink-200">*</sup></p>
                            <input 
                                required
                                type= {showPassword ? "text" : "password"}
                                placeholder='*********'
                                name='password'
                                value={password}
                                onChange={handleOnChange}
                                className="bg-richblack-800 rounded-[8px] p-2 py-[12px]  w-full text-richblack-25"
                                />
                            <span onClick={ () => setShowPassword( (prev) => !prev)} className="absolute right-3 top-[38px] z-[10] cursor-pointer" >
                                {
                                    showPassword ? <AiOutlineEyeInvisible fill="#AFB2BF" fontSize={24} /> : <AiOutlineEye fill="#AFB2BF" fontSize={24}   />
                                }
                            </span>
                        </label>
                        <label className="relative mt-4 block">
                        <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>Confirm New password <sup className='className="text-pink-200"'>*</sup></p>                            
                            <input 
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder='*********'
                                name='confirmpassword'
                                value={confirmpassword}
                                onChange={handleOnChange}
                                className="bg-richblack-800 rounded-[8px] p-2 py-[12px]  w-full text-richblack-25"
                                />
                            <span onClick={() => setShowConfirmPassword( (prev) => !prev)} className="absolute right-3 top-[38px] z-[10] cursor-pointer" >
                                {
                                    showConfirmPassword ? <AiOutlineEyeInvisible fill="#AFB2BF" fontSize={24} /> : <AiOutlineEye fill="#AFB2BF" fontSize={24} />
                                }
                            </span>
                        </label>
                        <button type='Submit'              
                         className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
                        >
                            Reset Password
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between">
                        <Link to={"/login"}>
                            <p className="flex items-center gap-x-2 text-richblack-5"><BiArrowBack /> Back To Login</p>
                        </Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword;