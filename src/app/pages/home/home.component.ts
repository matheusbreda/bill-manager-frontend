import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BillDTO } from 'src/app/model/billDTO';
import { BillPersonDTO } from 'src/app/model/billPersonDTO';
import { BillService } from 'src/app/service/bill.service';

@Component({
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
    billDTO: BillDTO;

    constructor(
        private readonly billService: BillService,
        private readonly messageService: MessageService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly confirmationService: ConfirmationService,
    ) {}

    ngOnInit() {

        this.getBill();
    }

    getBill() {
        this.billService.getBill().subscribe(result => {
            this.billDTO = result;
        })
    }
}
