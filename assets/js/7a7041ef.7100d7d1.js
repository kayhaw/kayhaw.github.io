"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[4345],{9401:function(e,t,r){r.r(t),r.d(t,{assets:function(){return u},contentTitle:function(){return l},default:function(){return d},frontMatter:function(){return c},metadata:function(){return p},toc:function(){return s}});var n=r(3117),a=r(102),i=(r(7294),r(3905)),o=["components"],c={title:"\u7b97\u6cd5\u5e38\u7528\u6570\u636e\u7ed3\u6784(1)-\u5355\u8c03\u6808",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["OrderedStack"],description:"\u5355\u8c03\u6808\u76f8\u5173\u7b97\u6cd5\u9898",hide_table_of_contents:!1},l=void 0,p={permalink:"/blog/2021/09/07/OrderedStack",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/blog/blog/2021-09-07-OrderedStack.mdx",source:"@site/blog/2021-09-07-OrderedStack.mdx",title:"\u7b97\u6cd5\u5e38\u7528\u6570\u636e\u7ed3\u6784(1)-\u5355\u8c03\u6808",description:"\u5355\u8c03\u6808\u76f8\u5173\u7b97\u6cd5\u9898",date:"2021-09-07T00:00:00.000Z",formattedDate:"September 7, 2021",tags:[{label:"OrderedStack",permalink:"/blog/tags/ordered-stack"}],readingTime:2.895,truncated:!0,authors:[{name:"\u4f55\u8f72",title:"Never settle down",url:"https://github.com/kayhaw",imageURL:"https://avatars.githubusercontent.com/u/16892835?v=4"}],frontMatter:{title:"\u7b97\u6cd5\u5e38\u7528\u6570\u636e\u7ed3\u6784(1)-\u5355\u8c03\u6808",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["OrderedStack"],description:"\u5355\u8c03\u6808\u76f8\u5173\u7b97\u6cd5\u9898",hide_table_of_contents:!1},prevItem:{title:"\u4e8c\u53c9\u6811\u4e2d\u5e8f\u904d\u5386\u7684\u5e94\u7528",permalink:"/blog/2021/09/08/\u4e8c\u53c9\u6811\u4e2d\u5e8f\u904d\u5386\u5e94\u7528"},nextItem:{title:"\u4e8c\u53c9\u6811\u57fa\u672c\u7b97\u6cd5",permalink:"/blog/2021/09/06/BiTreeBasicAlgorithms"}},u={authorsImageUrls:[void 0]},s=[{value:"\u5b9a\u4e49",id:"\u5b9a\u4e49",level:2},{value:"\u7528\u4f8b",id:"\u7528\u4f8b",level:2},{value:"\u4e70\u5356\u80a1\u7968\u7684\u6700\u4f73\u65f6\u673a",id:"\u4e70\u5356\u80a1\u7968\u7684\u6700\u4f73\u65f6\u673a",level:3},{value:"\u4e70\u5356\u80a1\u7968\u7684\u6700\u4f73\u65f6\u673aII",id:"\u4e70\u5356\u80a1\u7968\u7684\u6700\u4f73\u65f6\u673aii",level:3}],m={toc:s};function d(e){var t=e.components,r=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"\u7b97\u6cd5\u5e38\u7528\u6570\u636e\u7ed3\u6784(1)-\u5355\u8c03\u6808"),(0,i.kt)("h2",{id:"\u5b9a\u4e49"},"\u5b9a\u4e49"),(0,i.kt)("p",null,"\u5355\u8c03\u6808\u5c31\u662f\u5143\u7d20\u5355\u8c03\u9012\u589e\u6216\u9012\u51cf\u7684\u6808\u3002\u4ee5\u5355\u8c03\u9012\u589e\u6808\u4e3a\u4f8b\uff0c\u5982\u679c\u5f53\u524d\u5165\u6808\u5143\u7d20\u5927\u4e8e\u6808\u9876\u5143\u7d20\uff0c\u5219\u8fdb\u884c\u6b63\u5e38\u5165\u6808\uff0c\u5426\u5219\u5faa\u73af\u5f39\u51fa\u6808\u5185\u5143\u7d20\uff0c\u76f4\u5230\u6808\u4e3a\u7a7a\u6216\u8005\u6808\u9876\u5143\u7d20\u5c0f\u4e8e\u5165\u6808\u5143\u7d20\uff0c\u7136\u540e\u518d\u6b63\u5e38\u5165\u6808"),(0,i.kt)("h2",{id:"\u7528\u4f8b"},"\u7528\u4f8b"),(0,i.kt)("p",null,"\u4e0b\u9762\u4ecb\u7ecd\u51e0\u79cd\u5355\u8c03\u6808\u7684\u7528\u4f8b"),(0,i.kt)("h3",{id:"\u4e70\u5356\u80a1\u7968\u7684\u6700\u4f73\u65f6\u673a"},"\u4e70\u5356\u80a1\u7968\u7684\u6700\u4f73\u65f6\u673a"),(0,i.kt)("p",null,"\u5148\u770b\u4e00\u9053\u7b80\u5355\u7684\u7b97\u6cd5\u9898\uff1a",(0,i.kt)("a",{parentName:"p",href:"https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/"},"\u4e70\u5356\u80a1\u7968\u7684\u6700\u4f73\u65f6\u673a"),"\uff0c\u539f\u9898\u63cf\u8ff0\u5982\u4e0b\uff1a"),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"\u7ed9\u5b9a\u4e00\u4e2a\u6570\u7ec4prices\uff0c\u5b83\u7684\u7b2ci\u4e2a\u5143\u7d20prices","[i]","\u8868\u793a\u4e00\u652f\u7ed9\u5b9a\u80a1\u7968\u7b2ci\u5929\u7684\u4ef7\u683c\u3002\u4f60\u53ea\u80fd\u9009\u62e9\u67d0\u4e00\u5929\u4e70\u5165\u8fd9\u53ea\u80a1\u7968\uff0c\u5e76\u9009\u62e9\u5728\u672a\u6765\u7684\u67d0\u4e00\u4e2a\u4e0d\u540c\u7684\u65e5\u5b50\u5356\u51fa\u8be5\u80a1\u7968\u3002\u8bbe\u8ba1\u4e00\u4e2a\u7b97\u6cd5\u6765\u8ba1\u7b97\u4f60\u6240\u80fd\u83b7\u53d6\u7684\u6700\u5927\u5229\u6da6\u3002\u8fd4\u56de\u4f60\u53ef\u4ee5\u4ece\u8fd9\u7b14\u4ea4\u6613\u4e2d\u83b7\u53d6\u7684\u6700\u5927\u5229\u6da6\u3002\u5982\u679c\u4f60\u4e0d\u80fd\u83b7\u53d6\u4efb\u4f55\u5229\u6da6\uff0c\u8fd4\u56de0\u3002\u6bd4\u5982\u8f93\u5165\u6570\u7ec4\u4e3a","[7,1,5,3,6,4]","\uff0c\u8f93\u51fa\u6700\u5927\u5229\u6da65")),(0,i.kt)("p",null,"\u4f7f\u7528\u5355\u8c03\u6808\u89e3\u51b3\u8fd9\u4e2a\u95ee\u9898\u7684\u57fa\u672c\u601d\u8def\uff1a\u7ef4\u62a4\u4e00\u4e2a\u5355\u8c03\u9012\u589e\u6808\uff0c\u904d\u5386prices\u6570\u7ec4\u5c06\u5176\u5143\u7d20prices","[i]","\u538b\u5165\u8be5\u5355\u8c03\u6808\uff0c\u7136\u540e\u6808\u9876\u5143\u7d20\u51cf\u53bb\u6808\u5e95\u5143\u7d20\u5f97\u5230\u76ee\u524d\u53ef\u83b7\u5f97\u7684\u6700\u5927\u5229\u6da6\uff0c\u53d6\u6240\u6709\u8f6e\u5229\u6da6\u7684\u6700\u5927\u503c\u5373\u4e3a\u6240\u6c42\u7b54\u6848\uff0c\u4ee3\u7801\u5982\u4e0b\u6240\u793a\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java",metastring:"{3,7}","{3,7}":!0},"public int maxProfit(int[] prices) {\n    Deque<Integer> stack = new LinkedList<>();\n    stack.push(prices[0]);\n    int maxProfit = 0;\n\n    for (int price : prices) {\n        while(!stack.isEmpty() && price < stack.peek()) {\n            stack.pop();\n        }\n        stack.push(price);\n        maxProfit = Math.max(maxProfit, stack.getFirst() - stack.getLast());\n    }\n    return maxProfit;\n}\n")),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"\u63d0\u793a")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("ol",{parentName:"div"},(0,i.kt)("li",{parentName:"ol"},"\u4e8b\u5148\u628a\u7b2c\u4e00\u5929\u4ef7\u683c\u76f4\u63a5\u538b\u5165\u6808"),(0,i.kt)("li",{parentName:"ol"},"while\u5faa\u73af\u8981\u8fdb\u884c\u6808\u7684\u975e\u7a7a\u5224\u65ad\uff0c\u5426\u5219\u5f53\u524d\u662f\u5386\u53f2\u6700\u4f4e\u4ef7\u7684\u8bdd\uff0cpeek\u65b9\u6cd5\u8fd4\u56denull\u548cprice\u6bd4\u8f83")))),(0,i.kt)("h3",{id:"\u4e70\u5356\u80a1\u7968\u7684\u6700\u4f73\u65f6\u673aii"},"\u4e70\u5356\u80a1\u7968\u7684\u6700\u4f73\u65f6\u673aII"),(0,i.kt)("p",null,"\u8fdb\u9636\u4e00\u4e0b\uff0c",(0,i.kt)("a",{parentName:"p",href:"https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/"},"\u4e70\u5356\u80a1\u7968\u7684\u6700\u4f73\u65f6\u673aII"),"\uff0c\u539f\u9898\u63cf\u8ff0\u5982\u4e0b\uff1a"),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"\u7ed9\u5b9a\u4e00\u4e2a\u6570\u7ec4prices\uff0c\u5176\u4e2dprices","[i]","\u662f\u4e00\u652f\u7ed9\u5b9a\u80a1\u7968\u7b2ci\u5929\u7684\u4ef7\u683c\u3002\u8bbe\u8ba1\u4e00\u4e2a\u7b97\u6cd5\u6765\u8ba1\u7b97\u4f60\u6240\u80fd\u83b7\u53d6\u7684\u6700\u5927\u5229\u6da6\u3002\u4f60\u53ef\u4ee5\u5c3d\u53ef\u80fd\u5730\u5b8c\u6210\u66f4\u591a\u7684\u4ea4\u6613\uff08\u591a\u6b21\u4e70\u5356\u4e00\u652f\u80a1\u7968\uff09\u3002\u6ce8\u610f\uff1a\u4f60\u4e0d\u80fd\u540c\u65f6\u53c2\u4e0e\u591a\u7b14\u4ea4\u6613\uff08\u4f60\u5fc5\u987b\u5728\u518d\u6b21\u8d2d\u4e70\u524d\u51fa\u552e\u6389\u4e4b\u524d\u7684\u80a1\u7968\uff09\u3002")))}d.isMDXComponent=!0},3905:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return d}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),p=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},u=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),m=p(r),d=a,h=m["".concat(l,".").concat(d)]||m[d]||s[d]||i;return r?n.createElement(h,o(o({ref:t},u),{},{components:r})):n.createElement(h,o({ref:t},u))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=m;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,o[1]=c;for(var p=2;p<i;p++)o[p]=r[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"}}]);