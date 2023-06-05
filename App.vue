<script setup>
import {onLaunch,onShow,onHide} from "@dcloudio/uni-app";

onLaunch(()=>{
	console.log('App Launch');
	// preventF12()
	// mobiusdebugger()
})
onShow(()=>{
	console.log('App Show');
})
onHide(()=>{
	console.log('App Hide');
})

//阻止f12
const preventF12=()=>{
	window.onkeydown=window.onkeyup=window.onkeypress=(e)=>{
		console.log(e.keyCode);
		if (e.keyCode==123) {
			e.preventDefault()
			window.event.returnValue=false
		}
	}
}
//无限debugger
const mobiusdebugger=()=>{
	const check=()=>{
		const doCheck=(a)=>{
			if ((""+a/a)["length"]!=1||a%20==0) {
				(
					function () {}
					["constructor"]("debugger")()
				)
				
			}else{
				(
					function () {}
					["constructor"]("debugger")()
				)
			}
			doCheck(++a)
		}
		try{
			doCheck(0)
		}catch(err){}
	}
	setInterval(()=>{
		check()
	},1000)
}
</script>

<style lang="scss">
	@import "vk-uview-ui/index.scss";
	
	#app{
		height: 100vh;
	}
</style>
