"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[1657],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return m}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=n.createContext({}),l=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},s=function(e){var t=l(e.components);return n.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,s=u(e,["components","mdxType","originalType","parentName"]),f=l(r),m=o,h=f["".concat(c,".").concat(m)]||f[m]||p[m]||a;return r?n.createElement(h,i(i({ref:t},s),{},{components:r})):n.createElement(h,i({ref:t},s))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=f;var u={};for(var c in t)hasOwnProperty.call(t,c)&&(u[c]=t[c]);u.originalType=e,u.mdxType="string"==typeof e?e:o,i[1]=u;for(var l=2;l<a;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},3854:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return u},contentTitle:function(){return c},metadata:function(){return l},assets:function(){return s},toc:function(){return p},default:function(){return m}});var n=r(3117),o=r(102),a=(r(7294),r(3905)),i=["components"],u={title:"\u4e8c\u53c9\u6811\u57fa\u672c\u7b97\u6cd5",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["BiTree"],description:"\u4e8c\u53c9\u6811\u57fa\u672c\u7b97\u6cd5",hide_table_of_contents:!1},c=void 0,l={permalink:"/blog/2021/09/06/BiTreeBasicAlgorithms",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/blog/blog/2021-09-06-BiTreeBasicAlgorithms.mdx",source:"@site/blog/2021-09-06-BiTreeBasicAlgorithms.mdx",title:"\u4e8c\u53c9\u6811\u57fa\u672c\u7b97\u6cd5",description:"\u4e8c\u53c9\u6811\u57fa\u672c\u7b97\u6cd5",date:"2021-09-06T00:00:00.000Z",formattedDate:"September 6, 2021",tags:[{label:"BiTree",permalink:"/blog/tags/bi-tree"}],readingTime:4.8,truncated:!0,authors:[{name:"\u4f55\u8f72",title:"Never settle down",url:"https://github.com/kayhaw",imageURL:"https://avatars.githubusercontent.com/u/16892835?v=4"}],frontMatter:{title:"\u4e8c\u53c9\u6811\u57fa\u672c\u7b97\u6cd5",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["BiTree"],description:"\u4e8c\u53c9\u6811\u57fa\u672c\u7b97\u6cd5",hide_table_of_contents:!1},prevItem:{title:"\u7b97\u6cd5\u5e38\u7528\u6570\u636e\u7ed3\u6784(1)-\u5355\u8c03\u6808",permalink:"/blog/2021/09/07/OrderedStack"},nextItem:{title:"\u4e8c\u53c9\u6811\u904d\u5386",permalink:"/blog/2021/09/04/BiTreeTraversal"}},s={authorsImageUrls:[void 0]},p=[],f={toc:p};function m(e){var t=e.components,r=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"\u5b66\u5b8c\u4e86\u4e8c\u53c9\u6811\u57fa\u7840\u7684\u904d\u5386\u64cd\u4f5c\uff0c\u518d\u8bb0\u5f55\u4e0b\u5176\u4ed6\u4e8c\u53c9\u6811\u76f8\u5173\u7684\u57fa\u672c\u7b97\u6cd5"))}m.isMDXComponent=!0}}]);