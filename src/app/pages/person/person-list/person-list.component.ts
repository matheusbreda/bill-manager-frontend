import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PersonService } from '../../../service/person.service';
import { Router } from '@angular/router';
import { Person } from 'src/app/model/person';

@Component({
    templateUrl: './person-list.component.html',
    styleUrls: ['./person-list.component.scss'],
    providers: [MessageService],
})
export class PersonListComponent implements OnInit {
    personList: Person[] = [];

    constructor(
        private readonly service: PersonService,
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

        this.loadList();
    }

    loadList() {
        this.service.getAll().subscribe((result) => {
            this.personList = result;
        });
    }

    newPerson() {
        this.router.navigate(['/person/form']);
    }

    editPerson(person: Person) {
        this.router.navigate(['/person/form/' + person.id]);
    }

    deletePerson(person: Person) {
        this.confirmationService.confirm({
            message: 'Deseja excluir ' + person.name + '?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.service.delete(person.id).subscribe({
                    next: (result) => {
                        this.loadList();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Pessoa excluída com sucesso',
                        });
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao excluir pessoa',
                        });
                    },
                });
            },
        });
    }
}
