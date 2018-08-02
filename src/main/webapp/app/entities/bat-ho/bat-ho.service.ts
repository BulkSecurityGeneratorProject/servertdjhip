import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { BatHo } from './bat-ho.model';
import { createRequestOption } from '../../shared';
import { LichSuDongTien } from '../lich-su-dong-tien';
export type EntityResponseType = HttpResponse<BatHo>;

@Injectable()
export class BatHoService {

    private resourceUrl = SERVER_API_URL + 'api/bat-hos';
    private daoHoUrl = SERVER_API_URL + 'api/bat-hos';
    private resourceUrlBatHoByCuaHang = SERVER_API_URL + 'api/bat-hos-by-cua-hang';
    // private resourceUrl =  SERVER_API_URL + 'api/bat-hos';
    private dongTien = 'dongtien';
    private resourceUrlTimBatHo = SERVER_API_URL + 'api/tim-bat-hos-by-ten-cmnd';
    constructor(private http: HttpClient) { }

    create(batHo: BatHo): Observable<EntityResponseType> {
        const copy = this.convert(batHo);
        return this.http.post<BatHo>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }
    daoHo(batHo: BatHo,id: number): Observable<EntityResponseType> {
        const copy = this.convert(batHo);
        return this.http.post<BatHo>(`${this.daoHoUrl}/${id}`, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(batHo: BatHo): Observable<EntityResponseType> {
        const copy = this.convert(batHo);
        return this.http.put<BatHo>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<BatHo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<BatHo[]>> {
        const options = createRequestOption(req);
        return this.http.get<BatHo[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<BatHo[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: BatHo = this.convertItemFromServer(res.body);
        return res.clone({ body });
    }

    private convertArrayResponse(res: HttpResponse<BatHo[]>): HttpResponse<BatHo[]> {
        const jsonResponse: BatHo[] = res.body;
        const body: BatHo[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({ body });
    }

    /**
     * Convert a returned JSON object to BatHo.
     */
    private convertItemFromServer(batHo: BatHo): BatHo {
        const copy: BatHo = Object.assign({}, batHo);
        return copy;
    }

    /**
     * Convert a BatHo to a JSON which can be sent to the server.
     */
    private convert(batHo: BatHo): BatHo {
        const copy: BatHo = Object.assign({}, batHo);
        return copy;
    }

    findBatHoByTenOrCMND(query: any): Observable<HttpResponse<BatHo[]>> {
        // const options = createRequestOption(req);
        return this.http
            .get<BatHo[]>(`${this.resourceUrlTimBatHo}/${query}`, {
                observe: 'response'
            })
            .map((res: HttpResponse<BatHo[]>) =>
                this.convertArrayResponse(res)
            );
    }

    // Tùng add
    findByCuaHangId(id: number): Observable<HttpResponse<BatHo[]>> {
        return this.http.get<BatHo[]>(`${this.resourceUrlBatHoByCuaHang}/${id}`, {observe: 'response' })
            .map((res: HttpResponse<BatHo[]>) => this.convertArrayResponse(res));
    }

}
