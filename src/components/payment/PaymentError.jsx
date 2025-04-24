'use client';

import PageHeader from '../PageHeader';

export default function PaymentError({ error, onBack }) {
    return (
        <div className="bg-white min-h-screen">
            <PageHeader />
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
                <button
                    onClick={onBack}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}
