import React, { useState,useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { fetchCourseCategories,addCourseDetails,editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
import RequirementField from './RequirementField';
import { setStep } from '../../../../../Slices/courseSlice';
import IconBtn from "../../../../common/IconBtn"
import {toast} from "react-toastify"
import { COURSE_STATUS } from "../../../../../utils/Constants"
import ChipInput from "./ChipInput"
import Upload from "../Upload"

const CourseInformationForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
      } = useForm();
    
    const dispatch = useDispatch();
    const {token} = useSelector(state => state.auth)
    const {setCourse} = useSelector(state => state.course)
    const {course,editCourse} = useSelector( state => state.course)
    const [loading,setLoading] = useState(false)
    const [courseCategories,setCourseCategories] = useState([]);

    useEffect( () => {
        const getCategories = async() => {
            try{
                setLoading(true);
                console.log("before fetch category")
                const categories = await fetchCourseCategories();
                console.log("after fetch category",categories)
                if(categories.length > 0){
                    setCourseCategories(categories);
                }
                setLoading(false);
            }catch(error){
                console.log("Cannot fetch the course category");
            }
            
        }

        if(editCourse){
            setValue("courseTitle",course.courseName);
            setValue("courseShortDesc",course.courseDescription);
            setValue("coursePrice",course.price);
            // setValue("courseTags",course.tag);
            setValue("courseCategory", course.category)
            setValue("courseBenefits",course.whatYouWillLearn);
            setValue("courseRequirements",course.instructions);
            // setValue("courseImage",course.thumbnail);
        }

        getCategories();
    },[])

    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.courseTitle !== course.courseName || 
            currentValues.courseShortDesc !== course.courseDescription || 
            currentValues.coursePrice !== course.price || 
            // currentValues.courseTags.toString() !== course.tag.toString()) || 
            currentValues.courseBenefits !== course.whatYouWillLearn || 
            currentValues.courseCategory !== course.category._id || 
            // currentValues.courseImage !== course.thumbnail || 
            currentValues.courseRequirements.toString() !== course.courseInstructions.toString()) 
            return true
        else 
            return false;
    }

    const onSubmit = async(data) => {
        console.log("data",data);
        
        if (editCourse) {
            // const currentValues = getValues()
            // console.log("changes after editing form values:", currentValues)
            // console.log("now course:", course)
            // console.log("Has Form Changed:", isFormUpdated())
            if (isFormUpdated()) {
              const currentValues = getValues()
              const formData = new FormData()
              // console.log(data)
              formData.append("courseId", course._id)
              if (currentValues.courseTitle !== course.courseName) {
                formData.append("courseName", data.courseTitle)
              }
              if (currentValues.courseShortDesc !== course.courseDescription) {
                formData.append("courseDescription", data.courseShortDesc)
              }
              if (currentValues.coursePrice !== course.price) {
                formData.append("price", data.coursePrice)
              }
            //   if (currentValues.courseTags.toString() !== course.tag.toString()) {
            //     formData.append("tag", JSON.stringify(data.courseTags))
            //   }
              if (currentValues.courseBenefits !== course.whatYouWillLearn) {
                formData.append("whatYouWillLearn", data.courseBenefits)
              }
              if (currentValues.courseCategory._id !== course.category._id) {
                formData.append("category", data.courseCategory)
              }
              if (
                currentValues.courseRequirements.toString() !==
                course.instructions.toString()
              ) {
                formData.append(
                  "instructions",
                  JSON.stringify(data.courseRequirements)
                )
              }
            //   if (currentValues.courseImage !== course.thumbnail) {
            //     formData.append("thumbnailImage", data.courseImage)
            //   }
              // console.log("Edit Form data: ", formData)
              setLoading(true)
              const result = await editCourseDetails(formData, token)
              setLoading(false)
              if (result) {
                dispatch(setStep(2))
                dispatch(setCourse(result))
              }
            } else {
              toast.error("No changes made to the form")
            }
            return
        }
      
          //create a new course
          const formData = new FormData();
          formData.append("courseName", data.courseTitle)
          formData.append("courseDescription", data.courseShortDesc)
          formData.append("whatYouWillLearn", data.courseBenefits)
          formData.append("price", data.coursePrice)
        //   formData.append("tag", JSON.stringify(data.courseTags))
          
          formData.append("category", data.courseCategory)
          console.log("Course Category ID:", data.courseCategory);
          formData.append("status", COURSE_STATUS.DRAFT)
          formData.append("instructions", JSON.stringify(data.courseRequirements))
        //   formData.append("thumbnailImage", data.courseImage)
        console.log("Formdata",formData)
        try{
          setLoading(true)
          console.log("before hit createCourse")
          const result = await addCourseDetails(formData, token)
          console.log("before hit createCourse")
          if (result) {
            dispatch(setStep(2))
            dispatch(setCourse(result))
          }
          setLoading(false)
        }catch(error){
            console.log("Cannot add the Course ");
        }
          
    }

    


  return (
    <form onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >

        {/* CourseTitle */}
        <div>
            <label>Course Title<sup>*</sup> </label>
            <input 
                type='text'
                placeholder='Enter Course Title'
                id='courseTitle'
                {...register('courseTitle',{required:true})}
                className='w-full text-richblack-900'
            />
            {
                errors.courseTitle && (
                    <span>Course Title is Required</span>
                )
            }
        </div>

        {/* Course Short Description */}
        <div>
            <label>Course Short Description<sup>*</sup></label>
            <textarea
                placeholder='Enter Description'
                id='courseShortDesc'
                {...register('courseShortDesc',{required:true})}
            />
            {
                errors.courseShortDesc && (
                    <span>Course Description is Required</span>
                )
            }
        </div>

        {/* Course Price */}
        <div className='relative'>
            <label>Course Price<sup>*</sup> </label>
            <input 
                placeholder='Enter Price'
                id='coursePrice'
                {...register('coursePrice',{
                    required:true,
                    valueAsNumber:true})}
                className='w-full'
            />
            <HiOutlineCurrencyRupee className='absolute top-1/2 text-richblack-400 ' />
            {
                errors.coursePrice && (
                    <span>Course Price is Required</span>
                )
            }
        </div>

        {/* Course Category */}
        <div>
            <label htmlFor='courseCategory' >Course Category<sup>*</sup> </label>
            <select
                id='courseCategory'
                defaultValue=""
                {...register("courseCategory",{required:true})}
            >
                <option value="" disabled>Choose a Category</option>
                {
                    !loading  && courseCategories.map( (category ,index) => (
                        <option className='text-white' key={index} value={category?._id}>
                            {category?.name}
                        </option>
                    ))
                }

            </select>
            {
                errors.courseCategory && (
                    <span>Course Category is Required</span>
                )
            }
        </div>

        {/* custom component to handle tags input */}
        <ChipInput
            label="Tags"
            name="courseTags"
            placeholder="Enter Tags and press Enter"
            register={register}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
        />

        {/* custom component for uploading thumbnail */}
        <Upload
            name="courseImage"
            label="Course Thumbnail"
            register={register}
            setValue={setValue}
            errors={errors}
            editData={editCourse ? course?.thumbnail : null}
        />

        {/* Benefits of the Course */}
        <div>
            <label htmlFor='courseBenefits' >Benefits of the Course <sup>*</sup> </label>
            <textarea 
                id='courseBenefits'
                placeholder='Benefits of the Course'
                {...register('courseBenefits',{required:true})}
            />
            {
                errors.courseBenefits && (
                    <span>Benefits of the Course are required</span>
                )
            }
        </div>
        
        {/* custom component for Requirements/Instructions */}
        <RequirementField 
            name='courseRequirements'
            label='Requirements/Instructions'
            register={register}
            setValue={setValue}
            getValues={getValues}
            errors={errors}
        />

        {/* next button */}
        <div>
            {
                editCourse && (
                    <button
                        onClick={ () => dispatch(setStep(2))}
                    >
                        Continue Without Saving
                    </button>
                )
            }
        </div>
        <IconBtn 
            text={!editCourse ? "Next" : "Save Changes"}
        />

    </form>
  )
}

export default CourseInformationForm 