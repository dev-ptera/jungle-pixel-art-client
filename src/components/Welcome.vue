<template>
    <div class="modal-backdrop" v-if="showWelcome">
        <div class="modal">
            <header class="modal-header">
                <div>
                    <div class="line-1">Welcome!</div>
                </div>
                <button
                    type="button"
                    class="btn-close material-icons material-icons-outlined"
                    @click="showWelcome = false"
                >
                    close
                </button>
            </header>

            <section class="modal-body">
                <div class="instructions">
                    This is the welcome screen, the pixels are loading in the background. By the time you dismiss this,
                    the board will have loaded.
                </div>
            </section>

            <div style="display: flex; flex: 1 1 0"></div>

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
    z-index: 5;
}

.modal-header .line-1 {
    font-size: 24px;
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
    margin-top: 96px;
    padding: 16px;
    padding-top: 0;
    text-align: center;
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

.art-button {
    cursor: pointer;
    color: white;
    background: #438d43;
    border: 1px solid #438d43;
    border-radius: 4px;
    height: 36px;
    font-weight: 600;
    letter-spacing: 0.5px;
    width: 100%;
}
</style>
