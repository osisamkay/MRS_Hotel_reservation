// src/types/booking.ts
export interface Room {
    id: string;
    name: string;
    description: string;
    price: number;
    capacity: number;
    amenities: string[];
    images: string[];
    available: boolean;
    bedType?: string;
    type?: string;
    createdAt: string;
    updatedAt: string;
}

export interface RoomSearchParams {
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: number;
}

export interface BookingFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests: string;
}

export interface PaymentFormData {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    cvv: string;
}

export interface Booking {
    id: string;
    userId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
    room: Room;
    payment?: Payment;
    specialRequests: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Payment {
    id: string;
    bookingId: string;
    amount: number;
    status: PaymentStatus;
    method: string;
    createdAt: string;
    updatedAt: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface BookingContextType {
    bookingState: BookingState;
    updateBookingState: (newState: Partial<BookingState>) => void;
    resetBookingState: () => void;
    selectRoom: (room: Room) => void;
}

export interface BookingState {
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: number;
    selectedRoom: Room | null;
    paymentMethod?: string;
    specialRequests?: string;
}