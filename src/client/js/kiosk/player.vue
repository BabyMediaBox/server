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
            Socket.on('button_pressed', ( mediaItem ) => {
                let item = JSON.parse(mediaItem);
                if( item )
                {
                    this.playFromButton(item);
                }
            });
            Socket.on('test_rgb', () => {
                this.rgb( 20, 20, 20);
            });
            Socket.on('test_rgb_sequence', () => {
                this.rgbSequence( [
                    [20, 20, 20],
                    [200, 200, 200],
                    [50, 50, 50]
                ]);
            });
            Socket.on('reload_page', () => {
                window.location.reload();
            });
            Socket.on('play_media', ( data ) => {
                console.log("play_media", data);
                if( data.type === MediaType.playlist)
                {
                    this.loadPlaylist( data );
                }
                else
                {
                    this.queue = [];
                    this.playItem( data );
                }
            });
        },

        methods: {
            playFromButton( mediaItem )
            {
                if( window.currentEndTimeout )
                {
                    clearTimeout(window.currentEndTimeout);
                }
                this.queue.unshift( function()
                {
                    this.scope.playItem.call( this.scope, this.item );
                    window.currentEndTimeout = setTimeout( this.scope.nextItem, this.item.duration * 1000 );
                }.bind({
                    scope: this,
                    item: mediaItem
                }));
                this.nextItem();
            },
            rgbSequence( list )
            {
                return this.$http.post('http://localhost:3030/rgb/sequence', list, {})
                    .then(resp => {
                        console.log("rgb response", resp);
                    });
            },
            rgb( r, g, b )
            {
                return this.$http.post('http://localhost:3030/rgb', { r: r, g: g, b: b}, {
                    emulateJSON: true
                })
                .then(resp => {
                    console.log("rgb response", resp);
                });
            },
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
                    this.rbgList = [];
                }

            },
            clearRgbTimer(){
                if( this.rgbTimer )
                {
                    clearTimeout( this.rgbTimer);
                    this.rgbTimer = null;
                }
            },
            playItemRGB( )
            {
                this.clearRgbTimer();

                if( this.rbgList.length > 0 )
                {
                    let rgbInfo = this.rbgList.shift();
                    console.log("run rgb", rgbInfo);
                    console.log("left", this.rbgList);
                    this.rgb( rgbInfo.r, rgbInfo.g, rgbInfo.b );
                    this.rgbTimer = setTimeout(this.playItemRGB, rgbInfo.stepTime * 1000 );
                }
            },

            playItem( item )
            {
                this.type = item.type;
                this.src = item.src;
                this.rbgList = (item.rbgList) ? item.rbgList: [];
                this.clearRgbTimer();
                this.playItemRGB();
            },

            loadPlaylist( data )
            {
                this.type = null;
                this.src = null;
                this.queue = [];
                this.rbgList = [];

                this.$http.get('/playlists/'+data.src, {}, {
                    emulateJSON: true
                })
                .then(resp => {
                    this.queue = [];
                    resp.data.list.forEach( (item) => {
                        this.queue.push( function()
                        {
                            this.scope.playItem.call( this.scope, this.item );
                            window.currentEndTimeout = setTimeout( this.scope.nextItem, this.item.duration * 1000 );
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
                rgbTimer : null,
                rbgList: [],
                queue: []
            };
        },
        name: 'player'
    }
</script>
