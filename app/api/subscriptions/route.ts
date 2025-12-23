import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/services/subscription';
import { Subscription, CreateSubscriptionInput, UpdateSubscriptionInput } from '@/types/subscription';
import { SubscriptionRepo } from '@/repository/subscription';

export async function POST(request: NextRequest) {
  try {
        const body: CreateSubscriptionInput = await request.json();
        const subscription: Subscription = SubscriptionService.create(body)
        return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create subscription' },
            { status: 500 }
        );
  }
}

export async function GET() {
    try {
        const subscriptions = SubscriptionService.getAll()
        return NextResponse.json(subscriptions);
    } catch (error) {
    return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
    try {
        const body: UpdateSubscriptionInput = await request.json();
        const subscription: Subscription = SubscriptionService.update(body.id, body)
        if (!subscription) {
            return NextResponse.json(
                { error: 'Subscription not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(subscription);
    } catch (error) {
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
        return NextResponse.json(
            { error: 'ID is required' },
            { status: 400 }
        );
        }
        const success = SubscriptionRepo.delete(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete subscription' },
            { status: 500 }
        );
    }
}