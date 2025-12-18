"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
    src: string;
    alt: string;
    priority?: boolean;
}

export function ProductImage({ src, alt, priority = false }: ProductImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            <div
                className={`absolute inset-0 bg-muted/40 animate-pulse z-10 transition-opacity duration-500 ${isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            />
            <Image
                src={src}
                alt={alt}
                fill={true}
                className={`object-cover transition-all duration-700 ease-in-out ${isLoading ? "scale-105 blur-lg grayscale" : "scale-100 blur-0 grayscale-0"
                    }`}
                priority={priority}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
            />
        </>
    );
}
