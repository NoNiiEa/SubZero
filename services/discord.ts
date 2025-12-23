import { Subscription } from '@/types/subscription';

export const DiscordService = {
    async sendRenewalAlert(subscription: Subscription, nextDate: string) {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        const myDiscordId = process.env.DISCORD_USER_ID;
        if (!webhookUrl) {
            console.warn('Discord Webhook URL not configured. Skipping notification.');
            return;
        }

        const embed = {
            title: '❄️ SubZero Renewal Alert',
            description: `The subscription for **${subscription.name}** has been automatically rolled forward.`,
            color: 0x3b82f6,
            fields: [
                {
                    name: 'Amount',
                    value: `฿${subscription.cost.toFixed(2)}`,
                    inline: true
                },
                {
                    name: 'Period',
                    value: subscription.period,
                    inline: true
                },
                {
                    name: 'Next Billing Date',
                    value: nextDate,
                    inline: false
                }
            ],
            footer: { text: 'SubZero Automation' },
            timestamp: new Date().toISOString()
        };

        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    content: myDiscordId ? `Attention <@${myDiscordId}>!` : null,
                    embeds: [embed] 
                })
            });
        } catch (error) {
            console.error('Failed to send Discord notification:', error);
        }
    }
};