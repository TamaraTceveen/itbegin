"use strict";
let link,
  popUpEl,
  popUpElBlock,
  datamap,
  privacy,
  privacyBlock,
  privacyLink,
  form,
  formBlock,
  formLink;
  let token = readCookie("csrftoken");

if (document.getElementById("footerPrivacy")) {
  
  datamap = new Map([
    [
      document.getElementById("footerPrivacy"),
      document.getElementById("footerMyModal"),
    ],
    [
      document.getElementById("formPrivacy"),
      document.getElementById("formMyModal"),
    ],
  ]);
  privacyBlock = document.getElementById("footerPrivacyBlock");
  privacy = document.getElementById("footerPrivacy");
  privacyLink = privacy.getAttribute("data-id");
  formBlock = document.getElementById("formPrivacyBlock");
  form = document.getElementById("formPrivacy");
  formLink = form.getAttribute("data-id");
}

if (
  document.getElementById("newDialog") &&
  document.getElementById("footerPrivacy")
) {
  datamap = new Map([
    [
      document.getElementById("newDialog"),
      document.getElementById("messagesMyModal"),
    ],
    [
      document.getElementById("footerPrivacy"),
      document.getElementById("footerMyModal"),
    ],
    [
      document.getElementById("formPrivacy"),
      document.getElementById("formMyModal"),
    ],
  ]);
}

if (
  document.getElementById("messages") &&
  document.getElementById("footerPrivacy")
) {
  datamap = new Map([
    [
      document.getElementById("messages"),
      document.getElementById("messagesMyModal"),
    ],
    [
      document.getElementById("footerPrivacy"),
      document.getElementById("footerMyModal"),
    ],
    [
      document.getElementById("formPrivacy"),
      document.getElementById("formMyModal"),
    ],
  ]);
}

let dialogs = document.getElementById("messages");

// открываем сообщения внутри профиля
if (dialogs) {
  link = dialogs.getAttribute("data-link");
  dialogs.addEventListener("click", async function () {
    getButtons();
    let dialog = await getButton(link);

    let dialogId = dialog[0].dialog;
    let data = JSON.stringify({
      dialog: dialogId,
      is_read: true,
    });
    postData(link, data, token);
  });
}

let newDialog = document.getElementById("newDialog");
if (newDialog) {
  link = newDialog.getAttribute("data-link");
  newDialog.addEventListener("click", async function () {
    newDialogCreate();
  });
}

let panel = document.getElementsByClassName("panel");

let accountChat = document.getElementById("tab_column");
let blockTwo = document.getElementById("accountOpenChat");

async function gotoBottom(id) {
  var element = document.getElementById(id);
  element.scrollTop = element.scrollHeight - element.clientHeight;
}

datamap.forEach((value, key) => {
  doModal(key, value);
  if (privacy) {
    privacyOpen(privacyLink, privacyBlock);
    privacyOpen(formLink, formBlock);
  }
});

function doModal(anchor, popupbox) {
  let span = popupbox.getElementsByClassName("account__close")[0];

  anchor.addEventListener("click", function (event) {
    popupbox.style.display = "block";
  });

  span.addEventListener("click", function (event) {
    popupbox.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target == popupbox) {
      popupbox.style.display = "none";
    }
  });
}

async function getAsyncData(url) {
  const res = await fetch(url);
  let text = await res.text();
  return text;
}

async function getButton(url) {
  let res = await getAsyncData(url);
  res = JSON.parse(res);
  return res;
}

async function privacyOpen(url, blockForPrivacy) {
  let resP = await getAsyncData(url);
  blockForPrivacy.innerHTML = resP;
}


//Написать сообщение или открыть диалог на странице профиля другого юзера
async function newDialogCreate() {
  
  let mesAuthorName = document.getElementById("mesAuthorName").value;
  let mesAuthorId = document.getElementById("mesAuthorId").value;

  let companion = document.getElementById("companion").textContent;
  let companionId = document.getElementById("companionId").value;
  let companionUserAvatar = document.getElementById("companionUserAvatar").src;

  let urlRedirect = await fetch(link);
  let paramsUrl = urlRedirect.url;
  let dialogId = paramsUrl.split("/");

  dialogId = paramsUrl[paramsUrl.length - 2];

  let input = document.getElementById("id_message");
  let newMessageBlock = document.createElement("ul");
  let inputImg = document.getElementById("registration_send");

  let messages = await getAsyncData(paramsUrl);
  messages = JSON.parse(messages);

  let messagesBlock = document.getElementsByClassName("tabcontent");

  for (let i = messages.length - 1; i >= 0; i--) {
    if (dialogId == messages[i].dialog) {
      messagePrint(messages[i], messagesBlock[0], messages[i].user_avatar);
    }
  }


 // формируется имя юзера, которому хотим написать 
  let companionBlock = document.getElementById("tabCompanion");
  let companionUserAvatarImg = createNewElement('img', 'avatar-messages account__avatar__messages');

  companionUserAvatarImg.src = companionUserAvatar;

  companionBlock.before(companionUserAvatarImg);
  companionBlock.innerHTML = companion;
  companionBlock.addEventListener("click", function () {
    openDialog(event, "dialog");
    gotoBottom("accountOpenChat");
  });
  companionBlock.click();

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      let newMessage = input.value;

      let data = JSON.stringify({
        dialog: dialogId,
        author: mesAuthorId,
        user_name: mesAuthorName,
        message: newMessage,
      });
      postData(paramsUrl, data, token);

      input.parentNode.insertBefore(newMessageBlock, input);
      newMesShow(mesAuthorName, newMessage, newMessageBlock);
      input.value = "";
      gotoBottom("accountOpenChat");
    }
  });

  inputImg.addEventListener("click", function (e) {
    let newMessage = input.value;

    let data = JSON.stringify({
      dialog: dialogId,
      author: mesAuthorId,
      user_name: mesAuthorName,
      message: newMessage,
    });
    postData(paramsUrl, data, token);

    input.parentNode.insertBefore(newMessageBlock, input);
    newMesShow(mesAuthorName, newMessage, newMessageBlock);
    input.value = "";
    gotoBottom("accountOpenChat");
  });
}


// открывает диалоги в профиле пользователя
async function getButtons() {

  let mesAuthorName = document.getElementById("mesAuthorName").value;
  let mesAuthorId = document.getElementById("mesAuthorId").value;

  let btnOne = await getButton(link);
 
  if (btnOne == "[]") {
    let noDialogs = createNewElement("p", "account__nodialogs");
    noDialogs.innerHTML = "Нет ни одного начатого диалога";
    panel[0].innerHTML = "";
    panel[0].appendChild(noDialogs);
  } else {
    let dialogCount = [];

    btnOne.filter(function (item) {
      let i = dialogCount.findIndex((x) => x.dialog == item.dialog);
      if (i <= -1) {
        dialogCount.push(item.dialog);
      }
      return null;
    });

    dialogCount = [...new Set(dialogCount)];

    let getUsers = once(function () {
      for (let i = 0; i < dialogCount.length; i++) {
        let tab = createNewElement("div", "tab", dialogCount[i]);
        let tablinks = createNewElement("button", "tablinks");
        let avatar = createNewElement(
          "img",
          "avatar-messages account__avatar__messages"
        );
        let tabcontent = createNewElement(
          "div",
          "tabcontent account__reply_body",
          dialogCount[i] + "dialog"
        );
        let inputBlock = createNewElement(
          "input",
          "id_message",
          dialogCount[i] + "input",
          "text"
        );
        inputBlock.placeholder = "Сообщение";
        let inputImageBlock = document.createElement("span");
        let inputImage = createNewElement(
          "img",
          "account__img_sent",
          dialogCount[i] + "registration__send"
        );
        inputImage.src = "/static/img/send_24px.png";

        inputImageBlock.appendChild(inputImage);

        if (dialogCount[0]) {
          new Promise((resolve, reject) => {
            resolve((tablinks.id = "defaultOpen"));
          }).then(() => {
            document.getElementById("defaultOpen").click();
          });
        }

        tablinks.setAttribute("data-id", dialogCount[i]);

        accountChat.insertBefore(tab, accountChat.firstChild);

        tab.appendChild(tablinks);

        blockTwo.appendChild(tabcontent);

        for (let j = 0; j < btnOne.length; j++) {
        
          if (btnOne[j].dialog == dialogCount[i]) {
            let authorAvatarSrc = btnOne[j].user_avatar
            let arr1 = btnOne[0].all_members;
            let arr2 = [{ id: mesAuthorId }];
            let opponent = arr1.filter(
              (e) => arr2.findIndex((i) => i.id == e.id) === -1
            );

            tablinks.innerHTML =
              opponent[0].first_name + " " + opponent[0].last_name;
            avatar.src = opponent[0].avatar;
            messagePrint(btnOne[j], tabcontent, authorAvatarSrc);
            tabcontent.appendChild(inputImageBlock);

            new Promise((resolve, reject) => {
              resolve(tabcontent.appendChild(inputBlock));
            }).then(() => {
              gotoBottom("accountOpenChat");
            });
          }
        }
        tablinks.appendChild(avatar);
        once = function () {};
      }
    });
    getUsers();
    let tabcontentFirst = document.getElementsByClassName("tabcontent");
    tabcontentFirst[0].style.display = "block";
    let users = document.getElementsByClassName("tablinks");

    for (const dialog of users) {
      let dialogId = dialog.getAttribute("data-id");
      dialogId += "dialog";

      dialog.addEventListener("click", function () {
        openDialog(event, dialogId);
        gotoBottom("accountOpenChat");
      });
    }
  }

  let inputs = document.getElementsByClassName("id_message");

  let newMessageBlock = document.createElement("ul");

  let inputImgs = document.getElementsByClassName("account__img_sent");

  for (let h = 0; h < inputs.length; h++) {
    let newMessageId = inputs[h].id;
    newMessageId = newMessageId.slice(0, -5);

    inputs[h].addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        let newMessage = inputs[h].value;
        
        let urlPost = "/message/api/dialogs/" + newMessageId + "/";

        let data = JSON.stringify({
          dialog: newMessageId,
          author: mesAuthorId,
          user_name: mesAuthorName,
          message: newMessage,
        });
        postData(urlPost, data, token);

        inputs[h].parentNode.insertBefore(newMessageBlock, inputs[h]);
        newMesShow(mesAuthorName, newMessage, newMessageBlock);
        inputs[h].value = "";
        gotoBottom("accountOpenChat");
      }
    });

    inputImgs[h].addEventListener("click", function (e) {
      let newMessage = inputs[h].value;
      
      let urlPost = "/message/api/dialogs/" + newMessageId + "/";

      let data = JSON.stringify({
        dialog: newMessageId,
        author: mesAuthorId,
        user_name: mesAuthorName,
        message: newMessage,
      });
      postData(urlPost, data, token);

      inputs[h].parentNode.insertBefore(newMessageBlock, inputs[h]);
      newMesShow(mesAuthorName, newMessage, newMessageBlock);
      inputs[h].value = "";
      gotoBottom("accountOpenChat");
    });
  }
}

function createNewElement(block, cssClass, id = null, type = null) {
  let element = document.createElement(block);
  element.className = cssClass;
  if (id !== null) {
    element.id = id;
  }
  if (type !== null) {
    element.type = type;
  }
  return element;
}

async function postData(url = "", data = {}, token) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": token,
    },
    body: data,
  });
  return response;
}

function openDialog(evt, dialogName) {
  // Declare all variables
  var tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  let dialogBlock = document.getElementById(dialogName);

  dialogBlock.style.display = "flex";
  evt.currentTarget.className += " active";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function once(fn, context) {
  var result;

  return function () {
    if (fn) {
      result = fn.apply(context || this, arguments);
      fn = null;
    }

    return result;
  };
}

function newMesShow(author, message, block) {
  let mes = createNewElement("li", "account__message_li");
  let mesNewAuthor = createNewElement("p", "account__message_author");
  let messageNewText = createNewElement("div", "account__message_inline");
  let mesNewDate = createNewElement("p", "account__message_date");
  let currentDate = new Date();
  currentDate =
    ("0" + currentDate.getDate()).slice(-2) +
    "-" +
    ("0" + (currentDate.getMonth() + 1)).slice(-2) +
    "-" +
    currentDate.getFullYear() +
    " " +
    ("0" + currentDate.getHours()).slice(-2) +
    ":" +
    ("0" + currentDate.getMinutes()).slice(-2);

  mesNewAuthor.innerHTML = author;
  messageNewText.innerHTML = message;
  mesNewDate.innerHTML = currentDate;

  mes.appendChild(mesNewAuthor);
  mes.appendChild(messageNewText);
  mes.appendChild(mesNewDate);
  block.appendChild(mes);
}

function messagePrint(mesArray, block, avatarSrc = '') {
  let rightDate = new Date(mesArray.pub_date);
  let dateString =
    ("0" + rightDate.getDate()).slice(-2) +
    "-" +
    ("0" + (rightDate.getMonth() + 1)).slice(-2) +
    "-" +
    rightDate.getFullYear() +
    " " +
    ("0" + rightDate.getHours()).slice(-2) +
    ":" +
    ("0" + rightDate.getMinutes()).slice(-2);
  let mesBlock = createNewElement("div", "account_mes_block");
  let messageText = createNewElement("div", "account__message_inline");
  let mesDate = createNewElement("p", "account__message_date");
  let mesAuthor = createNewElement("p", "account__message_author");
  let mesAvatar = createNewElement('img', "account__message_avatar");
  mesAvatar.src = avatarSrc;
  messageText.innerHTML = mesArray.message;
  mesDate.innerHTML = dateString;

  mesAuthor.innerHTML = mesArray.user_name;
  block.insertBefore(mesBlock, block.firstChild);

  mesBlock.appendChild(mesAvatar);
  mesBlock.appendChild(mesAuthor);
  mesBlock.appendChild(messageText);
  mesBlock.appendChild(mesDate);
}
