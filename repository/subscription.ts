import { db } from "@/lib/db";
import { Subscription, CreateSubscriptionInput, UpdateSubscriptionInput } from "@/types/subscription";

export const SubscriptionRepo = {
    findall(): Subscription[] {
        return db.prepare('SELECT * FROM subs ORDER BY next_due ASC').all() as Subscription[];
    },

    findById(id: number): Subscription | undefined {
        return db.prepare('SELECT * FROM subs WHERE id = ?').get(id) as Subscription;
    },

    create(data: CreateSubscriptionInput): Subscription {
        const stmt = db.prepare(`
            INSERT INTO subs (name, cost, currency, period, next_due, is_trial)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const info = stmt.run(
            data.name, 
            data.cost, 
            data.currency || 'EUR', 
            data.period, 
            data.next_due, 
            data.is_trial ? 1 : 0
        );

        const newSub = db.prepare('SELECT * FROM subs WHERE id = ?').get(info.lastInsertRowid) as Subscription;
        
        return newSub;
    },

    update(id: number, data: UpdateSubscriptionInput): Subscription {
        const existing = this.findById(data.id);
        if (!existing) throw new Error(`Subscription with ID ${data.id} not found`);

        const updated = { ...existing, ...data };

        const stmt = db.prepare(`
            UPDATE subs 
            SET name = ?, cost = ?, currency = ?, period = ?, next_due = ?, is_trial = ?
            WHERE id = ?
        `);

        stmt.run(
            updated.name,
            updated.cost,
            updated.currency,
            updated.period,
            updated.next_due,
            updated.is_trial ? 1 : 0,
            id
        );

        return updated;
    },

    delete(id: number): void {
        const stmt = db.prepare('DELETE FROM subs WHERE id = ?');
        const info = stmt.run(id);
        
        if (info.changes === 0) {
            throw new Error(`Failed to delete: Subscription with ID ${id} not found`);
        }
    },

    findByDate(date: string): Subscription[] {
        return db.prepare('SELECT * FROM subs WHERE next_due = ?').all(date) as Subscription[];
    },
}