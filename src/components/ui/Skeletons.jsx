/** @format */
'use client';

export const BrandSkeleton = () => (
    <div
        className="fixed inset-0 flex flex-col justify-center items-center w-screen h-screen text-center z-50 animate-pulse"
        style={{ backgroundColor: 'var(--bg, black)' }}
    >
        <div className="px-6 max-w-2xl text-center space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-[var(--highlight)]">
                    Loading <span className="text-white">Your Unity Drop</span>
                </h1>
            </div>

            <div className="pt-4 border-t border-neutral-800">
                <blockquote className="italic text-lg md:text-4xl font-semibold text-[var(--highlight)] leading-relaxed">
                    "وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا"
                </blockquote>

                <p className="mt-4 text-sm md:text-base text-gray-400 font-medium">
                    "And whoever saves one life, it is as if he had saved all of mankind."
                </p>
                <div className="mt-2 h-4 w-48 bg-neutral-900 mx-auto rounded" />

                <p className="mt-2 text-sm md:text-base text-gray-500">
                    "اور جس نے ایک جان کو زندہ کیا گویا اس نے تمام انسانوں کو زندہ کیا۔"
                </p>
            </div>
        </div>
        <div className="absolute bottom-10 w-40 h-1 bg-neutral-900 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--highlight)] w-1/3 animate-shimmer" />
        </div>
    </div>
);

export const DashboardSkeleton = () => (
    <div className="p-6 space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-neutral-800 rounded" />
            <div className="h-10 w-32 bg-neutral-800 rounded" />
        </div>

        <div className="flex gap-4">
            <div className="h-10 flex-1 bg-neutral-800 rounded" />
            <div className="h-10 w-40 bg-neutral-800 rounded" />
        </div>

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

export const GenericSpinner = ({ size = 24 }) => (
    <div className="flex items-center justify-center">
        <div
            className="animate-spin rounded-full border-t-2 border-b-2 border-highlight"
            style={{ width: size, height: size }}
        />
    </div>
);