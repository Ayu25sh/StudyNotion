
import {setLoading, setToken} from "../../Slices/authSlice";
import { apiConnector } from "../apiconnector";
import {  toast } from 'react-toastify';
import { authApi } from "../apis"
import {setUser} from "../../Slices/profileSlice"


export function sendOtp(email,navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST",authApi.POST_SEND_OTP_API,{
                email,
                checkUserPresent:true,
            })
            
            console.log("SENDOTP API RESPONSE.....",response);
            console.log(response.data.success);

            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("OTP sent Successfully");
            navigate("/verify-email");

        }catch(error){
            console.log("SENDOTP API ERROR ........",error);
            toast.error(error?.response?.data?.message);
        }
        dispatch(setLoading(false));
    }
}

export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
) {
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST",authApi.POST_SIGNUP_USER_API,{
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
            })

            console.log("SIGNUP API RESPONSE......",response);
            console.log(response.data.success);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Signup Successful")
            navigate("/login");

        }catch(error){
            console.log("SIGNUP API ERROR......",error);
            toast.error(error?.response?.data?.message);
            navigate("/signup")
            console.log(firstName);
        }
        dispatch(setLoading(false));
    }
}

export function login(email,password,navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST",authApi.POST_LOGIN_USER_API,{
                email,
                password
            });

            console.log("LOGIN API RESPONSE.........",response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Login Successfull");
            dispatch(setToken(response.data.token));
            const userImage = response.data?.user?.image
                ? response.data.user.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
            dispatch(setUser({ ...response.data.user, image: userImage }))
            localStorage.setItem("user", JSON.stringify(response.data.user))
            localStorage.setItem("token", JSON.stringify(response.data.token))
            
            navigate("/dashboard/my-profile")

        }catch(error){
            console.log("LOGIN API ERROR............", error)
            // toast.error(error.response.data.message)
        }
        dispatch(setLoading(false))
    }
}

export function getPasswordResetToken(email, setEmailSent){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST",authApi.POST_RESETPASSTOKEN_API,{email})

            console.log("RESETPASSTOKEN API Response ...",response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }
            
            toast.success("Reset Email Sent");
            setEmailSent(true);
        }catch(error){
            console.log("RESETPASS TOKEN ERROR......");
            toast.error("Failed to Send Reset Email");

        }
        dispatch(setLoading(false));
    }
}

export function resetPassword(password,confirmPassword,token){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST",authApi.POST_RESETPASSWORD_API,{
                password,
                confirmPassword,
                token
            })
            console.log("RESET PASSWORD RSEPONSE .......",response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Password reset successfully");

        }catch(error){
            console.log("RESETPASSWORD ERROR........",error);
            toast.error("Unable To Reset Password");
        }
        dispatch(setLoading(false));
    }
}

export function logout(navigate) {
    return (dispatch) => {
      dispatch(setToken(null))
      dispatch(setUser(null))
    //   dispatch(resetCart())
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Logged Out")
      navigate("/")
    }
  }
  
  

export function forgotPassword(password,confirmPassword,token){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("PUT",authApi.PUT_RESET_PASSWORD_API,{
                password,
                confirmPassword,
                token
            })
            console.log("RESET PASSWORD RSEPONSE .......",response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Password reset successfully");

        }catch(error){
            console.log("RESETPASSWORD ERROR........",error);
            toast.error("Unable To Reset Password");
        }
        dispatch(setLoading(false));
    }
}