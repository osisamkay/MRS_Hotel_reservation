// import React, { useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import AvailabilitySearch from '../components/AvailabilitySearch';
// import MapSection from '../components/MapSection';
// import SecondaryNav from '../components/SecondaryNav';
// import RoomPhotos from '../components/RoomPhotos';
// import { Link as RouterLink } from 'react-router-dom';
// import { RoomPhotos } from './../components/RoomPhotos';

// const HomePage = () => {
//   const [selectedMonth, setSelectedMonth] = useState(0); // 0 for April, 1 for May
//   const [selectedCheckInDate, setSelectedCheckInDate] = useState(13);
//   const [selectedCheckOutDate, setSelectedCheckOutDate] = useState(15);
//   const [rooms, setRooms] = useState(1);
//   const [adults, setAdults] = useState(2);
//   const [seniors, setSeniors] = useState(0);
//   const [showCalendar, setShowCalendar] = useState(false);
  
//   // Calendar data
//   const months = [
//     { name: 'April 2025', days: 30, firstDay: 2 }, // Tuesday
//     { name: 'May 2025', days: 31, firstDay: 4 }    // Thursday
//   ];

//   const renderCalendar = (monthIndex) => {
//     const month = months[monthIndex];
//     const daysArray = Array.from({ length: month.days }, (_, i) => i + 1);
//     const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
//     // Add empty cells for days before the 1st
//     const emptyCells = Array.from({ length: month.firstDay }, (_, i) => null);
//     const calendarDays = [...emptyCells, ...daysArray];
    
//     return (
//       <div className="w-full">
//         <div className="mb-2 text-center font-medium">{month.name}</div>
//         <div className="grid grid-cols-7 gap-1 text-center">
//           {weekdays.map((day, i) => (
//             <div key={`head-${i}`} className="text-xs font-medium py-1">{day}</div>
//           ))}
          
//           {calendarDays.map((day, i) => {
//             if (day === null) return <div key={`empty-${i}`} className="py-2"></div>;
            
//             const isSelected = monthIndex === 0 
//               ? (day >= selectedCheckInDate && day <= selectedCheckOutDate)
//               : (day <= selectedCheckOutDate && monthIndex === 1);
            
//             const isToday = monthIndex === 0 && day === 13;
            
//             return (
//               <div 
//                 key={`day-${i}`} 
//                 className={`py-2 text-sm cursor-pointer rounded-full
//                   ${isSelected ? 'bg-navy-700 text-white' : ''} 
//                   ${isToday && !isSelected ? 'border border-navy-700' : ''}
//                   hover:bg-gray-100`}
//                 onClick={() => {
//                   if (monthIndex === 0 && day < 28) {
//                     setSelectedCheckInDate(day);
//                     setSelectedCheckOutDate(day + 2);
//                   }
//                 }}
//               >
//                 {day}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       {/* Hero Image */}
//       <div className="relative w-full h-64 md:h-96">
//         <Image
//           src="/assets/images/hero-image.svg"
//           alt="Hotel exterior"
//           fill
//           className="object-cover"
//           priority
//         />
//       </div>

//       <div className="container mx-auto p-6">
//         {/* Secondary Navigation */}
//         <SecondaryNav />
        
//         {/* Availability Check Section */}
//         <AvailabilitySearch />

//         {/* Map Section */}
//         <MapSection />
//       </div>

//       {/* Room Photos */}
//      <RoomPhotos /> 
      
//       {/* Check Availability Section */}
//       <div className="container mx-auto px-4 py-4 mb-8">
//         <h2 className="text-2xl font-bold mb-6 text-center text-navy-700 font-serif">Check Availability for MRS Hotel</h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Check-In Date */}
//           <div>
//             <label className="block text-gray-700 mb-2">Check-In date</label>
//             <div 
//               className="bg-gray-200 border border-gray-300 rounded p-2 h-12 flex items-center cursor-pointer"
//               onClick={() => setShowCalendar(true)}
//             >
//               <span className="text-gray-800">
//                 {selectedCheckInDate} Apr 2025
//               </span>
//             </div>
//           </div>
          
//           {/* Check-Out Date */}
//           <div>
//             <label className="block text-gray-700 mb-2">Check-Out date</label>
//             <div 
//               className="bg-gray-200 border border-gray-300 rounded p-2 h-12 flex items-center cursor-pointer"
//               onClick={() => setShowCalendar(true)}
//             >
//               <span className="text-gray-800">
//                 {selectedCheckOutDate} Apr 2025
//               </span>
//             </div>
//           </div>
          
//           {/* Guests */}
//           <div>
//             <label className="block text-gray-700 mb-2">Guests</label>
//             <div className="bg-gray-200 border border-gray-300 rounded p-2 h-12 flex items-center cursor-pointer">
//               <span className="text-gray-800">
//                 {adults + seniors} {adults + seniors === 1 ? 'Guest' : 'Guests'}
//               </span>
//             </div>
//           </div>
          
//           {/* Rooms */}
//           <div>
//             <label className="block text-gray-700 mb-2">Rooms</label>
//             <div className="bg-gray-200 border border-gray-300 rounded p-2 h-12 flex items-center cursor-pointer">
//               <span className="text-gray-800">
//                 {rooms} {rooms === 1 ? 'Room' : 'Rooms'}
//               </span>
//             </div>
//           </div>
//         </div>
        
//         {/* Calendar */}
//         {showCalendar && (
//           <div className="mt-6 p-4 bg-white rounded-lg shadow-lg">
//             <div className="flex justify-between items-center mb-4">
//               <button 
//                 className="p-2 rounded-full hover:bg-gray-100"
//                 onClick={() => setSelectedMonth(0)}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//               </button>
              
//               <div className="grid grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
//                 {renderCalendar(0)}
//                 {renderCalendar(1)}
//               </div>
              
//               <button 
//                 className="p-2 rounded-full hover:bg-gray-100"
//                 onClick={() => setSelectedMonth(1)}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                 </svg>
//               </button>
//             </div>
            
//             <div className="rounded-lg bg-gray-100 p-4 mt-4">
//               <div className="flex items-center justify-around mb-8">
//                 <div className="flex flex-col items-center">
//                   <div className="text-sm text-gray-500 mb-2">Apr 13 to Apr 15</div>
//                   <div className="text-sm bg-gray-200 px-4 py-1 rounded-full">
//                     {rooms} room · {adults} {adults === 1 ? 'adult' : 'adults'} · {seniors} {seniors === 1 ? 'senior' : 'seniors'}
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex bg-gray-200 p-4 rounded-lg">
//                 <div className="grid grid-cols-3 gap-4 w-full">
//                   {/* Rooms Controls */}
//                   <div className="flex items-center">
//                     <div className="mr-4">Rooms</div>
//                     <div className="flex items-center">
//                       <button 
//                         className="w-8 h-8 bg-gray-800 text-white rounded-full"
//                         onClick={() => setRooms(Math.max(1, rooms - 1))}
//                       >-</button>
//                       <span className="mx-4">{rooms}</span>
//                       <button 
//                         className="w-8 h-8 bg-gray-800 text-white rounded-full"
//                         onClick={() => setRooms(rooms + 1)}
//                       >+</button>
//                     </div>
//                   </div>
                  
//                   {/* Adults Controls */}
//                   <div className="flex items-center">
//                     <div className="mr-4">Adults</div>
//                     <div className="flex items-center">
//                       <button 
//                         className="w-8 h-8 bg-gray-800 text-white rounded-full"
//                         onClick={() => setAdults(Math.max(1, adults - 1))}
//                       >-</button>
//                       <span className="mx-4">{adults}</span>
//                       <button 
//                         className="w-8 h-8 bg-gray-800 text-white rounded-full"
//                         onClick={() => setAdults(adults + 1)}
//                       >+</button>
//                     </div>
//                   </div>
                  
//                   {/* Seniors Controls */}
//                   <div className="flex items-center">
//                     <div className="mr-4">
//                       <div>Seniors</div>
//                       <div className="text-xs text-gray-500">(60+)</div>
//                     </div>
//                     <div className="flex items-center">
//                       <button 
//                         className="w-8 h-8 bg-gray-800 text-white rounded-full"
//                         onClick={() => setSeniors(Math.max(0, seniors - 1))}
//                       >-</button>
//                       <span className="mx-4">{seniors}</span>
//                       <button 
//                         className="w-8 h-8 bg-gray-800 text-white rounded-full"
//                         onClick={() => setSeniors(seniors + 1)}
//                       >+</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Check Availability Button */}
//         <div className="mt-6">
//           <button 
//             className="w-full bg-navy-700 text-white font-bold py-3 px-6 rounded"
//             onClick={() => setShowCalendar(false)}
//           >
//             Check Availability
//           </button>
//         </div>
//       </div>
      
//       {/* Map Section */}
//       <div className="container mx-auto px-4 py-4 mb-16">
//         <h2 className="text-2xl font-bold mb-6 text-center font-serif">Map</h2>
//         <div className="relative h-80 w-full rounded-lg overflow-hidden bg-gray-200">
//           <img
//             src="/assets/images/map-preview.svg"
//             alt="Hotel location on map"
//             className="object-cover h-full w-full"
//           />
//         </div>
//       </div>
      
//       {/* Learn More Section */}
//       <div className="container mx-auto px-4 py-4 mb-16 text-center">
//         <RouterLink 
//           to="/hotel-overview" 
//           className="bg-navy-700 hover:bg-navy-800 text-white font-bold py-3 px-8 rounded-lg inline-block"
//         >
//           Learn More About Our Hotel
//         </RouterLink>
//       </div>
//     </>
//   );
// };

// export default HomePage; 