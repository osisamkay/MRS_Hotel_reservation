import { BaseStorageService } from './baseStorageService';

class RoomStorageService extends BaseStorageService {
  constructor() {
    super('rooms.json');
  }

  async createRoom(roomData) {
    // Validate required fields
    const requiredFields = ['number', 'type', 'price', 'capacity'];
    for (const field of requiredFields) {
      if (!roomData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return this.create({
      ...roomData,
      isAvailable: true,
      amenities: roomData.amenities || [],
      images: roomData.images || [],
      status: 'active'
    });
  }

  async getAvailableRooms(params = {}) {
    const rooms = await this.getAll();
    return rooms.filter(room => {
      const matchesType = !params.type || room.type === params.type;
      const matchesCapacity = !params.capacity || room.capacity >= params.capacity;
      const matchesPrice = !params.maxPrice || room.price <= params.maxPrice;
      return room.isAvailable && matchesType && matchesCapacity && matchesPrice;
    });
  }

  async getRoomsByType(type) {
    return this.query(room => room.type === type);
  }

  async updateRoomAvailability(id, isAvailable) {
    return this.update(id, { isAvailable });
  }

  async updateRoomStatus(id, status) {
    return this.update(id, { status });
  }
}

export const roomStorageService = new RoomStorageService(); 