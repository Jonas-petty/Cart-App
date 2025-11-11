import { createContext, useContext, useMemo, useState } from "react";

type CartItem = {
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
};

type CartContextValue = {
    items: CartItem[];
    total: number;
    addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    removeItem: (productId: string) => void;
    clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    function addItem(item: Omit<CartItem, "quantity">, quantity: number = 1) {
        setItems((prev) => {
            const index = prev.findIndex((i) => i.productId === item.productId);
            if (index >= 0) {
                const clone = [...prev];
                clone[index] = {
                    ...clone[index],
                    quantity: clone[index].quantity + quantity,
                };
                return clone;
            }
            return [...prev, { ...item, quantity }];
        });
    }

    function updateQuantity(productId: string, quantity: number) {
        setItems((prev) =>
            prev.map((item) =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );
    }

    function removeItem(productId: string) {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
    }

    function clear() {
        setItems([]);
    }

    const total = useMemo(
        () =>
            items.reduce(
                (acc, item) => acc + item.unitPrice * item.quantity,
                0
            ),
        [items]
    );

    const value: CartContextValue = {
        items,
        total,
        addItem,
        updateQuantity,
        removeItem,
        clear,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
}
