import PropTypes from 'prop-types';
import * as React from 'react';
import { useTheme, styled } from '@mui/material/styles';
// material-ui
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableSortLabel,
    TableRow,
    Switch
} from '@mui/material';
import { red, grey } from '@mui/material/colors';
import { visuallyHidden } from '@mui/utils';
import { useSelector } from 'store';
import ConfirmationModal from 'shared/components/Modal/ConfirmationModal';
import DeactivatePromocode from 'actions/studios/promocodes/deactivatePromocode';

const RedSwitch = styled(Switch)(() => ({
    '& .MuiSwitch-switchBase': {
        color: grey[400]
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: red[600]
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: red[600]
    },
    '& .MuiSwitch-switchBase + .MuiSwitch-track': {
        backgroundColor: grey[400]
    }
}));
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
                    Deactivate
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

// ==============================|| TABLE - DATA TABLE - CONFIGURED FOR PROMO CODE - CAN REFACTOR TO MAKE THIS MORE STRAIGHTFORWARD ||============================== //

export default function EnhancedDataTable({ tabletype, setRefreshPromoData }) {
    const [order, setOrder] = React.useState('asc');
    const { promocodes } = useSelector((state) => state.datatables);
    const { headers, data } = promocodes;
    const [orderBy, setOrderBy] = React.useState('1');
    const [page, setPage] = React.useState(0);
    // const [headers, setHeaders] = React.useState([]);
    const rows = data;
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [isEditingRowId, setIsEditingRowId] = React.useState(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [didConfirm, setDidConfirm] = React.useState(false);
    const [confirmationQuestion, setConfirmationQuestion] = React.useState(null);
    React.useEffect(() => {
        if (didConfirm) {
            // take the action
            DeactivatePromocode(isEditingRowId).then(() => {
                setDidConfirm(false);
                setConfirmationQuestion(null);
                setIsEditingRowId(null);
                setIsEditing(false);
                setRefreshPromoData(true);
            });
        }
    }, [didConfirm, isEditingRowId, setRefreshPromoData]);
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleDeactivate = (e, id, name) => {
        setIsEditingRowId(id);
        if (tabletype === 'promocode') setConfirmationQuestion(`Are you sure you want to deactivate promo code: ${name}?`);
        setIsEditing(true);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    return (
        <Paper sx={{ width: '95%', mb: 2 }}>
            <ConfirmationModal openStatus={isEditing} confirmationQuestion={confirmationQuestion} setDidConfirm={setDidConfirm} />
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
                                    <TableRow hover tabIndex={-1} key={row[0]}>
                                        <TableCell component="th" id={labelId} scope="row" padding="none" sx={{ pl: 3 }}>
                                            {row[1]}
                                        </TableCell>
                                        {row.map((column, index) => {
                                            if (index <= 1) return null;
                                            return (
                                                <TableCell key={`column-${index}`} align="left" sx={{ pl: 3.5 }}>
                                                    {column}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell align="center" sx={{ pr: 1 }}>
                                            <Box sx={{ justifyContent: 'center' }}>
                                                <RedSwitch
                                                    id={`${row[0]}-switch`}
                                                    checked={isEditingRowId === row[0]}
                                                    onChange={(e) => handleDeactivate(e, row[0], row[1])}
                                                    sx={{ align: 'center', mr: 1 }}
                                                />
                                            </Box>
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
    tabletype: PropTypes.string.isRequired,
    setRefreshPromoData: PropTypes.func
};
