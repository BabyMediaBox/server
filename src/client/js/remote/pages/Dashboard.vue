<template>
	<div class="container dashboard" >
		<div class="row">
			<div class="col-12" v-html="renderNotifyMessage()"></div>
		</div>

		<div class="row">
			<div class="col-4 h-25" v-for="index in 9" :key="index">
				<div class="btn btn-primary w-100 h-100 pt-3 pb-3 mt-3 mb-3"
					 v-on:click="onButtonClick(index, $event)"
					 v-html="getButtonLabels(index)"></div>
			</div>
		</div>
		<div class="clear"></div>
	</div>
</template>

<script>
	const buttons = [];
	for( let index in __GameButtons__)
	{
		buttons.push(parseInt(index));
	}

	export default {
		name: 'dashboard',
		components: {},

		beforeDestroy: function(){
			Socket.off('remote_notify', this.onSocketNotify);
			window.removeEventListener('keypress', this.onKeypress);
		},

		mounted: function()
		{
			Socket.on('remote_notify', this.onSocketNotify);
			window.addEventListener('keypress', this.onKeypress);
		},

		methods: {
			renderNotifyMessage(){
				console.log("notify", this.notify);
				if(this.notify.type === "message")
				{
					return `${this.notify.data.message}`;
				}

				return '';
			},
			onSocketNotify(data){
				this.notify = data;
			},
			onKeypress(e){
				if( e.code.indexOf('Digit') > -1)
				{
					this.onButtonClick( parseInt(e.key, 10) );
				}
			},
			getButtonLabels( index )
			{
				let label = [];

				if( buttons.indexOf(index) > -1 )
				{
					label.push(__GameButtons__[index]);
				}

				if(this.$te(`buttons.${index}`))
				{
					label.push(this.$t(`buttons.${index}`));
				}

				if(label.length===0)
				{
					label = [index];
				}
				return label.join('<br />');
			},
			onButtonClick(btn)
			{
				Socket.emit('remote_button_pressed', btn);
			}
		},
		data() {
			return {
				notify: {
					type: "",
					data: {}
				}
			};
		}
	}
</script>
