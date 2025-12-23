/**
 * The core Subscription model as it exists in the Database
 */
export interface Subscription {
  id: number;
  name: string;
  cost: number;
  currency: string;
  period: BillingPeriod;
  next_due: string;       // ISO Date String: "YYYY-MM-DD"
  is_trial: 0 | 1;        // SQLite uses 0/1 for booleans
  discord_sent: 0 | 1;    // Tracks if notification was already fired
  created_at: string;     // ISO Timestamp
}

/**
 * Valid billing cycles
 */
export type BillingPeriod = 'monthly' | 'yearly';

/**
 * Helper type for creating a new subscription.
 * We omit 'id' and 'created_at' because the DB generates those.
 */
export type CreateSubscriptionInput = Omit<Subscription, 'id' | 'created_at' | 'is_trial' | 'discord_sent'> & {
  is_trial: boolean; // We use a real boolean in the UI form
};

export type UpdateSubscriptionInput = Partial<Omit<Subscription, 'id'>> & {
  id: number; 
};
/**
 * Summary data for the Dashboard
 */
export interface SubscriptionStats {
  totalMonthlySpend: number;
  totalYearlySpend: number;
  activeTrialsCount: number;
  upcomingRenewals: Subscription[];
}