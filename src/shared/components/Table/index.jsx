import moment from 'moment-timezone';
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import Button from '@mui/material/Button';
import EditButton from 'shared/components/TransactionHistory/Buttons/EditButton';
import RefundButton from 'shared/components/TransactionHistory/Buttons/RefundButton';

export default function DefaultTable(props) {
    const { headers, data, loading, noneString } = props;
    let alignment = 'left';
    return (
        <TableContainer component={Paper}>
            <Table sx={{ ml: 3, width: '95%' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {headers.map((header, index) => {
                            const lastIndex = headers.length - 1;
                            if (index === 1 || index === 2) alignment = 'center';
                            if (index === lastIndex) alignment = 'right';
                            return (
                                <TableCell key={header} align={alignment}>
                                    {header}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!loading && !data.length ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ pt: 8, pb: 8 }}>
                                {noneString}
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {data.map((row) => {
                        let typetoshow = '';
                        let disableRefundButton = true;
                        const { typeprop } = props;
                        const { id, createdAt, event, expiresAt, amount, retail, passPurchased, chargeAmount } = row;
                        if (event) typetoshow = event.name;
                        const amountPaid = `$${amount}`;
                        if (retail) typetoshow = retail.name;
                        if (passPurchased) typetoshow = passPurchased.studioPackage.normalizedName || passPurchased.studioPackage.name;
                        if (chargeAmount > 0) disableRefundButton = false;
                        const datetoshow = moment(createdAt).format('M/D/YYYY');
                        const expirationToShow = moment(expiresAt).format('M/D/YYYY');
                        let availableUses;
                        if (passPurchased) {
                            if (passPurchased.totalUses < 90) {
                                const numberUses = passPurchased.totalUses - passPurchased.usesCount;
                                if (numberUses === 1) {
                                    availableUses = `${numberUses} remains`;
                                } else {
                                    availableUses = `${numberUses} remain`;
                                }
                            } else {
                                availableUses = 'Unlimited';
                            }
                        }
                        if (passPurchased && typeprop === 'unavailablePacks') {
                            if (passPurchased.totalUses < 90) {
                                const numberUses = passPurchased.totalUses - passPurchased.usesCount;
                                availableUses = `${numberUses} forfeited`;
                                if (numberUses === 0) {
                                    availableUses = 'N/A';
                                }
                            } else {
                                availableUses = 'Unlimited';
                            }
                        }
                        const showExpiration = typeprop === 'availablePacks' || typeprop === 'unavailablePacks';
                        if (!loading) {
                            return (
                                <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {datetoshow}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        {typetoshow}
                                    </TableCell>
                                    {showExpiration ? <TableCell align="center">{expirationToShow}</TableCell> : null}
                                    <TableCell align="center">{amountPaid}</TableCell>
                                    {showExpiration ? <TableCell align="center">{availableUses}</TableCell> : null}
                                    {typeprop === 'purchases' ? (
                                        <TableCell align="right" sx={{ pr: 1 }}>
                                            <RefundButton disabled={disableRefundButton} />
                                        </TableCell>
                                    ) : (
                                        <TableCell align="right" sx={{ pr: 2 }}>
                                            <EditButton />
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        }
                        return <div>Loading</div>;
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
DefaultTable.propTypes = {
    headers: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool,
    typeprop: PropTypes.string,
    noneString: PropTypes.string
};
