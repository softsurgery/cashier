import { OrderStatus, ResponseOrderDto } from '@/types';

export function getOrderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.UNPAID:
      return 'Non payée';
    case OrderStatus.PAID:
      return 'Payée';
    case OrderStatus.PARTIALLY_PAID:
      return 'Partiellement payée';
    case OrderStatus.CANCELLED:
      return 'Annulée';
    default:
      return status;
  }
}

export function getOrderStatusBadgeVariant(
  status: OrderStatus,
): 'default' | 'destructive' | 'secondary' | 'outline' | 'success' {
  switch (status) {
    case OrderStatus.PAID:
      return 'success';
    case OrderStatus.UNPAID:
      return 'destructive';
    case OrderStatus.PARTIALLY_PAID:
      return 'secondary';
    case OrderStatus.CANCELLED:
      return 'outline';
    default:
      return 'outline';
  }
}

export function getOrderRemaining(order: { total: number; paidAmount?: number }): number {
  return Math.max(0, Number(order.total ?? 0) - Number(order.paidAmount ?? 0));
}

export function findActiveOrder(orders: ResponseOrderDto[] | undefined): ResponseOrderDto | null {
  if (!orders?.length) return null;
  return (
    orders.find(
      (order) => order.status === OrderStatus.UNPAID || order.status === OrderStatus.PARTIALLY_PAID,
    ) ?? null
  );
}

export function formatAmount(amount: number): string {
  return `د.ت ${amount.toFixed(2)}`;
}
