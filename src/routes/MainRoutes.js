import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// sample page routing
// const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const DashboardPage = Loadable(lazy(() => import('views/studio-admin/dashboard')));
const FrontDeskPage = Loadable(lazy(() => import('views/studio-admin/front-desk')));
const ReportingPage = Loadable(lazy(() => import('views/studio-admin/reporting')));

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
        }
    ]
};

export default MainRoutes;
