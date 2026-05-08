import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MonthlyClosureListComponent } from './monthly-closure-list/monthly-closure-list.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: MonthlyClosureListComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class MonthlyClosureRoutingModule {}
