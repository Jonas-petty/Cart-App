export type OrderStatus =
    | "PENDING_PAYMENT"
    | "CONFIRMED"
    | "CANCELLED"
    | "PAYMENT_FAILED";

export type Product = {
    id: string;
    name: string;
    price: number;
    stock: number;
};
