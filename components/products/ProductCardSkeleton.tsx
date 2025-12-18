import React from "react";

export function ProductCardSkeleton() {
    return (
        <div className="group relative bg-card border border-border rounded-xl md:rounded-2xl overflow-hidden h-full flex flex-col">
            {/* Aspect Ratio Container (matches ProductCard image) */}
            <div className="relative aspect-[4/3] bg-muted/20 animate-pulse overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer" />
            </div>

            {/* Content Container */}
            <div className="p-3 md:p-4 flex flex-col flex-grow gap-2 md:gap-3">
                {/* Title Skeleton */}
                <div className="h-4 md:h-5 bg-muted/20 rounded-md w-3/4 animate-pulse" />

                {/* Category Skeleton */}
                <div className="h-3 bg-muted/20 rounded-md w-1/4 animate-pulse" />

                {/* Price Skeleton */}
                <div className="mt-auto pt-2 flex items-center justify-between">
                    <div className="h-4 md:h-6 bg-muted/20 rounded-md w-1/3 animate-pulse" />
                    <div className="h-8 w-8 bg-muted/20 rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    );
}
