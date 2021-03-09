/*
tgchannel：https://t.me/ZhiYi_Script
github：https://github.com/ZhiYi-N/script
boxjs：https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/ZhiYi-N.boxjs.json
转载留个名字，谢谢
邀请码：190512
谢谢
作者：执意ZhiYi-N
#看一个视频获取ck
目前包含：
看视频奖励、分享奖励
点赞视频奖励、评论视频奖励
榜单投票、榜单抽奖、脱口秀投票
[mitm]
hostname = ranlv.lvfacn.com
#圈x 
[rewrite local]
https://ranlv.lvfacn.com/api.php/Common/pvlog url script-request-header https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/ranlv.js


#loon
http-request https://ranlv.lvfacn.com/api.php/Common/pvlog script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/ranlv.js, requires-body=true, timeout=10, tag=燃旅视频


#surge
燃旅视频 = type=http-request,pattern=^https://ranlv.lvfacn.com/api.php/Common/pvlog,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/ranlv.js,script-update-interval=0

*/
const zhiyi = '燃旅视频'
const $ = Env(zhiyi)
const notify = $.isNode() ?require('./sendNotify') : '';
let status, videoid,myid,supportvideoid,supportrank,show;
status = (status = ($.getval("rlstatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
const rlurlArr = [], rlheaderArr = [],rlbodyArr = []
let rlurl = $.getdata('rlurl')
let rlheader = $.getdata('rlheader')
let rlbody = $.getdata('rlbody')
let tz = ($.getval('tz') || '1');//0关闭通知，1默认开启
let cash = ($.getval('rlcash') || '0')//默认不自动提现
const invite=1;//新用户自动邀请，0关闭，1默认开启
const logs =0;//0为关闭日志，1为开启
var hour=''
var minute=''
if ($.isNode()) {
   hour = new Date( new Date().getTime() + 8 * 60 * 60 * 1000 ).getHours();
   minute = new Date( new Date().getTime() + 8 * 60 * 60 * 1000 ).getMinutes();
}else{
   hour = (new Date()).getHours();
   minute = (new Date()).getMinutes();
}
//CK运行
let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie();
   $.done()
} 
if ($.isNode()) {
   if (process.env.RLURL && process.env.RLURL.indexOf('#') > -1) {
   rlurl = process.env.RLURL.split('#');
   console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.RLURL && process.env.RLURL.indexOf('\n') > -1) {
   rlurl = process.env.RLURL.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   rlurl = process.env.RLURL.split()
  };
  if (process.env.RLHEADER && process.env.RLHEADER.indexOf('#') > -1) {
   rlheader = process.env.RLHEADER.split('#');
   console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.RLHEADER && process.env.RLHEADER.indexOf('\n') > -1) {
   rlheader = process.env.RLHEADER.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   rlheader = process.env.RLHEADER.split()
  };
  if (process.env.RLBODY && process.env.RLBODY.indexOf('#') > -1) {
   rlbody = process.env.RLBODY.split('#');
   console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.RLBODY && process.env.RLBODY.indexOf('\n') > -1) {
   rlbody = process.env.RLBODY.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   rlbody = process.env.RLBODY.split()
  };
    console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
    console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
 } else {
    rlurlArr.push($.getdata('rlurl'))
    rlheaderArr.push($.getdata('rlheader'))
    rlbodyArr.push($.getdata('rlbody'))
    let rlcount = ($.getval('rlcount') || '1');
  for (let i = 2; i <= rlcount; i++) {
    rlurlArr.push($.getdata(`rlurl${i}`))
    rlheaderArr.push($.getdata(`rlheader${i}`))
    rlbodyArr.push($.getdata(`rlbody${i}`))
  }
}
!(async () => {
if (!rlheaderArr[0] && !rlbodyArr[0] && !rlurlArr[0]) {
    $.msg($.name, '【提示】请先获取燃旅视频一cookie')
    return;
  }
   console.log(`------------- 共${rlheaderArr.length}个账号----------------\n`)
  for (let i = 0; i < rlheaderArr.length; i++) {
    if (rlheaderArr[i]) {
      message = ''
      note =''
      rlurl = rlurlArr[i];
      rlheader = rlheaderArr[i];
      rlbody = rlbodyArr[i];
      $.index = i + 1;
      console.log(`\n开始【燃旅视频${$.index}】`)
      await checkVersion()
      await index()
      await userinfo()
      await task_center()
      await myVotes()
      await wiTask()
      await showmsg()
      
  }
 }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())  
    
function GetCookie() {
if($request&&$request.url.indexOf("Common/pvlog")>=0) {
   const rlurl = $request.url.split('?')[1]
   if(rlurl)     $.setdata(rlurl,`rlurl${status}`)
   $.log(`[${zhiyi}] 获取rlurl请求: 成功,rlurl: ${rlurl}`)
   $.msg(`rlurl${status}: 成功🎉`, ``)
   const rlheader = JSON.stringify($request.headers)
    if(rlheader)    $.setdata(rlheader,`rlheader${status}`)
    $.log(`[${zhiyi}] 获取rlheader请求: 成功,rlheader: ${rlheader}`)
    $.msg(`rlheader${status}: 成功🎉`, ``)
}
}
//checkVersion
async function checkVersion(){
let url = rlurl.replace(/&video_id=\d+/,'')
let headers = rlheader.replace(/acw_tc=\w+/,'')
 return new Promise((resolve) => {
    let checkVersion_url = {
   	   url: `https://ranlv.lvfacn.com/api.php/Common/checkVersion?${url}`,
        headers: JSON.parse(headers)
    	}
   $.post(checkVersion_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        message += '🔔【检测更新】 '
        if(result.code == 0){
        console.log('🎈'+result.msg+' 当前版本:'+result.data.version_code+'\n')
        message += '🎈'+result.msg+' 当前版本:'+result.data.version_code+'\n'
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }  
//index
async function index(){
let url = rlurl.replace(/&video_id=\d+/,'')
let headers = rlheader.replace(/acw_tc=\w+/,'')
 return new Promise((resolve) => {
    let index_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Ranlv/index?&list_rows=12&member_id=${myid}&page=1&random=1&${url}`,
        headers: JSON.parse(headers)
    	}
   $.post(index_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs) $.log(data)
        //message += '🔔【首页刷新】 '
        if(result.code == 0){
        let videoid_list = data.match(/"id":\d{5}/g)
        let idex = Math.random()
        let no = Math.round( idex > 0.2 ? ((idex+0.1)*10) : ((idex+0.2)*10))
        let newvideoid_list = videoid_list[no]
        videoid = newvideoid_list.replace(/"id":/,'')
        //console.log('🎈刷新'+result.msg+'\n')
        //message += '🎈刷新'+result.msg+'\n'
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }  
//userinfo
async function userinfo(){
let url = rlurl.replace(/&video_id=\d+/,'')
let user_id = rlurl.match(/\d{6}/)
let headers = rlheader.replace(/acw_tc=\w+/,'')
 return new Promise((resolve) => {
    let userinfo_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Member/mine?&user_id=${user_id}&${url}`,
        headers: JSON.parse(rlheader)
    	}
   $.get(userinfo_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs) $.log(data)
        message += '🔔【用户信息】 '
        if(result.code == 0){
        myid = result.user.id
        console.log('🎈'+result.msg+' 邀请码：'+result.user.id+' 昵称：'+result.user.nickname+' 燃旅号：'+result.user.ranlvid +'\n')
        console.log('现有余额：'+result.user.balance + '提现额度：'+result.user.lines+'\n')
        if(cash > 0 && Number(result.user.balance) >= cash && Number(result.user.lines) >= Number(result.user.balance)){
        await wallet()
        }
        message += '🎈'+result.msg+' 邀请码：'+result.user.id+' 昵称：'+result.user.nickname+' 燃旅号：'+result.user.ranlvid +'现有余额：'+result.user.balance + '提现额度：'+result.user.lines+'\n'
        }else{
        console.log('👀我也不知道\n')
        message += '👀我也不知道\n'
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
//task_center
async function task_center(){
let url = rlurl.replace(/&video_id=\d+/,'')
let headers = rlheader.replace(/acw_tc=\w+/,'')
 return new Promise((resolve) => {
    let task_center_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Share/taskCenter?${url}`,
        headers: JSON.parse(rlheader)
    	}
   $.get(task_center_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        message += '🔔【奖励任务状态】 '
        console.log('🎈【奖励任务状态】 ')
        if(result.code == 0){
        let inviteArr = result.data.task.find(item => item.id === 5)
        console.log('邀请人数：'+inviteArr.to_num)
        let luckyArr = result.data.task.find(item => item.id === 15)
        console.log('幸运红包：'+luckyArr.to_num+'/'+luckyArr.num)
        let shareArr = result.data.task.find(item => item.id === 6)
        console.log('分享红包：'+shareArr.to_num+'/'+shareArr.num)
        let rankArr = result.data.task.find(item => item.id === 11)
        console.log('榜单红包：'+rankArr.to_num+'/'+rankArr.num)
        if(rankArr.to_num != rankArr.num){
        show = 0;
        }
        if(rankArr.to_num == rankArr.num){
        show = 1;
        }
        if(shareArr.to_num < shareArr.num){
        await share()
        await video_info()
        await wxfx()
        await share_rewards() 
        }
        let videoArr = result.data.task.find(item => item.id === 7)
        console.log('视频任务：'+videoArr.to_num+'/'+videoArr.num)
        if(luckyArr.to_num < luckyArr.num || videoArr.to_num < videoArr.num){
        await video_reward()
        }
        message += '邀请人数：'+inviteArr.to_num+'\n'+'幸运红包：'+luckyArr.to_num+'/'+luckyArr.num+'\n'+'分享红包：'+shareArr.to_num+'/'+shareArr.num+'\n'+'视频任务：'+videoArr.to_num+'/'+videoArr.num+'\n'
        if(luckyArr.to_num >= luckyArr.num && shareArr.to_num >= shareArr.num && videoArr.to_num >= videoArr.num){
        note += '奖励任务已完成\n'
        }
        }else{
        console.log('👀我也不知道\n')
        message += '👀我也不知道\n'
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }  
//video_reward
async function video_reward(){
let url = rlurl.replace(/\d{5}$/,`${videoid}`)
 return new Promise((resolve) => {
    let video_reward_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Common/pvlog?${url}`,
        headers: JSON.parse(rlheader),
    	}
   $.post(video_reward_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        await sleep(Math.random()*30000)
        message += '🔔【视频奖励】 '
        if(result.code == 0){
        console.log('🎈视频'+result.msg+'\n')
        message += '🎈'+result.msg+'\n'
        }else{
        console.log('👀'+result.msg+"\n")
        message += '👀'+result.msg+"\n"
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }  
//share
async function share(){
let url = rlurl.replace(/\d{5}$/,`${videoid}`)
 return new Promise((resolve) => {
    let share_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Rcharts/shareVideo?${url}`,
    	headers: JSON.parse(rlheader),
    	}
   $.get(share_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0){
        //console.log('🎈'+result.msg+'\n')
        //message += '🎈'+result.msg+'\n'
}
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
//video_info
async function video_info(){
let accesstoken = rlurl.match(/access_token=\w{32}/)
 return new Promise((resolve) => {
    let video_info_url = {
     url: 'https://ranlv.lvfacn.com/api.php/Ranlv/videoInfo',
    	headers: {
     "Accept": "*/*",
     "Accept-Encoding": "gzip, deflate, br",
     "Accept-Language": "zh-cn",
     "Connection": "keep-alive",
     "Content-Length": "72",
     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
     "Host": "ranlv.lvfacn.com",
     "Origin": "http://ran.lvfacn.com",
     "Referer": `"http://ran.lvfacn.com/play.html?videoid=${videoid}&to_user_id=${myid}"`,
     "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.2(0x1800022c) NetType/WIFI Language/zh_CN"
     }, 	
     body: `${accesstoken}&video_id=${videoid}&member_id=0`
}
   $.post(video_info_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0){
        //console.log('🎈视频id'+result.msg)
        }else{
        //console.log('视频播放失败'+'\n')
}
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 

//wxfx
async function wxfx(){
let accesstoken = rlurl.match(/access_token=\w{32}/)
 return new Promise((resolve) => {
    let wxfx_url = {
   		url: `https://ranlv.lvfacn.com/api.php/live/wxfx.html`,
    	headers: {
     "Accept": "*/*",
     "Accept-Encoding": "gzip, deflate, br",
     "Accept-Language": "zh-cn",
     "Connection": "keep-alive",
     "Content-Length": "72",
     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
     "Host": "ranlv.lvfacn.com",
     "Origin": "http://ran.lvfacn.com",
     "Referer": `"http://ran.lvfacn.com/play.html?videoid=${videoid}&to_user_id=${myid}"`,
     "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.2(0x1800022c) NetType/WIFI Language/zh_CN"
     }, 	
    	body: `${accesstoken}&url=http://ran.lvfacn.com/play.html?videoid=${videoid}&to_user_id=${myid}`
    	}
   $.post(wxfx_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0){
	   //console.log('🎈微信访问'+result.msg+'\n')
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
//share_rewards
async function share_rewards(){
let accesstoken = rlurl.match(/access_token=\w{32}/)
 return new Promise((resolve) => {
    let share_rewards_url = {
   	   url: `https://ranlv.lvfacn.com/api.php/Common/pvlog`,
        headers: JSON.parse(rlheader),
        body: `${accesstoken}&uuid=&client=2&member_id=0&video_id=${videoid}&redouble=1&to_user_id=${myid}`
    	}
   $.post(share_rewards_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        await sleep(Math.random()*30000)
        if(result.code == 0){
        //console.log('🎈分享'+result.msg+'\n')
        }else{
        console.log('👀'+"我也不知道\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
//wiTask
async function wiTask(){
 return new Promise((resolve) => {
    let wiTask_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Share/wiTask?${rlurl}`,
        headers: JSON.parse(rlheader),
    	}
   $.post(wiTask_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs) $.log(data)
        if(result.code == 0){
        message += '🔔【提现任务状态】 '
        console.log('🎈'+result.msg+'\n')

        message += '🎈'+result.msg+'\n'
        let praiseArr = result.data.find(item => item.id === 3)
        console.log('点赞任务：'+praiseArr.to_num+'/'+praiseArr.num+' ')
        let commentArr = result.data.find(item => item.id === 4)
        console.log('评论任务：'+commentArr.to_num+'/'+commentArr.num+` `)
        let videoArr = result.data.find(item => item.id === 1)
        console.log('视频任务：'+videoArr.to_num+'/'+videoArr.num+' ')
        message += '点赞任务：'+praiseArr.to_num+'/'+praiseArr.num+'\n'+'评论任务：'+commentArr.to_num+'/'+commentArr.num+`\n`+'视频任务：'+videoArr.to_num+'/'+videoArr.num+'\n'
       if(praiseArr.to_num < praiseArr.num){
        await checkPraise()
        }
       if(commentArr.to_num < commentArr.num){
        await comment()
        }
        if(praiseArr.to_num >= praiseArr.num && commentArr.to_num >= commentArr.num && commentArr.to_num >= commentArr.num){
        note += '提现任务已完成'
        $.log(zhiyi,'',note)
        }
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
//checkPraise
async function checkPraise(){
let url = rlurl.replace(/\d{5}$/,`${videoid}`)
 return new Promise((resolve) => {
    let checkPraise_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Ranlv/checkPraise?&like_ran=1&${url}`,
    	headers: JSON.parse(rlheader),
    	}
   $.post(checkPraise_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs) $.log(data)
        message += '🔔【点赞视频】 '
        if(result.code == 0){
        console.log('🎈'+result.msg+'\n')
        message += '🎈'+result.msg+'\n'
        }else{
        console.log('👀'+result.msg+'\n')
        message += '👀'+result.msg+'\n'
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
//comment 10个随机
async function comment(){
let url = rlurl.replace(/\d{5}$/,`${videoid}`)
let newcomment;
let commentarr = ['%E7%9C%9F%E4%B8%8D%E9%94%99%E5%93%A6','%E7%9C%9F%E5%A5%BD%E5%93%88','%E6%94%AF%E6%8C%81%E4%B8%80%E4%B8%8B','%E8%BF%98%E4%B8%8D%E9%94%99%E5%93%A6','%E6%84%9F%E8%A7%89%E8%BF%98%E5%8F%AF%E4%BB%A5','%E5%8F%AF%E4%BB%A5%E7%9A%84','%E6%84%9F%E8%B0%A2%E5%88%86%E4%BA%AB','%E4%B8%8D%E9%94%99%E5%93%9F','%E6%88%91%E5%96%9C%E6%AC%A2','%E7%9C%9F%E4%BC%98%E7%A7%80','%E6%9C%89%E4%BA%9B%E4%BC%98%E7%A7%80']
let x = Math.random()
let no = Math.round( x < 0.1? ((x+0.1)*9) : (x*9))
newcomment = commentarr[no]
 return new Promise((resolve) => {
    let comment_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Ranlv/addComments?content=${newcomment}&${url}`,
    	headers: JSON.parse(rlheader),
    	}
   $.post(comment_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs) $.log(data)
        message += '🔔【评论视频】'
        await sleep(Math.random()*30000)
        if(result.code == 0){
	     console.log('🎈'+result.msg+'\n')
        message += '🎈'+result.msg+'\n'
        }else{
        console.log('👀'+result.msg+'\n')
        //message += '👀'+"我也不知道\n"
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
//myVotes
async function myVotes(){
let user_token = rlurl.match(/user.*?(?=&)/)+''
let access_token = rlurl.match(/access_token=\w+/)+''
let new_user_token = user_token.replace(/user_token=/,'')
let new_access_token = access_token.replace(/access_token=/,'')
 return new Promise((resolve) => {
    let myVotes_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Rcharts/myVotes`,
    	headers: {
     "Accept": "*/*",
     "Accept-Encoding": "gzip, deflate, br",
     "Accept-Language": "zh-cn",
     "Connection": "keep-alive",
     "Content-Length": "480",
     "Content-Type": "application/json",
     "Host": "ranlv.lvfacn.com",
     "Origin": "https://ran.lvfacn.com",
     "Referer": "https://ran.lvfacn.com/pages/rank/prizeapp?${user_token}&${access_token}",
     "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
     },
     body: `{"access_token":"${new_access_token}","user_token":"${new_user_token}"}`
    	}
   $.post(myVotes_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs) $.log(data)
        if(result.code == 0){
        console.log('🎈投票查询'+result.msg+' 可投票数：'+result.data.votes+'\n')
        message += '🎈投票查询'+result.msg+' 可投票数：'+result.data.votes+'\n'
        let lottery_num = result.data.rate
        if(result.data.votes > 0){
        if(show == 0){
        await mySupport()
        }
        if(show == 1){
        await getRank()
        }
        await goVote()
        await vote_rewards()
        }
        if(lottery_num > 0){
        //for(let i = 0; i < lottery_num; i++){
        await lottery()
        //}
        }
        }else{
        console.log('👀'+result.msg+'\n')
        //message += '👀'+"我也不知道\n"
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
//mySupport
async function mySupport(){
let url = rlurl.replace(/&video_id=\d{5}/,``)
 return new Promise((resolve) => {
    let mySupport_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Rcharts/speRank?&id=64&list_rows=12&member_id=${myid}&page=1&${url}`,
    	headers: JSON.parse(rlheader),
    	}
   $.post(mySupport_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs) $.log(data)
        if(result.code == 0){
        let videoid_list = data.match(/"id":\d{5}/g)
        let idex = Math.random()
        let no = Math.round( idex > 0.2 ? ((idex+0.1)*10) : ((idex+0.2)*10))
        let newvideoid_list = videoid_list[no]
        supportvideoid = newvideoid_list.replace(/"id":/,'')
	    //console.log('🎈榜单'+result.msg+'\n')
        //message += '🎈榜单'+result.msg+'\n'
        }else{
        console.log('👀'+result.msg+'\n')
        //message += '👀'+"我也不知道\n"
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
//goVote
async function goVote(){
let url = rlurl.replace(/\d{5}$/,`${supportvideoid}`)
 return new Promise((resolve) => {
    let goVote_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Rcharts/goVote?&charts_id=62&is_act=1&member_id=${myid}&num=1&${url}`,
    	headers: JSON.parse(rlheader),
    	}
   $.post(goVote_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0){
        //await sleep(Math.random()*30000)
	    console.log('🎈'+result.msg+'\n')
        message += '🎈'+result.msg+'\n'
        }else{
        console.log('👀'+result.msg+'\n')
        //message += '👀'+"我也不知道\n"
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
//vote_rewards
async function vote_rewards(){
let url = rlurl.replace(/\d{5}$/,`${supportvideoid}`)
 return new Promise((resolve) => {
    let vote_rewards_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Common/pvlog?${url}`,
    	headers: JSON.parse(rlheader),
    	}
   $.post(vote_rewards_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs) $.log(data)
        await sleep(Math.random()*30000)
        if(result.code == 0){
	   //console.log('🎈投票奖励'+result.msg+'\n')
        //message += '🎈投票奖励'+result.msg+'\n'
        }else{
        console.log('👀'+result.msg+'\n')
        //message += '👀'+"我也不知道\n"
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
//lottery
async function lottery(){
let user_token = rlurl.match(/user_token=\w+.\w+.\w+/)+''
let access_token = rlurl.match(/access_token=\w+/)+''
let new_user_token = user_token.replace(/user_token=/,'')
let new_access_token = access_token.replace(/access_token=/,'')
 return new Promise((resolve) => {
    let lottery_url = {
   	url: `https://ranlv.lvfacn.com/api.php/Rcharts/getLottery`,
    	headers: {
     "Accept": "*/*",
     "Accept-Encoding": "gzip, deflate, br",
     "Accept-Language": "zh-cn",
     "Connection": "keep-alive",
     "Content-Length": "480",
     "Content-Type": "application/json",
     "Host": "ranlv.lvfacn.com",
     "Origin": "https://ran.lvfacn.com",
     "Referer": "https://ran.lvfacn.com/pages/rank/prizeapp?${user_token}&${access_token}",
     "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
     },
     body: `{"access_token":"${new_access_token}","user_token":"${new_user_token}"}`
    	}
   $.post(lottery_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs) $.log(data)
        await sleep(Math.random()*30000)
        if(result.code == 0){
	   console.log('🎈'+result.msg+' '+result.data.name+'\n')
        message += '🎈'+result.msg+' '+result.data.name+'\n'
        }else{
        console.log('👀'+result.msg+'\n')
        //message += '👀'+"我也不知道\n"
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
//getRank
async function getRank(){
let url = rlurl.replace(/&video_id=\d{5}/,``)
 return new Promise((resolve) => {
    let mySupport_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Rcharts/getRank?&basis=1&id=60&list_rows=12&ran=1&member_id=${myid}&page=1&${url}`,
    	headers: JSON.parse(rlheader),
    	}
   $.post(mySupport_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs) $.log(data)
        if(result.code == 0){
        $.log('榜单投票已完成，开始脱口秀投票')
        let videoid_list = data.match(/"id":\d{5}/g)
        let idex = Math.random()
        let no = Math.round( idex > 0.2 ? ((idex+0.1)*10) : ((idex+0.2)*10))
        let newvideoid_list = videoid_list[no]
        supportvideoid = newvideoid_list.replace(/"id":/,'')
	    //console.log('🎈榜单'+result.msg+'\n')
        //message += '🎈榜单'+result.msg+'\n'
        }else{
        console.log('👀'+result.msg+'\n')
        //message += '👀'+"我也不知道\n"
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
//withdraw
async function withdraw(){
let url = rlurl.replace(/&video_id=\d{5}/,``)
 return new Promise((resolve) => {
    let withdraw_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Share/withdraw?&amount=${cash}&is_act=1&member_id=${myid}&${url}`,
    	headers: JSON.parse(rlheader),
    	}
   $.post(withdraw_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs) $.log(data)
        if(result.code == 0){
        console.log(`成功提现${cash}元\n`)
        message += `成功提现${cash}元\n`
        }else{
        console.log('👀'+result.msg+'\n')
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
//wallet
async function wallet(){
let url = rlurl.replace(/&video_id=\d{5}/,``)
 return new Promise((resolve) => {
    let wallet_url = {
   		url: `https://ranlv.lvfacn.com/api.php/Share/wallet?&&list_rows=1&page=1&type=2&member_id=${myid}&${url}`,
    	headers: JSON.parse(rlheader),
    	}
   $.post(wallet_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs) $.log(data)
        if(result.code == 0){
        let hour,minute,second,year,month,day;
year = (new Date()).getFullYear();
month = (new Date()).getMonth() + 1;
day = (new Date()).getDate();
if (month >= 1 && month <= 9) {
            month = "0" + month;
    }
if (day >= 0 && day <= 9) {
            day = "0" + day;
   }
hour = (new Date()).getHours();
minute = (new Date()).getMinutes();
second = (new Date()).getSeconds();
let now = Number(year+month+day+hour+minute+second)
let cashArr = result.data.data.data.find(item => item.description === '提现')
let create_time = Number(cashArr.serialnum.match(/\d{14}/))
if(now - create_time >= 1000000){
$.log(`设置的提现金额为${cash},开始提现\n`)
await withdraw()
}
        }else{
        console.log('👀'+result.msg+'\n')
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
//sleep
function sleep(time){
	 return new Promise((resolve) => setTimeout(resolve,time));
}
//reduce
Array.prototype.distinct = function (){
 var arr = this,
  result = [],
  len = arr.length;
 arr.forEach(function(v, i ,arr){  //这里利用map，filter方法也可以实现
  var bool = arr.indexOf(v,i+1);  //从传入参数的下一个索引值开始寻找是否存在重复
  if(bool === -1){
   result.push(v);
  }
 })
 return result;
};
//showmsg
async function showmsg(){
if(tz==1){
    $.log(message+note)
    if ($.isNode()){
    if ((hour == 12 && minute <= 20) || (hour == 23 && minute >= 40)) {
       await notify.sendNotify($.name,message+note)
     }
   }else{
     $.log(message+note)
    //if ((hour == 12 && minute <= 20) || (hour == 23 && minute >= 40)) {
       $.msg(zhiyi,'',message+note)
//}
}
   }else{
       $.log(message+note)
    }
 }
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
