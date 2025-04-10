import React from 'react';
import Link from 'next/link';

const HotelOverview = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 font-serif border-b pb-4">Hotel Overview</h1>
      
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
        <h2 className="text-xl font-bold mb-3 font-serif border-b pb-2">Hotel Facilities</h2>
        <p className="mb-2">
          Take advantage of recreational amenities such as an indoor pool, a sauna, and a 24-hour fitness center. Additional features include complimentary wireless Internet access, concierge services, and babysitting.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div>
            <h3 className="font-bold mb-2">Sanitation standards</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Cleaned with disinfectant</li>
              <li>Contactless check-in/out available</li>
              <li>Hand sanitizer provided</li>
            </ul>
            
            <h3 className="font-bold mb-2 mt-4">Amenities</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Spa</li>
              <li>Maximum number of guests per room: 2</li>
              <li>Spa services on site</li>
              <li>24-hour fitness facilities</li>
              <li>Sauna</li>
              <li>Hot tub</li>
              <li>Pool access</li>
            </ul>
            
            <h3 className="font-bold mb-2 mt-4">Internet</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Free WiFi</li>
              <li>Free wired internet</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Parking and Transport</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Self parking (surcharge) - CAD 35 per night</li>
              <li>Valet parking (surcharge) - CAD 45 per night</li>
              <li>Airport shuttle</li>
              <li>Limited parking spaces</li>
              <li>Height restrictions apply for parking</li>
            </ul>
            
            <h3 className="font-bold mb-2 mt-4">Check-in/out details</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Check-in time: 3:00 PM - 2:00 AM</li>
              <li>Minimum check-in age: 19</li>
              <li>Check-out time: 12:00 PM</li>
            </ul>
            
            <h3 className="font-bold mb-2 mt-4">Food and drink</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>3 restaurants and 1 bar/lounge</li>
              <li>Continental breakfast (surcharge)</li>
              <li>Room service (24 hours)</li>
              <li>Coffee shop/café</li>
              <li>Snack bar</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Services</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>24-hour front desk</li>
              <li>Concierge</li>
              <li>Tour/ticket assistance</li>
              <li>Dry cleaning/laundry service</li>
              <li>Free newspapers in lobby</li>
              <li>Luggage storage</li>
              <li>Multilingual staff</li>
              <li>Porter</li>
              <li>Wedding services</li>
              <li>ATM/banking</li>
              <li>Business center</li>
              <li>Meeting rooms (8)</li>
              <li>Computer station</li>
              <li>Ballroom</li>
              <li>Banquet hall</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Facilities</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Designated smoking areas</li>
              <li>Elevator</li>
              <li>Gift shops/newsstands</li>
              <li>Terrace</li>
              <li>Library</li>
              <li>Fireplace in lobby</li>
              <li>Safe-deposit box at front desk</li>
              <li>Vending machine</li>
            </ul>
            
            <h3 className="font-bold mb-2 mt-4">Accessibility</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Accessible bathroom</li>
              <li>In-room accessibility</li>
              <li>Roll-in shower</li>
              <li>Wheelchair accessible (with limitations)</li>
              <li>Service animals welcome</li>
              <li>Braille/raised signage</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Hotel Information Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 font-serif border-b pb-2">Hotel Information</h2>
        
        <div className="mb-4">
          <h3 className="font-bold mb-2">Distances are calculated in a straight line from the property&apos;s location</h3>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold mb-2">Listed distances from property</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Vancouver False Creek: 5 km / 3.1 mi</li>
            <li>Vancouver Central Library: 5.1 km / 3.2 mi</li>
            <li>Vancouver City Centre Station: 5.1 km / 3.2 mi</li>
            <li>Orpheum Theatre: 5.2 km / 3.2 mi</li>
            <li>Pacific Centre Shopping Mall: 5.3 km / 3.3 mi</li>
            <li>Queen Elizabeth Theatre: 5.4 km / 3.4 mi</li>
            <li>Rogers Arena: 5.8 km / 3.6 mi</li>
            <li>Vancouver Waterfront: 5.8 km / 3.6 mi</li>
            <li>BC Place Stadium: 5.9 km / 3.7 mi</li>
            <li>Canada Place: 6 km / 3.7 mi</li>
            <li>Vancouver Convention Centre: 6.1 km / 3.8 mi</li>
            <li>Vancouver Aquarium: 9.8 km / 6.1 mi</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold mb-2">The nearest airports are:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Vancouver International Airport (YVR): 10.3 km / 6.4 mi</li>
            <li>Abbotsford, BC (YXX-Abbotsford Intl.): 67.2 km / 41.8 mi</li>
            <li>Nanaimo, BC (ZNA-Nanaimo Harbour Water Aerodrome): 57.9 km / 36 mi</li>
            <li>Mayne Island, BC (YAV-Miners Bay Seaplane Base): 71.5 km / 44.4 mi</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold mb-2">Room information</h3>
          <p className="text-sm mb-2">
            Make yourself at home in one of the 342 guestrooms featuring refrigerators and LCD televisions. 
            Your pillowtop bed comes with premium bedding, and all rooms are furnished with sofa beds. 
            Rooms have private balconies. Complimentary wireless Internet access keeps you connected, 
            and cable programming is available for your entertainment. Private bathrooms with shower/tub combinations 
            feature complimentary toiletries and hair dryers.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold mb-2">Hotel Facilities</h3>
          <p className="text-sm mb-2">
            Be sure to enjoy recreational amenities, including an indoor pool and a fitness center. 
            Additional features at this hotel include complimentary wireless Internet access, concierge services, 
            and gift shops/newsstands.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold mb-2">Food and Beverages</h3>
          <p className="text-sm mb-2">
            Enjoy fusion cuisine at Urban Spice, one of the hotel&apos;s 3 restaurants, or stay in and take advantage of the 24-hour room service. 
            Snacks are also available at the coffee shop/café. Need to unwind? Take a break with a tasty beverage at one of the 2 bars/lounges. 
            A complimentary full breakfast is served daily from 7:00 AM to 10:30 AM.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold mb-2">Important Information</h3>
          <p className="text-sm mb-2">
            You&apos;ll be asked to pay the following charges at the property:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Deposit: CAD 150 per accommodation, per stay</li>
            <li>Resort fee: CAD 20 per accommodation, per night</li>
          </ul>
          <p className="text-sm mt-2">The resort fee includes:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Phone calls</li>
            <li>Additional inclusions</li>
            <li>WiFi access (restricted bandwidth)</li>
            <li>In-room coffee</li>
          </ul>
          <p className="text-sm mt-2">We have included all charges provided to us by the property. However, charges can vary, for example, based on length of stay or the unit you book.</p>
          <p className="text-sm mt-2">The property has connecting/adjoining rooms, which are subject to availability and can be requested by contacting the property using the number on the booking confirmation.</p>
          <p className="text-sm mt-2">This property advises that enhanced cleaning and guest safety measures are currently in place.</p>
          <p className="text-sm mt-2">Disinfectant is used to clean the property; commonly-touched surfaces are cleaned with disinfectant between stays; bed sheets and towels are laundered at a temperature of at least 60°C/140°F.</p>
          <p className="text-sm mt-2">Personal protective equipment, including masks, will be available to guests.</p>
          <p className="text-sm mt-2">Social distancing measures are in place; staff at the property wear personal protective equipment; a shield is in place between staff and guests in main contact areas; periodic temperature checks are conducted on staff; temperature checks are available to guests; guests are provided with hand sanitizer.</p>
          <p className="text-sm mt-2">Contactless check-in and contactless check-out are available.</p>
        </div>
      </section>
      
      {/* Hotel Policies Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 font-serif border-b pb-2">Hotel Policies</h2>
        
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Guests must contact this property in advance to reserve a crib/infant bed.</li>
          <li>This property does not allow outside food and drinks in guest rooms.</li>
          <li>Special requests are subject to availability upon check-in and may incur additional charges.</li>
          <li>Special requests cannot be guaranteed.</li>
          <li>The property allows pets in specific rooms only and has other pet restrictions.</li>
          <li>Guests can arrange to bring pets by contacting the property directly.</li>
          <li>Construction is underway at a neighboring building and there may be noise disturbance from the construction work.</li>
          <li>Guests can rest easy knowing there&apos;s a carbon monoxide detector, a fire extinguisher, a smoke detector, a security system, and a first aid kit on site.</li>
          <li>Please note that cultural norms and guest policies may differ by country and by property.</li>
          <li>The policies listed are provided by the property.</li>
        </ul>
        
        <div className="mt-4">
          <h3 className="font-bold mb-2">Know Before You Go</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Pool access available from 7:00 AM to 10:00 PM.</li>
            <li>The property has connecting/adjoining rooms, which are subject to availability and can be requested by contacting the property using the number on the booking confirmation.</li>
            <li>Guests can arrange to bring pets by contacting the property directly, using the contact information on the booking confirmation (surcharges apply).</li>
            <li>This property advises that enhanced cleaning and guest safety measures are currently in place.</li>
            <li>Disinfectant is used to clean the property; commonly-touched surfaces are cleaned with disinfectant between stays; bed sheets and towels are laundered at a temperature of at least 60°C/140°F.</li>
            <li>Personal protective equipment, including masks, will be available to guests.</li>
            <li>Social distancing measures are in place; staff at the property wear personal protective equipment.</li>
            <li>Contactless check-in and contactless check-out are available.</li>
            <li>Each guestroom is kept vacant for a minimum of 24 hours between bookings.</li>
          </ul>
        </div>
      </section>
      
      <div className="mt-8">
        <Link href="/" className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 mr-4">
          Back to Home
        </Link>
        <Link href="/rooms" className="bg-navy-700 text-white px-6 py-2 rounded hover:bg-navy-800">
          View Rooms & Rates
        </Link>
      </div>
    </div>
  );
};

export default HotelOverview; 