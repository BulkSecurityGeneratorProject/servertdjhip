import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';

import { JhiLanguageHelper, Principal } from '../../shared';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html',
    styleUrls: [
        'main.component.scss'
    ]
})
export class JhiMainComponent implements OnInit {

    menuActive: boolean;
    activeMenuId: string;
    visibleSidebar1;
    constructor(
        private jhiLanguageHelper: JhiLanguageHelper,
        private router: Router,
        private principal: Principal,
    ) {
        
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = (routeSnapshot.data && routeSnapshot.data['pageTitle']) ? routeSnapshot.data['pageTitle'] : 'servertdjhipApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.jhiLanguageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));
            }
        });
    }
    
    isAuthenticated() {
        return this.principal.isAuthenticated();
        
    }
    
}

