<template>
    <div class="modal-backdrop">
        <div class="modal">
            <header class="modal-header" v-if="!paymentSuccess && !error">
                <div>
                    <div class="line-1">Well done, Picasso!</div>
                    <div class="line-2">Save your work below.</div>
                </div>
                <button type="button" class="x-button material-icons material-icons-outlined" @click="close">
                    close
                </button>
            </header>

            <section v-if="paymentSuccess" class="modal-body">
                <div class="material-icons material-icons-outlined empty-state-icon">check_circle</div>
                <div class="empty-state-title">Success</div>
                <div class="empty-state-description">
                    Your work of art has been saved & added to the collection. You can now close this window.
                </div>
            </section>

            <section v-if="!paymentSuccess && !error" class="modal-body">
                <canvas v-if="paymentAddress" id="qr-code"></canvas>
                <div v-if="!paymentAddress" class="loading-state">
                    <div class="loader"></div>
                </div>
                <div v-if="!paymentAddress" class="instructions">Loading payment address</div>
                <div v-if="paymentAddress" class="instructions">
                    To share your work of art with the world, send <strong>{{ cost }}</strong> banano to:
                </div>
                <div class="payment-address">{{ paymentAddress }}</div>
                <div class="timeout">
                    This QR code will expire in <strong>{{ timeRemainingSeconds }}</strong> seconds.
                </div>
            </section>

            <section v-if="error" class="modal-body">
                <div style="font-size: 64px">Error</div>
                <div v-if="error" class="instructions">{{ error }}</div>
            </section>

            <footer class="modal-footer">
                <a v-if="!paymentSuccess && !error" v-bind:href="openKalium()" style="width: 100%">
                    <button type="button" class="footer-button" :disabled="!paymentAddress">Pay in Kalium</button>
                </a>
                <button v-if="paymentSuccess || error" @click="close" type="button" class="footer-button">Close</button>
            </footer>
        </div>
    </div>
</template>

<script>
import * as UserEvents from '../constants/app-events';
import { getPaymentAddress } from '../api';

export default {
    name: 'Checkout',
    methods: {
        close() {
            this.pixels = undefined;
            this.cost = undefined;
            this.error = undefined;
            this.rawAmount = undefined;
            this.paymentAddress = undefined;
            this.paymentSuccess = undefined;
            this.timeRemainingSeconds = undefined;
            this.emitter.emit(UserEvents.PAYMENT_WINDOW_CLOSED);
            this.$emit('close');
        },
        openKalium() {
            return `ban:${this.paymentAddress}?amount=${this.rawAmount}`;
        },
    },
    data() {
        return {
            pixels: new Map(),
            error: undefined,
            cost: undefined,
            paymentSuccess: undefined,
            paymentAddress: undefined,
            rawAmount: undefined,
            timeRemainingSeconds: undefined,
        };
    },
    mounted() {
        this.emitter.on(UserEvents.CHECKOUT_ERROR, (error) => {
            this.error = error;
        });
        this.emitter.on(UserEvents.PAYMENT_SUCCESS, () => {
            this.paymentSuccess = true;
        });
        this.emitter.on(UserEvents.CHECKOUT_PIXELS, (pixels) => {
            this.pixels = pixels;
            getPaymentAddress(pixels);
        });
        this.emitter.on(UserEvents.PAYMENT_ADDRESS, (data) => {
            console.log(data);
            this.paymentAddress = data.address;
            this.cost = data.cost;
            this.rawAmount = data.raw;
            this.timeRemainingSeconds = Math.round((data.timeout - 1000) / 1000);
            const timeoutInterval = setInterval(() => {
                this.timeRemainingSeconds -= 1;
                if (this.timeRemainingSeconds <= 0) {
                    clearInterval(timeoutInterval);
                }
            }, 1000);
            setTimeout(() => {
                const QRCode = require('qrcode');
                const canvas = document.getElementById('qr-code');
                QRCode.toCanvas(canvas, this.openKalium(), function (error) {
                    if (error) console.error(error);
                });
            });
        });
    },
};
</script>

<style scoped>
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
    height: 500px;
    width: 320px;
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

.payment-address {
    font-weight: 600;
    margin-top: 8px;
    word-break: break-all;
}
.timeout {
    margin-top: 16px;
}

.x-button {
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

.modal-body {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    font-size: 14px;
    color: #2a2a2e;
    text-align: center;
}

.empty-state-icon {
    color: #438d43;
    font-size: 96px;
    line-height: 96px;
}
.empty-state-title {
    font-size: 36px;
    color: #2a2a2e;
}
.empty-state-description {
    font-size: 14px;
    text-align: center;
    color: #444449;
}

.loading-state {
    display: flex;
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
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.modal-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
    justify-content: flex-end;
}

.footer-button:hover {
    background: #277125 !important;
    cursor: pointer;
}

.footer-button {
    color: white;
    background: #438d43;
    border: 1px solid #438d43;
    border-radius: 4px;
    height: 36px;
    font-weight: 600;
    letter-spacing: 0.5px;
    width: 100%;
}
.footer-button[disabled] {
    opacity: 0.5;
}
</style>
