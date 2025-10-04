import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full',
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./components/event-list/event-list.component').then((m) => m.EventListComponent),
  },
  {
    path: 'events/:id',
    loadComponent: () =>
      import('./components/event-details/event-details.component').then(
        (m) => m.EventDetailsComponent
      ),
  },
];
