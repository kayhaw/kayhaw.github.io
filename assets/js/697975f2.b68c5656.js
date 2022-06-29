"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[6695],{7061:function(t,e,n){n.r(e),n.d(e,{assets:function(){return p},contentTitle:function(){return u},default:function(){return d},frontMatter:function(){return l},metadata:function(){return m},toc:function(){return c}});var r=n(3117),a=n(102),i=(n(7294),n(3905)),o=["components"],l={title:"MySQL\u57fa\u7840\u77e5\u8bc6\u603b\u7ed3(1)",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["MySQL Basic","Summary"],description:"MySQL\u57fa\u7840\u77e5\u8bc6\u603b\u7ed3(1)",hide_table_of_contents:!1},u=void 0,m={permalink:"/blog/2021/10/26/MySQLSummary",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/blog/blog/2021-10-26-MySQLSummary.md",source:"@site/blog/2021-10-26-MySQLSummary.md",title:"MySQL\u57fa\u7840\u77e5\u8bc6\u603b\u7ed3(1)",description:"MySQL\u57fa\u7840\u77e5\u8bc6\u603b\u7ed3(1)",date:"2021-10-26T00:00:00.000Z",formattedDate:"October 26, 2021",tags:[{label:"MySQL Basic",permalink:"/blog/tags/my-sql-basic"},{label:"Summary",permalink:"/blog/tags/summary"}],readingTime:.98,truncated:!0,authors:[{name:"\u4f55\u8f72",title:"Never settle down",url:"https://github.com/kayhaw",imageURL:"https://avatars.githubusercontent.com/u/16892835?v=4"}],frontMatter:{title:"MySQL\u57fa\u7840\u77e5\u8bc6\u603b\u7ed3(1)",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["MySQL Basic","Summary"],description:"MySQL\u57fa\u7840\u77e5\u8bc6\u603b\u7ed3(1)",hide_table_of_contents:!1},prevItem:{title:"FlinkX\u6e90\u7801\u5256\u6790(1)",permalink:"/blog/2022/01/09/FlinkX-Source-Code-Dissection-01"},nextItem:{title:"\u6bcf\u65e5\u7b97\u6cd5\u9898-\u524d\u7f00\u548c",permalink:"/blog/2021/10/16/PrefixSum"}},p={authorsImageUrls:[void 0]},c=[{value:"DATETIME\u548cTIMESTAMP\u5f02\u540c",id:"datetime\u548ctimestamp\u5f02\u540c",level:2}],s={toc:c};function d(t){var e=t.components,n=(0,a.Z)(t,o);return(0,i.kt)("wrapper",(0,r.Z)({},s,n,{components:e,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"MySQL\u57fa\u7840\u77e5\u8bc6\u603b\u7ed3-\u7b2c\u4e00\u7bc7"),(0,i.kt)("h2",{id:"datetime\u548ctimestamp\u5f02\u540c"},"DATETIME\u548cTIMESTAMP\u5f02\u540c"),(0,i.kt)("p",null,"DATETIME\u548cTIMESTAMP\u90fd\u53ef\u4ee5\u7528\u6765\u8868\u793a",(0,i.kt)("inlineCode",{parentName:"p"},"\u5e74\u6708\u65e5\u65f6\u5206\u79d2"),"\u7684\u65f6\u95f4\uff08DATE\u7c7b\u578b\u53ea\u80fd\u5230",(0,i.kt)("inlineCode",{parentName:"p"},"\u5e74\u6708\u65e5"),"\uff09\uff0c\u4f46\u7ec6\u7a76\u8d77\u6765\u5b83\u4eec\u8fd8\u6709\u5982\u4e0b\u533a\u522b\uff1a"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"\u7c7b\u578b"),(0,i.kt)("th",{parentName:"tr",align:null},"\u5b58\u50a8\u957f\u5ea6"),(0,i.kt)("th",{parentName:"tr",align:null},"\u8303\u56f4"),(0,i.kt)("th",{parentName:"tr",align:null},"\u7cbe\u5ea6"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"datetime"),(0,i.kt)("td",{parentName:"tr",align:null},"8\u5b57\u8282"),(0,i.kt)("td",{parentName:"tr",align:null},"1000-01-01 00:00:00.000000\u52309999-12-31 23:59:59.999999"),(0,i.kt)("td",{parentName:"tr",align:null},"6")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"timestamp"),(0,i.kt)("td",{parentName:"tr",align:null},"4\u5b57\u8282"),(0,i.kt)("td",{parentName:"tr",align:null},"1970-01-01 00:00:01.000000\u52302038-01-19 03:14:07.999999"),(0,i.kt)("td",{parentName:"tr",align:null},"6")))),(0,i.kt)("p",null,"\u5f53TIMESTAMP\u5b57\u6bb5\u63d2\u5165\u4e00\u4e2a\u503c\u65f6\uff0c\u6839\u636e",(0,i.kt)("strong",{parentName:"p"},"\u5f53\u524d\u65f6\u533a"),"\u5c06\u63d2\u5165\u65f6\u95f4\u8f6c\u4e3aUTC\u65f6\u95f4\uff1b\u5f53\u8bfb\u53d6TIMESTAMP\u5b57\u6bb5\u503c\u65f6\uff0c\u53c8\u5c06UTC\u65f6\u95f4\u8f6c\u4e3a\u5ba2\u6237\u7aef\u5f53\u524d\u65f6\u533a\u8fd4\u56de\u3002",(0,i.kt)("strong",{parentName:"p"},"DATETIME\u5b58\u50a8\u503c\u4e0e\u65f6\u533a\u65e0\u5173"),"\u3002"),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"\u5173\u4e8e\u65f6\u95f4\u7cbe\u5ea6")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"DATETIME\u548cTIMESTAMP\u90fd\u7684\u7cbe\u5ea6\u90fd\u662f6\u4f4d\uff0c\u8868\u793a\u79d2\u7ea7\u53ef\u4ee5\u7cbe\u786e\u5230\u5c0f\u6570\u70b9\u540e6\u4f4d\uff0c\u4f46\u5728\u8f83\u65e9\u7684MySQL\u7248\u672c(5.6.5\u4e4b\u524d)\u4e2d\u79d2\u7ea7\u6ca1\u6709\u5c0f\u6570\u90e8\u5206\u3002"))))}d.isMDXComponent=!0},3905:function(t,e,n){n.d(e,{Zo:function(){return p},kt:function(){return d}});var r=n(7294);function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function i(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function l(t,e){if(null==t)return{};var n,r,a=function(t,e){if(null==t)return{};var n,r,a={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(a[n]=t[n]);return a}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(a[n]=t[n])}return a}var u=r.createContext({}),m=function(t){var e=r.useContext(u),n=e;return t&&(n="function"==typeof t?t(e):o(o({},e),t)),n},p=function(t){var e=m(t.components);return r.createElement(u.Provider,{value:e},t.children)},c={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},s=r.forwardRef((function(t,e){var n=t.components,a=t.mdxType,i=t.originalType,u=t.parentName,p=l(t,["components","mdxType","originalType","parentName"]),s=m(n),d=a,g=s["".concat(u,".").concat(d)]||s[d]||c[d]||i;return n?r.createElement(g,o(o({ref:e},p),{},{components:n})):r.createElement(g,o({ref:e},p))}));function d(t,e){var n=arguments,a=e&&e.mdxType;if("string"==typeof t||a){var i=n.length,o=new Array(i);o[0]=s;var l={};for(var u in e)hasOwnProperty.call(e,u)&&(l[u]=e[u]);l.originalType=t,l.mdxType="string"==typeof t?t:a,o[1]=l;for(var m=2;m<i;m++)o[m]=n[m];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"}}]);