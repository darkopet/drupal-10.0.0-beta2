!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.CKEditor5=t():(e.CKEditor5=e.CKEditor5||{},e.CKEditor5.drupalHtmlEngine=t())}(self,(function(){return(()=>{var e={"ckeditor5/src/core.js":(e,t,r)=>{e.exports=r("dll-reference CKEditor5.dll")("./src/core.js")},"dll-reference CKEditor5.dll":e=>{"use strict";e.exports=CKEditor5.dll}},t={};function r(n){var p=t[n];if(void 0!==p)return p.exports;var s=t[n]={exports:{}};return e[n](s,s.exports,r),s.exports}r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var n={};return(()=>{"use strict";r.d(n,{default:()=>o});var e=r("ckeditor5/src/core.js");class t{constructor(){this.chunks=[],this.selfClosingTags=["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]}build(){return this.chunks.join("")}appendNode(e){e.nodeType===Node.TEXT_NODE?this._appendText(e):e.nodeType===Node.ELEMENT_NODE?this._appendElement(e):e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&this._appendChildren(e)}_appendElement(e){const t=e.nodeName.toLowerCase();this._append("<"),this._append(t),this._appendAttributes(e),this._append(">"),this.selfClosingTags.includes(t)||(this._appendChildren(e),this._append("</"),this._append(t),this._append(">"))}_appendChildren(e){Object.keys(e.childNodes).forEach((t=>{this.appendNode(e.childNodes[t])}))}_appendAttributes(e){Object.keys(e.attributes).forEach((t=>{this._append(" "),this._append(e.attributes[t].name),this._append('="'),this._append(this.constructor._escapeAttribute(e.attributes[t].value)),this._append('"')}))}_appendText(e){const t=document.implementation.createHTMLDocument("").createElement("p");t.textContent=e.textContent,this._append(t.innerHTML)}_append(e){this.chunks.push(e)}static _escapeAttribute(e){return e.replace(/&/g,"&amp;").replace(/'/g,"&apos;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\r\n/g,"&#13;").replace(/[\r\n]/g,"&#13;")}}class p{getHtml(e){const r=new t;return r.appendNode(e),r.build()}}class s extends e.Plugin{init(){this.editor.data.processor.htmlWriter=new p}static get pluginName(){return"DrupalHtmlEngine"}}const o={DrupalHtmlEngine:s}})(),n=n.default})()}));