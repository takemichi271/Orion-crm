import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientControlRoutingModule } from './client-control-routing.module';
import { ClientControlComponent } from './client-control.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ClientControlComponent],
  imports: [CommonModule, ClientControlRoutingModule, ReactiveFormsModule],
})
export class ClientControlModule {}
