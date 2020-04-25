var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { SmartmatchComponent } from '../../pages/smartmatch/smartmatch.component';
import { ArticoliComponent } from '../../pages/articoli/articoli.component';
import { EtichetteComponent } from '../../pages/etichette/etichette.component';
import { LocationComponent } from '../../pages/location/location.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrModule } from 'ngx-toastr';
var AdminLayoutModule = /** @class */ (function () {
    function AdminLayoutModule() {
    }
    AdminLayoutModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                RouterModule.forChild(AdminLayoutRoutes),
                FormsModule,
                HttpClientModule,
                NgbModule,
                ClipboardModule
            ],
            declarations: [
                DashboardComponent,
                EtichetteComponent,
                LocationComponent,
                SmartmatchComponent,
                ArticoliComponent
            ]
        })
    ], AdminLayoutModule);
    return AdminLayoutModule;
}());
export { AdminLayoutModule };
//# sourceMappingURL=admin-layout.module.js.map