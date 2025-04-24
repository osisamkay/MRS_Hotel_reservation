// src/utils/bookingUtils.ts
import { differenceInDays, parseISO, isValid, isBefore, isAfter } from 'date-fns';
import { BookingFormData, BookingState, Room } from '@/src/types/booking';

/**
 * Calculate the total price for a booking
 * @param roomPrice Price per night
 * @param nights Number of nights
 * @param extraGuests Number of guests beyond the base price
 * @returns Total price
 */
export function calculateTotalPrice(roomPrice: number, nights: number, extraGuests: number = 0): number {
    // Base price is roomPrice * nights
    let total = roomPrice * nights;

    // Add extra guest fee if applicable (e.g., $25 per extra guest per night)
    if (extraGuests > 0) {
        const extraGuestFee = 25 * extraGuests * nights;
        total += extraGuestFee;
    }

    // Add taxes (e.g., 13% hotel tax)
    const taxRate = 0.13;
    const taxes = total * taxRate;

    return total + taxes;
}

/**
 * Validate booking dates
 * @param checkIn Check-in date string
 * @param checkOut Check-out date string
 * @returns Object with validation result and error message
 */
export function validateBookingDates(checkIn: string, checkOut: string): {
    isValid: boolean;
    error?: string;
    nights?: number;
} {
    try {
        // Parse the dates
        const checkInDate = parseISO(checkIn);
        const checkOutDate = parseISO(checkOut);

        // Check if dates are valid
        if (!isValid(checkInDate) || !isValid(checkOutDate)) {
            return { isValid: false, error: 'Invalid date format' };
        }

        // Check if check-out is after check-in
        if (isBefore(checkOutDate, checkInDate) || checkIn === checkOut) {
            return { isValid: false, error: 'Check-out date must be after check-in date' };
        }

        // Check if check-in is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day

        if (isBefore(checkInDate, today)) {
            return { isValid: false, error: 'Check-in date cannot be in the past' };
        }

        // Calculate nights
        const nights = differenceInDays(checkOutDate, checkInDate);

        // Check if stay is not too long (e.g., max 30 days)
        if (nights > 30) {
            return { isValid: false, error: 'Maximum stay is 30 days' };
        }

        return { isValid: true, nights };
    } catch (error) {
        console.error('Date validation error:', error);
        return { isValid: false, error: 'Error validating dates' };
    }
}

/**
 * Validate booking form data
 * @param data Form data
 * @returns Object with validation result and error messages
 */
export function validateBookingForm(data: BookingFormData): {
    isValid: boolean;
    errors: Record<string, string>;
} {
    const errors: Record<string, string> = {};

    // Validate name
    if (!data.firstName.trim()) {
        errors.firstName = 'First name is required';
    }

    if (!data.lastName.trim()) {
        errors.lastName = 'Last name is required';
    }

    // Validate email
    if (!data.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Invalid email format';
    }

    // Validate phone
    if (!data.phone.trim()) {
        errors.phone = 'Phone number is required';
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(data.phone)) {
        errors.phone = 'Invalid phone format';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Check if a room is available for the given dates
 * @param room Room to check
 * @param checkIn Check-in date string
 * @param checkOut Check-out date string
 * @param existingBookings Array of existing bookings
 * @returns Boolean indicating if room is available
 */
export function isRoomAvailable(
    room: Room,
    checkIn: string,
    checkOut: string,
    existingBookings: { checkIn: string; checkOut: string; status: string }[]
): boolean {
    if (!room.available) {
        return false;
    }

    try {
        // Parse the requested dates
        const requestedCheckIn = parseISO(checkIn);
        const requestedCheckOut = parseISO(checkOut);

        // Check if dates are valid
        if (!isValid(requestedCheckIn) || !isValid(requestedCheckOut)) {
            return false;
        }

        // Check for conflicts with existing bookings
        return !existingBookings.some(booking => {
            // Skip cancelled bookings
            if (booking.status === 'cancelled') {
                return false;
            }

            const bookingCheckIn = parseISO(booking.checkIn);
            const bookingCheckOut = parseISO(booking.checkOut);

            // Check for overlap
            return (
                (isAfter(requestedCheckIn, bookingCheckIn) && isBefore(requestedCheckIn, bookingCheckOut)) ||
                (isAfter(requestedCheckOut, bookingCheckIn) && isBefore(requestedCheckOut, bookingCheckOut)) ||
                (isBefore(requestedCheckIn, bookingCheckIn) && isAfter(requestedCheckOut, bookingCheckOut)) ||
                (isBefore(requestedCheckIn, bookingCheckOut) && isAfter(requestedCheckOut, bookingCheckIn))
            );
        });
    } catch (error) {
        console.error('Availability check error:', error);
        return false;
    }
}