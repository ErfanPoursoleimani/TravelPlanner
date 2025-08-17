// components/Navbar.tsx
import React from 'react';
import { FaBookmark, FaUser } from 'react-icons/fa';
import { FaTreeCity } from 'react-icons/fa6';
import { MdTravelExplore } from 'react-icons/md';
import { TiHome } from 'react-icons/ti';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

/*   const handleLogoClick = () => {
    navigate('/');
  }; */

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    {id: 1, label: "Home", selectedIcon: <TiHome className='text-[1rem]' />, href: `/`},
    {id: 2, label: "Destinations", selectedIcon: <FaTreeCity className='text-[1rem]' />, href: `/destinations`},
    {id: 3, label: "Itineraries", selectedIcon: <FaBookmark className='text-[1rem]' />, href: `/itineraries`},
    {id: 4, label: "Map", selectedIcon: <MdTravelExplore className='text-[1rem]' />, href: `/map` },
    {id: 5, label: "Profile", selectedIcon: <FaUser className='text-[1rem]' />, href: `/profile` },
  ]

  return (
    <nav className="bg-white min-h-17 flex justify-center items-stretch px-3 shadow-lg sticky top-0 z-50">
      <div className='flex justify-between items-stretch w-full max-w-[1300px]'>
        <h1 className='flex items-center text-2xl font-bold'>AITravellor</h1>
        <ul className='flex items-center gap-4 max-md:hidden'>
          {navLinks.map((navLink) => (
            <li onClick={() => navigate(navLink.href)} className='flex items-center' key={navLink.id}>
              {/* {navLink.selectedIcon} */}
              <p className={`${isActive(navLink.href) ? "text-black" : "text-neutral-600"} text-[0.9rem] font-medium`}>{navLink.label}</p>
            </li>
          ))}
        </ul>
        <div className='flex items-center gap-4'>
          <button className="text-[0.8rem] border-1 px-3 py-[6px] border-neutral-200 rounded-[7px]">Sign In</button>
          <button className="text-[0.8rem] border-1 px-3 py-[6px] bg-black text-white rounded-[7px]">Sign Up</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;