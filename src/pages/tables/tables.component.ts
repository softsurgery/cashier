import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import { provideIcons } from '@ng-icons/core';
import { lucidePlus, lucidePencil, lucideTrash2, lucideLoader } from '@ng-icons/lucide';

@Component({
  selector: 'app-tables',
  imports: [
    FormsModule,
    ...HlmButtonImports,
    ...HlmInputImports,
    ...HlmSeparatorImports,
    ...HlmIconImports,
  ],
  providers: [provideIcons({ lucidePlus, lucidePencil, lucideTrash2, lucideLoader })],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css',
})
export class TablesComponent {}