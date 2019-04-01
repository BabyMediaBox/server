<template>
    <div class="playlists">
        <router-link :to='{ name : "EditPlaylist", params : { file: ""} }' class=" btn btn-info">Create new playlist</router-link>
        <div class="card" v-for="playlist in playlists">
            <div class="card-body">
                <h5 class="card-title">{{ playlist.name }} - <i>{{playlist.file}}</i> ( {{playlist._duration }})</h5>
                <p class="card-text">
                    {{ playlist.description }}
                </p>
                <router-link :to='{ name : "EditPlaylist", params : { file: playlist.file} }' class=" btn btn-info">Edit Playlist</router-link>
                <button class="btn btn-danger" type="button"  data-toggle="modal" data-target="#deleteConfirm" v-on:click="selectPlaylistForDelete( playlist, $event)">DeletePlaylist</button>
            </div>
        </div>

        <div class="modal fade" id="deleteConfirm" tabindex="-1" role="dialog" aria-labelledby="DeletePlaylist" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="DeletePlaylist">Confirm delete</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="confirmDeletePlaylist" >Delete playlist</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'manager-playlists',
        components: {},

        mounted: function()
        {
            this.loadPlaylists();
        },

        methods: {
            loadPlaylists: function(){
                this.playlists = [];
                this.$http.get('/playlists', {}, {
                    emulateJSON: true
                })
                .then(resp => {
                    resp.data.forEach( (playlist) => {
                        this.playlists.push(playlist);
                    });
                });
            },
            selectPlaylistForDelete: function ( playlist ) {
                this.selectedPlaylistForDelete = playlist;
                console.log("playlist", playlist);
            },
            confirmDeletePlaylist: function(){
                this.$http.post('/manager/delete-playlist/'+this.selectedPlaylistForDelete.file, {}, {})
                .then(resp => {
                    console.log(resp.data);
                    this.loadPlaylists();
                });
            }
        },
        data() {
            return {
                selectedPlaylistForDelete: null,
                playlists: []
            };
        }
    }
</script>
