import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/services/subscription';

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (!process.env.CRON_SECRET || authHeader !== expectedAuth) {
        return NextResponse.json(
            { error: 'Unauthorized: Invalid or missing CRON_SECRET' }, 
            { status: 401 }
        );
    }

    try {
        const report = await SubscriptionService.processDailyRenewals();

        return NextResponse.json({
            success: true,
            message: `Processed ${report.length} renewals.`,
            data: report
        });
    } catch (error: any) {
        console.error('Cron Job Failed:', error);
        return NextResponse.json(
            { error: 'Internal Server Error during renewal process' }, 
            { status: 500 }
        );
    }
}