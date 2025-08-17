import React from 'react'

const ItineraryBuilder = () => {
  return (
    <div className='flex-1'>
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-[26px]'>Itineray Builder</h1>
        <span className='space-x-2'>
            <button className="px-3 py-2 font-medium text-[0.9rem] rounded-[7px] bg-white text-black border-1 border-gray-200">+ Add Day</button>
            <button className="px-3 py-2 font-medium text-[0.9rem] rounded-[7px] bg-black text-white">Save Itinerary</button>
        </span>
      </div>
    </div>
  )
}

export default ItineraryBuilder
