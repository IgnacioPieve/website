import React, {forwardRef} from 'react';
import MaterialTable from 'material-table';
import { DataGrid } from '@mui/x-data-grid';
import {ThemeProvider, createTheme} from '@mui/material';


const Table = () => {
    const data = [
        {
            "id": 1,
            "amount.USD": 1.17,
            "subcategory": "Supermercado",
            "source": "🏦 Transferencia",
            "datetime": {
                "$date": "2024-02-07T22:03:00.000Z"
            },
            "category": "🛒 Supermercado",
            "description": "Jugo",
            "created_at": {
                "$date": "2024-02-08T22:04:11.746Z"
            },
            "currency": "ARS"
        },
        {
            "id": 2,
            "amount.ARS": 1350,
            "subcategory": "Supermercado",
            "source": "🏦 Transferencia",
            "datetime": {
                "$date": "2024-02-07T22:03:00.000Z"
            },
            "category": "🛒 Supermercado",
            "description": "Jugo",
            "created_at": {
                "$date": "2024-02-08T22:04:11.746Z"
            },
            "currency": "ARS"
        }
    ];
    const columns = [
        {headerName: '$ARS', field: 'amount.ARS', editable: true},
        {headerName: '$USD', field: 'amount.USD', editable: true},
        {headerName: 'Subcategory', field: 'subcategory', editable: true},
        {headerName: 'Source', field: 'source', editable: true},
        {headerName: 'Datetime', field: 'datetime.$date'},
        {headerName: 'Category', field: 'category'},
        {headerName: 'Description', field: 'description', editable: true},
        {headerName: 'Created At', field: 'created_at.$date', editable: true},
        {headerName: 'Currency', field: 'currency', editable: true},
    ];

    const defaultMaterialTheme = createTheme();

    return (
        <div>
            <ThemeProvider theme={defaultMaterialTheme}>
                <DataGrid
                    columns={columns}
                    rows={data}
                />
            </ThemeProvider>
        </div>
    );
};

export default Table;
