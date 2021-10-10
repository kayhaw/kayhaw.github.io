"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[4807],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return u}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),p=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},m=function(e){var t=p(e.components);return a.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},s=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,c=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),s=p(n),u=r,v=s["".concat(c,".").concat(u)]||s[u]||d[u]||i;return n?a.createElement(v,o(o({ref:t},m),{},{components:n})):a.createElement(v,o({ref:t},m))}));function u(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=s;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var p=2;p<i;p++)o[p]=n[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}s.displayName="MDXCreateElement"},6524:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return m},default:function(){return s}});var a=n(7462),r=n(3366),i=(n(7294),n(3905)),o=["components"],l={title:"\u4f18\u5316\u6a21\u5f0f\u548c\u6570\u636e\u7c7b\u578b",permalink:"/HighPerformanceMySQL/chap4",tags:["MySQL","ReadingNotes"]},c=void 0,p={unversionedId:"\u9ad8\u6027\u80fdMySQL/HighPerformanceMySQL-Chap04",id:"\u9ad8\u6027\u80fdMySQL/HighPerformanceMySQL-Chap04",isDocsHomePage:!1,title:"\u4f18\u5316\u6a21\u5f0f\u548c\u6570\u636e\u7c7b\u578b",description:"\u300a\u9ad8\u6027\u80fdMySQL\u300b\u7b2c\u4e09\u7248\u7b2c\u56db\u7ae0\u8bfb\u4e66\u7b14\u8bb0",source:"@site/docs\\\u9ad8\u6027\u80fdMySQL\\HighPerformanceMySQL-Chap04.mdx",sourceDirName:"\u9ad8\u6027\u80fdMySQL",slug:"/\u9ad8\u6027\u80fdMySQL/HighPerformanceMySQL-Chap04",permalink:"/docs/\u9ad8\u6027\u80fdMySQL/HighPerformanceMySQL-Chap04",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/docs/\u9ad8\u6027\u80fdMySQL\\HighPerformanceMySQL-Chap04.mdx",tags:[{label:"MySQL",permalink:"/docs/tags/my-sql"},{label:"ReadingNotes",permalink:"/docs/tags/reading-notes"}],version:"current",frontMatter:{title:"\u4f18\u5316\u6a21\u5f0f\u548c\u6570\u636e\u7c7b\u578b",permalink:"/HighPerformanceMySQL/chap4",tags:["MySQL","ReadingNotes"]},sidebar:"tutorialSidebar",previous:{title:"\u7ebf\u7a0b\u5b89\u5168\u4e0e\u9501\u4f18\u5316",permalink:"/docs/\u6df1\u5165\u7406\u89e3Java\u865a\u62df\u673a/UnderstandJVM-Chap13"}},m=[{value:"\u9009\u62e9\u6700\u4f73\u6570\u636e\u7c7b\u578b",id:"\u9009\u62e9\u6700\u4f73\u6570\u636e\u7c7b\u578b",children:[{value:"\u6574\u6570",id:"\u6574\u6570",children:[]},{value:"\u5b9e\u6570",id:"\u5b9e\u6570",children:[]},{value:"\u5b57\u7b26\u4e32",id:"\u5b57\u7b26\u4e32",children:[]}]}],d={toc:m};function s(e){var t=e.components,n=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"\u300a\u9ad8\u6027\u80fdMySQL\u300b\u7b2c\u4e09\u7248\u7b2c\u56db\u7ae0\u8bfb\u4e66\u7b14\u8bb0"))),(0,i.kt)("h2",{id:"\u9009\u62e9\u6700\u4f73\u6570\u636e\u7c7b\u578b"},"\u9009\u62e9\u6700\u4f73\u6570\u636e\u7c7b\u578b"),(0,i.kt)("p",null,"\u5982\u4f55\u9009\u62e9\u6700\u4f73\u6570\u636e\u7c7b\u578b\uff0c\u9700\u8981\u9075\u5faa\u5982\u4e0b\u51e0\u70b9\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u66f4\u5c0f\u901a\u5e38\u66f4\u597d\uff1a\u4ece\u78c1\u76d8\u3001\u5185\u5b58\u3001CPU\u7f13\u5b58\u7684\u89d2\u5ea6\u6765\u8bf4\uff0c\u5728\u786e\u5b9a\u6570\u636e\u8303\u56f4\u7684\u60c5\u51b5\u4e0b\uff0c\u5e94\u8be5\u5c3d\u91cf\u9009\u62e9\u8303\u56f4\u6700\u5c0f\u7684\u6570\u636e\u7c7b\u578b"),(0,i.kt)("li",{parentName:"ul"},'\u7b80\u5355\u5c31\u662f\u597d\uff1a\u522b\u62ff"1"\u5f531\u7528\uff0c\u522b\u62ff\u5b57\u7b26\u4e32\u5b58\u50a8\u65f6\u95f4\u3001IP\u5730\u5740'),(0,i.kt)("li",{parentName:"ul"},"\u5c3d\u91cf\u907f\u514dNULL\uff1a\u9664\u975e\u6709\u7279\u5b9a\u610f\u56fe\uff0c\u9ed8\u8ba4\u7ed9\u5217\u52a0\u4e0anot null\u9650\u5236")),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"NULl\u5b57\u6bb5\u5230\u5e95\u5e26\u6765\u4ec0\u4e48\u5371\u5bb3\uff1f")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("ol",{parentName:"div"},(0,i.kt)("li",{parentName:"ol"},"\u7d22\u5f15\u3001\u7d22\u5f15\u7edf\u8ba1\u3001\u503c\u6bd4\u8f83\u8fc7\u7a0b\u66f4\u52a0\u590d\u6742"),(0,i.kt)("li",{parentName:"ol"},"Nullable\u5217\u9700\u8981\u989d\u5916\u5b58\u50a8\u7a7a\u95f4\u548c\u5904\u7406"),(0,i.kt)("li",{parentName:"ol"},"Nullable\u5217\u4f5c\u4e3a\u7d22\u5f15\u9700\u8981\u989d\u5916\u4e00\u4e2a\u5b57\u8282\uff0c\u5728MyISAM\u5b58\u50a8\u5f15\u64ce\u4e0b\u4f1a\u4f7f\u5b9a\u957f\u7d22\u5f15\u8f6c\u4e3a\u53d8\u957f\u7d22\u5f15")),(0,i.kt)("p",{parentName:"div"},"\ud83d\ude04\u4e0d\u8981\u6307\u671b\u4eceNULl\u5230NOT NULL\u4f1a\u5e26\u6765\u663e\u8457\u6027\u80fd\u63d0\u5347"))),(0,i.kt)("p",null,"\u63a5\u4e0b\u6765\u662f\u9009\u62e9\u66f4\u52a0\u5177\u4f53\u7684\u7c7b\u578b\u914d\u7f6e\uff0c\u6bd4\u5982\u6570\u503c\u7c7b\u578b\u9009\u62e9INT\u8fd8\u662fDECIMAL\uff0c\u65f6\u95f4\u7c7b\u578b\u9009\u62e9DATETIME\u8fd8\u662fTIMESTAMP\uff0c\u6309\u7167\u5927\u7c7b\u9010\u4e00\u4ecb\u7ecd\uff1a"),(0,i.kt)("h3",{id:"\u6574\u6570"},"\u6574\u6570"),(0,i.kt)("p",null,"MySQL\u63d0\u4f9bTINYINT\u3001SMALLINT\u3001MEDIUMINT\u3001INT\u4ee5\u53caBIGINT\uff0c\u4f9d\u6b21\u5bf9\u5e948\u300116\u300124\u300132\u300164\u4e8c\u8fdb\u5236\u4f4d\u957f\u5ea6\u7684\u6574\u6570\uff0c\u9ed8\u8ba4\u662f\u6709\u7b26\u53f7\u6574\u6570\uff08\u52a0\u4e0aUNSIGNED\u4e3a\u65e0\u7b26\u53f7\uff09"),(0,i.kt)("div",{className:"admonition admonition-warning alert alert--danger"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"}))),"\u663e\u793a\u957f\u5ea6INT(11)")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"\u6574\u6570\u58f0\u660e\u540e\u9762\u7684",(0,i.kt)("inlineCode",{parentName:"p"},"(n)"),"\u8868\u793a\u5b83\u7684\u663e\u793a\u957f\u5ea6\u800c\u4e0d\u662f\u53d6\u503c\u8303\u56f4\uff0c\u4ec5\u7528\u4e8eMySQL\u5ba2\u6237\u7aef\u663e\u793a\u683c\u5f0f"))),(0,i.kt)("h3",{id:"\u5b9e\u6570"},"\u5b9e\u6570"),(0,i.kt)("p",null,"\u53c8\u79f0\u6d6e\u70b9\u6570\uff0c\u4f46\u4e5f\u53ef\u7528\u6765\u5b58\u50a8\u6574\u6570(DECIMAL)\uff0cFLOAT\u548cDOUBLE\u5b58\u50a8\u4f1a\u6709\u7cbe\u5ea6\u4e22\u5931\uff0cDECIMAL\u4fdd\u5b58\u65f6\u7cbe\u5ea6\u66f4\u9ad8"),(0,i.kt)("p",null,"\u5b9e\u6570\u8fd8\u53ef\u4ee5\u6307\u5b9a\u957f\u5ea6\u548c\u7cbe\u5ea6\uff0c\u5bf9\u4e8eMySQL 5.0\u53ca\u5176\u4e4b\u540e\u7248\u672c\uff0c\u6bcf9\u4e2a\u6570\u5b57\u75284\u4e2a\u5b57\u8282\u5b58\u50a8\u3002\u6bd4\u5982",(0,i.kt)("inlineCode",{parentName:"p"},"DECIMAL(18, 9)"),"\uff0c\u5c0f\u6570\u70b9\u5de6\u8fb9\u670918-9=9\u4e2a\u6570\u5b57\uff0c\u9700\u89814\u4e2a\u5b57\u8282\uff0c\u5c0f\u6570\u70b9\u53f3\u8fb9\u67099\u4e2a\u6570\u5b57\uff0c\u4e5f\u9700\u89814\u4e2a\u5b57\u8282\uff0c\u52a0\u4e0a\u5c0f\u6570\u70b9\u9700\u8981\u4e00\u4e2a\u5b57\u8282\uff0c\u4e00\u51719\u4e2a\u5b57\u8282"),(0,i.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"DECIMAL\u548cDOUBLE")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},(0,i.kt)("strong",{parentName:"p"},"DECIMAL\u4ec5\u4ec5\u53ea\u662f\u4e00\u79cd\u5b58\u50a8\u683c\u5f0f\uff0c\u8868\u793a\u7cbe\u5ea6\u66f4\u51c6\u786e"),"\uff0c\u5728\u8ba1\u7b97\u65f6\u4f1a\u88ab\u8f6c\u4e3aDOUBLE\uff0c\u5728\u76f8\u540c\u8303\u56f4\u5185DECIMAL\u6bd4DOUBLE\u5360\u7528\u66f4\u5c11\u7a7a\u95f4"))),(0,i.kt)("h3",{id:"\u5b57\u7b26\u4e32"},"\u5b57\u7b26\u4e32"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"VARCHAR\uff1a\u5f53\u5b57\u7b26\u4e32\u957f\u5ea6\u5c0f\u4e8e255\u65f6\uff0c\u4f7f\u7528\u989d\u5916\u4e00\u4e2a\u5b57\u8282\u5b58\u50a8\u957f\u5ea6\uff0c\u7b49\u4e8e255\u65f6\u4f7f\u7528\u4e24\u4e2a\u5b57\u8282\u5b58\u50a8\u957f\u5ea6\u3002\u76f8\u6bd4\u4e8e\u5b9a\u957f\u5b57\u7b26\u4e32\u8282\u7701\u7a7a\u95f4\uff0c\u4f46\u662f\u5f53\u66f4\u65b0\u5b57\u7b26\u4e32\u65f6\uff0c\u9700\u8981\u91cd\u65b0\u5206\u914d\u7a7a\u95f4"),(0,i.kt)("li",{parentName:"ul"},"CHAR\uff1a\u5b9a\u957f\u5b57\u7b26\u4e32\uff0c")))}s.isMDXComponent=!0}}]);