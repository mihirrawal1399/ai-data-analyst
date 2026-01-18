import { NextResponse } from 'next/server';
import { createGuestSession } from '@/lib/guest-session';

export async function POST() {
    try {
        const guestSession = await createGuestSession();

        return NextResponse.json({
            success: true,
            session: guestSession,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Failed to create guest session', details: error.message },
            { status: 500 }
        );
    }
}
