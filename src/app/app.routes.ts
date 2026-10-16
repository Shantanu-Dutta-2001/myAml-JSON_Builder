import { Routes } from '@angular/router';
import { BuilderComponent } from './pages/builder/builder.component';
import { ReleaseNotesComponent } from './pages/release-notes/release-notes.component';

export const routes: Routes = [
  { path: '', component: BuilderComponent },
  { path: 'release-notes', component: ReleaseNotesComponent },
  { path: '**', redirectTo: '' }
];
