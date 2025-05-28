export enum BookingAvailabilityType {
    /** The product supports booking and has available seats */
    Available = 'available',
    /** The product does not support booking */
    BookingNotSupported = 'booking_not_supported',
    /** No more seats are available for booking */
    SoldOut = 'sold_out',
    /** The product supports booking, but ticket sale isn't currently open */
    Closed = 'closed',
    /** Fallback state for unhandled errors */
    Unknown = 'unknown',
}
