import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { ThemeService } from './core/services/theme.service';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { ToastComponent } from 'src/ui';
import { WhoamiService } from './core/services/whoami/whoami.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, ResponsiveHelperComponent, NgxSonnerToaster, ToastComponent],
})
export class AppComponent {
  title = 'Ge Rest';

  constructor(
    public themeService: ThemeService,
    whoamiService: WhoamiService,
  ) {}
}
