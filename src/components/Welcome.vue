<template>
    <div class="modal-backdrop" v-if="showWelcome">
        <div class="modal">
            <div class="modal-background"></div>
            <header class="modal-header">
                <div class="line-1">welcome to the</div>
                <div class="line-2">PIXELARTJUNGLE</div>
            </header>
            <div class="header-wave"></div>
            <section class="modal-body">
                This is the welcome screen, the pixels are loading in the background. By the time you dismiss this,
                the board will have loaded.
            </section>
            <div style="display: flex; flex: 1 1 0;"></div>
            <div class="footer-wave"></div>
            <footer class="modal-footer">
                <button type="button" class="art-button" @click="showWelcome = false">DO THE ART</button>
            </footer>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Welcome',
    methods: {
        close() {
            this.$emit('close');
        },
    },
    data() {
        return {
            showWelcome: true,
        };
    },
    mounted() {},
};
</script>

<style scoped>
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
    z-index: 999;
}

.modal {
    background: #ffffff;
    box-shadow: 1px 1px 10px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    max-height: 450px;
    height: 90vh;
    width: 300px;
    border-radius: 8px;
    z-index: 5;
    position: relative;
}

.modal-header,
.modal-footer {
    display: flex;
    background: #60c15f;
}

.modal-header {
    padding: 16px;
    border-bottom: 1px solid #eeeeee;
    color: #ffffff;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
}
.modal-header .line-1 {
    z-index: 1;
    font-size: 16px;
    font-weight: 200;
    margin-bottom: 8px;
    padding-top: 16px;
    text-align: left;
    margin-left: 20px;
}
.modal-header .line-2 {
    z-index: 1;
    text-align: center;
    font-size: 24px;
    line-height: 16px;
    height: 36px;
    letter-spacing: 3px;
}

.header-wave, .footer-wave {
    background: url("../assets/wave-2.svg") no-repeat;
    z-index: 999;
    width: 100%;
    width: 100%;
    height: 3rem;
    bottom: -.3rem;
    position: absolute;
    background-size: cover;
    background-position: 0 0;
}
.header-wave {
    top: 108px;
}
.footer-wave {
    top: 335px;
    -webkit-transform: scaleY(-1) scaleX(-1);
    transform: scaleY(-1) scaleX(-1);
}

.modal-body {
    color: #000000;
    position: relative;
    font-size: 14px;
    padding: 16px;
    text-align: center;
    height: 100%;
    margin-top: 48px;
    font-size: 16px;
}

.modal-background {
}

.modal-footer {
    z-index: 2;
    flex-direction: column;
    justify-content: flex-end;
    background: #60c15f;
    padding: 16px 32px;
}
.art-button {
    cursor: pointer;
    color: white;
    background: #438d43;
    border-radius: 4px;
    height: 36px;
    font-size: 12px;
    font-weight: 200;
    width: 100%;
    border: solid 1px #dcdcd0;
    letter-spacing: 2px;
}

</style>
