// import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function createData(name, value) {
    return { name, value };
}

const rows = [
    createData('Memberships', '$237'),
    createData('Packages', '$568'),
    createData('Singles', '$782'),
    createData('Retail', '$577'),
    createData('Gift Cards', '$100'),
    createData('Avg Revenue Per Spot', '$23.67'),
    createData('Avg Rev Per Member Spot', '$21.67')
];

export default function GlanceStats() {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 200 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ borderBottom: 0, paddingTop: 2, paddingLeft: 0 }}>Total Revenue</TableCell>
                        <TableCell align="right" sx={{ borderBottom: 0, paddingTop: 2, paddingRight: 1 }}>
                            <Typography variant="tableValue" color="main">
                                $3567
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row" sx={{ borderBottom: 0, paddingTop: 0.5, paddingLeft: 0 }}>
                                {row.name}
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: 0, paddingTop: 0.5, paddingRight: 1 }}>
                                <Typography variant="tableValue" color="main">
                                    {row.value}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
