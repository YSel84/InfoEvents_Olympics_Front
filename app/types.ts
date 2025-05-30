/**
 * Offers for events
 */
export interface Offer {
    offerId: number;
    eventId: number;
    name: string;
    price: number;
    stock: number;
}

/**
 * Event details
 */
export interface Event {
    id: number;
    title: string;
    description: string;
    eventDateTime: string; // camelCase
    featured: boolean;
    imageUrl: string; //camelCase
    location: string;
}

/**
 * Ticket details
 *
 */
export interface TicketDto {
    ticketId: number;
    eventId: number;
    eventTitle: string;
    eventDateTime: string;
    qrHash: string;
    used: boolean;
    orderId: number;
}
