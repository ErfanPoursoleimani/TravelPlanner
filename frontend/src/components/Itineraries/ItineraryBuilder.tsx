import { useState } from 'react';
import { BiListPlus } from 'react-icons/bi';
import { IoLocationOutline } from 'react-icons/io5';
import { RxCross1 } from "react-icons/rx";
import type { /* Activity, */ DayPlan } from "../../types/components";
import AddTimeSlot from './components/AddTimeSlot';
import TimeSlot from './components/TimeSlot';

const ItineraryBuilder = () => {
  const [days, setDays] = useState<DayPlan[]>([
    {
      id: "day-1",
      date: new Date().toISOString().split("T")[0],
      timeSlots: [
        { id: "slot-1", time: "9 AM" }
      ].sort((a, b) => 
        a.time.slice(a.time.length - 2, a.time.length) === 'PM' 
        ? parseInt(a.time.slice(0, 2)) + 12 
        : parseInt(a.time.slice(0, 2)) 
        - (a.time.slice(b.time.length - 2, b.time.length) === 'PM' 
        ? parseInt(b.time.slice(0, 2)) + 12 
        : parseInt(b.time.slice(0, 2)) )),
    }
  ]);

/* const [activities, setActivities] = useState<Activity[]>([
    {
      id: "activity-1",
      title: "Eiffel Tower",
      type: "attraction",
      location: "Paris, France",
      time: "2 hours",
      duration: "2 hours",
      cost: 25,
      image:
        "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800&q=80",
    },
    {
      id: "activity-2",
      title: "Le Petit Café",
      type: "restaurant",
      location: "Paris, France",
      time: "1.5 hours",
      duration: "1.5 hours",
      cost: 45,
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    },
    {
      id: "activity-3",
      title: "Louvre Museum",
      type: "attraction",
      location: "Paris, France",
      time: "3 hours",
      duration: "3 hours",
      cost: 17,
      image:
        "https://images.unsplash.com/photo-1565799557186-1cdb7589f5e7?w=800&q=80",
    },
  ]);

  const [budget, setBudget] = useState({
    total: 1000,
    spent: 87,
  }); */

  const [activeDay, setActiveDay] = useState(days[0]);
  const [isAddingTimeSlot, setIsAddingTimeSlot] = useState(false)

  /* const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Find the source and destination day
    const sourceDayIndex = days.findIndex(
      (day) => day.id === source.droppableId,
    );
    const destDayIndex = days.findIndex(
      (day) => day.id === destination.droppableId,
    );

    if (sourceDayIndex === -1 || destDayIndex === -1) return;

    const newDays = [...days];
    const sourceDay = newDays[sourceDayIndex];
    const destDay = newDays[destDayIndex];

    // Remove from source
    const [movedSlot] = sourceDay.timeSlots.splice(source.index, 1);

    // Add to destination
    destDay.timeSlots.splice(destination.index, 0, movedSlot);

    setDays(newDays);
  }; */

  const handleAddDay = () => {
    const newDayId = `day-${days.length + 1}`;
    const lastDay = days[days.length - 1];
    const newDate = new Date(lastDay.date);
    newDate.setDate(newDate.getDate() + 1);

    setDays([
      ...days,
      {
        id: newDayId,
        date: newDate.toISOString().split("T")[0],
        timeSlots: [
          {
            id: `slot-${Math.random().toString(36)}`,
            time: "9 AM",
          }
        ].sort((a, b) => 
        a.time.slice(a.time.length - 2, a.time.length) === 'PM' 
        ? parseInt(a.time.slice(0, 2)) + 12 
        : parseInt(a.time.slice(0, 2)) 
        - (a.time.slice(b.time.length - 2, b.time.length) === 'PM' 
        ? parseInt(b.time.slice(0, 2)) + 12 
        : parseInt(b.time.slice(0, 2)) )),
      },
    ]);
  };

  const handleDeleteDay = (day: DayPlan) => {
    setDays(days.filter((d) => d.id !== day.id))
  }



  return (
    <div className='flex-1 space-y-5'>
      <div className='flex flex-col space-y-5'>
        <div className='flex justify-between items-center'>
          <span>
            <h1 className='font-bold text-[26px]'>Itineray Builder</h1>
            <span className='flex gap-2 items-center text-gray-500'>
              <IoLocationOutline className='text-[1rem]'/>
              <p className='font-medium'>Paris, France</p>
            </span>
          </span>
          <span className='min-[890px]:space-x-2 max-[890px]:space-y-1 flex max-[890px]:flex-col'>
              <button onClick={handleAddDay} className="px-3 min-w-25 py-[6px] font-medium text-[0.8rem] rounded-[7px] bg-white text-black border-1 border-gray-200">+ Add Day</button>
              <button className="px-3 min-w-25 py-[6px] font-medium text-[0.8rem] rounded-[7px] bg-black text-white">Save Itinerary</button>
          </span>
        </div>
        <div className='flex gap-2 flex-wrap justify-center p-1 bg-gray-100 rounded-[7px]'>
          {days.map((day) => (
            <span onClick={() => setActiveDay(day)} key={day.id} className={`py-1 px-2 text-[0.8rem] rounded-[7px] font-medium ${day === activeDay ? "bg-white" : ""} flex gap-2 items-center`}>
              <p>{day.date}</p>
              {day === activeDay && <RxCross1 className={`${days.length < 2 ? "hidden" : ""}`} onClick={() => handleDeleteDay(day)}/>}
            </span>
          ))}
        </div>
      </div>

      <div className='space-y-2'>
        { days.filter((day) => day.id === activeDay.id)[0].timeSlots.map((timeSlot) => (<TimeSlot days={days} activeDay={activeDay} setDays={setDays} timeSlot={timeSlot} />))}
        <div className='flex items-center'>
          <div className='relative flex-1 h-2 rounded-full bg-gray-200 flex justify-end'></div>
          <BiListPlus onClick={() => setIsAddingTimeSlot(!isAddingTimeSlot)} className='text-2xl'/>
        </div>
        { isAddingTimeSlot && <AddTimeSlot  activeDay={activeDay} setIsAddingTimeSlot={setIsAddingTimeSlot} isAddingTimeSlot={isAddingTimeSlot} setDays={setDays} days={days}/> }
      </div>
    </div>
  )
}

export default ItineraryBuilder
