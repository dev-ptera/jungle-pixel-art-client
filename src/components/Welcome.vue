<template>
    <div class="modal-backdrop" v-if="showWelcome">
        <div class="modal">
            <div class="modal-background"></div>
            <header class="modal-header">
                Welcome to the Gallery
            </header>
            <div class="wave"></div>
            <section class="modal-body">
                This is the welcome screen, the pixels are loading in the background. By the time you dismiss this,
                the board will have loaded.
            </section>
            <footer class="modal-footer">
                <button type="button" class="art-button" @click="showWelcome = false">View the Art</button>
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
    height: 450px;
    width: 300px;
    border-radius: 8px;
    z-index: 5;
    position: relative;
}

.modal-header,
.modal-footer {
    padding: 16px;
    display: flex;
    background: #60c15f;
}

.modal-header {
    font-size: 24px;
    text-align: center;
    border-bottom: 1px solid #eeeeee;
    color: #ffffff;
    justify-content: space-between;
    z-index: 1;
    line-height: 72px;
    height: 72px;
}

.modal-body {
    color: #2a2a2e;
    position: relative;
    font-size: 14px;
    padding: 16px;
    text-align: center;
    height: 100%;
    margin-top: 64px;
    font-size: 16px;
}

.wave {
    background: url("../assets/wave-2.svg") no-repeat;
    z-index: 999;
    width: 100%;
    width: 100%;
    height: 3rem;
    bottom: -.3rem;
    position: absolute;
    top: 96px;
    background-size: cover;
    background-position: 0 0;
}

.modal-background {
}

.modal-footer {
    z-index: 2;
    border-top: 1px solid #eeeeee;
    flex-direction: column;
    justify-content: flex-end;
    background: #60c15f;
    background: url('../assets/bg-footer.svg');
    background-size: contain;
}
.art-button {
    cursor: pointer;
    color: white;
    background: #438d43;
    border-radius: 4px;
    height: 36px;
    font-weight: 600;
    letter-spacing: 0.5px;
    width: 100%;
    border: solid 2px #dcdcd0;
}

</style>
