<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header">
                <div>
                    <div class="line-1">Well done, Picasso!</div>
                    <div class="line-2">Save your work below.</div>
                </div>
                <button type="button" class="btn-close material-icons material-icons-outlined" @click="close">
                    close
                </button>
            </header>

            <section class="modal-body">
                <canvas v-if="paymentAddress" id="qr-code"></canvas>
                <div v-if="!paymentAddress" id="loading-state">
                    <div class="loader"></div>
                </div>
                <div v-if="!paymentAddress" class="instructions">
                    Loading payment address
                </div>
                <div v-if="paymentAddress" class="instructions">
                    To share your work of art with the world, send <strong>{{ this.pixels.size }}</strong> bananos to:
                </div>
                <div class="payment-address">{{ this.paymentAddress }}</div>
            </section>

            <div style="display: flex; flex: 1 1 0"></div>

            <footer class="modal-footer">
                <a v-bind:href="openKalium()" style="width: 100%">
                    <button type="button" class="pay-button" :disabled="!paymentAddress">Pay in Kalium</button>
                </a>
            </footer>
        </div>
    </div>
</template>

<script>
import * as UserEvents from '../constants/app-events';
import { getPaymentAddress } from "../api";

export default {
    name: 'Checkout',
    methods: {
        close() {
            this.$emit('close');
        },
        openKalium() {
            return `ban:${this.paymentAddress}?amount=${this.pixels.size}`;
        },
    },
    data() {
        return {
            pixels: new Map(),
            paymentAddress: undefined,
        };
    },
    mounted() {
        this.emitter.on(UserEvents.CHECKOUT_PIXELS, (pixels) => {
            getPaymentAddress(pixels.size).then((address) => {
                this.pixels = pixels;
                this.paymentAddress = address;
                setTimeout(() => {
                    const QRCode = require('qrcode');
                    const canvas = document.getElementById('qr-code');
                    QRCode.toCanvas(canvas, this.paymentAddress, function (error) {
                        if (error) console.error(error);
                    });
                })
            }).catch((err) => {
                console.error(err);
            })
        });
    },
};
</script>

<style>
#qr-code {
    height: 180px !important;
    width: 180px !important;
    margin-bottom: 4px;
}
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background: #ffffff;
    box-shadow: 1px 1px 18px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    height: 450px;
    width: 300px;
    border-radius: 8px;
}

.modal-header .line-1 {
    font-size: 24px;
}
.modal-header .line-2 {
    color: #2a2a2e;
    font-size: 14px;
}

.modal-header,
.modal-footer {
    padding: 16px;
    display: flex;
}

.modal-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
    color: #438d43;
    justify-content: space-between;
}

.modal-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
    justify-content: flex-end;
}

.modal-body {
    color: #2a2a2e;
    position: relative;
    font-size: 14px;
    padding: 16px;
    padding-top: 0;
    text-align: center;
}

.payment-address {
    font-weight: 600;
    margin-top: 8px;
    word-break: break-all;
}

.btn-close {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-size: 20px;
    padding: 16px;
    cursor: pointer;
    font-weight: bold;
    color: #438d43;
    background: transparent;
}

.pay-button {
    color: white;
    background: #438d43;
    border: 1px solid #438d43;
    border-radius: 4px;
    height: 36px;
    font-weight: 600;
    letter-spacing: 0.5px;
    width: 100%;
}
.pay-button[disabled] {
    opacity: .5;
}

#loading-state {
    display: flex;
    margin-top: 80px;
    margin-bottom: 24px;
    justify-content: center;
    align-items: center;
}
.loader {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #438d43;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
