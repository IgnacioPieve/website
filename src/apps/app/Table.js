import React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {Button} from '@mui/material';
import axios from "axios";
import {useCookies} from "react-cookie";

const baseURL = ' https://to29n2obk9.execute-api.us-east-1.amazonaws.com/transactions';

export default function Table() {
    const [cookies] = useCookies(['user'])
    const token = cookies.token;

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

    const deleteTransaction = async (id) => {
        const headers = {'Authorization': `Bearer ${token}`}
        await axios.delete(
            `${baseURL}/${id}`,
            {headers: headers}
        );
        getTransactions();
    }

    React.useEffect(() => {
        getTransactions();
    }, []);

    const onButtonClick = (e, row) => {
        deleteTransaction(row.id);
    };

    const columns = [
        {
            headerName: 'Fecha',
            field: 'datetime',
            type: 'dateTime',
            editable: true,
            flex: 1.5,
            minWidth: 150
        },
        {
            headerName: 'Categoría',
            field: 'category',
            type: 'singleSelect',
            editable: true,
            valueOptions: categories,
            flex: 2,
            minWidth: 200
        },
        {
            headerName: 'Subcategoría',
            field: 'subcategory',
            type: 'singleSelect',
            editable: true,
            flex: 1.75,
            minWidth: 175,
            valueOptions: ({row}) => subcategories[row.category],
        },
        {
            headerName: 'Descripción',
            field: 'description',
            editable: true,
            flex: 1.75,
            minWidth: 175
        },
        {
            headerName: '$ARS',
            field: 'amount_ARS',
            editable: true,
            type: 'number',
            flex: 1,
            minWidth: 100,
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
            flex: 1,
            minWidth: 100,
            valueFormatter: (params) => {
                if (params.value == null) {
                    return '';
                }
                return `$ ${params.value.toFixed(2)}`;
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
                return (
                    <Button
                        onClick={(e) => onButtonClick(e, params.row)}
                        variant="contained"
                    >
                        Delete
                    </Button>
                );
            }
        }
    ];

    return (
        <div style={{width: '100%'}}>
            <div className="container text-center" style={{width: '100%'}}>
                <Button variant="contained" onClick={getTransactions}>Refresh</Button>
                <div style={{height: 850}}>
                    <DataGrid
                        columns={columns}
                        rows={transactions}
                        initialState={{
                            sorting: {
                                sortModel: [{field: 'datetime', sort: 'desc'}],
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    )
        ;
};