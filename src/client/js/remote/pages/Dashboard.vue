<template>
    <div class="container" >
        <ul class="nav flex-column">
            <li class="nav-item">
                <router-link to="/">Home</router-link>
            </li>
            <li class="nav-item">
                <div class="nav-link" v-on:click="playPicture">Picture</div>
            </li>
            <li class="nav-item">
                <div class="nav-link" v-on:click="playVideo">Play video</div>
            </li>
            <li class="nav-item">
                <div class="nav-link" v-on:click="playYoutubeVideo">Play youtube video</div>
            </li>

        </ul>
        <div class="clear"></div>
    </div>
</template>

<script>
    import {MediaType} from '../../utils/MediaType';

    export default {
        name: 'dashboard',
        components: {},

        mounted: function()
        {

        },

        methods: {
            playPicture: function(){
                Socket.emit('play_media', { type : MediaType.picture, src: 'pictures/example.jpeg'});
            },
            playVideo: function(){
                Socket.emit('play_media', { type : MediaType.video, src: 'videos/example.mp4'});
            },
            playYoutubeVideo: function(){
                Socket.emit('play_media', { type : MediaType.youtube, src: 'https://www.youtube.com/embed/cVFhMkOp8n4?autoplay=1&showinfo=0&controls=0'});
            },
        },
        data() {
            return {};
        }
    }
</script>
