const textarea = document.getElementById('textarea');
const btn = document.getElementById('send');
const md = document.querySelector('.md');
const inp = document.querySelector('.my-input');
const te = document.querySelector('.time');
let canSend = false;
let oldtime = 0;
let nowtime;
let bool;


(() => {
    
    textarea.addEventListener('keyup', event => {
        let textval = textarea.innerText;
        if (textval.length > 0) {
            btn.style.background = '#114F8E';
            btn.setAttribute('disabled', true);
            canSend = true;
        } else {
            btn.style.background = '#ddd';
            btn.setAttribute('disabled', false);
            canSend = false;
        }
    })
    
    btn.addEventListener('click', () => {
        let textval = textarea.innerText;
        send(textval);
    })

    inp.addEventListener('keydown', e => {
        if(e.keyCode == 13){
            let textval = textarea.innerText;
            return send(textval);
        }
    });
    
})();

const showdate = time => {
    const dt = new Date();
    const dict ={
        month : dt.getMonth() + 1,
        date : dt.getDate(),
        hours : dt.getHours(),
        minutes : dt.getMinutes()
    }
    for (const iterator in dict) {
        if (dict[iterator] < 10) {
            dict[iterator] = `0${String(dict[iterator])}`;
        }
    }
    //time.innerText = `${dict.month}/${dict.date} ${dict.hours}:${dict.minutes}`;
    return `${dict.month}/${dict.date} ${dict.hours}:${dict.minutes}`;
}
//showdate(te);

let notice = '';

var arr = [
	`尝试这样问我：<br>`,
    `520如何向爱人表白<br>`,
    `如何策划一场浪漫的约会<br>`, 
    `围绕“夏日冰淇淋”策划一场有创意的营销活动<br>`, 
    `设计一份关于健康生活的短视频脚本<br>`,
    `如果咖啡豆是豆子的话，那么咖啡属于豆浆吗<br>`,
    `请以“人工智能”为题，写一篇初中生小作文<br>`,
    `“三人成虎”这个成语是什么意思<br>`,
    `好友向我借钱，如何婉拒`
];

const sj = () => {
    return parseInt(Math.random() * 10)
}

const init = () => {
    for (const iterator of arr) {
        notice += iterator;
    }
    setTimeout(() => {
        reply("images/bot.jpg", notice);
    }, sj() * 500)
}
//init();

const toast = (msg, duration) => {
    duration = isNaN(duration) ? 3000 : duration;
    let toastDom = document.createElement('div');
    toastDom.innerHTML = msg;
    toastDom.style.cssText = 'padding:2px 15px;min-height: 36px;line-height: 36px;text-align: center;transform: translate(-50%);border-radius: 4px;color: rgb(255, 255, 255);position: fixed;top: 50%;left: 50%;z-index: 9999999;background: rgb(0, 0, 0);font-size: 16px;'
    document.body.appendChild(toastDom);
    setTimeout(function () {
        var d = 0.5;
        toastDom.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        toastDom.style.opacity = '0';
        setTimeout(() => { document.body.removeChild(toastDom) }, d * 1000);
    }, duration);
}

const reply = (headSrc, str) => {
    var html = `<div class='reply'><div class='msg'><img src='${headSrc}' style='border-radius: ' /><span class='name'>AI bot</span><div class="markdown-body md">${marked.parse(str)}</div></div></div>`;
    upView(html);
    return highlightcode(md);
}

const ask = (headSrc, str, bool) => {
    let add_time;
    let datetime = "";
    if(bool){
        datetime = showdate();
        add_time = `<div class="time">${datetime}</div>`;
    }else{
        add_time = '';
    }
    var html = `<div class='ask'>${add_time}<div class='msg'><img src='${headSrc}' style='border-radius: ' /><div class="markdown-body md">${str}</div></div></div>`;
    //return upView(html);
    handleBot(str, type=2, datetime);
    return upView(html);
}

function upView(html) {
    let message = $('#message');
    message.append(html);
    return $('html,body').animate({
        scrollTop: message.outerHeight() - window.innerHeight
    }, 200);
}

function send (msg) {
    if(canSend){
        nowtime = new Date().getTime();
        if(localStorage.getItem('oldtime')){
            oldtime = localStorage.getItem('oldtime');
        }else{
            oldtime = nowtime;
            localStorage.setItem('oldtime', oldtime);
        }
        if(nowtime - oldtime > 60000){
            oldtime = nowtime;
            bool = true;
            localStorage.setItem('oldtime', oldtime);
        }else{
            bool = false;
        }
        ask("./images/touxiangm.png", msg, bool);
        textarea.innerText = '';
        btn.style.background = '#ddd';
        btn.setAttribute('disabled', false);
        canSend = false;
        //init();
    }
}




if(navigator.userAgent.match(/MQQBrowser/gi)){
	toast("请不要在QQ内部打开",2000);
	document.body.innerHTML ="请不要在QQ内部打开,请复制到其他浏览器打开";
	//window.close()
}


function saveHistory(humanMsg, botMsg, datatime) {
	var chatList = localStorage.getItem("chatList");
	if (chatList) {
		chatList = JSON.parse(chatList);
		chatList.push({
			human: humanMsg,
			bot: botMsg,
            dt : datatime
		})
		localStorage.setItem("chatList", JSON.stringify(chatList));
	} else {
		chatList = []
		chatList.push({
			human: humanMsg,
			bot: botMsg,
            dt : datatime
		})
		localStorage.setItem("chatList", JSON.stringify(chatList))
	}
}

function loadHistory(data) {
	var chatList = data ? data : localStorage.getItem("chatList")
	if (chatList) {
		chatList = JSON.parse(chatList);
        let message = $('#message');
        let add_time;
		chatList.forEach(function(item) {
            if(item.dt){
                add_time = `<div class="time">${item.dt}</div>`;
            }else{
                add_time = '';
            }
            //human
            let html_human = `<div class='ask'>${add_time}<div class='msg'><img src='./images/touxiangm.png' style='border-radius: ' /><div class="markdown-body md">${item.human}</div></div></div>`;
            message.append(html_human);

			//bot
            let html_bot = `<div class='reply'><div class='msg'><img src='./images/bot.png' style='border-radius: ' /><span class='name'>AI bot</span><div class="markdown-body md">${katexTohtml(mdConverter(item.bot.replace(/\\n+/g,"\n")))}</div></div></div>`;
            message.append(html_bot);
		})
        $('html,body').animate({
            scrollTop: message.outerHeight() - window.innerHeight
        }, 200);

	}

}

function updateAigcfunKey() {
	let useKeyTime = localStorage.getItem("useKeyTime") ? localStorage.getItem("useKeyTime") : 0;
	console.log(useKeyTime);

	if (useKeyTime > 8 || !localStorage.getItem("useKeyTime") || !localStorage.getItem("aigcfunkey")) {
		console.log("update aigcfunkey");
		localStorage.setItem("useKeyTime", 0);

		$.ajax({
			method: "GET",
			url: "https://api.aigcfun.com/fc/key",
			headers: {
				"Content-Type": "application/json"
			},
			success: function(response) {
				console.log(response);
				let resp = response.data;
				let aigcfunkey = resp;
				if (!aigcfunkey) {
					toast("更新key失败",2000)
					return
				}

				localStorage.setItem("aigcfunkey", aigcfunkey)

			}
		});

	}
}

function handleBot(question, type, datetime) {
	let q = question;
	$(".tit").html("思考中，请稍后...");
	$('#my-modal-loading').modal('open');

	if (type === 1) {
		
		//安卓接口 start
		// if(!window.AndroidTEST){
		// 	 alert("请在app中使用")
		// 	 simulateBotResponse("请在app中使用")
		// 	 hideWait()
		//   $('#my-modal-loading').modal('close');
		// 	 return
		// }
		setTimeout(()=>{
			new Promise((resolve, reject) => {
                try {
                    const result = window.AndroidAIGCFUN.aigcfun(question); 
                    simulateBotResponse(result)
			        //window.AndroidTest.showToast("hello toast")
                    saveHistory(question, result)//Save History
                    //hideWait() 
					$('#my-modal-loading').modal('close');
                    resolve(result);
                } catch (err) {
                    //hideWait()
					$('#my-modal-loading').modal('close');
                    reject(err);
                }
            });
		},500)
		
		//安卓接口 end

	} else if (type === 2) {
		updateAigcfunKey();
		let useKeyTime = localStorage.getItem("useKeyTime") ? localStorage.getItem("useKeyTime") : 0;

		$.ajax({
			method: "POST",
			url: "https://api.aigcfun.com/api/v1/text?key=" + localStorage.getItem("aigcfunkey"),
			headers: {
				"Content-Type": "application/json"
			},
			data: JSON.stringify({
				messages: [{
						role: "system",
						content: "请以markdown的形式返回答案"
					},
					{
						role: "user",
						content: q
					}
				],
				tokensLength: q.length + 10,
				model: "gpt-3.5-turbo",
				stream:true

			}),
			success: (data) => {
				if (data.choices[0].finish_reason === 'length') { // 支持长回复
					console.log(true)
				  }
				console.log(data.choices[0].text);
				localStorage.setItem("useKeyTime", useKeyTime > 8 ? 0 : Number(useKeyTime) + 1);
				//Save History
				let ans = data.choices[0].text;
				try {
					saveHistory(question, ans, datetime);
				} catch (e) {
					//TODO handle the exception
				}

				reply("./images/bot.png", ans);
                $(".tit").html("AI Chat");

				//hideWait()
				$('#my-modal-loading').modal('close');
				if (ans.indexOf("已达上限") !== -1 || ans.indexOf("有效的key") !== -1) {
					localStorage.removeItem("useKeyTime")
					updateAigcfunKey();
					toast("已为你更新key,如果还提示,请联系管理员更新",2000);
				}
			},
			error: function(res) {
				//hideWait();
				$('#my-modal-loading').modal('close');
				toast("未知错误...",2000);
			}
		});


		//end if
	}


}


function filterXSS(input) {
	//let output = input.replace(/<script[^>]*>.*?<script>/gi, '');
	let output = input.replace(/<script/gi, '&lt;script');
	//output = output.replace(/<\/script/gi, '&lt;&#x2F;script');
	output = output.replace(/<meta/gi, '&lt;meta');
	// output = output.replace(/<\/meta/gi, '&lt;&#x2F;meta');
	/* output = output.replace(/<>]+?on\\\\w+=.*?>/gi, '');
     output = output.replace(/<[^>]*>.*?<iframe>/gi, '');
     output = output.replace(/<img[^>]+src=[\\']([^\\']+)[\\'][^>]*>/gi, '');
     output = output.replace(/<link rel=[\\']stylesheet[\\'][^>]+>/gi, ''); */
	return output;
}

function mdConverter(rawData) {
	let converter = new showdown.Converter(); //增加拓展table
	converter.setOption('tables',
		true); //启用表格选项。从showdown 1.2.0版开始，表支持已作为可选功能移入核心拓展，showdown.table.min.js扩展已被弃用
	return converter.makeHtml(rawData);
}
//md end

function katexTohtml(rawHtml){
	let renderedHtml = rawHtml.replace(/<em>/g,"").replace(/<\/em>/g,"").replace(/\$\$(.*?)\$\$/g, (_, tex) => {
		 //debugger
	  return katex.renderToString(tex, { displayMode: false,throwOnError: false });
	});
	renderedHtml = renderedHtml.replace(/\$(.*?)\$/g, (_, tex) => {
		 //debugger
	  return katex.renderToString(tex, { displayMode: false,throwOnError: false });
	});

	try {
		renderedHtml = filterXSS(renderedHtml) //filterXSS
	}catch (e) {
		console.warn(e)
	}

	return renderedHtml;
}


function copyToClipboard(text) {
	// 创建一个临时的input元素
	const input = document.createElement('textarea');
	input.innerText = text
	document.body.appendChild(input);

	// 选中input元素中的文本内容
	input.select();

	// 执行复制命令
	document.execCommand('copy');

	// 删除创建的input元素
	document.body.removeChild(input);
}

function highlightcode(dom){
	if(!dom){
		// 初始化highlight.js
		// hljs.initHighlightingOnLoad();
		for (let i = 0; i <= document.getElementsByTagName("code").length - 1; i++) {
			//document.getElementsByTagName("code")[i].setAttribute("class",
			//	"language-javascript hljs");
			document.getElementsByTagName("code")[i].classList.add("hljs");
		}
	}else{
		// 初始化highlight.js
		// hljs.initHighlightingOnLoad();
        let nodelist = document.getElementsByClassName('md');
		for (let i = 0; i <= nodelist.length - 2; i++) {
			//document.getElementsByTagName("code")[i].setAttribute("class",
			//	"language-javascript hljs");
            if(nodelist[i].getElementsByTagName("code").length){

                for(let code = 0; code <= nodelist[i].getElementsByTagName("code").length -1 ; code++){

                    nodelist[i].getElementsByTagName("code")[code].classList.add("hljs");
                }
            }
			
		}
	}
    hljs.configure({
        ignoreUnescapedHTML: true
    });
	hljs.highlightAll()
	//添加代码复制按钮 start
	let preList =  document.querySelectorAll("pre")
	preList.forEach((pre)=>{
		try{
			if(!pre.querySelector(".btn-pre-copy")){
				//<span class=\"btn-pre-copy\" onclick='preCopy(this)'>复制代码</span>
				let copyBtn = document.createElement("span");
				copyBtn.setAttribute("class","btn-pre-copy");
				copyBtn.addEventListener("click",(event)=>{
					let _this = event.target
					console.log(_this)
					let pre = _this.parentNode;
					console.log(pre.innerText)
					_this.innerText = '';
					copyToClipboard(pre.innerText);
					_this.innerText = '复制成功'
					setTimeout(() =>{
						_this.innerText = '复制代码'
					},2000)
				})
				copyBtn.innerText = '复制代码'
				pre.insertBefore(copyBtn, pre.firstChild)
			}
		}catch (e) {
			console.log(e)
		}
	})
	//添加代码复制按钮 end

}

document.getElementById("clearBtn").addEventListener("click", () => {
	$('#my-confirm').modal('open');
	var $confirm = $('#my-confirm');
	var $confirmBtn = $confirm.find('[data-modal-confirm]');
	var $cancelBtn = $confirm.find('[data-modal-cancel]');
	$confirmBtn.on('click', function() {
    	// do something
		localStorage.removeItem("chatList")
		$('#my-confirm').modal('close');
		location.reload();
	});

	$cancelBtn.on('click', function() {
    // do something
	$('#my-confirm').modal('close');
	});
	
})

if(localStorage.getItem('firsttime')){
    document.getElementsByClassName('time')[0].innerHTML = localStorage.getItem('firsttime');
}else{
    localStorage.setItem('firsttime', showdate())
    document.getElementsByClassName('time')[0].innerHTML = localStorage.getItem('firsttime');
}


//载入历史
loadHistory();
//setTimeout(loadHistory, 200)

highlightcode(md);

updateAigcfunKey();

window.onload = function () {

	$('html,body').animate({
		scrollTop : document.querySelector('#message').scrollHeight - window.innerHeight
	}, 2);
}

