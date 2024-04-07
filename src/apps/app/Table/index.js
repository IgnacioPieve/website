import React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {Button} from '@mui/material';
import axios from "axios";
import {useCookies} from "react-cookie";
import Row from "./row";
import Head from "./head";

const baseURL = ' https://to29n2obk9.execute-api.us-east-1.amazonaws.com/expenses/transaction';

export default function Table() {
    const [cookies] = useCookies(['user'])
    const token = cookies.token;
    const headers = {'Authorization': `Bearer ${token}`}

    const [transactions, setTransactions] = React.useState([]);


    const getTransactions = async () => {
        const response = await axios.get(
            baseURL,
            {headers: headers}
        );
        setTransactions(response.data);
    }

    const deleteTransaction = async (id) => {
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
            // valueOptions: categories,
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
            // valueOptions: ({row}) => subcategories[row.category],
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
                <table className={"table table-hover"}>
                    <thead><Head></Head></thead>
                    <tbody>
                    {transactions.map((transaction) => <Row key={transaction.id} transaction={transaction}/>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};