const { storageService } = require('../src/services/storage');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
    try {
        // Admin user details
        const adminUser = {
            fullName: 'System Administrator',
            username: 'admin',
            email: 'admin@mrs.ca',
            role: 'admin',
            accessLevel: 'full',
            password: await bcrypt.hash('Admin@123', 10),
            mustChangePassword: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Create the admin user
        const newAdmin = await storageService.createUser(adminUser);
        console.log('Admin user created successfully:', newAdmin);
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

createAdminUser(); 