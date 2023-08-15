const $ = (e) => document.querySelector(e);
function localStorageGet(key) {
    try {
        return window.localStorage[key];
    } catch (e) {
        // nothing
        return false;
    }
}

function localStorageSet(key, val) {
    // console.log('local set', 'key', key, 'value', val);
    try {
        window.localStorage[key] = val;
    } catch (e) {
        // nothing
    }
}

//--------------------vars -----------------------
var frontpage = [
    '# [小张聊天室](https://chat.zhangsoft.link) - IM模式客户端',
    'Powered by [Dr0](https://github.com/redble)',
    '---',
    '欢迎来到小张聊天室，这是一个黑客风格的聊天室。',
    '注意：在这里，我们把"房间（chatroom）"称作"频道（channel）"。',
    '公共频道（在线用户多）：[?chat](/?chat)',
    `您也可以自己创建频道，只需要按照这个格式打开网址即可：\n${document.URL}?房间名称`,
    `这个是为您准备的频道（只有您自己）： ?${Math.random().toString(36).substr(2, 8)}`,
    '---',
    '本聊天室依照中华人民共和国相关法律，保存并公布您的聊天记录。',
    '无论您是否在中国境内，都请自觉遵守中华人民共和国相关法律和聊天室内相关规定。',
    '您如果对本聊天室不满意或认为受到不公平对待，则可以选择向管埋员申诉或选择离开。',
    '---',
    '您知道吗？这个聊天室原本是[MelonFish](https://gitee.com/XChatFish)交给[MrZhang365](https://blog.mrzhang365.cf)开发的XChat聊天室。',
    '但是由于某些原因，它被开发者魔改成了现在的小张聊天室。',
    'XChat基于HackChat，HackChat的GitHub仓库地址为：\nhttps://github.com/hack-chat/main',
    '小张聊天室的仓库地址为：https://github.com/ZhangChat-Dev-Group/ZhangChat',
    '在此对HackChat的开发者深表感谢。',
    '---',
    '本聊天室开发者：',
    '@MrZhang365 - [小张的博客](https://blog.mrzhang365.cf/) && [小张软件](https://www.zhangsoft.cf/)',
    '@paperee - [纸片君ee的个人主页](https://paperee.guru/)',
    '---',
    '更多代码贡献者：',
    '@[4n0n4me](http://github.com/xjzh123/) - 编写了[hackchat\\+\\+客户端](https://hc.thz.cool/)',
    '@[Dr0](https://github.com/redble) - 编写了[ZhangChat增强脚本](https://greasyfork.org/zh-CN/scripts/458989-zhchat%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC)',
    '---',
    '友情链接：',
    '[HackChat聊天室](https://hack.chat/)',
    '[hackchat\\+\\+客户端](https://hc.thz.cool/)',
    '[TanChat聊天室](https://tanchat.fun/)',
    '[ZhangChat增强脚本](https://greasyfork.org/zh-CN/scripts/458989-zhchat%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC)',
    '---',
    '2023.02.23~2023.03.26 [小张聊天室开发组](https://github.com/ZhangChat-Dev-Group) 致',
    '**本站由[雨云](https://www.rainyun.com/MjcxMTc=_)提供计算服务**',
].join("\n");
function initFrontpage() {
    document.body.classList.add('notice_back_color');
    $('#messages').innerHTML =
        `
    <style>
    body{
        padding:2em;
    }
    .cmessages{
        padding-top:0;
    }
    .container{
        max-width:100%;
    }
    </style>
    <div class="notice_back_color" style="display: flex;width: 100%; height: 100%;border-radius: 5px; justify-content: center;">
    <div id="_index_page">
    ${md.render(frontpage)}
    </div>
    </div>`;
};
// 初始化Markdown
var markdownOptions = {
    html: false,
    xhtmlOut: false,
    breaks: true,
    langPrefix: '',
    linkify: true,
    linkTarget: '_blank" rel="noreferrer',
    typographer: true,
    quotes: `""''`,
    doHighlight: true,
    langPrefix: 'hljs language-',
    highlight: function (str, lang) {
        if (!markdownOptions.doHighlight || !window.hljs) {
            return '';
        }
        //console.log('hightlight work');
        if (lang && hljs.getLanguage(lang)) {
            // console.log('hightlight work2');
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) {
                // nothing
            }
        }

        try {
            return hljs.highlightAuto(str).value;
        } catch (__) {
            // nothing
        }

        return '';
    }
};
var md = new Remarkable('full', markdownOptions);

md.use(remarkableKatex);
var myMurmur = '';
var lastSent = [""];
var lastSentPos = 0;

var schemes = [
    'light',
    'dark'
];
var highlights = [
    'darcula',
    'rainbow',
    'zenburn',
    'androidstudio',
]

var uwuPrefixs = [
    'none',
    'onlytext',
    'onlyemoji',
]
// 默认方案
var currentScheme = 'light';
var currentHighlight = 'darcula';
var currentPrefix = 'none';

function setScheme(scheme) {
    currentScheme = scheme;
    $('#scheme-link').href = `css/${scheme}.css`;
    localStorageSet('scheme', scheme);
}
function openNewLink(link) {
    let a = document.createElement("a");
    a.setAttribute("href", link);
    a.setAttribute("target", "_blank");
    a.click();
}
function verifyLink(link) {
    var linkHref = Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(link.href));

    if (linkHref !== link.innerHTML)
        createWeuiDialog(`等一下！`, `你即将前往：${linkHref}`, (e) => {
            // console.log(e);
            if (e)
                openNewLink(link);
        });
    else return true;


    return false;
}

function setHighlight(scheme) {
    currentHighlight = scheme;
    $('#highlight-link').href = `vendor/hljs/styles/${scheme}.min.css`;
    localStorageSet('highlight', scheme);
}
function changeAllmessage(d) {
    [...document.querySelectorAll('.none'), ...document.querySelectorAll('.onlytext'), ...document.querySelectorAll('.onlyemoji')].forEach(e => {
        d(e);
    });
}
function changeAllPrefix(d) {

    [...document.querySelectorAll('.level'), ...document.querySelectorAll('.block')].forEach(e => d(e));
}
function displayPrefix(name) {

    switch (name) {
        case 'none':
            changeAllmessage((e) => {
                e.className = 'none';
            });
            break;
        case 'onlytext':
            changeAllmessage((e) => {
                e.className = 'onlytext';
            });
            break;
        case 'onlyemoji':
            changeAllmessage((e) => {
                e.className = 'onlyemoji';
            });
            break;
    }
}
function setPrefix(scheme) {
    currentPrefix = scheme;
    localStorageSet('prefix', scheme);
    displayPrefix(scheme);
}



highlights.forEach(function (scheme) {
    var option = document.createElement('option');
    option.textContent = scheme;
    option.value = scheme;
    $('#highlight-selector').appendChild(option);
});

uwuPrefixs.forEach(function (scheme) {
    var option = document.createElement('option');
    option.textContent = scheme;
    option.value = scheme;
    $('#prefix-selector').appendChild(option);
});

schemes.forEach(function (scheme) {
    var option = document.createElement('option');
    option.textContent = scheme;
    option.value = scheme;
    $('#scheme-selector').appendChild(option);
});


var modAction = [	//管理员操作
    {
        text: '无',
        data: null,
    },
    {
        text: '踢出',	//对用户显示的文本
        data: {	//用户选择了这个操作，客户端向服务器发送数据时使用的模板，客户端会自动加上nick参数
            cmd: 'kick',
        },
    },
    {
        text: '封禁',
        data: {
            cmd: 'ban',
        },
    },
    {
        text: '禁言1分钟',
        data: {
            cmd: 'dumb',
            time: 1,
        },
    },
    {
        text: '禁言5分钟',
        data: {
            cmd: 'dumb',
            time: 5,
        }
    },
    {
        text: '禁言10分钟',
        data: {
            cmd: 'dumb',
            time: 10,
        }
    },
    {
        text: '永久禁言',
        data: {
            cmd: 'dumb',
            time: 0,
        }
    },
];
modAction.forEach((action) => {
    var option = document.createElement('option');
    option.textContent = action.text;
    option.value = JSON.stringify(action.data);	//转换为JSON
    $('#mod-action').appendChild(option)
});
$('#prefix-selector').onchange = function (e) {
    //console.log('set prefix');
    setPrefix(e.target.value);
}
$('#highlight-selector').onchange = function (e) {
    setHighlight(e.target.value);

}
$('#scheme-selector').onchange = function (e) {
    //console.log(e.target.value);
    setScheme(e.target.value);
}
$('#mod-action').onchange = (e) => {
    modCmd = JSON.parse(e.target.value)	//解析为obj
}
var modCmd = null;
var text_count = $('#text_count');
// 允许渲染的图片域名
var allowImages = true;
var imgHostWhitelist = [ // 这些是由小张添加的
    'i.loli.net', 's2.loli.net', // SM-MS图床
    's1.ax1x.com', 's2.ax1x.com', 'z3.ax1x.com', 's4.ax1x.com', // 路过图床
    'i.postimg.cc', 'gimg2.baidu.com', // Postimages图床 百度
    'files.catbox.moe', 'img.thz.cool', 'img.liyuv.top', 'share.lyka.pro', // 这些是ee加的（被打
    document.domain,    // 允许我自己
    'img.zhangsoft.cf',    // 小张图床
    'bed.paperee.repl.co', 'filebed.paperee.guru',    // 纸片君ee的纸床
    'imagebed.s3.bitiful.net',    //Dr0让加的
    'captcha.dr0.lol',        // Dr0's Captcha
    'img1.imgtp.com', 'imgtp.com',    // imgtp
    'api.helloos.eu.org',    // HelloOsMe's API
    'cdn.luogu.com.cn',    // luogu
    'images.weserv.nl',    // Weserv的图片代理
    'api.remelens.link',    // HelloOsMe's API (another domain
    'pic.imgdb.cn',    // 聚合图床
    'blog.mrzhang365.cf',    // MrZhang365's blog
    't00img.yangkeduo.com' //拼多多图床
];
function isMobile() {
    let flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return flag;
}
function setPageWidth(j) {
    $('#main_container').style.maxWidth = j;
}
function updatePageWidth() {
    // console.log('update page width');
    if (!$('#pin-sidebar').checked && document.body.clientWidth >= 600) {
        setPageWidth(document.body.clientWidth - 100 + 'px');
        // console.log('width big 600px and no pin sidebar');
        return;
    } else setPageWidth('600px');
    let w = document.body.clientWidth - 530;
    if (w > 600) {
        //  console.log('width big then 600px');
        setPageWidth(w + 'px');
    } else setPageWidth('600px');
}

window.onresize = updatePageWidth;
//-------------------------------------------------
if (localStorageGet('highlight')) {
    setHighlight(localStorageGet('highlight'));
}

if (localStorageGet('prefix')) {
    setPrefix(localStorageGet('prefix'));
}
if (localStorageGet('scheme')) {
    setScheme(localStorageGet('scheme'));
}

$('#highlight-selector').value = currentHighlight;
$('#prefix-selector').value = currentPrefix;
$('#scheme-selector').value = currentScheme;

$('#set-head').onclick = function () {
    createCustomPrompt('设置头像', '头像地址 (留空为默认)', (e, t) => {
        // debugger;
        if (e) {
            localStorageSet('head', t);
        }
    });
};
$('#clear-messages').onclick = function () {
    createWeuiDialog('清空聊天记录', '确定要清空吗?', (e) => {
        if (e) {
            clearMessage();
            pushInfo('历史记录已清空');
        }
    });
};
//---------------------------------------------------
var uwuTitle = "小张聊天室 - IM客户端";
var uwuBUG = "ZhangChat"
var windowActive = true;
var unread = 0;

window.onfocus = function () {
    windowActive = true;
    updateTitle();
}

window.onblur = function () {
    windowActive = false;
}

window.onscroll = function () {
    if (isAtBottom()) {
        updateTitle();
    }
}

function updateTitle() {
    if (windowActive && isAtBottom()) {
        unread = 0;
    }

    if (myChannel) {
        uwuTitle = myChannel;

        if (unread > 0) {
            uwuTitle = `（${unread}）${uwuTitle}`;
        }
    }

    document.title = `${uwuTitle} - ${uwuBUG}`;
}
//--------------------------------------------------
var alerting = false;
function createWeuiDialog(title = "提示", content, callback) {
    if (alerting) return;
    var mask = document.createElement("div");
    mask.className = "weui-mask weui-animate-fade-in";
    let _callback = callback;
    callback = (e) => {
        _callback(e);
        alerting = false;
    };
    mask.addEventListener('click', function () {
        document.body.removeChild(container);
        callback(false);
    });
    var dialog = document.createElement("div");
    dialog.className = "weui-dialog weui-animate-fade-in";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("tabindex", "-1");

    var closeButton = document.createElement("button");
    closeButton.className = "weui-hidden_abs weui-dialog__close";
    closeButton.innerText = "关闭";

    var titleElement = document.createElement("div");
    titleElement.className = "weui-dialog__hd";
    var strongElement = document.createElement("p");
    //strongElement.className = "weui-dialog__title";
    strongElement.innerText = title;
    titleElement.appendChild(strongElement);

    var contentElement = document.createElement("div");
    contentElement.className = "weui-dialog__bd";
    contentElement.innerText = content;

    var actionElement = document.createElement("div");
    actionElement.className = "weui-dialog__ft";

    var cancelButton = document.createElement("a");
    cancelButton.setAttribute("href", "javascript:;");
    cancelButton.className = "weui-dialog__btn weui-dialog__btn_default fontnone";
    cancelButton.setAttribute("role", "button");
    cancelButton.innerText = "取消";

    var confirmButton = document.createElement("a");
    confirmButton.setAttribute("href", "javascript:;");
    confirmButton.className = "weui-dialog__btn weui-dialog__btn_primary fontnone";
    confirmButton.setAttribute("role", "button");
    confirmButton.innerText = "确定";

    actionElement.appendChild(cancelButton);
    actionElement.appendChild(confirmButton);

    dialog.appendChild(closeButton);
    dialog.appendChild(titleElement);
    dialog.appendChild(contentElement);
    dialog.appendChild(actionElement);

    var container = document.createElement("div");
    container.className = "";
    container.appendChild(mask);
    container.appendChild(dialog);

    document.body.appendChild(container);

    cancelButton.addEventListener("click", function () {
        document.body.removeChild(container);
        callback(false);
    });

    confirmButton.addEventListener("click", function () {
        document.body.removeChild(container);
        callback(true);
    });
}
var prompting = false;
function createCustomPrompt(title, inputPlaceholder, callback, text = '') {
    if (prompting) return;
    var mask = document.createElement("div");

    mask.className = "weui-mask weui-animate-fade-in";

    var dialog = document.createElement("div");
    dialog.className = "weui-dialog weui-animate-fade-in prompt_color";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("tabindex", "-1");

    var closeButton = document.createElement("button");
    closeButton.className = "weui-hidden_abs weui-dialog__close";
    closeButton.innerText = "关闭";

    var titleElement = document.createElement("div");
    titleElement.className = "weui-dialog__hd";
    var strongElement = document.createElement("p");
    //strongElement.className = "weui-dialog__title";
    strongElement.innerText = title;
    titleElement.appendChild(strongElement);

    var contentElement = document.createElement("div");
    contentElement.className = "weui-dialog__bd weui-prompt";

    var inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", inputPlaceholder);
    inputElement.className = "weui-input weui-input-border"; // 添加边框样式类
    inputElement.value = text;
    inputElement.onkeydown = function (e) {
        if (e.keyCode == 13 /* ENTER */ && !e.shiftKey) {
            document.body.removeChild(container);
            callback(true, inputElement.value);
            prompting = false;
        } else if (e.keyCode == 27) {
            document.body.removeChild(container);
            callback(false, inputElement.value);
            prompting = false;
        }
    };
    contentElement.appendChild(inputElement);

    var actionElement = document.createElement("div");
    actionElement.className = "weui-dialog__ft";

    var cancelButton = document.createElement("a");
    cancelButton.setAttribute("href", "javascript:;");
    cancelButton.className = "weui-dialog__btn weui-dialog__btn_default fontnone prompt_text_color";
    cancelButton.setAttribute("role", "button");
    cancelButton.innerText = "取消";

    var confirmButton = document.createElement("a");
    confirmButton.setAttribute("href", "javascript:;");
    confirmButton.className = "weui-dialog__btn weui-dialog__btn_primary fontnone";
    confirmButton.setAttribute("role", "button");
    confirmButton.innerText = "确定";

    actionElement.appendChild(cancelButton);
    actionElement.appendChild(confirmButton);

    dialog.appendChild(closeButton);
    dialog.appendChild(titleElement);
    dialog.appendChild(contentElement);
    dialog.appendChild(actionElement);

    var container = document.createElement("div");
    container.className = "";
    container.appendChild(mask);
    container.appendChild(dialog);

    document.body.appendChild(container);

    cancelButton.addEventListener("click", function () {
        document.body.removeChild(container);
        callback(false, inputElement.value);
        prompting = false;
    });

    confirmButton.addEventListener("click", function () {
        var inputValue = inputElement.value;
        document.body.removeChild(container);
        callback(true, inputElement.value);
        prompting = false;
    });
    inputElement.focus();
}
function isAtBottom() {
    // console.log(window.innerHeight, window.scrollY, document.body.scrollHeight);
    // console.log('isAtbottom', (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 1));
    return (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 1);
}
function getDomain(link) {
    var a = document.createElement('a');
    a.href = link;
    return a.hostname;
}

function isWhiteListed(link) {
    return imgHostWhitelist.indexOf(getDomain(link)) !== -1;
}

var allowAudio = true;    // 允许音频
function isAudioFile(filename) {
    var audioRegex = /\.(mp3|wav|ogg|mp4|flac|m4a|aac)$/i;

    return audioRegex.test(filename);
}

function getImageSizeByUrl(url) {
    return new Promise(function (resolve, reject) {
        let image = new Image();
        image.onload = function () {
            resolve({
                width: image.width,
                height: image.height
            });
        };
        image.onerror = function () {
            reject(new Error('error'));
        };
        image.src = url;
    });
}
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function rdStr(length) {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var result = '';

    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}
function filterXSS(imageUrl) {
    // 替换特殊字符
    imageUrl = imageUrl.replace(/</g, '');
    imageUrl = imageUrl.replace(/>/g, '');
    imageUrl = imageUrl.replace(/"/g, '');
    imageUrl = imageUrl.replace(/'/g, '');
    imageUrl = imageUrl.replace(/&/g, '');
    // 添加其他需要替换的符号

    // 替换 javascript: 链接
    imageUrl = imageUrl.replace(/javascript:/gi, '');

    return imageUrl;
}

md.renderer.rules.image = function (tokens, idx, options) {
    var src = Remarkable.utils.escapeHtml(tokens[idx].src);

    if (isWhiteListed(src) && window.img_sw) {
        var imgSrc = ` src="${filterXSS(tokens[idx].src)}"`;
        var title = tokens[idx].title ? (` title="${Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(tokens[idx].title))}"`) : '';
        var alt = ` alt="${(tokens[idx].alt ? Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(Remarkable.utils.unescapeMd(tokens[idx].alt))) : '')}"`;

        var suffix = options.xhtmlOut ? ' /' : '';

        return `<a href="${src}" target="_blank" rel="noreferrer"><img onload="javascript:window.scrollTo(0, document.body.scrollHeight);"  ${imgSrc}${alt}${title}${suffix} class="text"></span></a>`;

    } else if (isAudioFile(src) && window.audio_sw) {
        var audioSrc = ` src="${Remarkable.utils.escapeHtml(tokens[idx].src)}"`;
        var title = tokens[idx].title ? (` title="${Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(tokens[idx].title))}"`) : '';
        var alt = ` alt="${(tokens[idx].alt ? Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(Remarkable.utils.unescapeMd(tokens[idx].alt))) : '')}"`;
        var suffix = options.xhtmlOut ? ' /' : '';
        var scrollOnload = isAtBottom() ? ' onload="window.scrollTo(0, document.body.scrollHeight)"' : '';
        return `<a href="${src}" target="_blank" rel="noreferrer"><audio ${scrollOnload}${audioSrc}${alt}${title}${suffix} controls></audio></a>`;
    }

    return `<a href="${src}" target="_blank" rel="noreferrer">${Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(src))}</a>`;
};

md.renderer.rules.link_open = function (tokens, idx, options) {
    var title = tokens[idx].title ? (` title="${Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(tokens[idx].title))}"`) : '';
    var target = options.linkTarget ? (` target="${options.linkTarget}"`) : '';
    return `<a rel="noreferrer" onclick="return verifyLink(this)" href="${Remarkable.utils.escapeHtml(tokens[idx].href)}"${title}${target}>`;
};

md.renderer.rules.text = function (tokens, idx) {
    tokens[idx].content = Remarkable.utils.escapeHtml(tokens[idx].content);

    if (tokens[idx].content.indexOf('?') !== -1) {
        tokens[idx].content = tokens[idx].content.replace(/(^|\s)(\?)\S+?(?=[,.!?:)]?\s|$)/gm, function (match) {
            var channelLink = Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(match.trim()));
            var whiteSpace = '';

            if (match[0] !== '?') {
                whiteSpace = match[0];
            }

            return `${whiteSpace}<a href="${channelLink}" target="_blank">${channelLink}</a>`;
        });
    }

    return tokens[idx].content;
};

$('#sidebar').onmouseenter = $('#sidebar').ontouchstart = function (e) {
    $('#sidebar-content').classList.remove('hidden');
    $('#sidebar').classList.add('expand');
    e.stopPropagation();
    updatePageWidth();
}

$('#sidebar').onmouseleave = document.ontouchstart = function (event) {
    var e = event.toElement || event.relatedTarget;

    try {
        if (e.parentNode == this || e == this) {
            return;
        }
    } catch (e) {
        return;
    }

    if (!$('#pin-sidebar').checked) {
        $('#sidebar-content').classList.add('hidden');
        $('#sidebar').classList.remove('expand');
    } else
        updatePageWidth();
}

function updateInputSize() {
    //debugger;
    var atBottom = isAtBottom();
    var input = $('#chatinput');
    input.style.height = 0;
    input.style.height = input.scrollHeight + 'px';
    document.body.style.marginBottom = $('#footer').offsetHeight + 5 + 'px';

    if (atBottom) {
        window.scrollTo(0, document.body.scrollHeight);
    }
}

$('#footer').onclick = function () {
    $('#chatinput').focus();
}
function updateCount(e) {
    text_count.innerText = e.target.value.length;
}
$('#sendbtn').onclick = function () {
    let e = $('#chatinput');
    if (!!e.value) {
        var text = e.value;
        e.value = '';
        send({ cmd: 'chat', text: text, head: localStorageGet('head') || '' });
        updateCount({ target: e });
        lastSent[0] = text;
        lastSent.unshift("");
        lastSentPos = 0;

        updateInputSize();
    }
}
$('#chatinput').onkeydown = function (e) {
    if (e.keyCode == 13 /* ENTER */ && !e.shiftKey) {
        e.preventDefault();
        if (!wsConnect)
            join(myChannel);
        // 发送消息

        if (!!e.target.value) {
            var text = e.target.value;
            e.target.value = '';
            send({ cmd: 'chat', text: text, head: localStorageGet('head') || '' });

            lastSent[0] = text;
            lastSent.unshift("");
            lastSentPos = 0;

            updateInputSize();
        }
    } else if (e.keyCode == 38 /* UP */) {
        // 恢复以前发送的消息
        if (e.target.selectionStart === 0 && lastSentPos < lastSent.length - 1) {
            e.preventDefault();

            if (lastSentPos == 0) {
                lastSent[0] = e.target.value;
            }

            lastSentPos += 1;
            e.target.value = lastSent[lastSentPos];
            e.target.selectionStart = e.target.selectionEnd = e.target.value.length;

            updateInputSize();
        }
    } else if (e.keyCode == 40 /* DOWN */) {
        if (e.target.selectionStart === e.target.value.length && lastSentPos > 0) {
            e.preventDefault();

            lastSentPos -= 1;
            e.target.value = lastSent[lastSentPos];
            e.target.selectionStart = e.target.selectionEnd = 0;

            updateInputSize();
        }
    } else if (e.keyCode == 27 /* ESC */) {
        // 清空输入框
        e.preventDefault();
        e.target.value = '';
        lastSentPos = 0;
        lastSent[lastSentPos] = '';
        updateInputSize();
    } else if (e.keyCode == 9 /* TAB */) {
        if (e.ctrlKey) {
            return;
        }

        e.preventDefault();

        var pos = e.target.selectionStart || 0;
        var text = e.target.value;
        var index = text.lastIndexOf('@', pos);

        var autocompletedNick = false;

        if (index >= 0) {
            var stub = text.substring(index + 1, pos);

            // 搜索昵称
            var nicks = onlineUsers.filter(function (nick) {
                return nick.indexOf(stub) == 0
            });

            if (nicks.length > 0) {
                autocompletedNick = true;

                if (nicks.length == 1) {
                    insertAtCursor(nicks[0].substr(stub.length) + " ");
                }
            }
        }

        // 由于没有插入昵称，因此插入一个制表符
        if (!autocompletedNick) {
            insertAtCursor('\t');
        }
    }
    updateCount(e);
}
$('#chatinput').oninput = function (e) {
    updateCount(e);
    updateInputSize();
}
function toBottom() {
    if (isAtBottom())
        window.scrollTo(0, document.body.scrollHeight);

}
function unreadMessage(c) {
    unread += c;
    updateTitle();
}
function insertAtCursor(text) {
    var input = $('#chatinput');
    var start = input.selectionStart || 0;
    var before = input.value.substr(0, start);
    var after = input.value.substr(start);

    before += text;
    input.value = before + after;
    input.selectionStart = input.selectionEnd = before.length;

    updateInputSize();
}


// 用户列表
var onlineUsers = [];
var ignoredUsers = [];

function userAdd(nick, trip) {
    var user = document.createElement('a');
    user.textContent = nick;

    user.onclick = function (e) {
        userInvite(nick)
    }

    user.oncontextmenu = function (e) {
        e.preventDefault();
        userModAction(nick)
    }

    var userLi = document.createElement('li');
    userLi.appendChild(user);

    if (trip) {
        var userTrip = document.createElement('span')
        userTrip.innerHTML = trip
        userTrip.classList.add('usertrip')
        userLi.appendChild(userTrip)
    }

    $('#users').appendChild(userLi);
    onlineUsers.push(nick);
}
//----------------------------------------------------------------------------------------
window.onload = function () {
    updatePageWidth();
}
updateInputSize();
var init_checkboxs = [
    {
        id: 'pin-sidebar',
        onchange: ['self', () => updatePageWidth()],
        check: true,
        init: () => {
            $('#sidebar').classList.add('expand');
            $('#sidebar-content').classList.remove('hidden');
        }
    },
    {
        id: 'auto-login',
        onchange: ['self', (e) => window.autoLogin = !!e.target.checked],
        check: true,
        init: () => window.autoLogin = true
    },
    {
        id: 'sound-switch',
        onchange: ['self', (e) => window.sound_sw = !!e.target.checked],
        check: true,
        init: () => window.sound_sw = true
    },/*
    {
        id: 'notify-switch',
        onchange: 'self',
        check: true,
        init: () => window.notify_sw = true
    },*/
    {
        id: 'syntax-highlight',
        onchange: ['self', (e) => markdownOptions.doHighlight = e],
        init: (e) => markdownOptions.doHighlight = e
    },
    {
        id: 'show-sendbtn',
        onchange: (e) => {
            let d = !!e.target.checked;
            $('#sendbtn').style.display = d ? 'block' : 'none';
            localStorageSet('sendbtn', d);
        },
        init: () => {
            if (localStorageGet('sendbtn') == 'true') {
                $('#sendbtn').style.display = 'block';
                $('#show-sendbtn').checked = true;
            }
        }
    },
    {
        id: 'parse-latex',
        onchange: ['self', (e) => {
            // console.log(e);
            if (!!e.target.checked) {
                md.inline.ruler.enable(['katex']);
                md.block.ruler.enable(['katex']);
            } else {
                md.inline.ruler.disable(['katex']);
                md.block.ruler.disable(['katex']);
            }
        }],
        init: (e) => {
            if (!e) {
                md.inline.ruler.disable(['katex']);
                md.block.ruler.disable(['katex']);
            } else
                window.latex_sw = true
        }
    },
    {
        id: 'joined-left',
        onchange: ['self', (e) => window.join_sw = !!e.target.checked],
        check: true,
        init: () => window.join_sw = true
    },
    {
        id: 'show-head',
        onchange: ['self', (e) => window.head_sw = !!e.target.checked],
        check: true,
        init: () => window.head_sw = true
    },
    {
        id: 'allow-imgur',
        onchange: ['self', (e) => window.img_sw = !!e.target.checked],
        check: true,
        init: () => window.img_sw = true
    },
    {
        id: 'fun-system',
        onchange: ['self', (e) => window.funsys_sw = !!e.target.checked],
        check: true,
        init: () => window.funsys_sw = true
    },
    {
        id: 'rainbow-nick',
        onchange: ['self', (e) => window.rainbow_sw = !!e.target.checked],
        check: true,
        init: () => window.rainbow_sw = true
    },
    {
        id: 'allow-html',
        onchange: ['self', (e) => window.html_sw = !!e.target.checked],
        check: true,
        init: () => window.html_sw = true
    },
    {
        id: 'allow-audio',
        onchange: ['self', (e) => window.audio_sw = !!e.target.checked],
        init: () => window.audio_sw = true
    }
];
init_checkboxs.forEach(e => {
    let res = localStorageGet(e.id) == 'true';
    //console.log(e.id);
    // console.log(res);

    $('#' + e.id).checked = res;
    if (typeof e.init == 'function') {
        if (e.check != undefined) {
            if (typeof e.check == 'boolean' && e.check == res)
                e.init();
            if (typeof e.check == 'function' && e.check())
                e.init();
        }
        else e.init(res);
    }
    if (e.onchange == 'self') {
        $('#' + e.id).onchange = (j) => {
            localStorageSet(e.id, !!j.target.checked);
            // console.log('onchage');
        }
    } else if (e.onchange.constructor == Array && e.onchange[0] == 'self') {
        $('#' + e.id).onchange = (j) => {
            localStorageSet(e.id, !!j.target.checked);
            e.onchange[1](j);
        }
    }
    else $('#' + e.id).onchange = e.onchange;
});
if (localStorageGet('init') != 'true') {
    localStorageSet('init', 'true');
    var default_opens = [
        'joined-left',
        'parse-latex',
        'syntax-highlight',
        'show-head',
        'allow-imgur',
        'fun-system'
    ];
    if (isMobile()) {
        default_opens.push('show-sendbtn');
    }
    default_opens.forEach(e => {
        let t = $('#' + e);
        t.checked = true;
        t.onchange({
            id: e, target: {
                checked: true
            }
        })
    })
}
//--------------------------------------------------------------------------------------------------------------
function userRemove(nick) {
    var users = $('#users');
    var children = users.children;

    for (var i = 0; i < children.length; i++) {
        var user = children[i];

        if (user.firstChild.textContent == nick) {
            users.removeChild(user);
        }
    }

    var index = onlineUsers.indexOf(nick);

    if (index >= 0) {
        onlineUsers.splice(index, 1);
    }
}

function userChange(nick, text) {
    var users = $('#users');
    var children = users.children;

    for (var i = 0; i < children.length; i++) {
        var user = children[i];

        if (user.firstChild.textContent == nick) {
            user.firstChild.innerText = text
            user.firstChild.onclick = function (e) {
                userInvite(text)
            }
            user.firstChild.oncontextmenu = function (e) {
                e.preventDefault();
                userModAction(text)
            }
        }
    }

    var index = onlineUsers.indexOf(nick);

    if (index >= 0) {
        onlineUsers[index] = text;
    }
}

function usersClear() {
    var users = $('#users');

    while (users.firstChild) {
        users.removeChild(users.firstChild);
    }

    onlineUsers.length = 0;
}

function userInvite(nick) {
    send({ cmd: 'invite', nick: nick });
}

function userModAction(nick) {
    if (modCmd === null) {	//如果未设置
        return pushInfo('您尚未设置管理员操作');
    }

    let toSend = modCmd;
    toSend.nick = nick;

    send(toSend);
}

function userIgnore(nick) {
    ignoredUsers.push(nick);
}

function getChatLevel(args) {
    /* 
       primary 0
       trust 1
       roomop 2
       mod 3
       admin 4
       bot 5
    */
    // console.log(args);
    let res = 0;
    if (args.isBot)  // 机器人标识
        res = 5;

    if (args.admin)  // 站长标识
        res += 4;
    else if (args.mod)  // 管理员标识
        res += 3;
    else if (args.channelOwner)  // 房主标识
        res += 2;
    else if (args.trusted)  // 信任用户标识
        res += 1;

    return res;
}
function getClassFormLevel(e) {
    let res = '';
    if (e - 5 > -1) {
        e = e - 5;
    }
    switch (e) {
        case 0://primary
            res = 'primary';
            break;
        case 1://trust
            res = 'trust';
            break;
        case 2://roomop
            res = 'roomop';
            break;
        case 3://mod
            res = 'mod';
            break;
        case 4://admin
            res = 'admin';
            break;

    }
    return res;
}
function invertColor(bgColor) {
    // 将背景颜色转换为RGB表示形式
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(bgColor);
    const bgR = parseInt(rgb[1], 16);
    const bgG = parseInt(rgb[2], 16);
    const bgB = parseInt(rgb[3], 16);

    // 计算亮度
    const brightness = (bgR * 299 + bgG * 587 + bgB * 114) / 1000;

    // 根据亮度选择黑色或白色作为反色
    const invertedColor = brightness > 128 ? '#000000' : '#ffffff';

    return invertedColor;
}
window.captchaCallback = token => {
    // 验证码回调函数
    $('#captcha').remove();   // 删除验证码元素，防止后面验证码自动重置导致页面自动滚动（新XChat开发时的经验）
    pushWarn('已确认你是人，正在加入频道，请稍等片刻...')
    if (!window.joinPayload) return pushWarn('发生未知错误：找不到存档的join包\n请尝试刷新网页，如果此问题重复出现，请联系~~大傻逼~~开发者')
    window.joinPayload.captcha = token;    // 追加验证码token
    send(window.joinPayload);
}
function pushCaptcha(sitekey) {
    const centerDiv = document.createElement('div');
    centerDiv.id = 'captcha';
    centerDiv.className = 'center captcha';
    hcaptcha.render(centerDiv, {
        sitekey,
        theme: 'dark',
        callback: 'captchaCallback',
    });
    var atBottom = isAtBottom();
    $('#messages').appendChild(centerDiv);
    if (atBottom) {
        window.scrollTo(0, document.body.scrollHeight);
    }
}
function pushHtml(html) {
    const centerDiv = document.createElement('div');
    centerDiv.className = 'center';
    centerDiv.innerHTML = html;
    var atBottom = isAtBottom();
    // console.log(html, atBottom);
    $('#messages').appendChild(centerDiv);
    // console.log(document.body.scrollHeight);
    if (atBottom) {
        window.scrollTo(0, document.body.scrollHeight);
    }
}
function pushMessage(me, head, nick, trip, text, _level, style, color = '#ffffff', html = false) {

    const chatSender = document.createElement("div");
    if (_level.id) {
        chatSender.id = '_' + _level.id;
    }
    let level = getChatLevel(_level);
    let temp_add = [];
    chatSender.className = !me ? "chat-sender" : "chat-receiver";
    const imgDiv = document.createElement("div");
    imgDiv.className = "img";
    const img = document.createElement("img");
    img.className = 'head unselectable';
    img.src = head;

    imgDiv.appendChild(img);
    const handleDiv = document.createElement('div');
    handleDiv.className = 'handle';
    const nickDiv = document.createElement("div");
    nickDiv.className = "nick unselectable";
    const temp_span = [];
    const tripSpan = document.createElement('span');
    tripSpan.className = "trip unselectable";
    tripSpan.textContent = trip;


    //----------------------------------------------------
    const levelSpan = document.createElement('span');
    levelSpan.className = 'block ' + getClassFormLevel(level);
    //----------------------------------------------------
    const spanNick = document.createElement("span");
    spanNick.className = 'block mynick';
    spanNick.style.color = '#' + color;
    spanNick.textContent = nick;

    img.onclick = tripSpan.onclick = spanNick.onclick = function () {
        insertAtCursor(`@${nick} `);
        $('#chatinput').focus();
    }
    spanNick.oncontextmenu = tripSpan.oncontextmenu = img.oncontextmenu = function (e) {
        e.preventDefault();
        var replyText = buildReplyText({ nick, trip: trip || '' }, text)
        replyText += $('#chatinput').value;
        $('#chatinput').value = '';
        insertAtCursor(replyText);
        $('#chatinput').focus();
    };
    chatSender.setAttribute('data-level', level);
    let okDiv = [];
    const botSpan = document.createElement('span');
    const trustSpan = document.createElement('span');
    trustSpan.setAttribute('data-level-nick', 'trust');
    botSpan.setAttribute('data-level-nick', 'Bot');
    levelSpan.setAttribute('data-level-nick', getClassFormLevel(level));

    temp_add.push(levelSpan);
    if (level - 5 >= 0) {
        //nickDiv.appendChild(botSpan);
        temp_add.push(botSpan);

    }
    if (level - 5 == 2 || level == 2) {
        temp_add.push(trustSpan);
    }
    botSpan.className = 'block bot';
    trustSpan.className = 'block trust';

    // nickDiv.appendChild(levelSpan);

    const nickTrip_span = document.createElement('span');
    const emojiDiv = document.createElement('span');
    emojiDiv.className = style;
    temp_span.push(spanNick);
    if (trip != undefined && trip != '') temp_span.push(tripSpan);
    //temp_add.push(nickTrip_span);
    (me ? temp_span : temp_span.reverse()).forEach(e => nickTrip_span.appendChild(e));
    (me ? temp_add : temp_add.reverse()).forEach((i) => emojiDiv.appendChild(i))
    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "bubble";
    bubbleDiv.innerHTML = html ? text : md.render(text);
    if (html) {
        bubbleDiv.className = '';
        bubbleDiv.style.margin = '5px';
    }
    okDiv.push(emojiDiv);
    okDiv.push(nickTrip_span);
    (me ? okDiv : okDiv.reverse()).forEach(e => nickDiv.appendChild(e));
    handleDiv.appendChild(nickDiv);
    handleDiv.appendChild(bubbleDiv);

    //---------------------------------------------------------
    chatSender.appendChild(imgDiv);
    chatSender.appendChild(handleDiv);
    var atBottom = isAtBottom();
    // console.log('pushmessage','isAtBottom',atBottom);
    $("#messages").appendChild(chatSender);
    if (atBottom) {
        window.scrollTo(0, document.body.scrollHeight);
    }
    unread += 1;
    updateTitle();
}
function pushInfo(text) {
    pushNotice(text, 'info');
}
function pushWarn(text) {
    pushNotice(text, 'warn');
}
function pushPrimary(text) {
    pushNotice(text, 'primary');

}

function pushNotice(text, cls, trip = '*') {
    const chatNotice = document.createElement("div");
    chatNotice.className = "chat-notice";

    const spanNotice = document.createElement("span");
    spanNotice.classList.add("notice_back_color");
    // spanNotice.classList.add("notice_font");
    spanNotice.classList.add(cls);
    spanNotice.innerHTML = md.render(text);
    spanNotice.oncontextmenu = function (e) {
        e.preventDefault();
        var replyText = buildReplyText({ nick: '*', trip: '' }, text)
        replyText += $('#chatinput').value;
        $('#chatinput').value = '';
        insertAtCursor(replyText);
        $('#chatinput').focus();
    }
    chatNotice.appendChild(spanNotice);
    var atBottom = isAtBottom();
    $("#messages").appendChild(chatNotice);
    if (atBottom) {
        window.scrollTo(0, document.body.scrollHeight);
    }
    unread += 1;
    updateTitle();
}
function pushWelcomeButton(str) {
    const centerDiv = document.createElement('div');
    centerDiv.className = 'center';
    const button = document.createElement('button');
    button.className = 'weui-btn weui-btn_mini weui-wa-hotarea welcome_btn';
    button.textContent = str;
    button.onclick = function () {
        const welcomes = ['hi y' + 'o'.repeat(Math.round(Math.random() * 20)), 'uwu!', '哇，真的是你啊', 'awa!', '来了老弟~']
        var txt = welcomes[Math.round(Math.random() * (welcomes.length - 1))]
        send({ cmd: 'chat', text: txt, head: localStorageGet('head') || '' })
    }
    centerDiv.appendChild(button);
    var atBottom = isAtBottom();
    $('#messages').appendChild(centerDiv);
    if (atBottom) {
        window.scrollTo(0, document.body.scrollHeight);
    }
}
function pushInfoColor(text, color) {
    const chatNotice = document.createElement("div");
    chatNotice.className = "chat-notice";

    const spanNotice = document.createElement("span");
    spanNotice.className = "notice_back_color";
    spanNotice.textContent = text;
    spanNotice.style.background = color;
    chatNotice.appendChild(spanNotice);
    var atBottom = isAtBottom();
    document.querySelector("#messages").appendChild(chatNotice);
    if (atBottom) {
        window.scrollTo(0, document.body.scrollHeight);
    }
}
function clearMessage() {
    $('#messages').innerHTML = '';
}
function buildReplyText(user, text) {
    var replyText = `>`;
    var tooLong = true;
    const textList = text.split('\n');

    if (user.trip) {
        replyText += `[${user.trip}] ${user.nick}：\n`;
    } else {
        replyText += `${user.nick}：\n`;
    }

    for (var i = 0; i < 8; i += 1) {
        if (typeof textList[i] === 'undefined') {
            tooLong = false;
            break;
        }

        replyText += `>${textList[i]}\n`;
    }

    if (i < textList.length && tooLong) {
        replyText += '>……\n\n';
    } else {
        replyText += '\n';
    }

    if (user.nick !== getNick()) {
        replyText += `@${user.nick} `;
    }

    return replyText;
}



/****************************************************** 通知和本地存储 ************************************************************************/
var notifySwitch = document.getElementById("notify-switch");
var notifySetting = localStorageGet("notify-api");
var notifyPermissionExplained = 0; // 1 = 显示已授予的消息，-1 = 显示拒绝的消息
notifySwitch.checked = localStorageGet('notify-api') == 'true';

// 初始通知请求权限
function RequestNotifyPermission() {
    try {
        var notifyPromise = Notification.requestPermission();

        if (notifyPromise) {
            notifyPromise.then(function (result) {
                console.log(`ZhangChat桌面通知权限：${result}`);

                if (result === "granted") {
                    if (notifyPermissionExplained === 0) {
                        pushInfo("已获得桌面通知权限");
                        notifyPermissionExplained = 1;
                    }
                    return false;
                } else {
                    if (notifyPermissionExplained === 0) {
                        pushWarn("桌面通知权限被拒绝，当有人@你时，你将不会收到桌面通知");
                        notifyPermissionExplained = -1;
                    }
                    return true;
                }
            });
        }
    } catch (error) {
        pushWarn("无法创建桌面通知");
        console.error("无法创建桌面通知，该浏览器可能不支持桌面通知，错误信息：\n");
        console.error(error);
        return false;
    }
}

// 更新本地储存的复选框值
notifySwitch.addEventListener('change', (event) => {
    if (event.target.checked) {
        RequestNotifyPermission();
    }
    localStorageSet("notify-api", notifySwitch.checked);
})

// 检查是否设置了本地存储，默认为OFF
if (notifySetting === null) {
    localStorageSet("notify-api", "false")
    notifySwitch.checked = false;
}

// 配置通知开关复选框元素
if (notifySetting === "true" || notifySetting === true) {
    notifySwitch.checked = true;
} else if (notifySetting === "false" || notifySetting === false) {
    notifySwitch.checked = false;
}

/** 提示音和本地存储 **/
var soundSwitch = document.getElementById("sound-switch")
var notifySetting = localStorageGet("notify-sound")

// 更新本地储存的复选框值
soundSwitch.addEventListener('change', (event) => {
    localStorageSet("notify-sound", soundSwitch.checked)
})

// 检查是否设置了本地存储，默认为OFF
if (notifySetting === null) {
    localStorageSet("notify-sound", "false")
    soundSwitch.checked = false
}

// 配置声音开关复选框元素
if (notifySetting === "true" || notifySetting === true) {
    soundSwitch.checked = true
} else if (notifySetting === "false" || notifySetting === false) {
    soundSwitch.checked = false
}

// 在检查是否已授予权限后创建新通知
function spawnNotification(title, body) {
    if (!("Notification" in window)) {
        console.error("浏览器不支持桌面通知");
    } else if (Notification.permission === "granted" || (Notification.permission !== "denied" && RequestNotifyPermission())) { // 检查是否已授予通知权限
        var options = { body: body, /* icon: "/favicon-96x96.png" */ /* 图标没做好，也不能用XC的图标 */ };
        var n = new Notification(title, options);
    }
}

function notify(args) {
    // 生成通知（如果已启用）
    if (notifySwitch.checked) {
        spawnNotification(`?${myChannel} - ${args.nick}`, args.text)
    }

    // 播放声音（如果已启用）
    if (soundSwitch.checked) {
        var soundPromise = document.getElementById("notify-sound").play();

        if (soundPromise) {
            soundPromise.catch(function (error) {
                console.error(`播放提示音错误：${error}`);
            });
        }
    }
}

/********************************************************************************************************************* */



/****************************** WebSocket ******************************************/
var ws;
var myNick = localStorageGet('my-nick') || '';

const getNick = () => myNick.split('#')[0];
var _nick = '';
var myChannel = decodeURI(window.location.search.replace(/^\?/, ''));
var maxConnect = 5;
var nowConnect = 0;
var wsConnect = false;
function send(data) {
    if (ws && ws.readyState === ws.OPEN) {
        if ($('#rainbow-nick').checked && data['cmd'] == 'chat') {
            ws.send(JSON.stringify({ cmd: 'changecolor', color: `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")}` }));
        };

        ws.send(JSON.stringify(data));
    }
}
function promptLogin(nick) {
    let j = '';
    new Promise((resolve, reject) => {
        createCustomPrompt('请输入呢称', '呢称', (e, t) => {
            if (e) resolve(t);
            else resolve(false);
        }, nick);
    }).then(e => {
        if (!e) return
    })
}
function join(channel) {

    const url = 'wss://chat.zhangsoft.link/ws';
    ws = new WebSocket(url);

    var wasConnected = false;

    ws.onopen = async function () {
        var shouldConnect = true;

        if (!wasConnected) {
            if (location.hash) {
                myNick = location.hash.substr(1);
            } else {
                //debugger;
                var newNick = localStorageGet('my-nick') || '';
                if (!window.autoLogin || newNick == undefined)
                    newNick = await new Promise((t, f) => {
                        createCustomPrompt('请输入呢称', '呢称', (e, str) => {
                            if (e) {
                                t(str);
                            } else t('');
                        }, myNick);
                    });

                if (newNick !== null && newNick !== '') {
                    myNick = newNick;
                } else { // 用户以某种方式取消了提示
                    shouldConnect = false;
                    wsConnect = false;
                    wasConnected = false;
                    ws.close();
                    pushWarn('你取消了加入。在输入框上按回车可以重新加入。');
                }
            }
        }

        if (myNick && shouldConnect) {
            localStorageSet('my-nick', myNick);
            _nick = getNick();
            //await getMurmur();
            // console.log(`murmur is: ${myMurmur}`)
            //var sendMurmur = encode(myMurmur)
            window.joinPayload = { cmd: 'join', channel: channel, nick: myNick, client: 'Dr0IMClient' }
            send(window.joinPayload);
            wasConnected = true;
            wsConnect = true;
        }


    }

    ws.onclose = function () {
        wsConnect = false;
        if (nowConnect > maxConnect) {
            pushWarn('连接到服务器失败。如果你想重连，在输入框上按回车即可。');
            return;
        } else nowConnect++;
        if (wasConnected) {
            pushWarn("哎呀，掉线了，正在重新连接...");
        } else return;

        window.setTimeout(function () {
            join(channel);
        }, 1800);

    }

    ws.onmessage = function (message) {
        var args = JSON.parse(message.data);
        var cmd = args.cmd;
        var command = COMMANDS[cmd];
        // console.log(args)
        command.call(null, args);
    }
}
function getHead(head) {
    let h = (head == 'imgs/head.png' ? 'css/img/head.png' : head);
    if (!window.head_sw)
        h = 'css/img/head.png';
    return h;
}
function pushChat(args) {
    pushMessage(args.nick == _nick, getHead(args.head),
        args.nick, args.trip, args.text, args, currentPrefix, args.color);
    // console.log(args);
}
$('#set-video').onclick = function () {
    createCustomPrompt('请输入视频文件地址', '(留空则清除公共视频)', (e, t) => {
        if (!e) {
            return pushWarn('您取消了设置视频');
        }

        send({ cmd: 'set-video', url: t || 'nothing' })
    });
}
$('#get-video').onclick = function () {
    send({ cmd: 'get-video' });
}
var COMMANDS = {
    chat: function (args) {
        if (ignoredUsers.indexOf(args.nick) >= 0) {
            return;
        }
        pushChat(args);

    },

    info: (e) => pushInfo(e.text),
    warn: (e) => pushWarn(e.text),

    onlineSet: function (args) {
        var users = args.users;
        usersClear();
        users.forEach(function (user) {
            userAdd(user.nick, user.trip);
        });
        pushInfo(`在线用户：${args.nicks.join(", ")}`)
        window.scrollTo(0, document.body.scrollHeight);

        if (window.funsys_sw) {
            pushWelcomeButton('打个招呼');
        }
    },

    onlineAdd: function (args) {
        var nick = args.nick;
        userAdd(nick, args.trip);

        if (window.join_sw) {
            if (!window.funsys_sw) {
                var joinNotice = `${nick} 加入了聊天室`
            } else {
                const test = ['活蹦乱跳', '可爱', '美丽', '快乐', '活泼', '美味']
                const test2 = ["误入", "闯入", "跳进", "飞进", "滚进", "掉进"]
                var joinNotice = `${test[Math.round(Math.random() * (test.length - 1))]}的 ${nick} ${test2[Math.round(Math.random() * (test2.length - 1))]}了聊天室`
            }

            joinNotice += args.client ? `\nTA正在使用 ${args.client}` : ''
            joinNotice += args.auth ? `\n系统认证：${args.auth}` : ''
            if (args.trip) {
                joinNotice += `\n识别码：${args.trip}`;
            }

            pushInfo(joinNotice); // 仿Discord

            if (window.funsys_sw) {
                pushWelcomeButton("欢迎一下");
            }
        }
    },

    onlineRemove: function (args) {

        var nick = args.nick;
        userRemove(nick);

        if (window.join_sw) {
            if (!window.funsys_sw) {
                var leaveNotice = `${nick} 离开了聊天室`;
            } else {
                const test = ["跳出", "飞出", "滚出", "掉出", "扭出", "瞬移出"];
                var leaveNotice = `${nick} ${test[Math.round(Math.random() * (test.length - 1))]}了聊天室`;
            }

            pushInfo(leaveNotice); //仿Discord
        }
    },

    'set-video': function (args) {
        pushHtml(`<video width="100%"  controls><source src="${encodeURI(args.url)}"></video>`);
    },

    history: function (args) {
        for (let i of args.history) {
            //push(args.history[i], 'history');
            pushChat(i);
        }
        pushInfo('—— 以上是历史记录 ——');

    },

    changeNick: function (args) {
        if (_nick == args.nick) {
            _nick = args.text;
        }
        userChange(args.nick, args.text);
        pushInfo(`${args.nick} 更名为 ${args.text}`);
    },

    html: args => {
        if (!window.html_sw) {
            return pushWarn(`您收到了一条来自 ${args.nick} 的 HTML信息，但是由于您不允许显示HTML信息，因此我们屏蔽了它`);
        }
        pushMessage(args.nick == getNick(), getHead(args.head), args.nick, args.trip, args.text, args, currentPrefix, args.color, true);

    },
    captcha: args => {

        // 显示验证码
        pushWarn('当前频道认为你不是人，所以请先完成下面的人机验证：')
        pushCaptcha(args.sitekey)
    },
    delmsg: e => {
        let div = $('#_' + e.id);
        let nick = div.querySelector('.mynick').textContent;
        let text = `${nick} 撤回了一条消息`;
        div.innerHTML = '';
        div.className = "chat-notice";
        const spanNotice = document.createElement("span");
        spanNotice.classList.add("notice_back_color");
        // spanNotice.classList.add("notice_font");
        spanNotice.classList.add('info');
        spanNotice.innerHTML = md.render(text);
        spanNotice.oncontextmenu = function (e) {
            e.preventDefault();
            var replyText = buildReplyText({ nick: '*', trip: '' }, text)
            replyText += $('#chatinput').value;
            $('#chatinput').value = '';
            insertAtCursor(replyText);
            $('#chatinput').focus();
        }
        div.appendChild(spanNotice);
    }
}
/***********************************************************************************/
if (!myChannel) {
    $('#footer').classList.add('hidden');
    $('#sidebar').classList.add('hidden');
    initFrontpage();
} else {
    join(myChannel);
}/*
var s = [
    { admin: true },
    { mod: true },
    { channelOwner: true, trusted: true },
    { trusted: true },
    {}
];
for (let i = 0; i < 5 * 2; i++) {

    pushMessage(true, 'img/head.png',
        'Dr0', '114514', '1919810', i < 5 ? { isBot: true, ...s[i] } : i < 5 ? s[i] : s[i - 5], currentPrefix);
    pushMessage(false, 'img/head.png',
        'Dr0', '114514', '1919810', i < 5 ? { isBot: true, ...s[i] } : i < 5 ? s[i] : s[i - 5], currentPrefix);
}*/