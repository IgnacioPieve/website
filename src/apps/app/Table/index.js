import React from 'react';
import axios from "axios";
import {useCookies} from "react-cookie";
import Row from "./row";
import './index.css';
import 'react-swipeable-list/dist/styles.css';
import {SwipeableList, SwipeableListItem, SwipeAction, TrailingActions, Type as ListType} from "react-swipeable-list";

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
    }

    React.useEffect(() => {
        getTransactions();
    }, []);

    const onButtonClick = (e, row) => deleteTransaction(row.id);

    const trailingAction = (id) => (
        <TrailingActions>
            <SwipeAction
                destructive={true}
                onClick={async () => await deleteTransaction(id)}
            >
                <div style={{backgroundColor: "red"}}>
                </div>
            </SwipeAction>
        </TrailingActions>
    );

    return (
        <div className="row justify-content-md-center m-2">
            <div className="col-12 col-md-6">
                <div className="row title m-2">Últimas transacciones</div>
                <SwipeableList fullSwipe={true} type={ListType.IOS} threshold={.01}>
                    {transactions.map((transaction) => {
                        return (
                            <SwipeableListItem trailingActions={trailingAction(transaction.id)}>
                                <Row key={transaction.id} transaction={transaction}/>
                            </SwipeableListItem>
                    )
                    })}
                </SwipeableList>;
            </div>
        </div>
    );
};