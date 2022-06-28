import PropTypes from 'prop-types';
import * as React from 'react';

// material-ui
import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableSortLabel,
    TableRow
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { visuallyHidden } from '@mui/utils';

// table filter
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const getComparator = (order, orderBy) =>
    order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
// ==============================|| TABLE - HEADER ||============================== //

// function EnhancedTableHead({ order, orderBy, numSelected, rowCount, onRequestSort }) {
function EnhancedTableHead({ order, orderBy, onRequestSort, headers }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {/* <TableCell padding="checkbox" sx={{ pl: 3 }}>
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts'
                            }}
                        />
                    </TableCell> */}
                {headers.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.leftAlignment ? 'left' : 'right'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ pl: 3 }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
                    Edit
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    // numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    // rowCount: PropTypes.number.isRequired
    headers: PropTypes.array.isRequired
};

// ==============================|| TABLE - DATA TABLE ||============================== //

export default function EnhancedDataTable({ rows, headers }) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('classTitle');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleClick = (event, name) => {
        console.log(name);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Paper sx={{ width: '95%', mb: 2 }}>
            {/* table */}
            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        order={order}
                        headers={headers}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                /** Make sure no display bugs if row isn't an OrderData object */
                                if (typeof row === 'number') return null;
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.classTitle)}
                                        tabIndex={-1}
                                        key={row.classTitle}
                                    >
                                        {/* <TableCell padding="checkbox" sx={{ pl: 3 }}>
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId
                                                    }}
                                                />
                                            </TableCell> */}
                                        <TableCell component="th" id={labelId} scope="row" padding="none" sx={{ pl: 3 }}>
                                            {row.classTitle}
                                        </TableCell>
                                        <TableCell align="left" sx={{ pl: 3.5 }}>
                                            ${row.defaultprice}
                                        </TableCell>
                                        <TableCell align="left" sx={{ pl: 3.5 }}>
                                            {row.classlength} mins
                                        </TableCell>
                                        <TableCell sx={{ pl: 3.5 }} align="left">
                                            {row.defaultDescription}
                                        </TableCell>
                                        <TableCell sx={{ pl: 3.5 }} align="left">
                                            {row.maxCapacity}
                                        </TableCell>
                                        <TableCell sx={{ pl: 3.5 }} align="left">
                                            {row.typeOfClass}
                                        </TableCell>
                                        <TableCell sx={{ pl: 3.5 }} align="left">
                                            {row.onlineStatus}
                                        </TableCell>
                                        <TableCell align="center" sx={{ pr: 3 }}>
                                            <IconButton
                                                // onClick={(e) =>
                                                //     handleEditClick(
                                                //         e,
                                                //         row.id,
                                                //         row.firstname,
                                                //         row.lastname,
                                                //         row.email,
                                                //         row.mobilephone,
                                                //         canlogin,
                                                //         instructor_only,
                                                //         admin
                                                //     )
                                                // }
                                                color="secondary"
                                                size="large"
                                            >
                                                <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 53 * emptyRows
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* table data */}
            <TablePagination
                rowsPerPageOptions={[15, 30, 50]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
EnhancedDataTable.propTypes = {
    rows: PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired
};
