<script>


export default {
    name: 'home',
    data() {
        return {
            titleTexts: ["DEVELOPER", "TECH-ENTUSIAST", "DREAMER"], // Aggiungi più testi qui
            currentTextIndex: 0,
            animatedText: "",
            currentIndex: 0,
            interval: 3000, // Intervallo in millisecondi
        }
    },
    created() {
        this.changeText();
        setInterval(this.changeText, this.interval);
    },
    methods: {
        changeText() {
            this.animatedText = "";
            this.titleText = this.titleTexts[this.currentTextIndex];
            this.currentTextIndex = (this.currentTextIndex + 1) % this.titleTexts.length;
            this.animateTitle();
        },
        animateTitle() {
            this.animatedText = this.titleText; // Mostra il titolo per intero
            this.currentIndex = 0; // Reset dell'indice per la prossima animazione
        },
    },
}

</script>
<template>
    <div class="container d-flex">
        <div class="col-6 d-flex align-items-center h_100">
            <h1 class="home_text animated-title">HI I'M FABIO <br>{{ animatedText }}</h1>
        </div>
    </div>
</template>


<style lang="scss">
@use '../styles/general.scss';
</style>