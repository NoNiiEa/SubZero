import { addMonths, addYears, format, parseISO } from 'date-fns';
import { BillingPeriod } from '@/types/subscription';

/**
 * Calculates the next billing date based on the current due date and period.
 * Example: Jan 31st + 1 month = Feb 28th (or 29th)
 */
export function calculateNextDate(currentDueDate: string, period: BillingPeriod): string {
  const date = parseISO(currentDueDate);
  const nextDate = period === 'monthly' ? addMonths(date, 1) : addYears(date, 1);
  return format(nextDate, 'yyyy-MM-dd');
}