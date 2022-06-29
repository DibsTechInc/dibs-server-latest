// material-ui
import { createTheme } from '@mui/material/styles';

// assets
import defaultColor from 'assets/scss/_themes-vars.module.scss';
import theme1 from 'assets/scss/_theme1.module.scss';
import theme2 from 'assets/scss/_theme2.module.scss';
import theme3 from 'assets/scss/_theme3.module.scss';
import theme4 from 'assets/scss/_theme4.module.scss';
import theme5 from 'assets/scss/_theme5.module.scss';
import theme6 from 'assets/scss/_theme6.module.scss';

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (navType, presetColor) => {
    let colors;
    switch (presetColor) {
        case 'theme1':
            colors = theme1;
            break;
        case 'theme2':
            colors = theme2;
            break;
        case 'theme3':
            colors = theme3;
            break;
        case 'theme4':
            colors = theme4;
            break;
        case 'theme5':
            colors = theme5;
            break;
        case 'theme6':
            colors = theme6;
            break;
        case 'default':
        default:
            colors = defaultColor;
    }

    return createTheme({
        palette: {
            mode: navType,
            common: {
                black: colors.darkPaper
            },
            primary: {
                light: navType === 'dark' ? colors.darkPrimaryLight : colors.primaryLight,
                main: navType === 'dark' ? colors.darkPrimaryMain : colors.primaryMain,
                dark: navType === 'dark' ? colors.darkPrimaryDark : colors.primaryDark,
                200: navType === 'dark' ? colors.darkPrimary200 : colors.primary200,
                400: colors.primary400,
                800: navType === 'dark' ? colors.darkPrimary800 : colors.primary800,
                button: colors.primaryButton
            },
            secondary: {
                light: navType === 'dark' ? colors.darkSecondaryLight : colors.secondaryLight,
                main: navType === 'dark' ? colors.darkSecondaryMain : colors.secondaryMain,
                notaslight: colors.secondaryNotAsLight,
                dark: navType === 'dark' ? colors.darkSecondaryDark : colors.secondaryDark,
                200: navType === 'dark' ? colors.darkSecondary200 : colors.secondary200,
                800: navType === 'dark' ? colors.darkSecondary800 : colors.secondary800,
                400: colors.secondary400,
                button: colors.primaryButton
            },
            chart: {
                light: colors.chartLight,
                main: colors.chartMain,
                dark: colors.chartDark,
                200: colors.chart200,
                800: colors.chart800
            },
            error: {
                light: colors.errorLight,
                main: colors.errorMain,
                dark: colors.errorDark
            },
            orange: {
                light: colors.orangeLight,
                main: colors.orangeMain,
                dark: colors.orangeDark
            },
            dibstextfield: {
                main: colors.dibsTextFieldMain
            },
            globalcolors: {
                cancel: colors.grey300,
                hover: colors.grey400,
                submit: colors.successDibsGreen,
                hoverSubmit: colors.submitGreen,
                option: colors.grey50,
                hoverOption: colors.packageLight
            },
            warning: {
                light: colors.warningLight,
                main: colors.warningMain,
                dark: colors.warningDark
            },
            success: {
                light: colors.successLight,
                200: colors.success200,
                main: colors.successMain,
                dark: colors.successDark,
                dibsgreen: colors.successDibsGreen
            },
            packages: {
                light: colors.packageLight,
                medium: colors.packageMedium,
                button: colors.packageButton
            },
            tableValues: {
                main: colors.tableValuesMain
            },
            tileHeaders: {
                header: colors.tileHeaders,
                main: colors.tileRevenueNumber
            },
            grey: {
                50: colors.grey50,
                100: colors.grey100,
                500: navType === 'dark' ? colors.darkTextSecondary : colors.grey500,
                550: navType === 'dark' ? colors.darkTextSecondary : colors.grey600,
                600: navType === 'dark' ? colors.darkTextTitle : colors.grey700,
                650: navType === 'dark' ? colors.darkTextTitle : colors.grey650,
                700: navType === 'dark' ? colors.darkTextPrimary : colors.grey700,
                900: navType === 'dark' ? colors.darkTextPrimary : colors.grey900
            },
            dark: {
                light: colors.darkTextPrimary,
                main: colors.darkLevel1,
                dark: colors.darkLevel2,
                800: colors.darkBackground,
                900: colors.darkPaper
            },
            text: {
                primary: navType === 'dark' ? colors.darkTextPrimary : colors.grey700,
                secondary: navType === 'dark' ? colors.darkTextSecondary : colors.grey500,
                clientProfile: navType === 'dark' ? colors.darkTextPrimary : colors.grey650,
                dark: navType === 'dark' ? colors.darkTextPrimary : colors.grey900,
                hint: colors.grey500
            },
            divider: navType === 'dark' ? colors.darkTextPrimary : colors.grey300,
            background: {
                paper: navType === 'dark' ? colors.darkLevel2 : colors.paper,
                default: navType === 'dark' ? colors.darkPaper : colors.paper
            }
        }
    });
};

export default Palette;
