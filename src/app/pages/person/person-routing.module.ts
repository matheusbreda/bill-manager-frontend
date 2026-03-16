import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PersonListComponent } from './person-list/person-list.component';
import { PersonFormComponent } from './person-form/person-form.component';

@NgModule({
  imports: [RouterModule.forChild([
	{ path: 'list', component: PersonListComponent },
	{ path: 'form', component: PersonFormComponent },
	{ path: 'form/:id', component: PersonFormComponent },
	{ path: '', redirectTo: 'list', pathMatch: 'full' }
  ])],
  exports: [RouterModule]
})

export class PersonRoutingModule { }
