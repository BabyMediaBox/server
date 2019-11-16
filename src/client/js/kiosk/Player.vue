<template>
    <div id="app" class="cover-container d-flex h-100 p-3 mx-auto flex-column player">
        <div class="h-100 w-100 media-wrapper" v-if="type === MediaType.picture">
            <img :src="src" />
        </div>
        <div class="h-100 w-100 media-wrapper" v-else-if="type === MediaType.video">
            <video @play="onVideoPlay" @ended="onVideoEnded"  id="video_player" autoplay :src="src">
            </video>
        </div>
        <div class="h-100 w-100 media-wrapper" v-else-if="type === MediaType.youtube">
            <iframe width="100%" height="100%" :src="src" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>
        <main role="main" class="inner cover" v-else>
            <div class="list-videos">
                <div class="row" v-bind:id="'video-'+index" v-for="(video,index) in videos" :key="index" v-bind:class="getSelectedVideoClass(video,index)">
                    <div class="col-sm-6 col-md-6 col-lg-4 ">
                        <img :src="video.thumb" class="img-fluid"/>
                    </div>
                    <div class="col-8">
                        <h3>{{ video.name }}</h3>
                        {{video._duration}}
                    </div>
                </div>
            </div>
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
            this.clear();
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
			onVideoPlay(){
                console.log("start");
            },
			onVideoEnded(){
				this.clear();
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
                this.clear();

                this.type = item.type;
                this.src = item.src;
				this.rgbList = (item.rgbList) ? item.rgbList: [];
                this.clearRgbTimer();
                this.playItemRGB();

                if( this.type !== MediaType.video )
				{
					window.currentEndTimeout = setTimeout( this.nextItem, item.duration * 1000 );
				}
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
