import React from 'react';
import axios from "axios";
import {useCookies} from "react-cookie";
import Row from "./row";
import './index.css';
import 'react-swipeable-list/dist/styles.css';
import {SwipeableList, SwipeableListItem, SwipeAction, TrailingActions, Type as ListType} from "react-swipeable-list";

import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


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

    React.useEffect(() => {
        getTransactions();
    }, []);

    const deleteTransaction = (id) => {
        let should_delete = true;

        const CloseButton = ({ closeToast }) => {
            const close_and_cancel = () => {
                should_delete = false;
                closeToast();
            };

            return <span onClick={close_and_cancel}>Cancelar</span>;
        }

        const handleDelete = async () => {
            if (should_delete) {
                await axios.delete(
                    `${baseURL}/${id}`,
                    {headers: headers}
                );
                toast.success('Gasto eliminado', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            } else {
                await getTransactions();
            }
        }

        toast.info('Eliminando gasto', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            closeButton: CloseButton,
            onClose: () => handleDelete(),
        });
    }

    const trailingAction = (id) => (
        <TrailingActions>
            <SwipeAction destructive={true} onClick={() => deleteTransaction(id)}>
                <div style={{backgroundColor: "red"}}/>
            </SwipeAction>
        </TrailingActions>
    );

    return (
        <div className="row justify-content-md-center m-2">
            <ToastContainer/>
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