import { useState } from 'react';
import { format, eachDayOfInterval, isWithinInterval, parseISO } from 'date-fns';
import { CalendarIcon, Check, X, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePropertyBookings } from '@/hooks/useBookings';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

interface AvailabilityCheckerProps {
  propertyId: string;
  propertyName: string;
}

const AvailabilityChecker = ({ propertyId, propertyName }: AvailabilityCheckerProps) => {
  const { data: bookings = [], isLoading } = usePropertyBookings(propertyId);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  const isAvailable = (): boolean => {
    if (!dateRange?.from || !dateRange?.to || bookings.length === 0) return true;

    const requestedDays = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    return !requestedDays.some(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      return bookings.some(b => dayStr >= b.start_date && dayStr <= b.end_date);
    });
  };

  const handleCheck = () => setChecked(true);

  const handleReset = () => {
    setDateRange(undefined);
    setChecked(false);
  };

  const bookedDays = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.some(b => dateStr >= b.start_date && dateStr <= b.end_date);
  };

  const available = isAvailable();

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) handleReset(); }}>
      <DialogTrigger asChild>
        <Button variant="accent" size="xl" className="w-full">
          Check Availability
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">Check Availability</DialogTitle>
          <p className="text-sm text-muted-foreground">{propertyName}</p>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => { setDateRange(range); setChecked(false); }}
              numberOfMonths={1}
              disabled={{ before: new Date() }}
              modifiers={{ booked: bookedDays }}
              modifiersStyles={{ booked: { backgroundColor: 'hsl(var(--destructive) / 0.15)', color: 'hsl(var(--destructive))' } }}
              className="p-3 pointer-events-auto mx-auto"
            />

            {dateRange?.from && dateRange?.to && (
              <div className="text-center text-sm text-muted-foreground">
                {format(dateRange.from, 'MMM d, yyyy')} — {format(dateRange.to, 'MMM d, yyyy')}
              </div>
            )}

            {!checked ? (
              <Button onClick={handleCheck} disabled={!dateRange?.from || !dateRange?.to} className="w-full">
                Check These Dates
              </Button>
            ) : (
              <div className={cn(
                "flex items-center gap-3 p-4 rounded-lg border",
                available ? "bg-primary/10 border-primary/30" : "bg-destructive/10 border-destructive/30"
              )}>
                {available ? (
                  <>
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">These dates are available!</p>
                      <p className="text-xs text-muted-foreground">Contact us to book your stay.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-destructive flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Sorry, those dates are unavailable.</p>
                      <p className="text-xs text-muted-foreground">Try selecting different dates.</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {checked && available && (
              <Button asChild variant="accent" className="w-full">
                <a href="/about">Contact Us to Book</a>
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityChecker;
