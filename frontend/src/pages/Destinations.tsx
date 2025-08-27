import { useState } from "react"
import { BiSearch } from "react-icons/bi"
import { IoIosArrowDown } from "react-icons/io"
import DestinationCard from "../components/DestinationCard"
import AnimatedBox from "../components/AnimatedBox"

const continentOptions = [
    {id: 1, label: "All Continents", isActive: true},
    {id: 1, label: "Europe", isActive: false},
    {id: 1, label: "North America", isActive: false},
    {id: 1, label: "South America", isActive: false},
    {id: 1, label: "Africa", isActive: false},
    {id: 1, label: "Oceania", isActive: false},
]
const budgetOptions = [
    {id: 1, label: "All Budgets", isActive: true},
    {id: 1, label: "Budget", isActive: false},
    {id: 1, label: "Mid-range", isActive: false},
    {id: 1, label: "Luxury", isActive: false},
]

const DestinationCards = [
  {
    id: 1,
    city: "Paris",
    country: "France",
    description: "Explore the city of lights and romance",
		bestTime: "April - October",
		tags: ["Museums", "Architecture", "Cuisine", "Luxury", "Mid-range"],
    imgUrl: ""
  },
  {
    id: 2,
    city: "Paris",
    country: "France",
    description: "Explore the city of lights and romance",
		bestTime: "April - October",
		tags: ["Museums", "Architecture", "Cuisine"],
    imgUrl: ""
  },
  {
    id: 3,
    city: "Paris",
    country: "France",
    description: "Explore the city of lights and romance",
		bestTime: "April - October",
		tags: ["Museums", "Architecture", "Cuisine"],
    imgUrl: ""
  },
  {
    id: 4,
    city: "Paris",
    country: "France",
    description: "Explore the city of lights and romance",
		bestTime: "April - October",
		tags: ["Museums", "Architecture", "Cuisine"],
    imgUrl: ""
  },
  {
    id: 5,
    city: "Paris",
    country: "France",
    description: "Explore the city of lights and romance",
		bestTime: "April - October",
		tags: ["Museums", "Architecture", "Cuisine"],
    imgUrl: ""
  },
]

const Destinations = () => {
    const [isContinetsOpen, setIsContinetsOpen] = useState(false)
    const [isBudgetsOpen, setIsBudgetsOpen] = useState(false)

  return (
    <div className="space-y-20 flex flex-col items-center">
        <div className="text-black min-h-30 w-full flex flex-col justify-center items-center pt-20 px-4 bg-gradient-to-b from-[#d2ffa800] to-[#348d4300]">
          <div className="max-w-[1300px] w-full">
            <AnimatedBox animation="slideRight" triggerOnce={true} className="flex flex-col gap-5">
              <h1 className="text-5xl max-md:text-3xl font-bold">Explore Destinations</h1>
              <p className="max-md:text-[1rem] text-gray-500">Discover amazing places around the world and start planning your next adventure.</p>
            </AnimatedBox>
          </div>
        </div>

      <div className="max-xl:px-4 flex flex-wrap gap-3 max-md:flex-col md:justify-stretch max-w-[1300px] w-full">
        <div className="p-2 border-1 flex-1 rounded-[7px] bg-white border-neutral-200 flex items-center gap-3">
            <BiSearch className="text-[1.2rem] text-neutral-400"/>
            <input type="text" className="text-[0.9rem] flex-1 outline-0 ring-0" placeholder="Search destinations"/>
        </div>
        <div className="relative md:w-50 space-y-2">
            <div onClick={() => setIsContinetsOpen(!isContinetsOpen)} className="md:absolute bg-white py-2 px-4 text-[0.9rem] border-1 w-full rounded-[7px] border-neutral-200 flex items-center justify-between gap-3">
                <p>{continentOptions.filter((option) => option.isActive)[0].label}</p>
                <IoIosArrowDown className="text-[0.8rem]"/>
            </div>
            {isContinetsOpen && 
                <ul className="absolute top-[calc(100%+2px)] bg-white w-full rounded-[7px] z-1 border-1 border-neutral-200 shadow-xl">
                    {continentOptions.map((option) => (
                        <li className={`p-2 text-[0.9rem]`} key={option.id}>{option.label}</li>
                    ))}
                </ul>
            }
        </div>
        <div className="relative md:w-50 space-y-2">
            <div onClick={() => setIsBudgetsOpen(!isBudgetsOpen)} className="md:absolute bg-white py-2 px-4 text-[0.9rem] border-1 w-full rounded-[7px] border-neutral-200 flex items-center justify-between gap-3">
                <p>{budgetOptions.filter((option) => option.isActive)[0].label}</p>
                <IoIosArrowDown className="text-[0.8rem]"/>
            </div>
            {isBudgetsOpen && 
                <ul className="absolute top-[calc(100%+2px)] bg-white w-full rounded-[7px] border-1 border-neutral-200 shadow-xl">
                    {budgetOptions.map((option) => (
                        <li className={`p-2 text-[0.9rem]`} key={option.id}>{option.label}</li>
                    ))}
                </ul>
            }
        </div>
      </div>

      <div className="w-full flex flex-wrap max-md:flex-col md:justify-center gap-3 p-3 px-5">
        {DestinationCards.map((card) => (
					<DestinationCard card={card}/>
				))}
      </div>
    </div>
  )
}

export default Destinations
