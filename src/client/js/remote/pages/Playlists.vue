<template>
    <div class="container" >
        <router-link to="/" class="w-100 btn btn-primary">Home</router-link>

        <div class="playlists">
            <div class="card" v-for="playlist in playlists">
                <div class="card-body">
                    <h5 class="card-title">{{ playlist.name }} ( {{playlist._duration }})</h5>
                    <p class="card-text">
                        {{ playlist.description }}
                    <ul v-if="playlist.expanded === true" >
                        <li class="nav-item" v-for="item in playlist.list">
                            {{ item.name }} ( {{item._duration}} )
                        </li>
                    </ul>
                    </p>
                    <span class="btn btn-info" v-on:click="expandPlaylist(playlist, $event)">View playlist</span>
                    <span class="btn btn-primary">Play playlist</span>
                </div>
            </div>
        </div>

        <div class="clear"></div>
    </div>
</template>

<script>
    export default {
        name: 'dashboard',
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
            }
        },
        data() {
            return {
                playlists: []
            };
        }
    }
</script>
