import mongoose from 'mongoose';

export const ORDER_STATUSES = ['nouvelle', 'confirmee', 'en_livraison', 'livree', 'annulee'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderDocument {
  orderNumber: string;
  items: OrderItem[];
  customer: { name: string; phone: string; address: string; note?: string };
  total: number;
  status: OrderStatus;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema<OrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        _id: false,
        product: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String },
      },
    ],
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      note: { type: String, default: '' },
    },
    total: { type: Number, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: 'nouvelle' },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.model<OrderDocument>('Order', orderSchema);
export default Order;
