import React,{useState,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import { apiConnector } from '../services/apiconnector'
import {catalogData, categories} from "../services/apis"
import { getCatalogPageData } from '../services/operations/pageAndComponentData'
import Course_Card from '../components/core/Catalog/Course_Card'
import CourseSlider from '../components/core/Catalog/CourseSlider'
import { useSelector } from 'react-redux'
import Error from "./Error"


const Catalog = () => {

  const { loading } = useSelector((state) => state.profile)
  const {catalogName} = useParams();
  const [catalogPageData,setCatalogPageData]= useState();
  const [categoryId,setCategoryId] = useState("");
  const [active,setActive] = useState(1)

  //fetching all the categories
  useEffect( ()=> {
    const getCategories = async() => {
      const res = await apiConnector("GET",categories.CATEGORIES_API);
      // console.log("catalogName",catalogName);
      const category_id = res?.data?.allCategory?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
      setCategoryId(category_id);
      // console.log("-----",category_id);
      // console.log("-----",categoryId);

    }
    getCategories();
  },[catalogName]);

  //fetching details for particular category
  useEffect( () => {
    const getCategoryDetails = async() => {
      try{
        console.log("ID ---",categoryId)
        const result = await getCatalogPageData(categoryId);
        console.log("RESponse ---",result);
        setCatalogPageData(result);
      }catch(error){
        console.log(error);
      }   
    }
    if(categoryId) {
      getCategoryDetails();
    }

  },[categoryId]);

  if(loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!loading && !catalogPageData.success) {
    return <Error />
  }

  return (
    <div className=''>

      {/* Hero section */}
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">{`Home /  Catalog /  `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          
          <p className="text-3xl text-richblack-5"> {catalogPageData?.data?.selectedCategory?.name}</p>
          <p className="max-w-[870px] text-richblack-200"> {catalogPageData?.data?.selectedCategory?.description}</p>
        </div>
      </div>
      
      
          {/* section 1 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm"> 
                <p className={`px-4 py-2 ${active === 1 ? "text-yellow-25 border-b border-b-yellow-25" : "text-richblack-50" } cursor-pointer`}
                  onClick={ () => setActive(1)}  >Most Popular</p>
                <p className={`px-4 py-2 ${active === 2 ? "text-yellow-25 border-b border-b-yellow-25" : "text-richblack-50" } cursor-pointer`}
                  onClick={ () => setActive(2)}>New</p>
            </div>
            <div>
              <CourseSlider courses={catalogPageData?.data?.selectedCategory?.courses}/>
            </div>
          </div>

          {/* section 2 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
              <div className="section_heading">
                Top Courses in {catalogPageData?.data?.selectedCategory?.name}
              </div>
              <div className="py-8">
                  <CourseSlider courses={catalogPageData?.data?.differentCategory?.courses} />
              </div>
          </div>

          {/* section 3 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
              <div className="section_heading">Frequently Bought</div>
              <div className='py-8'>
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {
                        catalogPageData?.data?.mostSellingCourses?.slice(0,4).map( (course,index) => (
                            <Course_Card course={course} key={index} Height={"h-[400px]"} />
                        ) )
                      }
                  </div>
              </div>
          </div>

      
      {/* <Footer /> */}
    </div>
  )
}

export default Catalog