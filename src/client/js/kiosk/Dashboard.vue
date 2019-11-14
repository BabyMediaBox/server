<template>
    <div class="container-fluid h-100 dashboard" >
        <div class="row align-items-center h-50 mode" v-for="(mode,index) in modes" :key="index" v-bind:class="selectedModeClass(mode,index)">
            <h1 class="col-4 label">{{$t(mode.title)}}</h1>
            <div class="col-8">
                <img class="img-fluid" :src="mode.preview" />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'manager-dashboard',
        components: {},

        beforeDestroy: function(){
            Socket.off('button_pressed', this.onSocketButton);
        },
        mounted: function()
        {
            Socket.on('button_pressed', this.onSocketButton);
        },

        methods: {
            onSocketButton( btn ){
                if( btn === __Config__.upButton )
                {
                    if(this.Selected-1 >= 0)
                    {
                        this.Selected-=1;
                    }
                }
                else if( btn === __Config__.selectButton )
                {
                    this.$router.push(this.modes[this.Selected].path);
                }
                else if ( btn === __Config__.downButton )
                {

                    if( this.Selected+1 < this.modes.length)
                    {
                        this.Selected+=1;
                    }
                }
            },
            selectedModeClass(mode, index){
                if( this.Selected === index)
                {
                    return 'active';
                }
                return '';
            }
        },
        data() {
            return {
                Selected: 0,
                modes: [{
                    title: 'dashboard.video_player',
                    preview: __Images__.menuVideoPlayerPreview,
                    path: '/play'
                },{
                    title: 'dashboard.game',
                    preview: __Images__.menuGamePreview,
                    path: '/game'
                }]
            };
        }
    }
</script>
