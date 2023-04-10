const axios = require("axios");

async function main() {
    const currency = process.argv[2] ? process.argv[2].toUpperCase() : "USD";
    const url = "https://api.coindesk.com/v1/bpi/currentprice.json";

    try {

        const { data } = await axios.get(url);

        if (!data.bpi[currency]) {
            throw new Error(`Devise inconnue: ${currency}`);
        }

        const updatedAt = data.time.updated;
        const rate = data.bpi[currency].rate;
        console.log(`> 1 BTC = ${rate} ${currency} (last update: ${updatedAt})`);

    } catch (err) {
        console.log(err.toString());
    }

}

main();
