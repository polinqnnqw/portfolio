(function(){
var root=document.documentElement,lang="no",t;
function S(k){try{return localStorage.getItem(k)}catch(e){return null}}
function W(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function apply(){document.querySelectorAll("[data-no]").forEach(function(e){e.textContent=e.getAttribute("data-"+lang)});root.lang=lang;document.getElementById("lang").textContent=lang==="no"?"EN":"NO"}
t=S("theme")||(window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");
root.setAttribute("data-theme",t);lang=S("lang")||"no";apply();
document.getElementById("lang").onclick=function(){lang=lang==="no"?"en":"no";W("lang",lang);apply()};
document.getElementById("theme").onclick=function(){t=t==="dark"?"light":"dark";root.setAttribute("data-theme",t);W("theme",t)};
var bs=document.querySelectorAll("#tabs button"),ps=document.querySelectorAll(".panel");
bs.forEach(function(b){b.onclick=function(){var i=+b.getAttribute("data-t");bs.forEach(function(x,j){x.classList.toggle("on",j===i)});ps.forEach(function(p,j){p.hidden=j!==i})}});
})();
