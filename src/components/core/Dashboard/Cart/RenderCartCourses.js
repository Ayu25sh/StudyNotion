import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import ReactStars from "react-rating-stars-component";
import { GiNinjaStar } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeFromCart } from '../../../../Slices/cartSlice';




const RenderCartCourses = () => {

    const {cart} = useSelector( state => state.cart);
    const dispatch = useDispatch();
  return (
    <div>
        {
            cart.map( (course,index) => (
                <div>
                    <div>
                        <img src={course.thumbnailImage} />
                        <div>
                            <p>{course?.courseName}</p>
                            <p>{course?.category?.name}</p>
                            <div>
                                <span>4.8</span>
                                <ReactStars
                                    count={5}
                                    //onChange={ratingChanged}
                                    size={20}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<GiNinjaStar/>}
                                    fullIcon={<GiNinjaStar />}
                                />
                                <span>{course?.ratingAndReviews?.length} Ratings</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button onClick={ () => dispatch(removeFromCart(course._id))}>
                            <RiDeleteBin6Line/>
                            <span>Remove</span>
                        </button>

                        <p> Rs {course?.price}</p>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default RenderCartCourses