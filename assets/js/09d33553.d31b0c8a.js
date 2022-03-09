"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[6400],{3905:function(t,e,a){a.d(e,{Zo:function(){return m},kt:function(){return k}});var r=a(7294);function n(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function l(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,r)}return a}function i(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?l(Object(a),!0).forEach((function(e){n(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function p(t,e){if(null==t)return{};var a,r,n=function(t,e){if(null==t)return{};var a,r,n={},l=Object.keys(t);for(r=0;r<l.length;r++)a=l[r],e.indexOf(a)>=0||(n[a]=t[a]);return n}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(r=0;r<l.length;r++)a=l[r],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(n[a]=t[a])}return n}var o=r.createContext({}),u=function(t){var e=r.useContext(o),a=e;return t&&(a="function"==typeof t?t(e):i(i({},e),t)),a},m=function(t){var e=u(t.components);return r.createElement(o.Provider,{value:e},t.children)},d={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},c=r.forwardRef((function(t,e){var a=t.components,n=t.mdxType,l=t.originalType,o=t.parentName,m=p(t,["components","mdxType","originalType","parentName"]),c=u(a),k=n,s=c["".concat(o,".").concat(k)]||c[k]||d[k]||l;return a?r.createElement(s,i(i({ref:e},m),{},{components:a})):r.createElement(s,i({ref:e},m))}));function k(t,e){var a=arguments,n=e&&e.mdxType;if("string"==typeof t||n){var l=a.length,i=new Array(l);i[0]=c;var p={};for(var o in e)hasOwnProperty.call(e,o)&&(p[o]=e[o]);p.originalType=t,p.mdxType="string"==typeof t?t:n,i[1]=p;for(var u=2;u<l;u++)i[u]=a[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,a)}c.displayName="MDXCreateElement"},3068:function(t,e,a){a.r(e),a.d(e,{frontMatter:function(){return p},contentTitle:function(){return o},metadata:function(){return u},assets:function(){return m},toc:function(){return d},default:function(){return k}});var r=a(3117),n=a(102),l=(a(7294),a(3905)),i=["components"],p={title:"Hive 3.x\u5b66\u4e60\u7b14\u8bb0(5)",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["Hive","BigData"],description:"Hive 3.1.2\u5b66\u4e60\u7b14\u8bb0(5)\uff1a\u6587\u4ef6\u538b\u7f29\u548c\u5b58\u50a8",hide_table_of_contents:!1},o=void 0,u={permalink:"/blog/2022/02/25/Learning-Hive3.x-05",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/blog/blog/2022/02/25-Learning-Hive3.x-05.md",source:"@site/blog/2022/02/25-Learning-Hive3.x-05.md",title:"Hive 3.x\u5b66\u4e60\u7b14\u8bb0(5)",description:"Hive 3.1.2\u5b66\u4e60\u7b14\u8bb0(5)\uff1a\u6587\u4ef6\u538b\u7f29\u548c\u5b58\u50a8",date:"2022-02-25T00:00:00.000Z",formattedDate:"February 25, 2022",tags:[{label:"Hive",permalink:"/blog/tags/hive"},{label:"BigData",permalink:"/blog/tags/big-data"}],readingTime:5.925,truncated:!0,authors:[{name:"\u4f55\u8f72",title:"Never settle down",url:"https://github.com/kayhaw",imageURL:"https://avatars.githubusercontent.com/u/16892835?v=4"}],frontMatter:{title:"Hive 3.x\u5b66\u4e60\u7b14\u8bb0(5)",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["Hive","BigData"],description:"Hive 3.1.2\u5b66\u4e60\u7b14\u8bb0(5)\uff1a\u6587\u4ef6\u538b\u7f29\u548c\u5b58\u50a8",hide_table_of_contents:!1},prevItem:{title:"Hive 3.x\u5b66\u4e60\u7b14\u8bb0(6)",permalink:"/blog/2022/02/27/Learning-Hive3.x-06"},nextItem:{title:"Hive 3.x\u5b66\u4e60\u7b14\u8bb0(4)",permalink:"/blog/2022/02/22/Learning-Hive3.x-04"}},m={authorsImageUrls:[void 0]},d=[{value:"\u6587\u4ef6\u538b\u7f29",id:"\u6587\u4ef6\u538b\u7f29",level:2},{value:"\u538b\u7f29\u914d\u7f6e",id:"\u538b\u7f29\u914d\u7f6e",level:3},{value:"\u5f00\u542fMapper\u538b\u7f29",id:"\u5f00\u542fmapper\u538b\u7f29",level:3},{value:"\u5f00\u542fReducer\u538b\u7f29",id:"\u5f00\u542freducer\u538b\u7f29",level:3},{value:"\u6587\u4ef6\u5b58\u50a8",id:"\u6587\u4ef6\u5b58\u50a8",level:2},{value:"\u884c/\u5217\u5f0f\u5b58\u50a8",id:"\u884c\u5217\u5f0f\u5b58\u50a8",level:3},{value:"TEXTFILE\u683c\u5f0f",id:"textfile\u683c\u5f0f",level:3},{value:"ORC\u683c\u5f0f",id:"orc\u683c\u5f0f",level:3},{value:"PARQUET\u683c\u5f0f",id:"parquet\u683c\u5f0f",level:3}],c={toc:d};function k(t){var e=t.components,a=(0,n.Z)(t,i);return(0,l.kt)("wrapper",(0,r.Z)({},c,a,{components:e,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"\ud83d\udcddHive 3.1.2\u5b66\u4e60\u7b14\u8bb0\u7b2c5\u7bc7\uff1a\u6587\u4ef6\u538b\u7f29\u548c\u5b58\u50a8\u3002"),(0,l.kt)("h2",{id:"\u6587\u4ef6\u538b\u7f29"},"\u6587\u4ef6\u538b\u7f29"),(0,l.kt)("p",null,"Hadoop\u652f\u6301\u7684\u538b\u7f29\u7b97\u6cd5\u5982\u4e0b\u8868\u6240\u793a\uff1a"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"\u538b\u7f29\u683c\u5f0f"),(0,l.kt)("th",{parentName:"tr",align:null},"\u7b97\u6cd5"),(0,l.kt)("th",{parentName:"tr",align:null},"\u6269\u5c55\u540d"),(0,l.kt)("th",{parentName:"tr",align:null},"\u662f\u5426\u53ef\u5207\u5206"),(0,l.kt)("th",{parentName:"tr",align:null},"\u89e3/\u7f16\u7801\u5668"),(0,l.kt)("th",{parentName:"tr",align:null},"Hadoop\u662f\u5426\u81ea\u5e26"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"deflate"),(0,l.kt)("td",{parentName:"tr",align:null},"DEFLATE"),(0,l.kt)("td",{parentName:"tr",align:null},".deflate"),(0,l.kt)("td",{parentName:"tr",align:null},"\u5426"),(0,l.kt)("td",{parentName:"tr",align:null},"org.apache.hadoop.io.compress.DefaultCodec"),(0,l.kt)("td",{parentName:"tr",align:null},"\u662f")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Gzip"),(0,l.kt)("td",{parentName:"tr",align:null},"DEFLATE"),(0,l.kt)("td",{parentName:"tr",align:null},".gz"),(0,l.kt)("td",{parentName:"tr",align:null},"\u5426"),(0,l.kt)("td",{parentName:"tr",align:null},"org.apache.hadoop.io.compress.GzipCodec"),(0,l.kt)("td",{parentName:"tr",align:null},"\u662f")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"bzip2"),(0,l.kt)("td",{parentName:"tr",align:null},"bzip2"),(0,l.kt)("td",{parentName:"tr",align:null},".bz2"),(0,l.kt)("td",{parentName:"tr",align:null},"\u662f"),(0,l.kt)("td",{parentName:"tr",align:null},"org.apache.hadoop.io.compress.BZip2Codec"),(0,l.kt)("td",{parentName:"tr",align:null},"\u662f")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"LZO"),(0,l.kt)("td",{parentName:"tr",align:null},"LZO"),(0,l.kt)("td",{parentName:"tr",align:null},".lzo"),(0,l.kt)("td",{parentName:"tr",align:null},"\u662f(\u9700\u8981\u5efa\u7d22\u5f15)"),(0,l.kt)("td",{parentName:"tr",align:null},"com.hadoop.compression.lzo.LzopCodec"),(0,l.kt)("td",{parentName:"tr",align:null},"\u5426")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Snappy"),(0,l.kt)("td",{parentName:"tr",align:null},"Snappy"),(0,l.kt)("td",{parentName:"tr",align:null},".snappy"),(0,l.kt)("td",{parentName:"tr",align:null},"\u5426"),(0,l.kt)("td",{parentName:"tr",align:null},"org.apache.hadoop.io.compress.SnappyCodec"),(0,l.kt)("td",{parentName:"tr",align:null},"\u5426")))),(0,l.kt)("p",null,"\u5404\u538b\u7f29\u7b97\u6cd5\u6027\u80fd\u6bd4\u8f83\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u538b\u7f29\u6bd4\uff1abzip2(gzip) > lzo(snappy)"),(0,l.kt)("li",{parentName:"ul"},"\u538b\u7f29\u3001\u89e3\u538b\u901f\u7387\uff1asnappy(lzo) > gzip > bzip")),(0,l.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"\u4e3a\u4ec0\u4e48Hadoop\u6ca1\u6709\u81ea\u5e26LZO\u548cSnappy\uff1f")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("p",{parentName:"div"},"LZO\u548cSnappy\u91c7\u7528GPL\u534f\u8bae\uff0c\u800cHadoop\u662fApache\u534f\u8bae\u3002"))),(0,l.kt)("h3",{id:"\u538b\u7f29\u914d\u7f6e"},"\u538b\u7f29\u914d\u7f6e"),(0,l.kt)("p",null,"\u4fee\u6539mapred-site.xml\u6587\u4ef6\u6216\u8005\u901a\u8fc7hive set\u547d\u4ee4\uff0c\u76f8\u5173\u53c2\u6570\u5982\u4e0b\u6240\u793a\uff1a"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"\u53c2\u6570\u540d"),(0,l.kt)("th",{parentName:"tr",align:null},"\u9ed8\u8ba4\u503c"),(0,l.kt)("th",{parentName:"tr",align:null},"\u5907\u6ce8"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"io.compression.codecs"),(0,l.kt)("td",{parentName:"tr",align:null},"org.apache.hadoop.io",(0,l.kt)("br",null),".compress.DefaultCodec"),(0,l.kt)("td",{parentName:"tr",align:null},"Hadoop\u6839\u636e\u6587\u4ef6\u6269\u5c55\u540d\u5224\u65ad\u662f\u5426\u652f\u6301\u67d0\u79cd\u89e3\u7801\u5668\uff0c\u5728core-site.xml\u4e2d\u914d\u7f6e")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"mapreduce.map",(0,l.kt)("br",null),".output.compress"),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null},"\u8bbe\u7f6e\u4e3atrue\u5f00\u542f\u538b\u7f29")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"mapreduce.map",(0,l.kt)("br",null),".output.compress.codec"),(0,l.kt)("td",{parentName:"tr",align:null},"org.apache.hadoop.io",(0,l.kt)("br",null),".compress.DefaultCodec"),(0,l.kt)("td",{parentName:"tr",align:null},"Mapper\u538b\u7f29\u683c\u5f0f")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"mapreduce.output",(0,l.kt)("br",null),".fileoutputformat.compress"),(0,l.kt)("td",{parentName:"tr",align:null},"false"),(0,l.kt)("td",{parentName:"tr",align:null},"\u8bbe\u7f6e\u4e3atrue\u5f00\u542f\u538b\u7f29")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"mapreduce.output",(0,l.kt)("br",null),".fileoutputformat.compress.codec"),(0,l.kt)("td",{parentName:"tr",align:null},"org.apache.hadoop.io",(0,l.kt)("br",null),".compress.DefaultCodec"),(0,l.kt)("td",{parentName:"tr",align:null},"\u4f7f\u7528gzip\u6216\u8005bzip2")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"mapreduce.output",(0,l.kt)("br",null),".fileoutputformat.compress.type"),(0,l.kt)("td",{parentName:"tr",align:null},"RECORD"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"td"},"SequenceFile"),"\u8f93\u51fa\u4f7f\u7528\u7684\u538b\u7f29\u7c7b\u578b\uff0c\u53e6\u53ef\u9009NONE\u548cBLOCK")))),(0,l.kt)("h3",{id:"\u5f00\u542fmapper\u538b\u7f29"},"\u5f00\u542fMapper\u538b\u7f29"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u5f00\u542fHive\u4e2d\u95f4\u4f20\u8f93\u6570\u636e\u538b\u7f29\uff1a",(0,l.kt)("inlineCode",{parentName:"li"},"set hive.exec.compress.intermediate=true;"),"\uff1b"),(0,l.kt)("li",{parentName:"ol"},"\u5f00\u542fHadoop\u4e2dMapper\u8f93\u51fa\u538b\u7f29\uff1a",(0,l.kt)("inlineCode",{parentName:"li"},"set mapreduce.map.output.compress=true;"),"\uff1b"),(0,l.kt)("li",{parentName:"ol"},"\u8bbe\u7f6eHadoop\u4e2dMapper\u538b\u7f29\u683c\u5f0f\uff1a",(0,l.kt)("inlineCode",{parentName:"li"},"set mapreduce.map.output.compress.codec=org.apache.hadoop.io.compress.SnappyCodec;"),"\uff1b")),(0,l.kt)("h3",{id:"\u5f00\u542freducer\u538b\u7f29"},"\u5f00\u542fReducer\u538b\u7f29"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u5f00\u542fHive\u6700\u7ec8\u8f93\u51fa\u6570\u636e\u538b\u7f29\u529f\u80fd\uff1a",(0,l.kt)("inlineCode",{parentName:"li"},"set hive.exec.compress.output=true;"),"\uff1b"),(0,l.kt)("li",{parentName:"ol"},"\u5f00\u542fHadoop\u4e2dReducer\u8f93\u51fa\u538b\u7f29\uff1a",(0,l.kt)("inlineCode",{parentName:"li"},"set mapreduce.output.fileoutputformat.compress=true;"),"\uff1b"),(0,l.kt)("li",{parentName:"ol"},"\u8bbe\u7f6eHadoop\u4e2dReducer\u538b\u7f29\u683c\u5f0f\uff1a",(0,l.kt)("inlineCode",{parentName:"li"},"set mapreduce.output.fileoutputformat.compress.codec=org.apache.hadoop.io.compress.SnappyCodec;"),"\uff1b"),(0,l.kt)("li",{parentName:"ol"},"\u8bbe\u7f6eHadoop\u4e2dReducer\u538b\u7f29\u5355\u4f4d\uff1a",(0,l.kt)("inlineCode",{parentName:"li"},"set mapreduce.output.fileoutputformat.compress.type=BLOCK;"),"\uff1b")),(0,l.kt)("p",null,"\u5176\u4e2dmapreduce.output.fileoutputformat.compress.type\u53c2\u6570\u4ec5\u7528\u4e8e\u7f16\u7801\u65b9\u5f0f\u8bbe\u7f6e\u4e3aSequenceFile\u65f6\uff0c\u9ed8\u8ba4\u4e3aRECORD\uff0c\u4f46\u5efa\u8bae\u4f7f\u7528BLOCK\u3002"),(0,l.kt)("h2",{id:"\u6587\u4ef6\u5b58\u50a8"},"\u6587\u4ef6\u5b58\u50a8"),(0,l.kt)("p",null,"Hive\u652f\u6301\u7684\u6587\u4ef6\u5b58\u50a8\u683c\u5f0f\u6709TEXTFILE\u3001SEQUENCEFILE\u3001ORC\u548cPARQUET\u3002\u5176\u4e2dTEXTFILE\u548cSEQUENCEFILE\u57fa\u4e8e\u884c\u5b58\u50a8\uff0c\u800cORC\u548cPARQUET\u57fa\u4e8e\u5217\u5b58\u50a8\u3002"),(0,l.kt)("h3",{id:"\u884c\u5217\u5f0f\u5b58\u50a8"},"\u884c/\u5217\u5f0f\u5b58\u50a8"),(0,l.kt)("p",null,"\u884c\u5f0f\u5b58\u50a8\u548c\u5217\u5f0f\u5b58\u50a8\u5982\u4e0b\u56fe\u6240\u793a\uff0c\u524d\u8005\u4ee5\u4e00\u884c\u6570\u636e\u4e3a\u5355\u4f4d\u4f9d\u6b21\u5b58\u50a8\uff0c\u540e\u8005\u4ee5\u4e00\u5217\u6570\u636e\u4e3a\u5355\u4f4d\u4f9d\u6b21\u5b58\u50a8\u3002"),(0,l.kt)("p",null,"\u67e5\u8be2\u6ee1\u8db3\u6761\u4ef6\u7684\u4e00\u884c\u6570\u636e\u65f6\uff0c\u5217\u5f0f\u5b58\u50a8\u9700\u8981\u53d6\u6bcf\u4e2a\u805a\u96c6\u7684\u5b57\u6bb5\u627e\u5230\u5bf9\u5e94\u5217\u503c\uff0c\u800c\u884c\u5b58\u50a8\u53ea\u9700\u8981\u627e\u5230\u5176\u4e2d\u4e00\u4e2a\u503c\uff0c\u5176\u4f59\u503c\u90fd\u5728\u76f8\u90bb\u5730\u65b9\uff0c\u6b64\u65f6\u884c\u5f0f\u5b58\u50a8\u67e5\u8be2\u901f\u5ea6\u4f18\u4e8e\u5217\u5f0f\u5b58\u50a8\u3002"),(0,l.kt)("p",null,"\u7531\u4e8e\u6bcf\u4e2a\u5b57\u6bb5\u7684\u6570\u636e\u805a\u96c6\u5b58\u50a8\uff0c\u5f53\u53ea\u9700\u8981\u67e5\u8be2\u5c11\u6570\u51e0\u4e2a\u5b57\u6bb5\u65f6\u5927\u5927\u51cf\u5c11\u8bfb\u53d6\u6570\u636e\u91cf\u3002\u7531\u4e8e\u6bcf\u4e2a\u5b57\u6bb5\u7c7b\u578b\u76f8\u540c\uff0c\u5217\u5f0f\u5b58\u50a8\u53ef\u4ee5\u8bbe\u8ba1\u66f4\u597d\u7684\u538b\u7f29\u7b97\u6cd5\u3002"),(0,l.kt)("h3",{id:"textfile\u683c\u5f0f"},"TEXTFILE\u683c\u5f0f"),(0,l.kt)("p",null,"Hive\u4f7f\u7528\u7684\u9ed8\u8ba4\u683c\u5f0f\uff0c\u4e0d\u8981\u538b\u7f29\u6570\u636e\uff0c\u6570\u636e\u5b58\u50a8\u3001\u89e3\u6790\u5f00\u9500\u5927\u3002\u53ef\u7ed3\u5408Gzip\u3001Bzip2\u4f7f\u7528\uff0c\u4f46\u4f7f\u7528Gzip\u65f6Hive\u4e0d\u5bf9\u5207\u5206\u6570\u636e\uff0c\u56e0\u6b64\u65e0\u6cd5\u5e76\u884c\u64cd\u4f5c\u3002"),(0,l.kt)("h3",{id:"orc\u683c\u5f0f"},"ORC\u683c\u5f0f"),(0,l.kt)("p",null,"ORC(Optimized Row Columnar)\u662f\u4e00\u79cd\u4e8c\u8fdb\u5236\u6587\u4ef6\uff0c\u75311\u81f3\u591a\u4e2astripe\u3001file footer\u548cpostscript\u7ec4\u6210\uff0c\u6bcf\u4e2astripe\u5305\u542b3\u90e8\u5206\uff1aindex data\u3001row data\u3001stripe footer\uff0c\u5982\u4e0b\u6240\u793a\u4e3aorc\u6587\u4ef6\u7ed3\u6784\u56fe\uff1a"),(0,l.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/blog/HiveNotes/OrcFileLayout.png",title:"Orc File Layout"}),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"stripe",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"index data\uff1a\u8f7b\u91cf\u7ea7index\uff0c\u9ed8\u8ba4\u6bcf\u96941w\u884c\u505a\u4e00\u4e2a\u7d22\u5f15\uff0c\u8868\u793a\u5b57\u6bb5\u6570\u636e\u5728row data\u4e2d\u7684offset\uff1b"),(0,l.kt)("li",{parentName:"ul"},"row data\uff1a\u5177\u4f53\u6570\u636e\uff0c\u5206\u6210\u591a\u4e2astream\uff1b"),(0,l.kt)("li",{parentName:"ul"},"stripe footer\uff1a\u5b58\u653estream\u7c7b\u578b\u3001\u957f\u5ea6\u7b49\u4fe1\u606f\uff1b"))),(0,l.kt)("li",{parentName:"ul"},"file footer\uff1a\u5b58\u653estripe\u3001column\u6570\u636e\u7c7b\u578b\u7b49\uff1b"),(0,l.kt)("li",{parentName:"ul"},"postscript\uff1a\u5b58\u653e\u6587\u4ef6\u538b\u7f29\u7c7b\u578b\u548cfile footer\u957f\u5ea6\u7b49\u3002")),(0,l.kt)("p",null,"\u8bfb\u53d6ORC\u6587\u4ef6\u65f6\uff0c\u5148seek\u5230\u6587\u4ef6\u5c3e\u90e8\u8bfb\u53d6postscript\uff0c\u5f97\u5230file footer\u957f\u5ea6\uff0c\u518d\u8bfbfilefooter\uff0c\u5f97\u5230stripe\u4fe1\u606f\uff0c\u6700\u540e\u8bfb\u5199stripe\u5f97\u5230\u5217\u6570\u636e\uff0c\u5373\u4ece\u540e\u5f80\u524d\u8bfb\u53d6\u89e3\u6790\u3002"),(0,l.kt)("h3",{id:"parquet\u683c\u5f0f"},"PARQUET\u683c\u5f0f"),(0,l.kt)("p",null,"\u548cORC\u6587\u4ef6\u4e00\u6837\uff0cPARQUET\u6587\u4ef6\u4e5f\u662f\u4e00\u79cd\u4e8c\u8fdb\u5236\u6587\u4ef6\uff0c\u5305\u542b\u6570\u636e\u548c\u5143\u6570\u636e\uff0c\u56e0\u6b64PARQUET\u662f\u81ea\u89e3\u6790\u7684\uff0c\u5982\u4e0b\u6240\u793a\u4e3aparquet\u7ed3\u6784\u56fe\uff1a"),(0,l.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/blog/HiveNotes/ParquetFileLayout.gif",title:"Parquet File Layout"}),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Magic Number\uff1a4\u5b57\u8282\u5185\u5bb9",(0,l.kt)("inlineCode",{parentName:"li"},"PAR1"),"\uff0c\u6807\u8bc6\u5176\u4e3aPARQUET\u6587\u4ef6"),(0,l.kt)("li",{parentName:"ul"},"\u884c\u7ec4(Row Group)\uff1a\u6bcf\u4e2a\u884c\u7ec4\u5305\u542b\u4e00\u5b9a\u884c\u6570\uff0c\u4e00\u4e2aPARQUET\u6587\u4ef6\u81f3\u5c11\u5b58\u50a8\u4e00\u4e2a\u884c\u7ec4\uff0c\u7c7b\u4f3cstripe\uff1b",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"\u5217\u5757(Column Chunk)\uff1a\u884c\u7ec4\u4e2d\u7684\u6bcf\u4e00\u5217\u5b58\u5728\u4e00\u4e2a\u5217\u5757\u4e2d\uff0c\u6240\u6709\u5217\u8fde\u7eed\u5b58\u50a8\u5728\u884c\u7ec4\u6587\u4ef6\u4e2d\uff0c\u6bcf\u4e2a\u5217\u5757\u4e2d\u6570\u636e\u7c7b\u578b\u76f8\u540c\uff0c\u4f46\u53ef\u4ee5\u4f7f\u7528\u4e0d\u540c\u538b\u7f29\u7b97\u6cd5\uff1b",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"\u9875(Page)\uff1a\u6bcf\u4e00\u4e2a\u5217\u5757\u5212\u5206\u4e3a\u591a\u4e2a\u9875\uff0c\u9875\u662f\u6700\u5c0f\u7684\u7f16\u7801\u5355\u4f4d\uff0c\u540c\u4e00\u4e2a\u5217\u5757\u7684\u4e0d\u540c\u9875\u53ef\u4ee5\u4f7f\u7528\u4e0d\u540c\u7f16\u7801\u65b9\u5f0f\u3002"))))),(0,l.kt)("li",{parentName:"ul"},"Footer",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"Column meta data"))),(0,l.kt)("li",{parentName:"ul"},"Footer Length\uff1a4\u5b57\u8282\u5b58\u50a8\u6587\u4ef6\u5143\u6570\u636e\u957f\u5ea6"),(0,l.kt)("li",{parentName:"ul"},"Magic Number\uff1a4\u5b57\u8282\u5185\u5bb9",(0,l.kt)("inlineCode",{parentName:"li"},"PAR1"),"\uff0c\u6807\u8bc6\u5176\u4e3aPARQUET\u6587\u4ef6")),(0,l.kt)("p",null,"parquet\u6587\u4ef6\u9996\u5c3e\u662f\u56fa\u5b9a\u76844\u5b57\u8282\u5185\u5bb9'PAR1'\uff0c\u4ece\u5e95\u5f80\u4e0a\u8d70\u662ffooter length\u8868\u793a\u5143\u6570\u636e\u957f\u5ea6\uff0c\u901a\u8fc7footer length\u548c\u6587\u4ef6\u957f\u5ea6\u53ef\u4ee5\u8ba1\u7b97\u51fa\u5143\u6570\u636e\u504f\u79fb\u91cf\u4ece\u800c\u8bfb\u53d6\u3002\u5143\u6570\u636e\u5305\u542b\u884c\u7ec4\u5143\u6570\u636e\u4fe1\u606f\u3001\u8be5\u6587\u4ef6\u5b58\u50a8\u6570\u636e\u7684schema\u4fe1\u606f\u4ee5\u53ca\u9875\u5143\u6570\u636e\u3002"))}k.isMDXComponent=!0}}]);