import React, { useState } from 'react'
import {sidebarLinks} from "../../../data/dashboard-links"
import {logout} from "../../../services/operations/authAPI"
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useNavigate } from 'react-router-dom'
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from '../../common/ConfirmationModal'


const Sidebar = () => {

    const {user,loading: profileLoading } = useSelector( state => state.profile);
    const { loading: authLoading} = useSelector(state => state.auth);
    const [confirmationModal,setConfirmationModal] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    if(authLoading || profileLoading){
        return (
            <div>
                Loading...
            </div>
        )
    }

  return (
    <div className=' bg-richblack-800 text-richblack-300 '>
        <div className='flex min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 lg:flex
            h-[calc[100vh-3.5rem)] bg-richblack-800 py-10'>

            {/* section 1 of three element  */}
            <div className='flex flex-col'>
                {
                    sidebarLinks.map( (link) => {
                        if(link.type && user?.accountType !== link.type) return null;
                        return (
                            <SidebarLink link={link} iconName={link.icon} key={link.id}/>
                        ) 
                    }) 
                }
            </div>

            {/* line */}
            <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600' ></div>

            {/* section 3 of two element */}
            <div className='flex flex-col'>
                <SidebarLink 
                    link={{name:"Settings",path:"dashboard/settings"}}
                    iconName={"VscSettingsGear"}
                />


                <button
                    onClick={ () => setConfirmationModal({
                        text1:"Are You Sure",
                        text2: " You will be logged out of your Account",
                        btn1Text:"Logout",
                        btn2Text:"Cancel",
                        btn1Handler: () => dispatch(logout(navigate)),
                        btn2Handler: () => setConfirmationModal(null),
                    })} 
                    className='text-sm font-medium text-richblack-300 mx-4'
                >
                    <div className='flex items-center gap-x-2 p-4'>
                        <VscSignOut className='text-lg' />
                        <span>Logout</span>


                    </div>

                </button>


            </div>
        </div>



        {/* mobile sidebar */}
        <div className='flex lg:hidden fixed bottom-0 justify-between items-center px-2 py-1 bg-richblack-900 z-50 w-full'>
            <div className='flex flex-row gap-1 w-full justify-between'>
                {
                    sidebarLinks.map((link) => {
                        if(link.type && user?.accountType !== link.type) return null;
                        return (
                            <SidebarLink key={link.id}  link={link} iconName={link.icon} />
                        )
                    })}
                    <SidebarLink 
                        link={{name:"Settings", path:"/dashboard/settings"}}
                        iconName="VscSettingsGear"
                    />
            </div>
        </div>

        {
            confirmationModal && <ConfirmationModal modalData={confirmationModal} />
        }
    </div>
  )
}

export default Sidebar