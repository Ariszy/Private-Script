
/*
我是搬运工

[rewrite_local]
#京东热8盲盒
https://blindbox\.jd\.com/$ url script-response-body https://raw.githubusercontent.com/ZhiYi-N/Loon/master/jd_r8.js

hostname = blindbox.jd.com
Safari浏览器打开京东热8超级盲盒活动地址自动脚本注入，点击脚本左下的执行按键就行了，很方便。
活动地址：https://blindbox.jd.com/

*/
let html = $response.body

html = html.replace(/(<\/html>)/g, "") +
`
  <script>

    const script = document.createElement('script');
    script.src = "https://cdn.bootcss.com/vConsole/3.2.0/vconsole.min.js";
    // script.doneState = { loaded: true, complete: true};
    script.onload = function() {
        init();
    };
    
    
    document.getElementsByTagName('head')[0].appendChild(script);
    
    
    window.alert = () => {};
    document.querySelector(".receive-btn").click();
    document.querySelector(".my-value span").click();
    document.querySelector(".task:last-child .task-btn").click();
    
    function init () {
      window.vConsole = new VConsole({ defaultPlugins: ["system", "element"] });
      const myPlugin = new VConsole.VConsolePlugin("jd_r8", "京东热8");
      vConsole.addPlugin(myPlugin);

      myPlugin.on("renderTab", function (callback) {
        var html = \`
                    <ul>
                      <li> 📎已自动获取活动信息，解决运行脚本没反应的问题</li>
                      <li> 📎脚本已自动领取热力值</li>
                      <li> 👇点击下方执行按钮运行任务脚本</li>
                    </ul>  
                    \`;
                    
        callback(html);
      });
      
      myPlugin.on("addTool", function (callback) {
       
        var toolList = [];
        toolList.push({
          name: "执行",
          global: false,
          onClick: function (event) {
            vConsole.showTab("default");
            
            eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}(' e 9=4.3(\\'9\\');9.d="b/6";9.a="5://c.2/8/7.8";4.1.0(9);',62,15,'appendChild|body|com|createElement|document|https|javascript|jdmh|js|script|src|text|tyh52|type|var'.split('|'),0,{}))

          },
        });
        callback(toolList);
      });
      
      myPlugin.on('ready', function() {
      
          vConsole.show();
	      setTimeout(() => vConsole.showTab("jd_r8"), 300);

      });
    }
  </script>
</html>
`

$done({body: html})
