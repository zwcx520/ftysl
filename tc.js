(function () {
    const key = "gameNoticeRead";
    if (localStorage.getItem(key)) return;

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.7)';
    overlay.style.zIndex = '99999';
    // 实现垂直水平居中容器
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    const box = document.createElement('div');
    box.style.width = '420px';
    box.style.background = '#1c2230';
    box.style.color = '#ffffff';
    box.style.padding = '24px';
    box.style.borderRadius = '10px';
    box.style.lineHeight = '1.7';

    box.innerHTML = `
<h3>===== 游戏公告 =====</h3>
<p>欢迎游玩MUD风格中式末日生存模拟游戏</p>
<p>游戏名:废土余生录</p>
<p>版本：V1.0</p>
<p>开发者信息:不见桃花不见秋</p>
<p>技术提供:https://bjth.netlfy.app</p>
`;

    const btn = document.createElement('button');
    btn.innerText = "我知道了";
    btn.style.marginTop = "20px";
    btn.style.width = "100%";
    btn.style.padding = "10px";
    btn.style.background = "#3474eb";
    btn.style.border = "none";
    btn.style.color = "#fff";
    btn.style.borderRadius = "4px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "15px";

    btn.onclick = function () {
        overlay.remove();
        localStorage.setItem(key, "ok");
    };

    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
})();
