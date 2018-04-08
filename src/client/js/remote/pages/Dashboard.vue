<template>
    <div class="container" >
        <div class="dashboard">
            <router-link to="/playlists" class="w-100 btn btn-primary">Playlists</router-link>
            <router-link to="/examples" class="w-100 btn btn-primary">Examples</router-link>
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

        methods: {},
        data() {
            return {};
        }
    }
</script>
