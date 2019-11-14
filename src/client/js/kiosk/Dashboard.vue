<template>
    <div class="container-fluid h-100 dashboard" >
        <div class="row align-items-center h-50 mode" v-for="(mode,index) in modes" :key="index" v-bind:class="selectedModeClass(mode,index)">
            {{$t(mode.title)}}
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
                    path: '/play'
                },{
                    title: 'dashboard.game',
                    path: '/game'
                }]
            };
        }
    }
</script>
