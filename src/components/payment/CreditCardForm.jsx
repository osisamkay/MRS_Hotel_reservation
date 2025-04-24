'use client';

export default function CreditCardForm({ cardDetails, handleCardDetailsChange }) {
    return (
        <div className="mt-6 space-y-4">
            <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                </label>
                <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardDetailsChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                    </label>
                    <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleCardDetailsChange}
                        placeholder="MM/YY"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                    </label>
                    <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardDetailsChange}
                        placeholder="123"
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>
        </div>
    );
}
