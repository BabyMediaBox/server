<template>
    <div class="playlists">
        <div class="card" v-for="(playlist,index) in playlists" :key="index">
            <div class="card-body">
                <h5 class="card-title">{{ playlist.name }} ( {{playlist._duration }})</h5>
                <p class="card-text">
                    {{ playlist.description }}
                    <ul v-if="playlist.expanded === true" >
                        <li class="nav-item" v-for="(item,itemIndex) in playlist.list" :key="itemIndex">
                            {{ item.name }} ( {{item._duration}} )
                        </li>
                    </ul>
                </p>
                <span class="btn btn-info" v-on:click="expandPlaylist(playlist, $event)">View playlist</span>
                <span class="btn btn-primary" v-on:click="playPlaylist(playlist, $event)">Play playlist</span>
            </div>
        </div>
    </div>
</template>

<script>

    import {MediaType} from '../../utils/MediaType';

    export default {
        name: 'videos',
        components: {},

        mounted: function()
        {
            this.$http.get('/playlists', {}, {
                emulateJSON: true
            })
            .then(resp => {
                resp.data.forEach( (playlist) => {
                    playlist.expanded = false;
                    this.playlists.push(playlist);
                });
            });
        },

        methods: {
            expandPlaylist: (playlist) =>
            {
                playlist.expanded = !playlist.expanded;
            },
            playPlaylist: (playlist) =>
            {
                Socket.emit('play_media', { type : MediaType.playlist, src: playlist.file });
            }
        },
        data() {
            return {
                playlists: []
            };
        }
    }
</script>
