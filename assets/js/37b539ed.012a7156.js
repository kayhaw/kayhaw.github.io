"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[9128],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=r.createContext({}),s=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(u.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,u=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),c=s(n),d=a,k=c["".concat(u,".").concat(d)]||c[d]||m[d]||i;return n?r.createElement(k,l(l({ref:t},p),{},{components:n})):r.createElement(k,l({ref:t},p))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,l=new Array(i);l[0]=c;var o={};for(var u in t)hasOwnProperty.call(t,u)&&(o[u]=t[u]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var s=2;s<i;s++)l[s]=n[s];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},470:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return o},contentTitle:function(){return u},metadata:function(){return s},assets:function(){return p},toc:function(){return m},default:function(){return d}});var r=n(3117),a=n(102),i=(n(7294),n(3905)),l=["components"],o={title:"Flink\u5165\u95e8\u5b66\u4e60(2)",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["Flink","BigData"],description:"Flink\u5165\u95e8\u5b66\u4e60(2)",hide_table_of_contents:!1},u=void 0,s={permalink:"/blog/2021/10/03/FlinkLearning-02",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/blog/blog/2021-10-03-FlinkLearning-02.mdx",source:"@site/blog/2021-10-03-FlinkLearning-02.mdx",title:"Flink\u5165\u95e8\u5b66\u4e60(2)",description:"Flink\u5165\u95e8\u5b66\u4e60(2)",date:"2021-10-03T00:00:00.000Z",formattedDate:"October 3, 2021",tags:[{label:"Flink",permalink:"/blog/tags/flink"},{label:"BigData",permalink:"/blog/tags/big-data"}],readingTime:.835,truncated:!0,authors:[{name:"\u4f55\u8f72",title:"Never settle down",url:"https://github.com/kayhaw",imageURL:"https://avatars.githubusercontent.com/u/16892835?v=4"}],frontMatter:{title:"Flink\u5165\u95e8\u5b66\u4e60(2)",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["Flink","BigData"],description:"Flink\u5165\u95e8\u5b66\u4e60(2)",hide_table_of_contents:!1},prevItem:{title:"\u6bcf\u65e5\u7b97\u6cd5\u9898-\u5b57\u7b26\u4e32\u7684\u6392\u5217",permalink:"/blog/2021/10/10/CheckInclusion"},nextItem:{title:"Flink\u5165\u95e8\u5b66\u4e60(1)",permalink:"/blog/2021/10/02/FlinkLearning-01"}},p={authorsImageUrls:[void 0]},m=[{value:"keyBy\u548cmaxBy",id:"keyby\u548cmaxby",level:2},{value:"DataStream\u91cd\u5206\u533a\u64cd\u4f5c",id:"datastream\u91cd\u5206\u533a\u64cd\u4f5c",level:2},{value:"FlinkJedisPoolConfig \u8bbe\u8ba1\u6a21\u5f0fBuilder",id:"flinkjedispoolconfig-\u8bbe\u8ba1\u6a21\u5f0fbuilder",level:2},{value:"window api",id:"window-api",level:2},{value:"\u65f6\u95f4\u8bed\u4e49",id:"\u65f6\u95f4\u8bed\u4e49",level:2}],c={toc:m};function d(e){var t=e.components,n=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Flink\u5165\u95e8\u5b66\u4e60\u7b2c\u4e00\u7bc7\uff0c\u6d41\u5904\u7406API"),(0,i.kt)("h2",{id:"keyby\u548cmaxby"},"keyBy\u548cmaxBy"),(0,i.kt)("p",null,"\u8f93\u5165\u6570\u636e\u6e90"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-txt"},"sensor_04,1633264100,36.8\nsensor_04,1633264101,37.8\nsensor_04,1633264102,35.8\nsensor_04,1633264103,38.8\n")),(0,i.kt)("p",null,"max\u8f93\u51fa\u7ed3\u679c:\u53ea\u66f4\u65b0max\u5b57\u6bb5\uff0c\u5176\u4ed6\u4e0d\u53d8"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"Sensor{id='sensor_04', timestamp=1633264100, temperature=36.8}\nSensor{id='sensor_04', timestamp=1633264100, temperature=37.8}\nSensor{id='sensor_04', timestamp=1633264100, temperature=37.8}\nSensor{id='sensor_04', timestamp=1633264100, temperature=38.8}\n")),(0,i.kt)("p",null,"maxBy\u8f93\u51fa\u7ed3\u679c\uff1a\u6253\u5370max\u5b57\u6bb5\u5bf9\u5e94\u7684\u8bb0\u5f55"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"Sensor{id='sensor_04', timestamp=1633264100, temperature=36.8}\nSensor{id='sensor_04', timestamp=1633264101, temperature=37.8}\nSensor{id='sensor_04', timestamp=1633264101, temperature=37.8}\nSensor{id='sensor_04', timestamp=1633264103, temperature=38.8}\n")),(0,i.kt)("p",null,"reduce\uff1a\u5f52\u7ea6\u6570\u636e\uff0c\u7075\u6d3b\u6027\u6bd4max\uff0cmaxBy\u66f4\u5f3a"),(0,i.kt)("p",null,"Flink\u5bf9POJO\u7684\u8981\u6c42"),(0,i.kt)("h2",{id:"datastream\u91cd\u5206\u533a\u64cd\u4f5c"},"DataStream\u91cd\u5206\u533a\u64cd\u4f5c"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"keyBy"),(0,i.kt)("li",{parentName:"ul"},"rebalance\uff1a\u5e73\u5747\u5206\u533a\uff0c\u4ee5round robbins\u6a21\u5f0f"),(0,i.kt)("li",{parentName:"ul"},"broadcast"),(0,i.kt)("li",{parentName:"ul"},"shuffle"),(0,i.kt)("li",{parentName:"ul"},"forward"),(0,i.kt)("li",{parentName:"ul"},"rescale"),(0,i.kt)("li",{parentName:"ul"},"global")),(0,i.kt)("h2",{id:"flinkjedispoolconfig-\u8bbe\u8ba1\u6a21\u5f0fbuilder"},"FlinkJedisPoolConfig \u8bbe\u8ba1\u6a21\u5f0fBuilder"),(0,i.kt)("h2",{id:"window-api"},"window api"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"windowAll\u65b9\u6cd5")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},"allowedLateness() \u5141\u8bb8\u7a97\u53e3trigger\u540e\u518d\u7b49\u4e00\u6bb5\u65f6\u95f4"))),(0,i.kt)("h2",{id:"\u65f6\u95f4\u8bed\u4e49"},"\u65f6\u95f4\u8bed\u4e49"),(0,i.kt)("p",null,"\u9ed8\u8ba4\u662f\u5904\u7406\u65f6\u95f4"))}d.isMDXComponent=!0}}]);