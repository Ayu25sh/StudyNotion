import React,{useState} from 'react'
import {useSelector,useDispatch} from "react-redux"
import {Link} from "react-router-dom"
import { getPasswordResetToken } from '../services/operations/authAPI'
import { BiArrowBack } from "react-icons/bi"


const ForgotPassword = () => {

    const {loading} = useSelector( state => state.auth);
    const [emailSent,setEmailSent] = useState(false);
    const [email,setEmail] = useState("");
    const dispatch = useDispatch();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent));
    }

  return (
    <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center text-richblack-100'>
        {
            loading ? (
                <div>
                    Loading....
                </div>
            ) : (
                <div className='max-w-[500px] p-4 lg:p-8'>
                    <h1 className='text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5' >
                        {
                            !emailSent ? "Reset you Password" : "Check Your Email"
                        }
                    </h1>
                    <p className='my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100'>
                        {
                            !emailSent ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery" : `We have sent the reset email to ${email}`
                        }
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        {
                            !emailSent && (
                                <label className='w-full'>
                                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-25">Email Address <sup className="text-pink-200 ">*</sup></p>
                                    <input
                                     type="email"
                                     name='email'
                                     required
                                     value={email}
                                     onChange={ e => setEmail(e.target.value)}
                                     placeholder='myemailaddress@gmail.com'
                                     className="bg-richblack-800 rounded-[8px] p-2 py-[12px]  w-full text-richblack-25"
                                     />
                                </label>
                            )
                        }

                        <button type='submit' className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900">
                            {
                                !emailSent ? "Reset Password " : "Resend Email"
                            }
                        </button>

                    </form>

                    
                    <div className="mt-6 flex items-center justify-between">
                        <Link to={"/login"}>
                            <p className="flex items-center gap-x-2 "><BiArrowBack /> Back to Login</p>
                        </Link>
                    </div>

                </div>
            )
        }
    </div>
  )
}

export default ForgotPassword