import { NextResponse } from 'next/server';
import { dataService } from '@/src/services/dataService';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['email', 'password', 'name'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUser = await dataService.getUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 409 }
      );
    }

    // Create user
    const user = await dataService.createUser({
      email: body.email,
      password: body.password,
      name: body.name,
      role: body.role || 'user'
    });

    // Return success response without sensitive information
    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}