import { Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';

import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { BrnSheetImports } from '@spartan-ng/brain/sheet';

@Component({
  selector: 'app-product-family',
  standalone: true,

  imports: [
    HlmButtonImports,
    HlmInputImports,
    HlmLabelImports,

    HlmDialogImports,
    BrnDialogImports,

    HlmSheetImports,
    BrnSheetImports,
  ],

  providers: [
    provideIcons({
      lucideCross,
    }),
  ],

  templateUrl: './product-family.component.html',
})
export class ProductFamilyComponent {
  constructor() {}
}
