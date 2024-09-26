import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../Slices/courseSlice';
import { RxCross1 } from 'react-icons/rx';
import IconBtn from '../../../../common/IconBtn';
import Upload from "../Upload"

const SubSectionModal = ({
    modalData,
    setModalData,
    add = false,
    edit = false,
    view = false,
}) => {

    const [loading,setLoading] = useState(false);

    const {register, handleSubmit, setValue, getValues, formState: {errors}} = useForm();
    const dispatch = useDispatch();
    const {course}  = useSelector( state => state.course);
    const {token} = useSelector( state => state.auth);

    useEffect( ()=> {
        if(view || edit){
            setValue("lectureTitle", modalData.title);
            setValue("lectureDesc", modalData.description);
            setValue("lectureVideo", modalData.videoUrl);

        }
    })

    const isFormUpdated = () => {
        const currentValues = getValues();
        if(currentValues.lectureTitle !== modalData.title ||
            currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoUrl ){
                return true;
        }else{
            return false;
        }
    }

    const handleEditSubSection = async() => {
        const currentValues = getValues();
        const formData = new FormData;

        formData.append("sectionId",modalData.sectionId);
        formData.append("subSectionId",modalData._id);

        if(currentValues.lectureTitle !== modalData.title){
            formData.append("title",currentValues.lectureTitle);
        }
        if(currentValues.lectureDesc !== modalData.description){
            formData.append("description",currentValues.lectureDesc);
        }
        if(currentValues.lectureVideo !== modalData.videoUrl){
            formData.append("video",currentValues.lectureVideo);
        }
        
        setLoading(true);
        const result = await updateSubSection(formData,token);

        if(result){
            dispatch(setCourse(result));
        }
        setModalData(null);
        setLoading(false);

    }

    const onSubmit = async(data) => {
        if(view){
            return;
        }

        if(edit){
            if(isFormUpdated){
                toast.error("No changes made to the form")
            }
        }else{
            //
            handleEditSubSection();
        }

        const formData = new FormData();
        formData.append("sectionId",modalData);
        formData.append("title",data.lectureTitle);
        formData.append("description",data.lectureDesc);
        formData.append("video",data.lectureVideo);
        
        setLoading(true);

        const result = await createSubSection(formData,token);

        if(result){
            dispatch(setCourse(result));
        }
        setModalData(null);
        setLoading(false);

    }

  return (
    <div>
        <div>
            <p>{view && "Viewing"} {add && "Adding"} {edit && "Editing"}</p>
            <button onClick={ () => (!loading ? setModalData(null) : {})} >
                <RxCross1 />
            </button> 
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Upload
                name="LectureVideo"
                label="Lecture Video"
                register={register}
                setValue = {setValue}
                errors = {errors}
                video = {true}
                viewData = {view ? modalData.videoUrl: null}
                editData = {edit ? modalData.videoUrl: null}
            />
            <div>
                <label>Lecture Title</label>
                <input 
                    id='lectureTitle'
                    placeholder='Enter Lecture Title'
                    {...register("lectureTitle",{required:true})}
                    className='w-full'
                />
                {errors.lectureTitle && (
                    <span>
                        Lecture Tile is Required
                    </span>
                )}
            </div>
            <div>
                <label>Lecture Description</label>
                <input 
                    id='lectureDesc'
                    placeholder='Enter Lecture Description'
                    {...register("lectureDesc",{required:true})}
                    className='w-full'
                />
                {errors.lectureDesc && (
                    <span>
                        Lecture Description is Required
                    </span>
                )}
            </div>

            {
                !view && (
                    <div>
                        <IconBtn
                            text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
                        />
                    </div>
                )
            }
        </form>
    </div>
  )
}

export default SubSectionModal