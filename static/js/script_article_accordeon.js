"use strict";
if (document.getElementById("accordion")) {
  let acc = document.getElementById;

  acc.addEventListener("click", function () {
    this.classList.toggle("active");
    let panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });

  acc.click();
}
