import { CiCalendar } from "react-icons/ci"
import { IoLocationOutline } from "react-icons/io5"
import type { Destination } from "../types/components"

const DestinationCard = ({card}: {card: Destination}) => {
  return (
    <div className='relative z-0 min-h-100 max-md:flex-1 max-md:flex-col md:w-90 xl:w-100 rounded-[7px] border-1 border-neutral-200 space-y-3'>
      <img className='w-full h-full absolute -z-1 object-cover rounded-[7px]' src={"https://i.postimg.cc/1sXvNbzV/ricefield1.jpg"} alt="" />
      <div className="absolute w-full bottom-0 p-4 space-y-3 backdrop-blur-[2px] bg-gradient-to-t from-[#ffffffd0]">
          <div className="space-y-1">
              <p className='text-[1.3rem] font-medium text-white'>{card.city}</p>
              <span className="flex items-center gap-1">
                  <IoLocationOutline className='text-[1rem]'/>
                  <p className='text-[0.8rem] font-bold'>{card.country}</p>
              </span>
          </div>
          <p className='truncate text-[0.8rem]'>{card.description}</p>
          <div className="text-[0.8rem] font-bold flex gap-1 items-center">
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
                <span className="bg-neutral-100/50 font-bold py-[3px] px-2 text-[0.7rem] rounded-[7px]">
                    {tag}
                </span>
            ))}
            {card.tags.length > 3 && 
                <span className="bg-neutral-100/50 font-bold py-[3px] px-2 text-[0.7rem] rounded-[7px]">
                    +{card.tags.length - 3}
                </span>
            }
          </div>
          <div className="flex gap-2 items-stretch">
              <button className=' w-full font-medium text-[0.8rem] p-1 bg-[#333] text-white shadow-2xl rounded-[7px]'>
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
