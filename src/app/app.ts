import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import LayoutComponent from '../components/layout/layout.component';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent, HlmToasterImports],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('cashier');
  protected readonly isElectron = signal(false);
  protected readonly platform = signal('');
  protected readonly electronVersion = signal('');
  protected readonly nodeVersion = signal('');
  protected readonly chromeVersion = signal('');
  protected readonly pingResult = signal('');

  ngOnInit(): void {
    if (window.electronAPI) {
      this.isElectron.set(true);
      this.platform.set(window.electronAPI.getPlatform());
      this.electronVersion.set(window.electronAPI.getElectronVersion());
      this.nodeVersion.set(window.electronAPI.getNodeVersion());
      this.chromeVersion.set(window.electronAPI.getChromeVersion());

      window.electronAPI.ping().then((result) => {
        this.pingResult.set(result);
      });
    }
  }
}
