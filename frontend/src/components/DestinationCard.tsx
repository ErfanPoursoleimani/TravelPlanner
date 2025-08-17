import { CiCalendar } from "react-icons/ci"
import { IoLocationOutline } from "react-icons/io5"
import type { Destination } from "../types/components"

const DestinationCard = ({card}: {card: Destination}) => {
  return (
    <div className='max-md:flex-1 max-md:flex-col md:w-90 xl:w-100 bg-white rounded-[7px] border-1 border-neutral-200 space-y-3'>
      <img className='h-50 w-full object-cover rounded-t-[7px]' src={"https://i.imgur.com/1TlHjI7.jpeg"} alt="" />
      <div className="p-4 space-y-3">
          <div className="space-y-1">
              <p className='text-[1.1rem] font-medium'>{card.city}</p>
              <span className="text-gray-500 flex items-center gap-1">
                    <IoLocationOutline className='text-[1rem]'/>
                  <p className='text-[0.8rem] font-medium'>{card.country}</p>
              </span>
          </div>
          <p className='truncate text-[0.9rem] text-gray-500'>{card.description}</p>
          <div className="text-[0.8rem] text-gray-500 flex gap-1 items-center">
            <CiCalendar />
            <span>
                Best time:
            </span>
            <span>
                {card.bestTime}
            </span>
          </div>
          <div className="space-x-1">
            {card.tags.filter((_,i) => i <= 2).map((tag) => (
                <span className="border-1 border-gray-200 font-bold py-[3px] px-2 text-[0.7rem] rounded-[7px]">
                    {tag}
                </span>
            ))}
            {card.tags.length > 3 && 
                <span className="border-1 border-gray-200 font-bold py-[3px] px-2 text-[0.7rem] rounded-[7px]">
                    +{card.tags.length - 3}
                </span>
            }
          </div>
          <div className="flex gap-2 items-stretch">
              <button className='w-full font-medium text-[0.8rem] p-1 bg-black text-white shadow-2xl rounded-[7px]'>
                Plan Trip
              </button>
              <button className='w-35 font-medium text-[0.8rem] border-1 border-gray-200 p-2 bg-white text-black shadow-2xl rounded-[7px]'>
                Learn More
              </button>
          </div>
      </div>
    </div>
  )
}

export default DestinationCard
