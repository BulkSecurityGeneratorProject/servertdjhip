/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { ServertdjhipTestModule } from '../../../test.module';
import { AnhTaiSanDialogComponent } from '../../../../../../main/webapp/app/entities/anh-tai-san/anh-tai-san-dialog.component';
import { AnhTaiSanService } from '../../../../../../main/webapp/app/entities/anh-tai-san/anh-tai-san.service';
import { AnhTaiSan } from '../../../../../../main/webapp/app/entities/anh-tai-san/anh-tai-san.model';
import { TaiSanService } from '../../../../../../main/webapp/app/entities/tai-san';

describe('Component Tests', () => {

    describe('AnhTaiSan Management Dialog Component', () => {
        let comp: AnhTaiSanDialogComponent;
        let fixture: ComponentFixture<AnhTaiSanDialogComponent>;
        let service: AnhTaiSanService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ServertdjhipTestModule],
                declarations: [AnhTaiSanDialogComponent],
                providers: [
                    TaiSanService,
                    AnhTaiSanService
                ]
            })
            .overrideTemplate(AnhTaiSanDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AnhTaiSanDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AnhTaiSanService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new AnhTaiSan(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.anhTaiSan = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'anhTaiSanListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new AnhTaiSan();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.anhTaiSan = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'anhTaiSanListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
