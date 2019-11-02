<template>
    <div id="app" class="cover-container d-flex h-100 p-3 mx-auto flex-column">
        <div class="h-100 w-100 view-wrapper" v-if="view === GameView.GENERAL">
            <div class="container-fluid games-list">
                <div class="row" v-for="(game,index) in games" :key="index" v-bind:class="selectedGameClass(game,index)">
                    <div class="col-sm-4 game-title">{{game.title}}</div>
                    <div class="col-sm-8"><img v-bind:src="game.backgroundImage" /></div>
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

        <div class="h-100 w-100 view-wrapper" v-if="view === GameView.PLAY_GAME">
            <game :is="selectedGame.game" ref="current-game" />
        </div>
    </div>
</template>

<script>
    import MODES from '../../../enums/Mode';
    import GameView from '../../../enums/GameView';
    import {Games} from './Games';

    export default {
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
            Socket.on('button_pressed', ( button_index ) => {
                let index = parseInt(button_index);
                if(this.view === GameView.GENERAL)
                {
                    this.onButton( index );
                }
                else
                {
                    this.$refs['current-game'].onButton(index);
                }
            });
            Socket.on('reload_page', () => {
                window.location.reload();
            });
        },

        methods: {
            onButton: function(button){
                if( button === 5 )
                {// up
                    console.log("up");
                    if( this.Selected > 0)
                    {
                        this.Selected -= 1;
                    }
                }
                else if( button === 6 )
                {// down
                    console.log("down");
                    if( this.Selected+1 <= Games.List.length)
                    {
                        this.Selected += 1;
                    }
                }
                else if( button === 4 )
                {// Select / play
                    this.view = GameView.PLAY_GAME;
                    this.selectedGame = Games.List[this.Selected];
                }
                else if( button === 7 )
                {// nothing in dashboard

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
                selectedGame: Games.List[0],
                GameView: GameView,
                view: GameView.GENERAL
            };
        },
        name: 'game'
    }
</script>
