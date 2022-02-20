"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[4949],{3905:function(e,t,a){a.d(t,{Zo:function(){return m},kt:function(){return h}});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var p=n.createContext({}),s=function(e){var t=n.useContext(p),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},m=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},v=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,p=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),v=s(a),h=r,d=v["".concat(p,".").concat(h)]||v[h]||c[h]||o;return a?n.createElement(d,i(i({ref:t},m),{},{components:a})):n.createElement(d,i({ref:t},m))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,i=new Array(o);i[0]=v;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var s=2;s<o;s++)i[s]=a[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}v.displayName="MDXCreateElement"},4897:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return l},contentTitle:function(){return p},metadata:function(){return s},assets:function(){return m},toc:function(){return c},default:function(){return h}});var n=a(7462),r=a(3366),o=(a(7294),a(3905)),i=["components"],l={title:"Hive 3.x\u5b66\u4e60\u7b14\u8bb0(1)",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["Hive","BigData"],description:"Hive 3.1.2\u5b66\u4e60\u7b14\u8bb0(1)\uff1aHive\u7b80\u4ecb\u4e0e\u5b89\u88c5",hide_table_of_contents:!1},p=void 0,s={permalink:"/blog/2022/02/19/Learning-Hive3.x-01",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/blog/blog/2022/02/19-Learning-Hive3.x-01.md",source:"@site/blog/2022/02/19-Learning-Hive3.x-01.md",title:"Hive 3.x\u5b66\u4e60\u7b14\u8bb0(1)",description:"Hive 3.1.2\u5b66\u4e60\u7b14\u8bb0(1)\uff1aHive\u7b80\u4ecb\u4e0e\u5b89\u88c5",date:"2022-02-19T00:00:00.000Z",formattedDate:"February 19, 2022",tags:[{label:"Hive",permalink:"/blog/tags/hive"},{label:"BigData",permalink:"/blog/tags/big-data"}],readingTime:4.1,truncated:!0,authors:[{name:"\u4f55\u8f72",title:"Never settle down",url:"https://github.com/kayhaw",imageURL:"https://avatars.githubusercontent.com/u/16892835?v=4"}],prevItem:{title:"Hive 3.x\u5b66\u4e60\u7b14\u8bb0(2)",permalink:"/blog/2022/02/20/Learning-Hive3.x-02"},nextItem:{title:"2022\u5e742\u6708\u4efd\u5de5\u4f5c\u603b\u7ed3",permalink:"/blog/2022/02/19/WorkJournal"}},m={authorsImageUrls:[void 0]},c=[{value:"Hive\u7b80\u4ecb",id:"hive\u7b80\u4ecb",children:[{value:"Hive\u67b6\u6784",id:"hive\u67b6\u6784",children:[]},{value:"Hive\u7279\u6027",id:"hive\u7279\u6027",children:[]}]},{value:"Hive\u5b89\u88c5",id:"hive\u5b89\u88c5",children:[{value:"\u5b89\u88c5\u5305",id:"\u5b89\u88c5\u5305",children:[]},{value:"\u5b89\u88c5\u6b65\u9aa4",id:"\u5b89\u88c5\u6b65\u9aa4",children:[]},{value:"\u521d\u8bd5Hive",id:"\u521d\u8bd5hive",children:[]},{value:"\u66f4\u6362\u5143\u6570\u636e\u5e93",id:"\u66f4\u6362\u5143\u6570\u636e\u5e93",children:[]},{value:"\u5f00\u542fmetastore\u670d\u52a1",id:"\u5f00\u542fmetastore\u670d\u52a1",children:[]},{value:"\u5f00\u542fhiveserver2\u670d\u52a1",id:"\u5f00\u542fhiveserver2\u670d\u52a1",children:[]},{value:"\u542f\u52a8\u670d\u52a1\u811a\u672c",id:"\u542f\u52a8\u670d\u52a1\u811a\u672c",children:[]}]},{value:"\u603b\u7ed3",id:"\u603b\u7ed3",children:[]}],v={toc:c};function h(e){var t=e.components,a=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},v,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"\ud83d\udcddHive 3.1.2\u5b66\u4e60\u7b14\u8bb0\u7b2c1\u7bc7\uff1aHive\u7b80\u4ecb\u4e0e\u5b89\u88c5\u3002"),(0,o.kt)("h2",{id:"hive\u7b80\u4ecb"},"Hive\u7b80\u4ecb"),(0,o.kt)("p",null,"Hive\u662f\u57fa\u4e8eHadoop\u7684",(0,o.kt)("strong",{parentName:"p"},"\u6570\u636e\u4ed3\u5e93\u5de5\u5177(\u975e\u4f20\u7edf\u610f\u4e49\u4e0a\u6570\u636e\u5e93)"),"\uff0c\u7531Facebook\u5f00\u6e90\u7528\u4e8e\u89e3\u51b3\u6d77\u91cf\u7ed3\u6784\u5316\u65e5\u5fd7\uff0cHive\u5c06\u7ed3\u6784\u5316\u6570\u636e\u6587\u4ef6\u6620\u5c04\u4e3a\u4e00\u5f20\u8868\uff0c\u5e76\u63d0\u4f9b\u7c7bSQL(HQL)\u67e5\u8be2\u529f\u80fd\uff0c\u5176\u672c\u8d28\u662f\u5c06HQL\u7ffb\u8bd1\u4e3aMapReduce\u7a0b\u5e8f\u3002"),(0,o.kt)("p",null,"\ud83d\ude04\u4f18\u70b9\uff1a"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"HQL\u7c7b\u4f3cSQL\uff0c\u4f7f\u7528\u8d77\u6765\u5bb9\u6613\u4e0a\u624b\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u907f\u514d\u5199MR\u7a0b\u5e8f\uff0c\u964d\u4f4e\u5b66\u4e60\u6210\u672c\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u6267\u884c\u5ef6\u8fdf\u9ad8\uff0c\u56e0\u6b64\u9002\u7528\u4e8e\u5bf9\u5b9e\u65f6\u6027\u8981\u6c42\u4e0d\u9ad8\u4e14\u6570\u636e\u91cf\u5927\u7684\u573a\u666f\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u652f\u6301\u81ea\u5b9a\u4e49\u51fd\u6570\u3002")),(0,o.kt)("p",null,"\ud83d\ude20\u7f3a\u70b9\uff1a"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"HQL\u65e0\u6cd5\u8868\u8fbe\u8fed\u4ee3\u5f0f\u7b97\u6cd5\uff0c\u53d7\u9650\u4e8eMapReduce\u6d41\u7a0b\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u6267\u884c\u6548\u7387\u4f4e\uff0c\u751f\u6210MapReduce\u4f5c\u4e1a\u4e0d\u591f\u667a\u80fd\u5316\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u8c03\u4f18\u56f0\u96be\u3002")),(0,o.kt)("h3",{id:"hive\u67b6\u6784"},"Hive\u67b6\u6784"),(0,o.kt)("p",null,"\u4e0eMetastore\u4ea4\u4e92\u83b7\u53d6\u6570\u636e\u6587\u4ef6\u5728HDFS\u4e0a\u7684\u4f4d\u7f6e\uff0c\u7f16\u5199\u7684HQL\u4f9d\u6b21\u7ecf\u8fc7\u89e3\u6790\u5668\u3001\u7f16\u8bd1\u5668\u3001\u4f18\u5316\u5668\u548c\u6267\u884c\u5668\u7ffb\u8bd1\u4e3aMapReduce\u7a0b\u5e8f\u6267\u884c\uff0c\u5982\u4e0b\u56fe\u6240\u793a\uff1a"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"\u89e3\u6790\u5668"),"\uff1a\u5c06HQL\u8f6c\u4e3a\u4e3a\u62bd\u8c61\u8bed\u6cd5\u6811AST\uff0c\u5e76\u8fdb\u884c\u8bed\u6cd5\u5206\u6790\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"\u7f16\u8bd1\u5668"),"\uff1a\u7531AST\u751f\u6210\u903b\u8f91\u6267\u884c\u8ba1\u5212\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"\u4f18\u5316\u5668"),"\uff1a\u4f18\u5316\u903b\u8f91\u6267\u884c\u8ba1\u5212\uff1b"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},"\u6267\u884c\u5668"),"\uff1a\u5c06\u903b\u8f91\u6267\u884c\u8ba1\u5212\u8f6c\u4e3a\u53ef\u4ee5\u8fd0\u884c\u7684\u7269\u7406\u8ba1\u5212(MapReduce/Spark\u7a0b\u5e8f)\u3002")),(0,o.kt)("h3",{id:"hive\u7279\u6027"},"Hive\u7279\u6027"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("strong",{parentName:"li"},"\u6570\u636e\u66f4\u65b0"),"\uff1aHive\u4e3a\u6570\u636e\u4ed3\u5e93\u800c\u8bbe\u8ba1\uff0c\u9002\u7528\u8bfb\u591a\u5199\u5c11\u7684\u573a\u666f\uff0c\u56e0\u6b64Hive",(0,o.kt)("strong",{parentName:"li"},"\u4e0d\u5efa\u8bae"),"\u6539\u5199\u6570\u636e\uff0c\u800c\u4f20\u7edf\u6570\u636e\u5e93\u7ecf\u5e38\u4fee\u6539\uff1b"),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("strong",{parentName:"li"},"\u6267\u884c\u5ef6\u8fdf"),"\uff1aHive\u67e5\u8be2\u6570\u636e\u65f6\u6ca1\u6709\u7d22\u5f15\u9700\u8981\u626b\u63cf\u6574\u4e2a\u8868\uff0c\u5e76\u4e14MapReduce\u6846\u67b6\u4e5f\u6709\u8f83\u9ad8\u5ef6\u8fdf\uff1b\u4f46\u5728\u5927\u89c4\u6a21\u6570\u636e\u4e0b\u624d\u80fd\u4f53\u73b0Hive\u4f18\u52bf\uff1b"),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("strong",{parentName:"li"},"\u6570\u636e\u89c4\u6a21"),"\uff1aHive\u57fa\u4e8eHadoop\u96c6\u7fa4\u53ef\u4ee5\u5904\u7406\u5927\u89c4\u6a21\u6570\u636e")),(0,o.kt)("h2",{id:"hive\u5b89\u88c5"},"Hive\u5b89\u88c5"),(0,o.kt)("h3",{id:"\u5b89\u88c5\u5305"},"\u5b89\u88c5\u5305"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"http://archive.apache.org/dist/hive/hive-3.1.2/apache-hive-3.1.2-bin.tar.gz"},"apache-hive-3.1.2-bin.tar.gz")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"https://downloads.mysql.com/archives/community/"},"mysql-5.7.28-1.el7.x86_64.rpm-bundle.tar"))),(0,o.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/blog/HiveNotes/mysql-5.7.28-bundle.png",title:"mysql-5.7.28-1.el7.x86_64.rpm-bundle.tar"}),(0,o.kt)("ol",{start:3},(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("a",{parentName:"li",href:"https://downloads.mysql.com/archives/c-j/"},"mysql-connector-java-5.1.37.tar.gz"))),(0,o.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/blog/HiveNotes/mysql-connector-java-5.1.37.png",title:"mysql-connector-java-5.1.37"}),(0,o.kt)("h3",{id:"\u5b89\u88c5\u6b65\u9aa4"},"\u5b89\u88c5\u6b65\u9aa4"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u5c06apache-hive-3.1.2-bin.tar.gz\u89e3\u538b\u5230/opt/module\u76ee\u5f55\u4e0b\uff0c\u5e76\u91cd\u547d\u540d\u4e3aapache-hive-3.1.2\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"tar -zxvf /opt/software/apache-hive-3.1.2-bin.tar.gz -C /opt/module/\nmv /opt/module/apache-hive-3.1.2-bin/ /opt/module/apache-hive-3.1.2\n")),(0,o.kt)("ol",{start:2},(0,o.kt)("li",{parentName:"ol"},"\u6dfb\u52a0\u5982\u4e0b\u73af\u5883\u53d8\u91cf\u5e76\u4f7f\u4e4b\u751f\u6548(",(0,o.kt)("strong",{parentName:"li"},(0,o.kt)("inlineCode",{parentName:"strong"},"source /etc/profile.d/my_env.sh")),")\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash",metastring:'title="/etc/profile.d/my_env.sh"',title:'"/etc/profile.d/my_env.sh"'},"# HIVE_HOME\nexport HIVE_HOME=/opt/module/apache-hive-3.1.2\nexport PATH=$PATH:$HIVE_HOME/bin\n")),(0,o.kt)("ol",{start:3},(0,o.kt)("li",{parentName:"ol"},"\u89e3\u51b3\u65e5\u5fd7jar\u5305\u51b2\u7a81\uff0c\u5c06\u5176\u91cd\u547d\u540d\u4f7f\u4e4b\u65e0\u6cd5\u52a0\u8f7d\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"mv $HIVE_HOME/lib/log4j-slf4j-impl-2.10.0.jar $HIVE_HOME/lib/log4j-slf4j-impl-2.10.0.bak\n")),(0,o.kt)("h3",{id:"\u521d\u8bd5hive"},"\u521d\u8bd5Hive"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("strong",{parentName:"li"},"\u521d\u59cb\u5316\u5143\u6570\u636e\u5e93"),"\uff1a",(0,o.kt)("inlineCode",{parentName:"li"},"schematool -dbType derby -initSchema"),"\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u542f\u52a8hive\uff0c\u76f4\u63a5\u8f93\u5165",(0,o.kt)("inlineCode",{parentName:"li"},"hive"),"\u5373\u53ef\uff0c\u4ea4\u4e92\u754c\u9762\u7c7b\u4f3cMySQL\u5ba2\u6237\u7aef\u53ef\u4ee5\u6267\u884cHQL\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u65b0\u5efassh\u4f1a\u8bdd\u4e5f\u6267\u884c",(0,o.kt)("inlineCode",{parentName:"li"},"hive"),"\u547d\u4ee4\uff0c\u53d1\u73b0\u5982\u4e0b\u62a5\u9519\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"Caused by: ERROR XSDB6: Another instance of Derby may have already booted \nthe database /opt/module/hive/metastore_db.\n at \norg.apache.derby.iapi.error.StandardException.newException(Unknown \nSource)\n at \norg.apache.derby.iapi.error.StandardException.newException(Unknown Source)\n at \norg.apache.derby.impl.store.raw.data.BaseDataFileFactory.privGetJBMSLockO\nnDB(Unknown Source)\n at \norg.apache.derby.impl.store.raw.data.BaseDataFileFactory.run(Unknown \nSource)\n...\n")),(0,o.kt)("p",null,"\u7531\u4e8eHive\u9ed8\u8ba4\u4f7f\u7528derby\u4f5c\u4e3a\u5143\u6570\u636e\u5e93\uff0c\u4f46\u6b64\u65f6\u4e0d\u652f\u6301\u5176\u4ed6\u4f1a\u8bdd\u7684\u5171\u4eab\uff0c\u56e0\u6b64\u63a5\u4e0b\u6765\u5c06\u5143\u6570\u636e\u5e93\u7531derby\u6539\u4e3aMySQL\u3002"),(0,o.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"\u521d\u6b21\u542f\u52a8\u62a5\u9519")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"\u521d\u6b21\u542f\u52a8\u65f6\u62a5\u5982\u4e0b\u9519\u8bef\uff0c\u539f\u56e0\u662fHadoop\u548cHive\u4e2dguava\u7248\u672c\u4e0d\u4e00\u81f4\uff0c\u5c06",(0,o.kt)("inlineCode",{parentName:"p"},"${HADOOP_HOME}/share/hadoop/common/lib/"),"\u4e0b\u7684\u9ad8\u7248\u672cjar\u590d\u5236\u5230",(0,o.kt)("inlineCode",{parentName:"p"},"${HIVE_HOME}/lib/"),"\u4e0b\u5e76\u5c06\u4f4e\u7248\u672cjar\u5305\u5220\u9664\u3002"),(0,o.kt)("pre",{parentName:"div"},(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'Exception in thread "main" java.lang.NoSuchMethodError: com.google.common.base.Preconditions.checkArgument(ZLjava/lang/String;Ljava/lang/Object;)V\n    at org.apache.hadoop.conf.Configuration.set(Configuration.java:1357)\n    at org.apache.hadoop.conf.Configuration.set(Configuration.java:1338)\n    at org.apache.hadoop.mapred.JobConf.setJar(JobConf.java:518)\n    at org.apache.hadoop.mapred.JobConf.setJarByClass(JobConf.java:536)\n    at org.apache.hadoop.mapred.JobConf.<init>(JobConf.java:430)\n    at org.apache.hadoop.hive.conf.HiveConf.initialize(HiveConf.java:5141)\n    at org.apache.hadoop.hive.conf.HiveConf.<init>(HiveConf.java:5104)\n    at org.apache.hive.beeline.HiveSchemaTool.<init>(HiveSchemaTool.java:96)\n    at org.apache.hive.beeline.HiveSchemaTool.main(HiveSchemaTool.java:1473)\n    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n    at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\n    at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n    at java.lang.reflect.Method.invoke(Method.java:498)\n    at org.apache.hadoop.util.RunJar.run(RunJar.java:318)\n    at org.apache.hadoop.util.RunJar.main(RunJar.java:232)\n')))),(0,o.kt)("h3",{id:"\u66f4\u6362\u5143\u6570\u636e\u5e93"},"\u66f4\u6362\u5143\u6570\u636e\u5e93"),(0,o.kt)("p",null,"\u9996\u5148\u6309\u7167\u5982\u4e0b\u6b65\u9aa4\u5b89\u88c5MySQL\uff1a"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u68c0\u67e5\u5e76\u5220\u9664CentOS\u81ea\u5e26\u7684Mariadb\u76f8\u5173\u4f9d\u8d56\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"rpm -qa|grep mariadb\nsudo rpm -e --nodeps mariadb-libs\n")),(0,o.kt)("ol",{start:2},(0,o.kt)("li",{parentName:"ol"},"\u89e3\u538bmysql-5.7.28-1.el7.x86_64.rpm-bundle.tar\uff0c\u5f97\u5230\u591a\u4e2armp\u5305\u5e76\u5b89\u88c5\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"tar -xf mysql-5.7.28-1.el7.x86_64.rpm-bundle.tar\n## \u6309\u5e8f\u6267\u884c\uff0c\u540e\u9762\u7684\u4f9d\u8d56\u4e8e\u524d\u9762\nsudo rpm -ivh mysql-community-common-5.7.28-1.el7.x86_64.rpm\nsudo rpm -ivh mysql-community-libs-5.7.28-1.el7.x86_64.rpm\nsudo rpm -ivh mysql-community-libs-compat-5.7.28-1.el7.x86_64.rpm\nsudo rpm -ivh mysql-community-client-5.7.28-1.el7.x86_64.rpm\nsudo rpm -ivh mysql-community-server-5.7.28-1.el7.x86_64.rpm\n")),(0,o.kt)("ol",{start:3},(0,o.kt)("li",{parentName:"ol"},"\u5220\u9664",(0,o.kt)("inlineCode",{parentName:"li"},"/etc/my.cnf"),"\u6587\u4ef6\u4e2ddatadir\u53c2\u6570\u6307\u5b9a\u76ee\u5f55\u4e0b\u7684\u6240\u6709\u5185\u5bb9"),(0,o.kt)("li",{parentName:"ol"},"\u521d\u59cb\u5316MySQL\u6570\u636e\u5e93\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"sudo mysqld --initialize --user=mysql\n")),(0,o.kt)("ol",{start:5},(0,o.kt)("li",{parentName:"ol"},"\u5728MySQL\u65e5\u5fd7\u4e2d\u627e\u5230\u751f\u6210\u7684root\u5bc6\u7801(\u672c\u6b21\u4e3a",(0,o.kt)("inlineCode",{parentName:"li"},"Mzn7/gl.i!-4"),")\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"sudo cat /var/log/mysqld.log\n2022-02-18T10:29:24.176884Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).\n2022-02-18T10:29:24.545101Z 0 [Warning] InnoDB: New log files created, LSN=45790\n2022-02-18T10:29:24.593907Z 0 [Warning] InnoDB: Creating foreign key constraint system tables.\n2022-02-18T10:29:24.655737Z 0 [Warning] No existing UUID has been found, so we assume that this is the first time that this server has been started. Generating a new UUID: a49026e8-90a5-11ec-af0f-000c293a2d67.\n2022-02-18T10:29:24.658007Z 0 [Warning] Gtid table is not ready to be used. Table 'mysql.gtid_executed' cannot be opened.\n2022-02-18T10:29:25.387668Z 0 [Warning] CA certificate ca.pem is self signed.\n2022-02-18T10:29:26.020911Z 1 [Note] A temporary password is generated for root@localhost: Mzn7/gl.i!-4\n")),(0,o.kt)("ol",{start:6},(0,o.kt)("li",{parentName:"ol"},"\u542f\u52a8MySQL\u670d\u52a1\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"sudo systemctl start mysqld\n")),(0,o.kt)("ol",{start:7},(0,o.kt)("li",{parentName:"ol"},"\u4fee\u6539root\u5bc6\u7801\u4e3a",(0,o.kt)("inlineCode",{parentName:"li"},"root123"),"\u5e76\u8bbe\u7f6eroot\u8d26\u53f7\u4ee5\u4efb\u610fip\u767b\u5f55\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"[kayhaw@hadoop102 module]$ mysql -u root -p\nEnter password: [\u8f93\u5165Mzn7/gl.i!-4]\n...\nmysql> set password = password(\"root123\");\nmysql> update mysql.user set host='%' where user='root';\nmysql> flush privileges;\n")),(0,o.kt)("p",null,"\u73b0\u5728MySQL\u5df2\u7ecf\u914d\u7f6e\u597d\u4e86\uff0c\u63a5\u4e0b\u6765\u8fdb\u884cHive\u76f8\u5173\u914d\u7f6e\uff1a"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u5c06MySQL JDBC\u9a71\u52a8\u62f7\u8d1d\u5230Hive\u7684lib\u76ee\u5f55\u4e0b\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"tar -zxvf mysql-connector-java-5.1.37.tar.gz\ncp mysql-connector-java-5.1.37/mysql-connector-java-5.1.37-bin.jar $HIVE_HOME/lib\n")),(0,o.kt)("ol",{start:2},(0,o.kt)("li",{parentName:"ol"},"\u5728",(0,o.kt)("inlineCode",{parentName:"li"},"$HIVE_HOME/conf"),"\u76ee\u5f55\u4e0b\u65b0\u5efa",(0,o.kt)("inlineCode",{parentName:"li"},"hive-site.xml"),"\u6587\u4ef6\u5e76\u6dfb\u52a0\u5982\u4e0b\u5185\u5bb9\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-xml",metastring:'title="$HIVE_HOME/conf/hive-site.xml"',title:'"$HIVE_HOME/conf/hive-site.xml"'},'<?xml version="1.0"?>\n<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>\n<configuration>\n \x3c!-- jdbc \u8fde\u63a5\u7684 URL --\x3e\n <property>\n <name>javax.jdo.option.ConnectionURL</name>\n <value>jdbc:mysql://hadoop102:3306/metastore?useSSL=false</value>\n</property>\n \x3c!-- jdbc \u8fde\u63a5\u7684 Driver--\x3e\n <property>\n <name>javax.jdo.option.ConnectionDriverName</name>\n <value>com.mysql.jdbc.Driver</value>\n</property>\n\x3c!-- jdbc \u8fde\u63a5\u7684 username--\x3e\n <property>\n <name>javax.jdo.option.ConnectionUserName</name>\n <value>root</value>\n </property>\n \x3c!-- jdbc \u8fde\u63a5\u7684 password --\x3e\n <property>\n <name>javax.jdo.option.ConnectionPassword</name>\n <value>root123</value>\n</property>\n \x3c!-- Hive \u5143\u6570\u636e\u5b58\u50a8\u7248\u672c\u7684\u9a8c\u8bc1 --\x3e\n <property>\n <name>hive.metastore.schema.verification</name>\n <value>false</value>\n</property>\n \x3c!--\u5143\u6570\u636e\u5b58\u50a8\u6388\u6743--\x3e\n <property>\n <name>hive.metastore.event.db.notification.api.auth</name>\n <value>false</value>\n </property>\n \x3c!-- Hive \u9ed8\u8ba4\u5728 HDFS \u7684\u5de5\u4f5c\u76ee\u5f55 --\x3e\n <property>\n <name>hive.metastore.warehouse.dir</name>\n <value>/user/hive/warehouse</value>\n </property>\n</configuration>\n')),(0,o.kt)("ol",{start:3},(0,o.kt)("li",{parentName:"ol"},"\u767b\u5f55MySQL\u5e76\u521b\u5efaHive\u5143\u6570\u636e\u5e93",(0,o.kt)("inlineCode",{parentName:"li"},"metastore"),"\uff0c",(0,o.kt)("strong",{parentName:"li"},"\u6ce8\u610f\u540d\u79f0\u548c\u914d\u7f6e\u6587\u4ef6\u4e2d\u7684\u4fdd\u6301\u4e00\u81f4"),"\u3002"),(0,o.kt)("li",{parentName:"ol"},"\u521d\u59cb\u5316Hive\u5143\u6570\u636e\u5e93\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"schematool -initSchema -dbType mysql -verbose\n")),(0,o.kt)("h3",{id:"\u5f00\u542fmetastore\u670d\u52a1"},"\u5f00\u542fmetastore\u670d\u52a1"),(0,o.kt)("p",null,"\u5230\u76ee\u524d\u4e3a\u6b62\u53ea\u662f\u5728\u672c\u5730\u4f7f\u7528hive\u547d\u4ee4\u5f00\u542f\u4f1a\u8bdd\u8fdb\u884c\u4ea4\u4e92\uff0c\u63a5\u4e0b\u6765\u5f00\u542f\u5143\u6570\u636e\u670d\u52a1\u8ba9\u8fdc\u7a0b\u5ba2\u6237\u7aef\u80fd\u591f\u8bbf\u95eeHive\u670d\u52a1\uff1b"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("inlineCode",{parentName:"li"},"hive-site.xml"),"\u6dfb\u52a0\u5982\u4e0b\u914d\u7f6e\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-xml",metastring:'title="$HIVE_HOME/conf/hive-site.xml"',title:'"$HIVE_HOME/conf/hive-site.xml"'},"\x3c!-- \u6307\u5b9a\u5b58\u50a8\u5143\u6570\u636e\u8981\u8fde\u63a5\u7684\u5730\u5740 --\x3e\n<property>\n  <name>hive.metastore.uris</name>\n  <value>thrift://hadoop102:9083</value>\n</property>\n")),(0,o.kt)("ol",{start:2},(0,o.kt)("li",{parentName:"ol"},"\u542f\u52a8metastore\u670d\u52a1\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"[kayhaw@hadoop102 conf]$ hive --service metastore\n2022-02-19 23:32:28: Starting Hive Metastore Server\n")),(0,o.kt)("p",null,"\u6ce8\u610f\u547d\u4ee4\u5f00\u542f\u524d\u53f0\u8fdb\u7a0b\u670d\u52a1\uff0c\u4e0d\u80fd\u9000\u51fa\uff0c\u6b64\u65f6\u901a\u8fc7",(0,o.kt)("inlineCode",{parentName:"p"},"hive"),"\u547d\u4ee4\u8bbf\u95ee\u7684\u5143\u6570\u636e\u670d\u52a1\u7531hadoop102:9083\u63d0\u4f9b\u3002"),(0,o.kt)("h3",{id:"\u5f00\u542fhiveserver2\u670d\u52a1"},"\u5f00\u542fhiveserver2\u670d\u52a1"),(0,o.kt)("p",null,"\u4e3a\u4e86\u8ba9\u8fdc\u7a0b\u5ba2\u6237\u7aef\u80fd\u4ee5JDBC\u65b9\u5f0f\u8bbf\u95eeHive\uff0c\u8fd8\u9700\u8981\u5f00\u542fhiveserver2\u670d\u52a1\uff1a"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("inlineCode",{parentName:"li"},"hive-site.xml"),"\u6dfb\u52a0\u5982\u4e0b\u914d\u7f6e\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-xml",metastring:'title="$HIVE_HOME/conf/hive-site.xml"',title:'"$HIVE_HOME/conf/hive-site.xml"'},"\x3c!-- \u6307\u5b9a hiveserver2 \u8fde\u63a5\u7684 host --\x3e\n<property>\n  <name>hive.server2.thrift.bind.host</name>\n  <value>hadoop102</value>\n</property>\n\x3c!-- \u6307\u5b9a hiveserver2 \u8fde\u63a5\u7684\u7aef\u53e3\u53f7 --\x3e\n<property>\n  <name>hive.server2.thrift.port</name>\n  <value>10000</value>\n</property>\n")),(0,o.kt)("ol",{start:2},(0,o.kt)("li",{parentName:"ol"},"\u542f\u52a8hiveserver2\u670d\u52a1\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"[kayhaw@hadoop102 conf]$ hive --service metastore\n2022-02-19 23:32:28: Starting Hive Metastore Server\n")),(0,o.kt)("ol",{start:3},(0,o.kt)("li",{parentName:"ol"},"\u4f7f\u7528beeline\u8fde\u63a5hive\uff1a")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"beeline -u jdbc:hive2://hadoop102:10000 -n kayhaw\nConnecting to jdbc:hive2://hadoop102:10000\nConnected to: Apache Hive (version 3.1.2)\nDriver: Hive JDBC (version 3.1.2)\nTransaction isolation: TRANSACTION_REPEATABLE_READ\nBeeline version 3.1.2 by Apache Hive\n")),(0,o.kt)("p",null,"\u8fd9\u91cc\u901a\u8fc7beeline\u8fde\u63a5Hive\u65f6\u62a5\u9519",(0,o.kt)("inlineCode",{parentName:"p"},"Error: Could not open client transport with JDBC Uri: jdbc:hive2://hadoop102:10000: Failed to open new session: java.lang.RuntimeException"),"\uff0c\u9700\u8981\u4fee\u6539Hadoop\u4e2d\u7684core-site.xml\u6587\u4ef6\uff0c\u6dfb\u52a0\u5982\u4e0b\u5185\u5bb9\u540e",(0,o.kt)("strong",{parentName:"p"},"\u91cd\u542fHadoop\u670d\u52a1"),"\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-xml"},"\x3c!-- kayhaw\u6362\u6210\u5b9e\u9645\u767b\u5f55\u7528\u6237\u540d --\x3e\n<property>\n    <name>hadoop.proxyuser.kayhaw.hosts</name>\n  <value>*</value>\n</property>\n<property>\n  <name>hadoop.proxyuser.kayhaw.groups</name>\n  <value>*</value>\n</property>\n")),(0,o.kt)("h3",{id:"\u542f\u52a8\u670d\u52a1\u811a\u672c"},"\u542f\u52a8\u670d\u52a1\u811a\u672c"),(0,o.kt)("p",null,"\u4e3a\u4e86\u5feb\u901f\u542f\u52a8metastore\u548chiveserver2\u670d\u52a1\uff0c\u5c01\u88c5\u5982\u4e0b\u811a\u672c\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash",metastring:'title="$HOME/bin/hiveservice.sh"',title:'"$HOME/bin/hiveservice.sh"'},'#!/bin/bash\nHIVE_LOG_DIR=$HIVE_HOME/logs\nif [ ! -d $HIVE_LOG_DIR ]\nthen\nmkdir -p $HIVE_LOG_DIR\nfi\n#\u68c0\u67e5\u8fdb\u7a0b\u662f\u5426\u8fd0\u884c\u6b63\u5e38\uff0c\u53c2\u6570 1 \u4e3a\u8fdb\u7a0b\u540d\uff0c\u53c2\u6570 2 \u4e3a\u8fdb\u7a0b\u7aef\u53e3\nfunction check_process()\n{\n pid=$(ps -ef 2>/dev/null | grep -v grep | grep -i $1 | awk \'{print $2}\')\n ppid=$(netstat -nltp 2>/dev/null | grep $2 | awk \'{print $7}\' | cut -d \'/\' -f 1)\n echo $pid\n [[ "$pid" =~ "$ppid" ]] && [ "$ppid" ] && return 0 || return 1\n}\nfunction hive_start()\n{\n metapid=$(check_process HiveMetastore 9083)\n cmd="nohup hive --service metastore >$HIVE_LOG_DIR/metastore.log 2>&1 &"\n [ -z "$metapid" ] && eval $cmd || echo "Metastroe \u670d\u52a1\u5df2\u542f\u52a8"\n server2pid=$(check_process HiveServer2 10000)\n cmd="nohup hiveserver2 >$HIVE_LOG_DIR/hiveServer2.log 2>&1 &"\n [ -z "$server2pid" ] && eval $cmd || echo "HiveServer2 \u670d\u52a1\u5df2\u542f\u52a8"\n}\nfunction hive_stop()\n{\n metapid=$(check_process HiveMetastore 9083)\n [ "$metapid" ] && kill $metapid || echo "Metastore \u670d\u52a1\u672a\u542f\u52a8"\n server2pid=$(check_process HiveServer2 10000)\n [ "$server2pid" ] && kill $server2pid || echo "HiveServer2 \u670d\u52a1\u672a\u542f\u52a8"\n}\ncase $1 in\n"start")\n hive_start\n ;;\n"stop")\n hive_stop\n ;;\n"restart")\n hive_stop\n sleep 2\n hive_start\n ;;\n"status")\n check_process HiveMetastore 9083 >/dev/null && echo "Metastore \u670d\u52a1\u8fd0\u884c\u6b63\u5e38" || echo "Metastore \u670d\u52a1\u8fd0\u884c\u5f02\u5e38"\n check_process HiveServer2 10000 >/dev/null && echo "HiveServer2 \u670d\u52a1\u8fd0\u884c\u6b63\u5e38" || echo "HiveServer2 \u670d\u52a1\u8fd0\u884c\u5f02\u5e38"\n ;;\n*)\n echo Invalid Args!\n echo \'Usage: \'$(basename $0)\' start|stop|restart|status\'\n ;;\nesac\n')),(0,o.kt)("h2",{id:"\u603b\u7ed3"},"\u603b\u7ed3"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"\u5b89\u88c5Hive\u4e4b\u524d\u9700\u8981\u642d\u5efaHadoop\u73af\u5883\uff0c\u542f\u52a8Hive\u670d\u52a1\u524d\u786e\u4fddHadoop\u670d\u52a1\u542f\u52a8\uff1b"),(0,o.kt)("li",{parentName:"ol"},"metastore\u670d\u52a1\u7528\u4e8e\u8fdc\u7a0b\u8bbf\u95eeHive\u670d\u52a1\uff0chiveserver2\u670d\u52a1\u7528\u4e8eJDBC\u8bbf\u95eeHive\u670d\u52a1\uff0c\u540e\u8005\u4f9d\u8d56\u4e8e\u524d\u8005\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u5b89\u88c5\u542f\u52a8Hive\u65f6\u7684\u4e00\u4e9b\u5c0f\u95ee\u9898\uff1a\u5305\u7248\u672c\u5dee\u5f02\u3001core-site.xml\u6587\u4ef6\u7b49\uff1b"),(0,o.kt)("li",{parentName:"ol"},"\u5982\u679c\u914d\u7f6e\u4e86",(0,o.kt)("inlineCode",{parentName:"li"},"hive.metastore.uris"),"\u53c2\u6570\uff0c\u5c31\u4e00\u5b9a\u8981\u5f00\u542fmetaserver\u670d\u52a1\u3002")))}h.isMDXComponent=!0}}]);