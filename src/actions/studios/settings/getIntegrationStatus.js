import axios from 'axios';

// ==============================|| GET INTEGRATION STATUS FOR STUDIO (E.G. CLASSPASS) ||============================== //

export const GetIntegrationStatus = async (dibsStudioId) => {
    try {
        const statustosend = {
            classpass: false,
            gympass: false
        };
        await axios
            .post('/api/studio/settings/integrations', {
                dibsStudioId
            })
            .then((res) => {
                const { data } = res;
                const { integrationstatus } = data;
                const { classpass, gympass } = integrationstatus;
                statustosend.classpass = classpass;
                statustosend.gympass = gympass;
            });
        return { msg: 'success', statustosend };
    } catch (err) {
        console.log(`error getting integration status data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default GetIntegrationStatus;
