// scripts/seed-rooms.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const roomData = [
  {
    name: "Deluxe Mountain View Suite",
    description: "Experience luxury with our spacious Deluxe Mountain View Suite featuring stunning panoramic views of the surrounding mountains. This elegantly appointed suite includes a king-size bed with premium linens, a separate living area, and a marble bathroom with soaking tub and walk-in shower. Perfect for a romantic getaway or a relaxing retreat.",
    price: 289.99,
    capacity: 2,
    amenities: [
      "King Size Bed", 
      "Mountain View", 
      "Free WiFi", 
      "50\" Smart TV", 
      "Coffee Maker", 
      "Mini Bar", 
      "Air Conditioning", 
      "In-room Safe", 
      "Room Service",
      "Private Balcony"
    ],
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
    ],
    available: true
  },
  {
    name: "Family Lake Suite",
    description: "Our Family Lake Suite is perfect for families looking for comfort and convenience. This spacious accommodation features two queen beds, a pull-out sofa, and breathtaking views of the lake. The suite includes a mini kitchenette, dining area, and a large bathroom with bathtub. Enjoy quality time with your loved ones in this home away from home.",
    price: 349.99,
    capacity: 4,
    amenities: [
      "Two Queen Beds", 
      "Sofa Bed", 
      "Lake View", 
      "Free WiFi", 
      "55\" Smart TV", 
      "Kitchenette", 
      "Dining Area", 
      "Air Conditioning", 
      "In-room Safe",
      "Family Board Games"
    ],
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
    ],
    available: true
  },
  {
    name: "Executive Business Suite",
    description: "Designed with the business traveler in mind, our Executive Business Suite offers the perfect blend of comfort and functionality. The suite features a king-size bed, a dedicated work area with an ergonomic chair, high-speed internet, and a comfortable seating area. Enjoy complimentary access to our business center and executive lounge.",
    price: 279.99,
    capacity: 2,
    amenities: [
      "King Size Bed", 
      "Dedicated Workspace", 
      "High-speed WiFi", 
      "49\" 4K Smart TV", 
      "Coffee Machine", 
      "Mini Bar", 
      "Executive Lounge Access", 
      "In-room Safe", 
      "Ironing Facilities",
      "Daily Newspaper"
    ],
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
    ],
    available: true
  },
  {
    name: "Luxury Penthouse Suite",
    description: "Indulge in the ultimate luxury experience with our exclusive Penthouse Suite. Located on the top floor, this premium accommodation offers breathtaking panoramic views through floor-to-ceiling windows. The suite features a master bedroom with a king-size bed, a spacious living room, dining area, and a fully stocked bar. Enjoy the pinnacle of luxury with personalized butler service.",
    price: 599.99,
    capacity: 2,
    amenities: [
      "King Size Bed", 
      "Panoramic Views", 
      "Private Balcony", 
      "Living Room", 
      "Dining Area", 
      "Fully Stocked Bar", 
      "65\" OLED TV", 
      "Surround Sound System", 
      "Butler Service",
      "Jacuzzi Tub"
    ],
    images: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
    ],
    available: true
  },
  {
    name: "Cozy Standard Room",
    description: "Our Cozy Standard Room provides everything you need for a comfortable and affordable stay. This well-appointed room features a queen-size bed with quality linens, a work desk, and a modern bathroom with shower. Perfect for solo travelers or couples looking for value without compromising on comfort.",
    price: 149.99,
    capacity: 2,
    amenities: [
      "Queen Size Bed", 
      "Free WiFi", 
      "42\" LCD TV", 
      "Coffee Maker", 
      "Work Desk", 
      "Air Conditioning", 
      "Shower", 
      "Hair Dryer", 
      "Daily Housekeeping",
      "Wake-up Service"
    ],
    images: [
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1568495248636-6432b97bd949?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1552902019-ebcd97aa9aa0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
    ],
    available: true
  },
  {
    name: "Rustic Cabin Suite",
    description: "Experience the charm of our Rustic Cabin Suite, combining rustic elements with modern comforts. This unique accommodation features natural wood accents, a cozy fireplace, and a private porch overlooking the forest. The suite includes a plush queen-size bed, a sitting area with a sofa, and a bathroom with a rain shower.",
    price: 229.99,
    capacity: 2,
    amenities: [
      "Queen Size Bed", 
      "Fireplace", 
      "Private Porch", 
      "Forest View", 
      "Free WiFi", 
      "42\" Smart TV", 
      "Coffee Maker", 
      "Mini Fridge", 
      "Rain Shower",
      "Bathrobes"
    ],
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1587985064135-0366536eab42?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1609766857041-ed402ea8575f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1542928658-22251e208af2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
    ],
    available: true
  },
  {
    name: "Oceanfront Premium Room",
    description: "Wake up to the sound of waves in our Oceanfront Premium Room. This beautiful accommodation offers direct views of the ocean from your private balcony. The room features a king-size bed, a comfortable seating area, and a luxurious bathroom with both a soaking tub and a separate shower. Enjoy the ultimate seaside retreat.",
    price: 319.99,
    capacity: 2,
    amenities: [
      "King Size Bed", 
      "Ocean View", 
      "Private Balcony", 
      "Free WiFi", 
      "55\" Smart TV", 
      "Premium Sound System", 
      "Coffee Machine", 
      "Mini Bar", 
      "Soaking Tub",
      "Beach Access"
    ],
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
    ],
    available: true
  },
  {
    name: "Honeymoon Suite",
    description: "Celebrate your special moments in our romantic Honeymoon Suite. This intimate retreat features a luxurious king-size canopy bed, a cozy seating area with a love seat, and a spa-inspired bathroom with a two-person jacuzzi tub. Enjoy champagne on your private balcony with stunning sunset views, creating memories that will last a lifetime.",
    price: 379.99,
    capacity: 2,
    amenities: [
      "King Canopy Bed", 
      "Two-person Jacuzzi", 
      "Private Balcony", 
      "Sunset View", 
      "Free WiFi", 
      "50\" Smart TV", 
      "Champagne Service", 
      "Rose Petal Turndown", 
      "Couples Massage Option",
      "Breakfast in Bed Service"
    ],
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1601565415267-274196cbbf88?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200"
    ],
    available: true
  }
];

async function seedRooms() {
  console.log('Starting to seed rooms...');
  
  try {
    // First, check if we need to clean existing rooms
    const existingRoomsCount = await prisma.room.count();
    
    if (existingRoomsCount > 0) {
      // We have existing rooms - check if safe to delete
      const bookingsExist = await prisma.booking.count() > 0;
      
      if (bookingsExist) {
        console.log('⚠️ There are existing bookings in the database.');
        console.log('To protect your data, we will add new rooms without deleting existing ones.');
      } else {
        // Safe to delete rooms
        console.log(`Deleting ${existingRoomsCount} existing rooms...`);
        await prisma.room.deleteMany({});
        console.log('✅ Existing rooms deleted successfully');
      }
    }
    
    // Create new rooms
    let counter = 0;
    for (const room of roomData) {
      // Check if room already exists with the same name to avoid duplicates
      const existingRoom = await prisma.room.findFirst({
        where: { name: room.name }
      });
      
      if (!existingRoom) {
        const createdRoom = await prisma.room.create({
          data: room
        });
        console.log(`✅ Created room: ${createdRoom.name} (ID: ${createdRoom.id})`);
        counter++;
      } else {
        console.log(`⏩ Skipped: Room "${room.name}" already exists`);
      }
    }
    
    console.log(`\n🎉 Seeding completed! Added ${counter} new rooms to the database.`);
  } catch (error) {
    console.error('❌ Error seeding rooms:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedRooms()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fatal error during seeding:', error);
    process.exit(1);
  });
