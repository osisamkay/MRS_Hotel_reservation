import { BaseStorageService } from './baseStorageService';

class ReservationStorageService extends BaseStorageService {
  constructor() {
    super('reservations.json');
  }

  async createReservation(reservationData) {
    // Validate required fields
    const requiredFields = ['userId', 'roomId', 'checkIn', 'checkOut', 'guests'];
    for (const field of requiredFields) {
      if (!reservationData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate dates
    const checkIn = new Date(reservationData.checkIn);
    const checkOut = new Date(reservationData.checkOut);
    if (checkIn >= checkOut) {
      throw new Error('Check-out date must be after check-in date');
    }

    return this.create({
      ...reservationData,
      status: 'pending',
      totalPrice: reservationData.totalPrice || 0,
      paymentStatus: 'pending'
    });
  }

  async getUserReservations(userId) {
    return this.query(reservation => reservation.userId === userId);
  }

  async getRoomReservations(roomId) {
    return this.query(reservation => reservation.roomId === roomId);
  }

  async getReservationsByStatus(status) {
    return this.query(reservation => reservation.status === status);
  }

  async updateReservationStatus(id, status) {
    return this.update(id, { status });
  }

  async updatePaymentStatus(id, paymentStatus) {
    return this.update(id, { paymentStatus });
  }

  async checkRoomAvailability(roomId, checkIn, checkOut) {
    const reservations = await this.getRoomReservations(roomId);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    return !reservations.some(reservation => {
      const reservationCheckIn = new Date(reservation.checkIn);
      const reservationCheckOut = new Date(reservation.checkOut);
      return (
        (checkInDate >= reservationCheckIn && checkInDate < reservationCheckOut) ||
        (checkOutDate > reservationCheckIn && checkOutDate <= reservationCheckOut) ||
        (checkInDate <= reservationCheckIn && checkOutDate >= reservationCheckOut)
      );
    });
  }
}

export const reservationStorageService = new ReservationStorageService(); 