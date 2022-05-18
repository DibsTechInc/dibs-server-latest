import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import Button from '@mui/material/Button';
import getDetailedEventTransaction from 'helpers/transaction-history/get-detailed-event-transaction';
import DropButton from 'shared/components/TransactionHistory/Buttons/DropButton';

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
                        const { id } = row;
                        const rowData = getDetailedEventTransaction(row);
                        const { typeprop } = props;
                        if (!loading) {
                            return (
                                <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {rowData.tableRowData[0]}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        {rowData.tableRowData[1]}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        {rowData.tableRowData[2]}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        {rowData.tableRowData[3]}
                                    </TableCell>
                                    {typeprop === 'upcoming' ? (
                                        <TableCell component="th" scope="row" align="center">
                                            {rowData.tableRowData[4]}
                                        </TableCell>
                                    ) : (
                                        <TableCell component="th" scope="row" align="right">
                                            {rowData.tableRowData[4]}
                                        </TableCell>
                                    )}
                                    {typeprop === 'upcoming' ? (
                                        <TableCell align="right" sx={{ pr: 2.5 }}>
                                            <DropButton disabled={false} />
                                        </TableCell>
                                    ) : null}
                                </TableRow>
                            );
                        }
                        return <div>Loading...</div>;
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
