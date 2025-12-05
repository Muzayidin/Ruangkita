// components/admin/ProductCard.tsx
import { adminTheme as t } from "@/app/admin/adminTheme";
type ProductCardProps = {
  name: string;
  price: number;
  imageUrl?: string | null;
  category?: string | null;
  featured?: number | null;
  stock?: number | null;
};

export default function ProductCard({
  name,
  price,
  imageUrl,
  category,
  featured,
  stock,
}: ProductCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        overflow: "hidden",
        background: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          position: "relative",
          background: t.bgSoft,
        }}
      >
        <img
          src={imageUrl || "/placeholder-product.jpg"}
          alt={name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div
        style={{
          padding: 12,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            margin: "0 0 6px",
            fontSize: 16,
            fontWeight: 600,
            color: t.text,
          }}
        >
          {name}
        </h3>

        <p
          style={{
            margin: "0 0 6px",
            fontSize: 14,
            color: "#444",
          }}
        >
          Rp {price.toLocaleString("id-ID")}
        </p>

        <p
          style={{
            margin: "0 0 6px",
            fontSize: 12,
            color: "#777",
          }}
        >
          {category || "Tanpa kategori"}
        </p>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
            color: "#666",
          }}
        >
          <span>Stok: {stock ?? 0}</span>

          {featured === 1 && (
            <span style={{ color: "#f39c12", fontWeight: 600 }}>
              ⭐ Unggulan
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
