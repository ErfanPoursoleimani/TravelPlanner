import React, { useEffect, useRef, useState } from 'react'
import { FaRegClock } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6'
import type { DayPlan } from '../../../types/components'

const AddTimeSlot = ({setDays, days, activeDay, setIsAddingTimeSlot, isAddingTimeSlot}: {days: DayPlan[], setDays: Function, activeDay: DayPlan, setIsAddingTimeSlot: Function, isAddingTimeSlot: boolean}) => {

    const [selectedTimeMode, setSelectedTimeMode] = useState('AM')
    const [selectedHour, setSelectedHour] = useState('')
    const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isAddingTimeSlot && inputRef.current) {
				inputRef.current.focus();
		}
	}, [isAddingTimeSlot]);

    const handleInputValue = (e: any) => {
        const value = e.target.value;
        if(value === ""){
            setSelectedHour('')
            return
        }

        if (!/^\d+$/.test(value)) {
            return; // Don't update if non-digits are entered
        }

        const numValue = parseInt(value);
    
        // Check constraints
        if (numValue >= 1 && numValue <= 12) {
        setSelectedHour(value);
        }
    }

    const handleAddTimeSlot = (event?: React.KeyboardEvent<HTMLInputElement> | null) => {
        if (event && event.key === 'Enter' || !event) {
            setDays([
                ...days.filter((day) => (day.id !== activeDay.id)), 
                {
                    id: activeDay.id,
                    date: activeDay.date,
                    timeSlots: [
                        ...activeDay.timeSlots,
                        {id: Math.random().toString(), time: `${selectedHour} ${selectedTimeMode}`}
                    ].sort((a, b) => 
                            a.time.slice(a.time.length - 2, a.time.length) === 'PM' 
                            ? parseInt(a.time.slice(0, 2)) + 12 
                            : parseInt(a.time.slice(0, 2)) 
                            - (a.time.slice(b.time.length - 2, b.time.length) === 'PM' 
                            ? parseInt(b.time.slice(0, 2)) + 12 
                            : parseInt(b.time.slice(0, 2)) )),
                }
            ])
            setIsAddingTimeSlot(false)
        }
    }
  return (
    <div className='rounded-[7px] bg-gray-100'>
        <div className='py-2 px-3 border-1 border-gray-200 rounded-[10px] space-y-5'>
            <div className='flex justify-between items-center'>
            <span className='flex gap-2 items-center'>
                <FaRegClock />
                <input onKeyDown={handleAddTimeSlot} value={selectedHour} onChange={(e) => handleInputValue(e)} ref={inputRef} type="number" className='bg-white decoration-0 w-20 px-2 min-h-10 border-1 rounded-[7px] outline-0 border-gray-200 font-medium'/>
                <ul className='flex gap-1'>
                    <li onClick={() => setSelectedTimeMode("AM")} className={`${selectedTimeMode === "AM" ? "bg-black border-0 text-white" : ""} px-2 py-1 border-1 font-medium text-[0.9rem] rounded-[5px] border-gray-300`}>AM</li>
                    <li onClick={() => setSelectedTimeMode("PM")} className={`${selectedTimeMode === "PM" ? "bg-black border-0 text-white" : ""} px-2 py-1 border-1 font-medium text-[0.9rem] rounded-[5px] border-gray-300`}>PM</li>
                </ul>
            </span>
            <span className='flex items-center space-x-5'>
                <button onClick={() => handleAddTimeSlot(null)} className='font-medium border-1 border-white bg-black text-white py-1 px-2 rounded-[7px]'>create</button>
                <FaXmark onClick={() => setIsAddingTimeSlot(false)} className='text-[1.5rem]'/>
            </span>
            </div>
        </div>
    </div>
  )
}

export default AddTimeSlot
