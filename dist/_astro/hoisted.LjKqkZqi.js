const Re=document.getElementById("body"),le=document.getElementById("mouse");Re?.addEventListener("mousemove",e=>{const r=[e.clientX,e.clientY];le.style.left=r[0]-25+"px",le.style.top=r[1]-25+"px"});document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelectorAll("nav a"),r=document.getElementById("navbar"),n=[{name:"home",element:document.getElementById("home")},{name:"about",element:document.getElementById("about")},{name:"projects",element:document.getElementById("projects")},{name:"contact",element:document.getElementById("contact")}];window.addEventListener("load",()=>{e.forEach(a=>{a.children[1].classList.add("name-off")})}),window.addEventListener("scroll",()=>{let a="",t=0,o=0;n.map(u=>{t=u.element.offsetTop-r.offsetHeight,o=t+u.element.offsetHeight,window.scrollY>=t&&window.scrollY<o&&(a=u.name)}),e.forEach(u=>{u.classList.remove("active"),u.children[1]&&u.children[1].classList.remove("name-off"),u.getAttribute("href").substring(1)===a&&(u.getAttribute("href").substring(1)==="home"?u.children[1].classList.add("name-off"):u.classList.add("active"))})})});var we={update:null,begin:null,loopBegin:null,changeBegin:null,change:null,changeComplete:null,loopComplete:null,complete:null,loop:1,direction:"normal",autoplay:!0,timelineOffset:0},J={duration:1e3,delay:0,endDelay:0,easing:"easeOutElastic(1, .5)",round:0},qe=["translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective","matrix","matrix3d"],q={CSS:{},springs:{}};function L(e,r,n){return Math.min(Math.max(e,r),n)}function z(e,r){return e.indexOf(r)>-1}function Y(e,r){return e.apply(null,r)}var f={arr:function(e){return Array.isArray(e)},obj:function(e){return z(Object.prototype.toString.call(e),"Object")},pth:function(e){return f.obj(e)&&e.hasOwnProperty("totalLength")},svg:function(e){return e instanceof SVGElement},inp:function(e){return e instanceof HTMLInputElement},dom:function(e){return e.nodeType||f.svg(e)},str:function(e){return typeof e=="string"},fnc:function(e){return typeof e=="function"},und:function(e){return typeof e>"u"},nil:function(e){return f.und(e)||e===null},hex:function(e){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(e)},rgb:function(e){return/^rgb/.test(e)},hsl:function(e){return/^hsl/.test(e)},col:function(e){return f.hex(e)||f.rgb(e)||f.hsl(e)},key:function(e){return!we.hasOwnProperty(e)&&!J.hasOwnProperty(e)&&e!=="targets"&&e!=="keyframes"}};function Me(e){var r=/\(([^)]+)\)/.exec(e);return r?r[1].split(",").map(function(n){return parseFloat(n)}):[]}function Ee(e,r){var n=Me(e),a=L(f.und(n[0])?1:n[0],.1,100),t=L(f.und(n[1])?100:n[1],.1,100),o=L(f.und(n[2])?10:n[2],.1,100),u=L(f.und(n[3])?0:n[3],.1,100),s=Math.sqrt(t/a),i=o/(2*Math.sqrt(t*a)),m=i<1?s*Math.sqrt(1-i*i):0,c=1,l=i<1?(i*s+-u)/m:-u+s;function h(y){var v=r?r*y/1e3:y;return i<1?v=Math.exp(-v*i*s)*(c*Math.cos(m*v)+l*Math.sin(m*v)):v=(c+l*v)*Math.exp(-v*s),y===0||y===1?y:1-v}function E(){var y=q.springs[e];if(y)return y;for(var v=1/6,b=0,w=0;;)if(b+=v,h(b)===1){if(w++,w>=16)break}else w=0;var g=b*v*1e3;return q.springs[e]=g,g}return r?h:E}function Ue(e){return e===void 0&&(e=10),function(r){return Math.ceil(L(r,1e-6,1)*e)*(1/e)}}var We=function(){var e=11,r=1/(e-1);function n(c,l){return 1-3*l+3*c}function a(c,l){return 3*l-6*c}function t(c){return 3*c}function o(c,l,h){return((n(l,h)*c+a(l,h))*c+t(l))*c}function u(c,l,h){return 3*n(l,h)*c*c+2*a(l,h)*c+t(l)}function s(c,l,h,E,y){var v,b,w=0;do b=l+(h-l)/2,v=o(b,E,y)-c,v>0?h=b:l=b;while(Math.abs(v)>1e-7&&++w<10);return b}function i(c,l,h,E){for(var y=0;y<4;++y){var v=u(l,h,E);if(v===0)return l;var b=o(l,h,E)-c;l-=b/v}return l}function m(c,l,h,E){if(!(0<=c&&c<=1&&0<=h&&h<=1))return;var y=new Float32Array(e);if(c!==l||h!==E)for(var v=0;v<e;++v)y[v]=o(v*r,c,h);function b(w){for(var g=0,d=1,I=e-1;d!==I&&y[d]<=w;++d)g+=r;--d;var D=(w-y[d])/(y[d+1]-y[d]),x=g+D*r,O=u(x,c,h);return O>=.001?i(w,x,c,h):O===0?x:s(w,g,g+r,c,h)}return function(w){return c===l&&h===E||w===0||w===1?w:o(b(w),l,E)}}return m}(),Ie=function(){var e={linear:function(){return function(a){return a}}},r={Sine:function(){return function(a){return 1-Math.cos(a*Math.PI/2)}},Expo:function(){return function(a){return a?Math.pow(2,10*a-10):0}},Circ:function(){return function(a){return 1-Math.sqrt(1-a*a)}},Back:function(){return function(a){return a*a*(3*a-2)}},Bounce:function(){return function(a){for(var t,o=4;a<((t=Math.pow(2,--o))-1)/11;);return 1/Math.pow(4,3-o)-7.5625*Math.pow((t*3-2)/22-a,2)}},Elastic:function(a,t){a===void 0&&(a=1),t===void 0&&(t=.5);var o=L(a,1,10),u=L(t,.1,2);return function(s){return s===0||s===1?s:-o*Math.pow(2,10*(s-1))*Math.sin((s-1-u/(Math.PI*2)*Math.asin(1/o))*(Math.PI*2)/u)}}},n=["Quad","Cubic","Quart","Quint"];return n.forEach(function(a,t){r[a]=function(){return function(o){return Math.pow(o,t+2)}}}),Object.keys(r).forEach(function(a){var t=r[a];e["easeIn"+a]=t,e["easeOut"+a]=function(o,u){return function(s){return 1-t(o,u)(1-s)}},e["easeInOut"+a]=function(o,u){return function(s){return s<.5?t(o,u)(s*2)/2:1-t(o,u)(s*-2+2)/2}},e["easeOutIn"+a]=function(o,u){return function(s){return s<.5?(1-t(o,u)(1-s*2))/2:(t(o,u)(s*2-1)+1)/2}}}),e}();function G(e,r){if(f.fnc(e))return e;var n=e.split("(")[0],a=Ie[n],t=Me(e);switch(n){case"spring":return Ee(e,r);case"cubicBezier":return Y(We,t);case"steps":return Y(Ue,t);default:return Y(a,t)}}function Te(e){try{var r=document.querySelectorAll(e);return r}catch{return}}function U(e,r){for(var n=e.length,a=arguments.length>=2?arguments[1]:void 0,t=[],o=0;o<n;o++)if(o in e){var u=e[o];r.call(a,u,o,e)&&t.push(u)}return t}function W(e){return e.reduce(function(r,n){return r.concat(f.arr(n)?W(n):n)},[])}function ve(e){return f.arr(e)?e:(f.str(e)&&(e=Te(e)||e),e instanceof NodeList||e instanceof HTMLCollection?[].slice.call(e):[e])}function X(e,r){return e.some(function(n){return n===r})}function ee(e){var r={};for(var n in e)r[n]=e[n];return r}function K(e,r){var n=ee(e);for(var a in e)n[a]=r.hasOwnProperty(a)?r[a]:e[a];return n}function Q(e,r){var n=ee(e);for(var a in r)n[a]=f.und(e[a])?r[a]:e[a];return n}function Qe(e){var r=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e);return r?"rgba("+r[1]+",1)":e}function Ne(e){var r=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,n=e.replace(r,function(s,i,m,c){return i+i+m+m+c+c}),a=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(n),t=parseInt(a[1],16),o=parseInt(a[2],16),u=parseInt(a[3],16);return"rgba("+t+","+o+","+u+",1)"}function Ze(e){var r=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(e)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(e),n=parseInt(r[1],10)/360,a=parseInt(r[2],10)/100,t=parseInt(r[3],10)/100,o=r[4]||1;function u(h,E,y){return y<0&&(y+=1),y>1&&(y-=1),y<1/6?h+(E-h)*6*y:y<1/2?E:y<2/3?h+(E-h)*(2/3-y)*6:h}var s,i,m;if(a==0)s=i=m=t;else{var c=t<.5?t*(1+a):t+a-t*a,l=2*t-c;s=u(l,c,n+1/3),i=u(l,c,n),m=u(l,c,n-1/3)}return"rgba("+s*255+","+i*255+","+m*255+","+o+")"}function $e(e){if(f.rgb(e))return Qe(e);if(f.hex(e))return Ne(e);if(f.hsl(e))return Ze(e)}function B(e){var r=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(e);if(r)return r[1]}function Ye(e){if(z(e,"translate")||e==="perspective")return"px";if(z(e,"rotate")||z(e,"skew"))return"deg"}function _(e,r){return f.fnc(e)?e(r.target,r.id,r.total):e}function C(e,r){return e.getAttribute(r)}function re(e,r,n){var a=B(r);if(X([n,"deg","rad","turn"],a))return r;var t=q.CSS[r+n];if(!f.und(t))return t;var o=100,u=document.createElement(e.tagName),s=e.parentNode&&e.parentNode!==document?e.parentNode:document.body;s.appendChild(u),u.style.position="absolute",u.style.width=o+n;var i=o/u.offsetWidth;s.removeChild(u);var m=i*parseFloat(r);return q.CSS[r+n]=m,m}function Pe(e,r,n){if(r in e.style){var a=r.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),t=e.style[r]||getComputedStyle(e).getPropertyValue(a)||"0";return n?re(e,t,n):t}}function ne(e,r){if(f.dom(e)&&!f.inp(e)&&(!f.nil(C(e,r))||f.svg(e)&&e[r]))return"attribute";if(f.dom(e)&&X(qe,r))return"transform";if(f.dom(e)&&r!=="transform"&&Pe(e,r))return"css";if(e[r]!=null)return"object"}function Le(e){if(f.dom(e)){for(var r=e.style.transform||"",n=/(\w+)\(([^)]*)\)/g,a=new Map,t;t=n.exec(r);)a.set(t[1],t[2]);return a}}function Ke(e,r,n,a){var t=z(r,"scale")?1:0+Ye(r),o=Le(e).get(r)||t;return n&&(n.transforms.list.set(r,o),n.transforms.last=r),a?re(e,o,a):o}function te(e,r,n,a){switch(ne(e,r)){case"transform":return Ke(e,r,a,n);case"css":return Pe(e,r,n);case"attribute":return C(e,r);default:return e[r]||0}}function ae(e,r){var n=/^(\*=|\+=|-=)/.exec(e);if(!n)return e;var a=B(e)||0,t=parseFloat(r),o=parseFloat(e.replace(n[0],""));switch(n[0][0]){case"+":return t+o+a;case"-":return t-o+a;case"*":return t*o+a}}function Ce(e,r){if(f.col(e))return $e(e);if(/\s/g.test(e))return e;var n=B(e),a=n?e.substr(0,e.length-n.length):e;return r?a+r:a}function ie(e,r){return Math.sqrt(Math.pow(r.x-e.x,2)+Math.pow(r.y-e.y,2))}function _e(e){return Math.PI*2*C(e,"r")}function Je(e){return C(e,"width")*2+C(e,"height")*2}function Ge(e){return ie({x:C(e,"x1"),y:C(e,"y1")},{x:C(e,"x2"),y:C(e,"y2")})}function Be(e){for(var r=e.points,n=0,a,t=0;t<r.numberOfItems;t++){var o=r.getItem(t);t>0&&(n+=ie(a,o)),a=o}return n}function Xe(e){var r=e.points;return Be(e)+ie(r.getItem(r.numberOfItems-1),r.getItem(0))}function De(e){if(e.getTotalLength)return e.getTotalLength();switch(e.tagName.toLowerCase()){case"circle":return _e(e);case"rect":return Je(e);case"line":return Ge(e);case"polyline":return Be(e);case"polygon":return Xe(e)}}function er(e){var r=De(e);return e.setAttribute("stroke-dasharray",r),r}function rr(e){for(var r=e.parentNode;f.svg(r)&&f.svg(r.parentNode);)r=r.parentNode;return r}function Oe(e,r){var n=r||{},a=n.el||rr(e),t=a.getBoundingClientRect(),o=C(a,"viewBox"),u=t.width,s=t.height,i=n.viewBox||(o?o.split(" "):[0,0,u,s]);return{el:a,viewBox:i,x:i[0]/1,y:i[1]/1,w:u,h:s,vW:i[2],vH:i[3]}}function nr(e,r){var n=f.str(e)?Te(e)[0]:e,a=r||100;return function(t){return{property:t,el:n,svg:Oe(n),totalLength:De(n)*(a/100)}}}function tr(e,r,n){function a(c){c===void 0&&(c=0);var l=r+c>=1?r+c:0;return e.el.getPointAtLength(l)}var t=Oe(e.el,e.svg),o=a(),u=a(-1),s=a(1),i=n?1:t.w/t.vW,m=n?1:t.h/t.vH;switch(e.property){case"x":return(o.x-t.x)*i;case"y":return(o.y-t.y)*m;case"angle":return Math.atan2(s.y-u.y,s.x-u.x)*180/Math.PI}}function de(e,r){var n=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,a=Ce(f.pth(e)?e.totalLength:e,r)+"";return{original:a,numbers:a.match(n)?a.match(n).map(Number):[0],strings:f.str(e)||r?a.split(n):[]}}function oe(e){var r=e?W(f.arr(e)?e.map(ve):ve(e)):[];return U(r,function(n,a,t){return t.indexOf(n)===a})}function Se(e){var r=oe(e);return r.map(function(n,a){return{target:n,id:a,total:r.length,transforms:{list:Le(n)}}})}function ar(e,r){var n=ee(r);if(/^spring/.test(n.easing)&&(n.duration=Ee(n.easing)),f.arr(e)){var a=e.length,t=a===2&&!f.obj(e[0]);t?e={value:e}:f.fnc(r.duration)||(n.duration=r.duration/a)}var o=f.arr(e)?e:[e];return o.map(function(u,s){var i=f.obj(u)&&!f.pth(u)?u:{value:u};return f.und(i.delay)&&(i.delay=s?0:r.delay),f.und(i.endDelay)&&(i.endDelay=s===o.length-1?r.endDelay:0),i}).map(function(u){return Q(u,n)})}function ir(e){for(var r=U(W(e.map(function(o){return Object.keys(o)})),function(o){return f.key(o)}).reduce(function(o,u){return o.indexOf(u)<0&&o.push(u),o},[]),n={},a=function(o){var u=r[o];n[u]=e.map(function(s){var i={};for(var m in s)f.key(m)?m==u&&(i.value=s[m]):i[m]=s[m];return i})},t=0;t<r.length;t++)a(t);return n}function or(e,r){var n=[],a=r.keyframes;a&&(r=Q(ir(a),r));for(var t in r)f.key(t)&&n.push({name:t,tweens:ar(r[t],e)});return n}function ur(e,r){var n={};for(var a in e){var t=_(e[a],r);f.arr(t)&&(t=t.map(function(o){return _(o,r)}),t.length===1&&(t=t[0])),n[a]=t}return n.duration=parseFloat(n.duration),n.delay=parseFloat(n.delay),n}function sr(e,r){var n;return e.tweens.map(function(a){var t=ur(a,r),o=t.value,u=f.arr(o)?o[1]:o,s=B(u),i=te(r.target,e.name,s,r),m=n?n.to.original:i,c=f.arr(o)?o[0]:m,l=B(c)||B(i),h=s||l;return f.und(u)&&(u=m),t.from=de(c,h),t.to=de(ae(u,c),h),t.start=n?n.end:0,t.end=t.start+t.delay+t.duration+t.endDelay,t.easing=G(t.easing,t.duration),t.isPath=f.pth(o),t.isPathTargetInsideSVG=t.isPath&&f.svg(r.target),t.isColor=f.col(t.from.original),t.isColor&&(t.round=1),n=t,t})}var Ae={css:function(e,r,n){return e.style[r]=n},attribute:function(e,r,n){return e.setAttribute(r,n)},object:function(e,r,n){return e[r]=n},transform:function(e,r,n,a,t){if(a.list.set(r,n),r===a.last||t){var o="";a.list.forEach(function(u,s){o+=s+"("+u+") "}),e.style.transform=o}}};function ke(e,r){var n=Se(e);n.forEach(function(a){for(var t in r){var o=_(r[t],a),u=a.target,s=B(o),i=te(u,t,s,a),m=s||B(i),c=ae(Ce(o,m),i),l=ne(u,t);Ae[l](u,t,c,a.transforms,!0)}})}function cr(e,r){var n=ne(e.target,r.name);if(n){var a=sr(r,e),t=a[a.length-1];return{type:n,property:r.name,animatable:e,tweens:a,duration:t.end,delay:a[0].delay,endDelay:t.endDelay}}}function fr(e,r){return U(W(e.map(function(n){return r.map(function(a){return cr(n,a)})})),function(n){return!f.und(n)})}function Fe(e,r){var n=e.length,a=function(o){return o.timelineOffset?o.timelineOffset:0},t={};return t.duration=n?Math.max.apply(Math,e.map(function(o){return a(o)+o.duration})):r.duration,t.delay=n?Math.min.apply(Math,e.map(function(o){return a(o)+o.delay})):r.delay,t.endDelay=n?t.duration-Math.max.apply(Math,e.map(function(o){return a(o)+o.duration-o.endDelay})):r.endDelay,t}var ge=0;function lr(e){var r=K(we,e),n=K(J,e),a=or(n,e),t=Se(e.targets),o=fr(t,a),u=Fe(o,n),s=ge;return ge++,Q(r,{id:s,children:[],animatables:t,animations:o,duration:u.duration,delay:u.delay,endDelay:u.endDelay})}var P=[],Ve=function(){var e;function r(){!e&&(!he()||!p.suspendWhenDocumentHidden)&&P.length>0&&(e=requestAnimationFrame(n))}function n(t){for(var o=P.length,u=0;u<o;){var s=P[u];s.paused?(P.splice(u,1),o--):(s.tick(t),u++)}e=u>0?requestAnimationFrame(n):void 0}function a(){p.suspendWhenDocumentHidden&&(he()?e=cancelAnimationFrame(e):(P.forEach(function(t){return t._onDocumentVisibility()}),Ve()))}return typeof document<"u"&&document.addEventListener("visibilitychange",a),r}();function he(){return!!document&&document.hidden}function p(e){e===void 0&&(e={});var r=0,n=0,a=0,t,o=0,u=null;function s(g){var d=window.Promise&&new Promise(function(I){return u=I});return g.finished=d,d}var i=lr(e);s(i);function m(){var g=i.direction;g!=="alternate"&&(i.direction=g!=="normal"?"normal":"reverse"),i.reversed=!i.reversed,t.forEach(function(d){return d.reversed=i.reversed})}function c(g){return i.reversed?i.duration-g:g}function l(){r=0,n=c(i.currentTime)*(1/p.speed)}function h(g,d){d&&d.seek(g-d.timelineOffset)}function E(g){if(i.reversePlayback)for(var I=o;I--;)h(g,t[I]);else for(var d=0;d<o;d++)h(g,t[d])}function y(g){for(var d=0,I=i.animations,D=I.length;d<D;){var x=I[d],O=x.animatable,F=x.tweens,S=F.length-1,M=F[S];S&&(M=U(F,function(ze){return g<ze.end})[0]||M);for(var A=L(g-M.start-M.delay,0,M.duration)/M.duration,R=isNaN(A)?1:M.easing(A),T=M.to.strings,N=M.round,Z=[],He=M.to.numbers.length,k=void 0,V=0;V<He;V++){var j=void 0,ue=M.to.numbers[V],se=M.from.numbers[V]||0;M.isPath?j=tr(M.value,R*ue,M.isPathTargetInsideSVG):j=se+R*(ue-se),N&&(M.isColor&&V>2||(j=Math.round(j*N)/N)),Z.push(j)}var ce=T.length;if(!ce)k=Z[0];else{k=T[0];for(var H=0;H<ce;H++){T[H];var fe=T[H+1],$=Z[H];isNaN($)||(fe?k+=$+fe:k+=$+" ")}}Ae[x.type](O.target,x.property,k,O.transforms),x.currentValue=k,d++}}function v(g){i[g]&&!i.passThrough&&i[g](i)}function b(){i.remaining&&i.remaining!==!0&&i.remaining--}function w(g){var d=i.duration,I=i.delay,D=d-i.endDelay,x=c(g);i.progress=L(x/d*100,0,100),i.reversePlayback=x<i.currentTime,t&&E(x),!i.began&&i.currentTime>0&&(i.began=!0,v("begin")),!i.loopBegan&&i.currentTime>0&&(i.loopBegan=!0,v("loopBegin")),x<=I&&i.currentTime!==0&&y(0),(x>=D&&i.currentTime!==d||!d)&&y(d),x>I&&x<D?(i.changeBegan||(i.changeBegan=!0,i.changeCompleted=!1,v("changeBegin")),v("change"),y(x)):i.changeBegan&&(i.changeCompleted=!0,i.changeBegan=!1,v("changeComplete")),i.currentTime=L(x,0,d),i.began&&v("update"),g>=d&&(n=0,b(),i.remaining?(r=a,v("loopComplete"),i.loopBegan=!1,i.direction==="alternate"&&m()):(i.paused=!0,i.completed||(i.completed=!0,v("loopComplete"),v("complete"),!i.passThrough&&"Promise"in window&&(u(),s(i)))))}return i.reset=function(){var g=i.direction;i.passThrough=!1,i.currentTime=0,i.progress=0,i.paused=!0,i.began=!1,i.loopBegan=!1,i.changeBegan=!1,i.completed=!1,i.changeCompleted=!1,i.reversePlayback=!1,i.reversed=g==="reverse",i.remaining=i.loop,t=i.children,o=t.length;for(var d=o;d--;)i.children[d].reset();(i.reversed&&i.loop!==!0||g==="alternate"&&i.loop===1)&&i.remaining++,y(i.reversed?i.duration:0)},i._onDocumentVisibility=l,i.set=function(g,d){return ke(g,d),i},i.tick=function(g){a=g,r||(r=a),w((a+(n-r))*p.speed)},i.seek=function(g){w(c(g))},i.pause=function(){i.paused=!0,l()},i.play=function(){i.paused&&(i.completed&&i.reset(),i.paused=!1,P.push(i),l(),Ve())},i.reverse=function(){m(),i.completed=!i.reversed,l()},i.restart=function(){i.reset(),i.play()},i.remove=function(g){var d=oe(g);je(d,i)},i.reset(),i.autoplay&&i.play(),i}function me(e,r){for(var n=r.length;n--;)X(e,r[n].animatable.target)&&r.splice(n,1)}function je(e,r){var n=r.animations,a=r.children;me(e,n);for(var t=a.length;t--;){var o=a[t],u=o.animations;me(e,u),!u.length&&!o.children.length&&a.splice(t,1)}!n.length&&!a.length&&r.pause()}function vr(e){for(var r=oe(e),n=P.length;n--;){var a=P[n];je(r,a)}}function dr(e,r){r===void 0&&(r={});var n=r.direction||"normal",a=r.easing?G(r.easing):null,t=r.grid,o=r.axis,u=r.from||0,s=u==="first",i=u==="center",m=u==="last",c=f.arr(e),l=parseFloat(c?e[0]:e),h=c?parseFloat(e[1]):0,E=B(c?e[1]:e)||0,y=r.start||0+(c?l:0),v=[],b=0;return function(w,g,d){if(s&&(u=0),i&&(u=(d-1)/2),m&&(u=d-1),!v.length){for(var I=0;I<d;I++){if(!t)v.push(Math.abs(u-I));else{var D=i?(t[0]-1)/2:u%t[0],x=i?(t[1]-1)/2:Math.floor(u/t[0]),O=I%t[0],F=Math.floor(I/t[0]),S=D-O,M=x-F,A=Math.sqrt(S*S+M*M);o==="x"&&(A=-S),o==="y"&&(A=-M),v.push(A)}b=Math.max.apply(Math,v)}a&&(v=v.map(function(T){return a(T/b)*b})),n==="reverse"&&(v=v.map(function(T){return o?T<0?T*-1:-T:Math.abs(b-T)}))}var R=c?(h-l)/b:l;return y+R*(Math.round(v[g]*100)/100)+E}}function gr(e){e===void 0&&(e={});var r=p(e);return r.duration=0,r.add=function(n,a){var t=P.indexOf(r),o=r.children;t>-1&&P.splice(t,1);function u(h){h.passThrough=!0}for(var s=0;s<o.length;s++)u(o[s]);var i=Q(n,K(J,e));i.targets=i.targets||e.targets;var m=r.duration;i.autoplay=!1,i.direction=r.direction,i.timelineOffset=f.und(a)?m:ae(a,m),u(r),r.seek(i.timelineOffset);var c=p(i);u(c),o.push(c);var l=Fe(o,e);return r.delay=l.delay,r.endDelay=l.endDelay,r.duration=l.duration,r.seek(0),r.reset(),r.autoplay&&r.play(),r},r}p.version="3.2.1";p.speed=1;p.suspendWhenDocumentHidden=!0;p.running=P;p.remove=vr;p.get=te;p.set=ke;p.convertPx=re;p.path=nr;p.setDashoffset=er;p.stagger=dr;p.timeline=gr;p.easing=G;p.penner=Ie;p.random=function(e,r){return Math.floor(Math.random()*(r-e+1))+e};const hr=document.getElementById("home"),ye=document.getElementById("logo"),pe={targets:".logo path",opacity:1,strokeDashoffset:[p.setDashoffset,0],easing:"easeInQuart",duration:5e3,fill:{value:"#C01522",delay:3300,duration:800,easing:"easeInOutSine"}},be={targets:".shadow",opacity:1,easing:"easeInQuart",duration:4e3};let xe=!1;window.innerWidth>700?hr?.addEventListener("mouseenter",e=>{xe||(p(pe),p(be),xe=!0),ye.style.opacity="1"}):(p(pe),p(be),ye.style.opacity="1");const mr=document.querySelectorAll(".copy"),yr=document.querySelectorAll(".tooltip");mr.forEach(e=>{e?.addEventListener("click",()=>{console.log("click"),navigator.clipboard.writeText("freddylyacuri@gmail.com"),yr.forEach(r=>{r.innerHTML="Email copied"}),p({targets:".tooltip",rotate:[-15,20,0],translateY:[-20,0],easing:"easeOutBounce",duration:800})})});