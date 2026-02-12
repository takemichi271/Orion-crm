import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { SwalDirective, SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [ClientComponent],
  imports: [CommonModule, ClientRoutingModule, SwalDirective, SwalComponent],
})
export class ClientModule {}
