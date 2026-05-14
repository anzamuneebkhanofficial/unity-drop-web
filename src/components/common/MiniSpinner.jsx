/** @format */
'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

const MiniSpinner = ({ size = 24, className = "" }) => {
    return (
        <Loader2
            className={`animate-spin ${className}`}
            size={size}
        />
    );
};

export default MiniSpinner;
