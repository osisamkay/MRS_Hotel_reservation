export interface Room {
    id: string;
    name: string;
    description: string;
    pricePerNight: number;
    capacity: number;
    amenities: string[];
    images: string[];
    type: string;
    status: 'available' | 'booked' | 'maintenance';
    createdAt?: Date;
    updatedAt?: Date;
} 