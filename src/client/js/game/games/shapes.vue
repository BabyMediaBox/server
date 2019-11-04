<template>
	<div class="h-100 w-100 view-wrapper game-shapes">
		<div class="container-fluid game-view">
			<img v-bind:src="option.src" class="img-thumbnail" v-bind:class="statusCls"/>
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
</template>

<script>
	require('./shapes.scss');
	import RgbMixin from './../../mixins/Rgb';
	const options = {
		4 : { name: "circle", src: "pictures/shapes/circle.png" },
		5 : { name: "square", src: "pictures/shapes/square.png" },
		6 : { name: "star", src: "pictures/shapes/star.png" },
		7 : { name: "triangle", src: "pictures/shapes/triangle.png" },
	};

	const indexOptions = [4, 5, 6, 7];

	export default {

		mixins: [RgbMixin],

		components: {
		},

		mounted: function()
		{

		},

		methods: {

			nextRound(){
				this.optionIndex = indexOptions[Math.floor(Math.random() * 4)];
				this.option = options[this.optionIndex];
				this.statusCls = 'pending';
				this.rgbClear();
			},

			onButton(index){
				if( index === this.optionIndex )
				{
					this.statusCls = "correct";
					this.rgb( 0, 128, 0);
					setTimeout(this.nextRound, 1000)
				}
				else
				{
					this.statusCls = "wrong";
					this.rgb( 255, 0, 0);
					setTimeout(()=>{
						this.statusCls = 'pending';
					}, 1000)
				}
			}
		},

		data() {
			return {
				optionIndex : 4,
				option: options[4],
				statusCls: 'pending'
			};
		},
		name: 'game.shapes'
	}
</script>
