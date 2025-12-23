import { db } from "@/lib/db";
import { Subscription, CreateSubscriptionInput, UpdateSubscriptionInput } from "@/types/subscription";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { format } from "date-fns"

export const SubscriptionRepo = {
    async findall(): Promise<Subscription[]> {
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM subs ORDER BY next_due ASC');
        
        return rows.map(row => {
            const sub = row as unknown as Subscription; // Tell TS this is a Subscription
            return {
                ...sub,
                cost: Number(sub.cost),
                next_due: format(sub.next_due, 'yyyy-MM-dd')
            };
        });
    },

    async findById(id: number): Promise<Subscription | undefined> {
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM subs WHERE id = ?', [id]);
        const row = rows[0];

        if (!row) return undefined;

        const sub = row as unknown as Subscription;
        return {
            ...sub,
            cost: Number(sub.cost),
            next_due: format(sub.next_due, 'yyyy-MM-dd')
        };
    },

    async findByDate(date: string): Promise<Subscription[]> {
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM subs WHERE DATE(next_due) = ?', [date]);
        
        return rows.map(row => {
            const sub = row as unknown as Subscription;
            return {
                ...sub,
                cost: Number(sub.cost),
                next_due: format(sub.next_due, 'yyyy-MM-dd')
            };
        });
    },

    async create(data: CreateSubscriptionInput): Promise<Subscription> {
        const [result] = await db.query<ResultSetHeader>(`
            INSERT INTO subs (name, cost, currency, period, next_due, is_trial)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            data.name, 
            data.cost, 
            data.currency || 'THB', 
            data.period, 
            data.next_due, 
            data.is_trial ? 1 : 0
        ]);

        // Fetch the newly created record using the insertId
        const newSub = await this.findById(result.insertId);
        
        if (!newSub) {
            throw new Error('Failed to create subscription: Record not found after insert');
        }

        return newSub;
    },

    async update(id: number, data: UpdateSubscriptionInput): Promise<Subscription> {
        // 1. Check if exists first
        const existing = await this.findById(id);
        if (!existing) throw new Error(`Subscription with ID ${id} not found`);

        // 2. Merge data
        const updated = { ...existing, ...data };

        // 3. Perform Update
        await db.query(`
            UPDATE subs 
            SET name = ?, cost = ?, currency = ?, period = ?, next_due = ?, is_trial = ?
            WHERE id = ?
        `, [
            updated.name,
            updated.cost,
            updated.currency,
            updated.period,
            updated.next_due,
            updated.is_trial ? 1 : 0,
            id
        ]);

        return updated;
    },

    async delete(id: number): Promise<void> {
        const [result] = await db.query<ResultSetHeader>('DELETE FROM subs WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            throw new Error(`Failed to delete: Subscription with ID ${id} not found`);
        }
    }
};