import React from 'react'
import ChangeProfilePicture from "./ChangeProfilePicture"
import EditProfile from "./EditProfile"
import DeleteAccount from "./DeleteAccount"
import UpdatePassword  from './UpdatePassword'

export default function Setting() {
  return (
    <div className='mx-auto max-w-[1000px] py-10 w-11/12 overflow-auto'>
        <h1 className='mb-14 text-3xl font-semibold text-richblack-5'>
            Edit Profile
        </h1>

        <ChangeProfilePicture />

        <EditProfile />

        <UpdatePassword />

        <DeleteAccount />
    </div>
  )
}
