import React, { useState,useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { fetchCourseCategories,addCourseDetails,editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
import RequirementField from './RequirementField';
import { setStep, setCourse } from '../../../../../Slices/courseSlice';
import IconBtn from "../../../../common/IconBtn"
import {toast} from "react-toastify"
import { COURSE_STATUS } from "../../../../../utils/Constants"
import ChipInput from "./ChipInput"
import Upload from "../Upload"
import { MdNavigateNext } from "react-icons/md"


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
    // const {setCourse} = useSelector(state => state.course)
    const {course,editCourse} = useSelector( state => state.course)
    const [loading,setLoading] = useState(false)
    const [courseCategories,setCourseCategories] = useState([]);

    useEffect( () => {
        const getCategories = async() => {
            try{
                setLoading(true);
                // console.log("before fetch category")
                const categories = await fetchCourseCategories();
                // console.log("after fetch category",categories)
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
            // console.log("Tags",course.tag);
            // console.log("Instructions",course.instructions);

            setValue("courseTags",course.tag);
            setValue("courseCategory", course.category)
            setValue("courseBenefits",course.whatYouWillLearn);
            setValue("courseRequirements",course.instructions);
            setValue("courseImage",course.thumbnailImage);
        }

        getCategories();
    },[])

    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.courseTitle !== course.courseName || 
            currentValues.courseShortDesc !== course.courseDescription || 
            currentValues.coursePrice !== course.price || 
            currentValues.courseTags.toString() !== course.tag.toString() || 
            currentValues.courseBenefits !== course.whatYouWillLearn || 
            currentValues.courseCategory !== course.category._id || 
            currentValues.courseImage !== course.thumbnailImage || 
            currentValues.courseRequirements.toString() !== course.instructions.toString()) 
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
              if (currentValues.courseTags.toString() !== course.tag.toString()) {
                formData.append("tag", JSON.stringify(data.courseTags))
              }
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
              if (currentValues.courseImage !== course.thumbnailImage) {
                formData.append("thumbnailImage", data.courseImage)
              }
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
      
        // ----------------    create a new course
          const formData = new FormData();
          formData.append("courseName", data.courseTitle)
          formData.append("courseDescription", data.courseShortDesc)
          formData.append("whatYouWillLearn", data.courseBenefits)
          formData.append("price", data.coursePrice)
          formData.append("tag", JSON.stringify(data.courseTags))
          formData.append("category", data.courseCategory)
        //   console.log("Course Category ID:", data.courseCategory);
          formData.append("status", COURSE_STATUS.DRAFT)
          formData.append("instructions", JSON.stringify(data.courseRequirements))
        //   console.log("before image",data.courseImage );
          formData.append("thumbnailImage", data.courseImage)
        //   console.log("before image",data.courseImage);
          console.log("Formdata in Form side",formData)
          try {
            setLoading(true);

            // console.log("Before hit from form side");
            const result = await addCourseDetails(formData, token);
            // console.log("After hit from form side", result);
          
            if (result) {
              // Successfully created course, move to step 2 and set the course in the state
              dispatch(setStep(2));
              dispatch(setCourse(result));
            }
          } catch (error) {
            // Log the actual error for debugging purposes
            console.log("Cannot add the Course. Error: ", error);
          } finally {
            // Ensure that loading is set to false regardless of success or failure
            setLoading(false);
          }     
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"    
    >

        {/* CourseTitle */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseTitle">
              Course Title <sup className="text-pink-200">*</sup> 
            </label>
            <input 
                type='text'
                placeholder='Enter Course Title'
                id='courseTitle'
                {...register('courseTitle',{required:true})}
                className="form-style w-full"
            />
            {
                errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is Required</span>
                )
            }
        </div>

        {/* Course Short Description */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
              Course Short Description <sup className="text-pink-200">*</sup>
            </label>
            <textarea
                placeholder='Enter Description'
                id='courseShortDesc'
                {...register('courseShortDesc',{required:true})}
                className="form-style resize-x-none min-h-[130px] w-full"
            />
            {
                errors.courseShortDesc && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                      Course Description is Required
                    </span>
                )
            }
        </div>

        {/* Course Price */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="coursePrice">
              Course Price <sup className="text-pink-200">*</sup>
            </label>
            
            <div className='relative'> 

              <input 
                placeholder='Enter Price'
                id='coursePrice'
                {...register('coursePrice',{
                    required:true,
                    valueAsNumber:true,
                    pattern: {
                      value: /^(0|[1-9]\d*)(\.\d+)?$/,
                    },
                })}
                className="form-style w-full !pl-12"
              />
              <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />

          </div>
            {
                errors.coursePrice && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                      Course Price is Required
                    </span>
                )
            }
        </div>

        {/* Course Category */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseCategory" >
              Course Category <sup className="text-pink-200">*</sup> 
            </label>
            <select
                id='courseCategory'
                defaultValue=""
                {...register("courseCategory",{required:true})}
                className="form-style w-full"

            >
                <option value="" disabled>Choose a Category</option>
                {
                    !loading  && courseCategories.map( (category ,index) => (
                        <option key={index} value={category?._id}>
                            {category?.name}
                        </option>
                    ))
                }

            </select>
            {
                errors.courseCategory && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">Course Category is Required</span>
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
            editData={editCourse ? course?.thumbnailImage : null}
        />

        {/* Benefits of the Course */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseBenefits" >
              Benefits of the Course <sup className="text-pink-200">*</sup> 
            </label>
            <textarea 
                id='courseBenefits'
                placeholder='Benefits of the Course'
                {...register('courseBenefits',{required:true})}
                className="form-style resize-x-none min-h-[130px] w-full"
            />
            {
                errors.courseBenefits && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                      Benefits of the Course are required
                    </span>
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
        <div className="flex justify-end gap-x-2">
            {
                editCourse && (
                    <button
                        onClick={ () => dispatch(setStep(2))}
                        disabled={loading}
                        className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                    >
                      Continue Without Saving
                    </button>
                )
            }
            <IconBtn
              text={!editCourse ? "Next" : "Save Changes"} 
              icon={true}
            >
              <MdNavigateNext />
            </IconBtn>
        </div>

    </form>
  )
}

export default CourseInformationForm 