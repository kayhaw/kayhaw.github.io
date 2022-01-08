"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[1726],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return u}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),s=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),h=s(n),u=a,d=h["".concat(l,".").concat(u)]||h[u]||m[u]||i;return n?r.createElement(d,o(o({ref:t},p),{},{components:n})):r.createElement(d,o({ref:t},p))}));function u(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=h;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,o[1]=c;for(var s=2;s<i;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"},2375:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return l},metadata:function(){return s},toc:function(){return p},default:function(){return h}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),o=["components"],c={layout:"article",title:"Apache Flink\u5f00\u53d1\u73af\u5883\u642d\u5efa",slug:"/Stream-Processing-with-Apache-Flink/Chap04",tags:["Stream Processing","Apache Flink","ReadingNotes"]},l=void 0,s={unversionedId:"Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap04",id:"Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap04",isDocsHomePage:!1,title:"Apache Flink\u5f00\u53d1\u73af\u5883\u642d\u5efa",description:"Stream Processing with Apache Flink \u7b2c4\u7ae0\u8bfb\u4e66\u7b14\u8bb0",source:"@site/docs/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap04.md",sourceDirName:"Stream Processing with Apache Flink",slug:"/Stream-Processing-with-Apache-Flink/Chap04",permalink:"/docs/Stream-Processing-with-Apache-Flink/Chap04",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/docs/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap04.md",tags:[{label:"Stream Processing",permalink:"/docs/tags/stream-processing"},{label:"Apache Flink",permalink:"/docs/tags/apache-flink"},{label:"ReadingNotes",permalink:"/docs/tags/reading-notes"}],version:"current",frontMatter:{layout:"article",title:"Apache Flink\u5f00\u53d1\u73af\u5883\u642d\u5efa",slug:"/Stream-Processing-with-Apache-Flink/Chap04",tags:["Stream Processing","Apache Flink","ReadingNotes"]},sidebar:"tutorialSidebar",previous:{title:"Apache Flink\u67b6\u6784",permalink:"/docs/Stream-Processing-with-Apache-Flink/Chap03"},next:{title:"DataStream API(v.14.0)",permalink:"/docs/Stream-Processing-with-Apache-Flink/Chap05"}},p=[{value:"\u6240\u9700\u8f6f\u4ef6",id:"\u6240\u9700\u8f6f\u4ef6",children:[]},{value:"\u5728IDE\u4e2d\u8fd0\u884c\u8c03\u8bd5Flink\u5e94\u7528",id:"\u5728ide\u4e2d\u8fd0\u884c\u8c03\u8bd5flink\u5e94\u7528",children:[{value:"\u5bfc\u5165\u6e90\u7801",id:"\u5bfc\u5165\u6e90\u7801",children:[]}]}],m={toc:p};function h(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},(0,i.kt)("em",{parentName:"p"},"Stream Processing with Apache Flink")," \u7b2c4\u7ae0\u8bfb\u4e66\u7b14\u8bb0"))),(0,i.kt)("h2",{id:"\u6240\u9700\u8f6f\u4ef6"},"\u6240\u9700\u8f6f\u4ef6"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"JDK 8+"),(0,i.kt)("li",{parentName:"ul"},"Apache Maven 3.x"),(0,i.kt)("li",{parentName:"ul"},"IntelliJ IDEA")),(0,i.kt)("h2",{id:"\u5728ide\u4e2d\u8fd0\u884c\u8c03\u8bd5flink\u5e94\u7528"},"\u5728IDE\u4e2d\u8fd0\u884c\u8c03\u8bd5Flink\u5e94\u7528"),(0,i.kt)("h3",{id:"\u5bfc\u5165\u6e90\u7801"},"\u5bfc\u5165\u6e90\u7801"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"\u6253\u5f00IDEA\uff0c\u4f9d\u6b21\u9009\u62e9File->New->Get from Version Control"),(0,i.kt)("li",{parentName:"ol"},"\u8f93\u5165\u4ee3\u7801\u4ed3\u5e93\u5730\u5740",(0,i.kt)("inlineCode",{parentName:"li"},"git@github.com:streaming-with-flink/examples-java.git")),(0,i.kt)("li",{parentName:"ol"})))}h.isMDXComponent=!0}}]);