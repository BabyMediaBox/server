<template>
    <div class="videos">
        <ul class="list-group">
            <li class="list-group-item" v-for="(video,index) in videos" :key="index">
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
				let payload = { type : MediaType.video, src: "videos/"+video.file };
				console.log("send video", video);
				if( video.rgbList )
				{
					payload.rgbList = video.rgbList;
				}
                Socket.emit('play_media', payload);
            }
        },
        data() {
            return {
                videos: []
            };
        }
    }
</script>
