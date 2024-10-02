import React,{useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
import { useNavigate } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';

import CoursesTable from './InstructorCourses/CoursesTable';

export default function MyCourses() {

    const navigate = useNavigate();
    const {token} = useSelector(state => state.auth)
    const [courses,setCourses] = useState([]);

    useEffect( ()=> {
        const fetchCourses = async() =>{
            const result = await fetchInstructorCourses(token)
            if(result){
                setCourses(result);
            }
        }
        fetchCourses();
    },[])

  return (
    <div className='text-richblack-5'>
        <div>
            <h1>My Courses</h1>
            <IconBtn 
                onClick={ () => navigate("/dashboard/add-course") }
                text= "Add Course"
                icon={true}

            />
        </div>

        {courses && <CoursesTable courses= {courses} setCourses= {setCourses}/>}
    </div>
  )
}
