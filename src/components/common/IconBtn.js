import React from 'react'
import {FiEdit} from "react-icons/fi"
import { MdOutlineFileUpload } from "react-icons/md";


const IconBtn = ({
    text,
    onClick,
    children,
    disabled,
    outline=false,
    customClasses,
    type,
    icon
}) => {
  return (
    <button
        disabled={disabled}
        onClick={onClick}
        type={type}
        className='flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 text-sm md:text-lg px-3 md:px-5 font-semibold text-richblack-900 undefined' >
            {
                children ? (
                    <>
                        <span>
                            {text}
                        </span>
                        {children}
                    </>
                ) : (text)
            }
           { icon ? " "  : <FiEdit/>}
    </button>
  )
}

export default IconBtn