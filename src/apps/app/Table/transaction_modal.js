import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React from "react";
import {Form, InputGroup} from "react-bootstrap";
import BASE_URL from "../consts";
import axios from "axios";
import {Bounce, toast} from "react-toastify";

export default function TransactionModal(props) {
    const {
        selected_transaction,
        setSelectedTransaction,
        transactions,
        setTransactions,
        categories,
        sources,
        headers,
    } = props;

    const handleClose = () => setSelectedTransaction(null);

    function serializeDate(date) {
        // Obtener el desplazamiento de la zona horaria en minutos
        const offsetMinutes = date.getTimezoneOffset();
        date.setMinutes(date.getMinutes() - offsetMinutes);

        // Obtener el año, mes, día, hora, minuto y segundo
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Calcular la diferencia de tiempo en horas y minutos
        const offsetHours = Math.abs(offsetMinutes) / 60;
        const offsetSign = offsetMinutes < 0 ? '+' : '-';
        const offset = `${offsetSign}${String(Math.floor(offsetHours)).padStart(2, '0')}:${String(Math.abs(offsetMinutes % 60)).padStart(2, '0')}`;

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offset}`;
    }

    const handleUpdate = async () => {
        const response = await axios.put(
            `${BASE_URL}/expenses/transaction`,
            selected_transaction,
            {headers: headers}
        );

        const updated_transaction = response.data;

        // Now we need to update the transactions list without making a call
        const new_transactions = transactions.map((transaction) => {
            if (transaction.id === updated_transaction.id) {
                return updated_transaction;
            } else {
                return transaction;
            }
        });
        setTransactions(new_transactions);
    }


    const handleCreate = async () => {
        let amount
        let currency
        if (selected_transaction.amount.ARS !== null && selected_transaction.amount.ARS !== undefined) {
            amount = selected_transaction.amount.ARS;
            currency = 'ARS';
        } else if (selected_transaction.amount.USD !== null && selected_transaction.amount.USD !== undefined) {
            amount = selected_transaction.amount.USD;
            currency = 'USD';
        } else if (selected_transaction.amount.EUR !== null && selected_transaction.amount.EUR !== undefined) {
            amount = selected_transaction.amount.EUR;
            currency = 'EUR';
        }

        const serialized_transaction = {
            datetime: selected_transaction.datetime,
            category: selected_transaction.category,
            subcategory: selected_transaction.subcategory,
            source: selected_transaction.source,
            description: selected_transaction.description,
            amount: amount,
            currency: currency,
            notes: selected_transaction.notes
        }

        const response = await axios.post(
            `${BASE_URL}/expenses/transaction`,
            serialized_transaction,
            {headers: headers}
        );
        const added_transaction = response.data;
        setTransactions([added_transaction].concat(transactions));
    }

    const assert_fields = () => {
        const datetime_is_valid = selected_transaction.datetime !== '' && selected_transaction.datetime !== null;
        const description_is_valid = selected_transaction.description !== '' && selected_transaction.description !== null;
        const category_is_valid = selected_transaction.category !== '' && selected_transaction.category !== null;
        const subcategory_is_valid = selected_transaction.subcategory !== '' && selected_transaction.subcategory !== null;
        const source_is_valid = selected_transaction.source !== '' && selected_transaction.source !== null;
        const amounts_are_valid = (
            (selected_transaction.amount.ARS !== null && selected_transaction.amount.ARS !== undefined) ||
            (selected_transaction.amount.USD !== null && selected_transaction.amount.USD !== undefined) ||
            (selected_transaction.amount.EUR !== null && selected_transaction.amount.EUR !== undefined)
        );

        return (
            datetime_is_valid &&
            description_is_valid &&
            category_is_valid &&
            subcategory_is_valid &&
            source_is_valid &&
            amounts_are_valid
        );
    }

    const handleSave = async () => {
        if (!assert_fields()) {
            toast.error('Por favor completar todos los campos', {
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
            return;
        }

        selected_transaction.datetime = serializeDate(new Date(selected_transaction.datetime));
        let text
        if (selected_transaction.id) {
            text = 'Gasto actualizado'
            await handleUpdate();
        } else {
            text = 'Gasto creado'
            console.log(selected_transaction)
            await handleCreate();
        }
        handleClose()

        toast.success(text, {
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
    }

    const parseAmount = (amount, currency) => {
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

    const formatInputDatetime = (datetime, is_a_change = false) => {
        const datetime_obj = new Date(datetime);
        const offset = datetime_obj.getTimezoneOffset();
        if (!is_a_change) {
            datetime_obj.setMinutes(datetime_obj.getMinutes() - offset * 2);
            return datetime_obj.toISOString().split('.')[0];
        }
        return datetime_obj.toISOString().split('.')[0];
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
                                    value={formatInputDatetime(selected_transaction.datetime, false)}
                                    onChange={(e) => setSelectedTransaction({
                                        ...selected_transaction,
                                        datetime: formatInputDatetime(e.target.value, true)
                                    })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Completar descripción"
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
                                            value={selected_transaction.category}
                                            onChange={(e) => setSelectedTransaction({
                                                ...selected_transaction,
                                                category: e.target.value,
                                                subcategory: categories.find((category) => category.category === e.target.value).subcategories[0]
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

                            <Form.Group className={"mb-3"}>
                                <Form.Label>Fuente</Form.Label>
                                <Form.Select
                                    value={selected_transaction.source}
                                    onChange={(e) => setSelectedTransaction({
                                        ...selected_transaction, source: e.target.value
                                    })}
                                >
                                    {sources.map((source) => {
                                        return <option value={source}>{source}</option>
                                    })}
                                </Form.Select>
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
                                <Form.Label>Notas</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={selected_transaction.notes}
                                    onChange={(e) => setSelectedTransaction({
                                        ...selected_transaction, notes: e.target.value
                                    })}
                                />
                            </Form.Group>


                            {
                                selected_transaction.id &&
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
                            }

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