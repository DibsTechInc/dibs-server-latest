import propTypes from 'prop-types';
import React, { useState } from 'react';
import { Grid, Button } from '@mui/material';
import { useSelector } from 'store';
import { CSVLink } from 'react-csv';

function ExportToCsv({ headers, nameOfReport }) {
    const [transactionData, setTransactionData] = useState([]);
    const { reporting } = useSelector((state) => state.datatables);
    const { csvData } = reporting;
    const getTransactionData = async () => {
        // 'api' just wraps axios with some setting specific to our app. the important thing here is that we use .then to capture the table response data, update the state, and then once we exit that operation we're going to click on the csv download link using the ref
        setTransactionData(csvData);
    };
    return (
        <Grid item xs={12}>
            {csvData && (
                <CSVLink headers={headers} data={csvData} filename={nameOfReport} style={{ textDecoration: 'none' }} target="_blank">
                    <Button onClick={getTransactionData} id="export-report">
                        Export to CSV
                    </Button>
                </CSVLink>
            )}
        </Grid>
    );
}
ExportToCsv.propTypes = {
    headers: propTypes.array,
    nameOfReport: propTypes.string
};
export default ExportToCsv;
