import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

export class EncryptionManager {
  constructor() {
    // In production, this should be stored securely (e.g., AWS KMS, HashiCorp Vault)
    this.encryptionKey = process.env.ENCRYPTION_KEY || this.generateKey();
  }

  generateKey() {
    return crypto.randomBytes(KEY_LENGTH).toString('hex');
  }

  encrypt(data) {
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const salt = crypto.randomBytes(SALT_LENGTH);
      
      // Derive key using PBKDF2
      const key = crypto.pbkdf2Sync(
        this.encryptionKey,
        salt,
        100000,
        KEY_LENGTH,
        'sha256'
      );

      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
      
      // Convert data to string if it's an object
      const dataToEncrypt = typeof data === 'object' 
        ? JSON.stringify(data) 
        : data.toString();

      let encrypted = cipher.update(dataToEncrypt, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();

      // Combine all components
      const encryptedData = {
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        tag: tag.toString('hex'),
        encrypted: encrypted
      };

      return Buffer.from(JSON.stringify(encryptedData)).toString('base64');
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  decrypt(encryptedData) {
    try {
      const data = JSON.parse(Buffer.from(encryptedData, 'base64').toString());
      
      const iv = Buffer.from(data.iv, 'hex');
      const salt = Buffer.from(data.salt, 'hex');
      const tag = Buffer.from(data.tag, 'hex');
      const encrypted = data.encrypted;

      // Derive key using PBKDF2
      const key = crypto.pbkdf2Sync(
        this.encryptionKey,
        salt,
        100000,
        KEY_LENGTH,
        'sha256'
      );

      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      // Try to parse as JSON, return as is if not JSON
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Helper method to encrypt specific fields in an object
  encryptSensitiveFields(obj, fieldsToEncrypt) {
    const encryptedObj = { ...obj };
    
    for (const field of fieldsToEncrypt) {
      if (obj[field]) {
        encryptedObj[field] = this.encrypt(obj[field]);
      }
    }
    
    return encryptedObj;
  }

  // Helper method to decrypt specific fields in an object
  decryptSensitiveFields(obj, fieldsToDecrypt) {
    const decryptedObj = { ...obj };
    
    for (const field of fieldsToDecrypt) {
      if (obj[field]) {
        decryptedObj[field] = this.decrypt(obj[field]);
      }
    }
    
    return decryptedObj;
  }
} 