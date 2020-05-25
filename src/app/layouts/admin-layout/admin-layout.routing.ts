import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { SmartmatchComponent } from '../../pages/smartmatch/smartmatch.component';
import { ArticoliComponent } from '../../pages/articoli/articoli.component';
import { EtichetteComponent } from '../../pages/etichette/etichette.component';
import { LocationComponent } from '../../pages/location/location.component';
import { VisualizzarticoloComponent } from '../../pages/visualizzarticolo/visualizzarticolo.component';
import { ViewlabelComponent } from '../../pages/viewlabel/viewlabel.component'
import { CrearticoloComponent } from '../../pages/crearticolo/crearticolo.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'etichette',      component: EtichetteComponent },
    { path: 'location',       component: LocationComponent },
    { path: 'smartmatch',     component: SmartmatchComponent },
    { path: 'articoli',       component: ArticoliComponent },
    { path: 'view-item',      component: VisualizzarticoloComponent  },
    { path: 'view-label',     component: ViewlabelComponent },
    { path: 'crea-item',      component: CrearticoloComponent }
];
