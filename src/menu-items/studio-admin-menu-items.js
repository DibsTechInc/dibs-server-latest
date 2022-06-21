// third-party
import { FormattedMessage } from 'react-intl';

// assets
// import { IconBrandChrome, IconHelp, IconSitemap } from '@tabler/icons';

// constant
// const icons = {
//     IconBrandChrome,
//     IconHelp,
//     IconSitemap
// };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const studioAdminMenu = {
    id: 'studio-admin-menu',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: <FormattedMessage id="dashboard" />,
            type: 'item',
            url: '/dashboard',
            // icon: icons.IconBrandChrome,
            breadcrumbs: false
        },
        {
            id: 'front-desk',
            title: <FormattedMessage id="front-desk" />,
            type: 'item',
            url: '/front-desk'
            // icon: icons.IconSitemap
        },
        {
            id: 'reporting',
            title: <FormattedMessage id="reporting" />,
            type: 'item',
            url: '/reporting'
            // icon: icons.IconHelp
        },
        // {
        //     id: 'opportunities',
        //     title: <FormattedMessage id="opportunities" />,
        //     type: 'item',
        //     url: '/opportunities'
        //     // icon: icons.IconHelp
        // },
        {
            id: 'class-schedule',
            title: <FormattedMessage id="class-schedule" />,
            type: 'item',
            url: '/class-schedule'
        },
        {
            id: 'instructors',
            title: <FormattedMessage id="instructors" />,
            type: 'item',
            url: '/instructors'
        },
        {
            id: 'payouts',
            title: <FormattedMessage id="payouts" />,
            type: 'item',
            url: '/payouts'
        },
        {
            id: 'account',
            title: <FormattedMessage id="account" />,
            type: 'item',
            url: '/account'
        },
        {
            id: 'settings',
            title: <FormattedMessage id="settings" />,
            type: 'item',
            url: '/settings'
        }
    ]
};

export default studioAdminMenu;
