import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/services/subscription';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const parseId = parseInt(id);
        
        if (isNaN(parseId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const subscription = await SubscriptionService.getById(parseId);
        
        if (!subscription) {
            return NextResponse.json(
                { error: 'Subscription not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(subscription);
    } catch (error) {
        console.error('GET [id] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscription' },
            { status: 500 }
        );
    }
}