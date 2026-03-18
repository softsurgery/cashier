// order-keyboard.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-keyboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-keyboard.component.html',
  styleUrls: ['./order-keyboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderKeyboardComponent {}
