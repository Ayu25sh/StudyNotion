import React,{useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react';
import {useParams} from 'react-router-dom'
import { getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI';
import { setCourse, setEditCourse } from '../../../../Slices/courseSlice';
import RenderSteps from '../AddCourse/RenderSteps';

export default function EditCourse() {

    const dispatch = useDispatch();
    const {courseId} = useParams();
    const {course}= useSelector((state) => state.course);
    const [loading,setLoading] = useState(false);
    const {token} = useSelector( state => state.auth)

    useEffect( ()=> {
        const populateCourseDetails = async() => {
            setLoading(true);
            const result = await getFullDetailsOfCourse(courseId,token);
            // console.log("result in edit",result);
            if(result?.courseDetails){
                // console.log("BEFORE in edit section details ---  ",course);
                dispatch(setEditCourse(true))
                dispatch(setCourse(result?.courseDetails))
                // console.log(" AFTER in edit section details ---  ",course);
            }
            setLoading(false);

        }
        populateCourseDetails();
    },[])
  return (
    <div className='text-richblack-900'>
        <h1>Edit Course</h1>
        <div>
            {
                course ? (<RenderSteps />) : (<p>Course Not Found</p>)
            }
        </div>
    </div>
  )
}
