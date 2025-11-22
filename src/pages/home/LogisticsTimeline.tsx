import React from 'react'
import icon from '../../assets/Grupo-icon.png'
import timeline from '../../assets/Grupoline.png' // timeline image

const LogisticsTimeline: React.FC = () => {
  return (
    <div className="w-full bg-[#026432] py-24 overflow-x-visible flex justify-center">
      <div className="relative w-full max-w-[2100px] px-4">

        {/* FIRST IMAGE — your original icon strip */}
        <img
          src={icon}
          alt="Main Icon Strip"
          className="
            w-full 
            h-auto 
            object-contain 
            mx-auto
            mb-10
          "
        />

        {/* SECOND IMAGE — timeline image */}
        <img
          src={timeline}
          alt="Timeline Image"
          className="
            w-[2000px]
            h-auto 
            object-contain 
            mx-auto
          "
        />

      </div>
    </div>
  )
}

export default LogisticsTimeline
