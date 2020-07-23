document.querySelector('a.card-text3').addEventListener('click',function(){
  document.querySelector('.modal-bg').style.display = 'flex';
});

document.querySelector('.close').addEventListener('click',function(){
  document.querySelector('.modal-bg').style.display = 'none';
});

function changeYes(){
  document.querySelector('.yesButton').name = 'click';
}
function changeNo(){
  document.querySelector('.noButton').name = 'click';
}
function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  } else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

function setCaretToPos(input, pos) {
  setSelectionRange(input, pos, pos);
}

function nameModify(){
  document.querySelector('.addName').removeAttribute("readonly");
  var n = document.querySelector('.addName');
  setCaretToPos(n,n.value.length);
}
function emailModify(){
  document.querySelector('.addEmail').removeAttribute("readonly");
  var e = document.querySelector('.addEmail');
  setCaretToPos(e,e.value.length);
}
function phoneModify(){
  document.querySelector('.addPhone').removeAttribute("readonly");
  var p = document.querySelector('.addPhone');
  setCaretToPos(p,p.value.length);
}
function addressModify(){
  document.querySelector('.addAddress').removeAttribute("readonly");
  var a = document.querySelector('.addAddress');
  setCaretToPos(a,a.value.length);
}
function dobModify(){
  document.querySelector('.addDob').removeAttribute("readonly");
  document.querySelector('.addDob').setAttribute('type','date');
  var d = document.querySelector('.addDob');
  setCaretToPos(d,d.value.length);
}
function collegeModify(){
  document.querySelector('.addCollege').removeAttribute("readonly");
  var c = document.querySelector('.addCollege');
  setCaretToPos(c,c.value.length);
}

function submit(){
  document.querySelector('.modal-bg').style.display = 'flex';
}
function addModal(){
  document.querySelector('.modal-bg').style.display = 'flex';
}
function withoutLogin(){
  document.querySelector('.modal-bg').style.display = 'flex';
}

function complete(){
  document.querySelector('.card-text1').name = 'checkedComplete';
}

function forgot(){
  document.querySelector('.modal-bg').style.display = 'flex';
}
function reset(){
  document.querySelector('.modal-bg-1').style.display = 'flex';
}
function dropdown(){
  document.querySelector('.drop-content ul').style.display = 'block';
}
function dropdown2(){
  document.querySelector('.drop-content ul').style.display = 'none';
}
