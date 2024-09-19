import React from 'react'
import HighLightText from './HighLightText'

import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from "../HomePage/Button"
 
export const LearningLanguageSection = () => {
  return (
    <div className='mt-[130px] mb-[32px]'>
      <div className='flex flex-col gap-5'>

        <div className='text-4xl font-semibold text-center'>
          Your Swiss Knife for
          <HighLightText text={"Learning any language"} />
        </div>

        <div className='text-center text-richblack-600 mx-auto text-base font-medium w-[70%]'>
          Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>

        <div className='flex items-center justify-center mt-5'>
          <img
            src={know_your_progress}
            alt='KnowYourProgressImage'
            className='object-contain -mr-32'
            
          />
          <img
            src={compare_with_others}
            alt='KnowYourProgressImage'
            className='object-contain'

            
          />
          <img
            src={plan_your_lesson}
            alt='KnowYourProgressImage'
            className='object-contain -ml-36'

          />

        </div>

        <div className='flex items-center justify-center'>
          <CTAButton active={true} linkto={"/signup"} >
              Learn More
          </CTAButton>
        </div>
      </div>
    </div>
  )
}
