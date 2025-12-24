"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#1e293b',
                    color: '#f1f5f9',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                },
                success: {
                    duration: 3000,
                    style: {
                        background: '#065f46',
                        color: '#d1fae5',
                        border: '1px solid #047857',
                    },
                    iconTheme: {
                        primary: '#10b981',
                        secondary: '#d1fae5',
                    },
                },
                error: {
                    duration: 5000,
                    style: {
                        background: '#991b1b',
                        color: '#fee2e2',
                        border: '1px solid #dc2626',
                    },
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fee2e2',
                    },
                },
                loading: {
                    style: {
                        background: '#ea580c',
                        color: '#fed7aa',
                        border: '1px solid #f97316',
                    },
                    iconTheme: {
                        primary: '#fb923c',
                        secondary: '#fed7aa',
                    },
                },
            }}
        />
    );
}
