import styled from "styled-components";

export const Button = styled.button<{ $variant?: "primary" | "ghost" }>`
    border: none;
    border-radius: 2rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    background-color: ${({ $variant }) =>
        $variant === "ghost" ? "transparent" : "#111827"};
    color: ${({ $variant }) => ($variant === "ghost" ? "#111827" : "#f9fafb")};
    border: ${({ $variant }) =>
        $variant === "ghost" ? "1px solid #d1d5db" : "none"};
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.15s ease, transform 0.1s ease,
        box-shadow 0.15s ease;

    &:hover {
        background-color: ${({ $variant }) =>
            $variant === "ghost" ? "#f3f4f6" : "#000000"};
        transform: translate(-1px);
        box-shadow: 0 4px 10px rgba(15, 23, 42, 0.2);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        box-shadow: none;
        transform: none;
    }
`;
