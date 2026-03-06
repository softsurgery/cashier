import { Component, ViewContainerRef } from '@angular/core'; // 👈 import ViewContainerRef
import { DialogService } from '../../components/dialog/dialog.service';

@Component({
  selector: 'app-product-family',
  standalone: true,
  templateUrl: './product-family.component.html',
})
export class ProductFamilyComponent {
  constructor(
    private dialog: DialogService,
    private viewContainerRef: ViewContainerRef,
  ) {}

  openDialog() {
    this.dialog.open(this.viewContainerRef, {
      title: 'Edit Profile',
      description: 'Make changeschangeschangeschangeschangeschanges to your profile here.',
      confirmText: 'Save Changes',
      cancelText: 'Cancel',
    });
  }
}
