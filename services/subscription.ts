import { db } from "@/lib/db";
import { addMonths, addYears, format, parseISO } from 'date-fns';
import { SubscriptionRepo } from "@/repository/subscription";
import { Subscription, CreateSubscriptionInput, UpdateSubscriptionInput } from "@/types/subscription";
import { DiscordService } from "./discord";

export const SubscriptionService = {
    create(body: CreateSubscriptionInput): Subscription {
        return SubscriptionRepo.create(body)
    },

    getAll(): Subscription[] {
        return SubscriptionRepo.findall()
    },

    getById(id: number): Subscription | undefined {
        return SubscriptionRepo.findById(id)
    },

    update(id: number, body: UpdateSubscriptionInput): Subscription {
        return SubscriptionRepo.update(id, body)
    },

    delete(id: number): void {
        return SubscriptionRepo.delete(id)
    },

    async processDailyRenewals() {
        const today = format(new Date(), 'yyyy-MM-dd');
        const dueToday = SubscriptionRepo.findByDate(today);
        const processed = [];

        for (const sub of dueToday) {
            const currentPath = parseISO(sub.next_due);
            const nextDate = sub.period === 'monthly' 
                ? format(addMonths(currentPath, 1), 'yyyy-MM-dd')
                : format(addYears(currentPath, 1), 'yyyy-MM-dd');

            SubscriptionRepo.update(sub.id!, {
                next_due: nextDate,
                id: sub.id
            });

            await DiscordService.sendRenewalAlert(sub, nextDate);

            processed.push({ name: sub.name, oldDate: sub.next_due, newDate: nextDate });
        }

        return processed;
    }
}