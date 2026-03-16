import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrls: ['./app.menu.component.scss'],
})
export class AppMenuComponent{
  model: any[] = [];
  activeRoute: string = '';

  displayLogDialog = false;

  constructor(
    public layoutService: LayoutService,
    private readonly router: Router,
  ) {}

}
