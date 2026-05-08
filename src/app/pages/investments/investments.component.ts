import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MonthlyClosure } from 'src/app/model/monthlyClosure';
import { MonthlyClosureService } from 'src/app/service/monthly-closure.service';

interface PersonMonthData {
    value: number;
    cumulative: number;
}

interface MonthlyRow {
    label: string;
    total: number;
    cumulative: number;
    perPerson: { [name: string]: PersonMonthData };
}

@Component({
    templateUrl: './investments.component.html',
})
export class InvestmentsComponent implements OnInit {
    monthLabels = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
    ];

    closures: MonthlyClosure[] = [];
    personNames: string[] = [];

    totalChartData: any;
    simulationChartData: any;
    chartOptions: any;

    simulationMonths: number = 12;

    monthlyRows: MonthlyRow[] = [];

    averageTotal: number = 0;
    averagePerPerson: { [name: string]: number } = {};
    totalAccumulated: number = 0;
    perPersonAccumulated: { [name: string]: number } = {};

    projectedTotal: number = 0;
    projectedPerPerson: { [name: string]: number } = {};

    private readonly palette = [
        '#42A5F5',
        '#66BB6A',
        '#FFA726',
        '#AB47BC',
        '#26C6DA',
        '#EF5350',
        '#7E57C2',
        '#FFCA28',
    ];

    constructor(
        private readonly service: MonthlyClosureService,
        private readonly messageService: MessageService,
    ) {}

    ngOnInit(): void {
        this.chartOptions = this.buildChartOptions();
        this.loadClosures();
    }

    loadClosures() {
        this.service.getAll().subscribe({
            next: (result) => {
                this.closures = (result || []).sort((a, b) => {
                    if (a.year !== b.year) return a.year - b.year;
                    return a.month - b.month;
                });
                this.processData();
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

    processData() {
        const nameSet = new Set<string>();
        for (const c of this.closures) {
            for (const p of c.persons || []) {
                if (p.personName) nameSet.add(p.personName);
            }
        }
        this.personNames = Array.from(nameSet);

        this.monthlyRows = [];
        let cumulativeTotal = 0;
        const cumulativePerPerson: { [name: string]: number } = {};
        this.personNames.forEach((n) => (cumulativePerPerson[n] = 0));

        const labels: string[] = [];
        const totalSeries: number[] = [];
        const cumulativeTotalSeries: number[] = [];

        for (const c of this.closures) {
            const label = `${this.monthLabels[c.month - 1]}/${c.year}`;
            labels.push(label);

            let monthTotal = 0;
            const perPerson: { [name: string]: PersonMonthData } = {};

            for (const name of this.personNames) {
                const p = (c.persons || []).find(
                    (pp) => pp.personName === name,
                );
                const v = p?.investmentValue || 0;
                monthTotal += v;
                cumulativePerPerson[name] += v;
                perPerson[name] = {
                    value: v,
                    cumulative: cumulativePerPerson[name],
                };
            }

            cumulativeTotal += monthTotal;
            totalSeries.push(monthTotal);
            cumulativeTotalSeries.push(cumulativeTotal);

            this.monthlyRows.push({
                label,
                total: monthTotal,
                cumulative: cumulativeTotal,
                perPerson,
            });
        }

        this.totalAccumulated = cumulativeTotal;
        this.perPersonAccumulated = { ...cumulativePerPerson };

        const monthCount = this.closures.length || 1;
        this.averageTotal = cumulativeTotal / monthCount;
        this.averagePerPerson = {};
        for (const name of this.personNames) {
            this.averagePerPerson[name] =
                cumulativePerPerson[name] / monthCount;
        }

        this.totalChartData = {
            labels,
            datasets: [
                {
                    label: 'Investido no mês',
                    data: totalSeries,
                    backgroundColor: 'rgba(66,165,245,0.2)',
                    borderColor: '#42A5F5',
                    fill: true,
                    tension: 0.3,
                },
                {
                    label: 'Acumulado',
                    data: cumulativeTotalSeries,
                    borderColor: '#66BB6A',
                    backgroundColor: 'rgba(102,187,106,0.1)',
                    fill: true,
                    tension: 0.3,
                },
            ],
        };

        this.runSimulation();
    }

    onSimulationChange() {
        if (!this.simulationMonths || this.simulationMonths < 1) {
            this.simulationMonths = 1;
        }
        this.runSimulation();
    }

    runSimulation() {
        const months = this.simulationMonths;

        const labels: string[] = [];
        const totalSeries: number[] = [];
        const perPersonSeries: { [name: string]: number[] } = {};
        this.personNames.forEach((n) => (perPersonSeries[n] = []));

        let runningTotal = this.totalAccumulated;
        const runningPerPerson: { [name: string]: number } = {
            ...this.perPersonAccumulated,
        };

        let nextMonth = 1;
        let nextYear = new Date().getFullYear();
        if (this.closures.length > 0) {
            const last = this.closures[this.closures.length - 1];
            nextMonth = last.month + 1;
            nextYear = last.year;
            if (nextMonth > 12) {
                nextMonth = 1;
                nextYear += 1;
            }
        }

        for (let i = 0; i < months; i++) {
            labels.push(`${this.monthLabels[nextMonth - 1]}/${nextYear}`);
            runningTotal += this.averageTotal;
            totalSeries.push(runningTotal);
            for (const name of this.personNames) {
                runningPerPerson[name] += this.averagePerPerson[name];
                perPersonSeries[name].push(runningPerPerson[name]);
            }

            nextMonth += 1;
            if (nextMonth > 12) {
                nextMonth = 1;
                nextYear += 1;
            }
        }

        this.projectedTotal = runningTotal;
        this.projectedPerPerson = { ...runningPerPerson };

        const datasets: any[] = [
            {
                label: 'Total projetado',
                data: totalSeries,
                borderColor: '#42A5F5',
                backgroundColor: 'rgba(66,165,245,0.15)',
                fill: true,
                tension: 0.3,
                borderDash: [6, 4],
            },
            ...this.personNames.map((name, i) => ({
                label: name,
                data: perPersonSeries[name],
                borderColor: this.palette[(i + 1) % this.palette.length],
                backgroundColor: 'transparent',
                fill: false,
                tension: 0.3,
                borderDash: [4, 4],
            })),
        ];

        this.simulationChartData = { labels, datasets };
    }

    private buildChartOptions() {
        const docStyle = getComputedStyle(document.documentElement);
        const textColor =
            docStyle.getPropertyValue('--text-color').trim() || '#495057';
        const textColorSecondary =
            docStyle.getPropertyValue('--text-color-secondary').trim() ||
            '#6c757d';
        const surfaceBorder =
            docStyle.getPropertyValue('--surface-border').trim() || '#dfe7ef';

        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: textColor } },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) => {
                            const v = ctx.parsed.y || 0;
                            return `${ctx.dataset.label}: ${v.toLocaleString(
                                'pt-BR',
                                { style: 'currency', currency: 'BRL' },
                            )}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                        callback: (value: any) =>
                            Number(value).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                maximumFractionDigits: 0,
                            }),
                    },
                    grid: { color: surfaceBorder },
                },
            },
        };
    }
}
