/** @format */
'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';
import { usePathname, useSearchParams } from 'next/navigation';

// Configure NProgress once
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });

export default function ProgressProvider() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Page navigation finished
        NProgress.done();
    }, [pathname, searchParams]);

    return null;
}
