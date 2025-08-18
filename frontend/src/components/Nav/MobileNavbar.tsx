// components/MobileNavbar.tsx
import React from 'react';
import { FaBookmark, FaRegUser, FaUser } from 'react-icons/fa';
import { FaTreeCity } from 'react-icons/fa6';
import { MdTravelExplore } from 'react-icons/md';
import { TiHome, TiHomeOutline } from 'react-icons/ti';
import { useLocation, useNavigate } from 'react-router-dom';

const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
      {id: 1, label: "Home", selectedIcon: <TiHome className='text-2xl' />, unselectedIcon: <TiHomeOutline className='text-2xl' />, href: `/`},
      {id: 2, label: "Destinations", selectedIcon: <FaTreeCity className='text-2xl' />, unselectedIcon: <FaTreeCity className='text-2xl' />, href: `/destinations`},
      {id: 3, label: "Itineraries", selectedIcon: <FaBookmark className='text-xl' />, unselectedIcon: <FaBookmark className='text-xl' />, href: `/itineraries`},
      {id: 4, label: "Map", selectedIcon: <MdTravelExplore className='text-2xl' />, unselectedIcon: <MdTravelExplore className='text-2xl' />, href: `/map` },
      {id: 5, label: "Profile", selectedIcon: <FaUser className='text-xl' />, unselectedIcon: <FaRegUser className='text-xl' />, href: `/profile` },
  ]

  return (
    <nav className="bg-white md:hidden shadow-lg min-h-15 flex justify-evenly items-stretch w-[100vw] fixed bottom-0 z-50">
      {navLinks.map((navLink) => (
        <div onClick={() => navigate(navLink.href)} key={navLink.id} className={`${isActive(navLink.href) ? "text-gray-800" : "text-gray-600"} flex flex-col justify-evenly py-3 items-center`}>
          {isActive(navLink.href) ? navLink.selectedIcon : navLink.unselectedIcon}
          <p className='text-[0.7rem]'>{navLink.label}</p>
        </div>
      ))}
    </nav>
  );
};

export default MobileNavbar;