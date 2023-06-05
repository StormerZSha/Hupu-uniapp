import {request} from "../util/request";



export class TopicApi {
    /**
     * 获取子版信息
     * @param topicId 版面id
     * @returns 
     */
    public static async getZone(params:{topicId:number}) {
        return request({
          url: `/pcmapi/pc/bbs/v1/topicZone?topicId=${params.topicId}`,
          method: "get",
        });
    }
    /**
     * 获取主题信息
     * @param topic_id 为版面id
     * @param tab_type 可为1,2,3具体意义未知,目前2为基本数据其他值待测试
     * @param page 页码
     * @param zoneId 子版id,可为null查询版面下所有子版
     * @returns 
     */
    public static async getTopic(params:{topic_id:number,tab_type:number,page:number,zoneId:number}){
      return request({
        url:'/8.0.34/topics/getTopicThreads',
        method:'get',
        params
      })
    }
    /**
     * 获取主题内的回复
     * @param client 固定为'000000000000000'
     * @param fid 版面id
     * @param night 固定为0
     * @param tid 主题id
     * @param sign md签名
     * @returns 
     */
    public static async getReply(params:{client:string,fid:number,night:number,page:number,tid:string,sign:string}){
      return request({
        url:'/8.0.34/threads/getsThreadPostList',
        method:'get',
        params
      })
    }
}
