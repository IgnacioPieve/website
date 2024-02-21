import React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {ThemeProvider, createTheme, Button} from '@mui/material';
import axios from "axios";

const baseURL = ' https://to29n2obk9.execute-api.us-east-1.amazonaws.com/transactions';

export default function Table() {
    const [transactions, setTransactions] = React.useState({});
    const [categories, setCategories] = React.useState([]);
    const [subcategories, setSubcategories] = React.useState({});

    const handleUpdate = async (transactions) => {
        const categories = [];
        const subcategories = {};
        for (const transaction of transactions) {
            if (!categories.includes(transaction.category)) {
                categories.push(transaction.category);
                subcategories[transaction.category] = [];
            }
            if (!subcategories[transaction.category].includes(transaction.subcategory)) {
                subcategories[transaction.category].push(transaction.subcategory);
            }
            transaction.amount_ARS = transaction.amount.ARS;
            transaction.amount_USD = transaction.amount.USD;
            transaction.datetime = new Date(transaction.datetime);
        }
        setTransactions(transactions);
        setCategories(categories);
        setSubcategories(subcategories);
    }

    const getTransactions = async () => {
        const response = await axios.get(baseURL);
        await handleUpdate(response.data);
    }

    React.useEffect(() => {
        getTransactions();
    }, []);


    const columns = [
        {
            headerName: 'Fecha',
            field: 'datetime',
            type: 'dateTime',
            editable: true,
            width: 150
        },
        {
            headerName: 'Categoría',
            field: 'category',
            type: 'singleSelect',
            editable: true,
            valueOptions: categories,
            width: 200
        },
        {
            headerName: 'Subcategoría',
            field: 'subcategory',
            type: 'singleSelect',
            editable: true,
            width: 175,
            valueOptions: ({row}) => subcategories[row.category],
        },
        {
            headerName: 'Descripción',
            field: 'description',
            editable: true,
            width: 175
        },
        {
            headerName: '$ARS',
            field: 'amount_ARS',
            editable: true,
            type: 'number',
            width: 100,
            valueFormatter: (params) => {
                if (params.value == null) {
                    return '';
                }
                return `$ ${params.value.toFixed(2)}`;
            },
        },
        {
            headerName: '$USD',
            field: 'amount_USD',
            editable: true,
            type: 'number',
            width: 100,
            valueFormatter: (params) => {
                if (params.value == null) {
                    return '';
                }
                return `$ ${params.value.toFixed(2)}`;
            },
        },

    ];

    const defaultMaterialTheme = createTheme();

    return (
        <div>
            <Button variant="contained" onClick={getTransactions}>Refresh</Button>
            <div style={{ height: 850, width: 950 }}>
                <ThemeProvider theme={defaultMaterialTheme}>
                    <DataGrid
                        columns={columns}
                        rows={transactions}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'datetime', sort: 'desc' }],
                            },
                        }}
                    />
                </ThemeProvider>
            </div>

        </div>
    );
};

