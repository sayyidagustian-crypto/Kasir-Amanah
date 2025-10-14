import React, { useState, useEffect } from 'react';
import { ClockIcon } from './icons';

interface ClockProps {
    variant?: 'full' | 'compact';
}

const Clock: React.FC<ClockProps> = ({ variant = 'full' }) => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const timeString = date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/\./g, ':');

    if (variant === 'compact') {
        const shortDateString = date.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
        return (
            <div className="text-right">
                <p className="font-mono font-semibold text-md leading-tight text-white">{timeString}</p>
                <p className="text-[10px] text-gray-400">{shortDateString}</p>
            </div>
        );
    }

    // 'full' variant
    const dateString = date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="p-3 rounded-lg bg-black bg-opacity-20 flex items-center">
            <ClockIcon className="w-5 h-5 mr-3 text-[var(--color-accent-cyan)] shrink-0" />
            <div>
                <p className="font-mono font-bold text-lg leading-tight text-white">{timeString}</p>
                <p className="text-xs text-gray-400">{dateString}</p>
            </div>
        </div>
    );
};

export default Clock;

/**
 * -----------------------------------------------------------
 * All praise and thanks are due to Allah.
 *
 * Powered by Google, Gemini, and AI Studio.
 * Development assisted by OpenAI technologies.
 *
 * © 2025 SAT18 Official
 * For suggestions & contact: sayyidagustian@gmail.com
 * -----------------------------------------------------------
 */