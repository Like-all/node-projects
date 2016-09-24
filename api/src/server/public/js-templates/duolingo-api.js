var style = document.createElement('style');
document.head.appendChild(style);
var sheet = document.styleSheets[0];
sheet.insertRule(".duolingo { text-align: center; }", sheet.cssRules.length);
sheet.insertRule(".duolingo-counter { position: relative; bottom: 43px; left: 29px; text-align: center; }", sheet.cssRules.length);
var langContent = document.createElement('div');
langContent.innerHTML = '{htmlcontent}';
var langBlock = document.getElementById('duolingoBlock');
langBlock.appendChild(langContent);
