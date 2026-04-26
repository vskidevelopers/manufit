
'use client';

export function TrackHeader() {
    return (
        <header className="bg-linear-to-br from-slate-900 to-blue-900 py-4 md:py-5">
            <div className="container px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Track Order
                    <span className="block text-sm md:text-base font-medium text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-purple-300">
                        Check your order status in real-time
                    </span>
                </h1>
            </div>
        </header>
    );
}