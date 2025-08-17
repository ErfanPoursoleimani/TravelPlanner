import { IoLocationOutline } from 'react-icons/io5'

const Commercial = () => {
  return (
      <div className='bottom-to-top-animation space-y-10 text-center'>
        <h3 className='text-3xl font-bold'>Plan Your Trip with Ease</h3>
        <ul className='flex items-center justify-center max-md:flex-col gap-10'>
          <li className="p-5 space-y-3 max-w-110 flex flex-col items-center justify-center">
            <span className='p-2 rounded-full bg-neutral-200'>
              <IoLocationOutline className='text-3xl'/>
            </span>
            <p className='font-medium text-[1.3rem]'>Interactive Map</p>
            <p className='text-gray-400'>Explore destinations with our interactive map interface. Search and filter points of interest.</p>
          </li>

          <li className="p-5 space-y-3 max-w-110 flex flex-col items-center justify-center">
            <span className='p-2 rounded-full bg-neutral-200'>
              <IoLocationOutline className='text-3xl'/>
            </span>
            <p className='font-medium text-[1.3rem]'>Itinerary Builder</p>
            <p className='text-gray-400'>Create your perfect trip with our drag-and-drop itinerary builder with time slots and travel times.</p>
          </li>

          <li className="p-5 space-y-3 max-w-110 flex flex-col items-center justify-center">
            <span className='p-2 rounded-full bg-neutral-200'>
              <IoLocationOutline className='text-3xl'/>
            </span>
            <p className='font-medium text-[1.3rem]'>Collaboration Tools</p>
            <p className='text-gray-400'>Share and collaborate on itineraries with friends and family for group trips.</p>
          </li>
        </ul>
        <button className='bg-black text-white py-2 px-8 text-[0.9rem] font-medium border-1 border-neutral-200 rounded-[7px]'>Start Planning Now</button>
      </div>
  )
}

export default Commercial
