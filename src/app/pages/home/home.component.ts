import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Bill } from 'src/app/model/bill';
import { BillDTO } from 'src/app/model/billDTO';
import { MonthlyClosure } from 'src/app/model/monthlyClosure';
import { MonthlyClosurePerson } from 'src/app/model/monthlyClosurePerson';
import { DurationTypeEnum, ValueTypeEnum } from 'src/app/model/credit';
import { BillService } from 'src/app/service/bill.service';
import { MonthlyClosureService } from 'src/app/service/monthly-closure.service';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    billDTO: BillDTO;

    marketValue: number = 0;

    isClosingMonth: boolean = false;

    constructor(
        private readonly billService: BillService,
        private readonly monthlyClosureService: MonthlyClosureService,
        private readonly messageService: MessageService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly confirmationService: ConfirmationService,
    ) {}

    ngOnInit() {
        this.getBillDTO();
    }

    get currentMonthLabel(): string {
        return new Date().toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric',
        });
    }

    get totalDebit(): number {
        return (this.billDTO?.billPersonDTO || []).reduce(
            (sum, p) => sum + (p.debitFull || 0),
            0,
        );
    }

    get totalRemaining(): number {
        return (this.billDTO?.billPersonDTO || []).reduce(
            (sum, p) => sum + this.getRemaining(p),
            0,
        );
    }

    initials(name: string): string {
        if (!name) return '';
        const parts = name.trim().split(/\s+/);
        const first = parts[0]?.[0] || '';
        const second = parts.length > 1 ? parts[parts.length - 1][0] : '';
        return (first + second).toUpperCase();
    }

    getBillDTO() {
        this.billService.getBillDTO().subscribe((result) => {
            this.billDTO = result;

            this.billDTO.billPersonDTO?.forEach((p) => {
                p.leisurePercent = 40;
                p.investmentPercent = 60;
            });
        });
    }

    likeMarket(): boolean {
        const isMarket = this.billDTO?.billList?.some(
            (b) => b.name?.toLowerCase() === 'mercado',
        );
        if (isMarket) {
            this.calculateMarket();
        }
        return isMarket;
    }

    calculateMarket() {
        this.marketValue =
            this.billDTO?.billList
                ?.filter((b) => b.name?.toLowerCase() === 'mercado')
                ?.reduce((total, b) => total + (b.value || 0), 0) || 0;
    }

    onLeisureChange(person: any) {
        if (person.leisurePercent > 100) person.leisurePercent = 100;
        if (person.leisurePercent < 0) person.leisurePercent = 0;

        person.investmentPercent = 100 - person.leisurePercent;
    }

    onInvestmentChange(person: any) {
        if (person.investmentPercent > 100) person.investmentPercent = 100;
        if (person.investmentPercent < 0) person.investmentPercent = 0;

        person.leisurePercent = 100 - person.investmentPercent;
    }

    getLeisureValue(person: any): number {
        return this.getRemaining(person) * (person.leisurePercent / 100);
    }

    getInvestmentValue(person: any): number {
        return this.getRemaining(person) * (person.investmentPercent / 100);
    }

    getRemaining(person: any): number {
        return (
            person.creditFull -
            person.debitFull -
            person.payable
        );
    }

    confirmCloseMonth() {
        const now = new Date();
        const monthLabel = now.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric',
        });

        this.confirmationService.confirm({
            message: `Deseja fechar o mês de ${monthLabel}? Os valores atuais serão gravados e qualquer fechamento já existente para este mês será sobrescrito.`,
            header: 'Fechar Mês',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => this.closeMonth(),
        });
    }

    closeMonth() {
        if (!this.billDTO) {
            return;
        }

        const now = new Date();
        const persons: MonthlyClosurePerson[] = (this.billDTO.billPersonDTO || []).map(
            (p) => ({
                personName: p.name,
                creditSalary: p.creditSalary || 0,
                creditBenefit: p.creditBenefit || 0,
                creditOther: p.creditOther || 0,
                creditFull: p.creditFull || 0,
                debitFull: p.debitFull || 0,
                payable: p.payable || 0,
                percentage: p.percentage || 0,
                payableMarket: p.payableMarket || 0,
                percentageMarket: p.percentageMarket || 0,
                remaining: this.getRemaining(p),
                leisurePercent: p.leisurePercent || 0,
                leisureValue: this.getLeisureValue(p),
                investmentPercent: p.investmentPercent || 0,
                investmentValue: this.getInvestmentValue(p),
            }),
        );

        const debitOverall = (this.billDTO.billPersonDTO || []).reduce(
            (total, p) => total + (p.debitFull || 0),
            0,
        );

        const remainingOverall = persons.reduce(
            (total, p) => total + (p.remaining || 0),
            0,
        );

        const closure: MonthlyClosure = {
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            creditSalaryOverall: this.billDTO.creditSalaryOverall || 0,
            creditBenefitOverall: this.billDTO.creditBenefitOverall || 0,
            creditOtherOverall: this.billDTO.creditOtherOverall || 0,
            creditOverall: this.billDTO.creditOverall || 0,
            billOverall: this.billDTO.billOverall || 0,
            marketOverall: this.billDTO.marketOverall || 0,
            debitOverall: debitOverall,
            remainingOverall: remainingOverall,
            persons: persons,
        };

        this.isClosingMonth = true;
        this.monthlyClosureService.save(closure).subscribe({
            next: () => {
                this.isClosingMonth = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Mês fechado e salvo com sucesso',
                });
            },
            error: () => {
                this.isClosingMonth = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao fechar o mês',
                });
            },
        });
    }
}
