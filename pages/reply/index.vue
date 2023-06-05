<template>
	<view class="reply" ref="reply">
		<view class="spaceheader">
			样式待定,就是用来垫高手机顶部的
		</view>
		<view class="topic">
			<view class="title">{{ topicData.title }}</view>
            <view class="topicuser">
                <view class="pic">
					<image :src="topiccontentData.headurl" />
				</view>
				<view>
					<view class="name">{{ topicData.user_name }}</view>
                	<view class="topictime" v-html="topiccontentData['headtime']"></view>
				</view>
            </view>
            <view class="content" v-html="topiccontentData['content']" ></view>
            <view class="count" >
				<view>{{ topiccontentData['location'] }}</view>
				<view class="countnumber">{{ topiccontentData['count'] }}</view>
			</view>
		</view>

		<view class="replylist">
			<view v-for="item in replyData">
				<view class="replyuser">
					<view class="pic">
						<image :src="item.userImg" />
					</view>
					<view>
						<view class="user">{{ item.userName }}</view>
						<view class="userothermsg">
							<view class="time">{{ item.time }}</view>
							<view class="location">{{ item.location }}</view>
						</view>
					</view>
				</view>
				<div class="quote" v-if="item.quote.length>0">
					<div class="quoteheader" v-html="item.quote[0].header[0]"></div>
					<div class="quotecontent">{{item.quote[0].content }}</div>
				</div>
				<view class="replytitle">{{ item.content }}</view>
				<view class="replyimg">
					<image :src="url" v-for="(url,index) in item.contentPic" @click="previewImages(index,item.contentPic)"/>
				</view>
				<div class="bottom">
					<view class="lightcount">
						点亮数{{ item.light_count }}
					</view>
					<view class="reply">回复</view>
				</div>
			</view>
			<view v-if="replyData.length==0">暂无回复</view>
		</view>
		<view class="pageation">
			<text @click="openpagechangeModal">{{ currentpage }}/{{ pagetotal }}</text>
			<u-modal 
				v-model="pagechangeModal" 
				:show-title="false"
				:show-confirm-button="false"
				:show-cancel-button="false"
				:border-radius="8"
				:mask-close-able="true"
				width="90%"
				>
				<view class="slot-content">
					<view class="textbtn">
						<view @click="pageChange(1)">首页</view>
						<view @click="pageChange(pagetotal)">末页</view>
					</view>
					<scroll-view class="numberbtn" :scroll-y="true"  :scroll-top="pageanchor">
						<view v-for="item in pagetotal" :class="item==currentpage?'current':''" :id="'pagenumber'+item" @click="pageChange(item)">
							<text>{{ item }}</text>
						</view>
					</scroll-view>
				</view>
			</u-modal>
		</view>
	</view>
</template>

<script setup>
import { TopicApi } from '../../api/topic';
import {onLoad,onReachBottom,onPageScroll} from "@dcloudio/uni-app";
import {ref,reactive,nextTick,watch} from 'vue'
import MD5 from '../../util/MD5';
import cheerio from 'cheerio'
let replyId=ref('')
let topicId=ref('')
let replyData=ref([])
let topicData=ref(null)
let topiccontentData=reactive({})
let sign=''
let pagetotal=ref(1)
let pagechangeModal=ref(false)
let pageanchor=ref('')
let currentpage=ref(1)
let reply=ref(null)
let lastscrollup=ref(0)
onLoad((option)=>{
    topicData.value=JSON.parse(option.topicdata)
	replyId.value=topicData.value.tid
    topicId.value=option.topicId
    getReplyData(1,replyId.value)
	getTopiccontent()
})
onPageScroll(async(e)=>{
	//页面滚动到主体下面，且不是从底部滚上去的，且是向上滚的,且当前不是第一页
	if (e.scrollTop<665&&!(lastscrollup.value-e.scrollTop>200)&&(lastscrollup.value>=e.scrollTop)&&currentpage.value>1) {
		currentpage.value--
		uni.pageScrollTo({
			scrollTop:3500,
			duration:0
		})
		await getReplyData(currentpage.value,replyId.value)	
	}
	if (lastscrollup.value!=e.scrollTop) {
		lastscrollup.value=e.scrollTop
	}
})
onReachBottom(async()=>{
	currentpage.value++
	uni.pageScrollTo({
		scrollTop:670,
		duration:0
	})
	await getReplyData(currentpage.value,replyId.value)
})
//获取md5签名--回复信息
const getMD5=(page,tid)=>{
	let query=`client=000000000000000&fid=${topicId.value}&night=0&page=${page}&tid=${tid}`
	sign=MD5(query+'HUPU_SALT_AKJfoiwer394Jeiow4u309')
}
//获取回复信息
const getReplyData=async (page,tid)=>{
	uni.showLoading()
	getMD5(page,tid)
	const res=await TopicApi.getReply({
		client:'000000000000000',
		fid:topicId.value,
		night:0,
		page:page,
		tid:tid,
		sign:sign
	})
    pagetotal.value=res.data.result.all_page
	res.data.result.list.forEach(item => {
		//整理content中的图片
		const $=cheerio.load(item.content)
		let imgdom =$('img')
		item['contentPic']=[]
		if (imgdom.length!=0) {
			for(let i=0;i<imgdom.length;i++){
				// imgdom[i].attribs['data-origin']||
				let imgurl=imgdom[i].attribs['data_url']
				if (imgurl.indexOf('?')>0) {
					imgurl=imgurl.slice(0,imgurl.indexOf('?'))
				}
				item['contentPic'].push(imgurl)
			}
			item.content=$('body').text()
		}
		//quote中的图片
		if (item.quote.length>0) {	
			const $=cheerio.load(item.quote[0].content)
			let imgdom =$('img')
			item['quotetPic']=[]
			if (imgdom.length!=0) {
				for(let i=0;i<imgdom.length;i++){
					// imgdom[i].attribs['data-origin']||
					let imgurl=imgdom[i].attribs['data_url']
					if (imgurl.indexOf('?')>0) {
						imgurl=imgurl.slice(0,imgurl.indexOf('?'))
					}
					item['contentPic'].push(imgurl)
				}
				item.quote[0].content=$('body').text()
			}
		}
	});
	replyData.value=res.data.result.list
	uni.hideLoading()
}
//获取主体信息
const getTopiccontent=async()=>{
	nextTick(()=>{
		let url=`/htmlfile/${replyId.value}-1.html`
		// #ifdef APP-PLUS
			url=`https://m.hupu.com/bbs/${replyId.value}-1.html`
    	// #endif
		uni.request({
			url:url,
			method:"POST",
			success:(res)=>{
				const $=cheerio.load(res.data)
				topiccontentData['headurl']=$('.hupu-bbs-post img')[0].attribs.src
				topiccontentData['headtime']=$('.hupu-bbs-post .second-line-user-info').html()
				topiccontentData['content']=$('.hupu-bbs-post .bbs-content').html()
				topiccontentData['location']=$('.hupu-bbs-post .bbs-hcoin__ipaddress').text()
				topiccontentData['count']=$('.hupu-bbs-post .bbs-hcoin__read-count').text()
			},
		fail:(err)=>{
			console.log('fail2');
		}
	})
	})
	
}

//打开翻页器
const openpagechangeModal=()=>{
	pagechangeModal.value=true
	// toAnchor(currentpage.value)
	// autochangeFontSize()
}
//翻页器翻页
const pageChange=(item)=>{
	currentpage.value=item
	changeSelectedStyle(item-1)
	getReplyData(item,replyId.value)
	pagechangeModal.value=false
	uni.pageScrollTo({
		scrollTop:670,
		duration:0
	})
}
//修改翻页器文字大小
const autochangeFontSize=()=>{
	nextTick(()=>{
		let dom=document.getElementsByClassName('uni-scroll-view-content')[1]
		for(let i=0;i<dom.children.length;i++){
			let item=dom.children[i]
			if (item.innerText.length==3) {
				item.children[0].style.fontSize="97%"
			}
			if (item.innerText.length==4) {
				item.children[0].style.fontSize="79%"
			}
		}
	})
}
//修改翻页器选中状态
const changeSelectedStyle=(index)=>{
	let dom=document.getElementsByClassName('uni-scroll-view-content')[1]
		for(let i=0;i<dom.children.length;i++){
			let item=dom.children[i]
			item.setAttribute('class','')
		}
		dom.children[index].setAttribute('class','current')
}
//翻页器锚点跳转
const toAnchor=(item)=>{
	nextTick(()=>{
		let len=40*(Math.floor(item/8))-0.5*(Math.floor(item/8))
		pageanchor.value=len
	})
	pageanchor.value=''
}
//图片预览
const previewImages=(index,imgs)=>{
	uni.previewImage({
		current:index,
		urls:imgs,
		indicator:'none',
	})
}




</script>

<style lang="scss">
	.reply {
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
		.topic{
			background-color: #fff;
			padding: 25rpx;
			border-bottom: 1px solid #ccc;
			.title{
				display: flex;
				font-weight: 600;
				line-height: 90rpx;
				font-size: 40rpx;
				color: #24262b;
			}
			.topicuser{
				display: flex;
				margin-bottom: 40rpx;
				.name{
					color: #24262b;
					font-size: 28rpx;
				}
				.topictime{
					color: #89909f;
					font-size: 24rpx;
				}
				image{
					width: 76rpx;
					height: 76rpx;
					border: 1px solid #ccc;
					margin-right: 25rpx;
					border-radius: 50%;
				}
			}
			.content{
				color: #24262b;
				font-size: 34rpx;
				font-weight: 600;
				line-height: 60rpx;
			}
			.count{
				font-size: 24rpx;
				color: #89909f;
				display: flex;
				.countnumber{
					margin-left: 50rpx;
				}
			}
		}

		.replylist{
			>view{
				background-color: #fff;
				border-bottom: 1px solid #f0f1f5;
				padding: 32rpx;
			}
			.replyuser{
				display: flex;
				image{
					width: 76rpx;
					height: 76rpx;
					border: 1px solid #ccc;
					margin-right: 25rpx;
					border-radius: 50%;
				}
				.user{
					color: #24262b;
					font-size: 28rpx;
				}
				.userothermsg{
					font-size: 24rpx;
					color: #89909f;
					margin-top: 8rpx;
					display: flex;
					.location{
						margin-left: 30rpx;
					}
				}
			}
			.quote{
				background-color: #f6f7f9;
			}
			.replytitle{
				font-size:32rpx;
				margin-top: 16rpx;
				color: #24262b;
			}
			.replyimg{
				display: flex;
				image{
					width: 120rpx;
					height: 120rpx;
				}
			}
			.bottom{
				margin-top: 24rpx;
				font-size: 24rpx;
				display: flex;
				color: #89909f;
				.reply{
					margin-left: 35rpx;
					background: none;
				}
			}
		}
		.pageation{
			width: 100%;
			height: 75rpx;
			background-color: #fff;
			box-shadow: 0px 0px 3px #ccc;
			position: fixed;
			left: 0;
			bottom: 0;
			.slot-content{
				padding: 30rpx 15rpx;
				.textbtn{
					display: flex;
					justify-content: space-between;
					font-size: 32rpx;
					color: #ea4e4e;
				}
				.numberbtn{
					display: flex;
					flex-wrap: wrap;
					padding-left: 20rpx;
					margin-top: 30rpx;
					height: 350rpx;
					.uni-scroll-view-content>view,.current{
						width: 60rpx;
						height: 60rpx;
						box-shadow: 0 0  0 1px #ccc;
						margin: 8rpx;
						line-height: 60rpx;
						text-align: center;
						background-color: #eee;
						color: #24262b;
						display: inline-block;
					}
					.uni-scroll-view-content>.current{
						background-color: #ffd3d3;
						color: #fff;
						box-shadow: 0 0  0 1px #fb9e9e;
					}
				}

			}
			
		}
	}

</style>
