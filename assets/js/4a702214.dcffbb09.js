"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[7696],{3905:function(e,n,t){t.d(n,{Zo:function(){return u},kt:function(){return v}});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=r.createContext({}),p=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):c(c({},n),e)),t},u=function(e){var n=p(e.components);return r.createElement(l.Provider,{value:n},e.children)},s={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=p(t),v=a,m=d["".concat(l,".").concat(v)]||d[v]||s[v]||o;return t?r.createElement(m,c(c({ref:n},u),{},{components:t})):r.createElement(m,c({ref:n},u))}));function v(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,c=new Array(o);c[0]=d;var i={};for(var l in n)hasOwnProperty.call(n,l)&&(i[l]=n[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,c[1]=i;for(var p=2;p<o;p++)c[p]=t[p];return r.createElement.apply(null,c)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},9283:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return i},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return u},default:function(){return d}});var r=t(7462),a=t(3366),o=(t(7294),t(3905)),c=["components"],i={layout:"article",title:"\u663e\u5f0f\u9501",permalink:"/java-concurrency-in-practice/chap13",tags:["Java Concurrency","ReadingNotes"]},l=void 0,p={unversionedId:"Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218/Java-Concurrency-in-Practice-Chap13",id:"Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218/Java-Concurrency-in-Practice-Chap13",isDocsHomePage:!1,title:"\u663e\u5f0f\u9501",description:"\u300aJava\u5e76\u53d1\u7f16\u7a0b\u300b\u7b2c\u5341\u4e09\u7ae0\u8bfb\u4e66\u7b14\u8bb0",source:"@site/docs\\Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218\\Java-Concurrency-in-Practice-Chap13.md",sourceDirName:"Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218",slug:"/Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218/Java-Concurrency-in-Practice-Chap13",permalink:"/docs/Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218/Java-Concurrency-in-Practice-Chap13",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/docs/Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218\\Java-Concurrency-in-Practice-Chap13.md",tags:[{label:"Java Concurrency",permalink:"/docs/tags/java-concurrency"},{label:"ReadingNotes",permalink:"/docs/tags/reading-notes"}],version:"current",frontMatter:{layout:"article",title:"\u663e\u5f0f\u9501",permalink:"/java-concurrency-in-practice/chap13",tags:["Java Concurrency","ReadingNotes"]},sidebar:"tutorialSidebar",previous:{title:"\u907f\u514d\u6d3b\u8dc3\u6027\u5371\u9669",permalink:"/docs/Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218/Java-Concurrency-in-Practice-Chap10"},next:{title:"\u865a\u62df\u673a\u7c7b\u52a0\u8f7d\u673a\u5236",permalink:"/docs/\u6df1\u5165\u7406\u89e3Java\u865a\u62df\u673a/UnderstandJVM-Chap07"}},u=[{value:"Lock\u4e0eReentrantLock",id:"lock\u4e0ereentrantlock",children:[]}],s={toc:u};function d(e){var n=e.components,t=(0,a.Z)(e,c);return(0,o.kt)("wrapper",(0,r.Z)({},s,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"\u300aJava\u5e76\u53d1\u7f16\u7a0b\u300b\u7b2c\u5341\u4e09\u7ae0\u8bfb\u4e66\u7b14\u8bb0"))),(0,o.kt)("p",null,"Java 5.0\u65b0\u589e\u4e86ReentrantLock\uff0c\u4f5c\u4e3a\u5185\u7f6e\u9501(synchronized\u3001volatile)\u7684\u4e00\u79cd\u66ff\u4ee3\u54c1\u3002"),(0,o.kt)("h2",{id:"lock\u4e0ereentrantlock"},"Lock\u4e0eReentrantLock"),(0,o.kt)("p",null,"Lock\u63a5\u53e3\u4e2d\u5b9a\u4e49\u7684\u9501\u76f8\u5173\u64cd\u4f5c\u5982\u4e0b\u6240\u793a\u3002\u4e0e\u5185\u7f6e\u52a0\u9501\u4e0d\u540c\uff0cLock\u63d0\u4f9b",(0,o.kt)("strong",{parentName:"p"},"\u65e0\u6761\u4ef6\u7684\u3001\u53ef\u8f6e\u8be2\u7684\u3001\u5b9a\u65f6\u7684\u4ee5\u53ca\u53ef\u4e2d\u65ad\u7684\u9501\u83b7\u53d6\u64cd\u4f5c"),"\u3002\u800cReentrantLock\u5b9e\u73b0\u4e86Lock\u63a5\u53e3\uff0c\u63d0\u4f9b\u4e86\u4e0esynchronized\u4e00\u6837\u7684\u4e92\u65a5\u6027\u548c\u5185\u5b58\u53ef\u89c1\u6027\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},"public interface Lock {\n  void lock();\n  // \u52a0\u9501\uff0c\u963b\u585e\u671f\u95f4\u53ef\u88ab\u4e2d\u65ad\n  void lockInterruptibly() throws InterruptedException;\n  // \u52a0\u9501\uff0c\u5931\u8d25\u7acb\u5373\u8fd4\u56defalse\u800c\u4e0d\u662f\u963b\u585e\n  boolean tryLock();\n  // \u5728\u7ed9\u5b9a\u65f6\u95f4\u5185\u52a0\u9501\n  boolean tryLock(long time, TimeUnit unit) throws InterruptedException;\n  // \u89e3\u9501\n  void unlock();\n  Condition newCondition();\n}\n")),(0,o.kt)("p",null,"\u5185\u7f6e\u9501\u5b58\u5728\u5c40\u9650\u6027\uff0c\u4f8b\u5982\u65e0\u6cd5\u4e2d\u65ad\u7b49\u5f85\u83b7\u53d6\u9501\u7684\u7ebf\u7a0b\uff0c\u65e0\u6cd5\u8bf7\u6c42\u9501\u65f6\u65e0\u9650\u671f\u7b49\u5f85\uff0c\u65e0\u6cd5\u5b9e\u73b0\u975e\u963b\u585e\u7684\u52a0\u9501\u89c4\u5219\u3002\u800cLock\u52a0\u9501\u673a\u5236\u66f4\u52a0\u7075\u6d3b\uff0c\u4f7f\u7528Lock\u7684\u6807\u51c6\u5f62\u5f0f\u5982\u4e0b\u6240\u793a\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},"Lock lock = new ReentrantLock();\n...\nlock.lock();\ntry {\n  // \u66f4\u65b0\u5bf9\u8c61\u72b6\u6001\n  // \u6355\u83b7\u5f02\u5e38\n} finally {\n  // \u4e00\u5b9a\u4e0d\u8981\u5fd8\u8bb0\u5728finally\u5757\u4e2d\u91ca\u653e\u9501\n  lock.unlock();\n}\n")))}d.isMDXComponent=!0}}]);