
import React from "react";
import {Form} from "react-bootstrap";

export default function Filters(props) {
    const {
        getTransactions,
        categories,
    } = props;

    const [filter, setFilter] = React.useState('');

    const filterTransactions = (e) => {
        setFilter(e.target.value);
        const filters = {
            category: e.target.value
        }
        getTransactions(filters);
    }

    const categories_options = categories.map((category) => category.category);

    return (
        <Form.Group className={"text-start"}>
            <Form.Label>Categoría</Form.Label>
            <Form.Select
                className="form-select"
                value={filter}
                onChange={filterTransactions}
            >
                <option value="all">Todas</option>
                {categories_options.map((category) => {
                    return <option key={category} value={category}>{category}</option>
                })}
            </Form.Select>
        </Form.Group>
    );
}