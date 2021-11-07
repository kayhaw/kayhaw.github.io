"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[7411],{3905:function(e,n,t){t.d(n,{Zo:function(){return l},kt:function(){return g}});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=r.createContext({}),p=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},l=function(e){var n=p(e.components);return r.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},k=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),k=p(t),g=a,m=k["".concat(s,".").concat(g)]||k[g]||u[g]||i;return t?r.createElement(m,o(o({ref:n},l),{},{components:t})):r.createElement(m,o({ref:n},l))}));function g(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,o=new Array(i);o[0]=k;var c={};for(var s in n)hasOwnProperty.call(n,s)&&(c[s]=n[s]);c.originalType=e,c.mdxType="string"==typeof e?e:a,o[1]=c;for(var p=2;p<i;p++)o[p]=t[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}k.displayName="MDXCreateElement"},2046:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return p},toc:function(){return l},default:function(){return k}});var r=t(7462),a=t(3366),i=(t(7294),t(3905)),o=["components"],c={layout:"article",title:"Getting the Message Across",permalink:"/learning-akka/chap03",tags:["Akka","ReadingNotes"]},s=void 0,p={unversionedId:"Learning Akka/LearningAkka-Chap03",id:"Learning Akka/LearningAkka-Chap03",isDocsHomePage:!1,title:"Getting the Message Across",description:"\u300aLearning Akka\u300b\u7b2c\u4e09\u7ae0\u8bfb\u4e66\u7b14\u8bb0",source:"@site/docs/Learning Akka/LearningAkka-Chap03.md",sourceDirName:"Learning Akka",slug:"/Learning Akka/LearningAkka-Chap03",permalink:"/docs/Learning Akka/LearningAkka-Chap03",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/docs/Learning Akka/LearningAkka-Chap03.md",tags:[{label:"Akka",permalink:"/docs/tags/akka"},{label:"ReadingNotes",permalink:"/docs/tags/reading-notes"}],version:"current",frontMatter:{layout:"article",title:"Getting the Message Across",permalink:"/learning-akka/chap03",tags:["Akka","ReadingNotes"]},sidebar:"tutorialSidebar",previous:{title:"Actors and Concurrency",permalink:"/docs/Learning Akka/LearningAkka-Chap02"},next:{title:"\u7ebf\u7a0b\u5b89\u5168\u6027",permalink:"/docs/Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218/Java-Concurrency-in-Practice-Chap02"}},l=[],u={toc:l};function k(e){var n=e.components,t=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"\u300aLearning Akka\u300b\u7b2c\u4e09\u7ae0\u8bfb\u4e66\u7b14\u8bb0"))))}k.isMDXComponent=!0}}]);