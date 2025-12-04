"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false); // Tipe boolean

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response: Response = await fetch("/api/admin/logout", {
        // Tipe Response
        method: "POST",
      });

      if (response.ok) {
        router.push("/admin/login");
      } else {
        alert("Gagal logout. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error saat logout:", error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        padding: "10px 20px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginTop: "15px",
      }}
    >
      {loading ? "Memproses..." : "Logout"}
    </button>
  );
}
