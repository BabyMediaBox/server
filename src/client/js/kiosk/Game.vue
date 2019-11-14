<template>
    <div id="app" class="cover-container d-flex h-100  mx-auto flex-column">
        <div class="view-wrapper">
            <div class="container-fluid games-list">
                <div class="row align-items-center" v-for="(game,index) in games" :key="index" v-bind:class="selectedGameClass(game,index)">
                    <div class="col-sm-4 game-title">
                        <span class="align-middle">{{game.title}}</span>
                    </div>
                    <div class="col-sm-8 game-image">
                        <img v-bind:src="game.backgroundImage" class="img-fluid" />
                    </div>
                </div>
            </div>

            <div class="container-fluid game-dashboard-buttons">
                <div class="row">
                    <div class="col-sm-3 game-btn btn-1">
                        <img src="pictures/buttons/circle.png" class="img-thumbnail"/>
                    </div>
                    <div class="col-sm-3 game-btn btn-2">
                        <img src="pictures/buttons/square.png" class="img-thumbnail"/>
                    </div>
                    <div class="col-sm-3 game-btn btn-3">
                        <img src="pictures/buttons/star.png" class="img-thumbnail"/>
                    </div>
                    <div class="col-sm-3 game-btn btn-4">
                        <img src="pictures/buttons/triangle.png" class="img-thumbnail" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {Games} from './Games';

    export default {

        components: {
        },

        beforeDestroy(){
            Socket.off('button_pressed', this.onSocketButton);
        },

        mounted()
        {
            Socket.on('button_pressed', this.onSocketButton);
        },

        methods: {
            onSocketButton: function(button){
                if( button === __Config__.upButton  && this.Selected > 0)
                {
                    this.Selected -= 1;
                }
                else if( button === __Config__.downButton && this.Selected+1 <= Games.List.length)
                {
                    this.Selected += 1;
                }

                else if( button === __Config__.selectButton )
                {
                    this.$router.push(Games.List[this.Selected].path);
                }
            },
            selectedGameClass: function(game, index){
                if( this.Selected === index)
                {
                    return 'selected-game';
                }
                return '';
            }
        },

        data() {

            return {
                Selected: 0,
                games: Games.List,
                selectedGame: Games.List[0]
            };
        },
        name: 'game'
    }
</script>
