<template>
    <div id="app" class="cover-container d-flex h-100 p-3 mx-auto flex-column">
        <div class="h-100 w-100 media-wrapper" v-if="type === MediaType.picture">
            <img :src="src" />
        </div>
        <div class="h-100 w-100 media-wrapper" v-else-if="type === MediaType.video">
            <video @play="onVideoPlay" @ended="onVideoEnded" :src="src" id="video_player" autoplay></video>
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
    import MODES from '../../../enums/Mode';
    import RgbMixin from './../mixins/Rgb';

    export default {
        mixins: [RgbMixin],
        components: {
        },

        mounted: function()
        {
            Socket.on('change_mode', (mode) => {
                if(mode === MODES.GAME)
                {
                    window.location.href = '/game';
                }
                else if( mode === MODES.MEDIA )
                {
                    window.location.href = '/';
                }
            });
            Socket.on('set_kiosk_volume', ( volume ) => {
                this.$http.post('http://localhost:3030/volume', { volume: volume }, {})
                .then(resp => {
                    console.log("set volume response", resp);
                });
            });
            Socket.on('kiosk_shutdown', () => {
                this.$http.post('http://localhost:3030/shutdown', {}, {})
                    .then(resp => {
                        console.log("shutdown response", resp);
                    });
            });
            Socket.on('media_button_pressed', ( mediaItem ) => {
                if( mediaItem )
                {
                    this.playFromButton(mediaItem);
                }
            });
            Socket.on('test_rgb', () => {
                this.setBodyColor(20, 20, 20);
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
			onVideoPlay(){

			},
			onVideoEnded(){
				this.clear();
				this.nextItem();
			},
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

    		setBodyColor( r, g, b)
			{
				document.getElementsByTagName('body')[0].style.backgroundColor="rgb("+r+","+g+","+b+")";
			},

			clear(){
				this.type = null;
				this.src = null;
				this.queue = [];
				this.rgbList = [];
				this.setBodyColor(255, 255, 255);
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
                    this.clear();
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

                if( this.rgbList.length > 0 )
                {
                    let rgbInfo = this.rgbList.shift();
                    this.setBodyColor(rgbInfo.r, rgbInfo.g, rgbInfo.b);
                    this.rgb( rgbInfo.r, rgbInfo.g, rgbInfo.b );
                    this.rgbTimer = setTimeout(this.playItemRGB, rgbInfo.stepTime * 1000 );
                }
            },

            playItem( item )
            {
                this.type = item.type;
                this.src = item.src;
				this.rgbList = (item.rgbList) ? item.rgbList: [];
                this.clearRgbTimer();
                this.playItemRGB();

                if( this.type !== MediaType.video )
				{
					window.currentEndTimeout = setTimeout( this.nextItem, item.duration * 1000 );
				}
            },

            loadPlaylist( data )
            {
                this.type = null;
                this.src = null;
                this.queue = [];
                this.rgbList = [];

                this.$http.get('/playlists/'+data.src, {}, {
                    emulateJSON: true
                })
                .then(resp => {
                    this.queue = [];
                    resp.data.list.forEach( (item) => {
                        this.queue.push( function()
                        {
                            this.scope.playItem.call( this.scope, this.item );
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
				rgbList: [],
                queue: []
            };
        },
        name: 'player'
    }
</script>
