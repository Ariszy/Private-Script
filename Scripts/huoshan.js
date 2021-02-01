/*
tgchannel：https://t.me/ZhiYi_Script
github：https://github.com/ZhiYi-N/script
boxjs：https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/ZhiYi-N.boxjs.json
转载留个名字，谢谢
邀请码：AU6GW
谢谢
作者：执意ZhiYi-N
目前只有看视频，残缺版本，能力有限处处碰壁
#看一个视频弹出金币获取ck
[mitm]
hostname = api3-normal-c-\w+.huoshan.com
#圈x
[rewrite local]
https://api3-normal-c-\w+.huoshan.com/hotsoon/flame/task_done/? url script-request-body https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/huoshan.js
#loon
http-request https://api3-normal-c-\w+.huoshan.com/hotsoon/flame/task_done/? script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/huoshan.js, requires-body=true, timeout=10, tag=抖音火山版
#surge
抖音火山版 = type=http-request,pattern=^https://api3-normal-c-\w+.huoshan.com/hotsoon/flame/task_done/?,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/huoshan.js,script-update-interval=0
*/
const zhiyi = '抖音火山版'
const $ = Env(zhiyi)
const notify = $.isNode() ?require('./sendNotify') : '';
let status;
status = (status = ($.getval("hsstatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
const hsheaderArr = [],hsbodyArr = [],hsurlArr = [],playurlArr = [],playheaderArr = [],playbodyArr = []
let playurl = $.getdata('playurl')
let playheader = $.getdata('playheader')
let playbody = $.getdata('playbody')
let hsurl = $.getdata('hsurl')
let hsheader = $.getdata('hsheader')
let hsbody = $.getdata('hsbody')
let tz = ($.getval('tz') || '1');//0关闭通知，1默认开启
const invite=1;//新用户自动邀请，0关闭，1默认开启
const logs =0;//0为关闭日志，1为开启
var hour=''
var minute=''
let item_id,item_id_inv,adtonen,signtoken;
let sum = 0;
let no = 0;
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
   if (process.env.HSURL && process.env.HSURL.indexOf('#') > -1) {
   hsurl = process.env.HSURL.split('#');
   console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.HSURL && process.env.HSURL.indexOf('\n') > -1) {
   hsurl = process.env.HSURL.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   hsurl = process.env.HSURL.split()
  };
  if (process.env.HSHEADER && process.env.HSHEADER.indexOf('#') > -1) {
   hsheader = process.env.HSHEADER.split('#');
   console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.HSHEADER && process.env.HSHEADER.indexOf('\n') > -1) {
   hsheader = process.env.HSHEADER.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   hsheader = process.env.HSHEADER.split()
  };
  if (process.env.HSBODY && process.env.HSBODY.indexOf('#') > -1) {
   hsbody = process.env.HSBODY.split('#');
   console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.HSBODY && process.env.HSBODY.indexOf('\n') > -1) {
   hsbody = process.env.HSBODY.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   hsbody = process.env.HSBODY.split()
  };
if (process.env.PLAYURL && process.env.PLAYURL.indexOf('#') > -1) {
   hsurl = process.env.PLAYURL.split('#');
   console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.PLAYURL && process.env.PLAYURL.indexOf('\n') > -1) {
   hsurl = process.env.PLAYURL.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   hsurl = process.env.PLAYURL.split()
  };
  if (process.env.PLAYHEADER && process.env.PLAYHEADER.indexOf('#') > -1) {
   hsheader = process.env.PLAYHEADER.split('#');
   console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.PLAYHEADER && process.env.PLAYHEADER.indexOf('\n') > -1) {
   hsheader = process.env.PLAYHEADER.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   hsheader = process.env.PLAYHEADER.split()
  };
  if (process.env.PLAYBODY && process.env.PLAYBODY.indexOf('#') > -1) {
   hsbody = process.env.PLAYBODY.split('#');
   console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.PLAYBODY && process.env.PLAYBODY.indexOf('\n') > -1) {
   hsbody = process.env.PLAYBODY.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   hsbody = process.env.PLAYBODY.split()
  };
    console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
    console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
 } else {
    hsurlArr.push($.getdata('hsurl'))
    hsheaderArr.push($.getdata('hsheader'))
    hsbodyArr.push($.getdata('hsbody'))
    playurlArr.push($.getdata('playurl'))
    playheaderArr.push($.getdata('playheader'))
    playbodyArr.push($.getdata('playbody'))
    let hscount = ($.getval('hscount') || '1');
  for (let i = 2; i <= hscount; i++) {
	hsurlArr.push($.getdata(`hsurl${i}`))
    hsheaderArr.push($.getdata(`hsheader${i}`))
    hsbodyArr.push($.getdata(`hsbody${i}`))
    playurlArr.push($.getdata(`playurl${i}`))
    playhsbodyArr.push($.getdata(`playbody${i}`))
    playbodyArr.push($.getdata(`playbody${i}`))
  }
}
!(async () => {
if (!hsheaderArr[0] && !hsbodyArr[0] && !hsurlArr[0]) {
    $.msg($.name, '【提示】请先获取抖音火山版一cookie')
    return;
  }
   console.log(`------------- 共${hsheaderArr.length}个账号----------------\n`)
  for (let i = 0; i < hsheaderArr.length; i++) {
    if (hsheaderArr[i]) {
      message = ''
      note = ''
      hsurl = hsurlArr[i];
      hsheader = hsheaderArr[i];
      hsbody = hsbodyArr[i];
      playurl = playurlArr[i];
      playheader = playheaderArr[i];
      playbody = playbodyArr[i];
      $.index = i + 1;
      console.log(`\n开始【抖音火山版${$.index}】`)
      //await ck()
      await gettoken()
      await sign_in()
      await ad()
      await hotsoonfeed()
      //await play_video()
      await control()
      await showmsg()
  }
 }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
    
    
function GetCookie() {
if($request&&$request.url.indexOf("task_done")>=0) {
   const hsurl = $request.url.split('?')[1]
   if(hsurl)     $.setdata(hsurl,`hsurl${status}`)
   $.log(`[${zhiyi}] 获取hsurl请求: 成功,hsurl: ${hsurl}`)
   $.msg(`hsurl${status}: 成功🎉`, ``)
   const hsheader = $request.headers
    if(hsheader)    $.setdata(hsheader,`hsheader${status}`)
    $.log(`[${zhiyi}] 获取hsheader请求: 成功,hsheader: ${hsheader}`)
    $.msg(`hsheader${status}: 成功🎉`, ``)
   const hsbody = $request.body
    if(hsbody)    $.setdata(hsbody,`hsbody${status}`)
    $.log(`[${zhiyi}] 获取hsbody请求: 成功,hsbody: ${hsbody}`)
    $.msg(`hsbody${status}: 成功🎉`, ``)
}


if($request&&$request.url.indexOf("reaction/_play")>=0) {
   const playurl = $request.url
   if(playurl)     $.setdata(playurl,`playurl${status}`)
   $.log(`[${zhiyi}] 获取playurl请求: 成功,playurl: ${playurl}`)
   $.msg(`playurl${status}: 成功🎉`, ``)
   const playheader = $request.headers
    if(playheader)    $.setdata(playheader,`playheader${status}`)
    $.log(`[${zhiyi}] 获取playheader请求: 成功,playheader: ${playheader}`)
    $.msg(`playheader${status}: 成功🎉`, ``)
   const playbody = $request.body
    if(playbody)    $.setdata(playbody,`playbody${status}`)
    $.log(`[${zhiyi}] 获取playbody请求: 成功,playbody: ${playbody}`)
    $.msg(`playbody${status}: 成功🎉`, ``)
}
}
//control
async function control(){
   /*for(i = 1;i<3;i++){
    let delay = Math.random()*10000
    $.log('⏰本次延时'+Math.round(delay/1000)+'秒')
    await sleep(delay)
    await video_rewards()
}*/
for(let i = 0;i <= 4;i++){
   item_id_inv = item_id[i]
   $.log(item_id_inv)
   let delay = Math.random()>0.5? Math.random()*60000 : (Math.random()+0.5)*60000
   console.log('⏰本次延迟'+Math.round(delay/1000)+'秒')
   await sleep(200)
   await play_video()
   //await video_rewards()
}
}
//gettoken
async function gettoken(){
 return new Promise((resolve) => {
    let gettoken_url = {
   		url: `https://api3-normal-c-lq.huoshan.com/hotsoon/janus/flame/management/panel/?${hsurl}`,
        headers: JSON.parse(hsheader)
    	}
   $.get(gettoken_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        message += '🔔获取token '
        if(result.status_code == 0){
        var ad = result.data.task_info.data.task_list.find(item => item.task_name === 'ad');
        adtoken = ad.ad_task.token
        console.log('🎈'+'获取成功，广告token='+adtoken)
        var sign = result.data.task_info.data.task_list.find(item => item.task_name === 'check_in')
        signtoken = sign.check_in_task.token
        console.log('🎈'+'获取成功，签到token='+signtoken)
        message += '🎈获取token成功\n'
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
//sign_in
async function sign_in(){
 return new Promise((resolve) => {
    let sign_inurl = {
   		url: `https://api3-normal-c-lq.huoshan.com/hotsoon/flame/task_system/task_done/?${hsurl}`,
        headers: JSON.parse(hsheader),
        body: `__hideErrorToast=1&task_name=check_in&token=${signtoken}`
    	}
   $.post(sign_inurl,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        message += '🔔每日签到 '
        if(result.status_code == 0){
        console.log('🎈'+'签到成功，获得'+result.data.task_done_award.flame_amount+'\n')
        message += '🎈'+'签到成功，获得'+result.data.task_done_award.flame_amount+'\n'
        }else{
        console.log('👀'+result.data.prompts+"\n")
        message += '👀'+result.data.prompts+"\n"
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }  
//ad
async function ad(){
 return new Promise((resolve) => {
    let ad_url = {
   		url: `https://api3-normal-c-lq.huoshan.com/hotsoon/flame/task_system/task_done/?${hsurl}`,
    	headers: JSON.parse(hsheader),
     body: `__hideErrorToast=1&task_name=ad&token=${adtoken}`
    	}
   $.post(ad_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        message += '🔔广告赢火苗 '
        if(result.status_code == 0){
        console.log('🎈成功，获得'+result.data.task_done_award.flame_amount+'\n')
        message += '🎈成功，获得'+result.data.task_done_award.flame_amount+'\n'
        }else{
        console.log('👀失败'+result.data.prompts+'\n')
        message += '👀失败'+result.data.prompts+'\n'
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
async function ck(){
  $.log('hsurl:'+hsurl)
  $.log('hsbody:'+hsbody)
  $.log('hsheaser:'+hsheader)
  $.log('hsheaser:'+hsheader.replace("{",`"{x-common-params-v2": "${hsurl}"`))
}
//hotsoonfeed
async function hotsoonfeed(){
 return new Promise((resolve) => {
    let hotsoonfeed_url = {
   		url: 'https://api3-normal-c-lf.huoshan.com/hotsoon/feed/?type=video&action=refresh',
    	headers: playheader,
    	}
   $.post(hotsoonfeed_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.status_code == 0){
        console.log('🎈视频列表获取成功！即将开始播放前5个'+'\n')
        //message += '🎈视频列表获取成功！即将开始播放前2个'+'\n'
        let item = data.match(/\d{19}/g)
        item_id = item.distinct();
}
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
//play_video
async function play_video(){
let newplaybody = playbody.replace(/\d{19}/,`${item_id_inv}`)
 return new Promise((resolve) => {
    let play_video_url = {
     url: playurl,
    	headers: playheader, 	
     body: newplaybody
}
   $.post(play_video_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        //await sleep(30000);
        if(result.status_code == 0){
        console.log('🎈视频播放成功！play_count=：'+result.data.play_count)
        no = no + 1;
        await video_rewards()
        //message = `🎈视频播放成功${no}次，获取奖励${no}次\n`
        }else{
        console.log('视频播放失败'+result.extra.details+'\n')
}
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 

//video_rewards
async function video_rewards(){
	let new_time = Math.round(new Date().getTime()/1000).toString();
	hsheader = hsheader.replace(/X-Khronos": "\d{10}/,`X-Khronos": "${new_time}`)
 return new Promise((resolve) => {
    let video_rewards_url = {
   		url: `https://api3-normal-c-lq.huoshan.com/hotsoon/flame/task_done/?${hsurl}`,
    	headers: JSON.parse(hsheader),
    	body: hsbody
    	}
   $.post(video_rewards_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.status_code == 0){
	    let token = result.data.next_token.replace("%3D","=")
	    let newhsbody = hsbody.replace(/WJ.*?(?==)./,`${token}`)
         let _hsbody = newhsbody.replace("%3D","=")
         hsbody = _hsbody
         $.setdata(_hsbody,`hsbody${status}`)
         //$.log(hsbody)
         $.log(token)
         $.log(_hsbody)
        let coins = result.data.flame_amount
        console.log(`🎈第${no}次获得火苗成功：`+coins+'\n')
        sum = sum + coins
        note = `🔔视频播放成功${no}次，获取奖励${no}次,共获得火苗成功：${sum}\n`
        }else{
        console.log('👀'+'我也不知道\n')
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
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
