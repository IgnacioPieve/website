import React from 'react';
import axios from "axios";
import {useCookies} from "react-cookie";
import Row from "./row";
import './index.css';
import 'react-swipeable-list/dist/styles.css';
import {SwipeableList, SwipeableListItem, SwipeAction, TrailingActions, Type as ListType} from "react-swipeable-list";

import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import TransactionModal from "./transaction_modal";
import BASE_URL from "../consts";
import Filters from "./filters";

const baseURL = BASE_URL + '/expenses/transaction';
const categoriesURL = BASE_URL + '/expenses/category';

export default function Table() {
    const [cookies] = useCookies(['user'])
    const token = cookies.token;
    const headers = {'Authorization': `Bearer ${token}`}

    const [transactions, setTransactions] = React.useState([]);
    const [selected_transaction, setSelectedTransaction] = React.useState(null);
    const [categories, setCategories] = React.useState([])

    const getTransactions = async (filters) => {
        const response = await axios.get(
            baseURL,
            {
                headers: headers,
                params: filters
            },
        );
        setTransactions(response.data);

        const categories_response = await axios.get(
            categoriesURL,
            {headers: headers}
        );
        const categories_dict = categories_response.data
        const categories_list = Object.keys(categories_dict).map((key) => {
            const subcategories = Object.keys(categories_dict[key]);
            return {
                category: key,
                subcategories: subcategories
            }
        });
        setCategories(categories_list);
    }

    React.useEffect(() => {
        getTransactions();
    }, []);

    const deleteTransaction = (id) => {
        let should_delete = true;

        const CloseButton = ({closeToast}) => {
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

    const addTransaction = () => {
        setSelectedTransaction({
            datetime: null,
            category: null,
            subcategory: null,
            description: null,
            amount: {},
        });
    }

    return (
        <div className="row justify-content-md-center m-2">
            <ToastContainer/>
            <div className="col-12 col-md-6 col-lg-3">
                <div className="row title m-2">Últimas transacciones</div>
                <div className="row m-2">
                    <div className="col">
                        <Filters
                            getTransactions={getTransactions}
                            categories={categories}
                        />
                    </div>
                    <div className="col">
                        <button
                            type="button"
                            class="btn btn-outline-success"
                            onClick={addTransaction}
                        >
                            Añadir
                        </button>
                    </div>
                </div>
                <SwipeableList fullSwipe={true} type={ListType.IOS} threshold={.01}>
                    {transactions.map((transaction) => {
                        return (
                            <SwipeableListItem trailingActions={trailingAction(transaction.id)}>
                                <Row transaction={transaction} setSelectedTransaction={setSelectedTransaction}/>
                            </SwipeableListItem>
                        )
                    })}
                </SwipeableList>

            </div>
            <TransactionModal
                selected_transaction={selected_transaction}
                setSelectedTransaction={setSelectedTransaction}
                transactions={transactions}
                setTransactions={setTransactions}
                categories={categories}
                headers={headers}
            />
        </div>
    );
};