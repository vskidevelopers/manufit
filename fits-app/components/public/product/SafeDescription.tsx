// components/public/product/SafeDescription.tsx
'use client';

import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

interface Props {
    html: string;
    className?: string;
}

export function SafeDescription({ html, className = '' }: Props) {
    const [sanitized, setSanitized] = useState('');

    useEffect(() => {
        setSanitized(DOMPurify.sanitize(html));
    }, [html]);

    return (
        <div
            className={`prose prose-slate max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: sanitized }}
        />
    );
}