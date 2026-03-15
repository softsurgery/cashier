// order-keyboard.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-order-keyboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmButton],
  templateUrl: './order-keyboard.component.html',
  styleUrls: ['./order-keyboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderKeyboardComponent {
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

  logPay() {
    console.log(this.value);
  }

  isEmpty() {
    return this.value.length === 0;
  }
}
