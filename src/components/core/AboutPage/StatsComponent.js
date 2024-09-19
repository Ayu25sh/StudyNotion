import React from 'react'

const Stats = [
  {count:"5k" , label:"Active Students"},
  {count:"10+" , label:"Mentors"},
  {count:"200+" , label:"Courses"},
  {count:"50+" , label:"Awards"},
]

const StatsComponent = () => {
  return (
    <section>
      <div className='mt-[50px] flex gap-x-20 ' >
        {
          Stats.map( (data,index) => {
            return (
              <div key={index} className='flex flex-col justify-between items-center' >
                <h1>{data.count}</h1>
                <h2>{data.label}</h2>
              </div>
            )
          })
        }
      </div>
    </section>
  )
}

export default StatsComponent