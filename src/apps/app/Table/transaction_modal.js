import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React from "react";
import {Form, InputGroup} from "react-bootstrap";
import BASE_URL from "../consts";
import axios from "axios";
import {useCookies} from "react-cookie";
import {Bounce, toast} from "react-toastify";

export default function TransactionModal(props) {
    const {
        selected_transaction,
        setSelectedTransaction,
        transactions,
        setTransactions,
        categories,
        headers
    } = props;

    const handleClose = () => setSelectedTransaction(null);

    const handleSave = async () => {
        axios.put(
            `${BASE_URL}/expenses/transaction`,
            selected_transaction,
            {headers: headers}
        ).then(r => console.log('Transaction updated'));
        handleClose()
        toast.success('Gasto actualizado', {
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

        // Now we need to update the transactions list without making a call
        const new_transactions = transactions.map((transaction) => {
            if (transaction.id === selected_transaction.id) {
                return selected_transaction;
            } else {
                return transaction;
            }
        });
        setTransactions(new_transactions);
    }

    const parseAmount = (amount, currency) => {
        console.log(amount)
        if (amount === '') {
            setSelectedTransaction({
                ...selected_transaction,
                amount: {
                    ...selected_transaction.amount,
                    [currency]: null
                }
            });
        } else {
            const new_amount = parseFloat(parseFloat(amount).toFixed(2));
            setSelectedTransaction({
                ...selected_transaction,
                amount: {
                    ...selected_transaction.amount,
                    [currency]: new_amount
                }
            });
        }
    }

    const deleteFile = (file_id) => {
        const new_files = selected_transaction.files.filter((file) => file.id !== file_id);
        setSelectedTransaction({
            ...selected_transaction,
            files: new_files
        });
    }

    const downloadFile = (file_id) => {
        axios.get(
            `${BASE_URL}/expenses/transaction/${selected_transaction.id}/file/${file_id}`,
            {headers: headers}
        ).then((response) => {
            const url = response.data;
            console.log(response)
            window.open(url);
        });
    }

    const addFile = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        axios.post(
            `${BASE_URL}/expenses/transaction/${selected_transaction.id}/file`,
            formData,
            {headers: headers}
        ).then((response) => {
            console.log(response)
            const new_files = selected_transaction.files.concat(response.data);
            setSelectedTransaction({
                ...selected_transaction,
                files: new_files
            });
        });
    }

    const changeFileName = (name, file_id) => {
        const new_files = selected_transaction.files.map((file) => {
            if (file.id === file_id) {
                return {
                    ...file,
                    name: name
                }
            } else {
                return file;
            }
        });
        setSelectedTransaction({
            ...selected_transaction,
            files: new_files
        });
    }

    return <Modal size="lg" show={selected_transaction} onHide={handleClose}>
        {
            selected_transaction &&
            <>
                <Modal.Header closeButton>
                    {
                        selected_transaction.id &&
                        <Modal.Title>Editar transacción</Modal.Title>
                    }
                    {
                        !selected_transaction.id &&
                        <Modal.Title>Nueva transacción</Modal.Title>
                    }
                </Modal.Header>
                <Modal.Body className={"text-start"}>
                    <div>
                        <Form>
                            <Form.Group className={"mb-3"}>
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    placeholder="Completar fecha"
                                    value={selected_transaction.datetime}
                                    onChange={(e) => setSelectedTransaction({
                                        ...selected_transaction,
                                        datetime: e.target.value
                                    })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Completar fecha"
                                    value={selected_transaction.description}
                                    onChange={(e) => setSelectedTransaction({
                                        ...selected_transaction, description: e.target.value
                                    })}
                                />
                            </Form.Group>

                            <Form.Group>
                                <div className="row">
                                    <div className="col-12 col-md-6 mb-2">
                                        <Form.Label>Categoría</Form.Label>
                                        <Form.Select
                                            aria-label="Default select example"
                                            value={selected_transaction.category}
                                            onChange={(e) => setSelectedTransaction({
                                                ...selected_transaction, category: e.target.value
                                            })}
                                        >
                                            {categories.map((category) => {
                                                return <option value={category.category}>{category.category}</option>
                                            })}
                                        </Form.Select>
                                    </div>

                                    <div className="col-12 col-md-6 mb-2">
                                        <Form.Label>Subcategoría</Form.Label>
                                        <Form.Select
                                            aria-label="Default select example"
                                            value={selected_transaction.subcategory}
                                            onChange={(e) => setSelectedTransaction({
                                                ...selected_transaction, subcategory: e.target.value
                                            })}
                                        >
                                            {categories.find((category) => category.category === selected_transaction.category)?.subcategories.map((subcategory) => {
                                                return <option value={subcategory}>{subcategory}</option>
                                            })}
                                        </Form.Select>
                                    </div>
                                </div>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Monto</Form.Label>
                                <div className="row">
                                    <div className="col-12 col-md-4 mb-3">
                                        <InputGroup>
                                            <InputGroup.Text>AR$</InputGroup.Text>
                                            <Form.Control
                                                type="number"
                                                value={selected_transaction.amount.ARS}
                                                onChange={(e) => parseAmount(e.target.value, 'ARS')}
                                            />
                                        </InputGroup>
                                    </div>
                                    <div className="col-12 col-md-4 mb-3">
                                        <InputGroup>
                                            <InputGroup.Text>US$</InputGroup.Text>
                                            <Form.Control
                                                type="number"
                                                value={selected_transaction.amount.USD}
                                                onChange={(e) => parseAmount(e.target.value, 'USD')}
                                            />
                                        </InputGroup>
                                    </div>
                                    <div className="col-12 col-md-4 mb-3">
                                        <InputGroup>
                                            <InputGroup.Text>€</InputGroup.Text>
                                            <Form.Control
                                                type="number"
                                                value={selected_transaction.amount.EUR}
                                                onChange={(e) => parseAmount(e.target.value, 'EUR')}
                                            />
                                        </InputGroup>
                                    </div>
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Archivos</Form.Label>
                                {
                                    selected_transaction.files &&
                                    selected_transaction.files.map((file, index) => {
                                        return <InputGroup className={"mb-2"}>
                                            <Form.Control
                                                type="text"
                                                value={file.name}
                                                onChange={(e) => changeFileName(e.target.value, file.id)}
                                            />
                                            <Button variant="outline-success" onClick={() => downloadFile(file.id)}>
                                                Descargar
                                            </Button>
                                            <Button variant="outline-danger" onClick={() => deleteFile(file.id)}>
                                                Eliminar
                                            </Button>
                                        </InputGroup>
                                    })
                                }

                                <Form.Control
                                    type="file"
                                    onChange={(e) => addFile(e.target.files[0])}
                                />
                            </Form.Group>

                        </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </>
        }
    </Modal>
}