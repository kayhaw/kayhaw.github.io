"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[5026],{28:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return u},default:function(){return m},frontMatter:function(){return c},metadata:function(){return l},toc:function(){return p}});var r=n(3117),o=n(102),i=(n(7294),n(3905)),a=["components"],c={title:"FlinkX\u6e90\u7801\u5256\u6790(5)",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["FlinkX","Source code dissection"],description:"FlinkX\u6e90\u7801\u5256\u6790(4)",hide_table_of_contents:!1},u=void 0,l={permalink:"/blog/2022/06/21/FlinkX-Source-Code-Dissection-05",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/blog/blog/2022/06/21-FlinkX-Source-Code-Dissection-05.md",source:"@site/blog/2022/06/21-FlinkX-Source-Code-Dissection-05.md",title:"FlinkX\u6e90\u7801\u5256\u6790(5)",description:"FlinkX\u6e90\u7801\u5256\u6790(4)",date:"2022-06-21T00:00:00.000Z",formattedDate:"June 21, 2022",tags:[{label:"FlinkX",permalink:"/blog/tags/flink-x"},{label:"Source code dissection",permalink:"/blog/tags/source-code-dissection"}],readingTime:12.48,truncated:!0,authors:[{name:"\u4f55\u8f72",title:"Never settle down",url:"https://github.com/kayhaw",imageURL:"https://avatars.githubusercontent.com/u/16892835?v=4"}],frontMatter:{title:"FlinkX\u6e90\u7801\u5256\u6790(5)",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["FlinkX","Source code dissection"],description:"FlinkX\u6e90\u7801\u5256\u6790(4)",hide_table_of_contents:!1},nextItem:{title:"FlinkX\u6e90\u7801\u5256\u6790(4)",permalink:"/blog/2022/06/16/FlinkX-Source-Code-Dissection-04"}},s={authorsImageUrls:[void 0]},p=[],f={toc:p};function m(e){var t=e.components,n=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"\u4e0a\u4e00\u7bc7\u6587\u7ae0\u5206\u6790\u4e86FlinkX\u81ea\u5b9a\u4e49\u7684BaseRichInputFormat\u7c7b\uff0c\u5b50\u7c7b\u53ea\u9700\u8981\u5b9e\u73b0openInternal\u548cnextRecordInternal\u7b49xxxInternal\u65b9\u6cd5\u3002\u672c\u7bc7\u6587\u7ae0\u7ee7\u7eed\u5206\u6790BaseRichInputFormat\u662f\u5982\u4f55\u5b9e\u73b0\u7edf\u4e00\u7684\u6307\u6807\u6536\u96c6\u3001\u53d1\u5e03\u529f\u80fd\u3002"))}m.isMDXComponent=!0},3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return m}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var u=r.createContext({}),l=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},s=function(e){var t=l(e.components);return r.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,u=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),f=l(n),m=o,d=f["".concat(u,".").concat(m)]||f[m]||p[m]||i;return n?r.createElement(d,a(a({ref:t},s),{},{components:n})):r.createElement(d,a({ref:t},s))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=f;var c={};for(var u in t)hasOwnProperty.call(t,u)&&(c[u]=t[u]);c.originalType=e,c.mdxType="string"==typeof e?e:o,a[1]=c;for(var l=2;l<i;l++)a[l]=n[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"}}]);