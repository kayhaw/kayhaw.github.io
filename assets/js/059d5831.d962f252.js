"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[5300],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return g}});var i=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=i.createContext({}),c=function(e){var t=i.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},s=function(e){var t=c(e.components);return i.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},h=i.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,p=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),h=c(n),g=a,k=h["".concat(p,".").concat(g)]||h[g]||m[g]||r;return n?i.createElement(k,l(l({ref:t},s),{},{components:n})):i.createElement(k,l({ref:t},s))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,l=new Array(r);l[0]=h;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var c=2;c<r;c++)l[c]=n[c];return i.createElement.apply(null,l)}return i.createElement.apply(null,n)}h.displayName="MDXCreateElement"},3290:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return o},contentTitle:function(){return p},metadata:function(){return c},toc:function(){return s},default:function(){return h}});var i=n(7462),a=n(3366),r=(n(7294),n(3905)),l=["components"],o={layout:"article",title:"\u6d41\u5904\u7406\u57fa\u7840",permalink:"/Stream-Processing-with-Apache-Flink/Chap02",tags:["Stream Processing","Apache Flink","ReadingNotes"]},p=void 0,c={unversionedId:"Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap02",id:"Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap02",isDocsHomePage:!1,title:"\u6d41\u5904\u7406\u57fa\u7840",description:"Stream Processing with Apache Flink \u7b2c2\u7ae0\u8bfb\u4e66\u7b14\u8bb0",source:"@site/docs/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap02.md",sourceDirName:"Stream Processing with Apache Flink",slug:"/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap02",permalink:"/docs/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap02",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/docs/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap02.md",tags:[{label:"Stream Processing",permalink:"/docs/tags/stream-processing"},{label:"Apache Flink",permalink:"/docs/tags/apache-flink"},{label:"ReadingNotes",permalink:"/docs/tags/reading-notes"}],version:"current",frontMatter:{layout:"article",title:"\u6d41\u5904\u7406\u57fa\u7840",permalink:"/Stream-Processing-with-Apache-Flink/Chap02",tags:["Stream Processing","Apache Flink","ReadingNotes"]},sidebar:"tutorialSidebar",previous:{title:"\u72b6\u6001\u6d41\u5904\u7406\u7b80\u4ecb",permalink:"/docs/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap01"},next:{title:"\u7ebf\u7a0b\u5b89\u5168\u6027",permalink:"/docs/Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218/Java-Concurrency-in-Practice-Chap02"}},s=[{value:"\u6570\u636e\u6d41\u7f16\u7a0b\u7b80\u4ecb",id:"\u6570\u636e\u6d41\u7f16\u7a0b\u7b80\u4ecb",children:[{value:"\u6570\u636e\u6d41\u56fe",id:"\u6570\u636e\u6d41\u56fe",children:[]},{value:"\u6570\u636e\u5e76\u884c\u548c\u4efb\u52a1\u5e76\u884c",id:"\u6570\u636e\u5e76\u884c\u548c\u4efb\u52a1\u5e76\u884c",children:[]},{value:"\u6570\u636e\u4ea4\u6362\u7b56\u7565",id:"\u6570\u636e\u4ea4\u6362\u7b56\u7565",children:[]}]},{value:"\u5e76\u884c\u6d41\u5904\u7406",id:"\u5e76\u884c\u6d41\u5904\u7406",children:[{value:"\u5ef6\u8fdf\u548c\u541e\u5410\u91cf",id:"\u5ef6\u8fdf\u548c\u541e\u5410\u91cf",children:[]},{value:"\u6570\u636e\u6d41\u64cd\u4f5c",id:"\u6570\u636e\u6d41\u64cd\u4f5c",children:[]}]},{value:"\u65f6\u95f4\u8bed\u4e49",id:"\u65f6\u95f4\u8bed\u4e49",children:[{value:"1\u5206\u949f\u7684\u542b\u4e49",id:"1\u5206\u949f\u7684\u542b\u4e49",children:[]},{value:"\u5904\u7406\u65f6\u95f4",id:"\u5904\u7406\u65f6\u95f4",children:[]},{value:"\u4e8b\u4ef6\u65f6\u95f4",id:"\u4e8b\u4ef6\u65f6\u95f4",children:[]}]}],m={toc:s};function h(e){var t=e.components,n=(0,a.Z)(e,l);return(0,r.kt)("wrapper",(0,i.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},(0,r.kt)("em",{parentName:"p"},"Stream Processing with Apache Flink")," \u7b2c2\u7ae0\u8bfb\u4e66\u7b14\u8bb0"))),(0,r.kt)("h2",{id:"\u6570\u636e\u6d41\u7f16\u7a0b\u7b80\u4ecb"},"\u6570\u636e\u6d41\u7f16\u7a0b\u7b80\u4ecb"),(0,r.kt)("p",null,"\u4ecb\u7ecd\u4e00\u4e9b\u6570\u636e\u6d41\u7f16\u7a0b\u7684\u672f\u8bed\u53ca\u5176\u6982\u5ff5"),(0,r.kt)("h3",{id:"\u6570\u636e\u6d41\u56fe"},"\u6570\u636e\u6d41\u56fe"),(0,r.kt)("p",null,"\u6570\u636e\u6d41\u7a0b\u5e8f\u7531",(0,r.kt)("strong",{parentName:"p"},"*\u6570\u636e\u6d41\u56fe(Dataflow Graph)"),"\u8868\u793a\uff0c\u8282\u70b9\u79f0\u4e3a",(0,r.kt)("strong",{parentName:"p"},"\u7b97\u5b50(Operator)"),"\uff0c\u8fb9\u8868\u793a\u6570\u636e\u4f9d\u8d56\u3002\u7b97\u5b50\u63a5\u6536\u8f93\u5165\u6570\u636e\uff0c\u6267\u884c\u8ba1\u7b97\u7136\u540e\u8f93\u51fa\u6570\u636e\u3002\u7279\u522b\u5730\uff0c\u53ea\u8f93\u51fa\u6ca1\u6709\u8f93\u5165\u7684\u7b97\u5b50\u79f0\u4e4b\u4e3a",(0,r.kt)("strong",{parentName:"p"},"\u6570\u636e\u6e90(Data Source)"),"\uff0c\u800c\u53ea\u6709\u8f93\u5165\u6ca1\u6709\u8f93\u51fa\u7684\u7b97\u5b50\u79f0\u4e4b\u4e3a",(0,r.kt)("strong",{parentName:"p"},"\u6570\u636e\u69fd(Data Sink)"),"\uff0c\u4e00\u4e2a\u6570\u636e\u6d41\u7a0b\u5e8f\u81f3\u5c11\u5305\u542b\u4e00\u4e2a\u6570\u636e\u6e90\u548c\u6570\u636e\u6d41\u3002\u5982\u4e0b\u56fe\u6240\u793a\u4e3a\u4e00\u4e2a\u63d0\u53d6\u7edf\u8ba1\u63a8\u7279\u5173\u952e\u5b57\u4e2a\u6570\u7684\u6570\u636e\u6d41\u7a0b\u5e8f\uff1a"),(0,r.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap02/A-Logical-Dataflow-Graph-Example.png",title:"A Logical Dataflow Graph Example"}),(0,r.kt)("p",null,"\u4e0a\u56fe\u79f0\u4e4b\u4e3a",(0,r.kt)("strong",{parentName:"p"},"\u903b\u8f91\u6570\u636e\u6d41\u56fe(Logic Dataflow Graph)"),"\uff0c\u5b83\u8868\u793a\u6570\u636e\u6d41\u7a0b\u5e8f\u9ad8\u5c42\u7684\u8ba1\u7b97\u903b\u8f91\u89c6\u56fe\u3002\u5f53\u4f7f\u7528\u5206\u5e03\u5f0f\u5904\u7406\u5f15\u64ce\u8ba1\u7b97\u65f6\uff0c\u6bcf\u4e2a\u7b97\u5b50\u7531\u51e0\u4e2a\u5728\u4e0d\u540c\u7269\u7406\u673a\u4e0a\u7684\u4efb\u52a1\u5e76\u884c\u6267\u884c\uff0c\u6b64\u65f6\u4f7f\u7528\u5982\u4e0b\u56fe\u6240\u793a\u7684",(0,r.kt)("strong",{parentName:"p"},"\u7269\u7406\u6570\u636e\u6d41\u56fe(Physical Dataflow Graph)"),"\u6765\u8868\u793a\u6570\u636e\u6d41\u7a0b\u5e8f\u3002\u7269\u7406\u6570\u636e\u6d41\u56fe\u4e0a\u7684\u6bcf\u4e2a\u8282\u70b9\u8868\u793a\u4e00\u4e2a",(0,r.kt)("strong",{parentName:"p"},"\u4efb\u52a1(Task)"),"\u3002"),(0,r.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap02/A-Physical-Dataflow-Graph-Example.png",title:"A Physical Dataflow Graph Example"}),(0,r.kt)("h3",{id:"\u6570\u636e\u5e76\u884c\u548c\u4efb\u52a1\u5e76\u884c"},"\u6570\u636e\u5e76\u884c\u548c\u4efb\u52a1\u5e76\u884c"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u6570\u636e\u5e76\u884c(Data Parallelism)\uff1a\u5c06\u8f93\u5165\u6570\u636e\u5212\u5206\u4e3a\u5b50\u96c6\uff0c\u5728",(0,r.kt)("strong",{parentName:"li"},"\u76f8\u540c\u7b97\u5b50"),"\u4e0a\u5e76\u884c\u5bf9\u6570\u636e\u5b50\u96c6\u8fdb\u884c\u8ba1\u7b97"),(0,r.kt)("li",{parentName:"ul"},"\u4efb\u52a1\u5e76\u884c(Task Parallelism)\uff1a",(0,r.kt)("strong",{parentName:"li"},"\u4e0d\u540c\u7b97\u5b50"),"\u5e76\u884c\u5904\u7406\u6240\u6709\u6570\u636e")),(0,r.kt)("h3",{id:"\u6570\u636e\u4ea4\u6362\u7b56\u7565"},"\u6570\u636e\u4ea4\u6362\u7b56\u7565"),(0,r.kt)("p",null,"\u6570\u636e\u4ea4\u6362\u7b56\u7565\u5b9a\u4e49\u4e86\u6570\u636e\u5982\u4f55\u5728",(0,r.kt)("strong",{parentName:"p"},"\u7269\u7406\u6570\u636e\u6d41\u56fe"),"\u4e2d\u4f20\u9012\uff0c\u5982\u4e0b\u56fe\u6240\u793a\u67094\u79cd\u5e38\u7528\u7b56\u7565\uff1a"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Forward\uff1a\u5c06\u6570\u636e\u53d1\u9001\u7ed9\u4e00\u4e2a\u4e0b\u6e38\u4efb\u52a1\uff0c\u5f53\u4e0a\u4e0b\u6e38\u7b97\u5b50\u5904\u4e8e\u540c\u4e00\u4e2a\u7269\u7406\u673a\u65f6\u53ef\u4ee5\u907f\u514d\u7f51\u7edc\u5f00\u9500"),(0,r.kt)("li",{parentName:"ul"},"Broadcast\uff1a\u5c06\u6570\u636e\u53d1\u9001\u5230\u7b97\u5b50\u7684\u6bcf\u4e2a\u4e0b\u6e38\u5e76\u884c\u4efb\u52a1"),(0,r.kt)("li",{parentName:"ul"},"Ket-bases\uff1a\u6839\u636e\u952e\u503c\u9009\u62e9\u53d1\u9001\u7684\u4e0b\u6e38\u4efb\u52a1"),(0,r.kt)("li",{parentName:"ul"},"Random\uff1a\u968f\u673a\u53d1\u9001\u7ed9\u4e0b\u6e38\u4efb\u52a1")),(0,r.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap02/Data-Exchange-Strategies.png",title:"Data Exchange Strategies"}),(0,r.kt)("h2",{id:"\u5e76\u884c\u6d41\u5904\u7406"},"\u5e76\u884c\u6d41\u5904\u7406"),(0,r.kt)("p",null,"\u5728\u5e76\u884c\u6d41\u5904\u7406\u4e2d\uff0c\u6570\u636e\u6d41\u88ab\u5b9a\u4e49\u4e3a",(0,r.kt)("strong",{parentName:"p"},"\u65e0\u754c\u7684\u4e8b\u4ef6\u5e8f\u5217"),"\uff0c\u4f8b\u5982\u76d1\u63a7\u6570\u636e\u3001\u4f20\u611f\u5668\u6d4b\u91cf\u6570\u636e\u3001\u4fe1\u7528\u5361\u4ea4\u6613\u6570\u636e\u7b49\u3002"),(0,r.kt)("h3",{id:"\u5ef6\u8fdf\u548c\u541e\u5410\u91cf"},"\u5ef6\u8fdf\u548c\u541e\u5410\u91cf"),(0,r.kt)("p",null,"\u5bf9\u4e8e\u6279\u5904\u7406\uff0c\u6211\u4eec\u5173\u5fc3\u4e00\u6b21\u4f5c\u4e1a\u7684\u603b\u8fd0\u884c\u65f6\u95f4\u3001\u8ba1\u7b97\u65f6\u95f4\u7b49\u6307\u6807\uff0c\u4f46\u6d41\u5904\u7406\u8fde\u7eed\u5730\u63a5\u6536\u5904\u7406\u6570\u636e\uff0c\u5e76\u6ca1\u6709\u603b\u8fd0\u884c\u65f6\u95f4\u7684\u6982\u5ff5\u3002\u53d6\u800c\u4ee3\u4e4b\u5730\uff0c\u5ef6\u8fdf\u548c\u541e\u5410\u91cf\u6210\u4e3a\u8bc4\u4f30\u6d41\u5904\u7406\u7684\u6307\u6807\u3002"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u5ef6\u8fdf=\u8ba1\u7b97\u5f97\u5230\u7ed3\u679c\u65f6\u95f4-\u4e8b\u4ef6\u88ab\u63a5\u6536\u65f6\u95f4\uff0c\u53c8\u5206\u4e3a\u5e73\u5747\u5ef6\u8fdf\u3001\u6700\u5927\u5ef6\u8fdf\u3001\u767e\u5206\u6bd4\u5ef6\u8fdf\u3002\u4f4e\u5ef6\u8fdf\u5bf9\u6d41\u5904\u7406\u81f3\u5173\u91cd\u8981\uff0c\u901a\u5e38\u4e3a\u6beb\u79d2\u7ea7\uff0c\u8fd9\u4e5f\u662f\u5b9e\u65f6\u5e94\u7528\u7684\u57fa\u7840\u3002\u800c\u6279\u5904\u7406\u5ef6\u8fdf\u5728\u51e0\u5206\u949f\u5230\u51e0\u5c0f\u65f6\u4e0d\u7b49\uff0c\u56e0\u4e3a\u9700\u8981\u805a\u96c6\u4e00\u6279\u6570\u636e\u540e\u624d\u5f00\u59cb\u6267\u884c\u3002")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u541e\u5410\u91cf=\u5355\u4f4d\u65f6\u95f4\u5185\u5904\u7406\u7684\u4e8b\u4ef6\u6570\u91cf\uff0c\u901a\u5e38\u5173\u5fc3\u7cfb\u7edf\u7684\u6700\u5927\u541e\u5410\u91cf\uff0c\u5982\u679c\u4e8b\u4ef6\u5230\u8fbe\u901f\u7387\u8fc7\u5927\uff0c\u53cd\u800c\u4f1a\u5bfc\u81f4\u541e\u5410\u91cf\u4e0b\u964d\uff0c\u79f0\u4e4b\u4e3a\u53cd\u538b(Backpressure)\u3002")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"\u5ef6\u8fdfvs\u541e\u5410\u91cf\uff1a\u5ef6\u8fdf\u548c\u541e\u5410\u91cf\u5e76\u4e0d\u662f\u4e92\u76f8\u72ec\u7acb\u7684\u6307\u6807\uff0c\u5f53\u5ef6\u8fdf\u9ad8\u65f6\u541e\u5410\u91cf\u4f4e\uff0c\u53cd\u4e4b\u541e\u5410\u91cf\u4f4e\u65f6\u5ef6\u8fdf\u4e5f\u9ad8\u3002\u8981\u60f3\u540c\u65f6\u8fbe\u5230\u4f4e\u5ef6\u8fdf\u3001\u9ad8\u541e\u5410\uff0c\u9700\u8981\u5728\u5e76\u884c\u5730\u8fdb\u884c\u6d41\u5904\u7406\u3002"))),(0,r.kt)("h3",{id:"\u6570\u636e\u6d41\u64cd\u4f5c"},"\u6570\u636e\u6d41\u64cd\u4f5c"),(0,r.kt)("p",null,"\u6d41\u5904\u7406\u5f15\u64ce\u901a\u5e38\u63d0\u4f9b\u63a5\u6536\u3001\u8f6c\u5316\u3001\u8f93\u51fa\u6570\u636e\u6d41\u7684\u5185\u7f6e\u64cd\u4f5c\uff0c\u6309\u7167\u662f\u5426\u4fdd\u5b58\u5185\u90e8\u72b6\u6001\uff0c\u5206\u4e3a",(0,r.kt)("strong",{parentName:"p"},"\u6709\u72b6\u6001\u64cd\u4f5c"),"\u548c",(0,r.kt)("strong",{parentName:"p"},"\u65e0\u72b6\u6001\u64cd\u4f5c"),"\uff1a"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Stateless Operation",(0,r.kt)("ol",{parentName:"li"},(0,r.kt)("li",{parentName:"ol"},"\u4e8b\u4ef6\u5904\u7406\u72ec\u7acb\u4e8e\u5230\u8fbe\u987a\u5e8f\u548c\u5176\u4ed6\u4e8b\u4ef6\uff0c\u6613\u4e8e\u5e76\u884c\u5316\u6269\u5c55\uff1b"),(0,r.kt)("li",{parentName:"ol"},"\u5bb9\u9519\u6062\u590d\u53ea\u9700\u8981\u91cd\u542f\u5e94\u7528\u7ee7\u7eed\u4ece\u4e0a\u6b21\u4f4d\u7f6e\u6267\u884c"))),(0,r.kt)("li",{parentName:"ul"},"Stateful Operation",(0,r.kt)("ol",{parentName:"li"},(0,r.kt)("li",{parentName:"ol"},"\u4e0d\u6613\u5e76\u884c\u5316\u6269\u5c55"),(0,r.kt)("li",{parentName:"ol"},"\u5bb9\u9519\u6062\u590d\u66f4\u56f0\u96be")))),(0,r.kt)("p",null,"\u5e38\u89c1\u64cd\u4f5c\u6709\uff1a"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"\u6570\u636e\u83b7\u53d6\u3001\u8f93\u51fa(Data Ingestion/Egress)\uff1a\u83b7\u53d6\u3001\u8f93\u51fa\u64cd\u4f5c\u662f\u6d41\u5904\u7406\u5668\u4e0e\u5916\u754c\u7cfb\u7edf\u901a\u4fe1\u7684\u65b9\u5f0f\uff0c\u5bf9\u5e94\u7684\u7b97\u5b50\u79f0\u4e4b\u4e3a\u6570\u636e\u6e90\u548c\u6570\u636e\u69fd"),(0,r.kt)("li",{parentName:"ol"},"\u8f6c\u5316\u64cd\u4f5c\uff1a\u4e00\u79cd\u72ec\u7acb\u3001\u5355\u5411\u7684\u5904\u7406\u6570\u636e\u64cd\u4f5c\u3002\u5982\u4e0b\u56fe\u6240\u793a\u4e3a\u4e00\u4e2a\u7528\u6237\u81ea\u5b9a\u4e49\u51fd\u6570(UDF)\u63d0\u4f9b\u7684\u8f6c\u6362\u64cd\u4f5c\uff0c\u5b83\u5c06\u6bcf\u4e2a\u8f93\u5165\u4e8b\u4ef6\u8f6c\u4e3a\u6df1\u84dd\u8272\u4e8b\u4ef6\u8f93\u51fa\u3002")),(0,r.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap02/A-UDF-Transformation-Operation.png",title:"A UDF Transformation Operation"}),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"\u6eda\u52a8\u805a\u5408\uff1a\u6bcf\u63a5\u6536\u8f93\u5165\u4e8b\u4ef6\u5c31\u66f4\u65b0\u7684\u805a\u5408\u8ba1\u7b97(\u6c42\u548c\u3001\u6c42\u6700\u5927\u503c\u3001\u6c42\u6700\u5c0f\u503c\u7b49)\uff0c\u805a\u5408\u8ba1\u7b97\u5fc5\u987b\u6ee1\u8db3\u7ed3\u5408\u5f8b\u548c\u4ea4\u6362\u5f8b\uff0c\u5426\u5219\u9700\u8981\u4fdd\u5b58\u6240\u6709\u5386\u53f2\u6570\u636e\u3002\u5982\u4e0b\u56fe\u6240\u793a\u4e3a\u4e00\u4e2a\u6c42\u6700\u5c0f\u503c\u7684\u6eda\u52a8\u805a\u5408\u64cd\u4f5c\uff1a")),(0,r.kt)("img",{style:{width:"50%",height:"50%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap02/A-Rolling-Minimum-Aggregation-Operation.png",title:"A Rolling Minimum Aggregation Operation"}),(0,r.kt)("ol",{start:4},(0,r.kt)("li",{parentName:"ol"},"\u7a97\u53e3\u64cd\u4f5c\uff1a\u4e0e\u6bcf\u6b21\u53ea\u63a5\u6536\u5904\u7406\u4e00\u4e2a\u4e8b\u4ef6\u4e0d\u540c\uff0c\u7a97\u53e3\u64cd\u4f5c\u9700\u8981\u7f13\u5b58\u591a\u4e2a\u4e8b\u4ef6\u8bb0\u5f55\u6765\u8ba1\u7b97\u7ed3\u679c\uff0c\u4f8b\u5982\u6c42\u4e2d\u4f4d\u6570\u3002")),(0,r.kt)("p",null,"\u7a97\u53e3\u64cd\u4f5c\u5c06\u65e0\u754c\u4e8b\u4ef6\u6d41\u5212\u5206\u4e3a\u8fde\u7eed\u7684",(0,r.kt)("strong",{parentName:"p"},"\u6876(bucket)"),"\uff0c\u6bcf\u4e2a\u6876\u662f\u4e00\u4e2a\u6709\u9650\u7684\u4e8b\u4ef6\u96c6\u5408\u3002\u800c\u6839\u636e\u5212\u5206\u6876\u7684\u7b56\u7565(\u6309\u4e8b\u4ef6\u65f6\u95f4\u3001\u6309\u4e8b\u4ef6\u4e2a\u6570)\u4e0d\u540c\uff0c\u5f00\u7a97\u64cd\u4f5c\u53c8\u53ef\u5206\u4e3a\u5982\u4e0b\u51e0\u79cd\uff1a"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"\u6eda\u52a8\u7a97\u53e3(Tumbling Window)\uff1a\u5c06\u65e0\u754c\u6d41\u5206\u4e3a",(0,r.kt)("strong",{parentName:"li"},"\u56fa\u5b9a\u5927\u5c0f\u4e14\u4e92\u4e0d\u91cd\u53e0"),"\u7684\u6876\uff0c\u5982\u4e0b\u6240\u793a\u5206\u522b\u4e3a\u6309\u4e8b\u4ef6\u4e2a\u6570\u548c\u65f6\u95f4\u5212\u5206\u7684\u6eda\u52a8\u7a97\u53e3\uff1a")),(0,r.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap02/Count-based-Tumbling-Window.png",title:"Count-based Tumbling Window"}),(0,r.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap02/Time-based-Tumbling-Window.png",title:"Time-based Tumbling Window"}),(0,r.kt)("ol",{start:2},(0,r.kt)("li",{parentName:"ol"},"\u6ed1\u52a8\u7a97\u53e3(Sliding Window)\uff1a\u5c06\u65e0\u754c\u6d41\u5206\u4e3a",(0,r.kt)("strong",{parentName:"li"},"\u56fa\u5b9a\u5927\u5c0f\u4f46\u6709\u91cd\u53e0"),"\u7684\u6876\uff0c\u5982\u4e0b\u56fe\u6240\u793a\uff1a")),(0,r.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap02/A-Sliding-Count-based-Window.png",title:"A Sliding Count-based Window"}),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},"\u4f1a\u8bdd\u7a97\u53e3(Session Window)\uff1a\u6309\u7167\u4f1a\u8bdd\u5212\u5206\u4e8b\u4ef6\u6d41\uff0c\u4f1a\u8bdd\u7531\u4e00\u7cfb\u5217\u8fde\u7eed\u65f6\u95f4\u5185\u53d1\u751f\u7684\u4e8b\u4ef6\u7ec4\u6210\uff0c\u4f1a\u8bdd\u4e4b\u95f4\u6ca1\u6709\u4e8b\u4ef6\u7684\u7a7a\u95f2\u95f4\u9694\u79f0\u4e3a\u4f1a\u8bdd\u95f4\u9694(Session Gap)\uff0c\u5982\u4e0b\u56fe\u6240\u793a\uff1a")),(0,r.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap02/Session-Window.png",title:"Session Window"}),(0,r.kt)("p",null,"\u5230\u76ee\u524d\u4e3a\u6b62\u7684\u64cd\u4f5c\u90fd\u662f\u5728\u5b8c\u6574\u7684\u6d41\u4e0a\u8fdb\u884c\uff0c\u5b9e\u9645\u5f00\u53d1\u4e2d\u9700\u8981\u5c06\u4e00\u4e2a\u6d41\u5212\u5206\u4e3a\u591a\u4e2a\u903b\u8f91\u6d41\u7136\u540e\u4e3a\u6bcf\u4e2a\u6d41\u5b9a\u4e49\u5404\u81ea\u5f00\u7a97\u64cd\u4f5c\uff0c\u79f0\u4e4b\u4e3a",(0,r.kt)("em",{parentName:"p"},"\u5e76\u884c\u7a97\u53e3(Parallel Window)"),"\uff0c\u5982\u4e0b\u6240\u793a\u6309\u7167\u4e8b\u4ef6\u7c7b\u578b\u5212\u5206\u5e76\u5bf9\u6bcf\u4e2a\u6d41\u8fdb\u884c\u957f\u5ea6\u4e3a2\u7684\u6eda\u52a8\u7a97\u53e3\u64cd\u4f5c\uff1a"),(0,r.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap02/A-Parallel-Tumbling-Window.png",title:"A Parallel Tumbling Window"}),(0,r.kt)("p",null,"\u7a97\u53e3\u64cd\u4f5c\u4e0e\u6d41\u5904\u7406\u7684\u4e24\u5927\u5173\u952e\u6982\u5ff5\u7d27\u5bc6\u76f8\u5173\uff1a\u65f6\u95f4\u8bed\u4e49\u548c\u72b6\u6001\u7ba1\u7406\u3002\u73b0\u5b9e\u4e2d\u7684\u4e8b\u4ef6\u4f1a\u5ef6\u8fdf\u6216\u8005\u4e71\u5e8f\u5230\u8fbe\uff0c\u65f6\u95f4\u8bed\u4e49\u5b9a\u4e49\u5982\u4f55\u5904\u7406\u8fd9\u79cd\u60c5\u51b5\u3002\u4e0a\u8ff0\u4ecb\u7ecd\u7684\u7a97\u53e3\u64cd\u4f5c\u90fd\u9700\u8981\u7f13\u5b58\u6570\u636e\u6765\u8ba1\u7b97\u51fa\u7ed3\u679c\uff0c\u5e76\u4e14\u5bb9\u9519\u6062\u590d\u65f6\u4e5f\u9700\u8981\u6062\u590d\u72b6\u6001\u6765\u4fdd\u8bc1\u7ed3\u679c\u6b63\u786e\u6027\uff0c\u56e0\u6b64\u9700\u8981\u72b6\u6001\u7ba1\u7406\u3002"),(0,r.kt)("h2",{id:"\u65f6\u95f4\u8bed\u4e49"},"\u65f6\u95f4\u8bed\u4e49"),(0,r.kt)("h3",{id:"1\u5206\u949f\u7684\u542b\u4e49"},"1\u5206\u949f\u7684\u542b\u4e49"),(0,r.kt)("p",null,"\u5047\u8bbe\u4e00\u4e2a\u6d41\u5904\u7406\u7a0b\u5e8f\u9700\u8981\u5206\u6790\u7528\u6237\u73a9\u624b\u6e38\u65f6\u4ea7\u751f\u7684\u4e8b\u4ef6\uff0c\u5982\u679c\u5c0f\u961f\u4e2d\u6240\u6709\u73a9\u5bb6\u57281\u5206\u949f\u5185\u6d88\u706d500\u4e2a\u654c\u4eba\uff0c\u4ed6\u4eec\u6bcf\u4e2a\u4eba\u90fd\u4f1a\u5347\u4e00\u7ea7\u3002\u73b0\u5728Alice\u6bcf\u5929\u5728\u5750\u5730\u94c1\u4e0a\u4e0b\u73ed\u65f6\u73a9\u8fd9\u4e2a\u6e38\u620f\uff0c\u5f53\u7a7f\u8fc7\u96a7\u9053\u65f6\uff0cAlice\u624b\u673a\u5931\u53bb\u4fe1\u53f7\uff0c\u4f46\u5979\u7ee7\u7eed\u73a9\u6e38\u620f\u5e76\u4e14\u4e8b\u4ef6\u7f13\u5b58\u5728\u624b\u673a\u4e0a\u3002\u5f53\u9a76\u51fa\u96a7\u9053\u540e\u8fd9\u4e9b\u4e8b\u4ef6\u7ee7\u7eed\u53d1\u9001\u5230\u6d41\u5904\u7406\u7a0b\u5e8f\uff0c\u90a3\u4e48\u6b64\u65f61\u5206\u949f\u662f\u5426\u5305\u542bAlice\u6389\u7ebf\u7684\u8fd9\u4e00\u6bb5\u4e8b\u4ef6\uff1f"),(0,r.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap02/An-Online-Mobile-Game-Example-in-Practice.png",title:"An Online Mobile Game Example in Practice"}),(0,r.kt)("p",null,"\u5728\u8fd9\u4e2a\u4f8b\u5b50\u4e2d\uff0c\u6d41\u5904\u7406\u7a0b\u5e8f\u53ef\u4ee5\u9009\u62e92\u79cd\u65f6\u95f4\u8bed\u4e49\uff1a\u5904\u7406\u65f6\u95f4(Processing Time)\u548c\u4e8b\u4ef6\u65f6\u95f4(Event Time)\u3002"),(0,r.kt)("h3",{id:"\u5904\u7406\u65f6\u95f4"},"\u5904\u7406\u65f6\u95f4"),(0,r.kt)("p",null,"\u6307\u6d41\u5904\u7406\u7a0b\u5e8f\u6240\u5728\u673a\u5668\u7684\u672c\u5730\u65f6\u95f4(\u4e8b\u4ef6\u5230\u8fbe\u65f6\u95f4)\u3002\u5982\u4e0b\u56fe\u6240\u793a\uff0c\u4f7f\u7528\u5904\u7406\u65f6\u95f4\u7684\u7a0b\u5e8f\u5728Alice\u6389\u7ebf\u65f6\u4ecd\u4f1a\u8ba1\u65f6\uff0c\u6240\u4ee5\u6389\u7ebf\u7684\u8fd9\u6bb5\u65f6\u95f4\u5185\u5979\u7684\u6e38\u620f\u6d3b\u52a8\u5e76\u4e0d\u7b97\u5728\u5185\uff1a"),(0,r.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap02/A-Processing-Time-Window-Example.png",title:"A Processing Time Window Example"}),(0,r.kt)("h3",{id:"\u4e8b\u4ef6\u65f6\u95f4"},"\u4e8b\u4ef6\u65f6\u95f4"),(0,r.kt)("p",null,"\u6307\u4e8b\u4ef6\u5b9e\u9645\u53d1\u751f\u65f6\u95f4\u3002\u5982\u4e0b\u56fe\u6240\u793a\uff0c\u5373\u4f7f\u4e8b\u4ef6\u5ef6\u8fdf\u5230\u8fbe\uff0c\u4f7f\u7528\u4e8b\u4ef6\u65f6\u95f4\u4e5f\u80fd\u6b63\u786e\u5730\u8fdb\u884c\u7a97\u53e3\u64cd\u4f5c\uff0c\u53cd\u5e94\u771f\u5b9e\u60c5\u51b5\u3002"),(0,r.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap02/An-Event-Time-Window-Example.png",title:"An Event Time Window Example"}),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"\u4e8b\u4ef6\u65f6\u95f4\u5c06\u5904\u7406\u7ed3\u679c\u4e0e\u5904\u7406\u901f\u5ea6\u5b8c\u5168\u89e3\u8026"),"\uff1a\u65e0\u8bba\u6d41\u5904\u7406\u901f\u5ea6\u591a\u5feb\u6216\u8005\u4e8b\u4ef6\u4ec0\u4e48\u65f6\u5019\u5230\u8fbe\uff0c\u5904\u7406\u7ed3\u679c\u90fd\u662f\u76f8\u540c\u7684\u3002"),(0,r.kt)("p",null,"\u9664\u4e86\u89e3\u51b3\u4e8b\u4ef6\u5ef6\u8fdf\u7684\u95ee\u9898\u5916\uff0c\u4e8b\u4ef6\u65f6\u95f4\u4e5f\u89e3\u51b3\u4e86\u4e8b\u4ef6\u4e71\u5e8f\u7684\u95ee\u9898\u3002\u5904\u7406\u53ef\u56de\u653e(Replayable)\u6d41\u65f6\uff0c\u901a\u8fc7\u4e8b\u4ef6\u65f6\u95f4\u53ef\u4ee5\u5feb\u8fdb\u5386\u53f2\u4e8b\u4ef6\u5c31\u597d\u50cf\u4e8b\u4ef6\u6d41\u662f\u5b9e\u65f6\u53d1\u751f\u7684\uff0c\u6216\u8005\u5feb\u8fdb\u5230\u73b0\u5728\u53d1\u751f\u4e8b\u4ef6\uff0c\u7a0b\u5e8f\u7ee7\u7eed\u6309\u7167\u76f8\u540c\u903b\u8f91\u4fdd\u6301\u5b9e\u65f6\u3002"))}h.isMDXComponent=!0}}]);