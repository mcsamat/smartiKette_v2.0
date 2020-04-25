import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { SmartmatchComponent } from '../../pages/smartmatch/smartmatch.component';
import { ArticoliComponent } from '../../pages/articoli/articoli.component';
import { EtichetteComponent } from '../../pages/etichette/etichette.component';
import { LocationComponent } from '../../pages/location/location.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'etichette',      component: EtichetteComponent },
    { path: 'location',       component: LocationComponent },
    { path: 'smartmatch',     component: SmartmatchComponent },
    { path: 'articoli',       component: ArticoliComponent }
];