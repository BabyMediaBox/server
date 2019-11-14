<template>
    <div id="app" class="cover-container d-flex h-100 p-3 mx-auto flex-column player">
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
            <ul class="list-group list-videos">
                <li class="list-group-item" v-bind:id="'video-'+index" v-for="(video,index) in videos" :key="index" v-bind:class="getSelectedVideoClass(video,index)">
                    <img src="pictures/example.jpeg" class="img-fluid"/> {{ video.name }} ( {{video._duration}} )
                </li>
            </ul>
        </main>
    </div>
</template>

<script>
    import {MediaType} from '../utils/MediaType';
    import RgbMixin from './../mixins/Rgb';

    export default {
        mixins: [RgbMixin],

        components: {
        },

        beforeDestroy: function(){
            Socket.off('button_pressed', this.onSocketButton);
        },
        mounted: function()
        {

            Socket.on('button_pressed', this.onSocketButton);
            this.$http.get('/videos', {}, {
                emulateJSON: true
            })
            .then(resp => {
                this.videos = resp.data;
            });

            /*Socket.on('media_button_pressed', ( mediaItem ) => {
                if( mediaItem )
                {
                    this.playFromButton(mediaItem);
                }
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
            });*/
        },

        methods: {
            getSelectedVideoClass(video, index)
            {
                if( this.Selected === index)
                {
                    return 'active';
                }
                return '';
            },
            onSocketButton(btn){
                if( btn === __Config__.dashboardButton )
                {
                    this.$router.push('/');
                }
                else if( btn === __Config__.upButton )
                {
                    if(this.Selected-1 >= 0)
                    {
                        this.Selected-=1;
                        document.getElementById('video-'+this.Selected).scrollIntoView();
                    }
                }
                else if( btn === __Config__.selectButton )
                {
                    //this.$router.push(this.modes[this.Selected].path);
                    this.playItem( this.videos[this.Selected]);
                }
                else if ( btn === __Config__.downButton )
                {

                    if( this.Selected+1 < this.videos.length)
                    {
                        this.Selected+=1;
                        document.getElementById('video-'+this.Selected).scrollIntoView();
                    }
                }
            },
			onVideoPlay(){},
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
                Selected: 0,
                videos:[],
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
