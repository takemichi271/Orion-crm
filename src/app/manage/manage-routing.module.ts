import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage.component';

const routes: Routes = [
  {
    path: '',
    component: ManageComponent,
    children: [
      {
        path: 'control',
        loadChildren: () =>
          import('./client-control/client-control.module').then(
            (m) => m.ClientControlModule,
          ),
      },
      {
        path: 'client/:id',
        loadChildren: () =>
          import('./client/client.module').then((m) => m.ClientModule),
      },
      {
        path: 'new-client',
        loadChildren: () =>
          import('./new-client/new-client.module').then(
            (m) => m.NewClientModule,
          ),
      },
      {
        path: 'new-client/:id',
        loadChildren: () =>
          import('./new-client/new-client.module').then(
            (m) => m.NewClientModule,
          ),
      },
      {
        path: 'new-address/:clientID',
        loadChildren: () =>
          import('./new-address/new-address.module').then(
            (m) => m.NewAddressModule,
          ),
      },
      {
        path: 'new-address/:clientID/:id',
        loadChildren: () =>
          import('./new-address/new-address.module').then(
            (m) => m.NewAddressModule,
          ),
      },
      {
        path: '',
        redirectTo: 'control',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRoutingModule {}
