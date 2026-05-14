/** @format */
'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg text-white flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          
          {/* 404 Number */}
          <div className="text-center md:text-left">
            <h1 className="text-8xl md:text-9xl font-black text-highlight leading-none">
              404
            </h1>
          </div>
          
          {/* Vertical Separator */}
          <div className="hidden md:block w-px h-32 bg-white/20"></div>
          
          {/* Error Message */}
          <div className="text-center md:text-left space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              This page could not be found.
            </h2>
            
            <p className="text-text-muted max-w-md">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back to where you need to be.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-highlight text-black font-semibold rounded-lg hover:bg-highlight/90 transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface text-white font-semibold rounded-lg hover:bg-surface/90 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-donor/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-highlight/5 rounded-full blur-[120px] pointer-events-none" />
      </div>
    </div>
  );
}
