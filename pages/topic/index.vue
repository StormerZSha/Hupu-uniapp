<template>
	<view class="topic" ref="topic">
		<view class="spaceheader">
			样式待定,就是用来垫高手机顶部的
		</view>
		<view class="title">
			<view class="titlename"> 
				<image src="#" alt="测试"></image>
				<view>{{pagetitle}}</view>
			</view>
			<view class="slogan">{{ pageslogan }}</view>
		</view>
		<view class="typelist">
			<view class="typelistinner" ref="typelist">
				<view class="checked" @click="chooseType(0)">主版</view>
				<view v-for="(item,index) in typeData" @click="chooseType(index+1)">
					{{ item.tempname }}
				</view>
			</view>
			
		</view>
		<view class="topiclist">
			<view v-for="item in topicData" @click="toReply(item)">
				<view class="user">{{ item.user_name }}</view>
				<view class="topictitle">{{ item.title }}</view>
				<div class="bottom">
					<view class="othermsg">
						回复{{ item.replys }}/推荐{{ item.recommends }}
					</view>
					<view class="time">{{ item.time }}</view>
				</div>
			</view>
		</view>
	</view>
</template>

<script setup>
import { TopicApi } from '../../api/topic';
import {onLoad,onShow,onBackPress,onReachBottom,onPullDownRefresh} from "@dcloudio/uni-app";
import MD from '../../util/MD5'
import {ref,nextTick} from 'vue'
let topicId=ref('')
let typeData=ref([])
let topicData=ref([])
let pagetitle=ref('')
let pageslogan=ref('')
let sign=''

let checkedtype=ref(null)
let typelist=ref(null)
let currentpage=ref(1)
let topic=ref(null)
onLoad((option)=>{
	topicId.value=option.topicId
	if (option.topicId==788) {
		pagetitle.value='bbb'
		pageslogan.value='wsjssymhez'
	}else if (option.topicId==706) {
		pagetitle.value='gs'
		pageslogan.value='fdlgsdzz,sjrtfy'
	}else{
		pagetitle.value=='hksr'
		pageslogan='ycxzdqx'
	}
	geTypeData()
	getTopicData(1,topicId.value,null)
})
//用户返回时的操作
onBackPress(e=>{
	uni.redirectTo({url:'/pages/index/index'})
	return true;
})
onReachBottom(async()=>{
	currentpage.value++
	await getTopicData(currentpage.value,topicId.value,checkedtype.value)
})
onPullDownRefresh(()=>{
	currentpage.value=1
	topicData.value=[]
	getTopicData(currentpage.value,topicId.value,checkedtype.value)
	setTimeout(()=>{
		uni.stopPullDownRefresh()	
	},1000)
})
//获取子版信息
const geTypeData=async()=>{
	const res=await TopicApi.getZone({
		topicId:topicId.value
	})
	typeData.value=res.data
	res.data.forEach((item,index)=>{
		item['tempname']=`子分区${index}`
	})
}
//获取主题信息
const getTopicData=async (page,topicid,zoneId)=>{
	const res=await TopicApi.getTopic({
		topic_id:topicid,
		tab_type:2,
		page:page,
		zoneId:zoneId//子分区的id
	})
	topicData.value.push(...res.data.list)
}
//获取回复信息
const getReplyData=async (page,tid)=>{
	getMD5(page,tid)
	const res=await TopicApi.getReply({
		client:'000000000000000',
		fid:788,
		night:0,
		page:page,
		tid:tid,
		sign:sign
	})
}
//获取md5签名
const getMD5=(page,tid)=>{
	let query=`client=000000000000000&fid=788&night=0&page=${page}&tid=${tid}`
	sign=MD(query+'HUPU_SALT_AKJfoiwer394Jeiow4u309')
}
//切换版块
const chooseType=(index)=>{
	let typelistdom=typelist.value.$el.children
	for(let i=0;i<typelistdom.length;i++){
		typelistdom[i].setAttribute('class','')
	}
	typelistdom[index].setAttribute('class','checked')
	if (index>0) {
		checkedtype.value=typeData.value[index-1].id
	}else{
		checkedtype.value=null
	}
	topicData.value=[]
	getTopicData(1,topicId.value,checkedtype.value)
}
//去详情页面
const toReply=(item)=>{
	uni.navigateTo({url:`/pages/reply/index?topicdata=${JSON.stringify(item)}&topicId=${topicId.value}`})
}
</script>

<style lang="scss">
	.topic {
		background-color: #eee;
		// height: 100vh;
		overflow-y: scroll;
		&::-webkit-scrollbar{
			display: none;
		}
		.spaceheader{
			background-color: pink;
			font-size: 16rpx;
			height: 48rpx;
			border-bottom: 1rpx solid rgb(230, 212, 215);
			text-align: center;
			line-height: 48rpx;
			color: #fff;
		}
		.title{
			background-color: #fff;
			padding: 25rpx;
			border-bottom: 1px solid #ccc;
			.titlename{
				display: flex;
				font-weight: 600;
				line-height: 90rpx;
				image{
					width: 90rpx;
					height: 90rpx;
					border: 1px solid #ccc;
					margin-right: 25rpx;
				}
			}
			.slogan{
				color: #969696;
				margin-top: 15rpx;
			}
		}
		.typelist{
			height: 80rpx;
			background-color: #f9f9f9;
			box-shadow: -1px 2px 3px #ccc;
			line-height: 80rpx;
			font-weight: 400;
			padding-left: 35rpx;
			overflow-x: scroll;
			overflow-y: hidden;
			position: relative;
			&::-webkit-scrollbar{
				display: none;
			}
			.typelistinner{
				height: 100%;
				display: flex;
				position: absolute;
				left: 35rpx;
				view{
					flex-shrink: 0;
					padding: 0 15rpx;
					margin: 0 15rpx;
				}
				.checked{
					border-bottom: 5rpx solid #e1e1e1;
					background: #f0f0f0;
				}
			}
			
		}
		.topiclist{
			>view{
				background-color: #fff;
				border-bottom: 1px solid #f0f1f5;
				padding: 32rpx;
			}
			.user{
				color: #24262b;
				font-size: 24rpx;
			}
			.topictitle{
				font-size:32rpx;
				margin-top: 16rpx;
				color: #24262b;
			}
			.bottom{
				margin-top: 24rpx;
				font-size: 22rpx;
				display: flex;
				.othermsg{
					color: #89909f;
				}
				.time{
					margin-left: auto;
				}
			}
		}
	}

</style>
