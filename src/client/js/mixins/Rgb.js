export default {
	components: {},
	methods: {
		rgbClear(){
			this.rgb(255,255,255);
		},
		timedRgb( r, g, b, t){
			this.rgb(r,g,b);
			setTimeout(this.rgbClear, t * 1000 );
		},
		rgbSequence( list )
		{
			return this.$http.post('http://localhost:3030/rgb/sequence', list, {})
			.then(resp => {
				console.log("rgb response", resp);
			}).catch((err)=>{
				console.log("rgbSequence error", err);
			});
		},
		rgb( r, g, b )
		{

			return this.$http.post('http://localhost:3030/rgb', { r: r, g: g, b: b}, {
				emulateJSON: true
			})
			.then(resp => {
				console.log("rgb response", resp);
			}).catch((err)=>{
				console.log("rgb error", err);
			});
		},
	}
}