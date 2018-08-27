import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { VayLai } from '../../vay-lai/vay-lai.model';
import { VayLaiService } from '../../vay-lai/vay-lai.service';
import { Principal } from '../../../shared';
import { TRANGTHAIHOPDONG } from '../../hop-dong';

@Component({
    selector: 'jhi-vay-lai-admin',
    templateUrl: './vay-lai.component.html'
})
export class VayLaiAdminComponent implements OnInit, OnDestroy {
    vayLais: VayLai[];
    currentAccount: any;
    eventSubscriber: Subscription;
    text: any;
    selected: VayLai;
    none: any;
    keyTimVayLai: string;
    loaihopdong:any;
    constructor(
        private vayLaiService: VayLaiService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
        this.loaihopdong = 1;
    }

    loadAll() {
        if(this.loaihopdong == 1){
            this.vayLaiService.query(TRANGTHAIHOPDONG.DANGVAY).subscribe(
                (res: HttpResponse<VayLai[]>) => {
                    this.vayLais = res.body;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        }else{
            this.vayLaiService.query(TRANGTHAIHOPDONG.DADONG).subscribe(
                (res: HttpResponse<VayLai[]>) => {
                    this.vayLais = res.body;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        }

    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInVayLais();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: VayLai) {
        return item.id;
    }
    registerChangeInVayLais() {
        this.eventSubscriber = this.eventManager.subscribe(
            'vayLaiListModification',
            response => this.loadAll()
        );
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
    timVayLai() {
        this.vayLaiService.findVayLaiByTenOrCMND(this.keyTimVayLai).subscribe(
            (res: HttpResponse<VayLai[]>) => {
                this.vayLais = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
}
