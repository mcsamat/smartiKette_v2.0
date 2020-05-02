import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',   title: 'Dashboard',   icon: 'ni-tv-2 text-primary',   class: '' },
    { path: '/smartmatch',  title: 'SmartMatch',  icon:'ni-vector text-blue',     class: '' },
    { path: '/articoli',    title: 'Articoli',    icon:'ni-cart text-blue',       class: '' },
    { path: '/etichette',   title: 'Etichette',   icon:'ni-tag text-blue',        class: '' },
    { path: '/location',    title: 'Location',    icon:'ni-pin-3 text-blue',      class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
