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
import * as getCredit from 'helpers/transaction-history/get-detailed-credit-transaction';

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
                            <TableCell colSpan={3} align="center" sx={{ pt: 8, pb: 8 }}>
                                {noneString}
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {data.map((row) => {
                        const { id, createdAt } = row;
                        const datetoshow = moment(createdAt).format('M/D/YYYY');
                        // if (!row.transaction) return null;
                        const itemName = getCredit.getCreditTransactionItemName(row);
                        const formattedAmount = getCredit.getFormattedAmount(row);
                        if (!loading) {
                            return (
                                <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {datetoshow}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        {itemName}
                                    </TableCell>
                                    <TableCell align="right">{formattedAmount}</TableCell>
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
    noneString: PropTypes.string
};
