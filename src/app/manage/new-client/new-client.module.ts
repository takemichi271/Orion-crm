import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewClientRoutingModule } from './new-client-routing.module';
import { NewClientComponent } from './new-client.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PhoneMaskDirective } from '@app/utils/phone-mask.directive';
import { RncMaskDirective } from '@app/utils/rnc-mask.directive';

@NgModule({
  declarations: [NewClientComponent, PhoneMaskDirective, RncMaskDirective],
  imports: [CommonModule, NewClientRoutingModule, ReactiveFormsModule],
})
export class NewClientModule {}
