import React,{useEffect, useState} from 'react'
import { useForm } from 'react-hook-form';
import CountryCode from "../../data/countrycode.json"

const ContactUsForm = () => {
    const [loading ,setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors,isSubmitSuccessful },
      } = useForm();
      
      const submitContactForm = async(data) => {
        console.log("Logging Data",data);
        try{
            setLoading(true);
            const response= {status:"OK"}
            console.log("Logging response",response);
            setLoading(false);
        }catch(error){
            console.log("Error",error.message);
            setLoading(false);
        }
      }

      useEffect( ()=> {
        if(isSubmitSuccessful){
            reset({
                email:"",
                firstname: "",
                lastname:"",
                message:"",
                phoneNo:"",
            })
        }
      },[reset,isSubmitSuccessful]);
  return (
    <form onSubmit={handleSubmit(submitContactForm)}>
        <div className='flex flex-col gap-14 '  >
            <div className='flex gap-6 '>
                {/* firstname */}
                <div className='flex flex-col'>
                    <label htmlFor='firstname'>First Name</label>
                    <input 
                        type='text'
                        name='firstname'
                        id='firstname'
                        placeholder='Enter first name'
                        className='text-black'
                        {...register("firstname",{required:true})}
                    />
                    {
                        errors.firstname && (
                            <span>
                                Please Enter Your Name
                            </span>
                        )
                    }
                </div>

                {/* lastname */}
                <div className='flex flex-col'>
                    <label htmlFor='lastname'>Last Name</label>
                    <input 
                        type='text'
                        name='lastname'
                        id='lastname'
                        className='text-black'
                        placeholder='Enter last name'
                        {...register("lastname")}
                    />
                </div>      
            </div>
        
            {/* email */}
            <div className='flex flex-col'>
                <label htmlFor='email'>Email Address</label>
                <input 
                    type='email'
                    name='email'
                    id='email'
                    className='text-black'
                    placeholder='Enter email address'
                    {...register("email",{required:true})}
                />
                {
                    errors.email && (
                        <span>
                            Please Enter Your Email Address
                        </span>
                    )
                }
            </div>

            {/* phoneNo */}
            <div className='flex flex-col gap-x-10'>
                <label htmlFor='phonenumber'>Phone Number</label>

                <div className='flex flex-row gap-3'>
                    {/* dropdown */}
                    <div className='flex flex-col gap-2 w-[80px] '>
                        <select
                            name="dropdown"
                            id='dropdown'
                            {...register("countrycode", {required:true})}
                            className='text-black'
                        >
                            {
                                CountryCode.map( (element,index) => {
                                    return (
                                        <option key={index} value={element.code} className='bg-richblack-900' >
                                            {element.code} - {element.country}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    
                    <div className='flex w-[calc(100%-90px)] flex-col gap-2'>
                        <input 
                            type='number'
                            name='phonenumber'
                            id='phonenumber'
                            placeholder='12345 67890'
                            className='text-black'
                            {...register("phoneNo",
                            {
                                required:{value:true,message:"Please enter Phone NUmber"},
                                maxLength:{value:10,message:"Invalid Phone Number"},
                                minLength:{value:0,message:"Invalid Phone Number"}
                            })}
                        />
                    </div>
                </div>
                {
                    errors.phoneNo && (
                        <span>
                            {
                                errors.phoneNo.message
                            }
                        </span>
                            
                    )
                }
            </div>

            {/* message */}
            <div className='flex flex-col'>
                <label htmlFor='message'> Message </label>
                <textarea 
                    name='message'
                    id='message'
                    rows={"7"}
                    cols={"30"}
                    className='text-black'
                    placeholder='Enter Your Message here'
                     {...register("message",{required:true})}
                 
                />
                {
                    errors.message && (
                        <span>
                            Please Enter Your Message 
                        </span>
                    )
                }
            </div>

            <button type='submit' className='rounded-md bg-yellow'>
                Send Message
            </button>
        </div>
    </form>
  )
}

export default ContactUsForm