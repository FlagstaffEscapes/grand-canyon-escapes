import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePropertyBookings, useCreateBooking, useDeleteBooking, isDateBooked } from '@/hooks/useBookings';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

interface BookingCalendarProps {
  propertyId: string;
}

const BookingCalendar = ({ propertyId }: BookingCalendarProps) => {
  const { data: bookings = [], isLoading } = usePropertyBookings(propertyId);
  const createBooking = useCreateBooking();
  const deleteBooking = useDeleteBooking();
  const { toast } = useToast();

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guestName, setGuestName] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddBooking = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({ title: 'Select a date range', variant: 'destructive' });
      return;
    }

    try {
      await createBooking.mutateAsync({
        property_id: propertyId,
        start_date: format(dateRange.from, 'yyyy-MM-dd'),
        end_date: format(dateRange.to, 'yyyy-MM-dd'),
        guest_name: guestName || undefined,
        notes: notes || undefined,
      });
      toast({ title: 'Booking added' });
      setDateRange(undefined);
      setGuestName('');
      setNotes('');
    } catch {
      toast({ title: 'Failed to add booking', variant: 'destructive' });
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteBooking.mutateAsync({ id, propertyId });
      toast({ title: 'Booking removed' });
    } catch {
      toast({ title: 'Failed to remove booking', variant: 'destructive' });
    }
  };

  const bookedDays = (date: Date) => isDateBooked(date, bookings);

  return (
    <section className="bg-card rounded-xl border border-border p-6 space-y-4">
      <h2 className="font-serif text-lg font-semibold">Booking Calendar</h2>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading bookings...
        </div>
      ) : (
        <>
          {/* Calendar */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                modifiers={{ booked: bookedDays }}
                modifiersStyles={{ booked: { backgroundColor: 'hsl(var(--destructive) / 0.15)', color: 'hsl(var(--destructive))' } }}
                disabled={{ before: new Date() }}
                className="p-3 pointer-events-auto"
              />
            </div>

            {/* Add booking form */}
            <div className="flex-1 space-y-3">
              <h3 className="font-medium text-sm">Mark Dates as Booked</h3>
              <div className="text-sm text-muted-foreground">
                {dateRange?.from && dateRange?.to ? (
                  <span>{format(dateRange.from, 'MMM d, yyyy')} — {format(dateRange.to, 'MMM d, yyyy')}</span>
                ) : (
                  <span>Select a date range on the calendar</span>
                )}
              </div>
              <div>
                <Label htmlFor="guest_name">Guest Name (optional)</Label>
                <Input id="guest_name" value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Guest name" />
              </div>
              <div>
                <Label htmlFor="booking_notes">Notes (optional)</Label>
                <Input id="booking_notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any notes" />
              </div>
              <Button onClick={handleAddBooking} disabled={!dateRange?.from || !dateRange?.to || createBooking.isPending}>
                {createBooking.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Booking
              </Button>
            </div>
          </div>

          {/* Existing bookings */}
          {bookings.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-border">
              <h3 className="font-medium text-sm">Upcoming Bookings</h3>
              {bookings.map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                  <div>
                    <p className="text-sm font-medium">
                      {format(new Date(b.start_date + 'T00:00:00'), 'MMM d')} — {format(new Date(b.end_date + 'T00:00:00'), 'MMM d, yyyy')}
                    </p>
                    {b.guest_name && <p className="text-xs text-muted-foreground">{b.guest_name}</p>}
                    {b.notes && <p className="text-xs text-muted-foreground">{b.notes}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteBooking(b.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default BookingCalendar;
