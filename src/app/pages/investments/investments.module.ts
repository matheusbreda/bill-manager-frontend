import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';

import { InvestmentsRoutingModule } from './investments-routing.module';
import { InvestmentsComponent } from './investments.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        InvestmentsRoutingModule,
        TableModule,
        ButtonModule,
        ToastModule,
        ToolbarModule,
        CardModule,
        ChartModule,
        InputNumberModule,
    ],
    declarations: [InvestmentsComponent],
    providers: [MessageService],
})
export class InvestmentsModule {}
