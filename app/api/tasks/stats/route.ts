import { NextRequest, NextResponse } from 'next/server';
import { taskStorage } from '@/lib/tasks';
import { authService } from '@/lib/auth';

// GET /api/tasks/stats - Get task statistics for authenticated user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await authService.verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const stats = taskStorage.getStats(user.id);
    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error('Get task stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch task stats' }, { status: 500 });
  }
}

