import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {RxDropdownMenu} from "react-icons/rx"
import {MdEdit} from "react-icons/md"
import {RiDeleteBin6Line} from "react-icons/ri"
import {BiDownArrow} from "react-icons/bi"
import {AiOutlinePlus} from "react-icons/ai"
import SubSectionModal from "./SubSectionModal"
import ConfirmationModal from '../../../../common/ConfirmationModal'
import { deleteSection, deleteSubSection } from '../../../../../services/operations/courseDetailsAPI'
import { setCourse } from '../../../../../Slices/courseSlice'

const NestedView = ({handleChangeSectionName}) => {
    
    const {course}  = useSelector( state => state.course);
    const {token} = useSelector( state => state.auth);
    const dispatch = useDispatch();

    const [addSubSection, setAddSubSection] = useState(null);
    const [viewSubSection, setViewSubSection] = useState(null);
    const [editSubSection, setEditSubSection] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);

    const handleDeleteSection = async(sectionId) => {
        const result = await deleteSection({
            sectionId,
            courseid:course._id,
            token
        })

        if(result){
            dispatch(setCourse(result))

        }
        setConfirmationModal(null);
    }

    const handleDeleteSubSection = async(subSectionId,sectionId) => {
        const result = await deleteSubSection({
            subSectionId,
            sectionId,
            token
        })

        if(result){
            dispatch(setCourse(result))
        }
        setConfirmationModal(null);
    }

  return (
    <div>

        <div className='rounded-lg bg-richblack-700 p-6 px-8 text-white'>
            {course?.courseContent?.map( (section) => (
                <details key={section._id} open>

                    <summary className='flex items-center justify-between gap-x-3 border-b-2'>
                        <div className='flex items-center gap-x-3'>
                            <RxDropdownMenu />
                            <p>{section.sectionName}</p>
                        </div>

                        <div className='flex items-center gap-x-3'>
                            <button 
                                onClick={() => handleChangeSectionName(section._id,section.sectionName)}
                            >
                                <MdEdit />
                            </button>

                            <button
                                onClick={ () => {
                                    setConfirmationModal({
                                        text1: "Delete this Section",
                                        text2: "All the lecture in this section will be deleted",
                                        btn1Text: "Delete",
                                        btn2Text: "Cancel",
                                        btn1Handler: () => handleDeleteSection(section._id),
                                        btn2Handler: () => setConfirmationModal(null)
                                    })
                                }}
                            >
                                <RiDeleteBin6Line />
                            </button>
                            <span>|</span>
                            <BiDownArrow className='text-xl text-richblack-300' />

                        </div>
                    </summary>

                    <div>
                        {
                            section.subSection.map( (data) => {
                                <div
                                    key={data._id}
                                    onClick={ () => setViewSubSection(data)}
                                    className='flex items-center justify-between'
                                >
                                    <div className='flex items-center gap-x-3'>
                                        <RxDropdownMenu />
                                        <p>{data.title}</p>
                                    </div>

                                    <div className='flex items-center gap-x-3'>
                                        <button 
                                            onClick={() => setEditSubSection({...data,sectionId:section._id})}
                                        >
                                            <MdEdit />
                                        </button>

                                        <button
                                            onClick={ () => {
                                                setConfirmationModal({
                                                    text1: "Delete this Sub Section",
                                                    text2: "Selected Lecture will be deleted",
                                                    btn1Text: "Delete",
                                                    btn2Text: "Cancel",
                                                    btn1Handler: () => handleDeleteSubSection(...data._id,section._id),
                                                    btn2Handler: () => setConfirmationModal(null)
                                                })  
                                            }}
                                        >
                                            <RiDeleteBin6Line />
                                        </button>
                                    </div>
                                </div>
                            })
                        }
                        <button
                            onClick={setAddSubSection(section._id)}
                            className=''
                        >
                            <AiOutlinePlus />
                            <p>Add Lecture</p>
                        </button>
                    </div>

                </details>
            ))}
        </div>

        

        {/* Handling Viewing of Different Modal */}

        {addSubSection ? (<SubSectionModal 
            modalData = {addSubSection}
            setModalData = {setAddSubSection}
            add={true}
        />)
        : viewSubSection ? (<SubSectionModal 
            modalData = {viewSubSection}
            setModalData = {setViewSubSection}
            view={true}
        />)
        : editSubSection ? (<SubSectionModal 
            modalData = {editSubSection}
            setModalData = {setEditSubSection}
            edit={true}
        />)
        : (<div></div>)}

        {confirmationModal ? (<ConfirmationModal />) : (<div></div>)}

    </div>
  )
}

export default NestedView