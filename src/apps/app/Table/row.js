import './row.css';

export default function Row(row) {
    const transaction = row.transaction;

    const formatCategory = (category) => {
        const category_logo_mapping = {
            '🏠 Departamento': "fa-solid fa-building",
            '🚗 Auto': 'fa-solid fa-car-side',
            '📱 Servicios': 'fa-solid fa-mobile',
            '❤️‍ Salud': 'fa-solid fa-heart-pulse',
            '🛒 Supermercado': 'fa-solid fa-cart-shopping',
            '☕ Meriendas & Comidas': 'fa-solid fa-mug-hot',
            '🐶 Mascota': 'fa-solid fa-paw',
            '🍿 Entretenimiento': 'fa-solid fa-ticket',
            '🎁 Regalos': 'fa-solid fa-gift'
        }
        return <div className={"categoryIcon"}>
            <i className={category_logo_mapping[category]}></i>
        </div>
    }

    // const formatDate = (date) => {
    //     date = new Date(date);
    //     // only_date format should be "25 de Abril"
    //     const only_date = date.toLocaleDateString('es-AR', {day: 'numeric', month: 'long'});
    //     // only_time format should be "14:30"
    //     const only_time = date.toLocaleTimeString('es-AR', {hour: '2-digit', minute: '2-digit'});
    //     return <div style={{}}>
    //         <div style={{fontWeight: 'bold', fontSize: '14px'}}>
    //             {only_date}
    //         </div>
    //         <div style={{fontWeight: 'normal', fontSize: '12px'}}>
    //             {only_time}
    //         </div>
    //     </div>
    // }

    // const formatCategory = (category, subcategory) => {
    //     return <div>
    //         <div style={{fontWeight: 'bold', fontSize: '14px'}}>
    //             {category}
    //         </div>
    //         <div style={{fontWeight: 'normal', fontSize: '12px'}}>
    //             {subcategory.substring(2)}
    //         </div>
    //     </div>
    // }

    const formatCurrencies = (amount) => {
        const usd = 'US$ ' + amount.USD?.toFixed(2);
        const ars = 'AR$ ' + amount.ARS?.toFixed(2);
        const eur = '€ ' + amount.EUR?.toFixed(2);
        const first_currency = ars || usd || eur;
        const second_currency = ars && (usd || eur) ? usd || eur : '';

        return <div>
            <div style={{fontWeight: 'bold', fontSize: '14px'}}>
                {first_currency}
            </div>
            <div style={{fontWeight: 'bold', fontSize: '12px', color: 'darkgreen'}}>
                {second_currency}
            </div>
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

    // <td className={"text-start"}>{formatDate(transaction.datetime)}</td>
    //             <td className={"text-start d-none d-sm-table-cell"}>{formatCategory(transaction.category, transaction.subcategory)}</td>
    //             <td className={"text-start"} style={{fontWeight: 'bold', fontSize: '14px'}}>{transaction.description}</td>
    //             <td className={"text-end"}>{formatCurrencies(transaction.amount)}</td>
    //             <td>
    //                 <button type="button" className="btn btn-outline-danger"><i className="fa-regular fa-trash-can"></i>
    //                 </button>
    //             </td>

    return (
        <div className={"row mb-2"}>
            <div className="col-2">
                {formatCategory(transaction.category)}
            </div>
            <div className="col-7 ms-2 justify-content-center align-self-center">
                <div className="row description">{transaction.description}</div>
                <div className="row datetime">{formatDate(transaction.datetime)}</div>
            </div>
            <div className="col">monto</div>
        </div>
    );

}