"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[1173],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return f}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=n.createContext({}),c=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(u.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=c(r),f=o,h=m["".concat(u,".").concat(f)]||m[f]||s[f]||a;return r?n.createElement(h,i(i({ref:t},p),{},{components:r})):n.createElement(h,i({ref:t},p))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=m;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},5484:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return l},contentTitle:function(){return u},metadata:function(){return c},assets:function(){return p},toc:function(){return s},default:function(){return f}});var n=r(3117),o=r(102),a=(r(7294),r(3905)),i=["components"],l={title:"\u6c42\u6700\u957f\u56de\u6587\u5b50\u4e32",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["Algorithm","Palindrome","Manacher"],description:"\u6c42\u6700\u957f\u56de\u6587\u5b50\u4e32",hide_table_of_contents:!1},u=void 0,c={permalink:"/blog/2021/09/21/LongestPalindrome",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/blog/blog/2021-09-21-LongestPalindrome.mdx",source:"@site/blog/2021-09-21-LongestPalindrome.mdx",title:"\u6c42\u6700\u957f\u56de\u6587\u5b50\u4e32",description:"\u6c42\u6700\u957f\u56de\u6587\u5b50\u4e32",date:"2021-09-21T00:00:00.000Z",formattedDate:"September 21, 2021",tags:[{label:"Algorithm",permalink:"/blog/tags/algorithm"},{label:"Palindrome",permalink:"/blog/tags/palindrome"},{label:"Manacher",permalink:"/blog/tags/manacher"}],readingTime:5.34,truncated:!0,authors:[{name:"\u4f55\u8f72",title:"Never settle down",url:"https://github.com/kayhaw",imageURL:"https://avatars.githubusercontent.com/u/16892835?v=4"}],frontMatter:{title:"\u6c42\u6700\u957f\u56de\u6587\u5b50\u4e32",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["Algorithm","Palindrome","Manacher"],description:"\u6c42\u6700\u957f\u56de\u6587\u5b50\u4e32",hide_table_of_contents:!1},prevItem:{title:"Random\u5bfc\u81f4\u7684\u963b\u585e\u95ee\u9898",permalink:"/blog/2021/09/21/AProblemCausedByRandom"},nextItem:{title:"\u7f51\u7edc\u57fa\u7840\u77e5\u8bc6(1)",permalink:"/blog/2021/09/20/TCPBasic"}},p={authorsImageUrls:[void 0]},s=[],m={toc:s};function f(e){var t=e.components,r=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"\u7b97\u6cd5\u9898\uff1a\u6c42\u6700\u957f\u56de\u6587\u5b50\u4e32"))}f.isMDXComponent=!0}}]);