import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientControlComponent } from './client-control.component';

const routes: Routes = [{ path: '', component: ClientControlComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientControlRoutingModule {}
