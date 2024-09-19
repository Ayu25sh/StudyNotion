import React from 'react'
import Template from "../components/core/Auth/Template"
import signUpImg from "../assets/Images/signup.webp"

const SignUp = () => {
  return (
    <div>
        <Template 
            title="Join the millions learning to code with study notion for free"
            desc1="Build skils for today,tomorrow and beyond"
            desc2="Education to future-proof your career"
            image={signUpImg}
            formType="signup"
        />
    </div>
  )
}

export default SignUp;