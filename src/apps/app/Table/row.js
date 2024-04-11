import './row.css';
import React from "react";

export default function Row(props) {
    const {
        transaction,
        setSelectedTransaction
    } = props;


    const formatCategory = (category) => {
        const category_logo_mapping = {
            '🏠 Departamento': "fa-solid fa-building",
            '🚗 Auto': 'fa-solid fa-car-side',
            '📱 Servicios': 'fa-solid fa-mobile',
            '❤️‍ Salud': 'fa-solid fa-heart-pulse',
            '🛒 Supermercado': 'fa-solid fa-cart-shopping',
            '☕ Meriendas & Comidas': 'fa-solid fa-utensils',
            '🐶 Mascota': 'fa-solid fa-paw',
            '🍿 Entretenimiento': 'fa-solid fa-ticket',
            '🎁 Regalos': 'fa-solid fa-gift'
        }
        return <div className={"categoryIcon"}>
            <i className={category_logo_mapping[category]}></i>
        </div>
    }

    const formatCurrencies = (original_currency, amount) => {
        const usd = 'US$ ' + amount.USD?.toFixed(2);
        const ars = 'AR$ ' + amount.ARS?.toFixed(2);
        const eur = '€ ' + amount.EUR?.toFixed(2);

        const currencies = {
            'USD': amount.USD ? usd : null,
            'ARS': amount.ARS ? ars : null,
            'EUR': amount.EUR ? eur : null,
        }

        const first_currency = currencies[original_currency];
        const second_currency = Object.entries(currencies).filter(([key, value]) => key !== original_currency)[0][1];

        return <div>
            <div className="first_currency">{first_currency}</div>
            {second_currency && <div className="second_currency">{second_currency}</div>}
        </div>
    }

    const formatDate = (date) => {
        // Input "2024-04-07T20:14:00"
        // Output "24 Mar 2024, 18:00"
        const date_obj = new Date(date);
        const day = date_obj.getDate();
        const month = date_obj.toLocaleString('default', {month: 'short'});
        const year = date_obj.getFullYear();
        const hours = date_obj.getHours().toString().padStart(2, '0');
        const minutes = date_obj.getMinutes().toString().padStart(2, '0');

        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    }

    const select_transaction = () => {
        setSelectedTransaction(transaction);
    }

    return (
        <div className={"row p-2 transaction"} style={{width: '100%'}} onClick={select_transaction}>

            <div className="col-2">
                {formatCategory(transaction.category)}
            </div>
            <div className="col-5 ms-3 justify-content-center align-self-center">
                <div className="row description">{transaction.description}</div>
                <div className="row datetime">{formatDate(transaction.datetime)}</div>
            </div>
            <div className="col justify-content-center align-self-center">
                {formatCurrencies(transaction.original_currency, transaction.amount)}
            </div>

        </div>
    );

}