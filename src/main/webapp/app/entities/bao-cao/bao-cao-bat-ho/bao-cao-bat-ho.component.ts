
import { BatHo, BatHoService } from '../../bat-ho';
import { NhanVien, NhanVienService } from '../../nhan-vien';
import { HopDong, HopDongService, LOAIHOPDONG } from '../../hop-dong';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { VayLaiService, VayLai } from '../../vay-lai';
import { LichSuDongTien, DONGTIEN } from '../../lich-su-dong-tien/lich-su-dong-tien.model';
import { LichSuDongTienService } from '../../lich-su-dong-tien/lich-su-dong-tien.service';
import { Principal } from '../../../shared';
import { GhiNo, GhiNoService } from '../../ghi-no';
import { ThuChiService, ThuChi, THUCHI } from '../../thu-chi';

@Component({
  selector: 'jhi-bao-cao-bat-ho',
  templateUrl: './bao-cao-bat-ho.component.html',
  styles: []
})
export class BaoCaoBatHoComponent implements OnInit {
  batHos: BatHo[];
  selected: BatHo;
  tungay: Date;
  denngay: Date;
  hopDong: HopDong;
  lichSuDongTienVLs: LichSuDongTien[];
  lichSuDongTienBHs: LichSuDongTien[];
  lichSuDongTienTraGoc: LichSuDongTien[];

  lichSuDongTien: LichSuDongTien;
  currentAccount: any;
  eventSubscriber: Subscription;
  hopDongs: HopDong[];
  nhanViens: NhanVien[];
  nhanVien: NhanVien;
  ghiNoVLs: GhiNo[];
  ghiNoBHs: GhiNo[];
  ghiNo: GhiNo;
  thuChi: ThuChi;
  thuChis: ThuChi[];

  tongTienBH: number;
  tongTienVL: number;
  tongTienBHs: number;
  tongTienVLs: number;
  tongTienNoBh: number;
  tongTienTraBh: number;
  tongTienNoVl: number;
  tongTienTraVl: number;
  tienThu: number;
  tienChi: number;
  tienGopVon: number;
  tienRutVon: number;
  vayLai: VayLai;
  vayLais: VayLai[];
  selectedNhanVien: NhanVien;
  tongTienTraGoc: number;
  nguonVon: string;


  constructor(
    private nhanVienService: NhanVienService,
    private batHoService: BatHoService,
    private vayLaiService: VayLaiService,
    private hopDongService: HopDongService,
    private lichSuDongTienService: LichSuDongTienService,
    private ghiNoService: GhiNoService,
    private thuChiService: ThuChiService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private principal: Principal
  ) {
    this.lichSuDongTienVLs = new Array<LichSuDongTien>();
    this.lichSuDongTienBHs = new Array<LichSuDongTien>();
    this.tongTienVL = 0;
    this.tongTienBH = 0;
    this.tongTienBHs = 0;
    this.tongTienVLs = 0;
    this.tongTienNoBh = 0;
    this.tongTienTraBh = 0;
    this.tongTienNoVl = 0;
    this.tongTienTraVl = 0;
    this.tongTienTraGoc = 0;
    this.tienChi = 0;
    this.tienThu = 0;
    this.tienGopVon = 0;
    this.tienRutVon = 0;


    this.selectedNhanVien = new NhanVien;

  }

  ngOnInit() {
    this.loadTienVon();
    this.loadNhanVien();
    this.loadLichSuDongTienBH();
    this.loadLichSuDongTienVL();
    this.loadLichGhiNoTienBH();
    this.loadLichGhiNoTienVL();
    this.loadBatHo();
    this.loadVayLai();
    this.loadThuChi();
    this.loadLichSuDongTienTraGoc();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInHopDongs();
  }
  timKiem() {
    this.tongTienVL = 0;
    this.tongTienBH = 0;
    this.tongTienBHs = 0;
    this.tongTienVLs = 0;
    this.tongTienNoBh = 0;
    this.tongTienTraBh = 0;
    this.tongTienNoVl = 0;
    this.tongTienTraVl = 0;
    this.tongTienTraGoc = 0;
    this.tienChi = 0;
    this.tienThu = 0;
    this.tienGopVon = 0;
    this.tienRutVon = 0;
    if (this.selectedNhanVien == 1) {
      console.log(this.denngay);
      this.lichSuDongTienService.baoCao(DONGTIEN.DADONG, LOAIHOPDONG.BATHO, this.tungay, this.denngay).subscribe(
        (res: HttpResponse<LichSuDongTien[]>) => {
          this.lichSuDongTienBHs = res.body;
          this.lichSuDongTienBHs.forEach(element => {
            this.tongTienBH = this.tongTienBH + element.sotien;
            console.log(element.sotien);
          });
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      this.lichSuDongTienService.baoCao(DONGTIEN.DADONG, LOAIHOPDONG.VAYLAI, this.tungay, this.denngay).subscribe(
        (res: HttpResponse<LichSuDongTien[]>) => {
          this.lichSuDongTienVLs = res.body;
          this.lichSuDongTienVLs.forEach(element => {
            this.tongTienVL = this.tongTienVL + element.sotien;
            console.log(element.sotien);
          });
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      this.ghiNoService.baoCao(LOAIHOPDONG.BATHO, this.tungay, this.denngay).subscribe(
        (res: HttpResponse<GhiNo[]>) => {
          this.ghiNoBHs = res.body;
          this.ghiNoBHs.forEach(element => {
            if (element.trangthai.toString() == 'NO') {
              this.tongTienNoBh += element.sotien;
            } else {
              this.tongTienTraBh += element.sotien;

            }
          });

        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      this.ghiNoService.baoCao(LOAIHOPDONG.VAYLAI, this.tungay, this.denngay).subscribe(
        (res: HttpResponse<GhiNo[]>) => {
          this.ghiNoVLs = res.body;
          this.ghiNoVLs.forEach(element => {
            if (element.trangthai.toString() == 'NO') {
              this.tongTienNoVl += element.sotien;
            } else {
              this.tongTienTraVl += element.sotien;

            }
          });

        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      this.batHoService.baoCao(this.tungay, this.denngay).subscribe(
        (res: HttpResponse<BatHo[]>) => {
          this.batHos = res.body;
          this.batHos.forEach(element => {
            this.tongTienBHs += element.tienduakhach;
          });

        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      this.vayLaiService.baoCao(this.tungay, this.denngay,0).subscribe(
        (res: HttpResponse<VayLai[]>) => {
          this.vayLais = res.body;
          this.vayLais.forEach(element => {
            this.tongTienVLs += element.tienvay;
          });

        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      this.lichSuDongTienService.baoCao(DONGTIEN.TRAGOC, LOAIHOPDONG.VAYLAI, this.tungay, this.denngay).subscribe(
        (res: HttpResponse<LichSuDongTien[]>) => {
          this.lichSuDongTienTraGoc = res.body;
          this.lichSuDongTienTraGoc.forEach(element => {
            this.tongTienTraGoc += element.sotien;
          });

        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      this.thuChiService.baoCao(this.tungay, this.denngay).subscribe(
        (res: HttpResponse<LichSuDongTien[]>) => {
          this.thuChis = res.body;
          this.thuChis.forEach(element => {
            if (element.thuchi.toString() == 'THU') {
              this.tienThu += element.sotien;
            } else if (element.thuchi.toString() == 'CHI') {
              this.tienChi += element.sotien;
            } else if (element.thuchi.toString() == 'GOPVON') {
              this.tienGopVon += element.sotien;
            } else if (element.thuchi.toString() == 'RUTVON') {
              this.tienRutVon += element.sotien;
            }
          });

        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );


    } else {
      this.lichSuDongTienService.baoCaoNV(DONGTIEN.DADONG, LOAIHOPDONG.BATHO, this.tungay, this.denngay, this.selectedNhanVien.id).subscribe(
        (res: HttpResponse<LichSuDongTien[]>) => {
          this.lichSuDongTienBHs = res.body;
          this.lichSuDongTienBHs.forEach(element => {
            this.tongTienBH = this.tongTienBH + element.sotien;
            console.log(element.sotien);
          });
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      this.lichSuDongTienService.baoCaoNV(DONGTIEN.DADONG, LOAIHOPDONG.VAYLAI, this.tungay, this.denngay, this.selectedNhanVien.id).subscribe(
        (res: HttpResponse<LichSuDongTien[]>) => {
          this.lichSuDongTienVLs = res.body;
          this.lichSuDongTienVLs.forEach(element => {
            this.tongTienVL = this.tongTienVL + element.sotien;
            console.log(element.sotien);
          });
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      this.batHoService.baoCaoNV(this.tungay, this.denngay, this.selectedNhanVien.id).subscribe(
        (res: HttpResponse<BatHo[]>) => {
          this.batHos = res.body;
          this.batHos.forEach(element => {
            this.tongTienBHs += element.tienduakhach;
          });

        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      this.vayLaiService.baoCaoNV(this.tungay, this.denngay, this.selectedNhanVien.id,0).subscribe(
        (res: HttpResponse<VayLai[]>) => {
          this.vayLais = res.body;
          this.vayLais.forEach(element => {
            this.tongTienVLs += element.tienvay;
          });

        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      this.lichSuDongTienService.baoCaoNV(DONGTIEN.TRAGOC, LOAIHOPDONG.VAYLAI, this.tungay, this.denngay, this.selectedNhanVien.id).subscribe(
        (res: HttpResponse<LichSuDongTien[]>) => {
          this.lichSuDongTienTraGoc = res.body;
          this.lichSuDongTienTraGoc.forEach(element => {
            this.tongTienTraGoc += element.sotien;
          });

        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );

      this.ghiNoService.baoCaoNV(LOAIHOPDONG.BATHO, this.tungay, this.denngay, this.selectedNhanVien.id).subscribe(
        (res: HttpResponse<GhiNo[]>) => {
          this.ghiNoBHs = res.body;
          this.ghiNoBHs.forEach(element => {
            if (element.trangthai.toString() == 'NO') {
              this.tongTienNoBh += element.sotien;
            } else {
              this.tongTienTraBh += element.sotien;

            }
          });

        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      this.ghiNoService.baoCaoNV(LOAIHOPDONG.VAYLAI, this.tungay, this.denngay, this.selectedNhanVien.id).subscribe(
        (res: HttpResponse<GhiNo[]>) => {
          this.ghiNoVLs = res.body;
          this.ghiNoVLs.forEach(element => {
            if (element.trangthai.toString() == 'NO') {
              this.tongTienNoVl += element.sotien;
            } else {
              this.tongTienTraVl += element.sotien;

            }
          });

        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
      this.thuChiService.baoCaoNV(this.tungay, this.denngay, this.selectedNhanVien.id).subscribe(
        (res: HttpResponse<LichSuDongTien[]>) => {
          this.thuChis = res.body;
          this.thuChis.forEach(element => {
            if (element.thuchi.toString() == 'THU') {
              this.tienThu += element.sotien;
            } else if (element.thuchi.toString() == 'CHI') {
              this.tienChi += element.sotien;
            } else if (element.thuchi.toString() == 'GOPVON') {
              this.tienGopVon += element.sotien;
            } else if (element.thuchi.toString() == 'RUTVON') {
              this.tienRutVon += element.sotien;
            }
          });

        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );

    }


  }
  registerChangeInHopDongs() {
    this.eventSubscriber = this.eventManager.subscribe(
      'hopDongListModification',
      response => {
        this.loadLichSuDongTienBH();
        this.loadLichSuDongTienVL();
      }
    );
  }
  loadNhanVien() {
    this.nhanVienService.query().subscribe(
      (res: HttpResponse<NhanVien[]>) => {
        this.nhanViens = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  loadLichSuDongTienBH() {
    this.tungay = new Date();
    this.denngay = new Date();
    console.log(this.tungay);
    this.lichSuDongTienService.baoCao(DONGTIEN.DADONG, LOAIHOPDONG.BATHO, this.tungay, this.denngay).subscribe(
      (res: HttpResponse<LichSuDongTien[]>) => {
        this.lichSuDongTienBHs = res.body;
        this.lichSuDongTienBHs.forEach(element => {
          this.tongTienBH += element.sotien;
        });

      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  loadLichSuDongTienVL() {
    this.tungay = new Date();
    this.denngay = new Date();
    console.log(this.tungay);
    this.lichSuDongTienService.baoCao(DONGTIEN.DADONG, LOAIHOPDONG.VAYLAI, this.tungay, this.denngay).subscribe(
      (res: HttpResponse<LichSuDongTien[]>) => {
        this.lichSuDongTienVLs = res.body;
        this.lichSuDongTienVLs.forEach(element => {
          this.tongTienVL += element.sotien;
        });

      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  loadLichGhiNoTienBH() {
    this.tungay = new Date();
    this.denngay = new Date();
    this.ghiNoService.baoCao(LOAIHOPDONG.BATHO, this.tungay, this.denngay).subscribe(
      (res: HttpResponse<GhiNo[]>) => {
        this.ghiNoBHs = res.body;
        this.ghiNoBHs.forEach(element => {
          if (element.trangthai.toString() == 'NO') {
            this.tongTienNoBh += element.sotien;
          } else {
            this.tongTienTraBh += element.sotien;

          }

        });

      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );

  }
  loadLichGhiNoTienVL() {
    this.tungay = new Date();
    this.denngay = new Date();
    this.ghiNoService.baoCao(LOAIHOPDONG.VAYLAI, this.tungay, this.denngay).subscribe(
      (res: HttpResponse<GhiNo[]>) => {
        this.ghiNoVLs = res.body;
        this.ghiNoVLs.forEach(element => {
          if (element.trangthai.toString() == 'NO') {
            this.tongTienNoVl += element.sotien;
          } else {
            this.tongTienTraVl += element.sotien;

          }
        });

      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  loadBatHo() {
    this.tungay = new Date();
    this.denngay = new Date();
    this.batHoService.baoCao(this.tungay, this.denngay).subscribe(
      (res: HttpResponse<BatHo[]>) => {
        this.batHos = res.body;
        this.batHos.forEach(element => {
          this.tongTienBHs += element.tienduakhach;
        });

      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  loadVayLai() {
    this.tungay = new Date();
    this.denngay = new Date();
    this.vayLaiService.baoCao(this.tungay, this.denngay,0).subscribe(
      (res: HttpResponse<VayLai[]>) => {
        this.vayLais = res.body;
        this.vayLais.forEach(element => {
          this.tongTienVLs += element.tienvay;
        });

      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
  loadLichSuDongTienTraGoc() {
    this.tungay = new Date();
    this.denngay = new Date();
    console.log(this.tungay);
    this.lichSuDongTienService.baoCao(DONGTIEN.TRAGOC, LOAIHOPDONG.VAYLAI, this.tungay, this.denngay).subscribe(
      (res: HttpResponse<LichSuDongTien[]>) => {
        this.lichSuDongTienTraGoc = res.body;
        this.lichSuDongTienTraGoc.forEach(element => {
          this.tongTienTraGoc += element.sotien;
        });

      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  loadTienVon() {
    this.batHoService.quanLyVon().subscribe(
      (res: HttpResponse<string>) => {
        this.nguonVon = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  loadThuChi() {
    this.tungay = new Date();
    this.denngay = new Date();
    console.log(this.tungay);
    this.thuChiService.baoCao(this.tungay, this.denngay).subscribe(
      (res: HttpResponse<LichSuDongTien[]>) => {
        this.thuChis = res.body;
        this.thuChis.forEach(element => {
          if (element.thuchi.toString() == 'THU') {
            this.tienThu += element.sotien;
          } else if (element.thuchi.toString() == 'CHI') {
            this.tienChi += element.sotien;
          } else if (element.thuchi.toString() == 'GOPVON') {
            this.tienGopVon += element.sotien;
          } else if (element.thuchi.toString() == 'RUTVON') {
            this.tienRutVon += element.sotien;
          }
        });

      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

}
