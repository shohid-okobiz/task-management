import axios from 'axios';

const BKASH_BASE_URL = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout';
const BKASH_APP_KEY = process.env.BKASH_APP_KEY || '';
const BKASH_APP_SECRET = process.env.BKASH_APP_SECRET || '';
const BKASH_USERNAME = process.env.BKASH_USERNAME || '';
const BKASH_PASSWORD = process.env.BKASH_PASSWORD || '';

let bkashToken: string | null = null;
let refreshToken: string | null = null;

async function grantToken() {
    const res = await axios.post(
        `${BKASH_BASE_URL}/token/grant`,
        {
            app_key: BKASH_APP_KEY,
            app_secret: BKASH_APP_SECRET
        },
        {
            headers: {
                username: BKASH_USERNAME,
                password: BKASH_PASSWORD,
                'Content-Type': 'application/json'
            }
        }
    );
    bkashToken = res.data.id_token;
    refreshToken = res.data.refresh_token;
    return res.data;
}

async function refreshBkashToken() {
    if (!refreshToken) throw new Error('No refresh token');
    const res = await axios.post(
        `${BKASH_BASE_URL}/token/refresh`,
        {
            app_key: BKASH_APP_KEY,
            app_secret: BKASH_APP_SECRET,
            refresh_token: refreshToken
        },
        {
            headers: {
                username: BKASH_USERNAME,
                password: BKASH_PASSWORD,
                'Content-Type': 'application/json'
            }
        }
    );
    bkashToken = res.data.id_token;
    refreshToken = res.data.refresh_token;
    return res.data;
}

async function createPayment(bookingId: string, amount: number) {
    if (!bkashToken) await grantToken();
    const res = await axios.post(
        `${BKASH_BASE_URL}/create`,
        {
            mode: '0011',
            payerReference: bookingId,
            callbackURL: `${process.env.SERVER_BASE_URL}/bkash/payment-callback`,
            amount: amount.toString(),
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: bookingId
        },
        {
            headers: {
                authorization: bkashToken,
                'x-app-key': BKASH_APP_KEY,
                'Content-Type': 'application/json'
            }
        }
    );
    return res.data;
}

async function executePayment(paymentID: string) {
    if (!bkashToken) await grantToken();
    const res = await axios.post(
        `${BKASH_BASE_URL}/execute`,
        { paymentID },
        {
            headers: {
                authorization: bkashToken,
                'x-app-key': BKASH_APP_KEY,
                'Content-Type': 'application/json'
            }
        }
    );
    return res.data;
}

async function queryPayment(paymentID: string) {
    if (!bkashToken) await grantToken();
    const res = await axios.get(
        `${BKASH_BASE_URL}/payment/status?paymentID=${paymentID}`,
        {
            headers: {
                authorization: bkashToken,
                'x-app-key': BKASH_APP_KEY,
                'Content-Type': 'application/json'
            }
        }
    );
    return res.data;
}

export default {
    grantToken,
    refreshBkashToken,
    createPayment,
    executePayment,
    queryPayment
};
