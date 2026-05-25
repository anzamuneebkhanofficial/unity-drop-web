/** @format */
'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
export default function PasswordField({
    field,
    placeholder = 'Enter password',
    label,
    error,
    labelClass = "formLabel",
    inputClass = "inputField",
    errorClass = "formError",
    iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-donor transition-colors",
}) {
    const [show, setShow] = useState(false);

    return (
        <div className="space-y-1.5 group">
            {label && <label className={labelClass}>{label}</label>}
            <div className="relative">
                <div className={iconClass}>
                    <Lock className="h-4 w-4" />
                </div>

                <input
                    {...field}
                    type={show ? 'text' : 'password'}
                    placeholder={placeholder}
                    className={inputClass + " pl-14 pr-12"}
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-white transition-colors"
                    tabIndex="-1"
                >
                    {show ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                </button>
            </div>
            {error && <p className={errorClass}>{error}</p>}
        </div>
    );
}
