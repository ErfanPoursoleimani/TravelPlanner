import { IoSearch } from 'react-icons/io5'
import AnimatedBox from '../AnimatedBox'

const Main = () => {
  return (
    <div className='flex flex-col justify-stretch items-center bg-gradient-to-bl from-[#f9bdff] to-[#acf9ff]'>
        <div className='max-w-200 py-17 px-4 text-black flex-1 flex flex-col justify-evenly gap-8 text-center'>
          <h1 className='text-4xl font-bold md:text-5xl'>Plan Your Dream Trip with AI</h1>
          <p className='px-5 text-[1.1rem] md:text-[1.2rem]'>Create personalized travel itineraries based on your preferences, budget, and travel dates.</p>
            <AnimatedBox className='flex flex-col justify-evenly gap-8 text-center' animation='slideUp'>
                <div className='bg-white md:mx-15 flex justify-stretch items-center rounded-[7px] py-1 px-2'>
                    <input className='flex-1 text-black p-3 text-[0.8rem] outline-0' type="text" placeholder='Where do you want to go?'/>
                    <button className='py-2 px-4 flex items-center gap-1 text-[0.8rem] text-white bg-black rounded-[7px]'>
                      <IoSearch className='text-xl'/>
                      <p className='font-medium'>Search</p>
                    </button>
                </div>
                <ul className='flex flex-wrap gap-5 justify-center text-[0.9rem] font-medium text-gray-800'>
                    <button className="py-[6px] px-4 rounded-[7px] bg-white">
                    Popular Destinations
                    </button>
                    <button className="py-[6px] px-4 rounded-[7px] bg-white">
                    AI Recommendations
                    </button>
                    <button className="py-[6px] px-4 rounded-[7px] bg-white">
                    Group Travel
                    </button>
                </ul>
            </AnimatedBox>
        </div>
      </div>
  )
}

export default Main
