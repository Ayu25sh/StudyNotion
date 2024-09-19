import React from 'react'
import HighLightText from '../HomePage/HighLightText'

const Quote = () => {
  return (
    <div>
        We are passionate about revolutionizing the way we learn. Our innovative platform 
        <HighLightText text={"combines technology"} />, 
        <span className='text-brown-500'>expertise</span>
        <span>and community to create an</span>
        <span className='text-brown-500'>unparalleled educational experience.</span>
    </div>
  )
}

export default Quote