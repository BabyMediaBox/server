<template>
    <div class="container" >
        <router-link to="/" class="w-100 btn btn-primary">Home</router-link>

        <div class="examples">
            <ul class="list-group">
				<li class="list-group-item">
					<button class="w-100 btn btn-primary" v-on:click="playPicture">
                    Play example Picture
					</button>
                </li>
                <li class="list-group-item">
					<button class="w-100 btn btn-primary" v-on:click="playVideo">
	                    Play example video
					</button>
                </li>
				<li class="list-group-item" >
					<button class="w-100 btn btn-primary" v-on:click="playYoutubeVideo">
                    Play example youtube video
					</button>
                </li>
				<li class="list-group-item">
					<button class="w-100 btn btn-primary" v-on:click="playPlaylist">
	                    Play example playlist
					</button>
                </li>

                <li class="list-group-item">
                    <button class="w-100 btn btn-primary" v-on:click="testRGBLedStrip">
                        Test RGB Led strip single color
                    </button>
                </li>

                <li class="list-group-item">
                    <button class="w-100 btn btn-primary" v-on:click="testRGBLedStripSequence">
                        Test RGB Led strip sequence
                    </button>
                </li>

            </ul>
        </div>

        <div class="clear"></div>
    </div>
</template>

<script>
    import {MediaType} from '../../utils/MediaType';

    export default {
        name: 'examples',
        components: {},

        mounted: function()
        {

        },

        methods: {
            testRGBLedStrip: () => {
                Socket.emit('remote_test_rgb', {});
            },
            testRGBLedStripSequence: () => {
                Socket.emit('remote_test_rgb_sequence', {});
            },
            playPicture: function(){
                Socket.emit('play_media', { type : MediaType.picture, src: 'pictures/example.jpeg'});
            },
            playVideo: function(){
                Socket.emit('play_media', { 
                    type : MediaType.video, 
                    src: 'videos/example.webm', 
                    "_duration": "16s",
                    "duration": 16,
                    "rgbList": [
                        {
                            "r": 97,
                            "g": 69,
                            "b": 175,
                            "stepTime": 10,
                            "startTime": 0
                        },
                        {
                            "r": 96,
                            "g": 138,
                            "b": 114,
                            "stepTime": 6,
                            "startTime": 10
                            }]
                    });
            },
            playYoutubeVideo: function(){
                Socket.emit('play_media', { type : MediaType.youtube, src: 'https://www.youtube.com/embed/cVFhMkOp8n4?autoplay=1&showinfo=0&controls=0'});
            },
            playPlaylist: function(){
                Socket.emit('play_media', { type : MediaType.playlist, src: 'example.json'});
            }
        },
        data() {
            return {};
        }
    }
</script>
