import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { OrderService } from '../../order.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-order-keyboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmButton],
  templateUrl: './order-keyboard.component.html',
  styleUrls: ['./order-keyboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderKeyboardComponent {
  private readonly orderService = inject(OrderService);
  @Input() orderId: number | null = null;
  @Input() maxPayAmount = 0;
  @Input() paidAmount = 0;
  @Output() paymentCompleted = new EventEmitter<void>();

  value: string = '';

  keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'x'];

  press(key: string) {
    if (key === 'x') {
      this.backspace();
      return;
    }

    if (key === '.' && this.value.includes('.')) return;

    this.value += key;
  }

  backspace() {
    this.value = this.value.slice(0, -1);
  }

  clear() {
    this.value = '';
  }

  Pay(amount: string) {
    if (!this.orderId) {
      toast.error('No active order for this table');
      return;
    }
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      toast.error('Invalid payment amount');
      return;
    }
    if (numericAmount > this.maxPayAmount) {
      toast.error(`Maximum allowed is ${this.maxPayAmount.toFixed(2)}`);
      return;
    }

    this.orderService.pay(this.orderId, numericAmount).subscribe({
      next: () => {
        toast.success('Payment created successfully');
        this.value = '';
        this.paymentCompleted.emit();
      },
      error: () => {
        toast.error('Payment failed');
      },
    });
  }

  PayAll() {
    if (!this.orderId) {
      toast.error('No active order for this table');
      return;
    }

    this.orderService.findOneById(this.orderId).subscribe({
      next: (order) => {
        if (!order) {
          throw new Error('order not found!');
        }

        const remainingAmount = order.total - (order.paidAmount ?? 0);
        if (remainingAmount <= 0) {
          toast.error('Order is already fully paid');
          return;
        }

        this.orderService.pay(this.orderId!, remainingAmount).subscribe({
          next: () => {
            toast.success('Payment created successfully');
            this.value = '';
            this.paymentCompleted.emit();
          },
          error: () => {
            toast.error('Payment failed');
          },
        });
      },
      error: () => {
        toast.error('Failed to fetch order');
      },
    });
  }

  isEmpty() {
    return this.value.length === 0;
  }

  get hasPaymentContext(): boolean {
    return !!this.orderId && this.maxPayAmount > 0;
  }
}
