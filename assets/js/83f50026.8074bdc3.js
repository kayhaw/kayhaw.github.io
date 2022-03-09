"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[3433],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return m}});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var o=a.createContext({}),p=function(e){var t=a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},s=function(e){var t=p(e.components);return a.createElement(o.Provider,{value:t},e.children)},h={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,o=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),u=p(n),m=i,k=u["".concat(o,".").concat(m)]||u[m]||h[m]||r;return n?a.createElement(k,l(l({ref:t},s),{},{components:n})):a.createElement(k,l({ref:t},s))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,l=new Array(r);l[0]=u;var c={};for(var o in t)hasOwnProperty.call(t,o)&&(c[o]=t[o]);c.originalType=e,c.mdxType="string"==typeof e?e:i,l[1]=c;for(var p=2;p<r;p++)l[p]=n[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},1701:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return o},metadata:function(){return p},assets:function(){return s},toc:function(){return h},default:function(){return m}});var a=n(3117),i=n(102),r=(n(7294),n(3905)),l=["components"],c={layout:"article",title:"\u72b6\u6001\u6d41\u5904\u7406\u7b80\u4ecb",slug:"/Stream-Processing-with-Apache-Flink/Chap01",tags:["Stream Processing","Apache Flink","ReadingNotes"]},o=void 0,p={unversionedId:"Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap01",id:"Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap01",title:"\u72b6\u6001\u6d41\u5904\u7406\u7b80\u4ecb",description:"Stream Processing with Apache Flink \u7b2c1\u7ae0\u8bfb\u4e66\u7b14\u8bb0",source:"@site/docs/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap01.md",sourceDirName:"Stream Processing with Apache Flink",slug:"/Stream-Processing-with-Apache-Flink/Chap01",permalink:"/docs/Stream-Processing-with-Apache-Flink/Chap01",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/docs/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap01.md",tags:[{label:"Stream Processing",permalink:"/docs/tags/stream-processing"},{label:"Apache Flink",permalink:"/docs/tags/apache-flink"},{label:"ReadingNotes",permalink:"/docs/tags/reading-notes"}],version:"current",frontMatter:{layout:"article",title:"\u72b6\u6001\u6d41\u5904\u7406\u7b80\u4ecb",slug:"/Stream-Processing-with-Apache-Flink/Chap01",tags:["Stream Processing","Apache Flink","ReadingNotes"]},sidebar:"tutorialSidebar",previous:{title:"Getting the Message Across",permalink:"/docs/Learning Akka/LearningAkka-Chap03"},next:{title:"\u6d41\u5904\u7406\u57fa\u7840",permalink:"/docs/Stream-Processing-with-Apache-Flink/Chap02"}},s={},h=[{value:"\u4f20\u7edf\u6570\u636e\u67b6\u6784",id:"\u4f20\u7edf\u6570\u636e\u67b6\u6784",level:2},{value:"\u4e8b\u52a1\u578b\u5904\u7406",id:"\u4e8b\u52a1\u578b\u5904\u7406",level:3},{value:"\u5206\u6790\u578b\u5904\u7406",id:"\u5206\u6790\u578b\u5904\u7406",level:3},{value:"\u72b6\u6001\u6d41\u5904\u7406",id:"\u72b6\u6001\u6d41\u5904\u7406",level:2},{value:"\u4e8b\u4ef6\u9a71\u52a8\u578b\u5e94\u7528",id:"\u4e8b\u4ef6\u9a71\u52a8\u578b\u5e94\u7528",level:3},{value:"\u6570\u636e\u6d41\u6c34\u7ebf",id:"\u6570\u636e\u6d41\u6c34\u7ebf",level:3},{value:"\u6d41\u6570\u636e\u5206\u6790",id:"\u6d41\u6570\u636e\u5206\u6790",level:3},{value:"\u6d41\u5904\u7406\u7684\u6f14\u53d8",id:"\u6d41\u5904\u7406\u7684\u6f14\u53d8",level:2}],u={toc:h};function m(e){var t=e.components,n=(0,i.Z)(e,l);return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},(0,r.kt)("em",{parentName:"p"},"Stream Processing with Apache Flink")," \u7b2c1\u7ae0\u8bfb\u4e66\u7b14\u8bb0"))),(0,r.kt)("h2",{id:"\u4f20\u7edf\u6570\u636e\u67b6\u6784"},"\u4f20\u7edf\u6570\u636e\u67b6\u6784"),(0,r.kt)("p",null,"\u4f20\u7edf\u6570\u636e\u67b6\u6784\u5904\u7406\u6570\u636e\u7684\u65b9\u5f0f\u5206\u4e3a\u4e24\u79cd\uff1a\u4e8b\u52a1\u578b\u5904\u7406(Transactional Processing)\u548c\u5206\u6790\u578b\u5904\u7406(Analytical Processing)\u3002"),(0,r.kt)("h3",{id:"\u4e8b\u52a1\u578b\u5904\u7406"},"\u4e8b\u52a1\u578b\u5904\u7406"),(0,r.kt)("p",null,"\u4ee5ERP\u3001CRM\u548cWeb\u5e94\u7528\u4e3a\u4ee3\u8868\uff0c\u4f20\u7edf\u67b6\u6784\u5982\u4e0b\u56fe\u6240\u793a\uff1a"),(0,r.kt)("img",{style:{width:"50%",height:"50%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap01/Transactional-Application.png",alt:"Transactional Application"}),(0,r.kt)("p",null,"\u7279\u70b9\uff1a\u7531\u4e8b\u4ef6(Event)\u89e6\u53d1\uff0c\u57fa\u4e8e\u540e\u53f0\u6570\u636e\u5e93\u7cfb\u7edf\u7684\u4e8b\u52a1\u8fdb\u884c\u6570\u636e\u589e\u5220\u6539\u67e5\u3002\u901a\u5e38\u4e00\u4e2a\u6570\u636e\u5e93\u7cfb\u7edf\u670d\u52a1\u591a\u4e2a\u5e94\u7528\uff0c\u8fd9\u4e9b\u5e94\u7528\u53ef\u80fd\u8bbf\u95ee\u76f8\u540c\u5e93\u8868\u3002"),(0,r.kt)("p",null,"\u7f3a\u70b9\uff1a\u968f\u7740\u5e94\u7528\u7684\u6f14\u5316\u6269\u5c55\uff0c\u6539\u53d8\u5e93\u8868\u8bbe\u8ba1\u6216\u8005\u6269\u5c55\u6570\u636e\u5e93\u8d39\u52b2\u3002\u4e00\u79cd\u89e3\u51b3\u65b9\u5f0f\u662f\u5fae\u670d\u52a1(Microservice)\u89e3\u8026\uff0c\u670d\u52a1\u4e4b\u95f4\u4f7f\u7528REST\u7684HTTP\u901a\u4fe1\uff0c\u5982\u4e0b\u56fe\u6240\u793a\uff1a"),(0,r.kt)("img",{style:{width:"50%",height:"50%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap01/Microservices-architecture.png",alt:"Microservices Architecture"}),(0,r.kt)("h3",{id:"\u5206\u6790\u578b\u5904\u7406"},"\u5206\u6790\u578b\u5904\u7406"),(0,r.kt)("p",null,"\u4e8b\u52a1\u578b\u6570\u636e\u5206\u5e03\u5728\u5404\u4e2a\u4e92\u76f8\u72ec\u7acb\u7684\u6570\u636e\u5e93\u4e2d\uff0c\u9700\u8981\u5c06\u5b83\u4eec\u96c6\u4e2d\u8f6c\u4e3a\u7edf\u4e00\u683c\u5f0f\u540e\u5206\u6790\u4ea7\u751f\u66f4\u5927\u4ef7\u503c\uff0c\u67b6\u6784\u5982\u4e0b\u6240\u793a\uff1a"),(0,r.kt)("img",{style:{width:"50%",height:"50%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap01/Data-Warehouse-Architecture.png",alt:"Data Warehouse Architecture"}),(0,r.kt)("p",null,"\u9996\u5148\u901a\u8fc7ETL(Extract-Transform-Load)\u5c06\u5206\u6563\u7684\u6570\u636e\u590d\u5236\u5230\u6570\u636e\u4ed3\u5e93(Data Warehouse)\u4e2d\uff0c\u7136\u540e\u8fdb\u884c\u5206\u6790\u3002\u901a\u5e38\uff0c\u57fa\u4e8e\u6570\u636e\u4ed3\u5e93\u7684\u67e5\u8be2\u5206\u6790\u6709\u4e24\u79cd\uff1a"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Periodic report query\uff1a\u5468\u671f\u62a5\u544a\u67e5\u8be2\uff0c\u8ba1\u7b97\u5546\u4e1a\u76f8\u5173\u7edf\u8ba1\u6307\u6807\u5982\u8425\u6536\u3001\u7528\u6237\u589e\u957f\u7b49\uff1b"),(0,r.kt)("li",{parentName:"ol"},"Ad-hoc query\uff1a\u70ed\u70b9\u67e5\u8be2\uff0c\u7528\u4e8e\u56de\u7b54\u7279\u5b9a\u95ee\u9898\u5982\u5e7f\u544a\u7684\u6536\u5165\u548c\u652f\u51fa\u6bd4\u4f8b\u3002")),(0,r.kt)("h2",{id:"\u72b6\u6001\u6d41\u5904\u7406"},"\u72b6\u6001\u6d41\u5904\u7406"),(0,r.kt)("p",null,"\u51e0\u4e4e\u6240\u6709\u6570\u636e\u4ee5\u4e8b\u4ef6\u6d41\u7684\u5f62\u5f0f\u4ea7\u751f\uff0c\u800c\u4e0d\u662f\u4e00\u6b21\u4ea7\u751f\u6709\u9650\u7684\u6570\u636e\u96c6(Dataset)\u3002",(0,r.kt)("strong",{parentName:"p"},"\u72b6\u6001\u6d41\u5904\u7406"),"\u6307\u5904\u7406\u65e0\u754c\u6570\u636e\u6d41\u7684\u5e94\u7528\u8bbe\u8ba1\u6a21\u5f0f\uff0c\u5e76\u4e14\u9700\u8981\u4fdd\u5b58\u5e94\u7528\u72b6\u6001\u3002"),(0,r.kt)("p",null,"Flink\u5c06\u5e94\u7528\u72b6\u6001\u4fdd\u5b58\u5728\u672c\u5730\u5185\u5b58\u6216\u8005\u5d4c\u5165\u5f0f\u6570\u636e\u5e93\uff0c\u7531\u4e8eFlink\u662f\u5206\u5e03\u5f0f\u7684\uff0c\u5b83\u901a\u8fc7\u6301\u4e45\u5316",(0,r.kt)("strong",{parentName:"p"},"\u4e00\u81f4\u6027\u68c0\u67e5\u70b9"),"\u5230\u8fdc\u7a0b\u5b58\u50a8\u6765\u4fdd\u8bc1\u5bb9\u9519\u6027\u3002\u4e00\u4e2aFlink\u5e94\u7528\u7684\u72b6\u6001\u6d41\u5904\u7406\u8fc7\u7a0b\u5982\u4e0b\u56fe\u6240\u793a\uff1a"),(0,r.kt)("img",{style:{width:"50%",height:"50%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap01/A-Stateful-Streaming-Application.png",alt:"A Stateful Streaming Application"}),(0,r.kt)("p",null,"\u4e0b\u9762\u4ecb\u7ecd3\u79cd\u5178\u578b\u7684\u6d41\u5904\u7406\u5e94\u7528\uff1a\u4e8b\u4ef6\u9a71\u52a8\u578b\u5e94\u7528\u3001\u6570\u636e\u6d41\u6c34\u7ebf\u578b\u5e94\u7528\u548c\u6570\u636e\u5206\u6790\u578b\u5e94\u7528\u3002"),(0,r.kt)("h3",{id:"\u4e8b\u4ef6\u9a71\u52a8\u578b\u5e94\u7528"},"\u4e8b\u4ef6\u9a71\u52a8\u578b\u5e94\u7528"),(0,r.kt)("p",null,"\u5178\u578b\u7684\u6570\u636e\u9a71\u52a8\u578b\u5e94\u7528\u5305\u62ec\uff1a"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u5b9e\u65f6\u63a8\u8350"),(0,r.kt)("li",{parentName:"ul"},"\u6a21\u5f0f\u68c0\u6d4b\u6216\u8005\u590d\u6742\u4e8b\u4ef6\u5904\u7406"),(0,r.kt)("li",{parentName:"ul"},"\u5f02\u5e38\u68c0\u6d4b")),(0,r.kt)("p",null,"\u4e8b\u4ef6\u9a71\u52a8\u578b\u5e94\u7528\u662f\u5fae\u670d\u52a1\u7684\u4e00\u79cd\u6f14\u53d8\u4f53\uff1a\u901a\u4fe1\u4f7f\u7528\u4e8b\u4ef6\u65e5\u5fd7\u800c\u4e0d\u662fREST\u8c03\u7528\uff0c\u6570\u636e\u4fdd\u5b58\u4e3a\u5e94\u7528",(0,r.kt)("strong",{parentName:"p"},"\u672c\u5730\u72b6\u6001"),"\u800c\u4e0d\u662f\u4fdd\u5b58\u5230",(0,r.kt)("strong",{parentName:"p"},"\u5916\u90e8"),"\u6570\u636e\u6e90(\u5982MySQL\u6570\u636e\u5e93\u3001Redis)\u3002\u6570\u636e\u9a71\u52a8\u578b\u5e94\u7528\u67b6\u6784\u5982\u4e0b\u6240\u793a\uff1a"),(0,r.kt)("img",{style:{width:"50%",height:"50%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap01/An-Event-driven-Application-Architecture.png",alt:"An event-driven application architecture"}),(0,r.kt)("p",null,"\u76f8\u6bd4\u4e8e\u4f20\u7edf\u5e94\u7528\u6216\u8005\u5fae\u670d\u52a1\uff0c\u4e8b\u4ef6\u9a71\u52a8\u578b\u5e94\u7528\u4f18\u52bf\uff1a"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"\u83b7\u53d6\u672c\u5730\u72b6\u6001\u7684\u6027\u80fd\u4f18\u4e8e\u83b7\u53d6\u8fdc\u7a0b\u6570\u636e\u6e90"),(0,r.kt)("li",{parentName:"ol"},"\u6269\u5c55\u548c\u5bb9\u9519\u7531\u6d41\u5904\u7406\u5668(Stream Processor,\u975e\u786c\u4ef6\u4e0a\u6982\u5ff5)\u5904\u7406"),(0,r.kt)("li",{parentName:"ol"},"\u5229\u7528\u4e8b\u4ef6\u65e5\u5fd7\u4f5c\u4e3a\u8f93\u5165\u7684\u4f18\u52bf\uff1a\u53ef\u9760\u3001\u53ef\u91cd\u653e(replay)"),(0,r.kt)("li",{parentName:"ol"},"\u901a\u8fc7\u68c0\u67e5\u70b9\u91cd\u7f6e\u5e94\u7528\u72b6\u6001\uff0c\u8be5\u5347\u7ea7\u6216\u6269\u5c55\u5e94\u7528\u65f6\u4e0d\u4f1a\u4e22\u5931\u72b6\u6001")),(0,r.kt)("p",null,"\u4f46\u4e3a\u4e86\u5b9e\u73b0\u4e0a\u8ff0\u7684\u7279\u6027\uff0c\u4e8b\u4ef6\u9a71\u52a8\u578b\u5e94\u7528\u5bf9\u6d41\u5904\u7406\u5668\u6709\u7740\u9ad8\u8981\u6c42\uff1a\u6bd4\u5982\u63d0\u4f9b\u7684API\u548c\u72b6\u6001\u539f\u8bed(State Primitives)\u3002\u6b64\u5916\uff0c\u201c\u7cbe\u51c6\u4e00\u6b21\u201d\u7684\u72b6\u6001\u4e00\u81f4\u6027\u548c\u6269\u5c55\u80fd\u529b\u662f\u4e8b\u4ef6\u9a71\u52a8\u578b\u5e94\u7528\u7684\u57fa\u672c\u8981\u6c42\uff0c\u6bd4\u5982\u8bf4Flink\u5c31\u5f88\u597d\u5730\u6ee1\u8db3\u8fd9\u4e9b\u6761\u4ef6\ud83d\ude0a\u3002"),(0,r.kt)("h3",{id:"\u6570\u636e\u6d41\u6c34\u7ebf"},"\u6570\u636e\u6d41\u6c34\u7ebf"),(0,r.kt)("p",null,"\u5f53\u524d\u7684\u6570\u636e\u5b58\u50a8\u4f7f\u7528\u4e0d\u540c\u7684\u7cfb\u7edf\u5c06\u6570\u636e\u7528\u4e0d\u540c\u7684\u7ed3\u6784\u4fdd\u5b58\u8d77\u6765\uff0c\u4ee5\u5728\u7279\u5b9a\u8bbf\u95ee\u6a21\u5f0f\u7684\u83b7\u53d6\u6700\u4f73\u6027\u80fd\u3002\u540c\u6b65\u8fd9\u4e9b\u5b58\u50a8\u6570\u636e\u7684\u4f20\u7edf\u65b9\u5f0f\u662f\u7528\u5468\u671f\u6027ETL\u4f5c\u4e1a\uff0c\u4e3a\u4e86\u6ee1\u8db3\u4f4e\u5ef6\u8fdf\u8981\u6c42\uff0c\u4e00\u79cd\u66ff\u4ee3\u65b9\u5f0f\u662f\u4f7f\u7528\u4e8b\u4ef6\u65e5\u5fd7\u53d1\u5e03\u66f4\u65b0\u3002"),(0,r.kt)("p",null,"\u5728\u4f4e\u5ef6\u8fdf\u4e0b\u83b7\u53d6\u3001\u8f6c\u5316\u3001\u63d2\u5165\u6570\u636e\u662f\u72b6\u6001\u6d41\u5904\u7406\u7a0b\u5e8f\u7684\u53e6\u4e00\u79cd\u4f7f\u7528\u573a\u666f\uff0c\u8fd9\u79cd\u7a0b\u5e8f\u79f0\u4e4b\u4e3a\u6570\u636e\u6d41\u6c34\u7ebf(Data Pipeline)\uff0c\u5b83\u8981\u5728\u77ed\u65f6\u95f4\u5185\u5b8c\u6210\u5927\u91cf\u6570\u636e\u540c\u6b65\uff0c\u5e76\u80fd\u652f\u6301\u4e0d\u540c\u6570\u636e\u6e90\u8bfb\u5199\uff0cFlink\u518d\u4e00\u6b21\u5730\u6ee1\u8db3\u8fd9\u4e9b\u6761\u4ef6\ud83d\ude04\u3002"),(0,r.kt)("h3",{id:"\u6d41\u6570\u636e\u5206\u6790"},"\u6d41\u6570\u636e\u5206\u6790"),(0,r.kt)("p",null,"\u6570\u636e\u6d41\u6c34\u7ebf\u9700\u8981\u7b49\u5f85\u5468\u671f\u6027\u4e8b\u4ef6\u89e6\u53d1\uff0c\u800c\u6d41\u5206\u6790\u578b\u5e94\u7528\u4e0d\u65ad\u5730\u83b7\u53d6\u4e8b\u4ef6\uff0c\u5e76\u6839\u636e\u6700\u65b0\u4e8b\u4ef6\u66f4\u65b0\u7ed3\u679c\u6765\u5b9e\u73b0\u4f4e\u5ef6\u8fdf\u3002\u901a\u5e38\u628a\u7ed3\u679c\u5b58\u5728\u652f\u6301\u9ad8\u6548\u66f4\u65b0\u7684\u5916\u90e8\u6570\u636e\u5b58\u50a8\uff0c\u5982\u6570\u636e\u5e93\u548cRedis\uff0c\u5982\u4e0b\u56fe\u6240\u793a\uff1a"),(0,r.kt)("img",{style:{width:"50%",height:"50%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap01/A-Streaming-Analytics-Application.png",alt:"A streaming analytics application"}),(0,r.kt)("p",null,"\u6d41\u5206\u6790\u5e94\u7528\u901a\u5e38\u7528\u4e8e\u5206\u6790\u79fb\u52a8\u5e94\u7528\u7684\u7528\u6237\u884c\u4e3a\uff0c\u6d88\u8d39\u8005\u5b9e\u65f6\u6570\u636e\u5206\u6790\u7b49"),(0,r.kt)("h2",{id:"\u6d41\u5904\u7406\u7684\u6f14\u53d8"},"\u6d41\u5904\u7406\u7684\u6f14\u53d8"),(0,r.kt)("p",null,"\u6570\u636e\u6d41\u5904\u7406\u5e76\u4e0d\u662f\u65b0\u5174\u6280\u672f\uff0c\u4e0b\u9762\u4ecb\u7ecd\u5f00\u6e90\u6d41\u5904\u7406\u6280\u672f\u7684\u53d1\u5c55\u5386\u7a0b\uff1a"),(0,r.kt)("p",null,"\u7b2c\u4e00\u4ee3\u6570\u636e\u6d41\u5904\u7406\u67b6\u6784\u4ee5\u7ed3\u679c\u51c6\u786e\u6027\u6362\u533a\u4f4e\u5ef6\u8fdf\uff0c\u5904\u7406\u7ed3\u679c\u4f9d\u8d56\u4e8e\u4e8b\u4ef6\u5230\u8fbe\u7684\u987a\u5e8f\u548c\u65f6\u95f4\u3002\u800c\u6279\u5904\u7406\u9ad8\u5ef6\u8fdf\u4f46\u7ed3\u679c\u51c6\u786e\uff0c\u7531\u6b64\u8bde\u751f\u4e86\u7ed3\u5408\u4e24\u8005\u7684lambda\u67b6\u6784\uff0c\u5982\u4e0b\u56fe\u6240\u793a\uff1a"),(0,r.kt)("img",{style:{width:"50%",height:"50%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap01/Lambda-Architecture.png",alt:"The lambda architecture"}),(0,r.kt)("p",null,"\u5728lambda\u67b6\u6784\u4e2d\uff0c\u6570\u636e\u5904\u7406\u5206\u4e3a\u7ed3\u679c\u4e0d\u51c6\u786e\u7684\u52a0\u901f\u5c42\u548c\u7ed3\u679c\u51c6\u786e\u7684\u6279\u5904\u7406\u5c42\u3002\u6d41\u5904\u7406\u5f97\u5230\u7684\u7ed3\u679c\u548c\u6279\u5904\u7406\u7ed3\u679c\u5206\u522b\u5b58\u653e\uff0c\u5c06\u4e24\u8005\u5408\u5e76\u5f97\u5230\u6700\u7ec8\u7ed3\u679c\u3002lambda\u67b6\u6784\u7684\u7f3a\u70b9\uff1a"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"\u9700\u8981\u75282\u79cd\u4e0d\u540cAPI\u5b9e\u73b0\u76f8\u540c\u903b\u8f91\u7684\u529f\u80fd"),(0,r.kt)("li",{parentName:"ol"},"\u6d41\u5904\u7406\u5668\u7684\u8ba1\u7b97\u7ed3\u679c\u53ea\u662f\u5927\u6982\u7684"),(0,r.kt)("li",{parentName:"ol"},"\u96be\u4ee5\u642d\u5efa\u548c\u7ef4\u62a4")),(0,r.kt)("p",null,"\u7b2c\u4e8c\u4ee3\u6d41\u5904\u7406\u6280\u672f\u5728\u4ee5\u79d2\u7ea7\u5ef6\u65f6\u4e3a\u4ee3\u4ef7\uff0c\u63d0\u5347\u4e86\u541e\u5410\u7387\u548c\u5bb9\u9519\u6027\uff0c\u4f46\u7ed3\u679c\u8fd8\u662f\u4f9d\u8d56\u4e8b\u4ef6\u65f6\u95f4\u548c\u987a\u5e8f\u3002"),(0,r.kt)("p",null,"\u7b2c\u4e09\u4ee3\u67b6\u6784\u5904\u7406\u4e86\u65f6\u95f4\u5230\u8fbe\u65f6\u95f4\u548c\u987a\u5e8f\u5bf9\u7ed3\u679c\u7684\u5f71\u54cd\uff0c\u7ed3\u5408exactly-once\u5931\u8d25\u8bed\u4e49\uff0c\u80fd\u591f\u8ba1\u7b97\u4e00\u81f4\u548c\u7cbe\u51c6\u7684\u7ed3\u679c\u3002\u6b64\u5916\u76f8\u6bd4\u4e8e\u7b2c\u4e8c\u4ee3\uff0c\u517c\u987e\u9ad8\u541e\u5410\u7387\u548c\u4f4e\u5ef6\u8fdf\uff0c\u6dd8\u6c70\u4e86lambda\u67b6\u6784\ud83d\ude0f\u3002"))}m.isMDXComponent=!0}}]);