import * as UserEvents from '../constants/app-events';
import { emitter } from '../main';
import axios from 'axios';

const HTTP_API_ROOT = process.env.VUE_APP_HTTP_API;
const WS_API_ROOT = process.env.VUE_APP_WS_API;

export const getBoard = () =>
    axios
        .request({
            method: 'get',
            timeout: 4000,
            url: `${HTTP_API_ROOT}/board`,
        })
        .then((response) => {
            emitter.emit(UserEvents.COST_PER_PIXEL_LOADED, response.data.costPerPixel);
            return Promise.resolve(response.data)
        })
        .catch((err) => Promise.reject(err.data));

export const getPaymentAddress = (pixels) => {
    const socket = new WebSocket(`${WS_API_ROOT}/payment`);

    socket.onopen = () => {
        const data = [];
        for (const key of pixels.keys()) {
            data.push(`${key},${pixels.get(key)}`);
        }
        socket.send(JSON.stringify(data));
    };

    emitter.on(UserEvents.PAYMENT_WINDOW_CLOSED, () => {
        socket.close(4580);
    });

    socket.onmessage = (msg) => {
        if (msg.data) {
            const data = JSON.parse(msg.data);
            if (data.address) {
                emitter.emit(UserEvents.PAYMENT_ADDRESS, {
                    address: data.address,
                    raw: data.raw,
                    cost: data.cost
                });
            } else if (data.success) {
                emitter.emit(UserEvents.PAYMENT_SUCCESS, data.board);
            } else {
                emitter.emit(UserEvents.CHECKOUT_ERROR, data.error);
            }
        } else {
            emitter.emit(
                UserEvents.CHECKOUT_ERROR,
                'An unknown error has occurred; please contact dev.ptera@gmail.com if this error continues.'
            );
        }
    };
};
