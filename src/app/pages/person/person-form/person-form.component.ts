import { Component, OnInit } from '@angular/core';
import {
    ConfirmationService,
    MessageService,
    PrimeNGConfig,
} from 'primeng/api';
import { PersonService } from '../../../service/person.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Person } from 'src/app/model/person';
import {
    Credit,
    CreditTypeEnum,
    DurationTypeEnum,
    ValueTypeEnum,
} from 'src/app/model/credit';
import { Debit } from 'src/app/model/debit';
import { CreditService } from '../../../service/credit.service';
import { DebitService } from 'src/app/service/debit.service';

@Component({
    templateUrl: './person-form.component.html',
    styleUrls: ['./person-form.component.scss'],
    providers: [MessageService, PrimeNGConfig],
})
export class PersonFormComponent implements OnInit {
    id: number;
    person: Person = new Person();
    credit: Credit = new Credit();
    debit: Debit = new Debit();

    creditList: Credit[] = [];
    debitList: Debit[] = [];

    isDialogCreditVisible: boolean = false;
    isDialogDebitVisible: boolean = false;

    CreditTypeEnum = CreditTypeEnum;
    ValueTypeEnum = ValueTypeEnum;
    DurationTypeEnum = DurationTypeEnum;

    creditTypeList = [
        { key: CreditTypeEnum.SALARY, value: 'Salário' },
        { key: CreditTypeEnum.BENEFIT, value: 'Benefício' },
        { key: CreditTypeEnum.OTHER, value: 'Outro' },
    ];

    valueTypeList = [
        { key: ValueTypeEnum.FIXED, value: 'Fixo' },
        { key: ValueTypeEnum.VARIABLE, value: 'Variável' },
    ];

    durationTypeList = [
        { key: DurationTypeEnum.MONTH, value: 'Mês' },
        { key: DurationTypeEnum.YEAR, value: 'Ano' },
    ];

    constructor(
        private readonly personService: PersonService,
        private readonly creditService: CreditService,
        private readonly debitService: DebitService,
        private readonly messageService: MessageService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly confirmationService: ConfirmationService,
    ) {}

    ngOnInit(): void {
        const params: Observable<Params> = this.activatedRoute.params;

        params.subscribe(async (urlParams) => {
            this.id = urlParams['id'];

            if (this.id != undefined) {
                try {
                    await this.personService
                        .getById(this.id)
                        .subscribe((result) => {
                            this.person = result;
                            this.getCreditList(this.person.id);
                            this.getDebitList(this.person.id);
                        });
                } catch (errorResponse) {
                    this.person = new Person();
                }
            }
        });
    }

    backToList() {
        this.router.navigate(['/person']);
    }

    savePerson(person: Person) {
        this.personService.create(person).subscribe((result) => {
            this.person = result;
        });
    }

    // CREDIT

    onCreditTypeChange() {
        if (this.credit.creditType !== CreditTypeEnum.OTHER) {
            this.credit.valueType = null;
            this.credit.duration = null;
            this.credit.durationType = null;
        }
    }

    onCreditValueTypeChange() {
        if (this.credit.valueType !== ValueTypeEnum.VARIABLE) {
            this.credit.duration = null;
            this.credit.durationType = null;
        }
    }

    saveCredit(credit: Credit) {
        this.credit.person = this.person;
        this.creditService.create(credit).subscribe({
            next: (result) => {
                this.credit = new Credit();
                this.isDialogCreditVisible = false;
                this.getCreditList(this.person.id);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Crédito adicionado com sucesso',
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao adicionar crédito',
                });
            },
        });
    }

    getCreditList(id: number) {
        this.creditService.getByPerson(id).subscribe((result) => {
            this.creditList = result;
        });
    }

    editCredit(credit: Credit) {
        this.credit = credit;
        this.isDialogCreditVisible = true;
    }

    deleteCredit(credit: Credit) {
        this.confirmationService.confirm({
            message:
                'Deseja excluir ' +
                credit.creditType +
                ': ' +
                credit.value +
                '?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.creditService.delete(credit.id).subscribe({
                    next: (result) => {
                        this.getCreditList(this.person.id);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Crédito excluído com sucesso',
                        });
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao excluir crédito',
                        });
                    },
                });
            },
        });
    }

    // DEBIT

    onDebitValueTypeChange() {
        if (this.debit.valueType !== ValueTypeEnum.VARIABLE) {
            this.debit.duration = null;
            this.debit.durationType = null;
        }
    }

    saveDebit(debit: Debit) {
        this.debit.person = this.person;
        this.debitService.create(debit).subscribe({
            next: (result) => {
                this.debit = new Debit();
                this.isDialogDebitVisible = false;
                this.getDebitList(this.person.id);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Débito adicionado com sucesso',
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao adicionar débito',
                });
            },
        });
    }

    getDebitList(id: number) {
        this.debitService.getByPerson(id).subscribe((result) => {
            this.debitList = result;
        });
    }

    editDebit(debit: Debit) {
        this.debit = debit;
        this.isDialogDebitVisible = true;
    }

    deleteDebit(debit: Debit) {
        this.confirmationService.confirm({
            message: 'Deseja excluir ' + debit.name + '?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.debitService.delete(debit.id).subscribe({
                    next: (result) => {
                        this.getDebitList(this.person.id);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Débito excluído com sucesso',
                        });
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao excluir débito',
                        });
                    },
                });
            },
        });
    }
}
