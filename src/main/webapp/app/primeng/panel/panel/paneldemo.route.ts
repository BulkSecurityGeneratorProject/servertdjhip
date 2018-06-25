import { Route } from '@angular/router';
import { UserRouteAccessService } from '../../../shared';
import { PanelDemoComponent } from './paneldemo.component';

export const panelDemoRoute: Route = {
    path: 'panel',
    component: PanelDemoComponent,
    data: {
        pageTitle: 'primeng.panel.panel.title'
    },
    canActivate: [UserRouteAccessService]
};
