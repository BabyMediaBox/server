<template>
	<div class="h-100 w-100 view-wrapper game-shapes" v-bind:class="statusCls">
		<img v-bind:src="option.src" class="current-shape mx-auto d-block" />
	</div>
</template>

<script>
	require('./shapes.scss');
	import RgbMixin from './../../mixins/Rgb';

	const options = {};
	const indexOptions = [];

	for( let index in __GameButtons__)
	{
		indexOptions.push(parseInt(index));
		options[parseInt(index)] = {
			name: __GameButtons__[index],
			src: `pictures/shapes/${__GameButtons__[index]}.png`
		}
	}

	export default {

		mixins: [RgbMixin],

		components: {
		},

		beforeDestroy: function(){
			Socket.off('button_pressed', this.onSocketButton);
		},

		mounted: function()
		{
			Socket.on('button_pressed', this.onSocketButton);
		},

		methods: {

			nextRound(){
				this.optionIndex = indexOptions[Math.floor(Math.random() * 4)];
				while(this.optionIndex === this.previousIndex){
					this.optionIndex = indexOptions[Math.floor(Math.random() * 4)];
				}

				this.option = options[this.optionIndex];
				this.statusCls = 'pending';
				this.rgbClear();
			},

			onSocketButton(index)
			{
				if( indexOptions.indexOf(index) > -1 )
				{
					if( index === this.optionIndex )
					{
						this.statusCls = "correct";
						this.previousIndex = this.optionIndex;
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
			}
		},

		data() {
			return {
				optionIndex : __Config__.selectButton,
				previousIndex: __Config__.selectButton,
				option: options[__Config__.selectButton],
				statusCls: 'pending'
			};
		},
		name: 'game.shapes'
	}
</script>
