import { Route } from '@angular/router';
import { UserRouteAccessService } from '../../../shared';
import { ButtonDemoComponent } from './buttondemo.component';

export const buttonDemoRoute: Route = {
    path: 'button',
    component: ButtonDemoComponent,
    data: {
        pageTitle: 'primeng.buttons.button.title'
    },
    canActivate: [UserRouteAccessService]
};
