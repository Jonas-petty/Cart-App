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

export type OrderItem = {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
};

export type Order = {
    id: string;
    customerId: string;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
};
