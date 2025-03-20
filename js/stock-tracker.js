const FMP_API_KEY = 'yF07PFNvRxp03IKeG3Pr7hJEPvp4c0MO'; // Replace with your actual API key
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

const INDICES = [
    { symbol: 'SENSEX', name: 'BSE Sensex', country: 'India' },
    { symbol: 'NIFTY50', name: 'Nifty 50', country: 'India' },
    { symbol: '^GSPC', name: 'S&P 500', country: 'US' },
    { symbol: '^NDX', name: 'NASDAQ 100', country: 'US' }
];

async function fetchIndices() {
    const container = document.getElementById('indicesContainer');
    container.innerHTML = '';

    for (const index of INDICES) {
        try {
            const response = await fetch(`${BASE_URL}/quote/${index.symbol}?apikey=${FMP_API_KEY}`);
            const data = await response.json();

            if (data[0]) {
                const card = document.createElement('div');
                card.className = 'index-card';
                card.innerHTML = `
                    <h3>${index.name} (${index.country})</h3>
                    <p>Price: ${data[0].price.toFixed(2)}</p>
                    <p class="${data[0].change >= 0 ? 'positive' : 'negative'}">
                        Change: ${data[0].change.toFixed(2)} (${(data[0].changesPercentage).toFixed(2)}%)
                    </p>
                `;
                container.appendChild(card);
            }
        } catch (error) {
            console.error(`Error fetching ${index.name}:`, error);
        }
    }
}

async function searchStock() {
    const symbol = document.getElementById('stockSymbol').value.toUpperCase();
    const stockDetails = document.getElementById('stockDetails');
    stockDetails.style.display = 'none';

    try {
        const quoteResponse = await fetch(`${BASE_URL}/quote/${symbol}?apikey=${FMP_API_KEY}`);
        const quoteData = await quoteResponse.json();
        const historyResponse = await fetch(`${BASE_URL}/historical-price-full/${symbol}?serietype=line&apikey=${FMP_API_KEY}`);
        const historyData = await historyResponse.json();

        if (quoteData[0] && historyData.historical) {
            displayStockDetails(quoteData[0], historyData.historical);
        } else {
            alert('Stock not found. Please check the symbol.');
        }
    } catch (error) {
        console.error('Stock search error:', error);
        alert('Error fetching stock data. Please try again.');
    }
}

function displayStockDetails(quote, historicalPrices) {
    const stockDetails = document.getElementById('stockDetails');
    const stockTitle = document.getElementById('stockTitle');
    const stockInfo = document.getElementById('stockInfo');

    stockTitle.textContent = `${quote.symbol} - ${quote.name}`;
    stockInfo.innerHTML = `
        <p>Current Price: $${quote.price.toFixed(2)}</p>
        <p class="${quote.change >= 0 ? 'positive' : 'negative'}">
            Change: ${quote.change.toFixed(2)} (${quote.changesPercentage.toFixed(2)}%)
        </p>
        <p>Previous Close: $${quote.previousClose.toFixed(2)}</p>
        <p>Open: $${quote.open.toFixed(2)}</p>
        <p>Day High: $${quote.dayHigh.toFixed(2)}</p>
        <p>Day Low: $${quote.dayLow.toFixed(2)}</p>
    `;

    stockDetails.style.display = 'block';
    renderStockChart(historicalPrices);
}

function renderStockChart(prices) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    prices = prices.slice(0, 30).reverse();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: prices.map(p => p.date),
            datasets: [{
                label: 'Stock Price',
                data: prices.map(p => p.close),
                borderColor: 'blue',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

fetchIndices();
setInterval(fetchIndices, 300000);
