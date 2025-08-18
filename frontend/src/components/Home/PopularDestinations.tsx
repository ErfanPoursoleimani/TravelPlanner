import { useNavigate } from 'react-router-dom'
import DestinationCard from './components/DestinationCard'

const DestinationCards = [
  {
    id: 1,
    label: "Paris, France",
    description: "Explore the city of lights and romance",
    imgUrl: ""
  },
  {
    id: 2,
    label: "Tokyo, Japan",
    description: "Discover the blend of tradition and innovation",
    imgUrl: ""
  },
  {
    id: 3,
    label: "New York, USA",
    description: "Experience the city that never sleeps",
    imgUrl: ""
  },
  {
    id: 4,
    label: "Bali, Indonesia",
    description: "Relax on beautiful beaches and explore lush landscapes",
    imgUrl: ""
  },
  {
    id: 5,
    label: "New York, USA",
    description: "Experience the city that never sleeps",
    imgUrl: ""
  },
]

const PopularDestinations = () => {

    const navigate = useNavigate()

  return (
    <div className='bottom-to-top-animation text-center flex flex-col items-center gap-7'>
        <h3 className='text-3xl font-bold'>Popular Destinations</h3>
        <div className='w-full px-2 text-start flex gap-5 max-md:gap-2 overflow-x-auto max-w-[1300px]'>
            {DestinationCards.map((card) => (
            <DestinationCard key={card.id} card={card}/>
            ))}
        </div>
        <button onClick={() => navigate("/destinations")} className='bg-white py-2 px-8 text-[0.9rem] font-medium border-1 border-neutral-200 rounded-[7px]'>View All Destinations</button>
    </div>
  )
}

export default PopularDestinations
