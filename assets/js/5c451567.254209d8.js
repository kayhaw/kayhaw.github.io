"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[2981],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return f}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,p=u(e,["components","mdxType","originalType","parentName"]),m=c(r),f=o,b=m["".concat(l,".").concat(f)]||m[f]||s[f]||a;return r?n.createElement(b,i(i({ref:t},p),{},{components:r})):n.createElement(b,i({ref:t},p))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=m;var u={};for(var l in t)hasOwnProperty.call(t,l)&&(u[l]=t[l]);u.originalType=e,u.mdxType="string"==typeof e?e:o,i[1]=u;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},2493:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return u},contentTitle:function(){return l},metadata:function(){return c},assets:function(){return p},toc:function(){return s},default:function(){return f}});var n=r(7462),o=r(3366),a=(r(7294),r(3905)),i=["components"],u={title:"\u7f51\u7edc\u57fa\u7840\u77e5\u8bc6(1)",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["Networking","TCP"],description:"\u7f51\u7edc\u57fa\u7840\u77e5\u8bc6(1)",hide_table_of_contents:!1},l=void 0,c={permalink:"/blog/2021/09/20/TCPBasic",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/blog/blog/2021-09-20-TCPBasic.mdx",source:"@site/blog/2021-09-20-TCPBasic.mdx",title:"\u7f51\u7edc\u57fa\u7840\u77e5\u8bc6(1)",description:"\u7f51\u7edc\u57fa\u7840\u77e5\u8bc6(1)",date:"2021-09-20T00:00:00.000Z",formattedDate:"September 20, 2021",tags:[{label:"Networking",permalink:"/blog/tags/networking"},{label:"TCP",permalink:"/blog/tags/tcp"}],readingTime:.075,truncated:!0,authors:[{name:"\u4f55\u8f72",title:"Never settle down",url:"https://github.com/kayhaw",imageURL:"https://avatars.githubusercontent.com/u/16892835?v=4"}],prevItem:{title:"Random\u5bfc\u81f4\u7684\u963b\u585e\u95ee\u9898",permalink:"/blog/2021/09/21/AProblemCausedByRandom"},nextItem:{title:"2021\u5e749\u6708\u4efd\u5de5\u4f5c\u65e5\u5fd7",permalink:"/blog/2021/09/19/WorkJournal"}},p={authorsImageUrls:[void 0]},s=[{value:"RST\u51fa\u73b0\u60c5\u51b5",id:"rst\u51fa\u73b0\u60c5\u51b5",children:[]}],m={toc:s};function f(e){var t=e.components,r=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"\u6076\u8865\u7f51\u7edc\u57fa\u7840\u77e5\u8bc6\u7b2c\u4e00\u7bc7\uff1aTCP\u548cIP"),(0,a.kt)("h2",{id:"rst\u51fa\u73b0\u60c5\u51b5"},"RST\u51fa\u73b0\u60c5\u51b5"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u8bf7\u6c42\u7aef\u53e3\u672a\u6253\u5f00\uff1a\n\u5ba2\u6237\u7aef\u8bf7\u6c42\u8fde\u63a53000\u7aef\u53e3\uff0c\u4f46\u662f\u670d\u52a1\u7aef\u6ca1\u6709\u6253\u5f003000\u7aef\u53e3\uff0c\u6b64\u65f6\u5411\u5ba2\u6237\u7aef\u8fd4\u56deRST\u62a5\u6587\uff1b\u6ce8\u610f\u6709\u4e9b\u64cd\u4f5c\u7cfb\u7edf\u4e0d\u4f1a\u7406\u776c\u8bf7\u6c42\u7aef\u53e3\u4e0d\u5b58\u5728\u7684\u60c5\u51b5"),(0,a.kt)("li",{parentName:"ul"},"\u8bf7\u6c42\u8d85\u65f6\uff1a\n\u5ba2\u6237\u7aef\u53d1\u8d77SYN\u8bf7\u6c42\u540e\u6536\u5230\u6765\u81ea\u670d\u52a1\u7aef\u7684\u54cd\u5e94\uff0c\u4f46\u662f\u63a5\u6536\u65f6\u95f4\u8d85\u65f6\uff0c\u6b64\u65f6\u5ba2\u6237\u7aef\u4f1a\u53d1\u9001RST\u4e3b\u52a8\u65ad\u5f00\u8fde\u63a5"),(0,a.kt)("li",{parentName:"ul"},"\u63d0\u524d\u5173\u95ed\uff1a\n\u5e94\u7528\u7a0b\u5e8f\u4e0d\u60f3\u63a5\u6536\u6570\u636e\uff0c\u5411\u53d1\u9001\u65b9\u76f4\u63a5\u53d1\u9001RST\u8bf7\u6c42"),(0,a.kt)("li",{parentName:"ul"},"\u5df2\u5173\u95ed\u7684\u8fde\u63a5\u4e0a\u6536\u5230\u6570\u636e\uff1a")))}f.isMDXComponent=!0}}]);