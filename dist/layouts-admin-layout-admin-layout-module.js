(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["layouts-admin-layout-admin-layout-module"],{

/***/ "./node_modules/ngx-clipboard/__ivy_ngcc__/fesm5/ngx-clipboard.js":
/*!************************************************************************!*\
  !*** ./node_modules/ngx-clipboard/__ivy_ngcc__/fesm5/ngx-clipboard.js ***!
  \************************************************************************/
/*! exports provided: ClipboardDirective, ClipboardIfSupportedDirective, ClipboardModule, ClipboardService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClipboardDirective", function() { return ClipboardDirective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClipboardIfSupportedDirective", function() { return ClipboardIfSupportedDirective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClipboardModule", function() { return ClipboardModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClipboardService", function() { return ClipboardService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");
/* harmony import */ var ngx_window_token__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-window-token */ "./node_modules/ngx-window-token/__ivy_ngcc__/fesm5/ngx-window-token.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");






/**
 * The following code is heavily copied from https://github.com/zenorocha/clipboard.js
 */

var ClipboardService = /** @class */ (function () {
    function ClipboardService(document, window) {
        this.document = document;
        this.window = window;
        this.copySubject = new rxjs__WEBPACK_IMPORTED_MODULE_4__["Subject"]();
        this.copyResponse$ = this.copySubject.asObservable();
        this.config = {};
    }
    ClipboardService.prototype.configure = function (config) {
        this.config = config;
    };
    ClipboardService.prototype.copy = function (content) {
        if (!this.isSupported || !content) {
            return this.pushCopyResponse({ isSuccess: false, content: content });
        }
        var copyResult = this.copyFromContent(content);
        if (copyResult) {
            return this.pushCopyResponse({ content: content, isSuccess: copyResult });
        }
        return this.pushCopyResponse({ isSuccess: false, content: content });
    };
    Object.defineProperty(ClipboardService.prototype, "isSupported", {
        get: function () {
            return !!this.document.queryCommandSupported && !!this.document.queryCommandSupported('copy') && !!this.window;
        },
        enumerable: true,
        configurable: true
    });
    ClipboardService.prototype.isTargetValid = function (element) {
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            if (element.hasAttribute('disabled')) {
                throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
            }
            return true;
        }
        throw new Error('Target should be input or textarea');
    };
    /**
     * Attempts to copy from an input `targetElm`
     */
    ClipboardService.prototype.copyFromInputElement = function (targetElm, isFocus) {
        if (isFocus === void 0) { isFocus = true; }
        try {
            this.selectTarget(targetElm);
            var re = this.copyText();
            this.clearSelection(isFocus ? targetElm : undefined, this.window);
            return re && this.isCopySuccessInIE11();
        }
        catch (error) {
            return false;
        }
    };
    /**
     * This is a hack for IE11 to return `true` even if copy fails.
     */
    ClipboardService.prototype.isCopySuccessInIE11 = function () {
        var clipboardData = this.window['clipboardData'];
        if (clipboardData && clipboardData.getData) {
            if (!clipboardData.getData('Text')) {
                return false;
            }
        }
        return true;
    };
    /**
     * Creates a fake textarea element, sets its value from `text` property,
     * and makes a selection on it.
     */
    ClipboardService.prototype.copyFromContent = function (content, container) {
        if (container === void 0) { container = this.document.body; }
        // check if the temp textarea still belongs to the current container.
        // In case we have multiple places using ngx-clipboard, one is in a modal using container but the other one is not.
        if (this.tempTextArea && !container.contains(this.tempTextArea)) {
            this.destroy(this.tempTextArea.parentElement);
        }
        if (!this.tempTextArea) {
            this.tempTextArea = this.createTempTextArea(this.document, this.window);
            try {
                container.appendChild(this.tempTextArea);
            }
            catch (error) {
                throw new Error('Container should be a Dom element');
            }
        }
        this.tempTextArea.value = content;
        var toReturn = this.copyFromInputElement(this.tempTextArea, false);
        if (this.config.cleanUpAfterCopy) {
            this.destroy(this.tempTextArea.parentElement);
        }
        return toReturn;
    };
    /**
     * Remove temporary textarea if any exists.
     */
    ClipboardService.prototype.destroy = function (container) {
        if (container === void 0) { container = this.document.body; }
        if (this.tempTextArea) {
            container.removeChild(this.tempTextArea);
            // removeChild doesn't remove the reference from memory
            this.tempTextArea = undefined;
        }
    };
    /**
     * Select the target html input element.
     */
    ClipboardService.prototype.selectTarget = function (inputElement) {
        inputElement.select();
        inputElement.setSelectionRange(0, inputElement.value.length);
        return inputElement.value.length;
    };
    ClipboardService.prototype.copyText = function () {
        return this.document.execCommand('copy');
    };
    /**
     * Moves focus away from `target` and back to the trigger, removes current selection.
     */
    ClipboardService.prototype.clearSelection = function (inputElement, window) {
        inputElement && inputElement.focus();
        window.getSelection().removeAllRanges();
    };
    /**
     * Creates a fake textarea for copy command.
     */
    ClipboardService.prototype.createTempTextArea = function (doc, window) {
        var isRTL = doc.documentElement.getAttribute('dir') === 'rtl';
        var ta;
        ta = doc.createElement('textarea');
        // Prevent zooming on iOS
        ta.style.fontSize = '12pt';
        // Reset box model
        ta.style.border = '0';
        ta.style.padding = '0';
        ta.style.margin = '0';
        // Move element out of screen horizontally
        ta.style.position = 'absolute';
        ta.style[isRTL ? 'right' : 'left'] = '-9999px';
        // Move element to the same position vertically
        var yPosition = window.pageYOffset || doc.documentElement.scrollTop;
        ta.style.top = yPosition + 'px';
        ta.setAttribute('readonly', '');
        return ta;
    };
    /**
     * Pushes copy operation response to copySubject, to provide global access
     * to the response.
     */
    ClipboardService.prototype.pushCopyResponse = function (response) {
        this.copySubject.next(response);
    };
    /**
     * @deprecated use pushCopyResponse instead.
     */
    ClipboardService.prototype.pushCopyReponse = function (response) {
        this.pushCopyResponse(response);
    };
    ClipboardService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Inject"], args: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["DOCUMENT"],] }] },
        { type: undefined, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Optional"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Inject"], args: [ngx_window_token__WEBPACK_IMPORTED_MODULE_3__["WINDOW"],] }] }
    ]; };
    ClipboardService.ɵprov = Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"])({ factory: function ClipboardService_Factory() { return new ClipboardService(Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"])(_angular_common__WEBPACK_IMPORTED_MODULE_1__["DOCUMENT"]), Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"])(ngx_window_token__WEBPACK_IMPORTED_MODULE_3__["WINDOW"], 8)); }, token: ClipboardService, providedIn: "root" });
    ClipboardService = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([ Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__param"])(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Inject"])(_angular_common__WEBPACK_IMPORTED_MODULE_1__["DOCUMENT"])), Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__param"])(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Optional"])()), Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__param"])(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Inject"])(ngx_window_token__WEBPACK_IMPORTED_MODULE_3__["WINDOW"]))
    ], ClipboardService);
ClipboardService.ɵfac = function ClipboardService_Factory(t) { return new (t || ClipboardService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_1__["DOCUMENT"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](ngx_window_token__WEBPACK_IMPORTED_MODULE_3__["WINDOW"], 8)); };
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](ClipboardService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"],
        args: [{ providedIn: 'root' }]
    }], function () { return [{ type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Inject"],
                args: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["DOCUMENT"]]
            }] }, { type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Optional"]
            }, {
                type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Inject"],
                args: [ngx_window_token__WEBPACK_IMPORTED_MODULE_3__["WINDOW"]]
            }] }]; }, null); })();
    return ClipboardService;
}());

var ClipboardDirective = /** @class */ (function () {
    function ClipboardDirective(clipboardSrv) {
        this.clipboardSrv = clipboardSrv;
        this.cbOnSuccess = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
        this.cbOnError = new _angular_core__WEBPACK_IMPORTED_MODULE_2__["EventEmitter"]();
    }
    // tslint:disable-next-line:no-empty
    ClipboardDirective.prototype.ngOnInit = function () { };
    ClipboardDirective.prototype.ngOnDestroy = function () {
        this.clipboardSrv.destroy(this.container);
    };
    ClipboardDirective.prototype.onClick = function (event) {
        if (!this.clipboardSrv.isSupported) {
            this.handleResult(false, undefined, event);
        }
        else if (this.targetElm && this.clipboardSrv.isTargetValid(this.targetElm)) {
            this.handleResult(this.clipboardSrv.copyFromInputElement(this.targetElm), this.targetElm.value, event);
        }
        else if (this.cbContent) {
            this.handleResult(this.clipboardSrv.copyFromContent(this.cbContent, this.container), this.cbContent, event);
        }
    };
    /**
     * Fires an event based on the copy operation result.
     * @param succeeded
     */
    ClipboardDirective.prototype.handleResult = function (succeeded, copiedContent, event) {
        var response = {
            isSuccess: succeeded,
            event: event
        };
        if (succeeded) {
            response = Object.assign(response, {
                content: copiedContent,
                successMessage: this.cbSuccessMsg
            });
            this.cbOnSuccess.emit(response);
        }
        else {
            this.cbOnError.emit(response);
        }
        this.clipboardSrv.pushCopyResponse(response);
    };
    ClipboardDirective.ctorParameters = function () { return [
        { type: ClipboardService }
    ]; };
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])('ngxClipboard')
    ], ClipboardDirective.prototype, "targetElm", void 0);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])()
    ], ClipboardDirective.prototype, "container", void 0);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])()
    ], ClipboardDirective.prototype, "cbContent", void 0);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"])()
    ], ClipboardDirective.prototype, "cbSuccessMsg", void 0);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])()
    ], ClipboardDirective.prototype, "cbOnSuccess", void 0);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"])()
    ], ClipboardDirective.prototype, "cbOnError", void 0);
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["HostListener"])('click', ['$event.target'])
    ], ClipboardDirective.prototype, "onClick", null);
ClipboardDirective.ɵfac = function ClipboardDirective_Factory(t) { return new (t || ClipboardDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](ClipboardService)); };
ClipboardDirective.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({ type: ClipboardDirective, selectors: [["", "ngxClipboard", ""]], hostBindings: function ClipboardDirective_HostBindings(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ClipboardDirective_click_HostBindingHandler($event) { return ctx.onClick($event.target); });
    } }, inputs: { targetElm: ["ngxClipboard", "targetElm"], container: "container", cbContent: "cbContent", cbSuccessMsg: "cbSuccessMsg" }, outputs: { cbOnSuccess: "cbOnSuccess", cbOnError: "cbOnError" } });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](ClipboardDirective, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Directive"],
        args: [{
                selector: '[ngxClipboard]'
            }]
    }], function () { return [{ type: ClipboardService }]; }, { cbOnSuccess: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"]
        }], cbOnError: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Output"]
        }], onClick: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["HostListener"],
            args: ['click', ['$event.target']]
        }], targetElm: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"],
            args: ['ngxClipboard']
        }], container: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }], cbContent: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }], cbSuccessMsg: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Input"]
        }] }); })();
    return ClipboardDirective;
}());

var ClipboardIfSupportedDirective = /** @class */ (function () {
    function ClipboardIfSupportedDirective(_clipboardService, _viewContainerRef, _templateRef) {
        this._clipboardService = _clipboardService;
        this._viewContainerRef = _viewContainerRef;
        this._templateRef = _templateRef;
    }
    ClipboardIfSupportedDirective.prototype.ngOnInit = function () {
        if (this._clipboardService.isSupported) {
            this._viewContainerRef.createEmbeddedView(this._templateRef);
        }
    };
    ClipboardIfSupportedDirective.ctorParameters = function () { return [
        { type: ClipboardService },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewContainerRef"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["TemplateRef"] }
    ]; };
ClipboardIfSupportedDirective.ɵfac = function ClipboardIfSupportedDirective_Factory(t) { return new (t || ClipboardIfSupportedDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](ClipboardService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewContainerRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["TemplateRef"])); };
ClipboardIfSupportedDirective.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({ type: ClipboardIfSupportedDirective, selectors: [["", "ngxClipboardIfSupported", ""]] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](ClipboardIfSupportedDirective, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["Directive"],
        args: [{
                selector: '[ngxClipboardIfSupported]'
            }]
    }], function () { return [{ type: ClipboardService }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["ViewContainerRef"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["TemplateRef"] }]; }, null); })();
    return ClipboardIfSupportedDirective;
}());

var ClipboardModule = /** @class */ (function () {
    function ClipboardModule() {
    }
ClipboardModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({ type: ClipboardModule });
ClipboardModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({ factory: function ClipboardModule_Factory(t) { return new (t || ClipboardModule)(); }, imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](ClipboardModule, { declarations: function () { return [ClipboardDirective,
        ClipboardIfSupportedDirective]; }, imports: function () { return [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]]; }, exports: function () { return [ClipboardDirective,
        ClipboardIfSupportedDirective]; } }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](ClipboardModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"],
        args: [{
                imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]],
                declarations: [ClipboardDirective, ClipboardIfSupportedDirective],
                exports: [ClipboardDirective, ClipboardIfSupportedDirective]
            }]
    }], function () { return []; }, null); })();
    return ClipboardModule;
}());

/*
 * Public API Surface of ngx-clipboard
 */

/**
 * Generated bundle index. Do not edit.
 */



//# sourceMappingURL=ngx-clipboard.js.map

/***/ }),

/***/ "./node_modules/ngx-window-token/__ivy_ngcc__/fesm5/ngx-window-token.js":
/*!******************************************************************************!*\
  !*** ./node_modules/ngx-window-token/__ivy_ngcc__/fesm5/ngx-window-token.js ***!
  \******************************************************************************/
/*! exports provided: WINDOW */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WINDOW", function() { return WINDOW; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");


var WINDOW = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["InjectionToken"]('WindowToken', typeof window !== 'undefined' && window.document ? { providedIn: 'root', factory: function () { return window; } } : undefined);

/*
 * Public API Surface of ngx-window-token
 */

/**
 * Generated bundle index. Do not edit.
 */



//# sourceMappingURL=ngx-window-token.js.map

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/articoli/articoli.component.html":
/*!**********************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/articoli/articoli.component.html ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"header bg-gradient-info pb-8 pt-5 pt-md-5\"></div>\r\n<!-- Modal DELETE Item -->\r\n<ng-template #content let-modal>\r\n  <div class=\"modal-header\"  data-backdrop=\"static\">\r\n    <h4 i18n class=\"modal-title\" id=\"modal-basic-title\">Conferma eliminazione</h4>\r\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"modal.close()\">\r\n    <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <div class=\"modal-body\">\r\n    <p i18n>Sicuro di voler eliminare l'articolo <strong>{{ alias }}</strong>?</p>\r\n  </div>\r\n  <div class=\"modal-footer\">\r\n    <button i18n class=\"btn btn-danger\" (click)=\"deleteItem()\" type=\"button\">Elimina</button>\r\n    <button i18n type=\"button\" class=\"btn btn-outline-default\" (click)=\"modal.close()\">Anulla</button>\r\n  </div>\r\n</ng-template>\r\n<!-- Modal DELETE Multiple Items -->\r\n<ng-template #multiple let-modal>\r\n  <div class=\"modal-header\"  data-backdrop=\"static\">\r\n    <h4 i18n class=\"modal-title\" id=\"modal-basic-title\">Conferma eliminazione multipla</h4>\r\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"modal.close()\">\r\n    <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <div class=\"modal-body\">\r\n    <p i18n>Sicuro di voler eliminare i <strong>{{ index }}</strong> articoli selezionati?</p>\r\n  </div>\r\n  <div class=\"modal-footer\">\r\n    <button i18n class=\"btn btn-danger\" (click)=\"deleteMultiple()\" type=\"button\">Elimina</button>\r\n    <button i18n type=\"button\" class=\"btn btn-outline-default\" (click)=\"modal.close()\">Anulla</button>\r\n  </div>\r\n</ng-template>\r\n<!-- Contenuto della pagina -->\r\n<div class=\"container-fluid mt--7\">\r\n  <div class=\"row\">\r\n    <div class=\"col\">\r\n      <div class=\"card shadow\">\r\n        <!-- Header -->\r\n        <div class=\"card-header bg-transparent\">\r\n          <!-- Alert Conferma Eliminazione -->\r\n          <ngb-alert *ngIf=\"successMessage\" type=\"danger\" (close)=\"successMessage = ''\">{{ successMessage }}</ngb-alert>\r\n          <h2 i18n class=\"mb-0\">Lista Articoli</h2>\r\n          <!-- Elimina o Crea Nuovo Articolo -->\r\n          <div class=\"text-right\">\r\n            <div ngbDropdown class=\"d-inline-block\">\r\n              <button i18n class=\"btn btn-outline-info\" id=\"delItemBtn\" (click)=\"checkAll()\">\r\n              Seleziona Tutto <span *ngIf=\"index != 0\">({{ index }})</span>\r\n              </button>\r\n              <button i18n *ngIf=\"index != 0\" class=\"btn btn-outline-danger\" id=\"delItemBtn\" (click)=\"open(multiple)\">\r\n              <i class=\"fa fa-trash\"></i> Elimina Selezionati\r\n              </button>\r\n              <button i18n class=\"btn btn-outline-primary\" id=\"dropdownBasic1\" ngbDropdownToggle>\r\n              <i class=\"fas fa-caret-down\"></i> Crea Nuovo\r\n              </button>\r\n              <div ngbDropdownMenu aria-labelledby=\"dropdownBasic1\">\r\n                <button ngbDropdownItem *ngFor=\"let item of items_t\" [value]=\"item.id\" (click)=\"addItem(item.id)\">{{ item.name }}</button>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- Card Body -->\r\n        <div class=\"card-body\">\r\n          <!-- Tabella Articoli -->\r\n          <div class=\"table-responsive\" id=\"stampare\">\r\n            <table class=\"display table table-striped align-items-center table-flush\" datatable [dtOptions]=\"dtOptions\" [dtTrigger]=\"dtTrigger\">\r\n            <thead class=\"thead-light\">\r\n              <tr>\r\n                <th i18n scope=\"col\"></th>\r\n                <th i18n scope=\"col\">Alias</th>\r\n                <th i18n scope=\"col\">ID Customer</th>\r\n                <!-- <th scope=\"col\">ID Database</th> -->\r\n                <th i18n scope=\"col\">Data Revisione</th>\r\n                <th i18n scope=\"col\">Tipo</th>\r\n              </tr>\r\n            </thead>\r\n            <tbody id=\"stampare\">\r\n              <tr *ngFor=\"let item of items$\">\r\n                <td>\r\n                  <!-- Checkbox -->&nbsp;\t\r\n                  <input type=\"checkbox\" #checkboxes class=\"form-check-input\" id=\"{{ item.id }}\" (change)=\"ngOnSelected()\">\r\n                  <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Tools\">\r\n                    <!-- Elimina Item con Modal -->\r\n                    <button type=\"button\" class=\"btn btn-danger\" (click)=\"open(content, item.id, item.reserved_alias)\">\r\n                    <i class=\"fas fa-trash\"></i>\r\n                    </button>\r\n                  </div>\r\n                </td>\r\n                <th>\r\n                  <a [routerLink]=\"\" (click)=\"viewItem(item.id)\">{{ item.reserved_alias }}</a>\r\n                </th>\r\n                <td>{{ item.item_identifier }}</td>\r\n                <!-- <td>{{ item.id }}</td> -->\r\n                <td>{{ item.current_revision_date }}</td>\r\n                <td>{{ item.item_type }}</td>\r\n              </tr>\r\n            </tbody>\r\n            </table>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/dashboard/dashboard.component.html":
/*!************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/dashboard/dashboard.component.html ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!-- Sfondo Header e Cards -->\r\n<div class=\"header bg-gradient-info pb-8 pt-5 pt-md-6\">\r\n    <div class=\"d-lg-none\">\r\n       <br><br>\r\n    </div>\r\n    <div class=\"container-fluid\">\r\n       <div class=\"header-body\">\r\n          <!-- Info Cards -->\r\n          <div class=\"row\">\r\n             <!-- Sistema -->\r\n             <div class=\"col-xl-4 col-lg-6\">\r\n                <div class=\"card card-stats mb-4 mb-xl-0\">\r\n                   <div class=\"card-body\">\r\n                      <div class=\"row\">\r\n                         <div class=\"col\">\r\n                            <h5 i18n class=\"card-title text-uppercase text-muted mb-0\">Informazioni</h5>\r\n                            <span class=\"h2 font-weight-bold mb-0\">{{ varInstName }}</span>\r\n                         </div>\r\n                         <div class=\"col-auto\">\r\n                            <div class=\"icon icon-shape bg-default text-white rounded-circle shadow\">\r\n                               <i class=\"ni ni-settings\"></i>\r\n                            </div>\r\n                         </div>\r\n                      </div>\r\n                      <p class=\"mt-3 mb-0 text-muted text-sm\">\r\n                         <span class=\"text-success mr-2\">{{ varInstallationType }}</span>\r\n                         <span i18n class=\"text-nowrap\">Tipologia installazione</span>\r\n                      </p>\r\n                   </div>\r\n                </div>\r\n             </div>\r\n             <!-- Etichette -->\r\n             <div class=\"col-xl-4 col-lg-6\">\r\n                <div class=\"card card-stats mb-4 mb-xl-0\">\r\n                   <div class=\"card-body\">\r\n                      <div class=\"row\">\r\n                         <div class=\"col\">\r\n                            <h5 i18n class=\"card-title text-uppercase text-muted mb-0\">Etichette online</h5>\r\n                            <span class=\"h2 font-weight-bold mb-0\">{{ labelOnline }}</span>\r\n                         </div>\r\n                         <div class=\"col-auto\">\r\n                            <div class=\"icon icon-shape bg-success text-white rounded-circle shadow\">\r\n                               <i class=\"ni ni-button-play\"></i>\r\n                            </div>\r\n                         </div>\r\n                      </div>\r\n                      <p class=\"mt-3 mb-0 text-muted text-sm\">\r\n                         <span class=\"text-danger mr-2\">{{ labelOffline }}</span>\r\n                         <span i18n class=\"text-nowrap\">Etichette offline</span>\r\n                      </p>\r\n                   </div>\r\n                </div>\r\n             </div>\r\n             <!-- Batterie -->\r\n             <div class=\"col-xl-4 col-lg-6\">\r\n                <div class=\"card card-stats mb-4 mb-xl-0\">\r\n                   <div class=\"card-body\">\r\n                      <div class=\"row\">\r\n                         <div class=\"col\">\r\n                            <h5 i18n class=\"card-title text-uppercase text-muted mb-0\">Batterie scariche</h5>\r\n                            <span class=\"h2 font-weight-bold mb-0\">{{ batteryBad }}</span>\r\n                         </div>\r\n                         <div class=\"col-auto\">\r\n                            <div class=\"icon icon-shape bg-warning text-white rounded-circle shadow\">\r\n                               <i class=\"ni ni-button-power\"></i>\r\n                            </div>\r\n                         </div>\r\n                      </div>\r\n                      <p class=\"mt-3 mb-0 text-muted text-sm\">\r\n                         <span class=\"text-success mr-2\">{{ batteryGood }}</span>\r\n                         <span i18n class=\"text-nowrap\">In buono stato</span>\r\n                      </p>\r\n                   </div>\r\n                </div>\r\n             </div>\r\n          </div>\r\n       </div>\r\n    </div>\r\n </div>\r\n <!-- Contenuto della Dashboard -->\r\n <div class=\"container-fluid mt--7\" id=\"stampare\">\r\n    <!-- Prima riga -->\r\n    <div class=\"row\">\r\n       <!-- Informazioni Installazione & Templates -->\r\n       <div class=\"col-xl-4\">\r\n          <!-- Informazioni Installazione -->\r\n          <div class=\"card shadow\">\r\n             <!-- Header Info -->\r\n             <div class=\"card-header bg-transparent\">\r\n                <div class=\"row align-items-center\">\r\n                   <div class=\"col\">\r\n                      <h6 i18n class=\"text-uppercase text-muted ls-1 mb-1\">Installazione</h6>\r\n                      <h2 i18n class=\"mb-0\"><i class=\"fas fa-info-circle\"></i> Informazioni Installazione</h2>\r\n                   </div>\r\n                </div>\r\n             </div>\r\n             <!-- Contenuto Info -->\r\n             <div class=\"card-body\">\r\n                <p i18n class=\"card-text\">Nome: <strong>{{ varInstName }}</strong></p>\r\n                <p i18n class=\"card-text\">Tipologia: <strong>{{ varInstallationType }}</strong></p>\r\n                <ng-template [ngIf]=\"varInstallationType == 'multistore'\">\r\n                   <p i18n class=\"card-text\">Ruolo: <i class=\"fab fa-linode\" aria-hidden=\"true\"></i><strong> Nodo</strong></p>\r\n                </ng-template>\r\n                <p i18n class=\"card-text\">Import patch: <strong>{{ importBasePath }}</strong></p>\r\n             </div>\r\n          </div>\r\n          <br>\r\n          <!-- Templates -->\r\n          <div class=\"card shadow\">\r\n             <!-- Header -->\r\n             <div class=\"card-header bg-transparent\">\r\n                <div class=\"row align-items-center\">\r\n                   <div class=\"col\">\r\n                      <h6 i18n class=\"text-uppercase text-muted ls-1 mb-1\">Lista Custom Templates</h6>\r\n                      <h2 i18n class=\"mb-0\"><i class=\"fas fa-crop\"></i> Templates</h2>\r\n                   </div>\r\n                </div>\r\n             </div>\r\n             <!-- Contenuto -->\r\n             <div class=\"card-body\">\r\n                <!-- Form di aggiunta template\r\n                   <form>\r\n                       <div class=\"form-group\">\r\n                           <label for=\"exampleFormControlFile1\">Importa da file</label>\r\n                           <input type=\"file\" class=\"form-control-file\" id=\"exampleFormControlFile1\">\r\n                       </div>\r\n                   </form>\r\n                   <br/>  -->\r\n                <!-- Scegli Tipologia Template -->\r\n                <div class=\"form-group\">\r\n                   <label i18n for=\"itemType\">Tiplogia</label>\r\n                   <select [(ngModel)]=\"selectedOption\" class=\"form-control\" name=\"itemType\" id=\"itemType\" (click)=\"getItemTypeTemplate($event.target.value)\">\r\n                   <option *ngFor=\"let item of varItem\" [value]=\"item.id\">{{ item.name }}</option>\r\n                   </select>\r\n                </div>\r\n                <!-- Lista templates -->\r\n                <label i18n>Lista Template</label>\r\n                <ul class=\"list-group list-group-flush\">\r\n                   <li class=\"list-group-item\" *ngFor=\"let template of templates\">\r\n                      <small>{{ template.title }}</small>\r\n                   </li>\r\n                </ul>\r\n             </div>\r\n          </div>\r\n          <br>\r\n       </div>\r\n       <!-- Display Etichette & APs -->\r\n       <div class=\"col-xl-4\">\r\n          <!-- Display Etichette -->\r\n          <div class=\"card shadow\">\r\n             <!-- Display -->\r\n             <div class=\"card-header bg-transparent\">\r\n                <div class=\"row align-items-center\">\r\n                   <div class=\"col\">\r\n                      <h6 i18n class=\"text-uppercase text-muted ls-1 mb-1\">Display</h6>\r\n                      <h2 i18n class=\"mb-0\"><i class=\"fas fa-desktop\"></i> Display</h2>\r\n                      <small i18n>Stato display a disposizione</small>\r\n                   </div>\r\n                </div>\r\n             </div>\r\n             <!-- Etichette-->\r\n             <div class=\"card-header bg-transparent\">\r\n                <div class=\"row align-items-center\">\r\n                   <div class=\"col\">\r\n                      <h2 i18n class=\"mb-0\"><i class=\"fas fa-tags\"></i> Etichette</h2>\r\n                      <!-- Stato etichette -->\r\n                      <p i18n class=\"card-text\">Online <span class=\"badge badge-success\">{{ labelOnline }}</span> - Offline <span class=\"badge badge-danger\">{{ labelOffline }}</span></p>\r\n                      <p i18n class=\"card-text\">Battery Good <span class=\"badge badge-success\">{{ batteryGood }}</span> - Battery Bad <span class=\"badge badge-danger\">{{ batteryBad }}</span></p>\r\n                      <p i18n class=\"card-text\">Totale Etichette Match Attivi <span class=\"badge badge-success\">{{ varTotMatch }}</span></p>\r\n                   </div>\r\n                </div>\r\n             </div>\r\n          </div>\r\n          <br>\r\n          <!-- APs -->\r\n          <div class=\"card shadow\">\r\n             <!-- Header -->\r\n             <div class=\"card-header bg-transparent\">\r\n                <div class=\"row align-items-center\">\r\n                   <div class=\"col\">\r\n                      <h6 i18n class=\"text-uppercase text-muted ls-1 mb-1\">APs</h6>\r\n                      <h2 i18n class=\"mb-0\"><i class=\"fas fa-wifi\"></i> Access Points <span class=\"badge badge-pill badge-default\">{{ totalAP }}</span></h2>\r\n                   </div>\r\n                </div>\r\n             </div>\r\n             <!-- Contenuto -->\r\n             <div class=\"card-body\">\r\n                <div class=\"table-responsive\">\r\n                   <table class=\"table align-items-center table-flush\">\r\n                      <thead class=\"thead-light\">\r\n                         <tr>\r\n                            <th i18n scope=\"col\">ID</th>\r\n                            <th i18n scope=\"col\">Stato</th>\r\n                            <th i18n scope=\"col\">Nome</th>\r\n                            <th i18n scope=\"col\">Versione</th>\r\n                            <th i18n scope=\"col\">IP</th>\r\n                         </tr>\r\n                      </thead>\r\n                      <tbody>\r\n                         <tr *ngFor=\"let ap of ap$\">\r\n                            <th>{{ ap.id }}</th>\r\n                            <td>{{ ap.connection_status }}</td>\r\n                            <td>{{ ap.name }}</td>\r\n                            <td>{{ ap.version }}</td>\r\n                            <td>{{ ap.ip }}</td>\r\n                         </tr>\r\n                      </tbody>\r\n                   </table>\r\n                </div>\r\n             </div>\r\n          </div>\r\n       </div>\r\n       <!-- Articoli & Importazioni -->\r\n       <div class=\"col-xl-4\">\r\n          <!-- Articoli -->\r\n          <div class=\"card shadow\">\r\n             <!-- Header -->\r\n             <div class=\"card-header bg-transparent\">\r\n                <div class=\"row align-items-center\">\r\n                   <div class=\"col\">\r\n                      <h6 i18n class=\"text-uppercase text-muted ls-1 mb-1\">Oggetti</h6>\r\n                      <h2 i18n class=\"mb-0\"><i class=\"fas fa-list\"></i> Articoli <span class=\"badge badge-pill badge-default\">{{ varTotItem }}</span></h2>\r\n                   </div>\r\n                </div>\r\n             </div>\r\n             <div class=\"card-body\">\r\n                <!-- Contenuto -->\r\n                <h3 i18n>Tipologie di articoli <span class=\"badge badge-pill badge-default\">{{ totalItemType }}</span></h3>\r\n                <!-- Tabella -->\r\n                <div class=\"table-responsive\">\r\n                   <table class=\"table align-items-center table-flush\">\r\n                      <!-- Intestazione tabella -->\r\n                      <thead class=\"thead-light\">\r\n                         <tr>\r\n                            <th i18n scope=\"col\">Tipo</th>\r\n                            <th i18n scope=\"col\">Tiplogia</th>\r\n                            <th i18n scope=\"col\">Propagabile</th>\r\n                         </tr>\r\n                      </thead>\r\n                      <!-- Contenuto tabella -->\r\n                      <tbody>\r\n                         <tr *ngFor=\"let item of varItem\">\r\n                            <th>{{ item.id }}</th>\r\n                            <td>{{ item.name }}</td>\r\n                            <td>\r\n                               <div *ngIf=\"item.propagable == true; else elseBlock\"><span i18n class=\"badge badge-success\">SI</span></div>\r\n                               <ng-template #elseBlock><span i18n class=\"badge badge-danger\">NO</span></ng-template>\r\n                            </td>\r\n                         </tr>\r\n                      </tbody>\r\n                   </table>\r\n                </div>\r\n             </div>\r\n          </div>\r\n          <br>\r\n          <!-- Importazioni -->\r\n          <div class=\"card shadow\">\r\n             <div class=\"card-header bg-transparent\">\r\n                <div class=\"row align-items-center\">\r\n                   <div class=\"col\">\r\n                      <h6 i18n class=\"text-uppercase text-muted ls-1 mb-1\">Dati</h6>\r\n                      <h2 i18n class=\"mb-0\"><i class=\"fas fa-file-import\"></i> Importazioni</h2>\r\n                   </div>\r\n                </div>\r\n             </div>\r\n             <div class=\"card-body\">\r\n                <!-- Tabella Importazioni -->\r\n                <div class=\"table-responsive\">\r\n                   <table class=\"table align-items-center table-flush\">\r\n                      <thead class=\"thead-light\">\r\n                         <tr>\r\n                            <th i18n scope=\"col\">Ultima Importazione</th>\r\n                            <th i18n scope=\"col\">Numero Articoli</th>\r\n                         </tr>\r\n                      </thead>\r\n                      <tbody>\r\n                         <tr *ngFor=\"let import of varImport\">\r\n                            <th>{{ import.end_process_date }}</th>\r\n                            <td>{{ import.updated_items }}</td>\r\n                         </tr>\r\n                      </tbody>\r\n                   </table>\r\n                </div>\r\n             </div>\r\n          </div>\r\n       </div>\r\n    </div>\r\n    <br/>\r\n    <!-- Terza riga: Device mobili -->\r\n    <div class=\"row\">\r\n       <div class=\"col\">\r\n          <div class=\"card shadow\">\r\n             <div class=\"card-header bg-transparent\">\r\n                <h3 i18n class=\"mb-0\"><i class=\"fas fa-mobile-alt\"></i> Device mobili</h3>\r\n             </div>\r\n             <div class=\"table-responsive\">\r\n                <!-- Tabella Device mobili -->\r\n                <table class=\"table align-items-center table-flush\">\r\n                   <thead class=\"thead-light\">\r\n                      <tr>\r\n                         <th i18n scope=\"col\">ID</th>\r\n                         <th i18n scope=\"col\">IMEI</th>\r\n                         <th i18n scope=\"col\">Nome</th>\r\n                         <th i18n scope=\"col\">Firebase ID</th>\r\n                         <th i18n scope=\"col\">Ultimo login</th>\r\n                      </tr>\r\n                   </thead>\r\n                   <tbody>\r\n                      <tr *ngFor=\"let mobile of varMobile\">\r\n                         <th>{{ mobile.id }}</th>\r\n                         <td>{{ mobile.imei }}</td>\r\n                         <td>{{ mobile.device_name }}</td>\r\n                         <td>\r\n                            <div *ngIf=\"mobile.firebase_id != null; else elseBlock\"><i class=\"fas fa-check-circle\"></i></div>\r\n                            <ng-template #elseBlock><i class=\"fas fa-times-circle\"></i></ng-template>\r\n                         </td>\r\n                         <td>{{ mobile.last_modified_date }}</td>\r\n                      </tr>\r\n                   </tbody>\r\n                </table>\r\n             </div>\r\n          </div>\r\n       </div>\r\n    </div>\r\n    <br/>\r\n    <!-- Quarta riga: Info Sistema -->\r\n    <div class=\"row\">\r\n       <div class=\"col\">\r\n          <div class=\"card shadow\">\r\n             <div class=\"card-header bg-transparent\">\r\n                <h3 i18n class=\"mb-0\"><i class=\"fas fa-rocket\"></i> Stato Sistema e Versioni Software</h3>\r\n             </div>\r\n             <!-- Informazioni sul sistema -->\r\n             <div class=\"card-body\">\r\n                <div class=\"row\">\r\n                   <div class=\"col-xl-3\">\r\n                      <h4 i18n><i class=\"far fa-hdd\"></i> Sistema </h4>\r\n                      <div class=\"progress-wrapper progress-info\">\r\n                         <div class=\"progress-label\">\r\n                            <span i18n>Free Disk Space*</span>\r\n                         </div>\r\n                         <div class=\"progress-percentage\">\r\n                            <span>{{ system_info.system_disk_free_space / system_info.system_disk_total_space * 100.0 | number }}%</span>\r\n                         </div>\r\n                      </div>\r\n                      <div class=\"progress\">\r\n                         <div class=\"progress-bar bg-success\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: {{ system_info.system_disk_free_space / system_info.system_disk_total_space * 100.0 }}%;\"></div>\r\n                      </div>\r\n                      <p i18n class=\"card-text\">Boot Time: <strong>{{ system_info.system_boot_time }}</strong></p>\r\n                      <p i18n class=\"card-text\">Disk Total Space: <strong>{{ system_info.system_disk_total_space }} GB</strong></p>\r\n                      <p i18n class=\"card-text\">Disk Free Space: <strong>{{ system_info.system_disk_free_space }} GB</strong></p>\r\n                   </div>\r\n                   <div class=\"col-xl-2\">\r\n                      <h4 i18n><i class=\"fas fa-code\"></i> PHP <span class=\"badge badge-pill badge-info\">{{ system_info.php_version }}</span></h4>\r\n                      <p i18n class=\"card-text\">PHP version: <strong>{{ system_info.php_version }}</strong></p>\r\n                   </div>\r\n                   <div class=\"col-xl-2\">\r\n                      <h4 i18n><i class=\"fas fa-feather-alt\"></i> Apache <span class=\"badge badge-pill badge-info\">{{ system_info.apache_version }}</span></h4>\r\n                      <p i18n class=\"card-text\">Apache version: <strong>{{ system_info.apache_version }}</strong></p>\r\n                      <p i18n class=\"card-text\">Apache uptime: <strong>{{ system_info.apache_uptime }}</strong></p>\r\n                   </div>\r\n                   <div class=\"col-xl-2\">\r\n                      <h4 i18n><i class=\"fas fa-database\"></i> MongoDB <span class=\"badge badge-pill badge-info\">{{ system_info.mongodb_version }}</span></h4>\r\n                      <p i18n class=\"card-text\">MongoDB version: <strong>{{ system_info.mongodb_version }}</strong></p>\r\n                      <p i18n class=\"card-text\">MongoDB uptime: <strong>{{ system_info.mongodb_uptime }}</strong></p>\r\n                   </div>\r\n                   <div class=\"col-xl-2\">\r\n                      <h4 i18n><i class=\"fas fa-database\"></i> MariaDB <span class=\"badge badge-pill badge-info\">{{ system_info.mariadb_version }}</span></h4>\r\n                      <p i18n class=\"card-text\">MariaDB version: <strong>{{ system_info.mariadb_version }}</strong></p>\r\n                      <p i18n class=\"card-text\">MariaDB uptime: <strong>{{ system_info.mariadb_uptime }}</strong></p>\r\n                   </div>\r\n                </div>\r\n             </div>\r\n          </div>\r\n       </div>\r\n    </div>\r\n </div>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/etichette/etichette.component.html":
/*!************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/etichette/etichette.component.html ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"header bg-gradient-info pb-8 pt-5 pt-md-5\"></div>\r\n<!-- Modal DELETE Label -->\r\n<ng-template #content let-modal>\r\n  <div class=\"modal-header\"  data-backdrop=\"static\">\r\n    <h4 i18n class=\"modal-title\" id=\"modal-basic-title\">Conferma eliminazione</h4>\r\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"modal.close()\">\r\n    <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <div class=\"modal-body\">\r\n    <p i18n>Sicuro di voler eliminare l'etichetta <strong>{{ label_name }}</strong>?</p>\r\n  </div>\r\n  <div class=\"modal-footer\">\r\n    <button i18n class=\"btn btn-danger\" (click)=\"deleteLabel()\" type=\"button\">Elimina</button>\r\n    <button i18n type=\"button\" class=\"btn btn-outline-default\" (click)=\"modal.close()\">Anulla</button>\r\n  </div>\r\n</ng-template>\r\n<!-- Modal POST Label - Manual -->\r\n<ng-template #addManual let-modal>\r\n  <div class=\"modal-header\"  data-backdrop=\"static\">\r\n    <h4 i18n class=\"modal-title\" id=\"modal-basic-title\">Richiesta registrazione etichette manuale</h4>\r\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"modal.close()\">\r\n    <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <form>\r\n    <div class=\"modal-body\">\r\n      <div class=\"form-group\">\r\n        <label i18n>Inserisci gli ID delle etichette separate da spazi o virgole.</label>\r\n        <input type=\"text\" class=\"form-control\" [(ngModel)]='stringaID' name='stringaID' [value]='stringaID' id=\"stringaID\" placeholder=\"labelID0, labelID1, ...\">\r\n        <div *ngIf=\"valid_label_id\">\r\n          <small i18n>Inserisci almeno un ID!</small>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"modal-footer\">\r\n      <button i18n class=\"btn btn-primary\" (click)=\"postManual(stringaID)\" type=\"submit\">Registra</button>\r\n      <button i18n type=\"button\" class=\"btn btn-outline-default\" (click)=\"modal.close()\">Anulla</button>\r\n    </div>\r\n  </form>\r\n</ng-template>\r\n<!-- Modal POST Label - File  (WiP) -->\r\n<ng-template #addFile let-modal>\r\n  <div class=\"modal-header\" data-backdrop=\"static\">\r\n    <h4 i18n class=\"modal-title\" id=\"modal-basic-title\">Richiesta registrazione etichette con file</h4>\r\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"modal.close()\">\r\n    <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <form>\r\n    <div class=\"modal-body\">\r\n      <div class=\"form-group\">\r\n        <label i18n>Scegli il file da caricare:</label>\r\n        <div class=\"file-field md-form\">\r\n          <div mdbBtn color=\"primary\" size=\"sm\" class=\"waves-light\" mdbWavesEffect>\r\n            <input type=\"file\" mdbFileSelect (uploadOutput)=\"onUploadOutput($event)\" [(ngModel)]='filePath' name='filePath' id=\"filePath\">\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"modal-footer\">\r\n      <button i18n class=\"btn btn-primary\" (click)=\"postFile(stringaID)\" type=\"submit\" [disabled]=\"true\">Carica</button>\r\n      <button i18n type=\"button\" class=\"btn btn-outline-default\" (click)=\"modal.close()\">Anulla</button>\r\n    </div>\r\n  </form>\r\n</ng-template>\r\n<!-- Contenuto della pagina -->\r\n<div class=\"container-fluid mt--7\">\r\n  <!-- Alerts -->\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <!-- Alert Conferma Eliminazione -->\r\n      <ngb-alert *ngIf=\"successMessage\" type=\"danger\" (close)=\"successMessage = ''\">{{ successMessage }}</ngb-alert>\r\n      <!-- Alert Conferma Aggiunta -->\r\n      <ngb-alert *ngIf=\"successMessageAdd\" type=\"success\" (close)=\"successMessageAdd = ''\">{{ successMessageAdd }}</ngb-alert>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <div class=\"col\">\r\n      <div class=\"card shadow\">\r\n        <!-- Header -->\r\n        <div class=\"card-header bg-transparent\">\r\n          <div class=\"row\">\r\n            <!-- Titolo -->\r\n            <div class=\"col\">\r\n              <h2 i18n class=\"mb-0\">Lista Etichette</h2>\r\n            </div>\r\n            <!-- Preview Etichetta Attiva -->\r\n            <div class=\"col text-center\">\r\n              <div *ngIf=\"showPrev\">\r\n                <i class='fa fa-2x fa-picture-o'></i> <img style='max-width: 100%;max-height: 80%;' src='data:image/png;base64,{{ prev }}'/>\r\n              </div>\r\n            </div>\r\n            <!-- Registra Etichetta -->\r\n            <div class=\"col text-right\">\r\n              <div ngbDropdown class=\"d-inline-block\">\r\n                <button class=\"btn btn-outline-primary\" id=\"dropdownBasic1\" ngbDropdownToggle>\r\n                <i i18n class=\"fas fa-caret-down\"></i> Registra Etichetta\r\n                </button>\r\n                <div ngbDropdownMenu aria-labelledby=\"dropdownBasic1\">\r\n                  <button i18n ngbDropdownItem (click)=\"openManual(addManual)\">Manualmente</button>\r\n                  <button i18n ngbDropdownItem (click)=\"openManual(addFile)\" disabled=\"true\">Da file</button>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- Contenuto -->\r\n        <div class=\"card-body\">\r\n          <!-- Tabella Etichette -->\r\n          <div class=\"table-responsive\" id=\"stampare\">\r\n            <table class=\"display table table-striped align-items-center table-flush\" datatable [dtOptions]=\"dtOptions\" [dtTrigger]=\"dtTrigger\">\r\n            <thead class=\"thead-light\">\r\n              <tr>\r\n                <th i18n scope=\"col\">ID Etichetta</th>\r\n                <th i18n scope=\"col\">Tipo</th>\r\n                <th i18n scope=\"col\">Power Status</th>\r\n                <th i18n scope=\"col\">Connection Status</th>\r\n                <th i18n scope=\"col\">Data Revisione</th>\r\n                <th i18n scope=\"col\">ID Access Point</th>\r\n                <th></th>\r\n              </tr>\r\n            </thead>\r\n            <tbody>\r\n              <tr *ngFor=\"let label of labels$\">\r\n                <th>\r\n                  <a [routerLink]=\"view-label\" (click)=\"viewLabel(label.LabelId)\">\r\n                  {{ label.LabelId }}\r\n                  </a>\r\n                </th>\r\n                <td>{{ label.Type }}</td>\r\n                <td *ngIf=\" label.PowerStatus > 20; else elseBlock\">\r\n                  <div class=\"progress\" style=\"height: 30px;\">\r\n                    <div class=\"progress-bar bg-success\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: {{ 1 * label.PowerStatus }}%;\">{{ label.PowerStatus }}%</div>\r\n                  </div>\r\n                </td>\r\n                <ng-template #elseBlock>\r\n                  <td>\r\n                    <div class=\"progress\" style=\"height: 30px;\">\r\n                      <div class=\"progress-bar bg-danger\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: {{ 1 * label.PowerStatus }}%;\">{{ label.PowerStatus }}%</div>\r\n                    </div>\r\n                  </td>\r\n                </ng-template>\r\n                <td>\r\n                  <i class=\"fas fa-power-off\"></i>\r\n                  <strong> {{ label.ConnectionStatus }}</strong>\r\n                </td>\r\n                <td>{{ label.UpdatedAt }}</td>\r\n                <td>{{ label.AccessPointId }}</td>\r\n                <td>\r\n                  <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Tools\">\r\n                    <button type=\"button\" class=\"btn btn-secondary\" (click)=\"openPreview(label.LabelId)\">\r\n                    <i class=\"fas fa-eye\"></i>\r\n                    </button>\r\n                    <button type=\"button\" class=\"btn btn-secondary\" (click)=\"putDeactivateMatch(label.LabelId)\">\r\n                    <i class=\"fas fa-unlink\"></i>\r\n                    </button>\r\n                    <button type=\"button\" class=\"btn btn-danger\" (click)=\"open(content, label.LabelId)\">\r\n                    <i class=\"fas fa-trash\"></i>\r\n                    </button>\r\n                  </div>\r\n                </td>\r\n              </tr>\r\n            </tbody>\r\n            </table>   \r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/location/location.component.html":
/*!**********************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/location/location.component.html ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"header bg-gradient-info pb-8 pt-5 pt-md-5\"></div>\r\n<!-- Modal DELETE Location -->\r\n<ng-template #content let-modal>\r\n  <div class=\"modal-header\"  data-backdrop=\"static\">\r\n    <h4 i18n class=\"modal-title\" id=\"modal-basic-title\">Conferma eliminazione</h4>\r\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"modal.close()\">\r\n    <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <div class=\"modal-body\">\r\n    <p i18n>Sicuro di voler eliminare la Location <strong>{{ alias }}</strong>?</p>\r\n  </div>\r\n  <div class=\"modal-footer\">\r\n    <button i18n class=\"btn btn-danger\" (click)=\"deleteLocation()\" type=\"button\">Elimina</button>\r\n    <button i18n type=\"button\" class=\"btn btn-outline-default\" (click)=\"modal.close()\">Anulla</button>\r\n  </div>\r\n</ng-template>\r\n<!-- Contenuto della pagina -->\r\n<div class=\"container-fluid mt--7\" id=\"stampare\">\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <!-- Alert Conferma Eliminazione -->\r\n      <ngb-alert *ngIf=\"deleteMessage\" type=\"danger\" (close)=\"deleteMessage = ''\">{{ deleteMessage }}</ngb-alert>\r\n      <!-- Alert Conferma Aggiunta -->\r\n      <ngb-alert *ngIf=\"successMessage\" type=\"success\" (close)=\"successMessage = ''\">{{ successMessage }}</ngb-alert>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\">\r\n    <!-- Corsie -->\r\n    <div class=\"col-xl-4\">\r\n      <div class=\"card shadow\">\r\n        <!-- Header -->\r\n        <div class=\"card-header bg-transparent\">\r\n          <div class=\"row align-items-center\">\r\n            <div class=\"col\">\r\n              <h6 i18n class=\"text-uppercase text-muted ls-1 mb-1\">Corsie</h6>\r\n              <h2 i18n class=\"mb-0\">Elenco delle corsie</h2>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- Body -->\r\n        <div class=\"card-body\">\r\n          <!-- Aggiungi Corsia -->\r\n          <div class=\"input-group mb-3\">\r\n            <input type=\"text\" class=\"form-control\" #nomeCorsia name=\"nomeCorsia\" placeholder=\"Aggiungi corsia\" aria-label=\"Recipient's username\" aria-describedby=\"button-addon2\">\r\n            <div class=\"input-group-append\">\r\n              <button class=\"btn btn-inline-primary\" type=\"submit\" id=\"button-addon2\" (click)=\"postCorsia(nomeCorsia.value, '1')\" for='nomeCorsia'>\r\n              <i class=\"ni ni-fat-add\"></i>\r\n              </button>\r\n            </div>\r\n          </div>\r\n          <!-- Elenco Corsie -->\r\n          <table class=\"table align-items-center table-flush\">\r\n            <thead class=\"thead-light\">\r\n              <tr>\r\n                <th i18n scope=\"col\">Nome</th>\r\n                <th scope=\"col\"></th>\r\n              </tr>\r\n            </thead>\r\n            <tbody>\r\n              <tr *ngFor=\"let corsia of locations$\">\r\n                <ng-template [ngIf]=\"corsia.location_type.id == 1 && corsia.is_active\">\r\n                  <th>{{ corsia.name }}</th>\r\n                  <td align=\"right\">\r\n                    <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Tools\">\r\n                      <button type=\"button\" class=\"btn btn-danger\" (click)=\"open(content, corsia.id, corsia.name)\">\r\n                      <i class=\"fas fa-trash\"></i>\r\n                      </button>\r\n                    </div>\r\n                  </td>\r\n                </ng-template>\r\n              </tr>\r\n            </tbody>\r\n          </table>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <!-- Posizioni -->\r\n    <div class=\"col-xl-4\">\r\n      <div class=\"card shadow\">\r\n        <!-- Header -->\r\n        <div class=\"card-header bg-transparent\">\r\n          <div class=\"row align-items-center\">\r\n            <div class=\"col\">\r\n              <h6 i18n class=\"text-uppercase text-muted ls-1 mb-1\">Posizione</h6>\r\n              <h2 i18n class=\"mb-0\">Elenco delle posizioni</h2>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- Body -->\r\n        <div class=\"card-body\">\r\n          <!-- Aggiungi Posizione -->\r\n          <div class=\"input-group mb-3\">\r\n            <input type=\"text\" class=\"form-control\" #nomePosizione name=\"nomePosizione\" placeholder=\"Aggiungi posizione\" aria-label=\"Recipient's username\" aria-describedby=\"button-addon2\">\r\n            <div class=\"input-group-append\">\r\n              <button class=\"btn btn-inline-primary\" type=\"submit\" id=\"button-addon2\" (click)=\"postCorsia(nomePosizione.value, '2')\" for='nomePosizione'>\r\n              <i class=\"ni ni-fat-add\"></i>\r\n              </button>\r\n            </div>\r\n          </div>\r\n          <!-- Elenco Posizioni -->\r\n          <table class=\"table align-items-center table-flush\">\r\n            <thead class=\"thead-light\">\r\n              <tr>\r\n                <th i18n scope=\"col\">Nome</th>\r\n                <th scope=\"col\"></th>\r\n              </tr>\r\n            </thead>\r\n            <tbody>\r\n              <tr *ngFor=\"let corsia of locations$\">\r\n                <ng-template [ngIf]=\"corsia.location_type.id == 2 && corsia.is_active\">\r\n                  <th>{{ corsia.name }}</th>\r\n                  <td align=\"right\">\r\n                    <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Tools\">\r\n                      <button type=\"button\" class=\"btn btn-danger\" (click)=\"open(content, corsia.id, corsia.name)\">\r\n                      <i class=\"fas fa-trash\"></i>\r\n                      </button>\r\n                    </div>\r\n                  </td>\r\n                </ng-template>\r\n              </tr>\r\n            </tbody>\r\n          </table>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <!-- Ripiani -->\r\n    <div class=\"col-xl-4\">\r\n      <div class=\"card shadow\">\r\n        <!-- Header -->\r\n        <div class=\"card-header bg-transparent\">\r\n          <div class=\"row align-items-center\">\r\n            <div class=\"col\">\r\n              <h6 i18n class=\"text-uppercase text-muted ls-1 mb-1\">Ripiano</h6>\r\n              <h2 i18n class=\"mb-0\">Elenco dei ripiani</h2>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- Body -->\r\n        <div class=\"card-body\">\r\n          <!-- Aggiungi Ripiano -->\r\n          <div class=\"input-group mb-3\">\r\n            <input type=\"text\" class=\"form-control\" #nomeRipiano name=\"nomeRipiano\" placeholder=\"Aggiungi ripiano\" aria-label=\"Recipient's username\" aria-describedby=\"button-addon2\">\r\n            <div class=\"input-group-append\">\r\n              <button class=\"btn btn-inline-primary\" type=\"submit\" id=\"button-addon2\" (click)=\"postCorsia(nomeRipiano.value, '3')\" for='nomeRipiano'>\r\n              <i class=\"ni ni-fat-add\"></i>\r\n              </button>\r\n            </div>\r\n          </div>\r\n          <!-- Elenco Ripiani -->\r\n          <table class=\"table align-items-center table-flush\">\r\n            <thead class=\"thead-light\">\r\n              <tr>\r\n                <th i18n scope=\"col\">Nome</th>\r\n                <th scope=\"col\"></th>\r\n              </tr>\r\n            </thead>\r\n            <tbody>\r\n              <tr *ngFor=\"let corsia of locations$\">\r\n                <ng-template [ngIf]=\"corsia.location_type.id == 3 && corsia.is_active\">\r\n                  <th>{{ corsia.name }}</th>\r\n                  <td align=\"right\">\r\n                    <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Tools\">\r\n                      <button type=\"button\" class=\"btn btn-danger\" (click)=\"open(content, corsia.id, corsia.name)\">\r\n                      <i class=\"fas fa-trash\"></i>\r\n                      </button>\r\n                    </div>\r\n                  </td>\r\n                </ng-template>\r\n              </tr>\r\n            </tbody>\r\n          </table>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/smartmatch/smartmatch.component.html":
/*!**************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/smartmatch/smartmatch.component.html ***!
  \**************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"header bg-gradient-info pb-8 pt-5 pt-md-5\"></div>\r\n<!-- Modal DELETE Match -->\r\n<ng-template #content let-modal>\r\n  <div class=\"modal-header\"  data-backdrop=\"static\">\r\n    <h4 i18n class=\"modal-title\" id=\"modal-basic-title\">Conferma eliminazione</h4>\r\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"modal.close()\">\r\n    <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n  </div>\r\n  <div class=\"modal-body\">\r\n    <p i18n>Sicuro di voler eliminare lo SmartMatch selezionato?</p>\r\n  </div>\r\n  <div class=\"modal-footer\">\r\n    <button i18n class=\"btn btn-danger\" (click)=\"deleteItem()\" type=\"button\">Elimina</button>\r\n    <button i18n type=\"button\" class=\"btn btn-outline-default\" (click)=\"modal.close()\">Anulla</button>\r\n  </div>\r\n</ng-template>\r\n<!-- Contenuto della pagina -->\r\n<div class=\"container-fluid mt--7\">\r\n  <!-- Aggiungi Match -->\r\n  <div class=\"row\">\r\n    <div class=\"col\">\r\n      <div class=\"card shadow\">\r\n        <div class=\"card-header bg-transparent\">\r\n          <h2 i18n class=\"mb-0\">Aggiungi Match</h2>\r\n        </div>\r\n        <div class=\"card-body\">\r\n          <!-- Form -->\r\n          <form>\r\n            <!-- Prima Riga -->\r\n            <div class=\"row\">\r\n              <!-- Tipo Articolo -->\r\n              <div class=\"col-md-6\">\r\n                <div class=\"form-group\">\r\n                  <label i18n for=\"itemType\">Tipo Articolo</label>\r\n                  <select [(ngModel)]=\"selectedOption\" #itemType class=\"form-control\" name=\"itemType\" id=\"itemType\" (click)=\"getItemTypeTemplate($event.target.value)\">\r\n                  <option *ngFor=\"let item of varItem\" [value]=\"item.id\">{{ item.name }}</option>\r\n                  </select>\r\n                </div>\r\n              </div>\r\n              <!-- Tipo Barcode -->\r\n              <div class=\"col-md-6\">\r\n                <div class=\"form-group\">\r\n                  <label i18n>Tipo Barcode</label>\r\n                  <select [(ngModel)]=\"selectedOption3\" class=\"form-control\" name=\"barcodeS\" id=\"barcode\" disable=\"false\">\r\n                  <option i18n #barcode>ITEM BARCODE</option>\r\n                  <option i18n #ean13>EAN 13</option>\r\n                  <option i18n #decimale>MINSAN decimale</option>\r\n                  <option i18n #alfa>MINSAN alfa</option>\r\n                  </select>\r\n                </div>\r\n              </div>\r\n            </div>\r\n            <!-- Seconda Riga -->\r\n            <div class=\"row\">\r\n              <!-- Item Barcode -->\r\n              <div class=\"col-md-6\">\r\n                <div class=\"form-group\">\r\n                  <label i18n>Item Barcode</label>\r\n                  <div [className]=\"itemValid == true ? 'form-group input-group' : 'form-group input-group'\">\r\n                    <input type=\"text\" [className]=\"itemValid == true ? 'form-control is-valid' : 'form-control is-invalid'\" #item_barcode id=\"item_barcode\" placeholder=\"item_barcode\" (change)=\"ngOnChangesItem(item_barcode.value, itemType.value)\">\r\n                    <div class=\"input-group-append\">\r\n                      <button class=\"btn btn-outline-default\" type=\"button\" (click)=\"moreItem()\">+</button>\r\n                    </div>\r\n                  </div>\r\n                  <div *ngIf=\"itemValid\">\r\n                    <option i18n class=\"form-control\">ID: {{ testItem }}</option>\r\n                    <option i18n class=\"form-control\">Nome: {{ testItemName }}</option>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <!-- Label ID -->\r\n              <div class=\"col-md-6\">\r\n                <div class=\"form-group\">\r\n                  <label i18n>ID Etichetta</label>\r\n                  <div [className]=\"labelValid == true ? 'form-group has-success' : 'form-group'\">\r\n                    <input type=\"text\" [className]=\"labelValid == true ? 'form-control is-valid' : 'form-control is-invalid'\" #labelID id=\"labelID\" placeholder=\"id_etichetta\" (change)=\"ngOnChanges(labelID.value)\">\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n            <!-- Terza Riga -->\r\n            <div class=\"row\">\r\n              <!-- Template -->\r\n              <div class=\"col-md-6\">\r\n                <div class=\"form-group\">\r\n                  <label i18n for=\"template\">Template</label>\r\n                  <select class=\"form-control\" #template name=\"template\" id=\"template\">\r\n                  <option *ngFor=\"let template of templates\" [value]=\"template.title\">{{ template.title }}</option>\r\n                  </select>\r\n                </div>\r\n              </div>\r\n              <!-- Decorators -->\r\n              <div class=\"col-md-6\">\r\n                <div class=\"form-group\">\r\n                  <label>Decorators</label>\r\n                  <select [(ngModel)]=\"selectedDecoration\" class=\"form-control\" #decorator name=\"decorator\" id=\"decorator\">\r\n                  <option [value]=\"0\"> </option>\r\n                  <option i18n [value]=\"1\">Ruota di 90 gradi</option>\r\n                  <option i18n [value]=\"2\">Ruota di 180 gradi</option>\r\n                  <option i18n [value]=\"3\">Ruota di 270 gradi</option>\r\n                  </select>\r\n                </div>\r\n              </div>\r\n            </div>\r\n            <!-- Quarta riga Riga -->\r\n            <div class=\"row\">\r\n              <div class=\"col-md-auto\">\r\n                <div class=\"form-group\">\r\n                  <label i18n>Altre opzioni:</label>\r\n                  <div class=\"custom-control custom-checkbox mb-3\">\r\n                    <input class=\"custom-control-input\" #checkActive id=\"checkActive\" type=\"checkbox\" name=\"checkActive\" [(ngModel)]=\"checkActiveC\" data-md-icheck>\r\n                    <label i18n class=\"custom-control-label\" for=\"checkActive\">Is Active</label>\r\n                  </div>\r\n                  <div class=\"custom-control custom-checkbox mb-3\">\r\n                    <input class=\"custom-control-input\" #checkPromo id=\"checkPromo\" type=\"checkbox\" name=\"checkPromo\" [(ngModel)]=\"checkPromoC\" data-md-icheck>\r\n                    <label i18n class=\"custom-control-label\" for=\"checkPromo\">Promo</label>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n              <div class=\"col text-right\">\r\n                <br><br><br>\r\n                <button i18n type=\"button\" class=\"btn btn-primary\" (click)=\"addSm(template.value, labelID.value, decorator.value)\">Aggiungi</button>\r\n              </div>\r\n            </div>\r\n            <br>\r\n            <!-- +More Items+ -->\r\n            <div *ngFor=\"let in of counter(nrItems); let i = index\">\r\n              <label i18n>Item Barcode</label>\r\n              <div [className]=\"itemArray[i] != null ? 'form-group input-group' : 'form-group input-group'\">\r\n                <input type=\"text\" [className]=\"itemArray[i] != null ? 'form-control is-valid' : 'form-control is-invalid'\" #item_barcode_{{i}} id=\"item_barcode_{{ i }}\" placeholder=\"item_barcode\" (change)=\"ngOnChangesMoreItem(itemType.value, i)\">\r\n              </div>\r\n              <div *ngIf=\"itemArray[i] != null\">\r\n                <!-- ngIf* -- > return != null -->\r\n                <option i18n class=\"form-control\">ID: {{ itemArray[i] }}</option>\r\n                <!-- <option i18n class=\"form-control\">Nome: {{ testItemName }}</option> -->\r\n              </div>\r\n              <br>\r\n            </div>\r\n          </form>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <br>\r\n  <!-- Alerts -->\r\n  <div class=\"row\">\r\n    <div class=\"col-md-12\">\r\n      <!-- Alert Conferma Eliminazione -->\r\n      <ngb-alert *ngIf=\"successMessage\" type=\"danger\" (close)=\"successMessage = ''\">{{ successMessage }}</ngb-alert>\r\n      <!-- Alert Conferma Aggiunta -->\r\n      <ngb-alert *ngIf=\"successMessageAdd\" type=\"success\" (close)=\"successMessageAdd = ''\">{{ successMessageAdd }}</ngb-alert>\r\n      <!-- Alert Aggiunta Fallita -->\r\n      <ngb-alert *ngIf=\"failedMessageAdd\" type=\"danger\" (close)=\"failedMessageAdd = ''\">{{ failedMessageAdd }}</ngb-alert>\r\n    </div>\r\n  </div>\r\n  <br>\r\n  <!-- Tabella Match -->\r\n  <div class=\"row\">\r\n    <div class=\"col\">\r\n      <div class=\"card shadow\">\r\n        <!-- Header -->\r\n        <div class=\"card-header bg-transparent\">\r\n          <div class=\"row\">\r\n            <div class=\"col\">\r\n              <h2 i18n class=\"mb-0\">Matches Online</h2>\r\n            </div>\r\n            <div class=\"col text-right\">\r\n              <div *ngIf=\"showPrev\">\r\n                <i class='fa fa-2x fa-picture-o'></i> <img style='max-width: 100%;max-height: 80%;' src='data:image/png;base64,{{ prev }}'/>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- Contenuto -->\r\n        <div class=\"card-body\">\r\n          <!-- Tabella Smartmatches -->\r\n          <div class=\"table-responsive\" id=\"stampare\">\r\n            <table class=\"display table align-items-center table-flush\" datatable [dtOptions]=\"dtOptions\" [dtTrigger]=\"dtTrigger\">\r\n            <thead class=\"thead-light\">\r\n              <tr>\r\n                <th i18n scope=\"col\">Template Name</th>\r\n                <th i18n scope=\"col\">Label ID</th>\r\n                <th i18n scope=\"col\">Items</th>\r\n                <th i18n scope=\"col\">Is Active</th>\r\n                <th i18n scope=\"col\">Bypass Promo</th>\r\n                <th i18n scope=\"col\"></th>\r\n              </tr>\r\n            </thead>\r\n            <tbody>\r\n              <tr *ngFor=\"let match of matchs$\">\r\n                <td *ngIf=\"match.is_active == true\">{{ match.template_name }}</td>\r\n                <td *ngIf=\"match.is_active == true\">{{ match.label_id }}</td>\r\n                <td *ngIf=\"match.is_active == true\">{{ match.items }}</td>\r\n                <td *ngIf=\"match.is_active == true\">\r\n                  <span i18n class=\"badge badge-success\">SI</span>\r\n                </td>\r\n                <td *ngIf=\"match.is_active == true\">\r\n                  <div *ngIf=\"match.bypass_promo == true; else elseBlock\"><span i18n class=\"badge badge-success\">SI</span></div>\r\n                  <ng-template #elseBlock><span i18n class=\"badge badge-danger\">NO</span></ng-template>\r\n                </td>\r\n                <td *ngIf=\"match.is_active == true\">\r\n                  <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Tools\">\r\n                    <button type=\"button\" class=\"btn btn-secondary\" (click)=\"openPreview(match.id)\">\r\n                    <i class=\"fas fa-eye\"></i>\r\n                    </button>\r\n                    <button type=\"button\" class=\"btn btn-danger\" (click)=\"open(content, match.id, match.id)\">\r\n                    <i class=\"fas fa-trash\"></i>\r\n                    </button>\r\n                  </div>\r\n                </td>\r\n              </tr>\r\n            </tbody>\r\n            </table>                        \r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/visualizzarticolo/visualizzarticolo.component.html":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/visualizzarticolo/visualizzarticolo.component.html ***!
  \****************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"header bg-gradient-info pb-8 pt-5 pt-md-5\"></div>\r\n<!-- Contenuto della pagina -->\r\n<div class=\"container-fluid mt--7\" id=\"stampare\">\r\n  <div class=\"row\">\r\n    <div class=\"col\">\r\n      <div class=\"card shadow\">\r\n        <!-- Header -->\r\n        <div class=\"card-header bg-transparent\">\r\n          <h2 i18n class=\"mb-0\">Dettagli Articolo {{ nomeArticolo }}</h2>\r\n        </div>\r\n        <!-- Contenuto -->\r\n        <form (ngSubmit)=\"updateItem()\">\r\n          <div class=\"card-body\">\r\n            <div *ngFor=\"let par of parametri$\" class=\"form-group\">\r\n              <label for=\"{{ valori$[par] }}\">\r\n              {{ par }}\r\n              </label>\r\n              <br>\r\n              <input class=\"form-control form-control-alternative\" #{{par}} id=\"{{ par }}\" type=\"text\" value=\"{{ valori$[par] }}\">\r\n            </div>\r\n            <button i18n type=\"submit\" class=\"btn btn-primary btn-lg btn-block\">Salva</button>\r\n          </div>\r\n        </form>\r\n        <!--\r\n          paramtri$[index] - -> valori$[index]\r\n          NomeCampo - -> valore attuale (ovvero modificato)\r\n          -->\r\n        <!-- Header -->\r\n        <div class=\"card-header bg-transparent\">\r\n          <div class=\"row\">\r\n            <div class=\"col\">\r\n              <h3 i18n class=\"mb-0\">Matches Associati</h3>\r\n            </div>\r\n            <!-- Preview Etichetta Attiva -->\r\n            <div class=\"col text-right\">\r\n              <div *ngIf=\"showPrev\">\r\n                <i class='fa fa-2x fa-picture-o'></i> <img style='max-width: 100%; max-height: 80%;' src='data:image/png;base64,{{ prev }}'/>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <!-- Contenuto: Matchs -->\r\n        <div class=\"card-body table-responsive\">\r\n          <table class=\"display table align-items-center table-flush\">\r\n            <thead>\r\n              <tr>\r\n                <th i18n>Template Name</th>\r\n                <th i18n>Label ID</th>\r\n                <th i18n>Items</th>\r\n                <th i18n>Is Active</th>\r\n                <th i18n>Bypass Promo</th>\r\n                <th i18n>Match e Immagini</th>\r\n              </tr>\r\n            </thead>\r\n            <tbody>\r\n              <tr *ngFor=\"let match of matchs$\">\r\n                <td>{{ match.template_name }}</td>\r\n                <td>{{ match.label_id }}</td>\r\n                <td>{{ match.items }}</td>\r\n                <td>\r\n                  <div *ngIf=\"match.is_active == true; else elseBlockActive\"><span class=\"badge badge-success\">SI</span></div>\r\n                  <ng-template #elseBlockActive>\r\n                    <span i18n class=\"badge badge-danger\">NO</span>&nbsp;\r\n                    <button i18n class=\"btn btn-success btn-sm\" (click)=\"activateLabel(match.id)\" [disabled]=\"true\">\r\n                    Attiva\r\n                    </button>\r\n                  </ng-template>\r\n                </td>\r\n                <td>\r\n                  <div i18n *ngIf=\"match.bypass_promo == true; else elseBlock\"><span class=\"badge badge-success\">SI</span></div>\r\n                  <ng-template #elseBlock><span i18n class=\"badge badge-danger\">NO</span></ng-template>\r\n                </td>\r\n                <td>\r\n                  <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Tools\">\r\n                    <button type=\"button\" class=\"btn btn-secondary\" (click)=\"openPreview(match.id)\">\r\n                    <i class=\"fas fa-eye\"></i>\r\n                    </button>\r\n                    <button type=\"button\" class=\"btn btn-danger\" (click)=\"open()\">\r\n                    <i class=\"fas fa-trash\"></i>\r\n                    </button>\r\n                  </div>\r\n                </td>\r\n              </tr>\r\n            </tbody>\r\n          </table>\r\n          <br><br>\r\n          <!-- Bottoni -->\r\n          <button i18n type=\"button\" class=\"btn btn-secondary btn-lg btn-block\" (click)=\"goBack()\">Annulla</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>");

/***/ }),

/***/ "./src/app/layouts/admin-layout/admin-layout.module.ts":
/*!*************************************************************!*\
  !*** ./src/app/layouts/admin-layout/admin-layout.module.ts ***!
  \*************************************************************/
/*! exports provided: AdminLayoutModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminLayoutModule", function() { return AdminLayoutModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm5/http.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm5/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm5/forms.js");
/* harmony import */ var ngx_clipboard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-clipboard */ "./node_modules/ngx-clipboard/__ivy_ngcc__/fesm5/ngx-clipboard.js");
/* harmony import */ var _admin_layout_routing__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./admin-layout.routing */ "./src/app/layouts/admin-layout/admin-layout.routing.ts");
/* harmony import */ var _pages_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../pages/dashboard/dashboard.component */ "./src/app/pages/dashboard/dashboard.component.ts");
/* harmony import */ var _pages_smartmatch_smartmatch_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../pages/smartmatch/smartmatch.component */ "./src/app/pages/smartmatch/smartmatch.component.ts");
/* harmony import */ var _pages_articoli_articoli_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../pages/articoli/articoli.component */ "./src/app/pages/articoli/articoli.component.ts");
/* harmony import */ var _pages_etichette_etichette_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../pages/etichette/etichette.component */ "./src/app/pages/etichette/etichette.component.ts");
/* harmony import */ var _pages_location_location_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../pages/location/location.component */ "./src/app/pages/location/location.component.ts");
/* harmony import */ var _pages_visualizzarticolo_visualizzarticolo_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../pages/visualizzarticolo/visualizzarticolo.component */ "./src/app/pages/visualizzarticolo/visualizzarticolo.component.ts");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/__ivy_ngcc__/fesm5/ng-bootstrap.js");
/* harmony import */ var angular_datatables__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! angular-datatables */ "./node_modules/angular-datatables/__ivy_ngcc__/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};














// import { ToastrModule } from 'ngx-toastr';

var AdminLayoutModule = /** @class */ (function () {
    function AdminLayoutModule() {
    }
    AdminLayoutModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(_admin_layout_routing__WEBPACK_IMPORTED_MODULE_6__["AdminLayoutRoutes"]),
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClientModule"],
                _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_13__["NgbModule"],
                ngx_clipboard__WEBPACK_IMPORTED_MODULE_5__["ClipboardModule"],
                angular_datatables__WEBPACK_IMPORTED_MODULE_14__["DataTablesModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"]
            ],
            declarations: [
                _pages_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_7__["DashboardComponent"],
                _pages_etichette_etichette_component__WEBPACK_IMPORTED_MODULE_10__["EtichetteComponent"],
                _pages_location_location_component__WEBPACK_IMPORTED_MODULE_11__["LocationComponent"],
                _pages_smartmatch_smartmatch_component__WEBPACK_IMPORTED_MODULE_8__["SmartmatchComponent"],
                _pages_articoli_articoli_component__WEBPACK_IMPORTED_MODULE_9__["ArticoliComponent"],
                _pages_visualizzarticolo_visualizzarticolo_component__WEBPACK_IMPORTED_MODULE_12__["VisualizzarticoloComponent"]
            ]
        })
    ], AdminLayoutModule);
    return AdminLayoutModule;
}());



/***/ }),

/***/ "./src/app/layouts/admin-layout/admin-layout.routing.ts":
/*!**************************************************************!*\
  !*** ./src/app/layouts/admin-layout/admin-layout.routing.ts ***!
  \**************************************************************/
/*! exports provided: AdminLayoutRoutes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminLayoutRoutes", function() { return AdminLayoutRoutes; });
/* harmony import */ var _pages_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pages/dashboard/dashboard.component */ "./src/app/pages/dashboard/dashboard.component.ts");
/* harmony import */ var _pages_smartmatch_smartmatch_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pages/smartmatch/smartmatch.component */ "./src/app/pages/smartmatch/smartmatch.component.ts");
/* harmony import */ var _pages_articoli_articoli_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pages/articoli/articoli.component */ "./src/app/pages/articoli/articoli.component.ts");
/* harmony import */ var _pages_etichette_etichette_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pages/etichette/etichette.component */ "./src/app/pages/etichette/etichette.component.ts");
/* harmony import */ var _pages_location_location_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../pages/location/location.component */ "./src/app/pages/location/location.component.ts");
/* harmony import */ var _pages_visualizzarticolo_visualizzarticolo_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../pages/visualizzarticolo/visualizzarticolo.component */ "./src/app/pages/visualizzarticolo/visualizzarticolo.component.ts");
/* harmony import */ var _pages_viewlabel_viewlabel_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../pages/viewlabel/viewlabel.component */ "./src/app/pages/viewlabel/viewlabel.component.ts");
/* harmony import */ var _pages_crearticolo_crearticolo_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../pages/crearticolo/crearticolo.component */ "./src/app/pages/crearticolo/crearticolo.component.ts");
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};








var AdminLayoutRoutes = [
    { path: 'dashboard', component: _pages_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_0__["DashboardComponent"] },
    { path: 'etichette', component: _pages_etichette_etichette_component__WEBPACK_IMPORTED_MODULE_3__["EtichetteComponent"] },
    { path: 'location', component: _pages_location_location_component__WEBPACK_IMPORTED_MODULE_4__["LocationComponent"] },
    { path: 'smartmatch', component: _pages_smartmatch_smartmatch_component__WEBPACK_IMPORTED_MODULE_1__["SmartmatchComponent"] },
    { path: 'articoli', component: _pages_articoli_articoli_component__WEBPACK_IMPORTED_MODULE_2__["ArticoliComponent"] },
    { path: 'view-item', component: _pages_visualizzarticolo_visualizzarticolo_component__WEBPACK_IMPORTED_MODULE_5__["VisualizzarticoloComponent"] },
    { path: 'view-label', component: _pages_viewlabel_viewlabel_component__WEBPACK_IMPORTED_MODULE_6__["ViewlabelComponent"] },
    { path: 'crea-item', component: _pages_crearticolo_crearticolo_component__WEBPACK_IMPORTED_MODULE_7__["CrearticoloComponent"] }
];


/***/ }),

/***/ "./src/app/pages/articoli/articoli.component.scss":
/*!********************************************************!*\
  !*** ./src/app/pages/articoli/articoli.component.scss ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2FydGljb2xpL2FydGljb2xpLmNvbXBvbmVudC5zY3NzIn0= */");

/***/ }),

/***/ "./src/app/pages/articoli/articoli.component.ts":
/*!******************************************************!*\
  !*** ./src/app/pages/articoli/articoli.component.ts ***!
  \******************************************************/
/*! exports provided: ArticoliComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArticoliComponent", function() { return ArticoliComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/__ivy_ngcc__/fesm5/ng-bootstrap.js");
/* harmony import */ var angular_datatables__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! angular-datatables */ "./node_modules/angular-datatables/__ivy_ngcc__/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm5/router.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};








var del_item_id;
// Componente principale
var ArticoliComponent = /** @class */ (function () {
    function ArticoliComponent(httpClient, modalService, config, router) {
        this.httpClient = httpClient;
        this.modalService = modalService;
        this.router = router;
        this.items$ = [];
        this.dtOptions = {};
        this.dtTrigger = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        // Alert e Modal - Delete
        this._success = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.staticAlertClosed = false;
        this.successMessage = '';
        // Multiple Delete
        this.index = 0;
        this.indexDel = 0;
        this.delItems$ = [];
        this.toZero = true;
        config.backdrop = 'static';
        config.keyboard = false;
    }
    // Init
    ArticoliComponent.prototype.ngOnInit = function () {
        // Controllo l'accesso
        if (localStorage.getItem('apikey') != null) {
            // DataTables Options
            this.dtOptions = {
                pagingType: 'full_numbers',
                pageLength: 10,
                processing: true,
                order: [],
                select: {
                    style: 'multi'
                },
                retrieve: true,
            };
            // Tabella Articoli
            this.getItems();
            // Crea Nuovo Articolo
            this.getItemType();
        }
        else {
            this.router.navigate(['../login']);
        }
    };
    // Destory
    ArticoliComponent.prototype.ngOnDestroy = function () {
        this.dtTrigger.unsubscribe();
    };
    // API Articoli
    ArticoliComponent.prototype.getItems = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_7__["environment"].URL_ROOT + '/item/concrete?recordsPerPage=999999999999', {
            headers: headers
        })
            .toPromise().then(function (data) {
            _this.items$ = data.items;
            _this.dtTrigger.next();
        }, function (error) {
            console.log(error);
        });
    };
    // --------------------------------------------------------------------------------------------------------------------------------------------
    // Funzione viewItem
    ArticoliComponent.prototype.viewItem = function (item_id) {
        localStorage.removeItem('item_id');
        localStorage.setItem('item_id', item_id);
        this.router.navigateByUrl('/view-item');
    };
    // New Item
    ArticoliComponent.prototype.addItem = function (id) {
        localStorage.removeItem('new_item_id');
        localStorage.setItem('new_item_id', id);
        this.router.navigateByUrl('/crea-item');
    };
    // --------------------------------------------------------------------------------------------------------------------------------------------
    // Funzione Crea Nuovo Articolo
    ArticoliComponent.prototype.getItemType = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_7__["environment"].URL_ROOT + '/item/type', {
            headers: headers
        })
            .toPromise().then(function (itemtAPI) {
            _this.titems_t = itemtAPI.total_itemtype;
            _this.items_t = itemtAPI.itemtype;
        }, function (error) {
            console.log(error);
        });
    };
    // --------------------------------------------------------------------------------------------------------------------------------------------
    // Funzione Elimina Articolo - OpenModal
    ArticoliComponent.prototype.open = function (content, d_item_id, d_item_a) {
        // Passo le info dell'item da eliminare
        del_item_id = d_item_id;
        this.alias = d_item_a;
        // Mostro il Modal per la conferma
        this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title'
        });
    };
    ArticoliComponent.prototype.openMultiple = function (multiple) {
        // Mostro il Modal per la conferma
        this.modalService.open(multiple, {
            ariaLabelledBy: 'modal-basic-title'
        });
    };
    // API DELETE Item
    ArticoliComponent.prototype.deleteItem = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        this.httpClient.delete(_environments_environment__WEBPACK_IMPORTED_MODULE_7__["environment"].URL_ROOT + '/item/concrete/' + del_item_id, {
            headers: headers
        }).subscribe(function (data) {
            _this.getItems();
            _this.modalService.dismissAll();
            _this.showAlert();
        }, function (error) {
            console.log(error);
        });
    };
    ArticoliComponent.prototype.deleteMultiple = function () {
        var _this = this;
        this.toZero = true;
        this.checkboxes.forEach(function (element) {
            if (element.nativeElement.checked == true) {
                _this.delItems$[_this.indexDel] = element.nativeElement.id;
                _this.indexDel++;
            }
        });
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        var i;
        this.delItems$.forEach(function (element) {
            _this.httpClient.delete(_environments_environment__WEBPACK_IMPORTED_MODULE_7__["environment"].URL_ROOT + '/item/concrete/' + element, {
                headers: headers
            }).subscribe(function (data) {
                // Index elemento da eliminare
                var i;
                i = _this.delItems$.indexOf(element);
                // Parte Grafica
                _this.getItems();
                _this.modalService.dismissAll();
                _this.showAlert();
                // Rimuovere item dall'array
                _this.delItems$.splice(i, 1);
                _this.index--;
            }, function (error) {
                console.log(error);
            });
        });
    };
    // Aggiungi tutti gli ITEM alla lista
    ArticoliComponent.prototype.checkAll = function () {
        var _this = this;
        this.checkboxes.forEach(function (element) {
            element.nativeElement.checked = true;
            _this.getIndex();
        });
    };
    // Singolo Chechbox control
    ArticoliComponent.prototype.ngOnSelected = function () {
        this.getIndex();
    };
    // Conteggio Articoli Selezionati
    ArticoliComponent.prototype.getIndex = function () {
        var _this = this;
        this.index = 0;
        this.checkboxes.forEach(function (element) {
            if (element.nativeElement.checked == true) {
                _this.index++;
            }
        });
    };
    // DELETE - Alert e Modal
    // Alert di Conferma
    ArticoliComponent.prototype.showAlert = function () {
        var _this = this;
        this._success.subscribe(function (message) { return _this.successMessage = message; });
        this._success.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(5000)).subscribe(function () { return _this.successMessage = ''; });
        this._success.next('Articolo ' + this.alias + ' rimosso con successo!');
    };
    // Rerender Tabella
    ArticoliComponent.prototype.rerender = function () {
        this.dtElement.dtInstance.then(function (dtInstance) {
            dtInstance.destroy();
            // this.getItems();
            // this.dtTrigger.next();
        });
    };
    ArticoliComponent.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] },
        { type: _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__["NgbModal"] },
        { type: _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__["NgbModalConfig"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"] }
    ]; };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(angular_datatables__WEBPACK_IMPORTED_MODULE_4__["DataTableDirective"], {
            static: false
        }),
        __metadata("design:type", angular_datatables__WEBPACK_IMPORTED_MODULE_4__["DataTableDirective"])
    ], ArticoliComponent.prototype, "dtElement", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])("checkboxes"),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
    ], ArticoliComponent.prototype, "checkboxes", void 0);
    ArticoliComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-articoli',
            template: __importDefault(__webpack_require__(/*! raw-loader!./articoli.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/articoli/articoli.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./articoli.component.scss */ "./src/app/pages/articoli/articoli.component.scss")).default]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__["NgbModal"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_3__["NgbModalConfig"], _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"]])
    ], ArticoliComponent);
    return ArticoliComponent;
}());



/***/ }),

/***/ "./src/app/pages/dashboard/dashboard.component.scss":
/*!**********************************************************!*\
  !*** ./src/app/pages/dashboard/dashboard.component.scss ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2Rhc2hib2FyZC9kYXNoYm9hcmQuY29tcG9uZW50LnNjc3MifQ== */");

/***/ }),

/***/ "./src/app/pages/dashboard/dashboard.component.ts":
/*!********************************************************!*\
  !*** ./src/app/pages/dashboard/dashboard.component.ts ***!
  \********************************************************/
/*! exports provided: DashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardComponent", function() { return DashboardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm5/http.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm5/router.js");
/* harmony import */ var _variables_system__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../variables/system */ "./src/app/variables/system.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};





var DashboardComponent = /** @class */ (function () {
    // COSTRUTTORE -----------------------------------------------------------
    function DashboardComponent(httpClient, router) {
        this.httpClient = httpClient;
        this.router = router;
        // Var Articoli
        this.varItem = [];
        // Variabili System
        this.system_info = new _variables_system__WEBPACK_IMPORTED_MODULE_3__["System"]('', '', '', '', '', '', '', '', '', '', '');
    }
    DashboardComponent.prototype.ngOnInit = function () {
        // Controllo l'accesso
        if (localStorage.getItem('apikey') != null) {
            // Richiamo le funzioni per API
            this.getInstallation();
            this.getDisplay();
            this.getTotalMatch();
            this.getAps();
            this.getItems();
            this.getTotItem();
            this.getImport();
            this.getMobile();
            this.getInfo();
        }
        else {
            this.router.navigate(['../login']);
        }
    };
    // -------- API Requests -------------------------------------------------------------------------------------------------------------------------------------
    // Informazioni Installazione
    DashboardComponent.prototype.getInstallation = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].URL_ROOT + '/system/configuration', {
            headers: headers
        })
            .toPromise().then(function (data) {
            var temp = data.configurations;
            _this.varInstallation = temp;
            _this.varInstName = temp.installation_name;
            _this.varInstallationType = temp.installation_type;
            _this.importBasePath = temp.import_base_path;
        }, function (error) {
            console.log(error);
        });
    };
    // Templates
    DashboardComponent.prototype.getItemTypeTemplate = function (tid) {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].URL_ROOT + '/template/itemtype/' + tid, {
            headers: headers
        })
            .toPromise().then(function (data) {
            _this.templates = data.templates;
        }, function (error) {
            console.log(error);
        });
    };
    // +++++++++++++++++++++
    // Display & Etichette
    DashboardComponent.prototype.getDisplay = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].URL_ROOT + '/labelinfo/statistics', {
            headers: headers
        })
            .toPromise().then(function (data) {
            var temp = data;
            _this.labelOnline = temp.connection.online;
            _this.labelOffline = temp.connection.offline;
            _this.batteryGood = temp.battery.good;
            _this.batteryBad = temp.battery.bad;
        }, function (error) {
            console.log(error);
        });
    };
    // Total Matches
    DashboardComponent.prototype.getTotalMatch = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].URL_ROOT + '/matching', {
            headers: headers
        })
            .toPromise().then(function (data) {
            _this.varTotMatch = data.total_matching;
        }, function (error) {
            console.log(error);
        });
    };
    // Access Point
    DashboardComponent.prototype.getAps = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].URL_ROOT + '/accesspoint', {
            headers: headers
        })
            .toPromise().then(function (data) {
            var temp = data;
            _this.totalAP = temp.total_access_point;
            _this.ap$ = temp.access_point;
        }, function (error) {
            console.log(error);
        });
    };
    // +++++++++++++++++++++
    // Articoli
    DashboardComponent.prototype.getItems = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].URL_ROOT + '/item/type', {
            headers: headers
        })
            .toPromise().then(function (data) {
            _this.varItem = data.itemtype;
            _this.totalItemType = data.total_itemtype;
            // console.log(this.varItem[0].id);
            _this.selectedOption = _this.varItem[0].id;
            _this.getItemTypeTemplate(_this.selectedOption);
        }, function (error) {
            console.log(error);
        });
    };
    // Totale Articoli
    DashboardComponent.prototype.getTotItem = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].URL_ROOT + '/item/concrete', {
            headers: headers
        })
            .toPromise().then(function (data) {
            var temp = data.total_items;
            _this.varTotItem = temp;
        }, function (error) {
            console.log(error);
        });
    };
    // Importazioni
    DashboardComponent.prototype.getImport = function () {
        var _this = this;
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].URL_ROOT + '/import/queue')
            .toPromise().then(function (data) {
            var temp = data;
            _this.varImport = temp.importqueue;
        }, function (error) {
            console.log(error);
        });
    };
    // +++++++++++++++++++++
    // Mobile Device
    DashboardComponent.prototype.getMobile = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].URL_ROOT + '/mobiledevice', {
            headers: headers
        })
            .toPromise().then(function (data) {
            var temp = data.mobile_device;
            _this.varMobile = temp;
        }, function (error) {
            console.log(error);
        });
    };
    // +++++++++++++++++++++
    // Info Sistema
    DashboardComponent.prototype.getInfo = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].URL_ROOT + '/system', {
            headers: headers
        })
            .toPromise().then(function (data) {
            _this.system_info = data;
        }, function (error) {
            console.log(error);
        });
    };
    DashboardComponent.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }
    ]; };
    DashboardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-dashboard',
            template: __importDefault(__webpack_require__(/*! raw-loader!./dashboard.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/dashboard/dashboard.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./dashboard.component.scss */ "./src/app/pages/dashboard/dashboard.component.scss")).default]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], DashboardComponent);
    return DashboardComponent;
}());



/***/ }),

/***/ "./src/app/pages/etichette/etichette.component.scss":
/*!**********************************************************!*\
  !*** ./src/app/pages/etichette/etichette.component.scss ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2V0aWNoZXR0ZS9ldGljaGV0dGUuY29tcG9uZW50LnNjc3MifQ== */");

/***/ }),

/***/ "./src/app/pages/etichette/etichette.component.ts":
/*!********************************************************!*\
  !*** ./src/app/pages/etichette/etichette.component.ts ***!
  \********************************************************/
/*! exports provided: EtichetteComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EtichetteComponent", function() { return EtichetteComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm5/router.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/__ivy_ngcc__/fesm5/ng-bootstrap.js");
/* harmony import */ var angular_datatables__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! angular-datatables */ "./node_modules/angular-datatables/__ivy_ngcc__/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};








var del_label_id;
// Componente principale
var EtichetteComponent = /** @class */ (function () {
    function EtichetteComponent(httpClient, modalService, config, router) {
        this.httpClient = httpClient;
        this.modalService = modalService;
        this.router = router;
        this.labels$ = [];
        this.dtOptions = {};
        this.dtTrigger = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        // Alert e Modal
        this._success = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this._successAdd = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.staticAlertClosed = false;
        this.successMessage = '';
        this.successMessageAdd = '';
        // Aggiungi Label
        this.valid_label_id = false;
        this.prev = '';
        this.showPrev = false;
        config.backdrop = 'static';
        config.keyboard = false;
    }
    EtichetteComponent.prototype.ngOnInit = function () {
        // Controllo l'accesso
        if (localStorage.getItem('apikey') != null) {
            // GET Label
            this.getLabel();
            // DataTables Options
            this.dtOptions = {
                pagingType: 'full_numbers',
                pageLength: 10,
                processing: true,
                dom: this.elNumber
            };
        }
        else {
            this.router.navigate(['../login']);
        }
    };
    EtichetteComponent.prototype.ngOnDestroy = function () {
        this.dtTrigger.unsubscribe();
    };
    // API GET Label
    EtichetteComponent.prototype.getLabel = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].URL_ROOT + '/labelinfo?recordsPerPage=999999999999', {
            headers: headers
        })
            .toPromise().then(function (data) {
            _this.labels$ = data.label_info;
            _this.dtTrigger.next();
        });
        // Paginazione
        if (this.labels$.length <= 10) {
            this.elNumber = 'lfti';
        }
        else {
            this.elNumber = 'plfti';
        }
    };
    // ----------------------------------------------------------------------------------------------------------------------------
    // Funzione OpenModal
    EtichetteComponent.prototype.open = function (content, d_label_id) {
        // Passo le info dell'item da eliminare
        del_label_id = d_label_id;
        this.label_name = d_label_id;
        // Mostro il Modal per la conferma
        this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title'
        });
    };
    // API DELETE Label - Work In Proges ................................
    EtichetteComponent.prototype.deleteLabel = function () {
        // Header apikey + Content-Type
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        // API - DELETE
        this.httpClient.delete(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].URL_ROOT + '/label/' + del_label_id, {
            headers: headers
        }).subscribe();
        // Chiuso il modal mostro l'alert, e renderizzo nuovamente la tabella
        this.modalService.dismissAll();
        this.showAlert();
        this.rerender();
    };
    // Render Tabella
    EtichetteComponent.prototype.rerender = function () {
        var _this = this;
        this.dtElement.dtInstance.then(function (dtInstance) {
            // Distruggo la vecchia tabella
            dtInstance.destroy();
            // Nuova chiamata agli API (il delay di 100ms serve per ottenere API aggiornati)
            setTimeout(function () {
                _this.getLabel();
            }, 100);
        });
    };
    // Alert 
    EtichetteComponent.prototype.showAlert = function () {
        var _this = this;
        this._success.subscribe(function (message) { return _this.successMessage = message; });
        this._success.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["debounceTime"])(5000)).subscribe(function () { return _this.successMessage = ''; });
        this._success.next('Etichetta ' + this.label_name + ' rimossa con successo!');
    };
    // --------------------------------------------------------
    // Aggiungi Etichette
    // Modal Etichetta Manuale
    EtichetteComponent.prototype.openManual = function (addManual) {
        this.modalService.open(addManual, {
            ariaLabelledBy: 'modal-basic-title'
        });
    };
    EtichetteComponent.prototype.postManual = function (ids) {
        var _this = this;
        if (ids == null || ids == '') {
            this.valid_label_id = true;
        }
        else {
            var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
            var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpParams"]()
                .set('label_id[]', ids);
            this.httpClient.post(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].URL_ROOT + '/label', params, {
                headers: headers
            }).subscribe(function (data) {
                _this.modalService.dismissAll();
                _this.showAlertAdd();
            }, function (error) {
                console.log(error);
            });
        }
    };
    // Modal Etichetta File
    EtichetteComponent.prototype.openFile = function (addFile) {
        // Mostro il Modal per la conferma
        this.modalService.open(addFile, {
            ariaLabelledBy: 'modal-basic-title'
        });
    };
    EtichetteComponent.prototype.postFile = function (file) {
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        console.log(file);
        //let params = new HttpParams()
        //.set('label_id[]', file)
        //this.httpClient.post(environment.URL_ROOT + '/label/file', params ,{ headers }).subscribe();
    };
    // Preview -------------------------
    EtichetteComponent.prototype.openPreview = function (id) {
        var _this = this;
        // Header generale
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        // Richiesta preview
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].URL_ROOT + '/matching/preview/active/' + id, {
            headers: headers
        }).subscribe(function (data) {
            _this.prevA = data;
            _this.prev = _this.prevA.preview;
            _this.showPrev = true;
        }, function (error) {
            console.log(error);
        });
    };
    // Alert Conferma ---------------------------------------------------
    EtichetteComponent.prototype.showAlertAdd = function () {
        var _this = this;
        this._successAdd.subscribe(function (message) { return _this.successMessageAdd = message; });
        this._successAdd.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["debounceTime"])(5000)).subscribe(function () { return _this.successMessageAdd = ''; });
        this._successAdd.next('Tutte le etichette sono state registrate correttamente. Tra qualche minuto saranno ONLINE.');
    };
    // View Details Label
    EtichetteComponent.prototype.viewLabel = function (labelId) {
        localStorage.removeItem('label_id');
        localStorage.setItem('label_id', labelId);
        this.router.navigateByUrl('/view-label');
    };
    // API GET /api/matching/active/LGN20012 - trova l'id del match da scollegare
    EtichetteComponent.prototype.getIdActive = function (id) {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].URL_ROOT + '/matching/active/' + id, {
            headers: headers
        }).subscribe(function (data) {
            _this.prevA = data;
            _this.prev = _this.prevA.preview;
            _this.showPrev = true;
        }, function (error) {
            console.log(error);
        });
    };
    // API Scollega Label PUT /api/matching/{matchingId}/deactivate
    EtichetteComponent.prototype.putDeactivateMatch = function (id) {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        var matchId;
        // Trovo ID del match
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].URL_ROOT + '/matching/active/' + id, {
            headers: headers
        }).subscribe(function (data) {
            var temp = data;
            // matchId = temp.id;
            console.log('ID: ' + matchId);
            console.log(localStorage.getItem('apikey'));
            headers.set('Content-Type', 'application/x-www-form-urlencoded');
            // Elimino il match
            var tempId = matchId;
            _this.httpClient.put(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].URL_ROOT + '/matching/' + tempId + '/deactivate', {
                headers: headers
            }).subscribe(function (data) {
                console.log(data);
            }, function (error) {
                console.log(error);
            });
        }, function (error) {
            console.log(error);
        });
    };
    EtichetteComponent.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] },
        { type: _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_4__["NgbModal"] },
        { type: _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_4__["NgbModalConfig"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] }
    ]; };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(angular_datatables__WEBPACK_IMPORTED_MODULE_5__["DataTableDirective"], {
            static: false
        }),
        __metadata("design:type", angular_datatables__WEBPACK_IMPORTED_MODULE_5__["DataTableDirective"])
    ], EtichetteComponent.prototype, "dtElement", void 0);
    EtichetteComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-etichette',
            template: __importDefault(__webpack_require__(/*! raw-loader!./etichette.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/etichette/etichette.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./etichette.component.scss */ "./src/app/pages/etichette/etichette.component.scss")).default]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_4__["NgbModal"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_4__["NgbModalConfig"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], EtichetteComponent);
    return EtichetteComponent;
}());



/***/ }),

/***/ "./src/app/pages/location/location.component.scss":
/*!********************************************************!*\
  !*** ./src/app/pages/location/location.component.scss ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2xvY2F0aW9uL2xvY2F0aW9uLmNvbXBvbmVudC5zY3NzIn0= */");

/***/ }),

/***/ "./src/app/pages/location/location.component.ts":
/*!******************************************************!*\
  !*** ./src/app/pages/location/location.component.ts ***!
  \******************************************************/
/*! exports provided: LocationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocationComponent", function() { return LocationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm5/http.js");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/__ivy_ngcc__/fesm5/ng-bootstrap.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm5/router.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};







var del_loc_id;
var LocationComponent = /** @class */ (function () {
    function LocationComponent(httpClient, modalService, config, router) {
        this.httpClient = httpClient;
        this.modalService = modalService;
        this.router = router;
        // Alert e Modal
        this._success = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subject"]();
        this._successAdd = new rxjs__WEBPACK_IMPORTED_MODULE_3__["Subject"]();
        this.staticAlertClosed = false;
        this.deleteMessage = '';
        this.successMessage = '';
        config.backdrop = 'static';
        config.keyboard = false;
    }
    LocationComponent.prototype.ngOnInit = function () {
        // Controllo l'accesso
        if (localStorage.getItem('apikey') != null) {
            this.getLocations();
        }
        else {
            this.router.navigate(['../login']);
        }
    };
    // Metodo GET - Visualizzare Locations -----------------------------------------------------------------
    LocationComponent.prototype.getLocations = function () {
        var _this = this;
        // Header generale
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        // Elenco Corsie
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].URL_ROOT + '/location', {
            headers: headers
        })
            .toPromise().then(function (data) {
            _this.locations$ = data.locations;
        }, function (error) {
            console.log(error);
        });
    };
    // Metodo POST - Aggiungere Location ------------------------------------------------------------------
    LocationComponent.prototype.postCorsia = function (nomeLocation, tipoLocation) {
        var _this = this;
        // Header generale
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        console.log(localStorage.getItem('apikey'));
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        // Parametri
        var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpParams"]()
            .set('locationTypeId', tipoLocation)
            .set('locationName', nomeLocation)
            .set('isActive', 'true');
        // Aggiungo Location
        this.httpClient.post(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].URL_ROOT + '/location', params, {
            headers: headers
        }).subscribe(function (data) {
            _this.aliasAdd = nomeLocation;
            _this.showAlertSuccess();
            _this.getLocations();
        }, function (error) {
            console.log(error);
        });
    };
    // Alert di Conferma POST
    LocationComponent.prototype.showAlertSuccess = function () {
        var _this = this;
        this._successAdd.subscribe(function (message) { return _this.successMessage = message; });
        this._successAdd.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["debounceTime"])(5000)).subscribe(function () { return _this.successMessage = ''; });
        this._successAdd.next('Location ' + this.aliasAdd + ' aggiunta con successo!');
    };
    // Metodo DELETE - Rimovi Location ---------------------------------------------------------------------
    LocationComponent.prototype.deleteLocation = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        this.httpClient.delete(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].URL_ROOT + '/location/' + del_loc_id, {
            headers: headers
        }).subscribe(function (data) {
            _this.modalService.dismissAll();
            _this.showAlert();
            _this.getLocations();
        }, function (error) {
            console.log(error);
        });
    };
    // Funzione OpenModal - Conferma Eliminazione
    LocationComponent.prototype.open = function (content, d_item_id, d_item_a) {
        del_loc_id = d_item_id;
        this.alias = d_item_a;
        this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title'
        });
    };
    // Alert di Conferma DELETE
    LocationComponent.prototype.showAlert = function () {
        var _this = this;
        this._success.subscribe(function (message) { return _this.deleteMessage = message; });
        this._success.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["debounceTime"])(5000)).subscribe(function () { return _this.deleteMessage = ''; });
        this._success.next('Location ' + this.alias + ' rimossa con successo!');
    };
    LocationComponent.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] },
        { type: _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_2__["NgbModal"] },
        { type: _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_2__["NgbModalConfig"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"] }
    ]; };
    LocationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-location',
            template: __importDefault(__webpack_require__(/*! raw-loader!./location.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/location/location.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./location.component.scss */ "./src/app/pages/location/location.component.scss")).default]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_2__["NgbModal"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_2__["NgbModalConfig"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]])
    ], LocationComponent);
    return LocationComponent;
}());



/***/ }),

/***/ "./src/app/pages/smartmatch/smartmatch.component.scss":
/*!************************************************************!*\
  !*** ./src/app/pages/smartmatch/smartmatch.component.scss ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3NtYXJ0bWF0Y2gvc21hcnRtYXRjaC5jb21wb25lbnQuc2NzcyJ9 */");

/***/ }),

/***/ "./src/app/pages/smartmatch/smartmatch.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/pages/smartmatch/smartmatch.component.ts ***!
  \**********************************************************/
/*! exports provided: SmartmatchComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SmartmatchComponent", function() { return SmartmatchComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ "./node_modules/@ng-bootstrap/ng-bootstrap/__ivy_ngcc__/fesm5/ng-bootstrap.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var angular_datatables__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular-datatables */ "./node_modules/angular-datatables/__ivy_ngcc__/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};








var del_item_id;
var SmartmatchComponent = /** @class */ (function () {
    function SmartmatchComponent(httpClient, modalService, config, router) {
        this.httpClient = httpClient;
        this.modalService = modalService;
        this.router = router;
        this.itemArray = [];
        // VAR more items
        this.nrItems = 0;
        this.matchs$ = [];
        this.dtOptions = {};
        this.dtTrigger = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        // Alert e Modal
        this._success = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this._successAdd = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        // private _failed = new Subject < string > ();
        this._failedAdd = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.staticAlertClosed = false;
        this.successMessage = '';
        this.successMessageAdd = '';
        this.failedMessage = '';
        this.failedMessageAdd = '';
        this.showPrev = false;
        // Colore Caselle Input
        this.labelValid = false;
        this.itemValid = false;
        // Checkbox
        this.checkActiveC = 1;
        this.checkPromoC = 1;
        // Errori
        this.smError = '';
        config.backdrop = 'static';
        config.keyboard = false;
    }
    SmartmatchComponent.prototype.ngOnInit = function () {
        // Controllo l'accesso
        if (localStorage.getItem('apikey') != null) {
            // this.getItemTemplate;
            this.getItems();
            this.selectedDecoration = '0';
            // DataTables
            this.dtOptions = {
                pagingType: 'full_numbers',
                pageLength: 10,
                processing: true
            };
            this.getMatches();
        }
        else {
            this.router.navigate(['../login']);
        }
    };
    SmartmatchComponent.prototype.ngOnDestroy = function () {
        this.dtTrigger.unsubscribe();
    };
    // Add SmartMartch - Tipo Articolo e Template
    SmartmatchComponent.prototype.getItemTemplate = function () {
    };
    // Matches
    SmartmatchComponent.prototype.getMatches = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/matching?recordsPerPage=999999999999', {
            headers: headers
        })
            .toPromise().then(function (data) {
            _this.matchs$ = data.matching;
        }, function (error) {
            console.log(error);
        });
    };
    // Templates
    SmartmatchComponent.prototype.getItemTypeTemplate = function (tid) {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/template/itemtype/' + tid, {
            headers: headers
        })
            .toPromise().then(function (data) {
            var temp = data.templates;
            _this.templates = temp;
        }, function (error) {
            console.log(error);
        });
    };
    // Articoli
    SmartmatchComponent.prototype.getItems = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/item/type', {
            headers: headers
        })
            .toPromise().then(function (data) {
            _this.varItem = data.itemtype;
            _this.selectedOption = _this.varItem[0].id;
            _this.getItemTypeTemplate(_this.selectedOption);
        }, function (error) {
            console.log(error);
        });
    };
    // --------------------------------------------------------------------------------------------------------------------------------------------
    // Funzione Elimina Match - OpenModal
    SmartmatchComponent.prototype.open = function (content, d_item_id, d_item_a) {
        // Passo le info dell'item da eliminare
        del_item_id = d_item_id;
        this.alias = d_item_a;
        // Mostro il Modal per la conferma
        this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title'
        });
    };
    // API DELETE SM
    SmartmatchComponent.prototype.deleteItem = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        this.httpClient.delete(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/matching/' + del_item_id, {
            headers: headers
        }).subscribe(function (data) {
            _this.modalService.dismissAll();
            _this.showAlert();
            _this.getMatches();
        }, function (error) {
            console.log(error);
        });
    };
    // Rerender Tabella
    SmartmatchComponent.prototype.rerender = function () {
        this.dtElement.dtInstance.then(function (dtInstance) {
            dtInstance.destroy();
        });
    };
    // Aggiungi SmartMatch ----------------------------------------------------------------------------
    SmartmatchComponent.prototype.addSm = function (template_name, label_id, decorators) {
        var _this = this;
        // Header
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        // Parametri
        var params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpParams"]()
            .set('items[0]', this.testItem) // TEMP
            .set('template_name', template_name)
            .set('label_id', label_id)
            .set('is_active', this.checkActiveC.toString())
            .set('bypass_promo', this.checkPromoC.toString());
        // Controllo se ci sono più item da aggiungere al match ---- DA CONVERTIRE IL BARCODE IN ID
        var index = 1;
        this.itemArray.forEach(function (element) {
            params = params
                .set('items[' + index + ']', _this.itemArray[index - 1]);
            index++;
        });
        // Decorators
        if (decorators != 0) {
            params = params.set('decorators[]', decorators);
        }
        // Aggiungo SmartMatch - Chiamata API
        this.httpClient.post(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/matching', params, {
            headers: headers
        }).subscribe(function (data) {
            _this.getMatches();
            _this.showAlertAdd();
            // console.log(data);
        }, function (error) {
            console.log(error);
            _this.smError = error.message;
            _this.showAlertAddFailed();
        });
    };
    // Preview -------------------------
    SmartmatchComponent.prototype.openPreview = function (id) {
        var _this = this;
        // Header generale
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        // Richiesta preview
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/matching/preview/' + id, {
            headers: headers,
            responseType: 'text'
        }).subscribe(function (data) {
            _this.prev = data;
            _this.showPrev = true;
        }, function (error) {
            console.log(error);
        });
    };
    // Alerts ----------------------------------------
    // Alert di Conferma DELETE
    SmartmatchComponent.prototype.showAlert = function () {
        var _this = this;
        this._success.subscribe(function (message) { return _this.successMessage = message; });
        this._success.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(5000)).subscribe(function () { return _this.successMessage = ''; });
        this._success.next('Match ' + this.alias + ' rimosso con successo!');
    };
    // Alert Conferma POST
    SmartmatchComponent.prototype.showAlertAdd = function () {
        var _this = this;
        this._successAdd.subscribe(function (message) { return _this.successMessageAdd = message; });
        this._successAdd.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(5000)).subscribe(function () { return _this.successMessageAdd = ''; });
        this._successAdd.next('SmartMatch creato correttamente!');
    };
    // Alert Errore POST
    SmartmatchComponent.prototype.showAlertAddFailed = function () {
        var _this = this;
        this._failedAdd.subscribe(function (message) { return _this.failedMessageAdd = message; });
        this._failedAdd.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["debounceTime"])(5000)).subscribe(function () { return _this.failedMessageAdd = ''; });
        this._failedAdd.next('Errore! Impossibile create lo SmartMatch. Codice: ' + this.smError);
    };
    // CHECK ETICHETTE
    SmartmatchComponent.prototype.ngOnChanges = function (id) {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/labelinfo?recordsPerPage=999999999999', {
            headers: headers
        })
            .toPromise().then(function (data) {
            for (var index = 0; index < data.label_info.length; index++) {
                var temp = data.label_info[index].LabelId;
                if (temp == id) {
                    _this.labelValid = true;
                    break;
                }
                else {
                    _this.labelValid = false;
                }
            }
        }, function (error) {
            console.log(error);
        });
    };
    // Controllo se il barcode (principale) esiste
    SmartmatchComponent.prototype.ngOnChangesItem = function (id, template) {
        var _this = this;
        var itemId;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        // Verifico che esista il barcode sia corretto e ne prendo l'ID
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/item/search/fastmatch/' + template + '/' + id, {
            headers: headers
        })
            .toPromise().then(function (data) {
            itemId = data.id;
            _this.testItem = itemId;
            _this.itemValid = true;
            _this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/item/concrete/' + _this.testItem, {
                headers: headers
            })
                // Chiamata per prendere il nome dell'articolo
                .toPromise().then(function (data) {
                _this.testItemName = data.reserved_alias;
            });
        }, function (error) {
            _this.itemValid = false;
        });
    };
    // Add More Items
    SmartmatchComponent.prototype.moreItem = function () {
        this.nrItems = this.nrItems + 1;
    };
    SmartmatchComponent.prototype.counter = function (i) {
        return new Array(i);
    };
    // Funzione per ottenere le informazioni degli item collegati ai barcode aggiunti
    SmartmatchComponent.prototype.ngOnChangesMoreItem = function (template, index) {
        var _this = this;
        var itemId;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        var newItem = document.getElementById("item_barcode_" + index).value;
        // Verifico che esista il barcode sia corretto e ne prendo l'ID
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/item/search/fastmatch/' + template + '/' + newItem, {
            headers: headers
        })
            .toPromise().then(function (data) {
            itemId = data.id;
            _this.itemArray[index] = itemId;
            // this.testItem = itemId;
            // this.itemValid = true;
            _this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/item/concrete/' + _this.testItem, {
                headers: headers
            });
            // Chiamata per prendere il nome dell'articolo
            //.toPromise().then((data: any) => {
            //  this.testItemName = data.reserved_alias;
            //});
        }, function (error) {
            console.log(error);
        });
    };
    SmartmatchComponent.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] },
        { type: _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_4__["NgbModal"] },
        { type: _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_4__["NgbModalConfig"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"] }
    ]; };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", String)
    ], SmartmatchComponent.prototype, "labelID", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(angular_datatables__WEBPACK_IMPORTED_MODULE_6__["DataTableDirective"], {
            static: false
        }),
        __metadata("design:type", angular_datatables__WEBPACK_IMPORTED_MODULE_6__["DataTableDirective"])
    ], SmartmatchComponent.prototype, "dtElement", void 0);
    SmartmatchComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-smartmatch',
            template: __importDefault(__webpack_require__(/*! raw-loader!./smartmatch.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/smartmatch/smartmatch.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./smartmatch.component.scss */ "./src/app/pages/smartmatch/smartmatch.component.scss")).default]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_4__["NgbModal"], _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_4__["NgbModalConfig"], _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"]])
    ], SmartmatchComponent);
    return SmartmatchComponent;
}());



/***/ }),

/***/ "./src/app/pages/visualizzarticolo/visualizzarticolo.component.css":
/*!*************************************************************************!*\
  !*** ./src/app/pages/visualizzarticolo/visualizzarticolo.component.css ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3Zpc3VhbGl6emFydGljb2xvL3Zpc3VhbGl6emFydGljb2xvLmNvbXBvbmVudC5jc3MifQ== */");

/***/ }),

/***/ "./src/app/pages/visualizzarticolo/visualizzarticolo.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/pages/visualizzarticolo/visualizzarticolo.component.ts ***!
  \************************************************************************/
/*! exports provided: VisualizzarticoloComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VisualizzarticoloComponent", function() { return VisualizzarticoloComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm5/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};




var VisualizzarticoloComponent = /** @class */ (function () {
    function VisualizzarticoloComponent(httpClient, router) {
        this.httpClient = httpClient;
        this.router = router;
        this.parametri$ = [];
        this.valori$ = [];
        this.matchs$ = [];
        this.prev = '';
        this.showPrev = false;
    }
    VisualizzarticoloComponent.prototype.ngOnInit = function () {
        // Controllo l'accesso
        if (localStorage.getItem('item_id') != null || localStorage.getItem('item_id') != '') {
            this.item_id = localStorage.getItem('item_id');
            this.getDetails();
            this.getMatch();
        }
        else {
            this.router.navigate(['../articoli']);
        }
    };
    // Richiesta API dettagli articolo
    VisualizzarticoloComponent.prototype.getDetails = function () {
        var _this = this;
        // Header generale
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/item/concrete/' + this.item_id, {
            headers: headers
        })
            .toPromise().then(function (data) {
            _this.currentFields$ = data.current_fields;
            _this.parametri$ = Object.keys(data.current_fields);
            _this.valori$ = data.current_fields;
            _this.nomeArticolo = data.current_fields.ArticoloDes;
            // console.log(this.valori$);
        }, function (error) {
            console.log(error);
        });
    };
    // API GET  matching
    VisualizzarticoloComponent.prototype.getMatch = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/matching/item/' + this.item_id, {
            headers: headers
        })
            .toPromise().then(function (data) {
            var temp_data = data.matching;
            _this.matchs$ = temp_data;
            // console.log(this.matchs$)
        }, function (error) {
            console.log(error);
        });
    };
    // Preview 
    VisualizzarticoloComponent.prototype.openPreview = function (id) {
        var _this = this;
        // Header generale
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]().set('apikey', localStorage.getItem('apikey'));
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        // Richiesta preview
        this.httpClient.get(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/matching/preview/' + id, {
            headers: headers,
            responseType: 'text'
        }).subscribe(function (data) {
            _this.prev = data;
            _this.showPrev = true;
            // console.log(this.prev);
        }, function (error) {
            console.log(error);
        });
    };
    // Update Item
    VisualizzarticoloComponent.prototype.updateItem = function () {
        var _this = this;
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]()
            .set('apikey', localStorage.getItem('apikey'))
            .set('Content-Type', 'application/json');
        var formData = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
        for (var index = 0; index < this.parametri$.length; index++) {
            // let temp = this.parametri$[index].toString();
            var inputValue = document.getElementById(this.parametri$[index]).value;
            formData = formData.append('fields[' + this.parametri$[index] + ']', inputValue);
        }
        // Richiesta - Errore 403*
        this.httpClient.post(_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].URL_ROOT + '/item/concrete/update/' + this.item_id, {
            headers: headers,
            params: formData
        })
            .subscribe(function (data) {
            _this.getDetails();
        }, function (error) {
            console.log(error);
        });
    };
    // Pulsante Annulla
    VisualizzarticoloComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/articoli');
    };
    VisualizzarticoloComponent.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"] }
    ]; };
    VisualizzarticoloComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-visualizzarticolo',
            template: __importDefault(__webpack_require__(/*! raw-loader!./visualizzarticolo.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/visualizzarticolo/visualizzarticolo.component.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./visualizzarticolo.component.css */ "./src/app/pages/visualizzarticolo/visualizzarticolo.component.css")).default]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], VisualizzarticoloComponent);
    return VisualizzarticoloComponent;
}());



/***/ }),

/***/ "./src/app/variables/system.ts":
/*!*************************************!*\
  !*** ./src/app/variables/system.ts ***!
  \*************************************/
/*! exports provided: System */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "System", function() { return System; });
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
var System = /** @class */ (function () {
    function System(smartikette_version, system_boot_time, system_disk_total_space, system_disk_free_space, php_version, apache_version, apache_uptime, mariadb_version, mariadb_uptime, mongodb_version, mongodb_uptime) {
        this.smartikette_version = smartikette_version;
        this.system_boot_time = system_boot_time;
        this.system_disk_total_space = system_disk_total_space;
        this.system_disk_free_space = system_disk_free_space;
        this.php_version = php_version;
        this.apache_version = apache_version;
        this.apache_uptime = apache_uptime;
        this.mariadb_version = mariadb_version;
        this.mariadb_uptime = mariadb_uptime;
        this.mongodb_version = mongodb_version;
        this.mongodb_uptime = mongodb_uptime;
    }
    return System;
}());



/***/ })

}]);
//# sourceMappingURL=layouts-admin-layout-admin-layout-module.js.map