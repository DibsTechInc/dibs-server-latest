import propTypes from 'prop-types';
import { Box, Paper, Grid, Table, TableContainer, TableRow, TableCell, TableHead, TableBody } from '@mui/material';
import { useSelector } from 'store';

const SummaryForReport = ({ headers }) => {
    const { reporting } = useSelector((state) => state.datatables);
    const { summary } = reporting;
    const lastRowTitle = headers[headers.length - 1];
    const lastIndex = summary.length - 1;
    return (
        <Box sx={{ width: '98%' }}>
            <Paper>
                {summary && (
                    <Grid container>
                        {headers.map((row, i) => {
                            if (i < lastIndex) {
                                return (
                                    <Grid item key={i} xs={12} sx={{ mt: 1 }}>
                                        {row}: {summary[i]}
                                    </Grid>
                                );
                            }
                            return null;
                        })}
                        <Grid item xs={12} sx={{ mt: 1, fontWeight: 800 }}>
                            {lastRowTitle}: {summary[lastIndex]}
                        </Grid>
                    </Grid>
                )}
            </Paper>
        </Box>
    );
};
SummaryForReport.propTypes = {
    headers: propTypes.array
};
export default SummaryForReport;
