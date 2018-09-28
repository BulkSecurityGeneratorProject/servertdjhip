import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BatHoAdminComponent } from './bat-ho/bat-ho.component'
import { BatHoDetailAdminComponent } from './bat-ho/bat-ho-detail/bat-ho-detail.component'
import { VayLaiAdminComponent } from './vay-lai/vay-lai.component'
import { VayLaiDetailAdminComponent } from './vay-lai/vay-lai-detail/vay-lai-detail.component'
import { KhachHangAdminComponent } from './khach-hang/khach-hang.component'
import { KhachHangDetailAdminComponent } from './khach-hang/khach-hang-detail/khach-hang-detail.component'
import { CuaHangAdminComponent } from './cua-hang/cua-hang.component'
import { CuaHangDetailAdminComponent } from './cua-hang/cua-hang-detail/cua-hang-detail.component'
import { NhanVienAdminComponent } from './nhan-vien/nhan-vien.component'
import { NhanVienDetailAdminComponent } from './nhan-vien/nhan-vien-detail/nhan-vien-detail.component'
import { ResetPasswordComponent } from './nhan-vien/nhan-vien-detail/reset-password/reset-password.component';
import { UserRouteAccessService } from '../../shared';
import { SoQuyTienMatComponent } from './bao-cao-ke-toan/so-quy-tien-mat/so-quy-tien-mat.component';
import { ChiTietTienLaiComponent } from './bao-cao-ke-toan/chi-tiet-tien-lai/chi-tiet-tien-lai.component';
import { ThongKeKeToanComponent } from './thong-ke-ke-toan/thong-ke-ke-toan.component';
import { NhatKyKeToanComponent } from './nhat-ky-ke-toan/nhat-ky-ke-toan.component'

const routes: Routes = [
  {
    path: 'bat-ho-admin', component: BatHoAdminComponent,
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_KETOAN'],
      pageTitle: 'servertdjhipApp.batHo.home.title'
    },
  },
  {
    path: 'nhat-ky-ke-toan', component: NhatKyKeToanComponent,
    data: {
      authorities: ['ROLE_KETOAN'],
      pageTitle: 'servertdjhipApp.nhatKy.home.title'
    },
  },
  {
    path: 'chi-tiet-tien-lai', component: ChiTietTienLaiComponent,
    data: {
      authorities: ['ROLE_KETOAN'],
      pageTitle: 'global.menu.chiTietTienLai'
    },
  },
  {
    path: 'so-quy-tien-mat', component: SoQuyTienMatComponent,
    data: {
      authorities: ['ROLE_KETOAN'],
      pageTitle: 'global.menu.soQuyTienMat'
    },
  },
  {
    path: 'thong-ke-ke-toan', component: ThongKeKeToanComponent,
    data: {
      authorities: ['ROLE_KETOAN'],
      pageTitle: 'global.menu.thongKe'
    },
  },
  {
    path: 'bat-ho-admin/:id', component: BatHoDetailAdminComponent,
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_KETOAN'],
      pageTitle: 'servertdjhipApp.batHo.home.title'
    },
  },
  {
    path: 'vay-lai-admin', component: VayLaiAdminComponent,
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_KETOAN'],
      pageTitle: 'servertdjhipApp.vayLai.home.title'
    },
  },
  {
    path: 'vay-lai-admin/:id', component: VayLaiDetailAdminComponent,
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_KETOAN'],
      pageTitle: 'servertdjhipApp.vayLai.home.title'
    },
  },
  {
    path: 'khach-hang-admin', component: KhachHangAdminComponent,
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_KETOAN'],
      pageTitle: 'servertdjhipApp.khachHang.home.title'
    },
  },
  {
    path: 'khach-hang-admin/:id', component: KhachHangDetailAdminComponent,
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_KETOAN'],
      pageTitle: 'servertdjhipApp.khachHang.home.title'
    },
  },
  {
    path: 'cua-hang-admin', component: CuaHangAdminComponent,
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_KETOAN'],
      pageTitle: 'servertdjhipApp.cuaHang.home.title'
    },
  },
  {
    path: 'cua-hang-admin/:id', component: CuaHangDetailAdminComponent,
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_KETOAN'],
      pageTitle: 'servertdjhipApp.cuaHang.home.title'
    },
  },
  {
    path: 'nhan-vien-admin', component: NhanVienAdminComponent,
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_KETOAN'],
      pageTitle: 'servertdjhipApp.nhanVien.home.title'
    },
  },
  {
    path: 'reset-password', component: ResetPasswordComponent,
    data: {
      authorities: ['ROLE_ADMIN','ROLE_STORE'],
      pageTitle: 'global.menu.account.password'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'nhan-vien-admin/:id', component: NhanVienDetailAdminComponent,
    data: {
      authorities: ['ROLE_ADMIN', 'ROLE_KETOAN'],
      pageTitle: 'servertdjhipApp.nhanVien.home.title'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuanLyRoutingModule { }
