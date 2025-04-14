import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { dataService } from '@/src/services/dataService';

/**
 * Get dashboard statistics
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only admin and staff can access dashboard stats
    if (!['admin', 'staff', 'super_admin'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized to access dashboard statistics' },
        { status: 403 }
      );
    }
    
    const stats = await dataService.getDashboardStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}