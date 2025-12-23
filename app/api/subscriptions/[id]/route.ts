import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/services/subscription';
import { Subscription, CreateSubscriptionInput } from '@/types/subscription';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const parseId = parseInt(id);
        if (isNaN(parseId)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }
        const subscription = SubscriptionService.getById(parseId)
        
        if (subscription == undefined) {
            return NextResponse.json(
                { error: 'Subscription not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(subscription);
    } catch (error) {
    return NextResponse.json(
        { error: `Failed to fetch subscriptions ${error}` },
        { status: 500 }
    );
  }
}