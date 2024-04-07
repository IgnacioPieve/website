export default function Row(row) {
    const transaction = row.transaction;

    const formatDate = (date) => {
        date = new Date(date);
        // only_date format should be "25 de Abril"
        const only_date = date.toLocaleDateString('es-AR', {day: 'numeric', month: 'long'});
        // only_time format should be "14:30"
        const only_time = date.toLocaleTimeString('es-AR', {hour: '2-digit', minute: '2-digit'});
        return <div style={{}}>
            <div style={{fontWeight: 'bold', fontSize: '16px'}}>
                {only_date}
            </div>
            <div style={{fontWeight: 'normal', fontSize: '14px'}}>
                {only_time}
            </div>
        </div>
    }

    const formatCategory = (category, subcategory) => {
        return <div>
            <div style={{fontWeight: 'bold', fontSize: '16px'}}>
                {category}
            </div>
            <div style={{fontWeight: 'normal', fontSize: '14px'}}>
                {subcategory.substring(2)}
            </div>
        </div>
    }

    const formatCurrencies = (amount) => {
        const usd = 'US$ ' + amount.USD?.toFixed(2);
        const ars = 'AR$ ' + amount.ARS?.toFixed(2);
        const eur = '€ ' + amount.EUR?.toFixed(2);
        const first_currency = ars || usd || eur;
        const second_currency = ars && (usd || eur) ? usd || eur : '';

        return <div>
            <div style={{fontWeight: 'bold', fontSize: '16px'}}>
                {first_currency}
            </div>
            <div style={{fontWeight: 'bold', fontSize: '14px', color: 'darkgreen'}}>
                {second_currency}
            </div>
        </div>
    }

    return (
        <tr>
            <td className={"text-start"}>{formatDate(transaction.datetime)}</td>
            <td className={"text-start"}>{formatCategory(transaction.category, transaction.subcategory)}</td>
            <td className={"text-start"} style={{fontWeight: 'bold', fontSize: '16px'}}>{transaction.description}</td>
            <td className={"text-end"}>{formatCurrencies(transaction.amount)}</td>
            <td>
                <button type="button" className="btn btn-outline-danger">Eliminar</button>
            </td>
        </tr>
    );

}