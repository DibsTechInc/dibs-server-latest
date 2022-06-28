import * as React from 'react';
import DataTable from 'shared/components/Table/DataTable';
import { Grid } from '@mui/material';
import { useSelector, useDispatch } from 'store';
import GetActivePromoCodes from 'actions/studios/promocodes/getActivePromoCodes';
import { addPromoCodeHeaders, addPromoCodeData, setPromoNeedsRefresh } from 'store/slices/datatables';

// table header
const headCells = [
    {
        id: '1',
        numeric: false,
        disablePadding: false,
        label: 'Code',
        leftAlignment: true
    },
    {
        id: '2',
        numeric: false,
        disablePadding: false,
        label: 'Discount',
        leftAlignment: true,
        disableSort: true
    },
    {
        id: '3',
        numeric: true,
        disablePadding: false,
        label: 'Expiration Date',
        leftAlignment: true
    },
    {
        id: '4',
        numeric: false,
        disablePadding: false,
        label: 'Application',
        leftAlignment: true
    },
    {
        id: '5',
        numeric: true,
        disablePadding: false,
        label: 'Uses per person',
        leftAlignment: true
    },
    {
        id: '6',
        numeric: true,
        disablePadding: false,
        label: 'Maximum Uses',
        leftAlignment: true
    },
    {
        id: '7',
        numeric: false,
        disablePadding: false,
        label: 'First Time Only',
        leftAlignment: true
    }
    // {
    //     id: 'redemptions',
    //     numeric: true,
    //     disablePadding: false,
    //     label: 'Total Redemptions',
    //     leftAlignment: true
    // }
];

// ==============================|| TABLE - DATA TABLE ||============================== //

export default function PromoCodesTable() {
    const dispatch = useDispatch();
    const [doneLoadingData, setDoneLoadingData] = React.useState(false);
    const [refreshPromoData, setRefreshPromoData] = React.useState(false);
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const { promocodes } = useSelector((state) => state.datatables);
    const { needsRefresh } = promocodes;
    React.useEffect(() => {
        const fetchData = async () => {
            await GetActivePromoCodes(dibsStudioId)
                .then((result) => {
                    dispatch(addPromoCodeHeaders(headCells));
                    dispatch(addPromoCodeData(result.promodata));
                    setDoneLoadingData(true);
                    setRefreshPromoData(false);
                    dispatch(setPromoNeedsRefresh(false));
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        fetchData();
    }, [dibsStudioId, dispatch, refreshPromoData, needsRefresh]);
    return (
        <Grid container>
            {doneLoadingData ? <DataTable tabletype="promocode" setRefreshPromoData={setRefreshPromoData} /> : <div>Loading...</div>}
        </Grid>
    );
}
