import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Bill } from 'src/app/model/bill';
import { BillDTO } from 'src/app/model/billDTO';
import { DurationTypeEnum, ValueTypeEnum } from 'src/app/model/credit';
import { BillService } from 'src/app/service/bill.service';

@Component({
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
    billDTO: BillDTO;

    marketValue: number = 0;

    constructor(
        private readonly billService: BillService,
        private readonly messageService: MessageService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly confirmationService: ConfirmationService,
    ) {}

    ngOnInit() {
        this.getBillDTO();
    }

    getBillDTO() {
        this.billService.getBillDTO().subscribe((result) => {
            this.billDTO = result;
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
}
