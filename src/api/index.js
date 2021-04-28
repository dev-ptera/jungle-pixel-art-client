import * as UserEvents from '../constants/app-events';
import {emitter} from "../main";

//const API_ROOT = process.env.VUE_APP_API;


/*
export const getPaymentAddress = (pixelCount) =>
    axios
        .request({
            method: 'post',
            timeout: 4000,
            url: `${API_ROOT}/payment`,
            data: {
                pixelCount
            }
        })
        .then((response) => Promise.resolve(response.data.address))
        .catch((err) => Promise.reject(err.data)); */

export const getPaymentAddress = (pixels) => {
    // wss: protocol is equivalent of https:
    // ws:  protocol is equivalent of http:
    // You ALWAYS need to provide absolute address
    // I mean, you can't just use relative path like /echo
    //const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
    //const echoSocketUrl = socketProtocol + '//' + API_ROOT + '/echo/'
    const socket = new WebSocket('ws://localhost:3000/payment');

    console.log(pixels);
    socket.onopen = () => {
        const data = [];
        for (const key of pixels.keys()) {
            console.log(key);
            data.push(`${key},${pixels.get(key)}`)
        }

        socket.send(JSON.stringify(data));
    }

    socket.onmessage = (msg) => {
        if (msg.data) {
            const data = JSON.parse(msg.data);
            if (data.address) {
                emitter.emit(UserEvents.PAYMENT_ADDRESS, data.address);
            } else {
                emitter.emit(UserEvents.CHECKOUT_ERROR, data.error);
            }
        } else {
            emitter.emit(UserEvents.CHECKOUT_ERROR, 'An unknown error has occurred; please contact dev.ptera@gmail.com if this error continues.');
        }
    }
}
