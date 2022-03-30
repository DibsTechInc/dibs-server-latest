import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import Opportunities from 'views/studio-admin/opportunities';

// sample page routing
// const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const DashboardPage = Loadable(lazy(() => import('views/studio-admin/dashboard')));
const FrontDeskPage = Loadable(lazy(() => import('views/studio-admin/front-desk')));
const ReportingPage = Loadable(lazy(() => import('views/studio-admin/reporting')));
const InstructorsPage = Loadable(lazy(() => import('views/studio-admin/instructors')));
const PayoutsPage = Loadable(lazy(() => import('views/studio-admin/payouts')));
const SettingsPage = Loadable(lazy(() => import('views/studio-admin/settings')));
const AccountPage = Loadable(lazy(() => import('views/studio-admin/account')));
const OpportunitiesPage = Loadable(lazy(() => import('views/studio-admin/opportunities')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/',
            element: <DashboardPage />
        },
        {
            path: '/dashboard',
            element: <DashboardPage />
        },
        {
            path: '/front-desk',
            element: <FrontDeskPage />
        },
        {
            path: '/reporting',
            element: <ReportingPage />
        },
        {
            path: '/opportunities',
            element: <OpportunitiesPage />
        },
        {
            path: '/class-schedule',
            element: <ReportingPage />
        },
        {
            path: '/instructors',
            element: <InstructorsPage />
        },
        {
            path: '/payouts',
            element: <PayoutsPage />
        },
        {
            path: '/settings',
            element: <SettingsPage />
        },
        {
            path: '/account',
            element: <AccountPage />
        }
    ]
};

export default MainRoutes;
