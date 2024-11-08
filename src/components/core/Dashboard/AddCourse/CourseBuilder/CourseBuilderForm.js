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
  const [editSectionName,setEditSectionName] = useState(false);


  const onSubmit = async(data) => {
    setLoading(true)
    let result

    // deals with backend
    if(editSectionName) {
      console.log("before calling from front")
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id
        },token
      )
      console.log("after calling from front",result)

    }
    else{
      console.log("before");
      result = await createSection({
        sectionName: data.sectionName,
        courseId: course._id,
      },token)

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
    dispatch(setStep(1));
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
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* section name*/}
        <div  className="flex flex-col space-y-2">
          <label  className="text-sm text-richblack-5" htmlFor="sectionName">Section Name <sup className='text-pink-200'>*</sup></label>
          <input 
            id='sectionName'
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Section Name is required</span>
          )}
        </div>

        {/* button nd icon */}
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="Submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
            icon={true}
            
          >
            <MdAddCircleOutline className='text-yellow-50' size={20} />
          </IconBtn>
          {editSectionName && (
            <button
              type='button'
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"            
            >
              Cancel Edit
            </button>
          )}
        </div>

      </form>

        {course?.courseContent?.length > 0 && (
          <NestedView handleChangeSectionName ={handleChangeSectionName} />
        )}

        <div className='flex justify-end gap-x-3'>

          <button
            onClick={goBack}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}   
          >
            Back
          </button>

          <IconBtn disabled={loading} text={"Next"} onClick={goToNext} icon={true}>
            <BiRightArrow />
          </IconBtn>
          
        </div>

    </div>
  )
}

export default CourseBuilderForm;