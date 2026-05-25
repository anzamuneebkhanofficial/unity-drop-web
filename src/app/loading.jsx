/** @format */
import { BrandSkeleton } from '@/components/ui/Skeletons';
export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black">
            <BrandSkeleton />
        </div>
    );
}
