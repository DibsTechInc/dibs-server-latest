import * as React from 'react';
import propTypes from 'prop-types';

// material-ui
import { Grid, Paper, TableContainer, TablePagination, Table, TableRow, TableCell, TableHead, TableBody } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';

// ================================|| UI TABS ||================================ //
const columns = [
    { id: 'datePayout', label: 'Date', minWidth: 100 },
    { id: 'properPayoutAmount', label: 'Amount', minWidth: 100 },
    { id: 'payoutId', label: 'Payout ID', minWidth: 100 },
    { id: 'formattedBankData', label: 'Account', minWidth: 100 },
    { id: 'stat', label: 'Status', minWidth: 100 }
];

const PayoutEntryPage = (props) => {
    const { listofpayouts } = props;
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12} sx={{ mt: 2, ml: 2 }}>
                <Paper sx={{ width: '95%', overflow: 'hidden' }}>
                    <TableContainer sx={{ overflowX: 'auto' }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow key="1">
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listofpayouts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, y) => {
                                    const newidforrow = `${row.payoutId}-${y}`;
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={newidforrow}>
                                            {columns.map((column, i) => {
                                                const newId = `${column.id}-${row.payoutId}-${i}`;
                                                const value = row[column.id];
                                                if (row.stat === 'In Transit') {
                                                    return (
                                                        <TableCell
                                                            key={newId}
                                                            align={column.align}
                                                            sx={{ color: '#b0aeae', fontStyle: 'italic' }}
                                                        >
                                                            {column.format && typeof value === 'number' ? column.format(value) : value}
                                                        </TableCell>
                                                    );
                                                }
                                                return (
                                                    <TableCell key={newId} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[25, 50, 100]}
                        component="div"
                        count={listofpayouts.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Grid>
        </Grid>
    );
};
PayoutEntryPage.propTypes = {
    // listofpayouts: propTypes.arrayOf(propTypes.shape({}))
    listofpayouts: propTypes.arrayOf(propTypes.any)
};

export default PayoutEntryPage;
