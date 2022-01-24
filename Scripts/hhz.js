/*
tgchannel：https://t.me/Ariszy_Script
github：https://github.com/Ariszy/script
boxjs：https://raw.githubusercontent.com/Ariszy/Private-Script/master/Ariszy.boxjs.json
*/

const $ = new Env('好好住-领E卡')
const notify = $.isNode() ?require('./sendNotify') : '';
let status;
status = (status = ($.getval("hhzstatus") || "3") ) > 1 ? `${status}` : ""; // 账号扩展字符
var hhz_tokenArr = []
var hhz_cookieArr = []
var hhz_bodyArr = []
var hhz_token = ($.isNode() ? process.env.hhz_token : $.getdata('hhz_token')) || '';
var hhz_cookie = ($.isNode() ? process.env.hhz_cookie : $.getdata('hhz_cookie')) || '';
var hhz_body = ($.isNode() ? process.env.hhz_body : $.getdata('hhz_body')) || '';
let tz = ($.getval('tz') || '1');//0关闭通知，1默认开启
var hhz_count = ($.isNode() ? hhz_tokenArr.length : $.getdata("hhz_count")) || "10";

const logs =0;//0为关闭日志，1为开启
var hour = ($.isNode() ? new Date( new Date().getTime() + 8 * 60 * 60 * 1000 ).getHours() : (new Date()).getHours()); 
var minute = ($.isNode() ? new Date( new Date().getTime() + 8 * 60 * 60 * 1000 ).getMinutes() : (new Date()).getMinutes()); 
//CK运行
!(async () => {
  if (typeof $request !== 'undefined') {
   await GetCookie();
} else{
   if($.isNode()){
    hhz_cookieArr = hhz_cookie.split("@")
    hhz_bodyArr = hhz_body.split("@")
   }else{
    hhz_cookieArr.push($.getdata(`hhz_cookie`))
    hhz_bodyArr.push($.getdata(`hhz_body`))
    for(let i = 2; i <= hhz_count; i++){
    hhz_cookieArr.push($.getdata(`hhz_cookie${i}`))
    hhz_bodyArr.push($.getdata(`hhz_body${i}`))
  }
   }
   if(hhz_cookie[0] && hhz_body[0]){
  console.log(`------------- 共${hhz_count}个账号----------------\n`)
  for (let i = 0; i < hhz_count; i++) {
    hhz_cookie = hhz_cookieArr[i];
    hhz_body = hhz_bodyArr[i];
    $.index = i + 1;
    console.log(`\n开始【好好住打卡${$.index}】(1.14-1.23)`)
    $.log("开始登陆账号\n")
    await Login() 
    await $.wait(10000)
    await prize()
   }
  }else{
    $.msg("","","钢丝用户先获取cookie")
    }
 }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
    
    
function GetCookie() {
if($request && $request.url.indexOf("Login/Login") >= -1) {
   const hhz_cookie = $request.headers['Cookie']
   const hhz_body = $request.body
   if(hhz_cookie)           $.setdata(hhz_cookie,`hhz_cookie${status}`)
   $.log(`[${$.jsname}] 获取好好住cookie请求: 成功,cookie: ${hhz_cookie}`)
   $.msg(`hhz_cookie${status}: 成功🎉`, ``)
   if(hhz_body)           $.setdata(hhz_body,`hhz_body${status}`)
   $.log(`[${$.jsname}] 获取好好住body请求: 成功,body: ${hhz_body}`)
   $.msg(`hhz_body${status}: 成功🎉`, ``)
}
}
//Login
async function Login(){
 return new Promise((resolve) => {
    let Login_url = {
   	url: `https://yapi.haohaozhu.cn/Login/Login`,
    	headers: {
       'Accept': '*/*',
       'Accept-Encoding': 'gzip,deflate,br',
       'Accept-Language': 'zh-Hans-CN;q=1',
       'Connection': 'keep-alive',
       'Content-Type': 'application/x-www-form-urlencoded',
       'Host': 'yapi.haohaozhu.cn',
       'Cookie': hhz_cookie,
       'User-Agent': 'HaoHaoZhu/5.15.1 (iPhone; iOS 14.8; Scale/2.00)-h10a796d5457e24578e67d12-dide44e7da8287545491dea2b7ed5aa1915-HaoHaoZhu5.15.1-piPhone12_1-nwWIFI-k3vo9'
       },
    	body: hhz_body
    	}
   $.post(Login_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 1){
        $.log("账号登录成功")
        let hhz_tokens = result.data.hhz_token
        hhz_token = "hhz_token="+hhz_tokens
        await Userinfo()
        }else{
        $.log(result.msg)
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
//prize
async function prize(){
 return new Promise((resolve) => {
    let prize_url = {
   	url: `https://m.haohaozhu.cn/f/y/api/Activity/GetMyLucky`,
    	headers: {
       'Accept': 'application/json, text/plain, */*',
       'Accept-Encoding': 'gzip,deflate,br',
       'Accept-Language': 'zh-cn',
       'Connection': 'keep-alive',
       'Content-Type': 'application/json;charset=utf-8',
       'Host': 'm.haohaozhu.cn',
       'Cookie': hhz_token,
       'User-Agent': 'HaoHaoZhu/5.15.1 (iPhone; iOS 14.8; Scale/2.00)-h10a796d5457e24578e67d12-dide44e7da8287545491dea2b7ed5aa1915-HaoHaoZhu5.15.1-piPhone12_1-nwWIFI-k3vo9'
       },
    	//body: hhz_body
    	}
   $.get(prize_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 1){
        $.log("\n查询获得的礼品")
        for(let i = 0;i < result.data.length; i++){
        $.log("已获得"+result.data[i].lucky_info.name)
        $.log("兑换码"+result.data[i].lucky_info.code)
          }
        }else{
        $.log(result.msg)
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
//Userinfo
async function Userinfo(){
 return new Promise((resolve) => {
    let Userinfo_url = {
   	url: `https://yapi.haohaozhu.cn/member/getCurrUserInfo`,
    	headers: {
       'Accept': '*/*',
       'Accept-Encoding': 'gzip,deflate,br',
       'Accept-Language': 'zh-Hans-CN;q=1',
       'Connection': 'keep-alive',
       'Content-Type': 'application/x-www-form-urlencoded',
       'Host': 'yapi.haohaozhu.cn',
       'Cookie': hhz_token,
       'User-Agent': 'HaoHaoZhu/5.15.1 (iPhone; iOS 14.8; Scale/2.00)-h10520bc4e74c46f6bef7611-proxyhttp-dide44e7da8287545491dea2b7ed5aa1915-HaoHaoZhu5.15.1-vid_dfee44b4f1e992bb2a79e1fed0bf1971-uid13933402-piPhone12_1-nwWIFI-k3vo9'
       },
    	body: ''
    	}
   $.post(Userinfo_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 1){
        var bindPhone = result.data.user_info.bindPhone;
        var bindweixin = result.data.user_info.bindweixin;
        let nick = result.data.user_info.nick;
        if(bindPhone == 1){
	        console.log(`${nick}用户你好\n手机、微信已经绑定，开始打卡.....`);
          await Signin()
        }else if(bindPhone == 0){
          console.log(`${nick}钢丝你好\n手机号没绑定，打卡个毛线.....`)
          return;
        }
      }else if(result.code == 2){
        console.log(result.msg+`错误！！！\n`)
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
//Sign
async function Signin(){
  let is_signin_daysArr;
  return new Promise((resolve) => {
     let Signin_url = {
      url: `https://m.haohaozhu.cn/growth/activity/improve-frequency/signIn`,
       headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip,deflate,br',
        'Accept-Language': 'zh-cn',
        'Connection': 'keep-alive',
        'Host': 'm.haohaozhu.cn',
        'Cookie': hhz_token,
        'User-Agent': 'HaoHaoZhu/5.15.1 (iPhone; iOS 14.8; Scale/2.00)-h10520bc4e74c46f6bef7611-proxyhttp-dide44e7da8287545491dea2b7ed5aa1915-HaoHaoZhu5.15.1-vid_dfee44b4f1e992bb2a79e1fed0bf1971-uid13933402-piPhone12_1-nwWIFI-k3vo9'
        }
       }
    $.get(Signin_url,async(error, response, data) =>{
     try{
      var signininfo = data.match(/signinInfo":([\s\S]*?),"signinList/g);
      //$.log(signininfo)

      var signinList = data.match((/signinList":([\s\S]*?),"fullOriginalUrl/g))+"";
     //$.log(signinList)
       if(data.indexOf('is_bind_phone') > -1){
        $.log("\n打卡成功")
        }else{
          let statuss = data.match(/msg":"([\s\S]*?)"/g)+""
          let statusss = statuss.replace(/msg":"/,"").replace(`"`,"")
          console.log("\n"+statusss)
        }
        let signin_total_days = data.match(/signin_total_day":\d/)+""
         let signin_total_day = signin_total_days.replace(/signin_total_day":/,"")
         
         console.log(`打卡4天获得20E卡\n\n已经打卡日期为：`)
         
         //$.log(signin_total_day)
         let signinLists = signinList.split("},")
         for(let i = 0; i < signinLists.length; i++){
if(signinLists[i].indexOf(`is_signin":1`) > 0){
             let dates = signinLists[i].match(/date":"\d+-\d+-\d+/)+""
             let date = dates.replace(/date":"/,"")
            $.log(date) 
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
//showmsg
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
          $.msg($.jsname, '', message)
        } else {
          $.log(message)
        }
      }
    } else {
      $.log(message)
  }
}
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
