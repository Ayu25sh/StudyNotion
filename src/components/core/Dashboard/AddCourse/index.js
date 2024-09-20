import React from 'react'
import RenderSteps from "./RenderSteps"

export default function AddCourse() {
  return (
    <div className='text-white flex justify-between' >
        <div className='min-w-[500px] '>
            <h1 className='text-4xl text-richblack-5 '>Add Course</h1>
            {/* whole form section */}
            <div>
                <RenderSteps />
            </div>
        </div>

        {/* rigth section */}
        <div>
            <p>⚡Course Upload Tips</p>
            <ul>
                <li>Set the Course Price option or make it free.</li>
                <li>Standard size for the course thumbnail is 1024x576.</li>
                <li>Video section controls the course overview video.</li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    </div>
  )
}
