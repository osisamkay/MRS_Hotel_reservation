'use client';

export default function PaymentMethodSelector({ paymentMethod, setPaymentMethod, error }) {
    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="flex flex-wrap gap-6">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cash"
                            checked={paymentMethod === 'cash'}
                            onChange={() => handlePaymentMethodChange('cash')}
                            className="form-radio h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Cash</span>
                    </label>

                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="creditCard"
                            checked={paymentMethod === 'creditCard'}
                            onChange={() => handlePaymentMethodChange('creditCard')}
                            className="form-radio h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Credit Card</span>
                    </label>

                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="digitalWallet"
                            checked={paymentMethod === 'digitalWallet'}
                            onChange={() => handlePaymentMethodChange('digitalWallet')}
                            className="form-radio h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Digital Wallet</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
