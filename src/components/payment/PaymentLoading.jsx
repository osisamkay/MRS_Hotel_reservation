'use client';

import PageHeader from '../PageHeader';

export default function PaymentLoading() {
    return (
        <div className="bg-white min-h-screen">
            <PageHeader />
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-blue-500 rounded-full mx-auto mb-4"></div>
                    <p>Loading payment details...</p>
                </div>
            </div>
        </div>
    );
}
