import PropTypes from 'prop-types';
import * as React from 'react';
import moment from 'moment-timezone';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    CardContent,
    Grid,
    IconButton,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    Stack
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

// project imports
import Chip from 'ui-component/extended/Chip';
import MainCard from 'ui-component/cards/MainCard';
import ModalInstructorEditor from './ModalInstructorEditor';
import { formatPhone } from 'helpers/general';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

// table sort
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

// table header options
const headCells = [
    {
        id: 'firstName',
        numeric: false,
        label: 'Instructor Name',
        align: 'left'
    },
    {
        id: 'mobilephone',
        numeric: true,
        label: 'Phone Number',
        align: 'center',
        disablePadding: true
    },
    {
        id: 'accessLevel',
        numeric: true,
        label: 'Login Privileges',
        align: 'center',
        disablePadding: true
    }
];

// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({ order, orderBy, numSelected, onRequestSort, selected }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {numSelected > 0 && (
                    <TableCell padding="none" colSpan={6}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                    </TableCell>
                )}
                {numSelected <= 0 &&
                    headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                            sx={{
                                pl: 2
                            }}
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
                {numSelected <= 0 && (
                    <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
                        Edit
                    </TableCell>
                )}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    selected: PropTypes.array,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired
};

// ==============================|| TABLE HEADER TOOLBAR ||============================== //

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
            <Typography color="inherit" variant="h4">
                {numSelected} Selected
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
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        )}
    </Toolbar>
);

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

// ==============================|| INSTRUCTOR LIST ||============================== //

const InstructorList = (props) => {
    const theme = useTheme();
    const { list, setRefreshData, viewingActiveAccounts } = props;
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [isEditing, setIsEditing] = React.useState(false);
    const [rowEditing, setRowEditing] = React.useState(null);
    const [canLogin, setCanLogin] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [firstNameEditing, setFirstNameEditing] = React.useState('');
    const [lastNameEditing, setLastNameEditing] = React.useState('');
    const [emailEditing, setEmailEditing] = React.useState('');
    const [phoneEditing, setPhoneEditing] = React.useState('');
    const [instructorEditing, setInstructorEditing] = React.useState(false);
    const [loginStatusInstructor, setLoginStatusInstructor] = React.useState(false);
    const [adminEditing, setAdminEditing] = React.useState(false);
    const [adminStatus, setAdminStatus] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [rows, setRows] = React.useState([]);
    React.useEffect(() => {
        setRows(list);
    }, [list]);
    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        if (newString) {
            const newRows = rows.filter((row) => {
                let matches = true;

                const properties = ['firstname', 'lastname', 'email'];
                let containsQuery = false;

                properties.forEach((property) => {
                    if (row[property].toString().toLowerCase().includes(newString.toString().toLowerCase())) {
                        containsQuery = true;
                    }
                });

                if (!containsQuery) {
                    matches = false;
                }
                return matches;
                // trying to figure out where the search string is happening
            });
            setRows(newRows);
        } else {
            setRows(list);
        }
    };
    const titleOfSection = viewingActiveAccounts ? 'Active Instructor Accounts' : 'Disabled Instructor Accounts';
    const handleEditClick = (event, rowId, fname, lname, email, phone, canLogin, instructorOnly, admin) => {
        // console.log(`event target is: ${JSON.stringify(event.target)}`);
        setRowEditing(rowId);
        setFirstNameEditing(fname);
        setLastNameEditing(lname);
        setSearch('');
        setEmailEditing(email);
        setCanLogin(canLogin);
        setPhoneEditing(phone);
        setLoginStatusInstructor(instructorOnly);
        setAdminStatus(admin);
        setIsEditing(true);
    };
    const handleModalClose = () => {
        setIsEditing(false);
        setRowEditing(null);
        setSearch('');
    };
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <MainCard title={titleOfSection} content={false}>
            <CardContent>
                <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={6} sx={{ mt: 2, ml: 1, mb: 2 }}>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                )
                            }}
                            onChange={handleSearch}
                            placeholder="Search Accounts"
                            value={search}
                            size="small"
                            width="300px"
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <ModalInstructorEditor
                openStatus={isEditing}
                instructorID={rowEditing}
                firstname={firstNameEditing}
                lastname={lastNameEditing}
                canlogin={canLogin}
                loginStatusInstructor={loginStatusInstructor}
                adminStatus={adminStatus}
                email={emailEditing}
                phone={phoneEditing}
                handleModalClose={handleModalClose}
                setRefreshData={setRefreshData}
                viewingActiveAccounts={viewingActiveAccounts}
            />
            {/* table */}
            <TableContainer flex="1">
                <Table sx={{ ml: 2, width: '95%' }} aria-labelledby="tableTitle">
                    <EnhancedTableHead
                        theme={theme}
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                        selected={selected}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                /** Make sure no display bugs if row isn't an OrderData object */
                                if (typeof row === 'number') return null;
                                const isItemSelected = isSelected(row.name);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                const phoneToShow = formatPhone(row.mobilephone);
                                const { hasLogin } = row;
                                // eslint-disable-next-line camelcase
                                const { canlogin, instructor_only, admin } = hasLogin;
                                let loginPrivilege = 'None';
                                if (canlogin) {
                                    // eslint-disable-next-line camelcase
                                    if (instructor_only) loginPrivilege = 'Front Desk Only';
                                    if (admin) loginPrivilege = 'Admin';
                                    // eslint-disable-next-line camelcase
                                    if (!instructor_only && !admin) loginPrivilege = 'Front Desk Only';
                                }
                                const momentDeleted = moment(row.updatedAt).format('MM/DD/YYYY');
                                const deletedText = viewingActiveAccounts ? '' : `Deactivated on: ${momentDeleted}`;
                                let chipcolortoshow = canlogin && admin ? 'success' : 'warning';
                                if (!viewingActiveAccounts) chipcolortoshow = 'successDeactivated';
                                return (
                                    <TableRow
                                        hover
                                        // role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={index}
                                        onClick={(e) =>
                                            handleEditClick(
                                                e,
                                                row.id,
                                                row.firstname,
                                                row.lastname,
                                                row.email,
                                                row.mobilephone,
                                                canlogin,
                                                instructor_only,
                                                admin
                                            )
                                        }
                                        selected={isItemSelected}
                                    >
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            // onClick={(event) => handleClick(event, row.firstName)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <Stack>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}
                                                >
                                                    {' '}
                                                    {`${row.firstname} ${row.lastname}`}{' '}
                                                </Typography>
                                                <Typography variant="caption"> {row.email} </Typography>
                                                {!viewingActiveAccounts && <Typography variant="caption"> {deletedText} </Typography>}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center">{phoneToShow}</TableCell>
                                        <TableCell align="center">
                                            {canlogin && <Chip label={loginPrivilege} size="small" chipcolor={chipcolortoshow} />}
                                            {!canlogin && loginPrivilege}
                                        </TableCell>
                                        <TableCell align="center" sx={{ pr: 3 }}>
                                            <IconButton
                                                onClick={(e) =>
                                                    handleEditClick(
                                                        e,
                                                        row.id,
                                                        row.firstname,
                                                        row.lastname,
                                                        row.email,
                                                        row.mobilephone,
                                                        canlogin,
                                                        instructor_only,
                                                        admin
                                                    )
                                                }
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

            {/* table pagination */}
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </MainCard>
    );
};
InstructorList.propTypes = {
    list: PropTypes.array,
    setRefreshData: PropTypes.func,
    viewingActiveAccounts: PropTypes.bool
};

export default InstructorList;
