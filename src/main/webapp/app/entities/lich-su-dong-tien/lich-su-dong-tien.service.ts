import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';
import { LichSuDongTien, DONGTIEN } from './lich-su-dong-tien.model';
import { createRequestOption } from '../../shared';
import { LOAIHOPDONG } from '../hop-dong';

export type EntityResponseType = HttpResponse<LichSuDongTien>;

@Injectable()
export class LichSuDongTienService {

    private resourceUrl = SERVER_API_URL + 'api/lich-su-dong-tiens';
    private baocaoUrl = SERVER_API_URL + 'api/bao-cao-lich-su-dong-tiens';
    private dongtien = 'dongtien';
    private lichSuDongTien = 'lichsudongtien';
    private donghopdong = SERVER_API_URL + 'api/dong-hop-dong';
    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(lichSuDongTien: LichSuDongTien): Observable<EntityResponseType> {
        const copy = this.convert(lichSuDongTien);
        return this.http.post<LichSuDongTien>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(lichSuDongTien: LichSuDongTien): Observable<EntityResponseType> {
        const copy = this.convert(lichSuDongTien);
        return this.http.put<LichSuDongTien>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }
    setDongTien(id: number): Observable<EntityResponseType> {
        return this.http.get<LichSuDongTien>(`${this.resourceUrl}/${this.dongtien}/${id}`, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<LichSuDongTien>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<LichSuDongTien[]>> {
        const options = createRequestOption(req);
        return this.http.get<LichSuDongTien[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<LichSuDongTien[]>) => this.convertArrayResponse(res));
    }
    findByHopDong(id: number): Observable<HttpResponse<LichSuDongTien[]>> {
        return this.http.get<LichSuDongTien[]>(`${this.resourceUrl}/${this.lichSuDongTien}/${id}`, { observe: 'response' })
            .map((res: HttpResponse<LichSuDongTien[]>) => this.convertArrayResponse(res));
    }
    baoCao(loaidongtien: DONGTIEN,loaihopdong: LOAIHOPDONG, start: Date, end: Date): Observable<HttpResponse<LichSuDongTien[]>> {
        let endd = this.convertDateToString(end);
        let startd = this.convertDateToString(start);
        return this.http.get<LichSuDongTien[]>(`${this.baocaoUrl}/${loaidongtien}/${loaihopdong}/${startd}/${endd}`, { observe: 'response' })
            .map((res: HttpResponse<LichSuDongTien[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
    dongHopDong(id: number): Observable<HttpResponse<any>> {
        return this.http.get<any>(`${this.donghopdong}/${id}`, { observe: 'response' });
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: LichSuDongTien = this.convertItemFromServer(res.body);
        return res.clone({ body });
    }

    private convertArrayResponse(res: HttpResponse<LichSuDongTien[]>): HttpResponse<LichSuDongTien[]> {
        const jsonResponse: LichSuDongTien[] = res.body;
        const body: LichSuDongTien[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({ body });
    }

    /**
     * Convert a returned JSON object to LichSuDongTien.
     */
    private convertItemFromServer(lichSuDongTien: LichSuDongTien): LichSuDongTien {
        const copy: LichSuDongTien = Object.assign({}, lichSuDongTien);
        copy.ngaybatdau = this.dateUtils
            .convertDateTimeFromServer(lichSuDongTien.ngaybatdau);
        copy.ngayketthuc = this.dateUtils
            .convertDateTimeFromServer(lichSuDongTien.ngayketthuc);
        copy.ngaygiaodich = this.dateUtils
            .convertDateTimeFromServer(lichSuDongTien.ngaygiaodich);
        return copy;
    }

    /**
     * Convert a LichSuDongTien to a JSON which can be sent to the server.
     */
    private convert(lichSuDongTien: LichSuDongTien): LichSuDongTien {
        const copy: LichSuDongTien = Object.assign({}, lichSuDongTien);

        // copy.ngaybatdau = this.dateUtils.toDate(lichSuDongTien.ngaybatdau);

        // copy.ngayketthuc = this.dateUtils.toDate(lichSuDongTien.ngayketthuc);
        // copy.ngaygiaodich = this.dateUtils.toDate(lichSuDongTien.ngaygiaodich);
        return copy;
    }
    private convertDateToString(d: Date): String {

        let m = d.getMonth() + 1;
        let mm = m < 10 ? '0' + m : m;
        let day = d.getDate();
        let sday = day < 10 ? '0' + day : day;

        return d.getFullYear() + ' ' + mm + ' ' + sday;

    }
}
