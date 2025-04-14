import { BaseStorageService } from './baseStorageService';

class PaymentStorageService extends BaseStorageService {
  constructor() {
    super('payments.json');
  }

  async createPayment(paymentData) {
    // Validate required fields
    const requiredFields = ['userId', 'reservationId', 'amount', 'paymentMethod'];
    for (const field of requiredFields) {
      if (!paymentData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return this.create({
      ...paymentData,
      status: 'pending',
      transactionId: this.generateTransactionId(),
      currency: paymentData.currency || 'USD'
    });
  }

  generateTransactionId() {
    return 'TXN' + Date.now().toString(36).toUpperCase() + 
           Math.random().toString(36).substring(2, 7).toUpperCase();
  }

  async getUserPayments(userId) {
    return this.query(payment => payment.userId === userId);
  }

  async getReservationPayment(reservationId) {
    return this.query(payment => payment.reservationId === reservationId);
  }

  async getPaymentsByStatus(status) {
    return this.query(payment => payment.status === status);
  }

  async updatePaymentStatus(id, status, transactionDetails = {}) {
    return this.update(id, { 
      status,
      ...transactionDetails,
      processedAt: status === 'completed' ? new Date().toISOString() : null
    });
  }

  async refundPayment(id, refundReason) {
    const payment = await this.getById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'completed') {
      throw new Error('Only completed payments can be refunded');
    }

    return this.create({
      originalPaymentId: payment.id,
      userId: payment.userId,
      reservationId: payment.reservationId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      currency: payment.currency,
      status: 'refunded',
      refundReason,
      transactionId: this.generateTransactionId(),
      type: 'refund'
    });
  }

  async getPaymentSummary(userId) {
    const payments = await this.getUserPayments(userId);
    return {
      totalSpent: payments
        .filter(p => p.status === 'completed' && !p.type)
        .reduce((sum, p) => sum + p.amount, 0),
      totalRefunded: payments
        .filter(p => p.status === 'refunded' || p.type === 'refund')
        .reduce((sum, p) => sum + p.amount, 0),
      paymentCount: payments.filter(p => p.status === 'completed' && !p.type).length,
      refundCount: payments.filter(p => p.status === 'refunded' || p.type === 'refund').length
    };
  }
}

export const paymentStorageService = new PaymentStorageService(); 