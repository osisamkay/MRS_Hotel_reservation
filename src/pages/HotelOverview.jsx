import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HotelOverview = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 font-serif">Hotel Overview</h1>
      
      {/* Location Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 font-serif">Location</h2>
        <p className="mb-2">
          The Moose Rock and Suites hotel is centrally located in Vancouver, just 5.2 km from Coal Harbor and Vancouver Downtown. Our premium hotel is walking distance from the best attractions, fine dining, and shopping venues in the heart of Vancouver.
        </p>
        <p>We provide unbeatable amenities for your business or leisure stay.</p>
      </section>
      
      {/* Rooms Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 font-serif">Rooms</h2>
        <p className="mb-2">
          Make yourself at home in one of the 342 guestrooms featuring refrigerators and LCD televisions. Your pillowtop bed comes with premium bedding, and all rooms are furnished with sofa beds. Rooms have private balconies with city or garden views. Complimentary wireless Internet access is available to keep you connected. Private bathrooms with shower/tub combinations feature designer toiletries and hair dryers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">In-room amenities</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Air conditioning</li>
              <li>Premium bedding</li>
              <li>Blackout drapes</li>
              <li>Sofa bed</li>
              <li>Free WiFi</li>
              <li>42-inch LCD TV</li>
              <li>Premium TV channels</li>
              <li>Refrigerator</li>
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Bathroom</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Private bathroom</li>
              <li>Shower/tub combination</li>
              <li>Designer toiletries</li>
              <li>Hair dryer</li>
              <li>Towels</li>
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Practical matters</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Laptop-friendly workspace</li>
              <li>Iron/ironing board</li>
              <li>Desk</li>
              <li>Free local calls</li>
              <li>Daily housekeeping</li>
              <li>Connecting rooms available</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Food and Drink Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 font-serif">Food and drink</h2>
        <p className="mb-2">
          Stop by one of our 3 on-site restaurants for a bite to eat. A bar is also available where guests can unwind with a drink. A complimentary full breakfast is served daily from 7:00 AM to 10:30 AM.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Dining options</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>3 restaurants</li>
              <li>1 bar/lounge</li>
              <li>24-hour room service</li>
              <li>Free breakfast (7:00-10:30 AM)</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Facilities Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 font-serif">Facilities</h2>
        <p className="mb-2">
          Take advantage of recreational amenities such as an indoor pool, a sauna, and a 24-hour fitness center. Additional features include complimentary wireless Internet access, concierge services, and babysitting.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">General</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>24-hour front desk</li>
              <li>Elevator</li>
              <li>ATM/banking</li>
              <li>Concierge services</li>
              <li>Dry cleaning/laundry service</li>
              <li>Luggage storage</li>
              <li>Multilingual staff</li>
              <li>Porter/bellhop</li>
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Attractions</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Babysitting (surcharge)</li>
              <li>Indoor pool</li>
              <li>Sauna</li>
              <li>Spa tub</li>
              <li>24-hour fitness facilities</li>
              <li>Ski storage</li>
              <li>Free WiFi</li>
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Business</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Business center</li>
              <li>Computer station</li>
              <li>Meeting rooms (8)</li>
              <li>Conference space</li>
              <li>Conference space size: 25,834 sq ft</li>
              <li>Conference center</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Parking and Transport Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 font-serif">Parking and Transport</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Parking</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Self parking (surcharge) - CAD 35 per night</li>
              <li>Valet parking (surcharge) - CAD 45 per night</li>
              <li>Limited parking spaces</li>
              <li>Height restrictions apply for parking</li>
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Transport</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Airport shuttle service (surcharge)</li>
              <li>Area shuttle (surcharge)</li>
              <li>Train station pick-up service</li>
              <li>Shopping center shuttle</li>
              <li>Ski shuttle (surcharge)</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Accessibility Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 font-serif">Accessibility</h2>
        <p>If you have any requests for specific accessibility needs, please contact the property using the information on the reservation confirmation received after booking.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Accessible facilities</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Accessible bathroom</li>
              <li>In-room accessibility</li>
              <li>Roll-in shower</li>
              <li>Wheelchair accessible (may have limitations)</li>
            </ul>
          </div>
        </div>
      </section>
      
      <div className="mt-8">
        <Link href="/rooms" className="bg-navy-700 text-white px-6 py-2 rounded hover:bg-navy-800">
          View Rooms & Rates
        </Link>
      </div>
    </div>
  );
};

export default HotelOverview; 