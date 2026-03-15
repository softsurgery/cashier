// order-keyboard.component.ts
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
export class OrderKeyboardComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  ngOnInit(): void {}

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

  Pay(orderId: number, amount: string) {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      toast.error('Invalid payment amount');
      return;
    }

    this.orderService.pay(orderId, numericAmount).subscribe({
      next: () => {
        toast.success('Payment created successfully');
        this.value = '';
      },
      error: (err) => {
        toast.error('Payment failed');
      },
    });
  }

  isEmpty() {
    return this.value.length === 0;
  }
}
