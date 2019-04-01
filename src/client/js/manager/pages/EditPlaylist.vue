<template>
    <div class="playlist-edit">
        <form class="form-horizontal col-md-8">
            <div class="form-group">
                <label for="name" class="col-sm-2 control-label">Name</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="name"  v-model="playlist.name" placeholder="Name">
                </div>
            </div>

            <div class="form-group">
                <label for="filename" class="col-sm-2 control-label">Filename</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="filename"  v-model="playlist.file" placeholder="example.json">
                </div>
            </div>


            <div class="form-group">
                <label for="description" class="col-sm-2 control-label">Description</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="description"  v-model="playlist.description" placeholder="Description">
                </div>
            </div>
            <div class="form-group text-center">
                <span class="btn btn-info" v-on:click="savePlaylist">Save</span>
            </div>
        </form>
        <div class="row">
            <div class="col-sm-4">
                <h3>Playlist</h3>
                <div class="card" v-for="(video, index) in playlist.list">
                    <div class="card-body">
                        <h5 class="card-title">{{ video.name }} ({{video.duration}})</h5>
                        <p class="card-text">
                            {{ playlist.description }}
                        </p>
                        <span class="btn btn-info" v-on:click="moveUp(video, index, $event)">
                            up
                        </span>
                        <span class="btn btn-info" v-on:click="moveDown(video, index, $event)">
                            down
                        </span>

                        <span class="btn btn-warning" v-on:click="clearPlay" v-if="video.src === play.src">stop</span>
                        <span class="btn btn-info" v-on:click="playItem(video, $event)" v-else-if="video.src !== play.src">preview</span>

                        <span class="btn btn-danger" v-on:click="removeFromPlaylist(video, index, $event)">X</span>
                    </div>
                </div>
            </div>

            <div class="col-sm-4">
                <h3>All videos</h3>
                <div class="card " v-for="video in allVideos">
                    <div class="card-body">
                        <h5 class="card-title">{{ video.name }} ({{video.duration}})</h5>
                        <p class="card-text">
                            {{ video.description }}
                        </p>
                        <span class="btn btn-success" v-on:click="addToPlaylist(video, $event)">+</span>
                        <span class="btn btn-warning" v-on:click="clearPlay" v-if="video.src === play.src">stop</span>
                        <span class="btn btn-info" v-on:click="playItem(video, $event)" v-else-if="video.src !== play.src">preview</span>
                    </div>
                </div>
            </div>
            <div class="col-sm-4 playlist-preview-video">
                <h3>Preview</h3>

                <div class=" media-wrapper" v-if="play.type === MediaType.picture">
                    <img :src="play.src" />
                </div>
                <div class="media-wrapper" v-else-if="play.type === MediaType.video">
                    <video :src="play.src" id="video_player" autoplay></video>
                </div>
                <div class="media-wrapper" v-else-if="play.type === MediaType.youtube">
                    <iframe width="100%" height="100%" :src="play.src" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                </div>
                <main role="main" class="inner cover" v-else>
                    <h1 class="cover-heading">Baby Media Box</h1>
                    <img src="pictures/default.gif" />
                </main>
            </div>

        </div>

    </div>
</template>

<script>

    import _ from 'lodash';
    import {MediaType} from '../../utils/MediaType';

    function setDefaultData(){
        return {
            MediaType : MediaType,
            playlist: {
                file: '',
                name: '',
                description: '',
                list: []
            },
            play: {
                type: 0,
                src: ''
            },
            allVideos: []
        };
    }
    export default {
        name: 'edit-playlist',
        components: {},

        mounted: function()
        {
            if(this.$route.params.file)
            {
                this.$http.get('/playlists/'+this.$route.params.file, {}, {
                    emulateJSON: true
                })
                .then(resp => {
                    if( resp.data )
                    {
                        _.merge(this.playlist, resp.data);
                        this.playlist.file = this.$route.params.file;
                        console.log("playlist data", resp.data);
                    }
                });
            }

            this.$http.get('/manager/all-videos/', {}, {
                emulateJSON: true
            })
            .then(resp => {
                if( resp.data )
                {
                    console.log("videos data", resp.data);
                    this.allVideos = resp.data;
                }
            });
        },

        methods: {
            clearPlay: function(){
                this.play = {
                    type: 0,
                    src: ''
                };
            },
            playItem: function(item)
            {
                this.play = item;
            },
            addToPlaylist: function(video){
                this.playlist.list.push(video);
            },
            moveUp: function(video, index){
                let next = this.playlist.list[index-1];
                if( next )
                {
                    let current = this.playlist.list[index];
                    this.playlist.list[index-1] = current;
                    this.playlist.list[index] = next;
                }
                this.$forceUpdate();
            },
            moveDown: function(video, index){
                let prev = this.playlist.list[index+1];
                if( prev )
                {
                    let current = this.playlist.list[index];
                    this.playlist.list[index+1] = current;
                    this.playlist.list[index] = prev;
                }
                this.$forceUpdate();
            },
            removeFromPlaylist: function(video, index){
                this.playlist.list.splice(index, 1);
            },
            savePlaylist: function(){
                console.log(this.playlist);
                this.$http.post('/manager/save-playlist/'+this.playlist.file, this.playlist, {})
                    .then(resp => {
                        console.log("save file", resp);
                    });
            }
        },
        data() {
            return setDefaultData();
        }
    }
</script>
