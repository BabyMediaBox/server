<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">
                BabyMediaBox
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
                </ul>

            </div>
        </nav>
        <div class="container" id="pages">
            <router-view></router-view>
        </div>
        <div class="clear"></div>

    </div>
</template>

<script>
    export default {
        name: 'App',
        components: {

        },

        mounted: function()
        {

        },

        methods: {

        },
        data() {
            return {
            };
        }
    }
</script>
