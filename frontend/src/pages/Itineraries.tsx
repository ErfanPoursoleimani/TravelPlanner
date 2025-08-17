import AIRecommendations from "../components/Itineraries/AIRecommendations"
import ItineraryBuilder from "../components/Itineraries/ItineraryBuilder"

const Itineraries = () => {
  return (
    <div className="flex justify-center bg-white">
      <div className="flex max-md:flex-col gap-7 p-6 bg-white max-w-[1300px] w-full">
        <ItineraryBuilder />
        <AIRecommendations />
      </div>
    </div>
  )
}

export default Itineraries
