
const DestinationCard = ({card}: {card: {label: string, imgUrl: string, description: string, id: number}}) => {
  return (
    <div className='relative min-h-70 max-sm:flex-1 min-w-70 sm:max-w-70 rounded-[7px] border-1 border-neutral-200 space-y-3'>
      <img className='absolute h-full -z-1 w-full object-cover rounded-t-[7px]' src={"https://i.postimg.cc/1sXvNbzV/ricefield1.jpg"} alt="" />
      <div className="absolute bottom-0 w-full left-0 bg-gradient-to-t from-[#ffffff93] from-5% backdrop-blur-[2px] space-y-3 p-4">
        <p className='text-[1.2rem] text-white font-medium'>{card.label}</p>
        <p className='truncate text-[0.8rem] text-black'>{card.description}</p>
        <button className='w-full font-medium text-[0.8rem] bg-white p-1 shadow-xl rounded-[7px]'>
          Plan Trip
        </button>
      </div>
    </div>
  )
}

export default DestinationCard
