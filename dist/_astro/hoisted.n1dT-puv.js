import"./hoisted.RPL2NBvO.js";var xr={update:null,begin:null,loopBegin:null,changeBegin:null,change:null,changeComplete:null,loopComplete:null,complete:null,loop:1,direction:"normal",autoplay:!0,timelineOffset:0},Y={duration:1e3,delay:0,endDelay:0,easing:"easeOutElastic(1, .5)",round:0},Hr=["translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY","perspective","matrix","matrix3d"],U={CSS:{},springs:{}};function C(r,e,n){return Math.min(Math.max(r,e),n)}function H(r,e){return r.indexOf(e)>-1}function K(r,e){return r.apply(null,e)}var c={arr:function(r){return Array.isArray(r)},obj:function(r){return H(Object.prototype.toString.call(r),"Object")},pth:function(r){return c.obj(r)&&r.hasOwnProperty("totalLength")},svg:function(r){return r instanceof SVGElement},inp:function(r){return r instanceof HTMLInputElement},dom:function(r){return r.nodeType||c.svg(r)},str:function(r){return typeof r=="string"},fnc:function(r){return typeof r=="function"},und:function(r){return typeof r>"u"},nil:function(r){return c.und(r)||r===null},hex:function(r){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(r)},rgb:function(r){return/^rgb/.test(r)},hsl:function(r){return/^hsl/.test(r)},col:function(r){return c.hex(r)||c.rgb(r)||c.hsl(r)},key:function(r){return!xr.hasOwnProperty(r)&&!Y.hasOwnProperty(r)&&r!=="targets"&&r!=="keyframes"}};function Mr(r){var e=/\(([^)]+)\)/.exec(r);return e?e[1].split(",").map(function(n){return parseFloat(n)}):[]}function wr(r,e){var n=Mr(r),a=C(c.und(n[0])?1:n[0],.1,100),t=C(c.und(n[1])?100:n[1],.1,100),o=C(c.und(n[2])?10:n[2],.1,100),u=C(c.und(n[3])?0:n[3],.1,100),s=Math.sqrt(t/a),i=o/(2*Math.sqrt(t*a)),m=i<1?s*Math.sqrt(1-i*i):0,f=1,l=i<1?(i*s+-u)/m:-u+s;function h(p){var v=e?e*p/1e3:p;return i<1?v=Math.exp(-v*i*s)*(f*Math.cos(m*v)+l*Math.sin(m*v)):v=(f+l*v)*Math.exp(-v*s),p===0||p===1?p:1-v}function T(){var p=U.springs[r];if(p)return p;for(var v=1/6,b=0,M=0;;)if(b+=v,h(b)===1){if(M++,M>=16)break}else M=0;var g=b*v*1e3;return U.springs[r]=g,g}return e?h:T}function Rr(r){return r===void 0&&(r=10),function(e){return Math.ceil(C(e,1e-6,1)*r)*(1/r)}}var Ur=function(){var r=11,e=1/(r-1);function n(f,l){return 1-3*l+3*f}function a(f,l){return 3*l-6*f}function t(f){return 3*f}function o(f,l,h){return((n(l,h)*f+a(l,h))*f+t(l))*f}function u(f,l,h){return 3*n(l,h)*f*f+2*a(l,h)*f+t(l)}function s(f,l,h,T,p){var v,b,M=0;do b=l+(h-l)/2,v=o(b,T,p)-f,v>0?h=b:l=b;while(Math.abs(v)>1e-7&&++M<10);return b}function i(f,l,h,T){for(var p=0;p<4;++p){var v=u(l,h,T);if(v===0)return l;var b=o(l,h,T)-f;l-=b/v}return l}function m(f,l,h,T){if(!(0<=f&&f<=1&&0<=h&&h<=1))return;var p=new Float32Array(r);if(f!==l||h!==T)for(var v=0;v<r;++v)p[v]=o(v*e,f,h);function b(M){for(var g=0,d=1,I=r-1;d!==I&&p[d]<=M;++d)g+=e;--d;var O=(M-p[d])/(p[d+1]-p[d]),x=g+O*e,S=u(x,f,h);return S>=.001?i(M,x,f,h):S===0?x:s(M,g,g+e,f,h)}return function(M){return f===l&&h===T||M===0||M===1?M:o(b(M),l,T)}}return m}(),Tr=function(){var r={linear:function(){return function(a){return a}}},e={Sine:function(){return function(a){return 1-Math.cos(a*Math.PI/2)}},Expo:function(){return function(a){return a?Math.pow(2,10*a-10):0}},Circ:function(){return function(a){return 1-Math.sqrt(1-a*a)}},Back:function(){return function(a){return a*a*(3*a-2)}},Bounce:function(){return function(a){for(var t,o=4;a<((t=Math.pow(2,--o))-1)/11;);return 1/Math.pow(4,3-o)-7.5625*Math.pow((t*3-2)/22-a,2)}},Elastic:function(a,t){a===void 0&&(a=1),t===void 0&&(t=.5);var o=C(a,1,10),u=C(t,.1,2);return function(s){return s===0||s===1?s:-o*Math.pow(2,10*(s-1))*Math.sin((s-1-u/(Math.PI*2)*Math.asin(1/o))*(Math.PI*2)/u)}}},n=["Quad","Cubic","Quart","Quint"];return n.forEach(function(a,t){e[a]=function(){return function(o){return Math.pow(o,t+2)}}}),Object.keys(e).forEach(function(a){var t=e[a];r["easeIn"+a]=t,r["easeOut"+a]=function(o,u){return function(s){return 1-t(o,u)(1-s)}},r["easeInOut"+a]=function(o,u){return function(s){return s<.5?t(o,u)(s*2)/2:1-t(o,u)(s*-2+2)/2}},r["easeOutIn"+a]=function(o,u){return function(s){return s<.5?(1-t(o,u)(1-s*2))/2:(t(o,u)(s*2-1)+1)/2}}}),r}();function G(r,e){if(c.fnc(r))return r;var n=r.split("(")[0],a=Tr[n],t=Mr(r);switch(n){case"spring":return wr(r,e);case"cubicBezier":return K(Ur,t);case"steps":return K(Rr,t);default:return K(a,t)}}function Ir(r){try{var e=document.querySelectorAll(r);return e}catch{return}}function W(r,e){for(var n=r.length,a=arguments.length>=2?arguments[1]:void 0,t=[],o=0;o<n;o++)if(o in r){var u=r[o];e.call(a,u,o,r)&&t.push(u)}return t}function q(r){return r.reduce(function(e,n){return e.concat(c.arr(n)?q(n):n)},[])}function lr(r){return c.arr(r)?r:(c.str(r)&&(r=Ir(r)||r),r instanceof NodeList||r instanceof HTMLCollection?[].slice.call(r):[r])}function X(r,e){return r.some(function(n){return n===e})}function rr(r){var e={};for(var n in r)e[n]=r[n];return e}function _(r,e){var n=rr(r);for(var a in r)n[a]=e.hasOwnProperty(a)?e[a]:r[a];return n}function Q(r,e){var n=rr(r);for(var a in e)n[a]=c.und(r[a])?e[a]:r[a];return n}function Wr(r){var e=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(r);return e?"rgba("+e[1]+",1)":r}function qr(r){var e=/^#?([a-f\d])([a-f\d])([a-f\d])$/i,n=r.replace(e,function(s,i,m,f){return i+i+m+m+f+f}),a=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(n),t=parseInt(a[1],16),o=parseInt(a[2],16),u=parseInt(a[3],16);return"rgba("+t+","+o+","+u+",1)"}function Qr(r){var e=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(r)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(r),n=parseInt(e[1],10)/360,a=parseInt(e[2],10)/100,t=parseInt(e[3],10)/100,o=e[4]||1;function u(h,T,p){return p<0&&(p+=1),p>1&&(p-=1),p<1/6?h+(T-h)*6*p:p<1/2?T:p<2/3?h+(T-h)*(2/3-p)*6:h}var s,i,m;if(a==0)s=i=m=t;else{var f=t<.5?t*(1+a):t+a-t*a,l=2*t-f;s=u(l,f,n+1/3),i=u(l,f,n),m=u(l,f,n-1/3)}return"rgba("+s*255+","+i*255+","+m*255+","+o+")"}function Nr(r){if(c.rgb(r))return Wr(r);if(c.hex(r))return qr(r);if(c.hsl(r))return Qr(r)}function k(r){var e=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(r);if(e)return e[1]}function Zr(r){if(H(r,"translate")||r==="perspective")return"px";if(H(r,"rotate")||H(r,"skew"))return"deg"}function J(r,e){return c.fnc(r)?r(e.target,e.id,e.total):r}function D(r,e){return r.getAttribute(e)}function er(r,e,n){var a=k(e);if(X([n,"deg","rad","turn"],a))return e;var t=U.CSS[e+n];if(!c.und(t))return t;var o=100,u=document.createElement(r.tagName),s=r.parentNode&&r.parentNode!==document?r.parentNode:document.body;s.appendChild(u),u.style.position="absolute",u.style.width=o+n;var i=o/u.offsetWidth;s.removeChild(u);var m=i*parseFloat(e);return U.CSS[e+n]=m,m}function Pr(r,e,n){if(e in r.style){var a=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),t=r.style[e]||getComputedStyle(r).getPropertyValue(a)||"0";return n?er(r,t,n):t}}function nr(r,e){if(c.dom(r)&&!c.inp(r)&&(!c.nil(D(r,e))||c.svg(r)&&r[e]))return"attribute";if(c.dom(r)&&X(Hr,e))return"transform";if(c.dom(r)&&e!=="transform"&&Pr(r,e))return"css";if(r[e]!=null)return"object"}function Er(r){if(c.dom(r)){for(var e=r.style.transform||"",n=/(\w+)\(([^)]*)\)/g,a=new Map,t;t=n.exec(e);)a.set(t[1],t[2]);return a}}function $r(r,e,n,a){var t=H(e,"scale")?1:0+Zr(e),o=Er(r).get(e)||t;return n&&(n.transforms.list.set(e,o),n.transforms.last=e),a?er(r,o,a):o}function tr(r,e,n,a){switch(nr(r,e)){case"transform":return $r(r,e,a,n);case"css":return Pr(r,e,n);case"attribute":return D(r,e);default:return r[e]||0}}function ar(r,e){var n=/^(\*=|\+=|-=)/.exec(r);if(!n)return r;var a=k(r)||0,t=parseFloat(e),o=parseFloat(r.replace(n[0],""));switch(n[0][0]){case"+":return t+o+a;case"-":return t-o+a;case"*":return t*o+a}}function Cr(r,e){if(c.col(r))return Nr(r);if(/\s/g.test(r))return r;var n=k(r),a=n?r.substr(0,r.length-n.length):r;return e?a+e:a}function ir(r,e){return Math.sqrt(Math.pow(e.x-r.x,2)+Math.pow(e.y-r.y,2))}function Kr(r){return Math.PI*2*D(r,"r")}function _r(r){return D(r,"width")*2+D(r,"height")*2}function Jr(r){return ir({x:D(r,"x1"),y:D(r,"y1")},{x:D(r,"x2"),y:D(r,"y2")})}function Dr(r){for(var e=r.points,n=0,a,t=0;t<e.numberOfItems;t++){var o=e.getItem(t);t>0&&(n+=ir(a,o)),a=o}return n}function Yr(r){var e=r.points;return Dr(r)+ir(e.getItem(e.numberOfItems-1),e.getItem(0))}function kr(r){if(r.getTotalLength)return r.getTotalLength();switch(r.tagName.toLowerCase()){case"circle":return Kr(r);case"rect":return _r(r);case"line":return Jr(r);case"polyline":return Dr(r);case"polygon":return Yr(r)}}function Gr(r){var e=kr(r);return r.setAttribute("stroke-dasharray",e),e}function Xr(r){for(var e=r.parentNode;c.svg(e)&&c.svg(e.parentNode);)e=e.parentNode;return e}function Or(r,e){var n=e||{},a=n.el||Xr(r),t=a.getBoundingClientRect(),o=D(a,"viewBox"),u=t.width,s=t.height,i=n.viewBox||(o?o.split(" "):[0,0,u,s]);return{el:a,viewBox:i,x:i[0]/1,y:i[1]/1,w:u,h:s,vW:i[2],vH:i[3]}}function re(r,e){var n=c.str(r)?Ir(r)[0]:r,a=e||100;return function(t){return{property:t,el:n,svg:Or(n),totalLength:kr(n)*(a/100)}}}function ee(r,e,n){function a(f){f===void 0&&(f=0);var l=e+f>=1?e+f:0;return r.el.getPointAtLength(l)}var t=Or(r.el,r.svg),o=a(),u=a(-1),s=a(1),i=n?1:t.w/t.vW,m=n?1:t.h/t.vH;switch(r.property){case"x":return(o.x-t.x)*i;case"y":return(o.y-t.y)*m;case"angle":return Math.atan2(s.y-u.y,s.x-u.x)*180/Math.PI}}function vr(r,e){var n=/[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,a=Cr(c.pth(r)?r.totalLength:r,e)+"";return{original:a,numbers:a.match(n)?a.match(n).map(Number):[0],strings:c.str(r)||e?a.split(n):[]}}function or(r){var e=r?q(c.arr(r)?r.map(lr):lr(r)):[];return W(e,function(n,a,t){return t.indexOf(n)===a})}function Sr(r){var e=or(r);return e.map(function(n,a){return{target:n,id:a,total:e.length,transforms:{list:Er(n)}}})}function ne(r,e){var n=rr(e);if(/^spring/.test(n.easing)&&(n.duration=wr(n.easing)),c.arr(r)){var a=r.length,t=a===2&&!c.obj(r[0]);t?r={value:r}:c.fnc(e.duration)||(n.duration=e.duration/a)}var o=c.arr(r)?r:[r];return o.map(function(u,s){var i=c.obj(u)&&!c.pth(u)?u:{value:u};return c.und(i.delay)&&(i.delay=s?0:e.delay),c.und(i.endDelay)&&(i.endDelay=s===o.length-1?e.endDelay:0),i}).map(function(u){return Q(u,n)})}function te(r){for(var e=W(q(r.map(function(o){return Object.keys(o)})),function(o){return c.key(o)}).reduce(function(o,u){return o.indexOf(u)<0&&o.push(u),o},[]),n={},a=function(o){var u=e[o];n[u]=r.map(function(s){var i={};for(var m in s)c.key(m)?m==u&&(i.value=s[m]):i[m]=s[m];return i})},t=0;t<e.length;t++)a(t);return n}function ae(r,e){var n=[],a=e.keyframes;a&&(e=Q(te(a),e));for(var t in e)c.key(t)&&n.push({name:t,tweens:ne(e[t],r)});return n}function ie(r,e){var n={};for(var a in r){var t=J(r[a],e);c.arr(t)&&(t=t.map(function(o){return J(o,e)}),t.length===1&&(t=t[0])),n[a]=t}return n.duration=parseFloat(n.duration),n.delay=parseFloat(n.delay),n}function oe(r,e){var n;return r.tweens.map(function(a){var t=ie(a,e),o=t.value,u=c.arr(o)?o[1]:o,s=k(u),i=tr(e.target,r.name,s,e),m=n?n.to.original:i,f=c.arr(o)?o[0]:m,l=k(f)||k(i),h=s||l;return c.und(u)&&(u=m),t.from=vr(f,h),t.to=vr(ar(u,f),h),t.start=n?n.end:0,t.end=t.start+t.delay+t.duration+t.endDelay,t.easing=G(t.easing,t.duration),t.isPath=c.pth(o),t.isPathTargetInsideSVG=t.isPath&&c.svg(e.target),t.isColor=c.col(t.from.original),t.isColor&&(t.round=1),n=t,t})}var Lr={css:function(r,e,n){return r.style[e]=n},attribute:function(r,e,n){return r.setAttribute(e,n)},object:function(r,e,n){return r[e]=n},transform:function(r,e,n,a,t){if(a.list.set(e,n),e===a.last||t){var o="";a.list.forEach(function(u,s){o+=s+"("+u+") "}),r.style.transform=o}}};function Ar(r,e){var n=Sr(r);n.forEach(function(a){for(var t in e){var o=J(e[t],a),u=a.target,s=k(o),i=tr(u,t,s,a),m=s||k(i),f=ar(Cr(o,m),i),l=nr(u,t);Lr[l](u,t,f,a.transforms,!0)}})}function ue(r,e){var n=nr(r.target,e.name);if(n){var a=oe(e,r),t=a[a.length-1];return{type:n,property:e.name,animatable:r,tweens:a,duration:t.end,delay:a[0].delay,endDelay:t.endDelay}}}function se(r,e){return W(q(r.map(function(n){return e.map(function(a){return ue(n,a)})})),function(n){return!c.und(n)})}function Br(r,e){var n=r.length,a=function(o){return o.timelineOffset?o.timelineOffset:0},t={};return t.duration=n?Math.max.apply(Math,r.map(function(o){return a(o)+o.duration})):e.duration,t.delay=n?Math.min.apply(Math,r.map(function(o){return a(o)+o.delay})):e.delay,t.endDelay=n?t.duration-Math.max.apply(Math,r.map(function(o){return a(o)+o.duration-o.endDelay})):e.endDelay,t}var dr=0;function fe(r){var e=_(xr,r),n=_(Y,r),a=ae(n,r),t=Sr(r.targets),o=se(t,a),u=Br(o,n),s=dr;return dr++,Q(e,{id:s,children:[],animatables:t,animations:o,duration:u.duration,delay:u.delay,endDelay:u.endDelay})}var E=[],Fr=function(){var r;function e(){!r&&(!gr()||!y.suspendWhenDocumentHidden)&&E.length>0&&(r=requestAnimationFrame(n))}function n(t){for(var o=E.length,u=0;u<o;){var s=E[u];s.paused?(E.splice(u,1),o--):(s.tick(t),u++)}r=u>0?requestAnimationFrame(n):void 0}function a(){y.suspendWhenDocumentHidden&&(gr()?r=cancelAnimationFrame(r):(E.forEach(function(t){return t._onDocumentVisibility()}),Fr()))}return typeof document<"u"&&document.addEventListener("visibilitychange",a),e}();function gr(){return!!document&&document.hidden}function y(r){r===void 0&&(r={});var e=0,n=0,a=0,t,o=0,u=null;function s(g){var d=window.Promise&&new Promise(function(I){return u=I});return g.finished=d,d}var i=fe(r);s(i);function m(){var g=i.direction;g!=="alternate"&&(i.direction=g!=="normal"?"normal":"reverse"),i.reversed=!i.reversed,t.forEach(function(d){return d.reversed=i.reversed})}function f(g){return i.reversed?i.duration-g:g}function l(){e=0,n=f(i.currentTime)*(1/y.speed)}function h(g,d){d&&d.seek(g-d.timelineOffset)}function T(g){if(i.reversePlayback)for(var I=o;I--;)h(g,t[I]);else for(var d=0;d<o;d++)h(g,t[d])}function p(g){for(var d=0,I=i.animations,O=I.length;d<O;){var x=I[d],S=x.animatable,F=x.tweens,L=F.length-1,w=F[L];L&&(w=W(F,function(zr){return g<zr.end})[0]||w);for(var A=C(g-w.start-w.delay,0,w.duration)/w.duration,R=isNaN(A)?1:w.easing(A),P=w.to.strings,N=w.round,Z=[],jr=w.to.numbers.length,B=void 0,V=0;V<jr;V++){var j=void 0,ur=w.to.numbers[V],sr=w.from.numbers[V]||0;w.isPath?j=ee(w.value,R*ur,w.isPathTargetInsideSVG):j=sr+R*(ur-sr),N&&(w.isColor&&V>2||(j=Math.round(j*N)/N)),Z.push(j)}var fr=P.length;if(!fr)B=Z[0];else{B=P[0];for(var z=0;z<fr;z++){P[z];var cr=P[z+1],$=Z[z];isNaN($)||(cr?B+=$+cr:B+=$+" ")}}Lr[x.type](S.target,x.property,B,S.transforms),x.currentValue=B,d++}}function v(g){i[g]&&!i.passThrough&&i[g](i)}function b(){i.remaining&&i.remaining!==!0&&i.remaining--}function M(g){var d=i.duration,I=i.delay,O=d-i.endDelay,x=f(g);i.progress=C(x/d*100,0,100),i.reversePlayback=x<i.currentTime,t&&T(x),!i.began&&i.currentTime>0&&(i.began=!0,v("begin")),!i.loopBegan&&i.currentTime>0&&(i.loopBegan=!0,v("loopBegin")),x<=I&&i.currentTime!==0&&p(0),(x>=O&&i.currentTime!==d||!d)&&p(d),x>I&&x<O?(i.changeBegan||(i.changeBegan=!0,i.changeCompleted=!1,v("changeBegin")),v("change"),p(x)):i.changeBegan&&(i.changeCompleted=!0,i.changeBegan=!1,v("changeComplete")),i.currentTime=C(x,0,d),i.began&&v("update"),g>=d&&(n=0,b(),i.remaining?(e=a,v("loopComplete"),i.loopBegan=!1,i.direction==="alternate"&&m()):(i.paused=!0,i.completed||(i.completed=!0,v("loopComplete"),v("complete"),!i.passThrough&&"Promise"in window&&(u(),s(i)))))}return i.reset=function(){var g=i.direction;i.passThrough=!1,i.currentTime=0,i.progress=0,i.paused=!0,i.began=!1,i.loopBegan=!1,i.changeBegan=!1,i.completed=!1,i.changeCompleted=!1,i.reversePlayback=!1,i.reversed=g==="reverse",i.remaining=i.loop,t=i.children,o=t.length;for(var d=o;d--;)i.children[d].reset();(i.reversed&&i.loop!==!0||g==="alternate"&&i.loop===1)&&i.remaining++,p(i.reversed?i.duration:0)},i._onDocumentVisibility=l,i.set=function(g,d){return Ar(g,d),i},i.tick=function(g){a=g,e||(e=a),M((a+(n-e))*y.speed)},i.seek=function(g){M(f(g))},i.pause=function(){i.paused=!0,l()},i.play=function(){i.paused&&(i.completed&&i.reset(),i.paused=!1,E.push(i),l(),Fr())},i.reverse=function(){m(),i.completed=!i.reversed,l()},i.restart=function(){i.reset(),i.play()},i.remove=function(g){var d=or(g);Vr(d,i)},i.reset(),i.autoplay&&i.play(),i}function hr(r,e){for(var n=e.length;n--;)X(r,e[n].animatable.target)&&e.splice(n,1)}function Vr(r,e){var n=e.animations,a=e.children;hr(r,n);for(var t=a.length;t--;){var o=a[t],u=o.animations;hr(r,u),!u.length&&!o.children.length&&a.splice(t,1)}!n.length&&!a.length&&e.pause()}function ce(r){for(var e=or(r),n=E.length;n--;){var a=E[n];Vr(e,a)}}function le(r,e){e===void 0&&(e={});var n=e.direction||"normal",a=e.easing?G(e.easing):null,t=e.grid,o=e.axis,u=e.from||0,s=u==="first",i=u==="center",m=u==="last",f=c.arr(r),l=parseFloat(f?r[0]:r),h=f?parseFloat(r[1]):0,T=k(f?r[1]:r)||0,p=e.start||0+(f?l:0),v=[],b=0;return function(M,g,d){if(s&&(u=0),i&&(u=(d-1)/2),m&&(u=d-1),!v.length){for(var I=0;I<d;I++){if(!t)v.push(Math.abs(u-I));else{var O=i?(t[0]-1)/2:u%t[0],x=i?(t[1]-1)/2:Math.floor(u/t[0]),S=I%t[0],F=Math.floor(I/t[0]),L=O-S,w=x-F,A=Math.sqrt(L*L+w*w);o==="x"&&(A=-L),o==="y"&&(A=-w),v.push(A)}b=Math.max.apply(Math,v)}a&&(v=v.map(function(P){return a(P/b)*b})),n==="reverse"&&(v=v.map(function(P){return o?P<0?P*-1:-P:Math.abs(b-P)}))}var R=f?(h-l)/b:l;return p+R*(Math.round(v[g]*100)/100)+T}}function ve(r){r===void 0&&(r={});var e=y(r);return e.duration=0,e.add=function(n,a){var t=E.indexOf(e),o=e.children;t>-1&&E.splice(t,1);function u(h){h.passThrough=!0}for(var s=0;s<o.length;s++)u(o[s]);var i=Q(n,_(Y,r));i.targets=i.targets||r.targets;var m=e.duration;i.autoplay=!1,i.direction=e.direction,i.timelineOffset=c.und(a)?m:ar(a,m),u(e),e.seek(i.timelineOffset);var f=y(i);u(f),o.push(f);var l=Br(o,r);return e.delay=l.delay,e.endDelay=l.endDelay,e.duration=l.duration,e.seek(0),e.reset(),e.autoplay&&e.play(),e},e}y.version="3.2.1";y.speed=1;y.suspendWhenDocumentHidden=!0;y.running=E;y.remove=ce;y.get=tr;y.set=Ar;y.convertPx=er;y.path=re;y.setDashoffset=Gr;y.stagger=le;y.timeline=ve;y.easing=G;y.penner=Tr;y.random=function(r,e){return Math.floor(Math.random()*(e-r+1))+r};const de=document.getElementById("home"),mr=document.getElementById("logo"),pr={targets:".logo path",opacity:1,strokeDashoffset:[y.setDashoffset,0],easing:"easeInQuart",duration:5e3,fill:{value:"#C01522",delay:3300,duration:800,easing:"easeInOutSine"}},yr={targets:".shadow",opacity:1,easing:"easeInQuart",duration:4e3};let br=!1;window.innerWidth>700?de?.addEventListener("mouseenter",r=>{br||(y(pr),y(yr),br=!0),mr.style.opacity="1"}):(y(pr),y(yr),mr.style.opacity="1");const ge=document.querySelectorAll(".copy"),he=document.querySelectorAll(".tooltip");ge.forEach(r=>{r?.addEventListener("click",()=>{console.log("click"),navigator.clipboard.writeText("freddylyacuri@gmail.com"),he.forEach(e=>{e.innerHTML="Email copied"}),y({targets:".tooltip",rotate:[-15,20,0],translateY:[-20,0],easing:"easeOutBounce",duration:800})})});
