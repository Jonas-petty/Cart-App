import styled from "styled-components";

export const Input = styled.input`
    border-radius: 1rem;
    border: 1px solid #d1d5db;
    padding: 8px 10px;
    font-size: 1rem;
    width: 100%;
    background-color: #ffffff;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &:focus {
        border-color: #111827;
        box-shadow: 0 0 0 1px #11182711;
    }
`;
