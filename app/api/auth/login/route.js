import { NextResponse } from 'next/server';
import { dataService } from '@/src/services/dataService';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Verify credentials - this is only needed if you're using this API route directly
    // For NextAuth, authentication is handled by the [...nextauth] route
    const user = await dataService.validateUser(body.email, body.password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Note: We don't need to generate JWT token here since NextAuth handles that
    // Just return user data without sensitive info
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}