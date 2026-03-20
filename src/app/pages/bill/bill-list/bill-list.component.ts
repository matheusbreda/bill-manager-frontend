import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { BillService } from 'src/app/service/bill.service';
import { DurationTypeEnum, ValueTypeEnum } from 'src/app/model/credit';
import { Bill } from 'src/app/model/bill';

@Component({
    templateUrl: './bill-list.component.html',
    styleUrls: ['./bill-list.component.scss'],
    providers: [MessageService],
})
export class BillListComponent implements OnInit {
    billList: Bill[] = [];
    bill: Bill = new Bill();

    isDialogBillVisible: boolean = false;

    ValueTypeEnum = ValueTypeEnum;
    DurationTypeEnum = DurationTypeEnum;

    valueTypeList = [
        { key: ValueTypeEnum.FIXED, value: 'Fixo' },
        { key: ValueTypeEnum.VARIABLE, value: 'Variável' },
    ];

    durationTypeList = [
        { key: DurationTypeEnum.MONTH, value: 'Mês' },
        { key: DurationTypeEnum.YEAR, value: 'Ano' },
    ];

    constructor(
        private readonly service: BillService,
        private readonly messageService: MessageService,
        private readonly router: Router,
        private readonly confirmationService: ConfirmationService,
    ) {}

    ngOnInit(): void {
        const mensagem = history.state?.mensagem;
        if (mensagem) {
            setTimeout(() => {
                this.messageService.add(mensagem);
            }, 0);
        }

        this.getBill();
    }

    getBill() {
        this.service.getAll().subscribe((result) => {
            this.billList = result;
        });
    }

    saveBill(bill: Bill) {
        this.service.create(bill).subscribe({
            next: (result) => {
                this.bill = new Bill();
                this.isDialogBillVisible = false;
                this.getBill();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Conta adicionada com sucesso',
                });
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao adicionar conta',
                });
            },
        });
    }

    editBill(bill: Bill) {
        this.bill = bill;
        this.isDialogBillVisible = true;
    }

    deleteBill(bill: Bill) {
        this.confirmationService.confirm({
            message: 'Deseja excluir a conta ' + bill.name + '?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.service.delete(bill.id).subscribe({
                    next: (result) => {
                        this.getBill();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Conta excluída com sucesso',
                        });
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao excluir conta',
                        });
                    },
                });
            },
        });
    }

    onBillValueTypeChange() {
        if (this.bill.valueType !== ValueTypeEnum.VARIABLE) {
            this.bill.duration = null;
            this.bill.durationType = null;
        }
    }
}
