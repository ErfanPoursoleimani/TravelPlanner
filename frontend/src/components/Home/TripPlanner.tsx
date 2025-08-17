import { IoLocationOutline } from 'react-icons/io5'

const TripPlanner = () => {
  return (
    <div className='bottom-to-top-animation flex flex-col px-4 gap-10 items-center'>
        <div className='space-y-5 text-center'>
          <p className='text-3xl font-bold'>Let AI Plan Your Perfect Trip</p>
          <p className='text-[1.1rem] text-neutral-500'>Our AI recommendation engine creates personalized itineraries based on your preferences.</p>
        </div>
        <div className='p-5 border-1 max-w-[1300px] w-full border-neutral-200 rounded-xl bg-white flex md:justify-stretch max-md:items-stretch max-md:flex-col gap-8'>
          <div className='space-y-4 flex-1'>
            <h2 className='text-xl font-medium'>Tell us about your dream trip</h2>
            <div className='space-y-1'>
              <p className='text-[0.9rem] font-medium'>Destination Type</p>
              <ul className='flex flex-wrap gap-2 text-[0.8rem] font-medium'>
                <li className="py-2 px-3 border-1 border-neutral-200 rounded-[7px]">Beach</li>
                <li className="py-2 px-3 border-1 border-neutral-200 rounded-[7px]">Mountain</li>
                <li className="py-2 px-3 border-1 border-neutral-200 rounded-[7px]">City</li>
                <li className="py-2 px-3 border-1 border-neutral-200 rounded-[7px]">Countryside</li>
                <li className="py-2 px-3 border-1 border-neutral-200 rounded-[7px]">Historical</li>
              </ul>
            </div>
            <div className='space-y-1'>
              <p className='text-[0.9rem] font-medium'>Budget Range</p>
              <ul className='flex flex-wrap gap-2 text-[0.8rem] font-medium'>
                <li className="py-2 px-3 border-1 border-neutral-200 rounded-[7px]">Budget</li>
                <li className="py-2 px-3 border-1 border-neutral-200 rounded-[7px]">Mid-range</li>
                <li className="py-2 px-3 border-1 border-neutral-200 rounded-[7px]">Budget</li>
              </ul>
            </div>
            <div className='space-y-1'>
              <p className='text-[0.9rem] font-medium'>Trip Duration</p>
              <ul className='flex flex-wrap gap-2 text-[0.8rem] font-medium'>
                <li className="py-2 px-3 border-1 border-neutral-200 rounded-[7px]">Weekend</li>
                <li className="py-2 px-3 border-1 border-neutral-200 rounded-[7px]">One Week</li>
                <li className="py-2 px-3 border-1 border-neutral-200 rounded-[7px]">Two Weeks</li>
                <li className="py-2 px-3 border-1 border-neutral-200 rounded-[7px]">Month+</li>
              </ul>
            </div>
            <button className='bg-black text-white w-full p-2 rounded-[7px] text-[0.9rem] font-medium'>
              Generate AI Recommendation
            </button>
          </div>
          <div className=' flex-1 w-full p-5 rounded-xl bg-gray-50 gap-5 flex flex-col items-center justify-center text-center'>
            <span className='p-4 rounded-full bg-neutral-200'>
              <IoLocationOutline className='text-4xl'/>
            </span>
            <p className='font-medium text-[1.1rem]'>Your AI recommendations will appear here</p>
            <p className='text-[0.9rem] text-gray-400'>Select your preferences and click generate to see personalized travel suggestions</p>
          </div>
        </div>
        <div className=''>

        </div>
      </div>
  )
}

export default TripPlanner
