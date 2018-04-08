<template>
    <div id="app" class="cover-container d-flex h-100 p-3 mx-auto flex-column">
        <div class="h-100 w-100 media-wrapper" v-if="type === MediaType.picture">
            <img :src="src" />
        </div>
        <div class="h-100 w-100 media-wrapper" v-else-if="type === MediaType.video">
            <video :src="src" autoplay></video>
        </div>
        <div class="h-100 w-100 media-wrapper" v-else-if="type === MediaType.youtube">
            <iframe width="100%" height="100%" :src="src" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>
        <main role="main" class="inner cover" v-else>
            <h1 class="cover-heading">Baby Media Box</h1>
        </main>
    </div>
</template>

<script>
    import {MediaType} from '../utils/MediaType';

    export default {
        components: {
        },

        mounted: function()
        {
            Socket.on('play_media', ( data ) => {

                console.log("play_media", data);

                this.type = data.type;
                this.src = data.src;

            });
        },

        methods: {},

        data() {

            return {
                MediaType : MediaType,
                type : null,
                src : null
            };
        },
        name: 'player'
    }
</script>
