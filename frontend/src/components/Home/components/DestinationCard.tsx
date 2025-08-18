
const DestinationCard = ({card}: {card: {label: string, imgUrl: string, description: string, id: number}}) => {
  return (
    <div className='max-sm:flex-1 min-w-70 sm:max-w-70 bg-white rounded-[7px] border-1 border-neutral-200 space-y-3'>
      <img className='h-50 w-full object-cover rounded-t-[7px]' src={"https://i.imgur.com/fpccn0N.png"} alt="" />
      <div className="space-y-3 p-4">
        <p className='text-[1.1rem] font-medium'>{card.label}</p>
        <p className='truncate text-[0.9rem] text-gray-500'>{card.description}</p>
        <button className='w-full font-medium text-[0.8rem] p-1 border-1 border-gray-200 shadow-2xl rounded-[7px]'>
          Plan Trip
        </button>
      </div>
    </div>
  )
}

export default DestinationCard
