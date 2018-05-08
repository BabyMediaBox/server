<template>
    <div class="container" >
        <div class="dashboard">
            <router-link to="/playlists" class="w-100 btn btn-primary">Playlists</router-link>
            <router-link to="/examples" class="w-100 btn btn-primary">Examples</router-link>
            <div class="w-100 btn btn-info" v-on:click="reloadPage">Reload page</div>
            <div class="w-100 btn btn-info" v-on:click="testRGBLedStrip">Test RGB Led strip single color</div>
            <div class="w-100 btn btn-info" v-on:click="testRGBLedStripSequence">Test RGB Led strip sequence</div>
        </div>
        <div class="clear"></div>
    </div>
</template>

<script>
    import {MediaType} from '../../utils/MediaType';

    export default {
        name: 'dashboard',
        components: {},

        mounted: function()
        {

        },

        methods: {
            reloadPage: () => {
                Socket.emit('remote_reload_kiosk_page', {});
            },
            testRGBLedStrip: () => {
                Socket.emit('remote_test_rgb', {});
            },
            testRGBLedStripSequence: () => {
                Socket.emit('remote_test_rgb_sequence', {});
            }
        },
        data() {
            return {};
        }
    }
</script>
