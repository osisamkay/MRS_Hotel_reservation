import fs from 'fs';
import path from 'path';

export class BaseStorageService {
  constructor(fileName) {
    this.dbPath = path.join(process.cwd(), 'data');
    this.filePath = path.join(this.dbPath, fileName);
    this.initializeStorage();
  }

  initializeStorage() {
    if (!fs.existsSync(this.dbPath)) {
      fs.mkdirSync(this.dbPath, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({ items: [] }, null, 2));
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error);
      return { items: [] };
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${this.filePath}:`, error);
      return false;
    }
  }

  async create(item) {
    try {
      const data = this.read();
      const newItem = {
        id: this.generateId(),
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.items.push(newItem);
      return this.write(data) ? newItem : null;
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    return this.read().items;
  }

  async getById(id) {
    const data = this.read();
    return data.items.find(item => item.id === id);
  }

  async update(id, updateData) {
    try {
      const data = this.read();
      const index = data.items.findIndex(item => item.id === id);
      
      if (index === -1) {
        throw new Error('Item not found');
      }

      data.items[index] = {
        ...data.items[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      return this.write(data) ? data.items[index] : null;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const data = this.read();
      const index = data.items.findIndex(item => item.id === id);
      
      if (index === -1) {
        throw new Error('Item not found');
      }

      data.items.splice(index, 1);
      return this.write(data);
    } catch (error) {
      throw error;
    }
  }

  async query(filterFn) {
    const data = this.read();
    return data.items.filter(filterFn);
  }
} 