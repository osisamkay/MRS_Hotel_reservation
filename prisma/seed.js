const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgres://neondb_owner:npg_EBQiol04THwX@ep-steep-math-a49rhqcb-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require'
        }
    }
});

const rooms = [
    {
        name: "Deluxe Ocean View",
        description: "Spacious room with stunning ocean views, king-size bed, and private balcony",
        price: 299.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Ocean View", "Private Balcony"],
        images: ["/rooms/deluxe-ocean-1.jpg", "/rooms/deluxe-ocean-2.jpg"]
    },
    {
        name: "Executive Suite",
        description: "Luxurious suite with separate living area, perfect for business travelers",
        price: 399.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Work Desk", "Living Room"],
        images: ["/rooms/executive-1.jpg", "/rooms/executive-2.jpg"]
    },
    {
        name: "Family Room",
        description: "Comfortable room for families with two queen beds and extra space",
        price: 349.99,
        capacity: 4,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Crib Available", "Family Friendly"],
        images: ["/rooms/family-1.jpg", "/rooms/family-2.jpg"]
    },
    {
        name: "Presidential Suite",
        description: "Ultimate luxury with panoramic views, private dining area, and butler service",
        price: 999.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Private Dining", "Butler Service", "Jacuzzi"],
        images: ["/rooms/presidential-1.jpg", "/rooms/presidential-2.jpg"]
    },
    {
        name: "Standard Room",
        description: "Comfortable and affordable room with all essential amenities",
        price: 199.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Air Conditioning"],
        images: ["/rooms/standard-1.jpg", "/rooms/standard-2.jpg"]
    },
    {
        name: "Honeymoon Suite",
        description: "Romantic suite with champagne on arrival and special amenities",
        price: 449.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Champagne", "Romantic Decor", "Private Balcony"],
        images: ["/rooms/honeymoon-1.jpg", "/rooms/honeymoon-2.jpg"]
    },
    {
        name: "Accessible Room",
        description: "Specially designed room for guests with mobility needs",
        price: 249.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Air Conditioning", "Wheelchair Accessible", "Roll-in Shower"],
        images: ["/rooms/accessible-1.jpg", "/rooms/accessible-2.jpg"]
    },
    {
        name: "Garden View Room",
        description: "Peaceful room overlooking our beautiful gardens",
        price: 279.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Garden View", "Private Balcony"],
        images: ["/rooms/garden-1.jpg", "/rooms/garden-2.jpg"]
    },
    {
        name: "Penthouse Suite",
        description: "Exclusive top-floor suite with 360-degree views",
        price: 1299.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Private Elevator", "Panoramic Views", "Private Terrace"],
        images: ["/rooms/penthouse-1.jpg", "/rooms/penthouse-2.jpg"]
    },
    {
        name: "Business Room",
        description: "Designed for business travelers with enhanced workspace",
        price: 329.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Air Conditioning", "Work Desk", "Printer Access", "Meeting Space"],
        images: ["/rooms/business-1.jpg", "/rooms/business-2.jpg"]
    },
    {
        name: "Pool View Room",
        description: "Room with direct views of our resort pool",
        price: 289.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Pool View", "Private Balcony"],
        images: ["/rooms/pool-1.jpg", "/rooms/pool-2.jpg"]
    },
    {
        name: "Junior Suite",
        description: "Spacious suite with separate sitting area",
        price: 379.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Sitting Area", "Coffee Maker"],
        images: ["/rooms/junior-1.jpg", "/rooms/junior-2.jpg"]
    },
    {
        name: "Connecting Rooms",
        description: "Two rooms connected by a door, perfect for families",
        price: 499.99,
        capacity: 4,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Connecting Door", "Family Friendly"],
        images: ["/rooms/connecting-1.jpg", "/rooms/connecting-2.jpg"]
    },
    {
        name: "Corner Suite",
        description: "Unique corner suite with extra windows and natural light",
        price: 429.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Corner Location", "Extra Windows"],
        images: ["/rooms/corner-1.jpg", "/rooms/corner-2.jpg"]
    },
    {
        name: "Spa Suite",
        description: "Suite with in-room spa facilities",
        price: 599.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "In-room Spa", "Massage Table", "Steam Shower"],
        images: ["/rooms/spa-1.jpg", "/rooms/spa-2.jpg"]
    },
    {
        name: "Pet-Friendly Room",
        description: "Specially designed room for guests traveling with pets",
        price: 259.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Air Conditioning", "Pet Bed", "Food Bowls", "Pet Welcome Kit"],
        images: ["/rooms/pet-1.jpg", "/rooms/pet-2.jpg"]
    },
    {
        name: "Extended Stay Suite",
        description: "Suite with kitchenette for longer stays",
        price: 349.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Air Conditioning", "Kitchenette", "Laundry Facilities", "Work Desk"],
        images: ["/rooms/extended-1.jpg", "/rooms/extended-2.jpg"]
    },
    {
        name: "Mountain View Room",
        description: "Room with breathtaking mountain views",
        price: 299.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Mountain View", "Private Balcony"],
        images: ["/rooms/mountain-1.jpg", "/rooms/mountain-2.jpg"]
    },
    {
        name: "City View Room",
        description: "Room with panoramic city views",
        price: 279.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "City View", "Private Balcony"],
        images: ["/rooms/city-1.jpg", "/rooms/city-2.jpg"]
    },
    {
        name: "Royal Suite",
        description: "Luxurious suite with separate bedroom and living area",
        price: 799.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Separate Living Room", "Dining Area", "Butler Service"],
        images: ["/rooms/royal-1.jpg", "/rooms/royal-2.jpg"]
    }
];

async function main() {
    try {
        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = await prisma.user.upsert({
            where: { email: 'admin@hotel.com' },
            update: {},
            create: {
                email: 'admin@hotel.com',
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin'
            },
        });

        console.log('Admin user created:', admin);

        // Create rooms
        for (const room of rooms) {
            await prisma.room.create({
                data: room,
            });
        }

        console.log('Rooms created successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    }); 