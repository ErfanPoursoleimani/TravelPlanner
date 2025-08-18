import { useEffect, useRef } from 'react'
import { FaRegClock, FaRegTrashAlt } from 'react-icons/fa'
import type { DayPlan } from '../../../types/components'

interface TimeSlot {id: string, time: string}

const TimeSlot = ({days, activeDay, setDays, timeSlot}: {days: DayPlan[], activeDay: DayPlan, setDays: Function, timeSlot: TimeSlot}) => {

	const handleDeleteTimeSlot = (timeSlot: TimeSlot) => {
		activeDay.timeSlots = activeDay.timeSlots.filter((slot) => slot.id !== timeSlot.id)
		setDays([
				...days.filter((day) => day.id !== activeDay.id),
				{
					id: activeDay.id,
					date: activeDay.date,
					timeSlots: [
							...activeDay.timeSlots.filter((slot) => slot.id !== timeSlot.id)
					].sort((a, b) => 
							a.time.slice(a.time.length - 2, a.time.length) === 'PM' 
							? parseInt(a.time.slice(0, 2)) + 12 
							: parseInt(a.time.slice(0, 2)) 
							- (a.time.slice(b.time.length - 2, b.time.length) === 'PM' 
							? parseInt(b.time.slice(0, 2)) + 12 
							: parseInt(b.time.slice(0, 2)) )),
				}
		])
	}
	
  return (
    <div className=''>
        <div className='min-h-30 p-5 border-1 border-gray-200 rounded-[10px] space-y-5'>
            <div className='flex justify-between items-center'>
                <span className='flex gap-2 items-center'>
                    <FaRegClock />
                    <p className='font-medium'>{timeSlot.time}</p>
                </span>
                <FaRegTrashAlt onClick={() => handleDeleteTimeSlot(timeSlot)} className='text-gray-400'/>
            </div>
            <div className='text-center border-1 p-4 rounded-[10px] border-dashed border-gray-200'>
                <p className='text-gray-400'>Drag an activity here</p>
            </div>
        </div>
    </div>
  )
}

export default TimeSlot
