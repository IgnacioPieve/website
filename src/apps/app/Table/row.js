import './row.css';
import React from "react";

export default function Row(props) {
    const {
        transaction,
        setSelectedTransaction
    } = props;


    const formatCategory = (category) => {
        // const category_logo_mapping = {
        //     '🏠 Departamento': {
        //         '💰 Alquiler': 'fa-solid fa-building',
        //         '💰 Expensas': 'fa-solid fa-file-contract',
        //         '⚡ Servicios': 'fa-solid fa-bolt-lightning',
        //         '🛋️ Compras': 'fa-solid fa-building-circle-check',
        //         '🔧 Arreglos': 'fa-solid fa-building-circle-exclamation',
        //         '📃 Seguro': 'fa-solid fa-house-fire',
        //         '❓ Otros': 'fa-solid fa-building'
        //     },
        //     '🚗 Auto': {
        //         '⛽ Nafta': 'fa-solid fa-gas-pump',
        //         '📃 Seguro': 'fa-solid fa-file-invoice-dollar',
        //         '🅿️ Estacionamiento': 'fa-solid fa-square-parking',
        //         '🔧 Arreglos': 'fa-solid fa-wrench',
        //         '🚕 Transporte': 'fa-solid fa-taxi',
        //         '❓ Otros': 'fa-solid fa-car'
        //     },
        //     '📱 Servicios': {
        //         '🍿 Streaming': 'fa-brands fa-youtube',
        //         '💾 Almacenamiento': 'fa-solid fa-cloud',
        //         '💈 Peluquería': 'fa-solid fa-scissors',
        //         '❓ Otros': 'fa-solid fa-question'
        //     },
        //     '❤️‍ Salud': {
        //         '💊 Medicamentos': 'fa-solid fa-pills',
        //         '🦷 Odontología/Ortodoncia': 'fa-solid fa-tooth',
        //         '🩻 Estudios': 'fa-solid fa-x-ray',
        //         '❓ Otros': 'fa-solid fa-heart'
        //     },
        //     '🛒 Supermercado': {
        //         '💧 Agua': 'fa-solid fa-droplet',
        //         '🥩 Carne': 'fa-solid fa-drumstick-bite',
        //         '🥬 Verduras': 'fa-solid fa-carrot',
        //         '⭐ General': 'fa-solid fa-cart-shopping'
        //     },
        //     '☕ Meriendas & Comidas': {
        //         '☕ Café Take Away': 'fa-solid fa-mug-saucer',
        //         '☕ Salida a merendar': 'fa-solid fa-mug-hot',
        //         '🍽️ Salida a comer': 'fa-solid fa-utensils',
        //         '🍽️ Comida take away': 'fa-solid fa-motorcycle',
        //         '🍦 Helados/Postres': 'fa-solid fa-ice-cream',
        //     },
        //     '🐶 Mascota': {
        //         '🦴 Alimento': 'fa-solid fa-dog',
        //         '🪮 Peluquería': 'fa-solid fa-dog',
        //         '💊 Medicamentos': 'fa-solid fa-dog',
        //         '👩‍⚕️ Veterinario': 'fa-solid fa-dog',
        //         '❓ Otros': 'fa-solid fa-dog',
        //     },
        //     '🍿 Entretenimiento': {
        //         '🎥 Cine': 'fa-solid fa-film',
        //         '🎭 Teatro': 'fa-solid fa-masks-theater',
        //         '🎤 Recitales': 'fa-solid fa-ticket-simple',
        //         '🎮 Juegos': 'fa-solid fa-gamepad',
        //         '🎟️ Eventos': 'fa-solid fa-ticket-simple',
        //         '❓ Otros': 'fa-solid fa-ticket-simple'
        //     },
        //     '🎁 Regalos': {
        //         '💘 Sofi': 'fa-solid fa-gift',
        //         '🫂 Amigos': 'fa-solid fa-gift',
        //         '👪 Familia': 'fa-solid fa-gift'
        //     }
        // }

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

    const cleanText = (text) => {
        // Delete all characters that are not letters, numbers or spaces
        // return text.replace(/[^a-zA-Z0-9 ]/g, '');
        return text.replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
            ''
        )
            .replace(/\s+/g, ' ')
            .trim();
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
                <div className="row description">{cleanText(transaction.description)}</div>
                <div className="row datetime">{formatDate(transaction.datetime)}</div>
            </div>
            <div className="col justify-content-center align-self-center">
                {formatCurrencies(transaction.original_currency, transaction.amount)}
            </div>

        </div>
    );

}