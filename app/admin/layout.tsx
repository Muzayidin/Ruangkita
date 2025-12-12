import { adminTheme } from "./adminTheme";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                // Enforce safe colors to prevent "White Text on White Background" in Dark Mode
                color: adminTheme.text,
                background: adminTheme.bg,
                // Reset font-family if needed, but inheriting Inter is fine.
                textAlign: "left"
            }}
        >
            {children}
        </div>
    );
}
