import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
  template: `
    <p-toast position="bottom-right">
      <ng-template #message let-message>
        <div class="term-toast">
          <span class="term-toast-tag" [class.err]="message.severity === 'error'">[{{ message.severity === 'error' ? 'err' : 'ok' }}]</span>
          <span>{{ message.detail }}</span>
        </div>
      </ng-template>
    </p-toast>
    <p-confirmDialog [breakpoints]="{'640px': '92vw'}" styleClass="delete-confirm-dialog"></p-confirmDialog>
    <router-outlet></router-outlet>
  `
})
export class App { }
