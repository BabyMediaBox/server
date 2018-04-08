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
            <img src="pictures/default.gif" />
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
                if( data.type === MediaType.playlist)
                {
                    this.loadPlaylist( data );
                }
                else
                {
                    this.type = data.type;
                    this.src = data.src;
                }
            });
        },

        methods: {
            nextItem()
            {
                if( this.queue.length > 0)
                {
                    let call = this.queue.shift();
                    call();
                }
                else
                {
                    this.type = null;
                    this.src = null;
                    this.queue = [];
                }

            },
            playItem( item )
            {
                this.type = item.type;
                this.src = item.src;
            },

            loadPlaylist( data )
            {
                this.type = null;
                this.src = null;
                this.queue = [];

                this.$http.get('/playlists/'+data.src, {}, {
                    emulateJSON: true
                })
                .then(resp => {
                    this.queue = [];
                    resp.data.list.forEach( (item) => {
                        this.queue.push( function()
                        {
                            this.scope.playItem.call( this.scope, this.item );
                            setTimeout( this.scope.nextItem, this.item.duration * 1000 );
                        }.bind({
                            scope: this,
                            item: item
                        }));
                    });
                    this.nextItem();
                });
            }
        },

        data() {

            return {
                MediaType : MediaType,
                type : null,
                src : null,
                queue: []
            };
        },
        name: 'player'
    }
</script>
