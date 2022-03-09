"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[7471],{3905:function(e,t,a){a.d(t,{Zo:function(){return d},kt:function(){return c}});var n=a(7294);function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){l(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function r(e,t){if(null==e)return{};var a,n,l=function(e,t){if(null==e)return{};var a,n,l={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(l[a]=e[a]);return l}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(l[a]=e[a])}return l}var p=n.createContext({}),s=function(e){var t=n.useContext(p),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},d=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,l=e.mdxType,o=e.originalType,p=e.parentName,d=r(e,["components","mdxType","originalType","parentName"]),u=s(a),c=l,k=u["".concat(p,".").concat(c)]||u[c]||m[c]||o;return a?n.createElement(k,i(i({ref:t},d),{},{components:a})):n.createElement(k,i({ref:t},d))}));function c(e,t){var a=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var o=a.length,i=new Array(o);i[0]=u;var r={};for(var p in t)hasOwnProperty.call(t,p)&&(r[p]=t[p]);r.originalType=e,r.mdxType="string"==typeof e?e:l,i[1]=r;for(var s=2;s<o;s++)i[s]=a[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},6766:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return r},contentTitle:function(){return p},metadata:function(){return s},assets:function(){return d},toc:function(){return m},default:function(){return c}});var n=a(3117),l=a(102),o=(a(7294),a(3905)),i=["components"],r={title:"Hadoop 3.x\u5b66\u4e60\u7b14\u8bb0(2)",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["Hadoop","BigData"],description:"Hadoop 3.1.3\u5b66\u4e60\u7b14\u8bb0(2)",hide_table_of_contents:!1},p=void 0,s={permalink:"/blog/2022/01/30/Learning-Hadoop3.x-02",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/blog/blog/2022-01-30-Learning-Hadoop3.x-02.md",source:"@site/blog/2022-01-30-Learning-Hadoop3.x-02.md",title:"Hadoop 3.x\u5b66\u4e60\u7b14\u8bb0(2)",description:"Hadoop 3.1.3\u5b66\u4e60\u7b14\u8bb0(2)",date:"2022-01-30T00:00:00.000Z",formattedDate:"January 30, 2022",tags:[{label:"Hadoop",permalink:"/blog/tags/hadoop"},{label:"BigData",permalink:"/blog/tags/big-data"}],readingTime:13.61,truncated:!0,authors:[{name:"\u4f55\u8f72",title:"Never settle down",url:"https://github.com/kayhaw",imageURL:"https://avatars.githubusercontent.com/u/16892835?v=4"}],frontMatter:{title:"Hadoop 3.x\u5b66\u4e60\u7b14\u8bb0(2)",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["Hadoop","BigData"],description:"Hadoop 3.1.3\u5b66\u4e60\u7b14\u8bb0(2)",hide_table_of_contents:!1},prevItem:{title:"Hadoop 3.x\u5b66\u4e60\u7b14\u8bb0(3)",permalink:"/blog/2022/01/31/Learning-Hadoop3.x-03"},nextItem:{title:"Hadoop 3.x\u5b66\u4e60\u7b14\u8bb0(1)",permalink:"/blog/2022/01/29/Learning-Hadoop3.x-01"}},d={authorsImageUrls:[void 0]},m=[{value:"HDFS\u7b80\u4ecb",id:"hdfs\u7b80\u4ecb",level:2},{value:"\u7ec4\u6210\u67b6\u6784",id:"\u7ec4\u6210\u67b6\u6784",level:3},{value:"\u5757\u5927\u5c0f",id:"\u5757\u5927\u5c0f",level:3},{value:"HDFS Shell\u64cd\u4f5c",id:"hdfs-shell\u64cd\u4f5c",level:2},{value:"\u4e0a\u4f20\u6587\u4ef6",id:"\u4e0a\u4f20\u6587\u4ef6",level:3},{value:"\u4e0b\u8f7d\u6587\u4ef6",id:"\u4e0b\u8f7d\u6587\u4ef6",level:3},{value:"HDFS\u6587\u4ef6\u7cfb\u7edf\u64cd\u4f5c",id:"hdfs\u6587\u4ef6\u7cfb\u7edf\u64cd\u4f5c",level:3},{value:"HDFS API\u64cd\u4f5c",id:"hdfs-api\u64cd\u4f5c",level:2},{value:"Windows\u5f00\u53d1\u73af\u5883\u51c6\u5907",id:"windows\u5f00\u53d1\u73af\u5883\u51c6\u5907",level:3},{value:"FileSystem Java API",id:"filesystem-java-api",level:3},{value:"HDFS\u8bfb\u5199\u6d41\u7a0b",id:"hdfs\u8bfb\u5199\u6d41\u7a0b",level:2},{value:"\u5199\u6570\u636e",id:"\u5199\u6570\u636e",level:3},{value:"\u8282\u70b9\u8ddd\u79bb\u8ba1\u7b97",id:"\u8282\u70b9\u8ddd\u79bb\u8ba1\u7b97",level:3},{value:"\u673a\u67b6\u611f\u77e5",id:"\u673a\u67b6\u611f\u77e5",level:3},{value:"\u8bfb\u6570\u636e",id:"\u8bfb\u6570\u636e",level:3},{value:"NN\u548c2NN",id:"nn\u548c2nn",level:2},{value:"fsimage\u548cEdits",id:"fsimage\u548cedits",level:3},{value:"oiv\u548coev",id:"oiv\u548coev",level:3},{value:"Checkpoint\u8bbe\u7f6e",id:"checkpoint\u8bbe\u7f6e",level:3},{value:"DataNode\u5de5\u4f5c\u673a\u5236",id:"datanode\u5de5\u4f5c\u673a\u5236",level:2},{value:"\u6570\u636e\u5b8c\u6574\u6027",id:"\u6570\u636e\u5b8c\u6574\u6027",level:3},{value:"\u8d85\u65f6\u8bbe\u7f6e",id:"\u8d85\u65f6\u8bbe\u7f6e",level:3},{value:"\u603b\u7ed3",id:"\u603b\u7ed3",level:2}],u={toc:m};function c(e){var t=e.components,a=(0,l.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"\ud83d\udcddHadoop 3.1.3\u5b66\u4e60\u7b14\u8bb0\u7b2c2\u7bc7\uff1aHDFS\u3002"),(0,o.kt)("h2",{id:"hdfs\u7b80\u4ecb"},"HDFS\u7b80\u4ecb"),(0,o.kt)("p",null,"HDFS(Hadoop Distributed File System)\u662f\u4e00\u4e2a\u5206\u5e03\u5f0f\u6587\u4ef6\u5b58\u50a8\u7cfb\u7edf\uff0c\u9002\u7528\u4e8e\u4e00\u6b21\u5199\u5165\uff0c\u591a\u6b21\u8bfb\u51fa\u7684\u573a\u666f\u3002"),(0,o.kt)("p",null,"\u4f18\u70b9\ud83d\ude04\uff1a"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u9ad8\u5bb9\u9519\u6027\uff1a\u6570\u636e\u591a\u526f\u672c\u4fdd\u5b58\uff0c\u67d0\u4e2a\u526f\u672c\u4e22\u5931\u540e\u80fd\u591f\u81ea\u52a8\u6062\u590d\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u9002\u5408\u5904\u7406\u5927\u6570\u636e\uff1a\u5927\u5c0f\u89c4\u6a21\u652f\u6301TB\u751a\u81f3PB\uff0c\u6570\u91cf\u89c4\u6a21\u652f\u6301\u767e\u4e07\u7ea7\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u6784\u5efa\u6210\u672c\u4f4e\uff1a\u53ef\u4ee5\u5728\u591a\u4e2a\u5ec9\u4ef7\u673a\u5668\u4e0a\u6784\u5efa\u526f\u672c\u3002")),(0,o.kt)("p",null,"\u7f3a\u70b9\ud83d\ude20\uff1a"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u6570\u636e\u8bbf\u95ee\u5ef6\u8fdf\u9ad8\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u65e0\u6cd5\u9ad8\u6548\u5bf9\u5927\u91cf\u5c0f\u6587\u4ef6\u8fdb\u884c\u5b58\u50a8\uff1a\u5360\u7528NameNode\u5185\u5b58\u6765\u5b58\u50a8\u6587\u4ef6\u76ee\u5f55\u548c\u5757\u4fe1\u606f\uff0c\u5e76\u4e14\u5bfb\u5740\u65f6\u95f4\u8d85\u8fc7\u8bfb\u53d6\u65f6\u95f4\uff0c\u8fdd\u53cdHDFS\u8bbe\u8ba1\u76ee\u6807\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u4e0d\u652f\u6301\u5e76\u53d1\u5199\u5165\u3001\u968f\u673a\u4fee\u6539\uff1a\u4e00\u4e2a\u6587\u4ef6\u4e0d\u80fd\u591a\u7ebf\u7a0b\u540c\u65f6\u5199\uff0c\u4ec5\u652f\u6301\u6570\u636e\u8ffd\u52a0\uff0c\u4e0d\u652f\u6301\u968f\u673a\u4fee\u6539\u3002")),(0,o.kt)("h3",{id:"\u7ec4\u6210\u67b6\u6784"},"\u7ec4\u6210\u67b6\u6784"),(0,o.kt)("img",{style:{width:"80%",height:"80%"},src:"/static/img/blog/HadoopNotes/hdfsarchitecture.png",title:"Hadoop Architecture"}),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"NameNode(NN)\uff1a\u7ba1\u7406HDFS\u547d\u540d\u7a7a\u95f4\uff0c\u914d\u7f6e\u526f\u672c\u7b56\u7565\uff0c\u7ba1\u7406\u6570\u636e\u5757\u6620\u5c04\u4fe1\u606f\uff0c\u5904\u7406\u5ba2\u6237\u7aef\u8bfb\u5199\u8bf7\u6c42\uff1b"),(0,o.kt)("li",{parentName:"ul"},"DataNode\uff1a\u5b58\u50a8\u6570\u636e\u5757\uff0c\u6267\u884c\u6570\u636e\u5757\u8bfb\u5199\u64cd\u4f5c\uff1b"),(0,o.kt)("li",{parentName:"ul"},"SecondaryNameNode\uff1a\u5e76\u975eNN\u7684\u70ed\u5907\uff0c\u5728NN\u6302\u6389\u65f6\u4e0d\u80fd\u9a6c\u4e0a\u66ff\u6362\u5176\u529f\u80fd\uff0c\u7528\u4e8e\u5206\u62c5NN\u5de5\u4f5c\uff0c\u6bd4\u5982\u5b9a\u671f\u5408\u5e76Fsimage\u548cEdits\u5e76\u63a8\u9001\u7ed9NN\u3002\u5728\u7d27\u6025\u60c5\u51b5\u4e0b\u53ef\u8f85\u52a9\u6062\u590dNameNode\uff1b"),(0,o.kt)("li",{parentName:"ul"},"Client\uff1a\u5207\u5206\u6587\u4ef6\u3001\u4e0eNameNode\u4ea4\u4e92\u83b7\u53d6\u6587\u4ef6\u4f4d\u7f6e\u4fe1\u606f\u3001\u4e0eDataNode\u4ea4\u4e92\u8bfb\u5199\u6570\u636e\u3001\u63d0\u4f9bHDFS\u7ba1\u7406\u547d\u4ee4\u3001\u63d0\u4f9bHDFS\u589e\u5220\u6539\u67e5\u547d\u4ee4\u3002")),(0,o.kt)("h3",{id:"\u5757\u5927\u5c0f"},"\u5757\u5927\u5c0f"),(0,o.kt)("p",null,"HDFS\u6587\u4ef6\u5728\u7269\u7406\u5b58\u50a8\u4e0a\u662f\u5206\u5757(Block)\u5b58\u50a8\uff0c\u901a\u8fc7\u53c2\u6570",(0,o.kt)("inlineCode",{parentName:"p"},"dfs.blocksize"),"\u6307\u5b9a\uff0c\u9ed8\u8ba4\u5927\u5c0f\u4e3a128MB(Hadoop 2.x/3.x\uff0cHadoop 1.x\u4e3a64MB)\u3002"),(0,o.kt)("p",null,"\u5f53\u5bfb\u5740\u65f6\u95f4\u4e3a\u4f20\u8f93\u65f6\u95f4\u76841%\u65f6\u8ba4\u4e3a\u8fbe\u5230\u6700\u4f73\u72b6\u6001(\u2753)\uff1a\u5982\u679c\u5757\u8bbe\u7f6e\u8fc7\u5c0f\uff0c\u589e\u52a0\u5bfb\u5740\u65f6\u95f4\uff0c\u5982\u679c\u5757\u8bbe\u7f6e\u8fc7\u5927\u5219\u4ece\u78c1\u76d8\u4f20\u8f93\u6570\u636e\u7684\u65f6\u95f4\u5927\u4e8e\u5bfb\u5740\u65f6\u95f4\u3002\u56e0\u6b64\uff0c\u5757\u5927\u5c0f\u8bbe\u7f6e\u53d6\u51b3\u4e8e\u78c1\u76d8\u4f20\u8f93\u901f\u7387\u3002"),(0,o.kt)("h2",{id:"hdfs-shell\u64cd\u4f5c"},"HDFS Shell\u64cd\u4f5c"),(0,o.kt)("p",null,"\u4e24\u79cd\u547d\u4ee4\u683c\u5f0f\uff1a",(0,o.kt)("inlineCode",{parentName:"p"},"hadoop fs [options] ..."),"\u548c",(0,o.kt)("inlineCode",{parentName:"p"},"hdfs dfs [options] ..."),"\uff0c\u901a\u8fc7",(0,o.kt)("inlineCode",{parentName:"p"},"hadoop fs -help <\u9009\u9879\u540d>"),"\u6765\u67e5\u770b\u547d\u4ee4\u7528\u6cd5\u3002"),(0,o.kt)("h3",{id:"\u4e0a\u4f20\u6587\u4ef6"},"\u4e0a\u4f20\u6587\u4ef6"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-moveFromLocal <local_file_path> <hadoop_file_path>"),"\uff1a\u4ece\u672c\u5730",(0,o.kt)("strong",{parentName:"li"},"\u526a\u5207"),"\u6587\u4ef6\u5230HDFS\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-copyFromLocal <local_file_path> <hadoop_file_path>"),"\uff1a\u4ece\u672c\u5730",(0,o.kt)("strong",{parentName:"li"},"\u590d\u5236"),"\u6587\u4ef6\u5230HDFS\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-put <local_file_path> <hadoop_file_path>"),"\uff1a\u540ccopyFromLocal\uff0c\u63a8\u8350\u4f7f\u7528\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-appendToFile <local_file_path> <hadoop_file_path>"),"\uff1a\u8ffd\u52a0\u6587\u4ef6\u5185\u5bb9\u5230HDFS\u6587\u4ef6\uff0c\u672c\u5730\u6587\u4ef6\u4e0d\u5220\u9664\u3002")),(0,o.kt)("h3",{id:"\u4e0b\u8f7d\u6587\u4ef6"},"\u4e0b\u8f7d\u6587\u4ef6"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-copyToLocal <hadoop_file_path> <local_file_path>"),"\uff1a\u4eceHDFS",(0,o.kt)("strong",{parentName:"li"},"\u62f7\u8d1d"),"\u6587\u4ef6\u5230\u672c\u5730\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-get <hadoop_file_path> <local_file_path>"),"\uff1a\u540c",(0,o.kt)("inlineCode",{parentName:"li"},"-copyToLocal"),"\uff0c\u63a8\u8350\u4f7f\u7528\u3002")),(0,o.kt)("h3",{id:"hdfs\u6587\u4ef6\u7cfb\u7edf\u64cd\u4f5c"},"HDFS\u6587\u4ef6\u7cfb\u7edf\u64cd\u4f5c"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-ls"),"\uff1a\u663e\u793a\u76ee\u5f55\u4fe1\u606f\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-cat"),"\uff1a\u663e\u793a\u6587\u4ef6\u5185\u5bb9\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-chgrp"),"\u3001",(0,o.kt)("inlineCode",{parentName:"li"},"-chmod"),"\u3001",(0,o.kt)("inlineCode",{parentName:"li"},"-chown"),"\uff1a\u4fee\u6539\u6587\u4ef6\u5c5e\u6027\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-mkdir"),"\uff1a\u521b\u5efa\u76ee\u5f55\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-cp"),"\uff1aHDFS\u5185\u6587\u4ef6\u62f7\u8d1d\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-mv"),"\uff1aHDFS\u5185\u6587\u4ef6\u79fb\u52a8\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-tail"),"\uff1a\u663e\u793a\u6587\u4ef6\u672b\u5c3e1KB\u6570\u636e\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-rm"),"\uff1a\u5220\u9664\u6587\u4ef6\uff0c\u52a0\u4e0a",(0,o.kt)("inlineCode",{parentName:"li"},"-r"),"\u53c2\u6570\u9012\u5f52\u5220\u9664\u6587\u4ef6\u5939\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-du"),"\uff1a\u7edf\u8ba1\u6587\u4ef6\u5927\u5c0f\uff0c\u5982\u4e0b\u6240\u793a\uff0c\u524d\u8005\u8868\u793a\u5355\u4e2a\u6587\u4ef6\u5927\u5c0f14\uff0c\u540e\u8005\u8868\u793a14*3\u4e2a\u526f\u672c\u603b\u5927\u5c0f\uff1b")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"[kayhaw@hadoop102 hadoop-3.1.3]$ hadoop fs -du -h /sanguo\n14  42  /sanguo/shu.txt\n7   21  /sanguo/weiguo.txt\n6   18  /sanguo/wu.txt\n")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"-setrep"),"\uff1a\u8bbe\u7f6e\u6587\u4ef6\u526f\u672c\u6570\u91cf\uff0c\u53ea\u662f\u8bb0\u5f55\u5728NameNode\u7684\u5143\u6570\u636e\u4e2d\uff0c\u5b9e\u9645\u526f\u672c\u6570\u91cf\u4f9d\u8d56\u4e8eDataNode\u6570\u91cf\u3002")),(0,o.kt)("h2",{id:"hdfs-api\u64cd\u4f5c"},"HDFS API\u64cd\u4f5c"),(0,o.kt)("h3",{id:"windows\u5f00\u53d1\u73af\u5883\u51c6\u5907"},"Windows\u5f00\u53d1\u73af\u5883\u51c6\u5907"),(0,o.kt)("p",null,"\u4ece",(0,o.kt)("a",{parentName:"p",href:"https://github.com/cdarlint/winutils"},"cdarlint/winutils"),"\u5904\u4e0b\u8f7d\u5bf9\u5e94\u7248\u672c\u7684\u4f9d\u8d56\u5305hadoop-3.1.0/bin\uff0c\u914d\u7f6e\u73af\u5883\u53d8\u91cf%HADOOP_HOME%\\bin\u3002"),(0,o.kt)("h3",{id:"filesystem-java-api"},"FileSystem Java API"),(0,o.kt)("p",null,"\u8c03\u7528HDFS API\u7684\u6a21\u677f\u4ee3\u7801\u5982\u4e0b\u6240\u793a\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},'public void template() throws URISyntaxException, IOException, InterruptedException {\n    // 1. \u96c6\u7fa4\u8fde\u63a5\u4fe1\u606f\n    URI uri = new URI("hdfs://hadoop102:8020");\n    // 2. \u521b\u5efa\u914d\u7f6e\n    Configuration config = new Configuration();\n    // 2.1 \u914d\u7f6e\u4e00\u4e9b\u53c2\u6570\uff0c\u4f18\u5148\u7ea7\u6700\u9ad8\n    config.set("dfs.replication", "2");\n    // 3. \u83b7\u53d6\u5ba2\u6237\u7aef\n    fs = FileSystem.get(uri, config, "kayhaw");\n    // 4. \u8fdb\u884c\u6587\u4ef6\u7cfb\u7edf\u64cd\u4f5c\n    fs.xxx();\n    // 5. \u5173\u95ed\u8d44\u6e90\n    fs.close();\n}\n')),(0,o.kt)("p",null,"\u5176\u4e2d\uff0c\u53c2\u6570\u4f18\u5148\u7ea7\u6309\u5982\u4e0b\u987a\u5e8f\u4f18\u5148\u7ea7\u4f9d\u6b21\u589e\u9ad8\uff1a"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"hadoop\u96c6\u7fa4\u4e2dhdfs-default.xml"),(0,o.kt)("li",{parentName:"ol"},"hadoop\u96c6\u7fa4\u4e2dhdfs-site.xml"),(0,o.kt)("li",{parentName:"ol"},"\u7a0b\u5e8fresource\u76ee\u5f55\u4e0bhdfs-site.xml"),(0,o.kt)("li",{parentName:"ol"},"\u4ee3\u7801\u4e2d\u901a\u8fc7Configuration.set()\u65b9\u6cd5\u8bbe\u7f6e")),(0,o.kt)("p",null,"\u5e38\u7528\u7684API\u6709\uff1a"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u521b\u5efa\u6587\u4ef6\u5939\uff1a",(0,o.kt)("inlineCode",{parentName:"li"},"boolean mkdirs(Path f) throws IOException"),"\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u4e0a\u4f20\u6587\u4ef6(\u91cd\u8f7d\u7248\u652f\u6301Path\u6570\u7ec4src\u8fdb\u884c\u591a\u6587\u4ef6\u4e0a\u4f20)\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},"/**\n   * The src file is on the local disk.  Add it to the filesystem at\n   * the given dst name.\n   * delSrc indicates if the source should be removed\n   * @param delSrc whether to delete the src\n   * @param overwrite whether to overwrite an existing file\n   * @param src path\n   * @param dst path\n   * @throws IOException IO failure\n   */\n  public void copyFromLocalFile(boolean delSrc, boolean overwrite,\n                                Path src, Path dst);\n")),(0,o.kt)("ol",{start:3},(0,o.kt)("li",{parentName:"ol"},"\u4e0b\u8f7d\u6587\u4ef6\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},"/**\n   * The src file is under this filesystem, and the dst is on the local disk.\n   * Copy it from the remote filesystem to the local dst name.\n   * delSrc indicates if the src will be removed\n   * or not. useRawLocalFileSystem indicates whether to use RawLocalFileSystem\n   * as the local file system or not. RawLocalFileSystem is non checksumming,\n   * So, It will not create any crc files at local.\n   *\n   * @param delSrc whether to delete the src\n   * @param src path\n   * @param dst path\n   * @param useRawLocalFileSystem whether to use RawLocalFileSystem as local file system or not.\n   *\n   * @throws IOException for any IO error\n   */\n  public void copyToLocalFile(boolean delSrc, Path src, Path dst,\n      boolean useRawLocalFileSystem) throws IOException;\n")),(0,o.kt)("ol",{start:4},(0,o.kt)("li",{parentName:"ol"},"\u5220\u9664\u6587\u4ef6")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},"/** Delete a file.\n*\n* @param f \n* @param recursive \u662f\u5426\u9012\u5f52\u5220\u9664\u6587\u4ef6\u5939\n* @return  true if delete is successful else false.\n* @throws IOException IO failure\n*/\npublic abstract boolean delete(Path f, boolean recursive) throws IOException;\n")),(0,o.kt)("ol",{start:5},(0,o.kt)("li",{parentName:"ol"},"\u6587\u4ef6\u91cd\u547d\u540d(\u79fb\u52a8)")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},"public abstract boolean rename(Path src, Path dst) throws IOException;\n")),(0,o.kt)("ol",{start:6},(0,o.kt)("li",{parentName:"ol"},"\u904d\u5386\u6587\u4ef6\u5939\u83b7\u53d6\u6587\u4ef6\u4fe1\u606f\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},'public void fileInfo() throws IOException {\n    // \u83b7\u53d6\u6240\u6709\u6587\u4ef6\u4fe1\u606f\n    RemoteIterator<LocatedFileStatus> listFiles = fs.listFiles(new Path("/"), true);\n    // \u904d\u5386\u6587\u4ef6\n    while (listFiles.hasNext()) {\n        LocatedFileStatus fileStatus = listFiles.next();\n        System.out.println("=======" + fileStatus.getPath() + "=======");\n        System.out.println(fileStatus.getPermission());\n        System.out.println(fileStatus.getOwner());\n        System.out.println(fileStatus.getGroup());\n        System.out.println(fileStatus.getLen());\n        System.out.println(fileStatus.getModificationTime());\n        System.out.println(fileStatus.getReplication());\n        System.out.println(fileStatus.getBlockSize());\n        System.out.println(fileStatus.getPath().getName());\n\n        // \u83b7\u53d6\u5757\u4fe1\u606f\n        BlockLocation[] blockLocations = fileStatus.getBlockLocations();\n        System.out.println(Arrays.toString(blockLocations));\n    }\n}\n')),(0,o.kt)("ol",{start:7},(0,o.kt)("li",{parentName:"ol"},"\u5224\u65ad\u662f\u6587\u4ef6\u8fd8\u662f\u6587\u4ef6\u5939\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-java"},'public void isDirectory() throws IOException {\n    // \u5355\u4e2a\u6587\u4ef6\u67e5\u770b\u72b6\u6001\n    FileStatus file = fs.getFileStatus(new Path("/test/heke"));\n    System.out.println(file.isDirectory());\n\n    // \u6587\u4ef6\u5939\u5217\u8868\u67e5\u770b\u72b6\u6001\n    FileStatus[] fileStatuses = fs.listStatus(new Path("/"));\n    for (FileStatus fileStatus : fileStatuses) {\n        if(fileStatus.isDirectory()) {\n            System.out.println("\u76ee\u5f55\uff1a" + fileStatus.getPath().getName());\n        } else {\n            System.out.println("\u6587\u4ef6\uff1a" + fileStatus.getPath().getName());\n        }\n    }\n}\n')),(0,o.kt)("h2",{id:"hdfs\u8bfb\u5199\u6d41\u7a0b"},"HDFS\u8bfb\u5199\u6d41\u7a0b"),(0,o.kt)("h3",{id:"\u5199\u6570\u636e"},"\u5199\u6570\u636e"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u5ba2\u6237\u7aef\u5411NameNode\u8bf7\u6c42\u4e0a\u4f20\u6587\u4ef6"),(0,o.kt)("li",{parentName:"ol"},"NameNode\u68c0\u67e5\u8def\u5f84\u662f\u5426\u5b58\u5728\u3001\u662f\u5426\u5177\u6709\u6743\u9650\uff0c\u54cd\u5e94\u53ef\u4ee5\u4e0a\u4f20\u6587\u4ef6"),(0,o.kt)("li",{parentName:"ol"},"\u5ba2\u6237\u7aef\u8bf7\u6c42\u4e0a\u4f20\u7b2c\u4e00\u4e2ablock\uff0c\u7531NameNode\u8fd4\u56deDataNode\u5730\u5740"),(0,o.kt)("li",{parentName:"ol"},"NameNode\u8fd4\u56dedn1\u3001dn2\u3001dn3\u8282\u70b9\u5730\u5740"),(0,o.kt)("li",{parentName:"ol"},"\u5ba2\u6237\u7aef\u5411\u5176\u4e2d\u4e00\u4e2a\u8282\u70b9dn1\u8bf7\u6c42\u5efa\u7acbblock\u4f20\u9001\u901a\u9053\uff0c\u7531\u8be5\u8282\u70b9\u5411\u5176\u4ed6\u8282\u70b9\u8bf7\u6c42\u5f62\u6210\u4f20\u8f93\u901a\u9053"),(0,o.kt)("li",{parentName:"ol"},"dn1\u54cd\u5e94\u6210\u529f"),(0,o.kt)("li",{parentName:"ol"},"\u5ba2\u6237\u7aef\u4ee5packet\u4e3a\u5355\u4f4d(64KB)\u4f20\u8f93\u6570\u636e\uff0c\u6bcf\u4e2apacket\u7531chunk\u7ec4\u6210(chunk:512B+chunksum:4B)")),(0,o.kt)("h3",{id:"\u8282\u70b9\u8ddd\u79bb\u8ba1\u7b97"},"\u8282\u70b9\u8ddd\u79bb\u8ba1\u7b97"),(0,o.kt)("p",null,"NameNode\u5c06\u8282\u70b9\u8ddd\u79bb\u6700\u8fd1\u7684DataNode\u8fd4\u56de\u7ed9\u5ba2\u6237\u7aef\uff0c\u8282\u70b9\u8ddd\u79bb=\u4e24\u4e2a\u8282\u70b9\u5230\u8fbe\u6700\u8fd1\u7684\u516c\u5171\u7956\u5148\u7684\u8ddd\u79bb\u603b\u548c\uff0c\u7531\u6b64\u5f97\u5230\uff1a"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u540c\u4e00\u8282\u70b9\u4e0a\u7684\u8fdb\u7a0b\u8ddd\u79bb\u4e3a0\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u540c\u4e00\u673a\u67b6\u4e0a\u7684\u4e0d\u540c\u8282\u70b9\u8ddd\u79bb\u4e3a2\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u540c\u4e00\u6570\u636e\u4e2d\u5fc3\u4e0d\u540c\u673a\u67b6\u4e0a\u7684\u8282\u70b9\u8ddd\u79bb\u4e3a4\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u4e0d\u540c\u6570\u636e\u4e2d\u5fc3\u7684\u8282\u70b9\u8ddd\u79bb\u4e3a6\u3002")),(0,o.kt)("h3",{id:"\u673a\u67b6\u611f\u77e5"},"\u673a\u67b6\u611f\u77e5"),(0,o.kt)("p",null,"NameNode\u8fd4\u56de",(0,o.kt)("a",{parentName:"p",href:"https://hadoop.apache.org/docs/r3.1.3/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html#Data_Replication"},"\u6570\u636e\u526f\u672c"),"\u7684\u5b58\u653e\u4f4d\u7f6e\u65f6\uff0c\u901a\u5e38\u526f\u672c\u4e2a\u6570\u4e3a3\uff0c\u6309\u7167\u5982\u4e0b\u987a\u5e8f\u6307\u5b9a3\u4e2a\u8282\u70b9\uff1a\u9996\u5148\u5ba2\u6237\u7aef\u5728DataNode\u4e0a\uff0c\u6307\u5b9a\u4e00\u4e2a\u8282\u70b9\u4e3a\u672c\u5730\u673a\u5668\uff0c\u5426\u5219\u968f\u673a\u9009\u4e00\u4e2a\u8282\u70b9\uff0c\u7136\u540e\u5728\u53e6\u4e00\u4e2a\u673a\u67b6A\u4e0a\u9009\u62e9\u4e00\u4e2a\u8282\u70b9a\uff0c\u6700\u540e\u5728\u673a\u67b6A\u4e0a\u9009\u62e9\u4e00\u4e2a\u4e0d\u540c\u8282\u70b9b\u3002\u5bf9\u5e94\u6e90\u7801\u89c1BlockPlacementPolicyDefault\u7c7b\u7684chooseTargetInOrder\u65b9\u6cd5\u3002"),(0,o.kt)("h3",{id:"\u8bfb\u6570\u636e"},"\u8bfb\u6570\u636e"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u5ba2\u6237\u7aef\u901a\u8fc7DistributedFileSystem\u5411NameNode\u8bf7\u6c42\u4e0b\u8f7d\u6587\u4ef6\uff0cNameNode\u901a\u8fc7\u67e5\n\u8be2\u5143\u6570\u636e\uff0c\u627e\u5230\u6587\u4ef6\u5757\u6240\u5728\u7684DataNode\u5730\u5740\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u6311\u9009\u4e00\u53f0DataNode(\u5c31\u8fd1\u539f\u5219\uff0c\u7136\u540e\u968f\u673a)\u670d\u52a1\u5668\uff0c\u8bf7\u6c42\u8bfb\u53d6\u6570\u636e\uff1b"),(0,o.kt)("li",{parentName:"ol"},"DataNode\u5f00\u59cb\u4f20\u8f93\u6570\u636e\u7ed9\u5ba2\u6237\u7aef(\u4ece\u78c1\u76d8\u91cc\u9762\u8bfb\u53d6\u6570\u636e\u8f93\u5165\u6d41\uff0c\u4ee5Packet\u4e3a\u5355\u4f4d\u6765\u505a\u6821\u9a8c)\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u5ba2\u6237\u7aef\u4ee5Packet\u4e3a\u5355\u4f4d\u63a5\u6536\uff0c\u5148\u5728\u672c\u5730\u7f13\u5b58\uff0c\u7136\u540e\u5199\u5165\u76ee\u6807\u6587\u4ef6\u3002")),(0,o.kt)("h2",{id:"nn\u548c2nn"},"NN\u548c2NN"),(0,o.kt)("p",null,"NameNode\u7684\u5143\u6570\u636e\u5206\u4e3a2\u90e8\u5206\uff1a\u78c1\u76d8\u4e2d\u7684\u5143\u6570\u636e\u5907\u4efdfsimage\u548c\u5185\u5b58\u4e2d\u7684\u589e\u91cf\u6587\u4ef6edits\u3002\u4f46\u957f\u65f6\u95f4\u5730\u6dfb\u52a0\u8ffd\u5267\u5230edits\u4f1a\u5bfc\u964d\u4f4e\u6548\u7387\uff0c\u56e0\u6b64\u7531SeconaryNameNode\u4e13\u95e8\u5408\u5e76fsimage\u548cedits\u3002Fsimage\u548cEdits\u6587\u4ef6\u5de5\u4f5c\u6d41\u7a0b\u5982\u4e0b\uff1a"),(0,o.kt)("p",null,"\u7b2c\u4e00\u9636\u6bb5\uff0cNameNode\u542f\u52a8\uff1a"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u5982\u679cNameNode\u7b2c1\u6b21\u521d\u59cb\u5316\u5219\u521b\u5efafsimage\u548cedits\u6587\u4ef6\uff0c\u5426\u5219\u52a0\u8f7dfsimage\u548cedits\u5230\u5185\u5b58\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u5ba2\u6237\u7aef\u5bf9\u5143\u6570\u636e\u8fdb\u884c\u589e\u5220\u6539\u7684\u8bf7\u6c42\uff1b"),(0,o.kt)("li",{parentName:"ol"},"NameNode\u8bb0\u5f55\u64cd\u4f5c\u65e5\u5fd7\uff0c\u66f4\u65b0\u6eda\u52a8\u65e5\u5fd7\uff1b"),(0,o.kt)("li",{parentName:"ol"},"NameNode\u5728\u5185\u5b58\u4e2d\u5bf9\u5143\u6570\u636e\u8fdb\u884c\u589e\u5220\u6539\u3002")),(0,o.kt)("p",null,"\u7b2c\u4e8c\u9636\u6bb5\uff0cSecondary NameNode\u5de5\u4f5c\uff1a"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"2NN\u8be2\u95eeNN\u662f\u5426\u9700\u8981checkpoint\uff1b"),(0,o.kt)("li",{parentName:"ol"},"2NN\u8bf7\u6c42\u6267\u884ccheckpoint\uff1b"),(0,o.kt)("li",{parentName:"ol"},"NN\u6eda\u52a8\u6b63\u5728\u5199\u7684edits\u65e5\u5fd7\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u5c06\u6eda\u52a8\u524d\u7684edits\u548cfsimage\u62f7\u8d1d\u52302NN\uff1b"),(0,o.kt)("li",{parentName:"ol"},"2NN\u52a0\u8f7dedits\u548cfsimage\u5230\u5185\u5b58\u8fdb\u884c\u5408\u5e76\uff1b"),(0,o.kt)("li",{parentName:"ol"},"2NN\u5408\u5e76\u751f\u6210fsimage.checkpoint\uff1b"),(0,o.kt)("li",{parentName:"ol"},"2NN\u5c06fsimage.checkpoint\u62f7\u8d1d\u5230NN\uff1b"),(0,o.kt)("li",{parentName:"ol"},"NN\u5c06fsimage.checkpoint\u91cd\u547d\u540d\u4e3afsimage\u3002")),(0,o.kt)("h3",{id:"fsimage\u548cedits"},"fsimage\u548cEdits"),(0,o.kt)("p",null,"\u683c\u5f0f\u5316NameNode\u540e\uff0c\u5728",(0,o.kt)("inlineCode",{parentName:"p"},"${hadoop.tmp.dir}/dfs/name/current"),"\u76ee\u5f55\u4e0b\u751f\u6210\u5982\u4e0b\u6587\u4ef6\uff1a"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"fsimage_0000000000000001081"),(0,o.kt)("li",{parentName:"ul"},"fsimage_0000000000000001081.md5"),(0,o.kt)("li",{parentName:"ul"},"seen_txid"),(0,o.kt)("li",{parentName:"ul"},"VERSION")),(0,o.kt)("p",null,"fsimage\u6587\u4ef6\u662fHDFS\u5143\u6570\u636e\u7684\u4e00\u4e2a\u6c38\u4e45\u6027\u68c0\u67e5\u70b9\uff0c\u5305\u542bHDFS\u6587\u4ef6\u7cfb\u7edf\u7684\u6240\u6709\u76ee\u5f55\u548c\u6587\u4ef6inode\u7684\u5e8f\u5217\u5316\u4fe1\u606f\u3002edits\u6587\u4ef6\u5b58\u653eHDFS\u6240\u6709",(0,o.kt)("strong",{parentName:"p"},"\u66f4\u65b0"),"\u64cd\u4f5c\u7684\u8def\u5f84\uff0c\u5ba2\u6237\u7aef\u7684\u6240\u6709\u5199\u64cd\u4f5c\u88ab\u8bb0\u5f55\u5230edits\u4e2d\u3002seen_txid\u6587\u4ef6\u53ea\u4fdd\u5b58\u4e00\u4e2a\u6570\u5b57\uff0c\u5373\u6700\u65b0edit_inprogress\u6587\u4ef6\u540d\u7684\u7248\u672c\u540e\u7f00\u3002"),(0,o.kt)("h3",{id:"oiv\u548coev"},"oiv\u548coev"),(0,o.kt)("p",null,"Hadoop\u63d0\u4f9boiv(",(0,o.kt)("strong",{parentName:"p"},"o"),"ffline fs",(0,o.kt)("strong",{parentName:"p"},"i"),"mage ",(0,o.kt)("strong",{parentName:"p"},"v"),"iewer)\u3001oev(",(0,o.kt)("strong",{parentName:"p"},"o"),"ffline ",(0,o.kt)("strong",{parentName:"p"},"e"),"dits ",(0,o.kt)("strong",{parentName:"p"},"v"),"iewer)\u547d\u4ee4\u5206\u522b\u7528\u4e8e\u67e5\u770bfsimage\u548cedits\u6587\u4ef6\uff0c\u57fa\u672c\u7528\u6cd5\u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"hdfs oiv[oev] -p <\u8f6c\u6362\u8f93\u51fa\u6587\u4ef6\u7c7b\u578b> -i <fsimage/edits\u6587\u4ef6\u540d> -o <\u8f6c\u6362\u8f93\u51fa\u6587\u4ef6\u540d>\n")),(0,o.kt)("h3",{id:"checkpoint\u8bbe\u7f6e"},"Checkpoint\u8bbe\u7f6e"),(0,o.kt)("p",null,"2NN\u89e6\u53d1checkpoint\u7684\u6761\u4ef6\u67092\u79cd\uff0c\u7b2c\u4e00\u79cd\u662f\u5b9a\u65f6\u89e6\u53d1\uff0c\u9ed8\u8ba4\u60c5\u51b5\u4e0b\uff0c2NN\u6bcf\u9694\u4e00\u4e2a\u5c0f\u65f6\u6267\u884c\u4e00\u6b21checkpoint\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-xml",metastring:"title=hdfs-default.xml",title:"hdfs-default.xml"},"<property>\n    <name>dfs.namenode.checkpoint.period</name>\n    <value>3600s</value>\n</property>\n")),(0,o.kt)("p",null,"\u7b2c\u4e8c\u79cd\u662f\u5b9a\u91cf\u89e6\u53d1\uff0c\u6bcf\u9694\u4e00\u6bb5\u65f6\u95f4(\u9ed8\u8ba460s)\u68c0\u67e5\u64cd\u4f5c\u6b21\u6570\u662f\u5426\u8fbe\u5230\u5b9a\u91cf(\u9ed8\u8ba4100\u4e07)\u6765\u51b3\u5b9a\u662f\u5426\u6267\u884ccheckpoint\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-xml",metastring:"title=hdfs-default.xml",title:"hdfs-default.xml"},"<property>\n    <name>dfs.namenode.checkpoint.txns</name>\n    <value>1000000</value>\n    <description>\u64cd\u4f5c\u52a8\u4f5c\u6b21\u6570</description>\n</property>\n<property>\n    <name>dfs.namenode.checkpoint.check.period</name>\n    <value>60s</value>\n    <description>1\u5206\u949f\u68c0\u67e5\u4e00\u6b21\u64cd\u4f5c\u6b21\u6570</description>\n</property>\n")),(0,o.kt)("h2",{id:"datanode\u5de5\u4f5c\u673a\u5236"},"DataNode\u5de5\u4f5c\u673a\u5236"),(0,o.kt)("p",null,"\u6570\u636e\u5757\u5728DataNode\u4e0a\u5b58\u50a8\u5305\u542b2\u4e2a\u6587\u4ef6\uff0c\u6570\u636e\u672c\u8eab\u548c\u5143\u6570\u636e\u6587\u4ef6\uff0c\u540e\u8005\u5305\u542b\u6570\u636e\u5757\u7684\u957f\u5ea6\u3001\u68c0\u9a8c\u548c\u4ee5\u53ca\u65f6\u95f4\u6233\u3002DataNode\u5de5\u4f5c\u673a\u5236\u5982\u4e0b\uff1a"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"DataNode\u542f\u52a8\u540e\u5411NameNode\u6ce8\u518c\uff1b"),(0,o.kt)("li",{parentName:"ol"},"DataNode\u6ce8\u518c\u6210\u529f\uff1b"),(0,o.kt)("li",{parentName:"ol"},"DataNode\u5468\u671f\u6027(\u9ed8\u8ba46\u5c0f\u65f6)\u5730\u5411NN\u62a5\u544a\u6240\u6709\u5757\u4fe1\u606f\uff1b")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-xml"},"<property>\n    <name>dfs.blockreport.intervalMsec</name>\n    <value>21600000</value>\n    <description>Determines block reporting interval in \n    milliseconds.</description>\n</property>\n<property>\n    <name>dfs.datanode.directoryscan.interval</name>\n    <value>21600s</value>\n    <description>Interval in seconds for Datanode to scan data \n    directories and reconcile the difference between blocks in memory and on \n    the disk.\n    Support multiple time unit suffix(case insensitive), as described\n    in dfs.heartbeat.interval.\n    </description>\n</property>\n")),(0,o.kt)("ol",{start:4},(0,o.kt)("li",{parentName:"ol"},"DataNode\u6bcf\u96943s\u5411NN\u53d1\u9001\u5fc3\u8df3\uff0c\u5982\u679c\u8d85\u8fc710\u5206\u949f+30\u79d2\u6ca1\u6709\u6536\u5230\u6765\u81eaDataNode\u7684\u5fc3\u8df3\uff0cNN\u8ba4\u4e3a\u8be5\u8282\u70b9\u4e0d\u53ef\u7528\u3002")),(0,o.kt)("h3",{id:"\u6570\u636e\u5b8c\u6574\u6027"},"\u6570\u636e\u5b8c\u6574\u6027"),(0,o.kt)("p",null,"DataNode\u4f7f\u7528crc32\u7b97\u6cd5\u5bf9block\u8fdb\u884c\u6821\u9a8c\uff0ccopyToLocalFile\u65b9\u6cd5\u6700\u540e\u4e00\u4e2a\u53c2\u6570\u8bbe\u7f6e\u4e3afalse\uff0c\u4e0b\u8f7d\u540e\u591a\u4e00\u4e2acrc\u6587\u4ef6\u3002"),(0,o.kt)("h3",{id:"\u8d85\u65f6\u8bbe\u7f6e"},"\u8d85\u65f6\u8bbe\u7f6e"),(0,o.kt)("p",null,"\u5f53DataNode\u8fdb\u7a0b\u6b7b\u4ea1\u6216\u8005\u7531\u7f51\u7edc\u6545\u969c\u9020\u6210DataNode\u4e0eNameNode\u65e0\u6cd5\u901a\u4fe1\u65f6\uff0cNN\u4e0d\u4f1a\u7acb\u5373\u5224\u65ad\u8be5DataNode\u4e0d\u53ef\u7528\uff0c\u800c\u662f\u7ecf\u8fc7\u4e00\u6bb5\u8d85\u65f6\u65f6\u957ftimeout\u540e\u624d\u5224\u5b9a\uff1a"),(0,o.kt)("p",null,"timeout=2 ","*"," dfs.namenode.heartbeat.recheck-interval + 10 ","*"," dfs.heartbeat.interval"),(0,o.kt)("p",null,"\u9ed8\u8ba4recheck-interval\u5927\u5c0f\u4e3a5\u5206\u949f\uff0cdfs.heartbeat.interval\u4e3a3\u79d2\u3002"),(0,o.kt)("h2",{id:"\u603b\u7ed3"},"\u603b\u7ed3"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Block\u5927\u5c0f\u4e0e\u78c1\u76d8\u8bfb\u5199\u901f\u5ea6\u76f8\u5173\uff0c\u4e00\u822c\u8bbe\u7f6e128MB\u6216\u8005256MB\uff1b"),(0,o.kt)("li",{parentName:"ol"},"HDFS Shell\u64cd\u4f5c\uff1b"),(0,o.kt)("li",{parentName:"ol"},"HDFS\u8bfb\u5199\u6d41\u7a0b\u2b50\u3002")))}c.isMDXComponent=!0}}]);