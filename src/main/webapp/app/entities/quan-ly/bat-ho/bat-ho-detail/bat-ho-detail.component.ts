import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';
import { Message } from 'primeng/components/common/api';
import { BatHo } from '../../../bat-ho/bat-ho.model';
import { BatHoService } from '../../../bat-ho/bat-ho.service';
import { LichSuDongTien, DONGTIEN } from '../../../lich-su-dong-tien/lich-su-dong-tien.model';
import { LichSuThaoTacHopDong } from '../../../lich-su-thao-tac-hop-dong';
import { LichSuDongTienService } from '../../../lich-su-dong-tien/lich-su-dong-tien.service';
import { LichSuThaoTacHopDongService } from '../../../lich-su-thao-tac-hop-dong/lich-su-thao-tac-hop-dong.service';
@Component({
    selector: 'bat-ho-detail-admin',
    templateUrl: './bat-ho-detail.component.html'
})
export class BatHoDetailAdminComponent implements OnInit, OnDestroy {
    batHo: BatHo;
    lichSuDongTiensDaDong: LichSuDongTien[];
    lichSuDongTiensChuaDong: LichSuDongTien[];
    lichSuThaoTacHopDongs: LichSuThaoTacHopDong[];
    selected: LichSuDongTien;
    msgs: Message[] = [];
    tiendadong: number;
    tienchuadong: number;
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    dongHD: boolean = false;

    constructor(
        private eventManager: JhiEventManager,
        private batHoService: BatHoService,
        private lichSuDongTienService: LichSuDongTienService,
        private lichSuThaoTacHopDongService: LichSuThaoTacHopDongService,
        private route: ActivatedRoute,
        // private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
            this.lichSuThaoTacHopDong(params['id']);

        });
        this.registerChangeInBatHos();
    }

    hienDongHD() {
        this.dongHD = true;
    }
    dongDongHD(){
        this.dongHD = false;
    }

    lichSuThaoTacHopDong(id) {

    }
    // convertotEnum
    load(id) {
        this.batHoService
            .find(id)
            .subscribe((batHoResponse: HttpResponse<BatHo>) => {
                this.batHo = batHoResponse.body;
                this.lichSuDongTienService
                    .findByHopDongVaTrangThai(
                        DONGTIEN.DADONG,
                        this.batHo.hopdong.id
                    )
                    .subscribe(
                        (
                            lichSuDongTienResponse: HttpResponse<
                                LichSuDongTien[]
                            >
                        ) => {
                            this.lichSuDongTiensDaDong =
                                lichSuDongTienResponse.body;
                            this.tiendadong = 0;
                            for (
                                let i = 0;
                                i < lichSuDongTienResponse.body.length;
                                i++
                            ) {
                                this.tiendadong =
                                    this.tiendadong +
                                    lichSuDongTienResponse.body[i].sotien;
                            }
                        }
                    );
                this.lichSuDongTienService
                    .findByHopDongVaTrangThai(
                        DONGTIEN.CHUADONG,
                        this.batHo.hopdong.id
                    )
                    .subscribe(
                        (
                            lichSuDongTienResponse: HttpResponse<
                                LichSuDongTien[]
                            >
                        ) => {
                            this.lichSuDongTiensChuaDong =
                                lichSuDongTienResponse.body;
                            this.tienchuadong = 0;
                            for (
                                let i = 0;
                                i < lichSuDongTienResponse.body.length;
                                i++
                            ) {
                                this.tienchuadong =
                                    this.tienchuadong +
                                    lichSuDongTienResponse.body[i].sotien;
                            }
                        }
                    );
                this.lichSuThaoTacHopDongService.findThaoTacByHopDong(this.batHo.hopdong.id)
                    .subscribe((batHoResponse: HttpResponse<LichSuThaoTacHopDong[]>) => {
                        this.lichSuThaoTacHopDongs = batHoResponse.body;
                    });
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInBatHos() {
        this.eventSubscriber = this.eventManager.subscribe(
            'batHoListModification',
            response => this.load(this.batHo.id)
        );
    }


}
