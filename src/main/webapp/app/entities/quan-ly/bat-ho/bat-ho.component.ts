import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { BatHo } from '../../bat-ho/bat-ho.model';
import { BatHoService } from '../../bat-ho/bat-ho.service';
import { Principal } from '../../../shared';

@Component({
    selector: 'bat-ho-admin',
    templateUrl: './bat-ho.component.html'
})
export class BatHoAdminComponent implements OnInit, OnDestroy {
    batHos: BatHo[];
    currentAccount: any;
    eventSubscriber: Subscription;
    text: any;
    selected: BatHo;
    none: any;
    keyTimBatHo: string;
    constructor(
        private batHoService: BatHoService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.batHoService.query().subscribe(
            (res: HttpResponse<BatHo[]>) => {
                this.batHos = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInBatHos();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: BatHo) {
        return item.id;
    }
    registerChangeInBatHos() {
        this.eventSubscriber = this.eventManager.subscribe('batHoListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
    timBatHo() {
        // const query = event.query;
        // console.log(query);
        this.batHoService
            .findBatHoByTenOrCMND(this.keyTimBatHo)
            .subscribe(
                (res: HttpResponse<BatHo[]>) => {
                    this.batHos = res.body;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }
}