/*
tgchannel：https://t.me/Ariszy8028
github：https://github.com/Ariszy/script
boxjs：https://raw.githubusercontent.com/Ariszy/Private-Script/master/Ariszy.boxjs.json
转载留个名字，谢谢
邀请码：6EYH02
谢谢
作者：执意Ariszy
目前只有走路，看视频
脚本初成，非专业人士制作，欢迎指正
#在首页刷新步数记录获取ck zcyheader和zcybody
[mitm]
hostname = step-money.quanxiangweilai.cn
#圈x
[rewrite local]
https:\/\/step-money\.quanxiangweilai\.cn\/api\/step_count\/sync url script-request-body https://raw.githubusercontent.com/Ariszy/Private-Script/master/Scripts/zcy.js
#loon
http-request https:\/\/step-money\.quanxiangweilai\.cn\/api\/step_count\/sync script-path=https://raw.githubusercontent.com/Ariszy/Private-Script/master/Scripts/zcy.js, requires-body=true, timeout=10, tag=走财运
#surge
走财运 = type=http-request,pattern=https:\/\/step-money\.quanxiangweilai\.cn\/api\/step_count\/sync,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Ariszy/Private-Script/master/Scripts/zcy.js,script-update-interval=0
*/
const $ = new Env('走财运')
const notify = $.isNode() ?require('./sendNotify') : '';
$.idx = ($.idx = ($.getval("zcysetting") || "1") - 1) > 0 ? `${$.idx + 1}` : ""; // 账号扩展字符
const zcyheaderArr = [],zcybodyArr = []
let zcyheader = $.getdata('zcyheader')
let zcybody = $.getdata('zcybody')
let tz = ($.getval('tz') || '1');//0关闭通知，1默认开启
const invite=1;//新用户自动邀请，0关闭，1默认开启
const logs =0;//0为关闭日志，1为开启
var hour=''
var minute=''
let now_step,step,locate,now_date;
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
  if (process.env.ZCYHEADER && process.env.ZCYHEADER.indexOf('#') > -1) {
   zcyheader = process.env.ZCYHEADER.split('#');
   console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.ZCYHEADER && process.env.ZCYHEADER.indexOf('\n') > -1) {
   zcyheader = process.env.ZCYHEADER.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   zcyheader = process.env.ZCYHEADER.split()
  };
  if (process.env.ZCYBODY && process.env.ZCYBODY.indexOf('#') > -1) {
   zcybody = process.env.ZCYBODY.split('#');
   console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.ZCYBODY && process.env.ZCYBODY.indexOf('\n') > -1) {
   zcybody = process.env.ZCYBODY.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   zcybody = process.env.ZCYBODY.split()
  };
    console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
    console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
 } else {
    zcyheaderArr.push($.getdata('zcyheader'))
    zcybodyArr.push($.getdata('zcybody'))
    let zcycount = ($.getval('zcycount') || '1');
  for (let i = 2; i <= zcycount; i++) {
    zcyheaderArr.push($.getdata(`zcyheader${i}`))
    zcybodyArr.push($.getdata(`zcybody${i}`))
  }
}
!(async () => {
if (!zcyheaderArr[0]) {
    $.msg($.name, '【提示】请先获取走财运一cookie')
    return;
  }
   console.log(`------------- 共${zcyheaderArr.length}个账号----------------\n`)
  for (let i = 0; i < zcyheaderArr.length; i++) {
    if (zcyheaderArr[i]) {
      message = ''
      zcyheader = zcyheaderArr[i];
      zcybody = zcybodyArr[i];
      $.index = i + 1;
      console.log(`\n开始【走财运${$.index}】`)
      await sign_in()
      await getNowFormatDate()
      await get_step()
      await modify_step()
      await submit_step()
      await step_rewards()
      await modify_locate()
      await video_rewards()
      await showmsg()
  }
 }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
    
    
function GetCookie() {
if($request&&$request.url.indexOf("step_count")>=0) {
   const zcyheader = JSON.stringify($request.headers)
    if(zcyheader)    $.setdata(zcyheader,`zcyheader${$.idx}`)
    $.log(`[${jsname}] 获取stepheader请求: 成功,zcyheader: ${zcyheader}`)
    $.msg(`zcyheader${$.idx}: 成功🎉`, ``)
}
if($request&&$request.url.indexOf("step_count")>=0) {
   const zcybody = $request.body
    if(zcybody)    $.setdata(zcybody,`zcybody${$.idx}`)
    $.log(`[${jsname}] 获取stepbody请求: 成功,zcybody: ${zcybody}`)
    $.msg(`zcybody${$.idx}: 成功🎉`, ``)
}
 }

//sign_in
async function sign_in(){
let account_id = zcybody.match(/\d+/)
 return new Promise((resolve) => {
    let sign_in_url = {
   		url: 'https://step-money.quanxiangweilai.cn/api/sign_in',
    	headers: JSON.parse(zcyheader),
     body: `account_id=${account_id}`
    	}
   $.post(sign_in_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.error_code == 0 && result.message == 'success'){
        console.log('🎈'+result.data.date+result.message+'!!获得：'+result.data.sign_bonus+'元\n')
        message += '🎈'+result.data.date+result.message+'!!获得：'+result.data.sign_bonus+'元\n'
        }else{
        message += '👀'+result.message+"今日已签到完成\n"
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }  
//get_step
async function get_step(){
let account_id = zcybody.match(/\d+/)
 return new Promise((resolve) => {
    let get_stepurl = {
   		url: `https://step-money.quanxiangweilai.cn/api/step_range?account_id=${account_id}&days=1`,
    	headers: JSON.parse(zcyheader),
    	}
   $.get(get_stepurl,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.error_code == 0 && result.message == 'success'){
        let steps = result.data.steps
        let old_step = JSON.stringify(steps).replace(/\{|}/g,'').match(/\d+$/)
        console.log('🎈'+result.message+'!! '+old_step+'\n')
        now_step = old_step
        message += '🎈'+result.message+'!! 当前步数：'+old_step+'\n'
        }else{
        message += '👀'+result.message+"\n"
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
//modify_step
async function modify_step(){
   if(now_step < 1000){
      step = 1000
   }
   else if(now_step < 40000 && now_step >= 1000){
      step = Number(now_step) + 1000
   }
   /*else if(now_step < 40000 && now_step % 1000 == 0){
      step == Number(now_step)
   }*/
   else if(now_step >= 40000){
      //step = Number(now_step)+1000
      //$.log(step)
      $.msg("今天步数已经达到最大奖励程度，结束提交")
      $.done();
   }
}
//submit step
async function submit_step(){
let stepbody = zcybody.replace(/count=\d+.*/,`count=${step}`)
//$.log(step)
 return new Promise((resolve) => {
    let submit_step_url = {
   		url: 'https://step-money.quanxiangweilai.cn/api/step_count/sync',
    	headers: JSON.parse(zcyheader),
    	body: stepbody
    	}
   $.post(submit_step_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        console.log('🎈成功提交步数：'+result.today_step_count+'!! 今天余额：'+result.today_bonus_total+'\n')
        message += '🎈成功提交步数：'+result.today_step_count+'!! 今天余额：'+result.today_bonus_total+'\n'
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
//step_rewards
async function step_rewards(){
let step_rewards_body = zcybody.replace(/device_step_count=\d+.*/,"bonus_type=bonus")
$.log(step_rewards_body)
 return new Promise((resolve) => {
    let video_rewardsurl = {
   		url: 'https://step-money.quanxiangweilai.cn/api/gain_bonus',
    	headers: JSON.parse(zcyheader),
    	body: step_rewards_body
    	}
   $.post(video_rewardsurl,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.error_code == 0){
        console.log('🎈'+result.message+',成功获得：'+result.data.money+'\n')
        message += '🎈'+result.message+',成功获得：'+result.data.money+'\n'
        }else{
        console.log('👀'+result.message+'\n')
        message += '👀'+result.message+"\n"
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
//modify_locate
async function modify_locate(){
   if(now_step <= 15000){
      locate = now_step / 1000
      //await video_rewards()
   }else{
      console.log("视频奖励任务已完成")
      //$.msg("视频奖励任务已完成")
   }
}
//video_rewards
async function video_rewards(){
let video_rewards_body = zcybody.replace(/device_step_count=\d+.*/,`locate=${locate}`)
 return new Promise((resolve) => {
    let video_rewards_url = {
   		url: 'https://step-money.quanxiangweilai.cn/api/gain_award_bonus',
    	headers: JSON.parse(zcyheader),
    	body: video_rewards_body
    	}
   $.post(video_rewards_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.error_code == 0 && result.message == 'success'){
      console.log('🎈'+result.message+'!!获取第：'+result.data.locate+'个视频奖励，本次获得：'+result.data.money+'\n')
        message += '🎈'+result.message+'!!获取第：'+result.data.locate+'个视频奖励，本次获得：'+result.data.money+'\n'
        }else{
        console.log('👀'+result.message+"\n")
        message += '👀'+result.message+"\n"
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
//now_date
function getNowFormatDate() {
if ($.isNode()) {
    var date = new Date( new Date().getTime() + 8 * 60 * 60 * 1000 );
}else{
    var date = new Date;
}
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    now_date = year + seperator1 + month + seperator1 + strDate;
//$.log(now_date)
}

//showmsg
async function showmsg(){
if(tz==1){
    $.log(message)
    if ($.isNode()){
    if ((hour == 12 && minute <= 20) || (hour == 23 && minute >= 40)) {
       await notify.sendNotify($.name,message)
     }
   }else{
     $.log(message)
    if ((hour == 12 && minute <= 20) || (hour == 23 && minute >= 40)) {
       $.msg($.jsname,'',message)
}
}
   }else{
       $.log(message)
    }
 }
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
