"use strict";

let checkboxes, checkedDiv, enabledSettings, opacity;

if (document.querySelectorAll(".input_type_checkbox")) {
 
  checkboxes = document.querySelectorAll(".input_type_checkbox");
  checkedDiv = document.getElementsByClassName("checkmark");

   checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      changeOpacity(checkedDiv[checkbox.value - 1], "1");
    }
    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        opacity = "1";
      } else {
        opacity = "0";
      }
      changeOpacity(checkedDiv[checkbox.value - 1], opacity);
    });
  });
}

function changeOpacity(block, data) {
  block.style.opacity = data;
}
