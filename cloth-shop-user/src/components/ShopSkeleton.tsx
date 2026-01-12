"use client";

export default function ShopSkeleton() {
  return (
    <div className="grid lg:grid-cols-4 gap-8 mb-16">
      {/* Products Skeleton */}
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-cream rounded-3xl shadow-xl overflow-hidden animate-pulse"
            >
              <div className="h-60 bg-slate-300" />
              <div className="p-6 space-y-4">
                <div className="h-6 w-3/4 bg-slate-300 rounded" />
                <div className="h-4 w-full bg-slate-200 rounded" />
                <div className="h-4 w-5/6 bg-slate-200 rounded" />
                <div className="h-8 w-32 bg-slate-300 rounded" />
                <div className="h-12 w-full bg-slate-300 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
