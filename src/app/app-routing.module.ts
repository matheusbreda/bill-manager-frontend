import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { NotfoundComponent } from './pages/notfound/notfound.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: AppLayoutComponent,
          children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            {
              path: 'home',
              loadChildren: () =>
                import('./pages/home/home.module').then((m) => m.HomeModule),
            },
            {
              path: 'person',
              loadChildren: () =>
                import('./pages/person/person.module').then((m) => m.PersonModule),
            },
          ],
        },
        { path: 'notfound', component: NotfoundComponent },
        { path: '**', redirectTo: '/notfound' },
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

