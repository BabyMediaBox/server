<template>
    <div class="kiosk container-fluid h-100">
        <router-view ref="content"></router-view>
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
            Socket.off("rgb", this.onSocketRgb);
            Socket.off('play_media', this.onSocketPlayMedia);
        },

        mounted: function()
        {
            Socket.on('button_pressed', this.onSocketButton);
            Socket.on('set_kiosk_volume', this.onSocketVolume);
            Socket.on('kiosk_shutdown', this.onSocketShutdown);
            Socket.on('reload_page', this.onSocketReloadPage);
            Socket.on("rgb", this.onSocketRgb);
            Socket.on('play_media', this.onSocketPlayMedia);
        },

        methods: {
            onSocketPlayMedia(data){
              if(this.$route.path !== '/play')
              {
                this.$router.push('/play');
              }
              setTimeout(() => {
                this.$refs.content.playItem(data);
              }, 1000);
            },
            onSocketRgb(data) {
              this.rgb(data.r, data.g, data.b);
            },
            onSocketButton( btn ) {
                if (btn === __Config__.dashboardButton && this.$route.path !== '/')
                {
                    this.$router.push('/');
                }
            },
            onSocketVolume(volume) {
                this.$http.post('http://localhost:3030/volume', { volume: volume }, {})
                    .then(resp => {
                        console.log("set volume response", resp);
                    }).catch( (err) => {
                      console.log('set volume response err', err);
                    });
            },
            onSocketShutdown(){
                this.$http.post('http://localhost:3030/shutdown', {}, {})
                    .then(resp => {
                        console.log("shutdown response", resp);
                    }).catch( (err) => {
                      console.log('shutdown request err', err);
                    });
            },
            onSocketReloadPage(){
                window.location.reload();
            }
        },
        data() {
            return {};
        },

    }
</script>
