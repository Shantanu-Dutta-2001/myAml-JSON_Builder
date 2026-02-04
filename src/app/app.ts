import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormEditorComponent } from './components/form-editor/form-editor.component';
import { PreviewComponent } from './components/preview/preview.component';
import { HeroComponent } from './components/hero/hero.component';
import { JsonStateService } from './services/json-state.service';
import { VisitorTrackingService } from './services/visitor-tracking.service';
import { SchemaBuilderComponent } from './components/schema-builder/schema-builder.component';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { DynamicData } from './models/schema.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormEditorComponent,
    PreviewComponent,
    HeroComponent,
    ButtonModule,
    SchemaBuilderComponent,
    TabsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  title = 'MyAML Builder';
  state$: Observable<DynamicData>;

  constructor(
    private jsonState: JsonStateService,
    private visitorTracking: VisitorTrackingService
  ) {
    this.state$ = this.jsonState.state$;
  }

  ngOnInit(): void { }

  reset() {
    this.jsonState.reset();
  }
}
