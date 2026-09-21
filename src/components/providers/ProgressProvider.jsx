/** @format */
'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';
import { usePathname, useSearchParams } from 'next/navigation';
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });
export default function ProgressProvider() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        NProgress.done();
    }, [pathname, searchParams]);

    useEffect(() => {
        const handleAnchorClick = (event) => {
            const anchor = event.target.closest('a');
            if (!anchor) return;
            const href = anchor.getAttribute('href');
            if (!href) return;
            // Ignore external links with target=_blank
            if (
                anchor.target === '_blank' ||
                (href.startsWith('http') && !href.startsWith(window.location.origin)) ||
                href.startsWith('#') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }
            // Ignore avoid duplicate loader on same page
            try {
                const targetUrl = new URL(href, window.location.href);
                const currentUrl = new URL(window.location.href);
                if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) {
                    return;
                }
            } catch (err) {
                // In case of invalid URL strings, ignore
                return;
            }
            // Start NProgress fast
            NProgress.start();
        };

        document.addEventListener('click', handleAnchorClick, { capture: true });
        return () => {
            document.removeEventListener('click', handleAnchorClick, { capture: true });
        };
    }, []);

    return null;
}