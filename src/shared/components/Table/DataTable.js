import PropTypes from 'prop-types';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';

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
import { useSelector } from 'store';

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
function newDescendingComparator(a, b, orderBy) {
    console.log(`a is: ${a}`);
    if (b < a) {
        return -1;
    }
    if (b > a) {
        return 1;
    }
    return 0;
}
const getNewComparator = (order, orderBy) =>
    order === 'desc' ? (a, b) => newDescendingComparator(a, b, orderBy) : (a, b) => -newDescendingComparator(a, b, orderBy);

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
    const theme = useTheme();
    return (
        <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                {headers.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.leftAlignment ? 'left' : 'right'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ pl: 3 }}
                    >
                        {headCell.disableSort ? (
                            <span>{headCell.label}</span>
                        ) : (
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
                        )}
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

export default function EnhancedDataTable({ tabletype }) {
    const [order, setOrder] = React.useState('asc');
    const { promocodes } = useSelector((state) => state.datatables);
    const { headers, data } = promocodes;
    const [orderBy, setOrderBy] = React.useState('classTitle');
    const [page, setPage] = React.useState(0);
    // const [headers, setHeaders] = React.useState([]);
    const rows = data;
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
    console.log(`empty rows = ${Math.max(0, (1 + page) * rowsPerPage - rows.length)}`);
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Paper sx={{ width: '95%', mb: 2 }}>
            {/* table */}
            <TableContainer>
                <Table sx={{ minWidth: 750 }}>
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
                                const labelId = `enhanced-table-${index}`;
                                return (
                                    <TableRow hover onClick={(event) => handleClick(event, row[0])} tabIndex={-1} key={row[0]}>
                                        <TableCell component="th" id={labelId} scope="row" padding="none" sx={{ pl: 3 }}>
                                            {row[1]}
                                        </TableCell>
                                        <TableCell align="left" sx={{ pl: 3.5 }}>
                                            {row[2]}
                                        </TableCell>
                                        <TableCell align="left" sx={{ pl: 3.5 }}>
                                            {row[3]}
                                        </TableCell>
                                        <TableCell sx={{ pl: 3.5 }} align="left">
                                            {row[4]}
                                        </TableCell>
                                        <TableCell sx={{ pl: 3.5 }} align="left">
                                            {row[5]}
                                        </TableCell>
                                        <TableCell sx={{ pl: 3.5 }} align="left">
                                            {row[6]}
                                        </TableCell>
                                        <TableCell sx={{ pl: 3.5 }} align="left">
                                            {row[7]}
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
                                    height: 1 * emptyRows
                                }}
                            >
                                <TableCell colSpan={headers.length + 1} />
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
    tabletype: PropTypes.string.isRequired
};
