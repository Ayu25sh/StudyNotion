import React,{useState} from 'react'
import {HomePageExplore} from "../../../data/homepage-explore"
import HighLightText from './HighLightText';


const tabsName = [
    "Free",
    "New to Coding ",
    "Most Popular",
    "Skill Paths",
    "Career Paths",
];



export const ExploreMore = () => {

  const[currentTab,setCurrentTab] = useState(tabsName[0]);
  const[courses,setCourses] = useState(HomePageExplore[0].courses);
  const[currentCard,setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter(course => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  }

  return (
    <div>

      <div className='text-4xl font-semibold text-center'>
        Unlock the 
        <HighLightText text={"Power of Code"} />
      </div>
      <p className='text-center text-richblack-300 text-sm text-[16px] mt-3'>
        Learn to build anything you can imagine
      </p>
      <div className='mt-5 flex rounded-full bg-richblack-800 mb-5 px-1 py-1 border-richblack-100'>
        {
          tabsName.map( (element,index) => {
            return(
              <div className={`text-[16px] flex items-center gap-2 
                            ${currentTab === element ? 
                            "bg-richblack-900 text-richblack-5 font-medium" : 
                            "text-richblack-200 "} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-4 py-4`} 
                            key={index} 
                            onclick={ () => setMyCards(element) } >
                {element}
              </div>
            )
          } )
        }
      </div>
      <div className='lg:h-[150px]'></div>

      {/* <div className='absolute flex gap-10 justify-between w-full'>
        {
          courses.map( (element,index) => {
            return(
              <CourseCard 
                key={index}
                cardData={element}
                currentCard={currentCard}
                setCurrentCard={setCurrentCard}
              />
            )
          })
        }
      </div> */}

    </div>
  )
}
