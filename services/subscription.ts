import { addMonths, addYears, format, parseISO } from 'date-fns';
import { SubscriptionRepo } from "@/repository/subscription";
import { Subscription, CreateSubscriptionInput, UpdateSubscriptionInput } from "@/types/subscription";
import { DiscordService } from "./discord";

export const SubscriptionService = {
    async create(body: CreateSubscriptionInput): Promise<Subscription> {
        return await SubscriptionRepo.create(body);
    },

    async getAll(): Promise<Subscription[]> {
        return await SubscriptionRepo.findall();
    },

    async getById(id: number): Promise<Subscription | undefined> {
        return await SubscriptionRepo.findById(id);
    },

    async update(id: number, body: UpdateSubscriptionInput): Promise<Subscription> {
        return await SubscriptionRepo.update(id, body);
    },

    async delete(id: number): Promise<void> {
        return await SubscriptionRepo.delete(id);
    },

    async processDailyRenewals() {
        const today = format(new Date(), 'yyyy-MM-dd');
        
        const dueToday = await SubscriptionRepo.findByDate(today);
        
        const processed = [];

        for (const sub of dueToday) {
            const currentPath = new Date(sub.next_due);
            const nextDate = sub.period === 'monthly' 
                ? format(addMonths(currentPath, 1), 'yyyy-MM-dd')
                : format(addYears(currentPath, 1), 'yyyy-MM-dd');

            await SubscriptionRepo.update(sub.id!, {
                next_due: nextDate,
                id: sub.id
            });

            await DiscordService.sendRenewalAlert(sub, nextDate);

            processed.push({ name: sub.name, oldDate: sub.next_due, newDate: nextDate });
        }

        return processed;
    }
}