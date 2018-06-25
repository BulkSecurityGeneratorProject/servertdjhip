import { Route } from '@angular/router';
import { UserRouteAccessService } from '../../../shared';
import { CalendarDemoComponent } from './calendardemo.component';

export const calendarDemoRoute: Route = {
    path: 'calendar',
    component: CalendarDemoComponent,
    data: {
        pageTitle: 'primeng.inputs.calendar.title'
    },
    canActivate: [UserRouteAccessService]
};
