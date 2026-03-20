import { LOCALE_ID, NgModule } from '@angular/core';
import {
    LocationStrategy,
    PathLocationStrategy,
    registerLocaleData,
} from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        TableModule,
        MessagesModule,
        MessageModule,
        CalendarModule,
        InputMaskModule,
        ToastModule,
        DynamicDialogModule,
    ],
    providers: [
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy,
        },
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        MessageService,
        DialogService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
