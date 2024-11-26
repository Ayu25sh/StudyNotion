import { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

export default function ChipInput({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) {
    const { editCourse, course } = useSelector((state) => state.course)
    const [chips, setChips] = useState([])


    useEffect(() => {

        if (editCourse) {
            // console.log(course)
            // manually populate the chips with existing course tags 
            setChips(course?.tag);
        }
        register(name, { required: true, validate: (value) => value.length > 0 })
    }, [])

    useEffect(() => {
        // manually set the value of the form field.Here,it updates the form state to store the current chips(list of tags)
        setValue(name, chips)
    }, [chips])

    const handleKeyDown = (event) => {
        // Check if user presses "Enter" or ","
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault()
            // Get the input value and remove any leading/trailing spaces
            const chipValue = event.target.value.trim()
            if (chipValue && !chips.includes(chipValue)) {
                const newChips = [...chips, chipValue]
                setChips(newChips)
                event.target.value = ""
            }
        }
    }

    // Function to handle deletion of a chip
    const handleDeleteChip = (chipIndex) => {
        // Filter the chips array to remove the chip with the given index
        const newChips = chips.filter((_, index) => index !== chipIndex)
        setChips(newChips)
    } 
    
  return (
    <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor={name}> {label} <sup className="text-pink-200">*</sup> </label>

        <div className="flex w-full flex-wrap gap-y-2">
            {/* code for appearing tags */}
            {chips?.map((chip, index) => (
                <div key={index}
                    className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
                >
                    {chip}
                    <button
                        type="button"
                        className="ml-2 focus:outline-none"
                        onClick={() => handleDeleteChip(index)}
                    >
                        <MdClose className="text-sm" />
                    </button>
                </div>
                ))
            }    
            
            {/* input field */}
            <input
                id={name}
                name={name}
                type="text"
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                className="form-style w-full" 
            />
        </div>
        {errors[name] && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">{label} is required</span>
        )}
    </div>
  )
}