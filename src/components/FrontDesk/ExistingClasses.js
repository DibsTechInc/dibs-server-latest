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
    TableRow,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

// project imports

// assets
import DeleteIcon from '@mui/icons-material/Delete';

// table data
function createData(
    classTitle,
    defaultprice,
    classlength,
    defaultDescription,
    maxCapacity,
    typeOfClass,
    onlineStatus,
    waitlist,
    privacyStatus,
    showOnSchedule
) {
    return {
        classTitle,
        defaultprice,
        defaultDescription,
        maxCapacity,
        typeOfClass,
        waitlist,
        classlength,
        privacyStatus,
        showOnSchedule,
        onlineStatus
    };
}

const rows = [
    createData('FlexFormer', 38, 45, 'Get your fit on. Description.', 1, 'Series', 'Online Only'),
    createData('Conbody2', 42, 60, 'Get your fit on. Description.', 20, 'Group Class', 'In Person Only'),
    createData('Cool Class', 45, 45, 'Description', 25, 'Private', 'Both'),
    createData('Fitness', 38, 75, 'Description', 25, 'Group Class', 'In Person Only'),
    createData('Super fit', 38, 45, 'Description', 25, 'Private', 'In Person Only'),
    createData('Combine', 38, 45, 'Description', 30, 'Group Class', 'In Person Only'),
    createData('XClass2', 38, 45, 'Description', 25, 'Private', 'Online Only'),
    createData('XClass3', 38, 45, 'Description', 20, 'Private'),
    createData('XClass4', 38, 60, 'Description', 10, 'Group Class'),
    createData('ZClass5', 38, 45, 'Description', 10, 'Group Class'),
    createData('ZClass6', 38, 30, 'Description', 15, 'Group Class'),
    createData('ZClass7', 38, 45, 'Description', 20, 'Group Class'),
    createData('ZClass8', 38, 60, 'Description', 15, 'Group Class')
];

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

// table header
const headCells = [
    {
        id: 'classTitle',
        numeric: false,
        disablePadding: false,
        label: 'Class Title',
        leftAlignment: true
    },
    {
        id: 'defaultPrice',
        numeric: true,
        disablePadding: false,
        label: 'Default Price',
        leftAlignment: true
    },
    {
        id: 'classLength',
        numeric: true,
        disablePadding: false,
        label: 'Class Length',
        leftAlignment: true
    },
    {
        id: 'defaultDescriptions',
        numeric: false,
        disablePadding: false,
        label: 'Default Description',
        leftAlignment: true
    },
    {
        id: 'maxCapacity',
        numeric: true,
        disablePadding: false,
        label: 'Max Capacity',
        leftAlignment: true
    },
    {
        id: 'privacyStatus',
        numeric: true,
        disablePadding: false,
        label: 'Type Of Class',
        leftAlignment: true
    },
    {
        id: 'onlineStatus',
        numeric: true,
        disablePadding: false,
        label: 'In Person/Online',
        leftAlignment: true
    }
];

// ==============================|| TABLE - HEADER ||============================== //

function EnhancedTableHead({ order, orderBy, numSelected, rowCount, onRequestSort }) {
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
                {headCells.map((headCell) => (
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
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

// ==============================|| TABLE - HEADER TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }) => (
    <Toolbar
        sx={{
            p: 0,
            pl: 1,
            pr: 1,
            ...(numSelected > 0 && {
                color: (theme) => theme.palette.secondary.main
            })
        }}
    >
        {numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
                {numSelected} selected
            </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
                Nutrition
            </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {numSelected > 0 && (
            <Tooltip title="Delete">
                <IconButton size="large">
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        )}
    </Toolbar>
);

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

// ==============================|| TABLE - DATA TABLE ||============================== //

export default function EnhancedTable() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('classTitle');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelectedId = rows.map((n) => n.name);
            setSelected(newSelectedId);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Paper sx={{ width: '95%', mb: 2 }}>
            {/* table */}
            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                /** Make sure no display bugs if row isn't an OrderData object */
                                if (typeof row === 'number') return null;
                                const isItemSelected = isSelected(row.name);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.name)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.name}
                                        selected={isItemSelected}
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
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: (dense ? 33 : 53) * emptyRows
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
                rowsPerPageOptions={[5, 10, 25]}
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
