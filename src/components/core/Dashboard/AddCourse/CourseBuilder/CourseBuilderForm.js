import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import {MdAddCircleOutline} from 'react-icons/md'
import {BiRightArrow} from 'react-icons/bi'
import IconBtn from "../../../../common/IconBtn"
import { useDispatch, useSelector } from 'react-redux'
import { setCourse, setEditCourse, setStep } from '../../../../../Slices/courseSlice'
import { toast } from 'react-toastify'
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI'
import NestedView from './NestedView'


const CourseBuilderForm = () => {

  const {register,handleSubmit, setValue,formState:{errors}} = useForm();
  const {course} = useSelector(state => state.course);
  const {token} = useSelector(state => state.auth);
  
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(false);
  const [editSectionName,setEditSectionName] = useState(null);


  const onSubmit = async(data) => {
    setLoading(true)
    let result

    // deals with backend
    if(editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id
        },token
      )
    }
    else{
      result = await createSection({
        sectionName: data.sectionName,
        courseId: course._id,

      },token)
      console.log("COURSE_ID",course._id)
      console.log(result)

    }

    //update values -- deals with frontend
    if(result){
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("sectionName","");
    }

    //loading false
    setLoading(false)
  }

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName","");
  }

  const goBack = () => {
    dispatch(setEditCourse(true))
  }

  const goToNext = () => {
    if(course.courseContent.length === 0){
      toast.error("Please add atleast one Section");
      return;
    }
    if(course.courseContent.some(section => section.subSection.length === 0)){
      toast.error("Please add atleast one lecture in each Section");
      return
    }
    //Everything is Good
    dispatch(setStep(3))
  }

  const handleChangeSectionName = (sectionId, sectionName) => {
    if(editSectionName === sectionId){
      cancelEdit();
      return;
    }

    setEditSectionName(sectionId);
    setValue("sectionName",sectionName);
  }

  return (
    <div>
      <p>Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* section name*/}
        <div>
          <label htmlFor='sectionName'>Section name<sup>*</sup></label>
          <input 
            id='sectionName'
            placeholder='Add Section Name'
            {...register('sectionName',{required:true})}
          />
          {errors.sectionName && (
            <span>Section Name is required</span>
          )}
        </div>

        {/* button nd icon */}
        <div className='flex text-richblack-5'>
          <IconBtn
            type="Submit"
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
            customClasses={"text-white"}
            icon={true}
          >
            <MdAddCircleOutline className='text-yellow ' size={20} />
          </IconBtn>
          {editSectionName && (
            <button
              type='button'
              onClick={cancelEdit}
              className='text-sm text-richblack-300 underline'
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>


        {course.courseContent.length > 0 && (
          <NestedView handleChangeSectionName ={handleChangeSectionName} />
        )}

        <div className='flex justify-end gap-x-3'>
          <button
            onClick={goBack}
            className='rounded-md cursor-pointer flex items-center'
          >
            Back
          </button>
          <IconBtn text={"Next"} onClick={goToNext} >
            <BiRightArrow />
          </IconBtn>
        </div>

    </div>
  )
}

export default CourseBuilderForm