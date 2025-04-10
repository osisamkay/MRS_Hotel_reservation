import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SecondaryNav = () => {
  const pathname = usePathname();
   // Navigation items with their paths
  const navItems = [
    { name: 'Photos', path: '/photos' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Map', path: '/map' },
    { name: 'Hotel Overview', path: '/hotel-overview' },
    { name: 'Hotel Facilities', path: '/facilities' },
    { name: 'Hotel Information', path: '/information' },
    { name: 'Hotel Policies', path: '/policies' },
  ];

  return (
     
      <div className="bg-white mt-4 mb-20">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between overflow-x-auto">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
                className={` py-3 whitespace-nowrap font-bold hover:bg-gray-100 ${
                  pathname === item.path ? 'border-b-2 border-navy-700 font-medium' : 'text-gray-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
  );
};

export default SecondaryNav; 