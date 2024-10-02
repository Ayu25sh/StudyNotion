import React, { useState } from 'react'
import {useForm} from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../../common/IconBtn';
import { resetCourseState, setStep } from '../../../../../Slices/courseSlice';
import { COURSE_STATUS } from '../../../../../utils/Constants';
import { Navigate } from 'react-router-dom';
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';

export default function PublishCourse() {

    const {handleSubmit,register,setValue, getValues, formState: {errors}} = useForm()
    const {course} = useSelector(state => state.course);
    const {token} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [loading,setLoading] = useState()

    const goBack = () => {
        dispatch(setStep(2));
    }

    const goToCourses = () => {
        dispatch(resetCourseState())
        // navigate("/dashboard/my-courses");
    }

    const handleCoursePublish = async() => {

        if((course?.status === COURSE_STATUS.PUBLISHED && getValues('public') === true) ||
            (course?.status === COURSE_STATUS.DRAFT && getValues('public') === false)){
                goToCourses();
                return;
        }

        const formData = new FormData();
        formData.append('courseId',course._id)
        const courseStatus = getValues('public') ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
        formData.append("status",courseStatus);

        setLoading(true);
        const result = await editCourseDetails(formData,token);

        if(result){
            goToCourses();
        }
        setLoading(false);
    }

    const onSubmit = () => {
        handleCoursePublish();
    }

  return (
    <div className='rounded-md border-[1px] bg-richblack-800 border-richblack-700'>
        <p className='text-richblack-300 text'>Publish Course</p>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor='public'>
                <input 
                    id='public'
                    type='checkbox'
                    {...register("public")}
                    className='rounded h-4 w-4'
                />
                <span className='ml-3'>Make this Course as Public</span>
                </label>
            </div>

            <div>
                <button 
                    disabled={loading}
                    type='button'
                    onClick={goBack}
                    className='flex items-center rounded-md'
                >
                    Back
                </button>
                <IconBtn 
                    disabled={loading}
                    text="save changes"
                    icon={true}
                />
            </div>
        </form>
    </div>
  )
}
