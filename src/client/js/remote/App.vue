<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">
                BabyMediaBox
                <span v-if="kioskSerialConnected" class="badge badge-success">Remote</span>
                <span v-else="kioskSerialConnected" class="badge badge-danger">Remote</span>
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#main_nav" aria-controls="main_nav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="main_nav">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <router-link to="/" class="btn btn-success w-100 my-sm-0">Home</router-link>
                    </li>

                    <li class="nav-item">
                        <router-link to="/playlists" class="w-100 btn btn-primary">Playlists</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/videos" class="w-100 btn btn-primary">Play video</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/examples" class="w-100 btn btn-primary">Examples</router-link>
                    </li>

                    <li class="nav-item">
                        <button class="w-100 btn btn-default" v-on:click="reloadPage">Reload page</button>
                    </li>

                    <li class="nav-item">
                        <a  href="/manager" class="w-100 btn btn-default">Manager(Desktop)</a>
                    </li>

                    <li class="nav-item  align-items-center">
                        <div class="btn-group w-100" role="group" aria-label="Basic example">
                            <button class="btn btn-outline-success col-3" type="button" v-on:click="decreaseVolume">-10%</button>
                            <span class="btn btn-outline-success col-6">Volume {{volume}}%</span>
                            <button class="btn btn-outline-success col-3" type="button" v-on:click="increaseVolume">+10%</button>
                        </div>
                    </li>
                    <li>
                        <button class="btn btn-danger w-100 my-sm-0" type="button"  data-toggle="modal" data-target="#shutdownConfirm">Shutdown</button>
                    </li>
                </ul>

            </div>
        </nav>
        <div class="container" id="pages">
            <router-view></router-view>
        </div>
        <div class="clear"></div>
        <div class="modal fade" id="shutdownConfirm" tabindex="-1" role="dialog" aria-labelledby="shutdownConfirmLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="shutdownConfirmLabel">Confirm shutdown</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="shutdown" >Shutdown</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'App',
        components: {

        },

        mounted: function()
        {
            Socket.on('kiosk_serial_online', () => {
                this.kioskSerialConnected = true;
            });
            Socket.on('kiosk_volume', (volume) => {
                this.volume = Math.floor(volume/10)*10;
                window.volume = this.volume;
            });
        },

        methods: {
            shutdown(){
                Socket.emit('request_kiosk_shutdown');
            },
            _updateVolume()
            {
                console.log("set volume", this.volume);
                window.volume = this.volume;
                Socket.emit('request_setting_kiosk_volume', this.volume);
            },
            increaseVolume() {
                if( this.volume+10 <= 100 )
                {
                    this.volume += 10;
                    this._updateVolume();
                }
            },
            decreaseVolume() {
                if(this.volume-10 >= 0)
                {
                    this.volume -= 10;
                    this._updateVolume();
                }
            },
            reloadPage: () => {
                Socket.emit('remote_reload_kiosk_page', {});
            },
        },
        data() {
            return {
                volume: window.volume,
                kioskSerialConnected: window.kioskSerialConnected
            };
        }
    }
</script>
