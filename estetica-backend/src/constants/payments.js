// ============================================================
// ESPACIO SENDA — constants/payments.js
// Fuente única de verdad de los enums de pago.
// DEBEN coincidir EXACTAMENTE con los enums del schema.prisma
// (PaymentMethod, PaymentType, PaymentStatus).
// Antes estos arrays estaban hardcodeados y repetidos 3 veces
// dentro de payments.controller.js.
// ============================================================

export const PAYMENT_METHODS = ['CASH', 'TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD'];

export const PAYMENT_TYPES = ['DEPOSIT', 'FINAL_PAYMENT', 'FULL_PAYMENT'];

export const PAYMENT_STATUS = ['PENDING', 'PARTIAL', 'COMPLETED', 'REFUNDED'];
