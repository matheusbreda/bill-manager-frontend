import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MonthlyClosure } from 'src/app/model/monthlyClosure';
import { MonthlyClosureService } from 'src/app/service/monthly-closure.service';

@Component({
    templateUrl: './monthly-closure-list.component.html',
})
export class MonthlyClosureListComponent implements OnInit {
    closures: MonthlyClosure[] = [];

    selectedClosure: MonthlyClosure | null = null;
    isDialogVisible: boolean = false;

    monthLabels = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
    ];

    constructor(
        private readonly service: MonthlyClosureService,
        private readonly messageService: MessageService,
    ) {}

    ngOnInit(): void {
        this.loadClosures();
    }

    loadClosures() {
        this.service.getAll().subscribe({
            next: (result) => {
                this.closures = (result || []).sort((a, b) => {
                    if (a.year !== b.year) return b.year - a.year;
                    return b.month - a.month;
                });
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar fechamentos',
                });
            },
        });
    }

    monthName(month: number): string {
        return this.monthLabels[month - 1] || '';
    }

    viewDetails(closure: MonthlyClosure) {
        this.service.getById(closure.id).subscribe({
            next: (result) => {
                this.selectedClosure = result;
                this.isDialogVisible = true;
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar detalhes',
                });
            },
        });
    }
}
