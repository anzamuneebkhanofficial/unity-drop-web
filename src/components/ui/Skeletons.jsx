/** @format */
'use client';

/**
 * 🎯 Skeletons.jsx
 * Centralized, pixel-perfect skeletons for zero layout shift (CLS < 0.1).
 * Industry Standard 2026.
 */


export const BrandSkeleton = () => {
    return (
        <div
            className="fixed inset-0 flex flex-col justify-center items-center w-screen h-screen text-center z-50 animate-pulse"
            style={{ backgroundColor: 'var(--bg, black)' }}
        >
            {/* 1. The Animated Blood Drop (Consistent with your LoadingSpinner) */}
            {/* <div className="relative mb-4">
                <BloodDropLoader size={160} />
            </div> */}

            {/* 2. The Brand Logo (LogsIcon) */}
            {/* <LogsIcon
                width={180}
                height={180}
                className="mb-8 rounded-xl shadow-lg text-[var(--highlight)] opacity-80"
            /> */}

            {/* 3. The Branded Text & Quranic Verse Section */}
            <div className="px-6 max-w-2xl text-center space-y-6">
                {/* Main Brand Title Placeholder */}
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-[var(--highlight)]">
                        Loading <span className="text-white">Your Unity Drop</span>
                    </h1>
                </div>

                {/* The Verse (Preserved exactly as requested) */}
                <div className="pt-4 border-t border-neutral-800">
                    <blockquote className="italic text-lg md:text-4xl font-semibold text-[var(--highlight)] leading-relaxed">
                        "وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا"
                    </blockquote>

                    <p className="mt-4 text-sm md:text-base text-gray-400 font-medium">
                        "And whoever saves one life, it is as if he had saved all of mankind."
                    </p>

                    <div className="mt-2 h-4 w-48 bg-neutral-900 mx-auto rounded animate-pulse" />

                    <p className="mt-2 text-sm md:text-base text-gray-500">
                        "اور جس نے ایک جان کو زندہ کیا گویا اس نے تمام انسانوں کو زندہ کیا۔"
                    </p>
                </div>
            </div>

            {/* Bottom Progress Bar (Subtle Industry Touch) */}
            <div className="absolute bottom-10 w-40 h-1 bg-neutral-900 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--highlight)] w-1/3 animate-shimmer" />
            </div>
        </div>
    );
};

export const DashboardSkeleton = () => (
    <div className="p-6 space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-neutral-800 rounded" />
            <div className="h-10 w-32 bg-neutral-800 rounded" />
        </div>

        {/* Search/Filters Skeleton */}
        <div className="flex gap-4">
            <div className="h-10 flex-1 bg-neutral-800 rounded" />
            <div className="h-10 w-40 bg-neutral-800 rounded" />
        </div>

        {/* Table/List Skeleton */}
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 w-full bg-neutral-800 rounded border border-neutral-700" />
            ))}
        </div>
    </div>
);

export const ProfileSkeleton = () => (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 px-4 animate-pulse">
        <div className="bg-neutral-800 border border-neutral-700 p-8 rounded-2xl shadow-xl w-full max-w-2xl space-y-8">
            <div className="flex flex-col items-center space-y-4">
                <div className="size-24 bg-neutral-700 rounded-full" />
                <div className="h-6 w-48 bg-neutral-700 rounded" />
                <div className="h-4 w-32 bg-neutral-700 rounded" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-20 bg-neutral-900 border border-neutral-700 rounded-lg" />
                ))}
            </div>
        </div>
    </div>
);

export const CardSkeleton = () => (
    <div className="bg-neutral-800 rounded-xl p-6 space-y-4 animate-pulse border border-neutral-700">
        <div className="size-12 bg-neutral-700 rounded-full" />
        <div className="space-y-2">
            <div className="h-4 w-3/4 bg-neutral-700 rounded" />
            <div className="h-3 w-1/2 bg-neutral-700 rounded" />
        </div>
    </div>
);

export const ChartSkeleton = () => (
    <div className="h-[300px] w-full bg-neutral-800/50 rounded-xl animate-pulse flex items-center justify-center">
        <div className="text-neutral-600">Loading Analytics...</div>
    </div>
);

export const GenericSpinner = ({ size = 24 }) => (
    <div className="flex items-center justify-center">
        <div
            className="animate-spin rounded-full border-t-2 border-b-2 border-highlight"
            style={{ width: size, height: size }}
        />
    </div>
);
