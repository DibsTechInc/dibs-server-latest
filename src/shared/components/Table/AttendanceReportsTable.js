import propTypes from 'prop-types';
import { Box, Paper, Table, TableContainer, TableRow, TableCell, TableHead, TableBody } from '@mui/material';
import { useSelector } from 'store';

const ReportsTable = ({ headers }) => {
    const { reporting } = useSelector((state) => state.datatables);
    const { data } = reporting;
    return (
        <Box sx={{ width: '98%' }}>
            <Paper>
                <TableContainer sx={{ border: 1, borderRadius: 1, borderColor: '#cecbcb' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {headers.map((header) => (
                                    <TableCell key={header}>{header}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => {
                                const key = row[0];
                                return (
                                    <TableRow key={key}>
                                        {row.map((cell, i) => {
                                            const cellkey = `${key}-${i}`;
                                            if (i > 0 && i !== 5) {
                                                return <TableCell key={cellkey}>{cell}</TableCell>;
                                            }
                                            return null;
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};
ReportsTable.propTypes = {
    headers: propTypes.array
};
export default ReportsTable;
