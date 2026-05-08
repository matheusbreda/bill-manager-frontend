import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { MonthlyClosureListComponent } from './monthly-closure-list/monthly-closure-list.component';
import { MonthlyClosureRoutingModule } from './monthly-closure-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MonthlyClosureRoutingModule,
        TableModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        DialogModule,
        CardModule,
    ],
    declarations: [MonthlyClosureListComponent],
    providers: [MessageService],
})
export class MonthlyClosureModule {}
