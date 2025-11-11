import styled from "styled-components";
import type { OrderStatus } from "../../types";

const Pill = styled.span<{ $status: OrderStatus }>`
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    border-radius: 2rem;
    font-weight: 500;
    ${({ $status }) => {
        switch ($status) {
            case "PENDING_PAYMENT":
                return "background-color: #fef3c7; color: #92400e;";
            case "CONFIRMED":
                return "background-color: #dcfce7; color: #166534;";
            case "CANCELLED":
                return "background-color: #e5e7eb; color: #374151;";
            case "PAYMENT_FAILED":
                return "background-color: #fee2e2; color: #991b1b;";
            default:
                return "background-color: #e5e7eb; color: #374151;";
        }
    }}
`;

function OrderStatusBadge({ status }: { status: OrderStatus }) {
    const label = status.replace("_", " ");
    return <Pill $status={status}>{label}</Pill>;
}

export default OrderStatusBadge;
