/*

https://bp-api.coohua.com/bubuduo-kxhy/game/plant url script-request-header kxhy.js
https://bp-api.coohua.com/bubuduo-kxhy/ad/lookVideo url script-request-body kxhy.js
hostname = bp-api.coohua.com

*/
const zhiyi = '开心花园'
const $ = Env(zhiyi)
const notify = $.isNode() ?require('./sendNotify') : '';
let no,No,no0,no1,no2,no3,no4,no5,no6,no7,no8;
var roomcount,id;
let status;
status = (status = ($.getval("kxhystatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
var kxhyheaderArr = []
var adheaderArr = []
var adbodyArr = []
let kxhyheader = $.getdata('kxhyheader')
let adheader = $.getdata('adheader')
let adbody = $.getdata('adbody')
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

kxhyheaderArr.push($.getdata('kxhyheader'))
adheaderArr.push($.getdata('adheader'))
adbodyArr.push($.getdata('adbody'))
    let kxhycount = ($.getval('kxhycount') || '1');
  for (let i = 2; i <= kxhycount; i++) {
    kxhyheaderArr.push($.getdata(`kxhyheader${i}`))
    adheaderArr.push($.getdata(`adheader${i}`))
    adbodyArr.push($.getdata(`adbody${i}`))
  }
!(async () => {
if (!kxhyheaderArr[0]) {
    $.msg($.name, '【提示】请先获取开心花园一cookie')
    return;
  }
   console.log(`------------- 共${kxhyheaderArr.length}账号----------------\n`)
  for (let i = 0; i < kxhyheaderArr.length; i++) {
    if (kxhyheaderArr[i]) {
      message = ''
      kxhyheader = kxhyheaderArr[i];
      adheader = adheaderArr[i];
      adbody = adbodyArr[i];
      $.index = i + 1;
      console.log(`\n开始【开心花园${$.index}】`)
      await haves()
      await room() 
      await list()
      await plant()
      await cashlist()
      await tasklist()
  }
 }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
    
    
function GetCookie() {
if($request&&$request.url.indexOf("plant")>=0) {
   
   const kxhyheader = JSON.stringify($request.headers)
    if(kxhyheader)    $.setdata(kxhyheader,`kxhyheader${status}`)
    $.log(`[${zhiyi}] 获取kxhyheader请求: 成功,kxhyheader: ${kxhyheader}`)
    $.msg(`kxhyheader${status}: 成功🎉`, ``)
}
if($request.url.indexOf("ad/lookVideo")>-1){
   const adheader = JSON.stringify($request.headers)
    if(adheader)
$.setdata(adheader,`adheader${status}`)
     $.log(`[${zhiyi}] 获取adheader请求: 成功,adheader: ${adheader}`)
    $.msg(`adheader${status}: 成功🎉`, ``)
   const adbody = $request.body
   if(adbody)
$.setdata(adbody,`adbody${status}`)
      $.log(`[${zhiyi}] 获取adbody请求: 成功,adbody: ${adbody}`)
    $.msg(`adbody${status}: 成功🎉`, ``)
}
}

async function room(){
 return new Promise((resolve) => {
    let room_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/game/order/msg`,
        headers: JSON.parse(kxhyheader)
   	}
   $.get(room_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          roomlast = result.result.harvests
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
async function list(){
 return new Promise((resolve) => {
    let list_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/mall/game/cash/list`,
        headers: JSON.parse(kxhyheader)
   	}
   $.post(list_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
  //var roomindexs = JSON.stringify(result.result.cashLimit.harvests).match(/index":\d+/g)
/*for(let i = 0; i < roomindexs.length; i++){
let yy = roomindexs[i].replace(/index":/,"")
$.log("&&&&"+yy)
   let roomcounts = result.result.cashLimit.harvests.find(item => item.index == yy).count
   $.log("@@@@"+roomcounts)
}*/
  

  var indexs = JSON.stringify(result.result.list[0].condition.harvestNeed).match(/index":\d+/g)+""
  let xx = indexs.replace(/index":/g,"")
$.log(xx)

   let count0 = result.result.list[0].condition.harvestNeed.find(item => item.index == xx[0]).count
   $.log("count"+count0)

   let roomcount0 = result.result.cashLimit.harvests.find(item => item.index == xx[0]).count
   $.log("last"+roomcount0)

   let shouldplant0 = count0 - roomcount0
   $.log(shouldplant0)

let count1 = result.result.list[0].condition.harvestNeed.find(item => item.index == xx[2]).count
   $.log("count"+count1)

   let roomcount1 = result.result.cashLimit.harvests.find(item => item.index == xx[2]).count
   $.log("last"+roomcount1)

   let shouldplant1 = count1 - roomcount1
   $.log(shouldplant1)

let count2 = result.result.list[0].condition.harvestNeed.find(item => item.index == xx[4]).count
   $.log("count"+count2)

   let roomcount2 = result.result.cashLimit.harvests.find(item => item.index == xx[4]).count
   $.log("last"+roomcount2)

   let shouldplant2 = count2 - roomcount2
   $.log(shouldplant2)

let count3 = result.result.list[0].condition.harvestNeed.find(item => item.index == xx[6]).count
   $.log("count"+count3)

   let roomcount3 = result.result.cashLimit.harvests.find(item => item.index == xx[6]).count
   $.log("last"+roomcount0)

   let shouldplant3 = count3 - roomcount3
   $.log(shouldplant3)


if(shouldplant0 > 0) no0 = xx[0];
else if(shouldplant0 <= 0 && shouldplant1 > 0) no0 = xx[2]
else if(shouldplant0 <= 0 && shouldplant1 <= 0 && shouldplant2 > 0) no0 = xx[4]
else if(shouldplant0 <= 0 && shouldplant1 <= 0 && shouldplant2 <= 0 && shouldplant3 > 0) no0 = xx[6]
else{
   $.log("任务完成")

}
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 

async function plant(){
      await plant0()
      await plant1()
      await plant2()
      await plant3()
      await plant4()
      await plant5()
      await plant6()
      await plant7()
      await plant8()
}
async function plant0(){
 return new Promise((resolve) => {
    let plant0_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/game/plant`,
        headers: JSON.parse(kxhyheader),
        body: `{"landIndex":0,"seedIndex":${no0},"way":1}`
   	}
   $.post(plant0_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          $.log("种植成功\n")
        if(result.code == 50001)
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
async function plant1(){
 return new Promise((resolve) => {
    let plant1_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/game/plant`,
        headers: JSON.parse(kxhyheader),
        body: `{"landIndex":1,"seedIndex":${no0},"way":1}`
   	}
   $.post(plant1_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          $.log("种植成功\n")
        if(result.code == 50001)
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
async function plant2(){
 return new Promise((resolve) => {
    let plant2_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/game/plant`,
        headers: JSON.parse(kxhyheader),
        body: `{"landIndex":2,"seedIndex":${no0},"way":1}`
   	}
   $.post(plant2_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          $.log("种植成功\n")
        if(result.code == 50001)
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
async function plant3(){
 return new Promise((resolve) => {
    let plant3_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/game/plant`,
        headers: JSON.parse(kxhyheader),
        body: `{"landIndex":3,"seedIndex":${no0},"way":1}`
   	}
   $.post(plant3_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          $.log("种植成功\n")
        if(result.code == 50001)
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
async function plant4(){
 return new Promise((resolve) => {
    let plant4_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/game/plant`,
        headers: JSON.parse(kxhyheader),
        body: `{"landIndex":4,"seedIndex":${no0},"way":1}`
   	}
   $.post(plant4_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          $.log("种植成功\n")
        if(result.code == 50001)
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
async function plant5(){
 return new Promise((resolve) => {
    let plant5_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/game/plant`,
        headers: JSON.parse(kxhyheader),
        body: `{"landIndex":5,"seedIndex":${no0},"way":1}`
   	}
   $.post(plant5_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          $.log("种植成功\n")
        if(result.code == 50001)
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
async function plant6(){
 return new Promise((resolve) => {
    let plant6_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/game/plant`,
        headers: JSON.parse(kxhyheader),
        body: `{"landIndex":6,"seedIndex":${no0},"way":1}`
   	}
   $.post(plant6_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          $.log("种植成功\n")
        if(result.code == 50001)
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
async function plant7(){
 return new Promise((resolve) => {
    let plant7_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/game/plant`,
        headers: JSON.parse(kxhyheader),
        body: `{"landIndex":7,"seedIndex":${no0},"way":1}`
   	}
   $.post(plant7_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          $.log("种植成功\n")
        if(result.code == 50001)
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
async function plant8(){
 return new Promise((resolve) => {
    let plant8_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/game/plant`,
        headers: JSON.parse(kxhyheader),
        body: `{"landIndex":8,"seedIndex":${no0},"way":1}`
   	}
   $.post(plant8_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          $.log("种植成功\n")
        if(result.code == 50001)
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  } 
async function haves(){
for(let i = 0; i < 9; i ++){
no = i;
await havest()
//await $.wait(5000)
}
}
async function havest(){
 return new Promise((resolve) => {
    let havest_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/game/harvest`,
        headers: JSON.parse(kxhyheader),
        body: `{"landIndex":${no}}`
   	}
   $.post(havest_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          $.log("收获成功\n")
        if(result.code == 50003)
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }  
  
async function lookvideo(){
 return new Promise((resolve) => {
    let lookvideo_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/ad/lookVideo`,
        headers: JSON.parse(adheader),
        body: adbody
   	}
   $.post(lookvideo_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          $.log("观看成功\n")
        else
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }  
async function cloud(){
 return new Promise((resolve) => {
    let cloud_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/game/cloud/used`,
        headers: JSON.parse(kxhyheader),
        body: "null"
   	}
   $.post(cloud_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          $.log("加速成功\n")
        else
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function cashlist(){
 return new Promise((resolve) => {
    let cashlist_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/mall/sign/cash/list`,
        headers: JSON.parse(adheader),
       
   	}
   $.get(cashlist_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0){
          $.log("今日打卡进度："+result.result.cashLimit.todayVideoNum+"/"+result.result.signVideo+"\n")
          if(result.result.cashLimit.todayVideoNum < result.result.signVideo){
         await lookvideo()
         await cloud()
}else{
       $.log("今日打卡完成，不再云加速，需要加速请手动\n")
}
        }else
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }

async function tasklist(){
 return new Promise((resolve) => {
    let tasklist_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/task/list`,
        headers: JSON.parse(kxhyheader),
       
   	}
   $.get(tasklist_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0){
          let statues = data.match(/"state":\d/g)
          let statu0 = statues[0].replace(/"state":/,"")
          let statu1 = statues[1].replace(/"state":/,"")
          let statu2 = statues[2].replace(/"state":/,"")
          let statu3 = statues[3].replace(/"state":/,"")
          if(statu0 == 2 && statu1 == 2 && statu2 == 2 && statu3 == 2){
             $.log("每日福利已完成\n")
          }else{
         let taskid = data.match(/taskId":\d+/g)
          //$.log(taskid)
          for(let i = 0; i < taskid.length; i++){
          id = taskid[i].replace(/taskId":/,"")
          await getReward()
          await daily()
}
}
        }else
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function getReward(){
 return new Promise((resolve) => {
    let getReward_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/task/daily/getReward?taskId=${id}`,
        headers: JSON.parse(kxhyheader),
        
   	}
   $.post(getReward_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          $.log(id+"任务完成\n")
        else
          $.log(result.message+"\n")
        }catch(e) {
          $.logErr(e, response);
      } finally {
        resolve();
      } 
    })
   })
  }
async function daily(){
 return new Promise((resolve) => {
    let daily_url = {
   		url: `https://bp-api.coohua.com/bubuduo-kxhy/task/finish/daily?taskId=${id}`,
        headers: JSON.parse(kxhyheader),
        
   	}
   $.post(daily_url,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
        if(logs)$.log(data)
        if(result.code == 0)
          $.log(id+"领取成功\n")
        else
          $.log(result.message+"\n")
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
