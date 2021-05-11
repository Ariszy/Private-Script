/*
tgchannel：https://t.me/Ariszy_Script
github：https://github.com/Ariszy/script
boxjs：https://raw.githubusercontent.com/Ariszy/Private-Script/master/Ariszy.boxjs.json

转载留个名字，谢谢

作者：执意Ariszy

#####笑谱app最新版V1.5.6
天天领现金-每日签到领现金-点击随便一个任务，获取ck

5.11 17:00开始制作
5.11 22:00完成

具体多大毛不知道，初步估计运行一次ok，0.5元左右，调整每次阅读延时25秒，为阅读20s➕跳转5s，手动阅读20s完成任务，故设置为20s，运行一次时间很长，请注意

[mitm]
hostname = lrqd.wasair.com

#quanx
[rewrite local]
https://lrqd.wasair.com/advert/task/news/list url script-request-header https://raw.githubusercontent.com/Ariszy/Private-Script/master/Scripts/xpread.js

#loon
http-request https://lrqd.wasair.com/advert/task/news/list script-path=https://raw.githubusercontent.com/Ariszy/Private-Script/master/Scripts/xpread.js, requires-body=true, timeout=10, tag=笑谱阅读


#surge
笑谱阅读 = type=http-request,pattern=https://lrqd.wasair.com/advert/task/news/list,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Ariszy/Private-Script/master/Scripts/xpread.js,script-update-interval=0
*/
const Ariszy = '笑谱阅读'
const $ = Env(Ariszy)
const notify = $.isNode() ?require('./sendNotify') : '';
var newsaid;
let status;
status = (status = ($.getval("xpreadstatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
var delay = ($.getval("delay") || 30)
var xpreadCookieArr = []
var newslist = new Array();
let xpreadCookie = $.getdata('xpreadCookie')
var xpreadtaskId = 15;
var newscid = 11;
let tz = ($.getval('tz') || '1');//0关闭通知，1默认开启
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
    xpreadCookieArr.push($.getdata('xpreadCookie'))
    let xpreadcount = ($.getval('xpreadcount') || '1');
  for (let i = 2; i <= xpreadcount; i++) {
    xpreadCookieArr.push($.getdata(`xpreadCookie${i}`))
  }
!(async () => {
if (!xpreadCookieArr[0]) {
    $.msg($.Ariszy, '【提示】请先获取笑谱阅读一Cookies')
    return;
  }
   console.log(`------------- 共${xpreadCookieArr.length}账号----------------\n`)
  for (let i = 0; i < xpreadCookieArr.length; i++) {
    if (xpreadCookieArr[i]) {
      message = ''
      xpreadCookie = xpreadCookieArr[i];
      $.index = i + 1;
      console.log(`\n开始【笑谱阅读${$.index}】`)
      await newslists()
    }
  }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
    
    
function GetCookie() {
if($request && $request.url.indexOf("news/list") > -1) {
   const xpreadCookie = JSON.stringify($request.headers)
    if(xpreadCookie)    $.setdata(xpreadCookie,`xpreadCookie${status}`)
    $.log(`[${Ariszy}] 获取xpreadCookie请求: 成功,xpreadCookie: ${xpreadCookie}`)
    $.msg(`xpreadCookie${status}: 成功🎉`, ``)
  }
}

function PostRequest(uri, body) {
  const url = `https://lrqd.wasair.com/${uri}`;
  const method = `POST`;
  const headers = JSON.parse(xpreadCookie);
  return {url: url, method: method, headers: headers, body: body};
}

function GetRequest(uri) {
  const url = `https://lrqd.wasair.com/advert/task/news/detail/to?${uri}`;
  const method = `GET`;
  const headers = JSON.parse(xpreadCookie);
  return {url: url, method: method, headers: headers};
}
async function newslists(){
 let nowtime = new Date().getTime()
 const body = `taskID=${xpreadtaskId}&weight=${nowtime}&getDateType=all&cid=${newscid}`;
 const MyRequest = PostRequest('advert/task/news/list', body)
 return new Promise((resolve) => {
   $.post(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data) 
        if(logs) $.log(data)
        if(result.errorCode == 0){
          console.log("开始获取阅读列表\n")
          newslist = newslist.concat(result.data.news)
          for(let i = 0; i < newslist.length; i++){
           if(typeof (newslist[i].aid) != "undefined"){
            newsaid = newslist[i].aid
            //newscid = newslist[i].cid
            let newstitle = newslist[i].title
            $.log("开始阅读:"+newsaid+"\n"+newstitle)
            await $.wait(200*delay)
            await newsdetail()
            await $.wait(800*delay)
            await newscomplete()
          }
          }
          if(xpreadtaskId == 15 && newscid == 11){
            xpreadtaskId = 19;
            newscid = 8;
            console.log("开始阅读科技板块\n")
            await newslists()
          }
          else if(xpreadtaskId == 19 && newscid == 8){
            xpreadtaskId = 20;
            newscid = 1;
            console.log("开始阅读汽车板块\n")
            await newslists()
          }
          else if(xpreadtaskId == 20 && newscid == 1){
            xpreadtaskId = 26;
            newscid = 9;
            console.log("开始阅读房产板块\n")
            await newslists()
          }
          else if(xpreadtaskId == 26 && newscid == 9){
            xpreadtaskId = 22;
            newscid = 3;
            console.log("开始阅读时尚板块\n")
            await newslists()
          }
          else if(xpreadtaskId == 22 && newscid == 3){
            xpreadtaskId = 25;
            newscid = 12;
            console.log("开始阅读笑话板块\n")
            await newslists()
          }
          else if(xpreadtaskId == 25 && newscid == 12){
            xpreadtaskId = 21;
            newscid = 2;
            console.log("开始阅读健康板块\n")
            await newslists()
          }else if(xpreadtaskId == 21 && newscid == 2){
            xpreadtaskId = 23;
            newscid = 11;
            console.log("开始阅读星座板块\n")
            await newslists()
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
async function newsdetail(){
 const MyRequest = GetRequest(`aid=${newsaid}&cid=${newscid}`)
 return new Promise((resolve) => {
   $.get(MyRequest,async(error, response, data) =>{
    try{
        //const result = JSON.parse(data)
        if(logs)$.log(data)
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 

async function newscomplete(){
 const body = `taskId=${xpreadtaskId}&cid=${newscid}&aid=${newsaid}`;
 const MyRequest = PostRequest('advert/task/complete', body)
 return new Promise((resolve) => {
   $.post(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.errorCode == 0){
          console.log("😄成功获得"+result.data.money+"\n") 
        }else if(result.errorCode == 10331){
           $.log("😫"+result.errorMsg+"\n")
           await cash()
           $done();
        }else{
           $.log("😫"+result.errorMsg+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function cash(){
 const body = ``;
 const MyRequest = PostRequest('users/attr/cash', body)
 return new Promise((resolve) => {
   $.post(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.errorCode == 0){
          console.log("😄本次阅读完成，现有余额："+result.data.cash+"\n") 
          $.msg("😄本次阅读完成，现有余额："+result.data.cash+"\n")
        }else{
           $.log("😫"+result.errorMsg+"\n")
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
//showmsg
//boxjs设置tz=1，在12点<=20和23点>=40时间段通知，其余时间打印日志

async function showmsg() {
    if (tz == 1) {
      if ($.isNode()) {
        if ((hour == 12 && minute <= 20) || (hour == 23 && minute >= 40)) {
          await notify.sendNotify($.name, message)
        } else {
          $.log(message)
        }
      } else {
        if ((hour == 12 && minute <= 20) || (hour == 23 && minute >= 40)) {
          $.msg(zhiyi, '', message)
        } else {
          $.log(message)
        }
      }
    } else {
      $.log(message)
  }
}
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
