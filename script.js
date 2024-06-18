// 获取按钮元素
const btnSetting = document.getElementById('btnSetting');
const modal = document.getElementById('settingModal');
const btnClose = document.getElementById('btnClose');
const btnCancel = document.getElementById('btnCancel');
const btnConfirm = document.getElementById('btnConfirm');
const btnSend = document.getElementById('btnSend');
const btnTodo = document.getElementById('btnTodo');
const btnCodeblock = document.getElementById('btnCodeblock');
const btnLabel = document.getElementById('btnLabel');
const textarea = document.getElementById("inputContainer");

var dropbtn = document.getElementById('dropbtn');
var dropContent = document.getElementById('dropContent');
var spOpenness = document.getElementById('spOpenness');
var dropbtnIcon = document.getElementById('dropbtnIcon');
var isContentVisible = false;

window.onload = function () {
  textarea.focus();
}

dropbtn.addEventListener('click', function () {
    if (isContentVisible) {
        dropContent.style.display = "none";
        isContentVisible = false;
    } else {
        dropContent.style.display = "block";
        isContentVisible = true;
    }
});

document.addEventListener('click', function (event) {
    var target = event.target;
    if (target !== dropbtn && target !== dropContent && target !== spOpenness && target !== dropbtnIcon) {
        dropContent.style.display = "none";
        isContentVisible = false;
    }
});

var spans = document.querySelectorAll('span');

document.addEventListener('click', function(event) {
  var target = event.target;
  if (target.tagName === 'SPAN') {
    var spanText = target.textContent;
    spOpenness.textContent = spanText;
    spOpenness.dataset.value = target.dataset.value;
  }
});

function showMessageBox(message, type) {
  var msgBox = document.getElementById('msgBox');
  var msgIcon = document.getElementById('msgIcon');
  var msgInfo = document.getElementById('msgInfo');

  if (type == "success") {
    msgIcon.className = "iconfont icon-success-filling";
    msgInfo.textContent = message;
  } else if (type == "error") {
    msgIcon.className = "iconfont icon-fail";
    msgInfo.textContent = message;
  }
  msgBox.style.display = "flex";

  setTimeout(() => {
    msgBox.style.display = "none";
  }, 1500);
}

function insertText(text) {
  var textToInsert = text;

  var startPos = textarea.selectionStart;
  var endPos = textarea.selectionEnd;

  var text = textarea.value;
  var newText = text.substring(0, startPos) + textToInsert + text.substring(endPos);
  textarea.value = newText;

  textarea.selectionStart = startPos + textToInsert.length;
  textarea.selectionEnd = startPos + textToInsert.length;
  textarea.focus();
}

btnTodo.addEventListener('click', function () {
  insertText("- [ ] ");
})

btnLabel.addEventListener('click', function () {
  insertText("#");
})

function insertCodeBlock() {

  // 获取当前光标位置
  var startPos = textarea.selectionStart;
  var endPos = textarea.selectionEnd;

  // 插入代码块格式
  var codeBlock = "```\n\n```";
  var text = textarea.value;
  var newText = text.substring(0, startPos) + codeBlock + text.substring(endPos);
  textarea.value = newText;

  // 重新设置光标位置
  var cursorPos = startPos + codeBlock.indexOf("\n") + 1;
  textarea.selectionStart = cursorPos;
  textarea.selectionEnd = cursorPos;
  textarea.focus();
}

btnCodeblock.addEventListener('click', function () {
  insertCodeBlock();
})

btnSetting.addEventListener('click', function () {
  modal.style.display = 'flex';
  if (localStorage.getItem('domain')) {
    var inputDomain = document.getElementById('domain');
    inputDomain.value = localStorage.getItem('domain');
  }
  if (localStorage.getItem('token')) {
    var inputToken = document.getElementById('token');
    inputToken.value = localStorage.getItem('token');
  }
});

btnClose.addEventListener('click', function () {
  modal.style.display = 'none';
});

btnCancel.addEventListener('click', function () {
  modal.style.display = 'none';
});

btnConfirm.addEventListener('click', function () {
  var domain = document.getElementById('domain').value;
  var token = document.getElementById('token').value;
  if (domain != "" && token != "") {
    localStorage.setItem("domain", domain);
    localStorage.setItem("token", token);
    modal.style.display = 'none';
  } else {
    console.log('请检查域名和Token');
  }
});

function sendData(domain, token, inputContent, openness) {
  var url = domain + "/api/v1/memos";
  var data = {
    "content": inputContent,
    "visibility": openness,
    "resourceIdList": []
  };
  fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(function (response) {
      if (!response.ok) {
        showMessageBox("请设置Url和Token", "error");
        throw new Errow("请求失败：" + response.status);
      }
      showMessageBox("发送成功", "success");
      textarea.value = "";
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (error) {
      console.log("发生错误：" + error.message);
      showMessageBox("请设置Url和Token", "error");
    })
}

btnSend.addEventListener('click', function () {
  var inputContent = document.getElementById('inputContainer').value;
  var openness = spOpenness.dataset.value;
  var domain = localStorage.getItem('domain');
  var token = localStorage.getItem('token');
  if (domain != "" && token != "") {
    sendData(domain, token, inputContent, openness);
  } else {
    console.log('请检查域名和Token');
  }
})

document.addEventListener('keydown', function (event) {
  if (event.ctrlKey && event.key == "Enter") {
    event.preventDefault();
    btnSend.click();
  }
})