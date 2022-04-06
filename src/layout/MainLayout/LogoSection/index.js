import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link } from '@mui/material';

// project imports
import { DASHBOARD_PATH } from 'config';
// import Logo from 'ui-component/Logo';
import Logo from 'ui-component/dibslogo.png';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <Link component={RouterLink} to={DASHBOARD_PATH}>
        {/* <Logo /> */}
        <img src={Logo} alt="Logo" height="25" />
    </Link>
);

export default LogoSection;
