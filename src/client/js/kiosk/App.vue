<template>
    <div class="kiosk container-fluid h-100">
        <router-view></router-view>
    </div>
</template>

<script>
    import RgbMixin from './../mixins/Rgb';

    export default {
        name: 'App',

        mixins: [RgbMixin],

        components: {

        },

        beforeDestroy: function(){
            Socket.off('button_pressed', this.onSocketButton);
            Socket.off('set_kiosk_volume', this.onSocketVolume);
            Socket.off('kiosk_shutdown', this.onSocketShutdown);
            Socket.off('reload_page', this.onSocketReloadPage);
        },

        mounted: function()
        {
            Socket.on('button_pressed', this.onSocketButton);
            Socket.on('set_kiosk_volume', this.onSocketVolume);
            Socket.on('kiosk_shutdown', this.onSocketShutdown);
            Socket.on('reload_page', this.onSocketReloadPage);
        },

        methods: {
            onSocketButton( btn ) {
                if (btn === __Config__.dashboardButton)
                {
                    this.$router.push('/');
                }
            },
            onSocketVolume(volume) {
                this.$http.post('http://localhost:3030/volume', { volume: volume }, {})
                    .then(resp => {
                        console.log("set volume response", resp);
                    });
            },
            onSocketShutdown(){
                this.$http.post('http://localhost:3030/shutdown', {}, {})
                    .then(resp => {
                        console.log("shutdown response", resp);
                    });
            },
            onSocketReloadPage(){
                window.location.reload();
            }
        },
        data() {
            return {
            };
        },

    }
</script>
