import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/services/subscription';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from '@/types/subscription';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
        const body: CreateSubscriptionInput = await request.json();
        
        const subscription = await SubscriptionService.create(body);
        
        return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
        console.error('POST Error:', error);
        return NextResponse.json(
            { error: 'Failed to create subscription' },
            { status: 500 }
        );
  }
}

export async function GET() {
    try {
        const subscriptions = await SubscriptionService.getAll();
        
        return NextResponse.json(subscriptions);
    } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscriptions' },
            { status: 500 }
        );
  }
}

export async function PUT(request: NextRequest) {
    try {
        const body: UpdateSubscriptionInput = await request.json();
        
        // Added 'await'
        const subscription = await SubscriptionService.update(body.id, body);
        
        return NextResponse.json(subscription);
    } catch (error) {
        console.error('PUT Error:', error);
        return NextResponse.json(
            { error: 'Failed to update subscription' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Changed to use Service layer and added 'await'
        await SubscriptionService.delete(parseInt(id));
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete subscription' },
            { status: 500 }
        );
    }
}