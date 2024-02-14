const We=document.getElementById("body"),ve=document.getElementById("mouse");We?.addEventListener("mousemove",e=>{const r=[e.clientX,e.clientY];ve.style.left=r[0]-25+"px",ve.style.top=r[1]-25+"px"});document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelectorAll("nav a"),r=document.getElementById("navbar"),t=[{name:"home",element:document.getElementById("home")},{name:"about",element:document.getElementById("about")},{name:"projects",element:document.getElementById("projects")},{name:"contact",element:document.getElementById("contact")}];window.addEventListener("load",()=>{e.forEach(a=>{a.children[1].classList.add("name-off")})}),window.addEventListener("scroll",()=>{let a="",n=0,o=0;t.map(u=>{n=u.element.offsetTop-r.offsetHeight,o=n+u.element.offsetHeight,window.scrollY>=n&&window.scrollY<o&&(a=u.name)}),e.forEach(u=>{u.classList.remove("active"),u.children[1]&&u.children[1].classList.remove("name-off"),u.getAttribute("href").substring(1)===a&&(u.getAttribute("href").substring(1)==="home"?u.children[1].classList.add("name-off"):u.classList.add("active"))})})});var Ee={update:null,begin:null,loopBegin:null,changeBegin:null,change:null,changeComplete:null,loopComplete:null,complete:null,loop:1,direction:"normal",autoplay:!0,timelineOffset:0},X={duration:1e3,delay:0,endDelay:0,easing:"easeOutElastic(1, .5)",round:0},Qe=["translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective","matrix","matrix3d"],R={CSS:{},springs:{}};function C(e,r,t){return Math.min(Math.max(e,r),t)}function z(e,r){return e.indexOf(r)>-1}function Y(e,r){return e.apply(null,r)}var f={arr:function(e){return Array.isArray(e)},obj:function(e){return z(Object.prototype.toString.call(e),"Object")},pth:function(e){return f.obj(e)&&e.hasOwnProperty("totalLength")},svg:function(e){return e instanceof SVGElement},inp:function(e){return e instanceof HTMLInputElement},dom:function(e){return e.nodeType||f.svg(e)},str:function(e){return typeof e=="string"},fnc:function(e){return typeof e=="function"},und:function(e){return typeof e>"u"},nil:function(e){return f.und(e)||e===null},hex:function(e){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(e)},rgb:function(e){return/^rgb/.test(e)},hsl:function(e){return/^hsl/.test(e)},col:function(e){return f.hex(e)||f.rgb(e)||f.hsl(e)},key:function(e){return!Ee.hasOwnProperty(e)&&!X.hasOwnProperty(e)&&e!=="targets"&&e!=="keyframes"}};function Ie(e){var r=/\(([^)]+)\)/.exec(e);return r?r[1].split(",").map(function(t){return parseFloat(t)}):[]}function Te(e,r){var t=Ie(e),a=C(f.und(t[0])?1:t[0],.1,100),n=C(f.und(t[1])?100:t[1],.1,100),o=C(f.und(t[2])?10:t[2],.1,100),u=C(f.und(t[3])?0:t[3],.1,100),s=Math.sqrt(n/a),i=o/(2*Math.sqrt(n*a)),m=i<1?s*Math.sqrt(1-i*i):0,c=1,l=i<1?(i*s+-u)/m:-u+s;function h(y){var d=r?r*y/1e3:y;return i<1?d=Math.exp(-d*i*s)*(c*Math.cos(m*d)+l*Math.sin(m*d)):d=(c+l*d)*Math.exp(-d*s),y===0||y===1?y:1-d}function E(){var y=R.springs[e];if(y)return y;for(var d=1/6,b=0,w=0;;)if(b+=d,h(b)===1){if(w++,w>=16)break}else w=0;var g=b*d*1e3;return R.springs[e]=g,g}return r?h:E}function $e(e){return e===void 0&&(e=10),function(r){return Math.ceil(C(r,1e-6,1)*e)*(1/e)}}var Ne=function(){var e=11,r=1/(e-1);function t(c,l){return 1-3*l+3*c}function a(c,l){return 3*l-6*c}function n(c){return 3*c}function o(c,l,h){return((t(l,h)*c+a(l,h))*c+n(l))*c}function u(c,l,h){return 3*t(l,h)*c*c+2*a(l,h)*c+n(l)}function s(c,l,h,E,y){var d,b,w=0;do b=l+(h-l)/2,d=o(b,E,y)-c,d>0?h=b:l=b;while(Math.abs(d)>1e-7&&++w<10);return b}function i(c,l,h,E){for(var y=0;y<4;++y){var d=u(l,h,E);if(d===0)return l;var b=o(l,h,E)-c;l-=b/d}return l}function m(c,l,h,E){if(!(0<=c&&c<=1&&0<=h&&h<=1))return;var y=new Float32Array(e);if(c!==l||h!==E)for(var d=0;d<e;++d)y[d]=o(d*r,c,h);function b(w){for(var g=0,v=1,I=e-1;v!==I&&y[v]<=w;++v)g+=r;--v;var D=(w-y[v])/(y[v+1]-y[v]),x=g+D*r,S=u(x,c,h);return S>=.001?i(w,x,c,h):S===0?x:s(w,g,g+r,c,h)}return function(w){return c===l&&h===E||w===0||w===1?w:o(b(w),l,E)}}return m}(),Le=function(){var e={linear:function(){return function(a){return a}}},r={Sine:function(){return function(a){return 1-Math.cos(a*Math.PI/2)}},Expo:function(){return function(a){return a?Math.pow(2,10*a-10):0}},Circ:function(){return function(a){return 1-Math.sqrt(1-a*a)}},Back:function(){return function(a){return a*a*(3*a-2)}},Bounce:function(){return function(a){for(var n,o=4;a<((n=Math.pow(2,--o))-1)/11;);return 1/Math.pow(4,3-o)-7.5625*Math.pow((n*3-2)/22-a,2)}},Elastic:function(a,n){a===void 0&&(a=1),n===void 0&&(n=.5);var o=C(a,1,10),u=C(n,.1,2);return function(s){return s===0||s===1?s:-o*Math.pow(2,10*(s-1))*Math.sin((s-1-u/(Math.PI*2)*Math.asin(1/o))*(Math.PI*2)/u)}}},t=["Quad","Cubic","Quart","Quint"];return t.forEach(function(a,n){r[a]=function(){return function(o){return Math.pow(o,n+2)}}}),Object.keys(r).forEach(function(a){var n=r[a];e["easeIn"+a]=n,e["easeOut"+a]=function(o,u){return function(s){return 1-n(o,u)(1-s)}},e["easeInOut"+a]=function(o,u){return function(s){return s<.5?n(o,u)(s*2)/2:1-n(o,u)(s*-2+2)/2}},e["easeOutIn"+a]=function(o,u){return function(s){return s<.5?(1-n(o,u)(1-s*2))/2:(n(o,u)(s*2-1)+1)/2}}}),e}();function ee(e,r){if(f.fnc(e))return e;var t=e.split("(")[0],a=Le[t],n=Ie(e);switch(t){case"spring":return Te(e,r);case"cubicBezier":return Y(Ne,n);case"steps":return Y($e,n);default:return Y(a,n)}}function Ce(e){try{var r=document.querySelectorAll(e);return r}catch{return}}function U(e,r){for(var t=e.length,a=arguments.length>=2?arguments[1]:void 0,n=[],o=0;o<t;o++)if(o in e){var u=e[o];r.call(a,u,o,e)&&n.push(u)}return n}function W(e){return e.reduce(function(r,t){return r.concat(f.arr(t)?W(t):t)},[])}function ge(e){return f.arr(e)?e:(f.str(e)&&(e=Ce(e)||e),e instanceof NodeList||e instanceof HTMLCollection?[].slice.call(e):[e])}function re(e,r){return e.some(function(t){return t===r})}function te(e){var r={};for(var t in e)r[t]=e[t];return r}function K(e,r){var t=te(e);for(var a in e)t[a]=r.hasOwnProperty(a)?r[a]:e[a];return t}function Q(e,r){var t=te(e);for(var a in r)t[a]=f.und(e[a])?r[a]:e[a];return t}function Ze(e){var r=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(e);return r?"rgba("+r[1]+",1)":e}function Ye(e){var r=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,t=e.replace(r,function(s,i,m,c){return i+i+m+m+c+c}),a=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t),n=parseInt(a[1],16),o=parseInt(a[2],16),u=parseInt(a[3],16);return"rgba("+n+","+o+","+u+",1)"}function Je(e){var r=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(e)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(e),t=parseInt(r[1],10)/360,a=parseInt(r[2],10)/100,n=parseInt(r[3],10)/100,o=r[4]||1;function u(h,E,y){return y<0&&(y+=1),y>1&&(y-=1),y<1/6?h+(E-h)*6*y:y<1/2?E:y<2/3?h+(E-h)*(2/3-y)*6:h}var s,i,m;if(a==0)s=i=m=n;else{var c=n<.5?n*(1+a):n+a-n*a,l=2*n-c;s=u(l,c,t+1/3),i=u(l,c,t),m=u(l,c,t-1/3)}return"rgba("+s*255+","+i*255+","+m*255+","+o+")"}function Ke(e){if(f.rgb(e))return Ze(e);if(f.hex(e))return Ye(e);if(f.hsl(e))return Je(e)}function B(e){var r=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(e);if(r)return r[1]}function _e(e){if(z(e,"translate")||e==="perspective")return"px";if(z(e,"rotate")||z(e,"skew"))return"deg"}function _(e,r){return f.fnc(e)?e(r.target,r.id,r.total):e}function P(e,r){return e.getAttribute(r)}function ne(e,r,t){var a=B(r);if(re([t,"deg","rad","turn"],a))return r;var n=R.CSS[r+t];if(!f.und(n))return n;var o=100,u=document.createElement(e.tagName),s=e.parentNode&&e.parentNode!==document?e.parentNode:document.body;s.appendChild(u),u.style.position="absolute",u.style.width=o+t;var i=o/u.offsetWidth;s.removeChild(u);var m=i*parseFloat(r);return R.CSS[r+t]=m,m}function Pe(e,r,t){if(r in e.style){var a=r.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),n=e.style[r]||getComputedStyle(e).getPropertyValue(a)||"0";return t?ne(e,n,t):n}}function ae(e,r){if(f.dom(e)&&!f.inp(e)&&(!f.nil(P(e,r))||f.svg(e)&&e[r]))return"attribute";if(f.dom(e)&&re(Qe,r))return"transform";if(f.dom(e)&&r!=="transform"&&Pe(e,r))return"css";if(e[r]!=null)return"object"}function Be(e){if(f.dom(e)){for(var r=e.style.transform||"",t=/(\w+)\(([^)]*)\)/g,a=new Map,n;n=t.exec(r);)a.set(n[1],n[2]);return a}}function Ge(e,r,t,a){var n=z(r,"scale")?1:0+_e(r),o=Be(e).get(r)||n;return t&&(t.transforms.list.set(r,o),t.transforms.last=r),a?ne(e,o,a):o}function ie(e,r,t,a){switch(ae(e,r)){case"transform":return Ge(e,r,a,t);case"css":return Pe(e,r,t);case"attribute":return P(e,r);default:return e[r]||0}}function oe(e,r){var t=/^(\*=|\+=|-=)/.exec(e);if(!t)return e;var a=B(e)||0,n=parseFloat(r),o=parseFloat(e.replace(t[0],""));switch(t[0][0]){case"+":return n+o+a;case"-":return n-o+a;case"*":return n*o+a}}function De(e,r){if(f.col(e))return Ke(e);if(/\s/g.test(e))return e;var t=B(e),a=t?e.substr(0,e.length-t.length):e;return r?a+r:a}function ue(e,r){return Math.sqrt(Math.pow(r.x-e.x,2)+Math.pow(r.y-e.y,2))}function Xe(e){return Math.PI*2*P(e,"r")}function er(e){return P(e,"width")*2+P(e,"height")*2}function rr(e){return ue({x:P(e,"x1"),y:P(e,"y1")},{x:P(e,"x2"),y:P(e,"y2")})}function Se(e){for(var r=e.points,t=0,a,n=0;n<r.numberOfItems;n++){var o=r.getItem(n);n>0&&(t+=ue(a,o)),a=o}return t}function tr(e){var r=e.points;return Se(e)+ue(r.getItem(r.numberOfItems-1),r.getItem(0))}function Ae(e){if(e.getTotalLength)return e.getTotalLength();switch(e.tagName.toLowerCase()){case"circle":return Xe(e);case"rect":return er(e);case"line":return rr(e);case"polyline":return Se(e);case"polygon":return tr(e)}}function nr(e){var r=Ae(e);return e.setAttribute("stroke-dasharray",r),r}function ar(e){for(var r=e.parentNode;f.svg(r)&&f.svg(r.parentNode);)r=r.parentNode;return r}function Oe(e,r){var t=r||{},a=t.el||ar(e),n=a.getBoundingClientRect(),o=P(a,"viewBox"),u=n.width,s=n.height,i=t.viewBox||(o?o.split(" "):[0,0,u,s]);return{el:a,viewBox:i,x:i[0]/1,y:i[1]/1,w:u,h:s,vW:i[2],vH:i[3]}}function ir(e,r){var t=f.str(e)?Ce(e)[0]:e,a=r||100;return function(n){return{property:n,el:t,svg:Oe(t),totalLength:Ae(t)*(a/100)}}}function or(e,r,t){function a(c){c===void 0&&(c=0);var l=r+c>=1?r+c:0;return e.el.getPointAtLength(l)}var n=Oe(e.el,e.svg),o=a(),u=a(-1),s=a(1),i=t?1:n.w/n.vW,m=t?1:n.h/n.vH;switch(e.property){case"x":return(o.x-n.x)*i;case"y":return(o.y-n.y)*m;case"angle":return Math.atan2(s.y-u.y,s.x-u.x)*180/Math.PI}}function he(e,r){var t=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,a=De(f.pth(e)?e.totalLength:e,r)+"";return{original:a,numbers:a.match(t)?a.match(t).map(Number):[0],strings:f.str(e)||r?a.split(t):[]}}function se(e){var r=e?W(f.arr(e)?e.map(ge):ge(e)):[];return U(r,function(t,a,n){return n.indexOf(t)===a})}function ke(e){var r=se(e);return r.map(function(t,a){return{target:t,id:a,total:r.length,transforms:{list:Be(t)}}})}function ur(e,r){var t=te(r);if(/^spring/.test(t.easing)&&(t.duration=Te(t.easing)),f.arr(e)){var a=e.length,n=a===2&&!f.obj(e[0]);n?e={value:e}:f.fnc(r.duration)||(t.duration=r.duration/a)}var o=f.arr(e)?e:[e];return o.map(function(u,s){var i=f.obj(u)&&!f.pth(u)?u:{value:u};return f.und(i.delay)&&(i.delay=s?0:r.delay),f.und(i.endDelay)&&(i.endDelay=s===o.length-1?r.endDelay:0),i}).map(function(u){return Q(u,t)})}function sr(e){for(var r=U(W(e.map(function(o){return Object.keys(o)})),function(o){return f.key(o)}).reduce(function(o,u){return o.indexOf(u)<0&&o.push(u),o},[]),t={},a=function(o){var u=r[o];t[u]=e.map(function(s){var i={};for(var m in s)f.key(m)?m==u&&(i.value=s[m]):i[m]=s[m];return i})},n=0;n<r.length;n++)a(n);return t}function cr(e,r){var t=[],a=r.keyframes;a&&(r=Q(sr(a),r));for(var n in r)f.key(n)&&t.push({name:n,tweens:ur(r[n],e)});return t}function fr(e,r){var t={};for(var a in e){var n=_(e[a],r);f.arr(n)&&(n=n.map(function(o){return _(o,r)}),n.length===1&&(n=n[0])),t[a]=n}return t.duration=parseFloat(t.duration),t.delay=parseFloat(t.delay),t}function lr(e,r){var t;return e.tweens.map(function(a){var n=fr(a,r),o=n.value,u=f.arr(o)?o[1]:o,s=B(u),i=ie(r.target,e.name,s,r),m=t?t.to.original:i,c=f.arr(o)?o[0]:m,l=B(c)||B(i),h=s||l;return f.und(u)&&(u=m),n.from=he(c,h),n.to=he(oe(u,c),h),n.start=t?t.end:0,n.end=n.start+n.delay+n.duration+n.endDelay,n.easing=ee(n.easing,n.duration),n.isPath=f.pth(o),n.isPathTargetInsideSVG=n.isPath&&f.svg(r.target),n.isColor=f.col(n.from.original),n.isColor&&(n.round=1),t=n,n})}var Fe={css:function(e,r,t){return e.style[r]=t},attribute:function(e,r,t){return e.setAttribute(r,t)},object:function(e,r,t){return e[r]=t},transform:function(e,r,t,a,n){if(a.list.set(r,t),r===a.last||n){var o="";a.list.forEach(function(u,s){o+=s+"("+u+") "}),e.style.transform=o}}};function Ve(e,r){var t=ke(e);t.forEach(function(a){for(var n in r){var o=_(r[n],a),u=a.target,s=B(o),i=ie(u,n,s,a),m=s||B(i),c=oe(De(o,m),i),l=ae(u,n);Fe[l](u,n,c,a.transforms,!0)}})}function dr(e,r){var t=ae(e.target,r.name);if(t){var a=lr(r,e),n=a[a.length-1];return{type:t,property:r.name,animatable:e,tweens:a,duration:n.end,delay:a[0].delay,endDelay:n.endDelay}}}function vr(e,r){return U(W(e.map(function(t){return r.map(function(a){return dr(t,a)})})),function(t){return!f.und(t)})}function je(e,r){var t=e.length,a=function(o){return o.timelineOffset?o.timelineOffset:0},n={};return n.duration=t?Math.max.apply(Math,e.map(function(o){return a(o)+o.duration})):r.duration,n.delay=t?Math.min.apply(Math,e.map(function(o){return a(o)+o.delay})):r.delay,n.endDelay=t?n.duration-Math.max.apply(Math,e.map(function(o){return a(o)+o.duration-o.endDelay})):r.endDelay,n}var me=0;function gr(e){var r=K(Ee,e),t=K(X,e),a=cr(t,e),n=ke(e.targets),o=vr(n,a),u=je(o,t),s=me;return me++,Q(r,{id:s,children:[],animatables:n,animations:o,duration:u.duration,delay:u.delay,endDelay:u.endDelay})}var L=[],He=function(){var e;function r(){!e&&(!ye()||!p.suspendWhenDocumentHidden)&&L.length>0&&(e=requestAnimationFrame(t))}function t(n){for(var o=L.length,u=0;u<o;){var s=L[u];s.paused?(L.splice(u,1),o--):(s.tick(n),u++)}e=u>0?requestAnimationFrame(t):void 0}function a(){p.suspendWhenDocumentHidden&&(ye()?e=cancelAnimationFrame(e):(L.forEach(function(n){return n._onDocumentVisibility()}),He()))}return typeof document<"u"&&document.addEventListener("visibilitychange",a),r}();function ye(){return!!document&&document.hidden}function p(e){e===void 0&&(e={});var r=0,t=0,a=0,n,o=0,u=null;function s(g){var v=window.Promise&&new Promise(function(I){return u=I});return g.finished=v,v}var i=gr(e);s(i);function m(){var g=i.direction;g!=="alternate"&&(i.direction=g!=="normal"?"normal":"reverse"),i.reversed=!i.reversed,n.forEach(function(v){return v.reversed=i.reversed})}function c(g){return i.reversed?i.duration-g:g}function l(){r=0,t=c(i.currentTime)*(1/p.speed)}function h(g,v){v&&v.seek(g-v.timelineOffset)}function E(g){if(i.reversePlayback)for(var I=o;I--;)h(g,n[I]);else for(var v=0;v<o;v++)h(g,n[v])}function y(g){for(var v=0,I=i.animations,D=I.length;v<D;){var x=I[v],S=x.animatable,F=x.tweens,A=F.length-1,M=F[A];A&&(M=U(F,function(Ue){return g<Ue.end})[0]||M);for(var O=C(g-M.start-M.delay,0,M.duration)/M.duration,q=isNaN(O)?1:M.easing(O),T=M.to.strings,$=M.round,N=[],Re=M.to.numbers.length,k=void 0,V=0;V<Re;V++){var j=void 0,ce=M.to.numbers[V],fe=M.from.numbers[V]||0;M.isPath?j=or(M.value,q*ce,M.isPathTargetInsideSVG):j=fe+q*(ce-fe),$&&(M.isColor&&V>2||(j=Math.round(j*$)/$)),N.push(j)}var le=T.length;if(!le)k=N[0];else{k=T[0];for(var H=0;H<le;H++){T[H];var de=T[H+1],Z=N[H];isNaN(Z)||(de?k+=Z+de:k+=Z+" ")}}Fe[x.type](S.target,x.property,k,S.transforms),x.currentValue=k,v++}}function d(g){i[g]&&!i.passThrough&&i[g](i)}function b(){i.remaining&&i.remaining!==!0&&i.remaining--}function w(g){var v=i.duration,I=i.delay,D=v-i.endDelay,x=c(g);i.progress=C(x/v*100,0,100),i.reversePlayback=x<i.currentTime,n&&E(x),!i.began&&i.currentTime>0&&(i.began=!0,d("begin")),!i.loopBegan&&i.currentTime>0&&(i.loopBegan=!0,d("loopBegin")),x<=I&&i.currentTime!==0&&y(0),(x>=D&&i.currentTime!==v||!v)&&y(v),x>I&&x<D?(i.changeBegan||(i.changeBegan=!0,i.changeCompleted=!1,d("changeBegin")),d("change"),y(x)):i.changeBegan&&(i.changeCompleted=!0,i.changeBegan=!1,d("changeComplete")),i.currentTime=C(x,0,v),i.began&&d("update"),g>=v&&(t=0,b(),i.remaining?(r=a,d("loopComplete"),i.loopBegan=!1,i.direction==="alternate"&&m()):(i.paused=!0,i.completed||(i.completed=!0,d("loopComplete"),d("complete"),!i.passThrough&&"Promise"in window&&(u(),s(i)))))}return i.reset=function(){var g=i.direction;i.passThrough=!1,i.currentTime=0,i.progress=0,i.paused=!0,i.began=!1,i.loopBegan=!1,i.changeBegan=!1,i.completed=!1,i.changeCompleted=!1,i.reversePlayback=!1,i.reversed=g==="reverse",i.remaining=i.loop,n=i.children,o=n.length;for(var v=o;v--;)i.children[v].reset();(i.reversed&&i.loop!==!0||g==="alternate"&&i.loop===1)&&i.remaining++,y(i.reversed?i.duration:0)},i._onDocumentVisibility=l,i.set=function(g,v){return Ve(g,v),i},i.tick=function(g){a=g,r||(r=a),w((a+(t-r))*p.speed)},i.seek=function(g){w(c(g))},i.pause=function(){i.paused=!0,l()},i.play=function(){i.paused&&(i.completed&&i.reset(),i.paused=!1,L.push(i),l(),He())},i.reverse=function(){m(),i.completed=!i.reversed,l()},i.restart=function(){i.reset(),i.play()},i.remove=function(g){var v=se(g);ze(v,i)},i.reset(),i.autoplay&&i.play(),i}function pe(e,r){for(var t=r.length;t--;)re(e,r[t].animatable.target)&&r.splice(t,1)}function ze(e,r){var t=r.animations,a=r.children;pe(e,t);for(var n=a.length;n--;){var o=a[n],u=o.animations;pe(e,u),!u.length&&!o.children.length&&a.splice(n,1)}!t.length&&!a.length&&r.pause()}function hr(e){for(var r=se(e),t=L.length;t--;){var a=L[t];ze(r,a)}}function mr(e,r){r===void 0&&(r={});var t=r.direction||"normal",a=r.easing?ee(r.easing):null,n=r.grid,o=r.axis,u=r.from||0,s=u==="first",i=u==="center",m=u==="last",c=f.arr(e),l=parseFloat(c?e[0]:e),h=c?parseFloat(e[1]):0,E=B(c?e[1]:e)||0,y=r.start||0+(c?l:0),d=[],b=0;return function(w,g,v){if(s&&(u=0),i&&(u=(v-1)/2),m&&(u=v-1),!d.length){for(var I=0;I<v;I++){if(!n)d.push(Math.abs(u-I));else{var D=i?(n[0]-1)/2:u%n[0],x=i?(n[1]-1)/2:Math.floor(u/n[0]),S=I%n[0],F=Math.floor(I/n[0]),A=D-S,M=x-F,O=Math.sqrt(A*A+M*M);o==="x"&&(O=-A),o==="y"&&(O=-M),d.push(O)}b=Math.max.apply(Math,d)}a&&(d=d.map(function(T){return a(T/b)*b})),t==="reverse"&&(d=d.map(function(T){return o?T<0?T*-1:-T:Math.abs(b-T)}))}var q=c?(h-l)/b:l;return y+q*(Math.round(d[g]*100)/100)+E}}function yr(e){e===void 0&&(e={});var r=p(e);return r.duration=0,r.add=function(t,a){var n=L.indexOf(r),o=r.children;n>-1&&L.splice(n,1);function u(h){h.passThrough=!0}for(var s=0;s<o.length;s++)u(o[s]);var i=Q(t,K(X,e));i.targets=i.targets||e.targets;var m=r.duration;i.autoplay=!1,i.direction=r.direction,i.timelineOffset=f.und(a)?m:oe(a,m),u(r),r.seek(i.timelineOffset);var c=p(i);u(c),o.push(c);var l=je(o,e);return r.delay=l.delay,r.endDelay=l.endDelay,r.duration=l.duration,r.seek(0),r.reset(),r.autoplay&&r.play(),r},r}p.version="3.2.1";p.speed=1;p.suspendWhenDocumentHidden=!0;p.running=L;p.remove=hr;p.get=ie;p.set=Ve;p.convertPx=ne;p.path=ir;p.setDashoffset=nr;p.stagger=mr;p.timeline=yr;p.easing=ee;p.penner=Le;p.random=function(e,r){return Math.floor(Math.random()*(r-e+1))+e};const pr=document.getElementById("home"),be=document.getElementById("logo"),xe={targets:".logo path",opacity:1,strokeDashoffset:[p.setDashoffset,0],easing:"easeInQuart",duration:5e3,fill:{value:"#C01522",delay:3300,duration:800,easing:"easeInOutSine"}},we={targets:".shadow",opacity:1,easing:"easeInQuart",duration:4e3};let Me=!1;window.innerWidth>700?pr?.addEventListener("mouseenter",e=>{Me||(p(xe),p(we),Me=!0),be.style.opacity="1"}):(p(xe),p(we),be.style.opacity="1");const br=document.querySelectorAll(".copy"),xr=document.querySelectorAll(".tooltip");br.forEach(e=>{e?.addEventListener("click",()=>{console.log("click"),navigator.clipboard.writeText("freddylyacuri@gmail.com"),xr.forEach(r=>{r.innerHTML="Email copied"}),p({targets:".tooltip",rotate:[-15,20,0],translateY:[-20,0],easing:"easeOutBounce",duration:800})})});const qe=navigator.language.split("-")[0],wr=document.getElementById("translate"),Mr=document.querySelectorAll("[data-section]");let J=qe==="en"?1:0;const G=async e=>{const t=await(await fetch(`../src/languages/${e}.json`)).json();for(const a of Mr){const n=a,o=n.dataset.section,u=n.dataset.value;a.innerHTML=t[o][u]}};wr?.addEventListener("click",e=>{J===1?(J=0,G("es")):(J=1,G("en"))});window.onload=()=>{G(qe)};
