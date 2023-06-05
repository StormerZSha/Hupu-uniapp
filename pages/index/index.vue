<template>
	<view class="index">
		<view class="sidebar">
			<view class="sidebaritem" @click="toTopic('788')">bbb</view>
			<view class="sidebaritem" @click="toTopic('706')">gs</view>
			<view class="sidebaritem" @click="toTopic('802')">hksr</view>
		</view>
	</view>
</template>

<script setup>
	const toTopic=(item)=>{
		uni.redirectTo({url:`/pages/topic/index?topicId=${item}`})
	}
	let data=uni.getDeviceInfo()
	console.log(data);
</script>

<style lang="scss">
	.index {
		background-color: rgb(86, 147, 171);
		.sidebar{
			width: 250rpx;
			height: 100vh;
			background-color: rgba(0,0,0,0.1);
			display: flex;
			flex-direction: column;
			justify-content: center;
			.sidebaritem{
				width: 100%;
				height: 100rpx;
				border:1px solid #ccc;
				border-radius: 8rpx;
				text-align: center;
				line-height: 100rpx;
				font-size: 36rpx;
				color: #fff;
			}
		}
	}

</style>
