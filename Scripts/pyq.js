/*
tgchannel：https://t.me/ZhiYi_Script
github：https://github.com/ZhiYi-N/script
boxjs：https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/ZhiYi-N.boxjs.json
转载留个名字，谢谢
邀请码：AVJ6

谢谢
作者：执意ZhiYi-N
#看一次广告获取ck

[mitm]
hostname = pingyouquan.com
#圈x
[rewrite local]
https://pingyouquan.com/tp5/public/index.php/app/gold/adv url script-request-body https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/pyq.js


#loon
http-request https://pingyouquan.com/tp5/public/index.php/app/gold/adv script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/pyq.js, requires-body=true, timeout=10, tag=评有圈


#surge
评有圈 = type=http-request,pattern=https://pingyouquan.com/tp5/public/index.php/app/gold/adv,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/ZhiYi-N/Private-Script/master/Scripts/pyq.js,script-update-interval=0

*/

const zhiyi = '评有圈'
const $ = Env(zhiyi)
const notify = $.isNode() ?require('./sendNotify') : '';
let status,commentid;
status = (status = ($.getval("pyqstatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
pyqUAArr = [],pyqadArr = []
let pyqUA = $.getdata('pyqUA')
let pyqad = $.getdata('pyqad')
let last_id = ($.getdata('last_id') || 1880000)
let tz = ($.getval('tz') || '1');//0关闭通知，1默认开启
const invite=1;//新用户自动邀请，0关闭，1默认开启
const logs =0;//0为关闭日志，1为开启
var hour=''
var minute=''
var id = ''
var texts = ["整不错","真挺好","美丽啊","漂亮啊","说的对","整不错","真挺好","美丽啊","漂亮啊","说的对"]
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
   if (process.env.PYQUA && process.env.PYQUA.indexOf('#') > -1) {
   pyqUA = process.env.PYQUA.split('#');
   console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.PYQUA && process.env.PYQUA.indexOf('\n') > -1) {
   pyqUA = process.env.PYQUA.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   pyqUA = process.env.PYQUA.split()
  };
  if (process.env.PYQAD && process.env.PYQAD.indexOf('#') > -1) {
   pyqad = process.env.PYQAD.split('#');
   console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.PYQAD && process.env.PYQAD.indexOf('\n') > -1) {
   pyqad = process.env.PYQAD.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   pyqad = process.env.PYQAD.split()
  };
    console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
    console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
 } else {
    pyqUAArr.push($.getdata('pyqUA'))
    pyqadArr.push($.getdata('pyqad'))
    let pyqcount = ($.getval('pyqcount') || '1');
  for (let i = 2; i <= pyqcount; i++) {
    pyqUAArr.push($.getdata(`pyqUA${i}`))
    pyqadArr.push($.getdata(`pyqad${i}`))
  }
}
!(async () => {
if (!pyqUAArr[0] && !pyqadArr[0]) {
    $.msg($.name, '【提示】请先获取评有圈一cookie')
    return;
  }
   console.log(`------------- 共${pyqadArr.length}账号----------------\n`)
  for (let i = 0; i < pyqadArr.length; i++) {
    if (pyqadArr[i]) {
      message = ''
      pyqUA = pyqUAArr[i];
      pyqad = pyqadArr[i];
      $.index = i + 1;
      console.log(`\n开始【评有圈${$.index}】`)
      await control() 
      //await showmsg()
  }
 }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
    
    
function GetCookie() {
if($request&&$request.url.indexOf("adv")>=0) {
   const pyqUA = $request.headers['User-Agent']
    if(pyqUA) $.setdata(pyqUA,`pyqUA${status}`)
    $.log(`[${zhiyi}] 获取pyqUA请求: 成功,pyqUA: ${pyqUA}`)
    $.msg(`pyqUA${status}: 成功🎉`, ``)
}
if($request&&$request.url.indexOf("adv")>=0) {
   const pyqad = $request.body
    if(pyqad)    $.setdata(pyqad,`pyqad${status}`)
    $.log(`[${zhiyi}] 获取pyqad请求: 成功,pyqad: ${pyqad}`)
    $.msg(`pyqad${status}: 成功🎉`, ``)
}
}
async function control(){
id = Number(last_id) + 1;
$.setdata(`${id}`,'last_id')
let index = Math.round(Math.random()*10)
text = texts[index]
await qd()
await $.wait(10000)
await tp_d()
await $.wait(10000)
await tp()
await $.wait(10000)
await comment()
await $.wait(10000)
await comment_list()
await $.wait(10000)
await fx()
await $.wait(10000)
await ad()
}
//qd
async function qd(){
let token = pyqad.match(/\w{64}/)
let uid = pyqad.match(/\d{6}/)
 return new Promise((resolve) => {
    let qd_url = {
   		url: `https://pingyouquan.com/tp5/public/index.php/app/activity/qd`,
        headers: {
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-Hans-CN;q=1",
          "Connection": "keep-alive",
          "Content-Type": "application/json",
          "Host": "pingyouquan.com",
          "User-Agent": `${pyqUA}`
          },
        body: `{"uid":${uid},"token":"${token}"}`,
        method: 'put'
    	}
   $.post(qd_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        console.log("签到"+result.msg+'\n')
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }  
//tp
async function tp(){
let uid = pyqad.match(/\d{6}/)
$.log('点赞图文id为：'+id)
 return new Promise((resolve) => {
    let tp_url = {
   		url: `https://pingyouquan.com/tp5/public/index.php/app/thunp/tp`,
        headers: {
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-Hans-CN;q=1",
          "Connection": "keep-alive",
          "Content-Type": "application/json",
          "Host": "pingyouquan.com",
          "User-Agent": `${pyqUA}`
          },
        body: `{"pid":${id},"uid":${uid},"type":1}`
    	}
   $.post(tp_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        console.log(result.msg+'\n')
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
//tp_d
async function tp_d(){
$.log('取消点赞id为：'+last_id)
let uid = pyqad.match(/\d{6}/)
 return new Promise((resolve) => {
    let tp_d_url = {
   		url: `https://pingyouquan.com/tp5/public/index.php/app/thunp/tp_d`,
        headers: {
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-Hans-CN;q=1",
          "Connection": "keep-alive",
          "Content-Type": "application/json",
          "Host": "pingyouquan.com",
          "User-Agent": `${pyqUA}`
          },
        body: `{"pid":${last_id},"uid":${uid},"type":1}`
    	}
   $.post(tp_d_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        console.log(result.msg+'\n')
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
//comment
async function comment(){
$.log('评论内容为：'+text)
let uid = pyqad.match(/\d{6}/)
 return new Promise((resolve) => {
    let comment_url = {
   	url: 'https://pingyouquan.com/tp5/public/index.php/app/comment/add',
    	headers: {"Accept": "*/*","Accept-Encoding": "gzip, deflate, br","Accept-Language": "zh-Hans-CN;q=1","Connection": "keep-alive","Content-Length": "285","Content-Type": "multipart/form-data; boundary=Boundary+770BDF565E40490B","Host": "pingyouquan.com","User-Agent": "PinYouQuan/1.1.2 (iPhone; iOS 13.3; Scale/2.00)"},
    	body: `--Boundary+770BDF565E40490B
Content-Disposition: form-data; name="cid"

${id}
--Boundary+770BDF565E40490B
Content-Disposition: form-data; name="text"

${text}
--Boundary+770BDF565E40490B
Content-Disposition: form-data; name="uid"

${uid}
--Boundary+770BDF565E40490B--
`
    	}
   $.post(comment_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        console.log(result.msg+'\n')
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
}
//comment list
async function comment_list(){
$.log('删除评论内容为：'+text)
let uid = pyqad.match(/\d{6}/)
 return new Promise((resolve) => {
    let comment_list_url = {
   		url: `https://pingyouquan.com/tp5/public/index.php/app/comment/list1`,
        headers: {
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-Hans-CN;q=1",
          "Connection": "keep-alive",
          "Content-Type": "application/json",
          "Host": "pingyouquan.com",
          "User-Agent": `${pyqUA}`
          },
        body: `{"uid":${uid},"cid":${id}}`
    	}
   $.post(comment_list_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        let commentArr = result.list.find(item => item.uid == uid)
        commentid = commentArr.id
        if(commentid){
        console.log('评论'+result.msg+',开始删除评论')
        await commentdel()
        }
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
//del comment
async function commentdel(){
let uid = pyqad.match(/\d{6}/)
 return new Promise((resolve) => {
    let commentdel_url = {
   		url: `https://pingyouquan.com/tp5/public/index.php/app/comment/commentdel`,
        headers: {
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-Hans-CN;q=1",
          "Connection": "keep-alive",
          "Content-Type": "application/json",
          "Host": "pingyouquan.com",
          "User-Agent": `${pyqUA}`
          },
        body: `{"uid":${uid},"cid":${commentid}}`
    	}
   $.post(commentdel_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        console.log('评论'+result.msg+'\n')
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
//fx
async function fx(){
let uid = pyqad.match(/\d{6}/)
 return new Promise((resolve) => {
    let fx_url = {
   		url: `https://pingyouquan.com/tp5/public/index.php/app/fx`,
        headers: {
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-Hans-CN;q=1",
          "Connection": "keep-alive",
          "Content-Type": "application/json",
          "Host": "pingyouquan.com",
          "User-Agent": `${pyqUA}`
          },
        body: `{"cid":${id},"uid":${uid}}`
    	}
   $.post(fx_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        console.log('分享'+result.msg+'\n')
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
   		url: `https://pingyouquan.com/tp5/public/index.php/app/gold/adv`,
        headers: {
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-Hans-CN;q=1",
          "Connection": "keep-alive",
          "Content-Type": "application/json",
          "Host": "pingyouquan.com",
          "User-Agent": `${pyqUA}`
          },
        body: `${pyqad}`
    	}
   $.post(ad_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        console.log('广告'+result.msg+'\n')
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
//showmsg
async function showmsg(){
   if ($.isNode()){
       await notify.sendNotify($.name,message)
   }else{
       $.msg(zhiyi,'',message)
   }
 }
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
