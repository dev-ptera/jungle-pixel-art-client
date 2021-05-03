<template>
    <div class="modal-backdrop" v-if="showWelcome">
        <div class="modal">
            <header class="modal-header">
                <div class="line-1">JUNGLE PIXELART</div>
                <div class="line-2">a community art gallery</div>
            </header>
            <div class="header-wave"></div>
            <section class="modal-body">
                This is a pixel board for the banano community; draw a masterpiece and save it for all the world to see.
                <br />
                <br />
                This board is in beta, any saved drawings will get erased when ready for the official release. Price per
                pixel will be updated in the official release.

                <br />
                <br />
                <div style="font-size: 11px">
                    Any issue? Suggestions? Features? contact dev.ptera@gmail.com or reddit user dev-ptera
                </div>
                <!--Any banano profit will be donated to charity.  See the details <a href>here.</a>-->
            </section>
            <div style="display: flex; flex: 1 1 0"></div>
            <div class="footer-wave"></div>
            <footer class="modal-footer">
                <button type="button" class="art-button" @click="showWelcome = false">DRAW SOME ART</button>
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
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}
.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.4);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.modal {
    background: #ffffff;
    box-shadow: 1px 1px 10px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    max-height: 500px;
    height: 90vh;
    width: 320px;
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
    text-align: center;
}
.modal-header .line-1 {
    z-index: 1;
    font-size: 24px;
    padding-top: 16px;
    letter-spacing: 3px;
}
.modal-header .line-2 {
    z-index: 1;
    font-size: 16px;
    line-height: 16px;
    font-weight: 200;
    margin-bottom: 8px;
    margin-bottom: 16px;
}

.header-wave,
.footer-wave {
    background: url('../assets/wave-2.svg') no-repeat;
    z-index: 999;
    width: 100%;
    width: 100%;
    height: 3rem;
    bottom: -0.3rem;
    position: absolute;
    background-size: cover;
    background-position: 0 0;
}
.header-wave {
    top: 108px;
}
.footer-wave {
    top: 385px;
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
    margin-top: 32px;
    font-size: 16px;
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
.art-button:hover {
    background: #277125 !important;
    cursor: pointer;
}
</style>
