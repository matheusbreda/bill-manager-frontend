import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BillListComponent } from './bill-list/bill-list.component';

@NgModule({
  imports: [RouterModule.forChild([
	{ path: '', component: BillListComponent }
  ])],
  exports: [RouterModule]
})

export class BillRoutingModule { }
