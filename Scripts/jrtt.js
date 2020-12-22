/*
邀请码：1980436898
我的--输入邀请码，立得一元，直接提现，谢谢

作者：执意ZhiYi-N
目前包含：
签到
开首页宝箱
读文章30篇（具体效果自测）
开农场宝箱
农场浇水
done 农场离线奖励(农场宝箱开完后，需要进农场再运行脚本才能开，有点问题)
##通过农场浇水激活上线，达到获取理想奖励目的，目前测试每天的离线奖励足够开启农场5个宝箱，不需要做其他任务，具体情况看后期是否需要，再添加除虫，开地，施肥，三餐奖励以及农场签到活动
20点睡觉，获取完全后（3600）或睡觉12小时，自动醒来（防止封号）
自动收取睡觉金币


脚本初成，非专业人士制作，欢迎指正

#右上角签到即可获取签到cookie
#进一次农场即可获取农场cookie
#读文章弹出金币获取读文章cookie

[mitm]
hostname = api3-normal-c-*.snssdk.com

#圈x
[rewrite local]
^https:\/\/api3-normal-c-\w+\.snssdk\.com\/score_task\/v1\/task\/(sign_in|get_read_bonus) url script-request-header https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js
^https:\/\/api3-normal-c-\w+\.snssdk\.com\/ttgame\/game_farm\/home_info url script-request-header https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js
[task]
5,35 8-23 * * * https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js, tag=今日头条极速版, enabled=true

#loon
http-request ^https:\/\/api3-normal-c-\w+\.snssdk\.com\/score_task\/v1\/task\/(sign_in|get_read_bonus) script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js, requires-body=true, timeout=10, tag=今日头条极速版sign
http-request ^https:\/\/api3-normal-c-\w+\.snssdk\.com\/ttgame\/game_farm\/home_info script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js, requires-body=true, timeout=10, tag=今日头条极速版farm
cron "5,35 8-23 * * *" script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js, tag=今日头条极速版

#surge

jrttsign = type=http-request,pattern=^https:\/\/api3-normal-c-\w+\.snssdk\.com\/score_task\/v1\/task\/(sign_in|get_read_bonus),requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js,script-update-interval=0
jrttfarm = type=http-request,pattern=^https:\/\/api3-normal-c-\w+\.snssdk\.com\/ttgame\/game_farm\/home_info,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js,script-update-interval=0
jrtt = type=cron,cronexp="5,35 8-23 * * *",wake-system=1,script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/jrtt.js,script-update-interval=0

*/
const jsname='今日头条极速版'
const $ = Env(jsname)
var tz=''
var farmurl = $.getdata('farmurl')
var farmkey = $.getdata('farmkey')

var signurl = $.getdata('signurl')
var signkey = $.getdata('signkey')

var readurl = $.getdata('readurl')
var readkey = $.getdata('readkey')
//var article = $.getdata('article')
var coins=''
let other = ''
var article =''
var collect = ''
var invited =''
const hour = (new Date()).getHours();
const minute = (new Date()).getMinutes();

//CK运行

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie();
   $.done()
} 

!(async () => {
await invite()
await userinfo()
await profit()
await sign_in()
await openbox()
await reading()
//await enter_farm()
await openfarmbox()
await landwarer()
await double_reward()
await sleepstatus()
await control()
//await sleepstart()
//await sleepstop()
//await collectcoins(coins)
await showmsg()
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.msg($.name, $.subt, $.desc.join('\n')), $.log('', `🔔 ${$.name}, 结束!`, ''), $.done()
  })

function GetCookie() {
 if($request&&$request.url.indexOf("info")>=0) {
  const farmurlVal = $request.url.split(`?`)[1]
    if (farmurlVal) $.setdata(farmurlVal,
'farmurl')
    $.log(`[${jsname}] 获取farm请求: 成功,farmirlVal: ${farmurl}`)
    $.msg(`获取farmurl: 成功🎉`, ``)
   const jrttfarmKey = JSON.stringify($request.headers)
$.log(jrttfarmKey)
  if(jrttfarmKey)        $.setdata(jrttfarmKey,'farmkey')
    $.log(`[${jsname}] 获取farm请求: 成功,jrttfarmKey: ${farmkey}`)
    $.msg(`获取farmkey: 成功🎉`, ``)
}
  if($request&&$request.url.indexOf("sign_in")>=0) {
  const signurlVal = $request.url.split(`?`)[1]
    if (signurlVal) $.setdata(signurlVal,
'signurl')
    $.log(`[${jsname}] 获取sign请求: 成功,signurlVal: ${signurl}`)
    $.msg(`获取signurl: 成功🎉`, ``)
   const jrttsignKey = JSON.stringify($request.headers)
$.log(jrttsignKey)
  if(jrttsignKey)        $.setdata(jrttsignKey,'signkey')
    $.log(`[${jsname}] 获取sign请求: 成功,jrttsignKey: ${signkey}`)
    $.msg(`获取signkey: 成功🎉`, ``)
}

if($request&&$request.url.indexOf("get_read_bonus")>=0) {
  const readurlVal = $request.url.split(`?`)[1]

  //const article = readurlVal.replace(/\d{3}$/,Math.floor(Math.random()*1000));
//article = article.replace(/\d{3}$/, (Math.random()*1e3).toFixed(0).padStart(3,"0"));

  //$.log('11111111'+article)
    if(article) $.setdata(article,
'article')
    if (readurlVal) $.setdata(readurlVal,
'readurl')
    $.log(`[${jsname}] 获取read请求: 成功,readurlVal: ${readurl}`)
    $.msg(`获取readurl: 成功🎉`, ``)
   const jrttreadKey = JSON.stringify($request.headers)
$.log(jrttreadKey)
  if(jrttreadKey)        $.setdata(jrttreadKey,'readkey')
    $.log(`[${jsname}] 获取read请求: 成功,jrttreadKey: ${readkey}`)
    $.msg(`获取readkey: 成功🎉`, ``)
    }
  }
function sign_in() {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let sign_inurl ={
    url: `https://api3-normal-c-lq.snssdk.com/score_task/v1/task/sign_in/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.post(sign_inurl,(error, response, data) =>{
     const result = JSON.parse(data)
       // $.log(data)
      if(result.err_no == 0) {
          other +='📣首页签到\n'
          other +='签到完成\n'
          other +='获得'+result.data.score_amount+'金币\n'
          other +='连续签到'+result.data.sign_times+'天\n'
  
}else{
          other +='📣首页签到\n'
          other +='今日已完成签到\n'
           }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 

async function control(){
   if(collect == 0){
      await sleepstart();
 //$.log('qqqqq'+collect)
   }
   if(collect == 1){
  //$.log('1111111'+collect)
      await sleepstop();
      await collectcoins(coins);
   }
   if(collect == 2){
      $.log('no opreation')
      other +='\n\n生前何必久睡，死后自会长眠'
   }
   if(invited == 4){
      await invitation();
   }
}
function invite() {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let inviteurl ={
    url: `https://api3-normal-c-lq.snssdk.com/score_task/v1/user/new_tabs/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.get(inviteurl,(error, response, data) =>{
     const result = JSON.parse(data)
      // $.log(data)
      if(result.data.section[10].key=='mine_input_code') {
          invited=4;
           }else{
          invited=5;

}

        //$.msg(111)
          resolve()
    })
   })
  } 
function invitation() {
return new Promise((resolve, reject) => {
//$.log(signkey)
  let invitatonurl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/invite/post_invite_code/?_request_from=web&device_platform=ios&ac=4G&${signurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
    body: JSON.stringify({"invitecode" : "1980436898"})
}

   $.post(invitatonurl,(error, response, data) =>{
     const result = JSON.parse(data)
       //$.log(data)
       //$.log('i000000')
        //$.msg(111)
          resolve()
    })
   })
  } 

function userinfo() {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let userinfourl ={
    url: `https://api3-normal-c-hl.snssdk.com/passport/account/info/v2/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.get(userinfourl,(error, response, data) =>{
     const result = JSON.parse(data)
       // $.log(data)
      if(result.message == 'success') {
          other +='🎉'+result.data.name+'\n'
  
}     else if(result.message == 'error'){
          other += '⚠️异常:'+result.data.description+'\n'
           }else{
          other += '⚠️异常'
}
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 

function profit() {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let profiturl ={
    url: `https://api3-normal-c-lq.snssdk.com/score_task/v1/user/info/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.get(profiturl,(error, response, data) =>{
     const result = JSON.parse(data)
        //$.log(data)
      if(result.err_no == 0) {
          other +='🎉金币收益:'+result.data.score.amount+'\n🎉估计兑换现金:'+(result.data.score.amount/30000).toFixed(2)+'\n🎉'+'现金收益:'+result.data.cash.amount+'\n'
      //$.log('11111111'+result.data.cash.amount)
          
}else{
          other += '⚠️异常\n'
           }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 

//文章阅读30篇每天
function reading() {
//$.log(article)
const articles = readurl.replace(/\d{3}$/,Math.floor(Math.random()*1000));
return new Promise((resolve, reject) => {
//$.log(article)
  let readurl ={
    url: `https://api3-normal-c-lq.snssdk.com/score_task/v1/task/get_read_bonus/?${articles}`,
    headers :JSON.parse(readkey),
      timeout: 60000,
}

   $.post(readurl,(error, response, data) =>{
     const result = JSON.parse(data)
        $.log(data)
      if(result.err_no == 0) {
          other +='📣文章阅读\n'
          other +='阅读完成'
          other +='获得'+result.data.score_amount+'金币\n'
          other +='阅读进度'+result.data.icon_data.done_times+'/'+result.data.icon_data.read_limit+'\n'
      }
       if(result.err_no == 4){
          other +='📣文章阅读\n'
          other +='文章阅读已达上限\n'
        }
       if(result.err_no == 1028){
          other +='📣文章阅读\n'
          other +='这篇文章已经读过了\n'
        }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 

function openbox() {
//$.log(farmkey)
return new Promise((resolve, reject) => {
//$.log(farmkey)
  let openboxurl ={
    url: `https://it-lq.snssdk.com/score_task/v1/task/open_treasure_box/?${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.post(openboxurl,(error, response, data) =>{
     const result = JSON.parse(data)
        $.log(data)
      if(result.err_no == 0) {
//$.log('111111111'+result.next_treasure_time)
        other +='📣首页宝箱\n'
        other += '开启成功'
        other += '获得金币'+result.data.score_amount+'个\n'
        }
      else{
         if(result.err_no == 9){
        other +='📣首页宝箱\n'
        other += result.err_tips+'\n'
        }else{
        other +='📣首页宝箱\n'
        other +="不在开宝箱时间\n"
           }
    }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  }  


function openfarmbox() {
//$.log(farmkey)
return new Promise((resolve, reject) => {
//$.log(farmkey)
  let openfarmboxurl ={
    url: `https://api3-normal-c-lq.snssdk.com/ttgame/game_farm/box/open?${farmurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
}

   $.get(openfarmboxurl,(error, response, data) =>{
     const result = JSON.parse(data)
        $.log(data)
      if(result.status_code == 0) {
        //$.log(1111)
        other +='📣农场宝箱\n'
        other += "第"+(5-result.data.box_num)+"开启成功"
        other += "还可以开启"+result.data.box_num+"个\n"
        
        }
      if(result.status_code == 5003){
        other +='📣农场宝箱\n'
        other +="已全部开启\n"
           }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  }  
function landwarer() {
return new Promise((resolve, reject) => {
//$.log(farmkey)
  let landwaterurl ={
    url: `https://api3-normal-c-lq.snssdk.com/ttgame/game_farm/land_water?tentimes=0${farmurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
}

   $.get(landwaterurl,(error, response, data) =>{
     const result = JSON.parse(data)
        //$.log(data)
       other +='📣农场浇水\n'
      if(result.status_code == '0') {
        other += result.message+'\n'
        other += '💧水滴剩余'+result.data.water+'\n'
        }
      else{
        other +=result.message+'\n'
           }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 
//done 这个离线奖励当宝箱全部开完后，需要进入农场再运行脚本，才能获取离线奖励，应该有一个判定，目前没有找到
//利用浇水激活进农场状态获取离线奖励，目前测试每天离线奖励足够开启农场5个宝箱，不需要做游戏加快生产，具体情况看后期是否需要，再考虑加做除虫，开地，三餐奖励
function double_reward() {
//$.log(farmkey)
return new Promise((resolve, reject) => {
//$.log(farmkey)
  let double_rewardurl ={
    url: `https://api3-normal-c-lq.snssdk.com/ttgame/game_farm/double_reward?watch_ad=1&${farmurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
}

   $.get(double_rewardurl,(error, response, data) =>{
     const result = JSON.parse(data)
        $.log(data)
      if(result.status_code == 0) {
        other +='📣农场视频双倍离线奖励\n'
        other += '获得成功\n'
        }else{
          if(result.status_code==5033){
            other += result.message+'\n'
          }else{
        //$.log('8888888'+result.service_time)
        other +='📣农场视频双倍离线奖励\n'
        other +="无离线产量可领取\n"
           }
  }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  }  
function sleepstatus() {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let sleepstatusurl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/sleep/status/?_request_from=web&${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.get(sleepstatusurl,(error, response, data) =>{
     const result = JSON.parse(data)
       // $.log(data)
      if(result.err_no == 0) {
          other +='📣查询睡觉状态\n🎉查询'+result.err_tips+'\n'
          }
       if(result.data.sleeping == false){
          other +='当前状态:清醒着呢\n'
//$.log('jjjjjjjjjj'+hour)
         if(hour >= 20){
          collect=0 //await sleepstart()
           }else{
            collect=2 //no opreation
             }
            }else{
          other +='当前状态:酣睡中,已睡'+parseInt(result.data.sleep_last_time/3600)+'小时'+parseInt((result.data.sleep_last_time%3600)/60)+'分钟'+parseInt((result.data.sleep_last_time%3600)%60)+'秒\n'
          other +='预计可得金币'+result.data.sleep_unexchanged_score+'\n'
          coins=result.data.sleep_unexchanged_score
         if(result.data.sleep_unexchanged_score == 3600 || parseInt(result.data.sleep_last_time/3600) == 12){ 
//即使没有满足3600也在睡觉12小时后停止，以防封号
         collect =1 //collect coins&sleepstop
          }else{
         collect =2
}
     }
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 
function sleepstart() {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let sleepstarturl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/sleep/start/?_request_from=web&${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.post(sleepstarturl,(error, response, data) =>{
     const result = JSON.parse(data)
       // $.log(data)
      if(result.err_no == 0) {
          other +='📣开始睡觉\n该睡觉了，开始睡觉'+result.err_tips+'\n'
  
}     else if(result.err_no == 1052){
          other +='📣开始睡觉\n'+result.err_tips+'\n'
           }else{
          other += '📣开始睡觉:'+'⚠️异常'
}
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 
function sleepstop() {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let sleepstopurl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/sleep/stop/?_request_from=web&${signurl}`,
    headers :JSON.parse(signkey),
      timeout: 60000,
}

   $.post(sleepstopurl,(error, response, data) =>{
     const result = JSON.parse(data)
       // $.log(data)
      if(result.err_no == 0) {
          other +='📣停止睡觉\n'+result.err_tips+'\n'
          
}     else if(result.err_no == 1052){
          other += '📣停止睡觉\n'+'还没开始睡觉\n'
           }else{
          other +='📣停止睡觉:'+'\n⚠️异常'
}
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 
function collectcoins(coins) {
//$.log(signkey)
return new Promise((resolve, reject) => {
//$.log(signkey)
  let collectcoinsurl ={
    url: `https://api3-normal-c-lq.snssdk.com/luckycat/lite/v1/sleep/done_task/?_request_from=web&device_platform=undefined&${signurl}`,
    headers :JSON.parse(farmkey),
      timeout: 60000,
    body :JSON.stringify({score_amount: coins}),

}

   $.post(collectcoinsurl,(error, response, data) =>{
     const result = JSON.parse(data)
       $.log(data)
      if(result.err_no == 0) {
          other +='📣收取金币\n'+result.err_tips+'     获得金币:'+coins
          
}     else{
          other +='📣收取金币:'+'\n⚠️异常:'+result.err_tips+''
}
        //$.log(1111)
        //$.msg(111)
          resolve()
    })
   })
  } 

async function showmsg(){
      $.msg(jsname, "", other)
}
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
