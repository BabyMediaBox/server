<template>
    <div class="videos">
        <ul class="list-group">
            <li class="list-group-item" v-for="video in videos">
                <button class="w-100 btn btn-default" v-on:click="playVideo(video, $event)"> {{ video.name }} ( {{video._duration}} )</button>
            </li>
        </ul>
    </div>
</template>

<script>

    import {MediaType} from '../../utils/MediaType';

    export default {
        name: 'videos',
        components: {},

        mounted: function()
        {
            this.$http.get('/videos', {}, {
                emulateJSON: true
            })
            .then(resp => {
                this.videos = resp.data;
            });
        },

        methods: {
            playVideo: (video) =>
            {
                Socket.emit('play_media', { type : MediaType.video, src: "videos/"+video.file });
            }
        },
        data() {
            return {
                videos: []
            };
        }
    }
</script>
