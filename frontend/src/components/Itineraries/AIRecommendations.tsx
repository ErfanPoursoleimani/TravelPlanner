import { useEffect, useRef, useState } from 'react';
import { Textarea } from '../Textarea';
// import Slider from '../Slider'
// import type { Recommendation } from '../../types/components';
import Calendar from '../Calendar';
import { CiCalendar } from 'react-icons/ci';

const AIRecommendations = (/* { onAddToItinerary = () => {} } */) => {
  const [preferences, setPreferences] = useState<string>("");
  // const [budget, setBudget] = useState<number[]>([500]);
  // const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState(50);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  /* const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: "1",
      type: "attraction",
      name: "Eiffel Tower",
      description:
        "Iconic iron lattice tower located on the Champ de Mars in Paris, France.",
      rating: 4.5,
      price: 25,
      duration: "2 hours",
      image:
        "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400&q=80",
      location: "Paris, France",
    },
    {
      id: "2",
      type: "restaurant",
      name: "Le Jules Verne",
      description:
        "Contemporary French cuisine with panoramic views from the Eiffel Tower.",
      rating: 4.7,
      price: 150,
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
      location: "Paris, France",
    },
    {
      id: "3",
      type: "accommodation",
      name: "Hotel Plaza Athénée",
      description: "Luxury hotel with Eiffel Tower views and elegant rooms.",
      rating: 4.8,
      price: 450,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
      location: "Paris, France",
    },
  ]); */

  /* const handleGenerateRecommendations = () => {
    setLoading(true);
    // Simulate API call with dynamic recommendations based on preferences
    setTimeout(() => {
      const newRecommendations = [
        {
          id: Math.random().toString(),
          type: "attraction" as const,
          name: preferences.includes("museum") ? "Art Museum" : "City Park",
          description: `Perfect for your interests in ${preferences || "general sightseeing"}.`,
          rating: 4.5 + Math.random() * 0.4,
          price: Math.floor(budget[0] * 0.1),
          duration: "2-3 hours",
          image:
            "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400&q=80",
          location: "Your destination",
        },
        {
          id: Math.random().toString(),
          type: "restaurant" as const,
          name: preferences.includes("food")
            ? "Local Cuisine Restaurant"
            : "Popular Bistro",
          description: `Highly rated restaurant matching your budget of ${budget[0]}.`,
          rating: 4.6 + Math.random() * 0.3,
          price: Math.floor(budget[0] * 0.15),
          image:
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
          location: "Your destination",
        },
        {
          id: Math.random().toString(),
          type: "accommodation" as const,
          name: budget[0] > 700 ? "Luxury Hotel" : "Boutique Hotel",
          description: `Comfortable accommodation within your ${budget[0]} budget.`,
          rating: 4.4 + Math.random() * 0.5,
          price: Math.floor(budget[0] * 0.4),
          image:
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
          location: "Your destination",
        },
      ];
      setRecommendations(newRecommendations);
      setLoading(false);
    }, 1500);
  }; */

  //----------------------------------------


  
  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const formatDate = (date: Date | null): string => {
    if (!date) return "Pick a date";
    
    const months: string[] = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
    setIsOpen(false);
  };
  
  return (
    <div className='px-6 py-7 border-1 border-gray-200 shadow-xl rounded-xl md:w-80 space-y-6'>
      <div className='space-y-2'>
        <h2 className='text-2xl font-bold'>AI Recommendations</h2>
        <p className='text-[0.9rem] text-gray-500'>Tell us your preferences and we'll suggest the perfect places for your trip.</p>
      </div>

      <div>
        <label
          htmlFor="preferences"
          className="block text-sm font-medium mb-1"
        >
          What are you looking for?
        </label>
        <Textarea
          id="preferences"
          placeholder="E.g., I want to visit historical sites, try local cuisine, and stay somewhere with a view..."
          value={preferences}
          onChange={(e: any) => setPreferences(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div>
        <label
          htmlFor="preferences"
          className="block text-sm font-medium mb-1"
        >
          {`Budget (per day): $550`}
        </label>
        <style>{`
          .range-slider::-webkit-slider-thumb {
            appearance: none;
            width: 17px;
            height: 17px;
            border-radius: 50%;
            background: white;
            border: 1px solid #9ca3af;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .range-slider::-moz-range-thumb {
            width: 17px;
            height: 17px;
            border-radius: 50%;
            background: white;
            border: 1px solid #9ca3af;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .range-slider::-moz-range-progress {
            background: #3b82f6;
            height: 4px;
            border-radius: 2px;
          }
        `}</style>
        <input 
          type="range" 
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
          className="range-slider w-full h-[6px] bg-gray-300 rounded-full appearance-none cursor-pointer focus:outline-none"
          style={{
            background: `linear-gradient(to right, #000 0%, ${value}%, #d1d5db ${value}%, #d1d5db 100%)`
          }}
        />
        <div className="flex text-gray-500 justify-between text-xs mt-1">
          <span>$100</span>
          <span>$1000</span>
        </div>
      </div>

      <div className="relative inline-block" ref={calendarRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 w-64 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <CiCalendar />
          <span className={selectedDate ? "text-gray-900" : "text-gray-500"}>
            {formatDate(selectedDate)}
          </span>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <Calendar
              selected={selectedDate}
              onSelect={handleDateSelect}
              showOutsideDays={true}
              mode="single"
            />
          </div>
        )}
      </div>

      <button className='w-full text-[0.9rem] bg-black rounded-[7px] p-2 text-white font-medium'>
        Generate Recommendations
      </button>
    </div>
  );
}

export default AIRecommendations
