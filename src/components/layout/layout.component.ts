import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { SiteHeaderComponent } from './site-header/site-header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, HlmSidebarImports, SiteHeaderComponent, SidebarComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block [--header-height:--spacing(14)]',
  },
  styleUrl: './layout.component.css',
  templateUrl: './layout.component.html',
})
export default class LayoutComponent {}
