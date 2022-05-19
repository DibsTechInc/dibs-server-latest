import * as React from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import { Grid, Divider } from '@mui/material';

import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';
import { useSelector, useDispatch } from 'store';
import getCurrentClientInfo from 'actions/studios/users/getCurrentClientInfo';
import { setCurrentClientProfileStudioAdmin } from 'store/slices/currentclient';
import EmailPreferences from 'components/SubComponents/FrontDesk/AccountSettings/EmailPreferences';
import DisableAccount from 'components/SubComponents/FrontDesk/AccountSettings/DisableAccount';
import EmergencyContact from 'components/SubComponents/FrontDesk/AccountSettings/EmergencyContact';

// assets

// ==============================|| CLIENT ACCOUNT SETTINGS ||============================== //

const AccountSettings = () => {
    const [alreadyChecked, setAlreadyChecked] = React.useState(false);
    const [checkingNow, setCheckingNow] = React.useState(false);
    const { userid } = useParams();
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const dispatch = useDispatch();
    const [firstName, setFirstName] = React.useState('');
    const [ecName, setEcName] = React.useState('');
    const [ecEmail, setEcEmail] = React.useState('');
    const [ecPhone, setEcPhone] = React.useState('');
    React.useEffect(() => {
        const getClientInfo = async () => {
            setCheckingNow(true);
            await getCurrentClientInfo(userid, dibsStudioId).then((user) => {
                console.log(`user info is: ${JSON.stringify(user)}`);
                if (user !== 0) {
                    setFirstName(user.firstname);
                    setEcName(user.emergencycontactname);
                    setEcEmail(user.emergencycontactemail);
                    setEcPhone(user.emergencycontactphone);
                    dispatch(setCurrentClientProfileStudioAdmin({ id: userid, label: user.nameToDisplay, firstname: user.firstname }));
                }
            });
        };
        if (!alreadyChecked && !checkingNow) {
            getClientInfo();
        }
    }, [userid, dibsStudioId, alreadyChecked, checkingNow, dispatch]);
    const settingsTitle = `Account Settings for ${firstName}`;
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <SubCard title={settingsTitle}>
                    <Grid container spacing={2} sx={{ pl: 2, pt: 2 }}>
                        <Grid item xs={12} md={12}>
                            <EmailPreferences />
                        </Grid>
                        <Divider sx={{ borderColor: '#eeeeee', mb: 5, mt: 7, width: '90%' }} />
                        <Grid item xs={12} md={12}>
                            <EmergencyContact firstname={firstName} ecName={ecName} ecEmail={ecEmail} ecPhone={ecPhone} />
                        </Grid>
                        <Divider sx={{ borderColor: '#eeeeee', mb: 5, mt: 7, width: '90%' }} />
                        <Grid item xs={12} md={12}>
                            <DisableAccount />
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
        </Grid>
    );
};

export default AccountSettings;
