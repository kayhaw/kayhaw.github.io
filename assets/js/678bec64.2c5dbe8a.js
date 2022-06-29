"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[1383],{9086:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return p},default:function(){return u},frontMatter:function(){return l},metadata:function(){return c},toc:function(){return d}});var a=n(3117),i=n(102),r=(n(7294),n(3905)),o=["components"],l={layout:"article",title:"Atomic",slug:"/ClickHouse/Database-Engines/Atomic",tags:["ClickHouse","Learning Notes"]},p=void 0,c={unversionedId:"ClickHouse/Database Engines/AtomicEngine",id:"ClickHouse/Database Engines/AtomicEngine",title:"Atomic",description:"Atomic\u5e93\u5f15\u64ce\u662fClickHouse\u9ed8\u8ba4\u7684\u5e93\u5f15\u64ce\uff0c\u652f\u6301\u975e\u963b\u585e\u7684\u8868\u5220\u9664\u548c\u8868\u91cd\u547d\u540d\u64cd\u4f5c\uff0c\u4ee5\u53ca\u539f\u5b50\u6027\u7684\u4ea4\u6362\u8868\u64cd\u4f5c\u3002",source:"@site/notes/ClickHouse/03-Database Engines/01-AtomicEngine.md",sourceDirName:"ClickHouse/03-Database Engines",slug:"/ClickHouse/Database-Engines/Atomic",permalink:"/notes/ClickHouse/Database-Engines/Atomic",draft:!1,tags:[{label:"ClickHouse",permalink:"/notes/tags/click-house"},{label:"Learning Notes",permalink:"/notes/tags/learning-notes"}],version:"current",sidebarPosition:1,frontMatter:{layout:"article",title:"Atomic",slug:"/ClickHouse/Database-Engines/Atomic",tags:["ClickHouse","Learning Notes"]},sidebar:"defaultSidebar",previous:{title:"\u5e93\u5f15\u64ce",permalink:"/notes/ClickHouse/Database-Engines/"},next:{title:"Lazy",permalink:"/notes/ClickHouse/DataBase-Engines/Lazy"}},s={},d=[{value:"\u8868UUID",id:"\u8868uuid",level:2},{value:"\u8868\u91cd\u547d\u540d",id:"\u8868\u91cd\u547d\u540d",level:2},{value:"DROP/DETACH\u8868",id:"dropdetach\u8868",level:2},{value:"DETACH\u548cDROP\u533a\u522b",id:"detach\u548cdrop\u533a\u522b",level:3},{value:"EXCHANGE\u8868/\u8bcd\u5178",id:"exchange\u8868\u8bcd\u5178",level:2},{value:"\u642d\u914dReplicatedMergeTree",id:"\u642d\u914dreplicatedmergetree",level:2},{value:"\u603b\u7ed3",id:"\u603b\u7ed3",level:2}],m={toc:d};function u(e){var t=e.components,n=(0,i.Z)(e,o);return(0,r.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Atomic\u5e93\u5f15\u64ce\u662fClickHouse\u9ed8\u8ba4\u7684\u5e93\u5f15\u64ce\uff0c\u652f\u6301",(0,r.kt)("strong",{parentName:"p"},"\u975e\u963b\u585e\u7684"),"\u8868\u5220\u9664\u548c\u8868\u91cd\u547d\u540d\u64cd\u4f5c\uff0c\u4ee5\u53ca",(0,r.kt)("strong",{parentName:"p"},"\u539f\u5b50\u6027\u7684"),"\u4ea4\u6362\u8868\u64cd\u4f5c\u3002"),(0,r.kt)("h2",{id:"\u8868uuid"},"\u8868UUID"),(0,r.kt)("p",null,"Atomic\u5e93\u5f15\u64ce\u4e2d\u7684\u6240\u6709\u8868\u5bf9\u5e94\u4e00\u4e2a\u56fa\u5b9a\u7684UUID\uff0c\u5e76\u4e14\u8868\u6570\u636e\u5b58\u653e\u5728\u76ee\u5f55",(0,r.kt)("inlineCode",{parentName:"p"},"/<clickhouse_path>/store/xxx/xxxxyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"),"\u4e0b\uff0c\u5176\u4e2d\u6700\u540e\u4e00\u96c6\u76ee\u5f55\u540d\u5c31\u662f\u8868UUID\u3002\u901a\u5e38UUID\u5efa\u8868\u65f6\u81ea\u52a8\u751f\u6210\uff0c\u4f46\u4e5f\u53ef\u4ee5\u624b\u52a8\u6307\u5b9a(",(0,r.kt)("strong",{parentName:"p"},"\u4e0d\u5efa\u8bae\u8fd9\u4e48\u505a\ud83d\ude45\u200d\u2640\ufe0f"),")\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sql"},"CREATE TABLE name UUID '28f1c61c-2970-457a-bffe-454156ddcfef' (n UInt64) ENGINE = ...;\n")),(0,r.kt)("p",null,"\u901a\u8fc7",(0,r.kt)("inlineCode",{parentName:"p"},"set show_table_uuid_in_table_create_query_if_not_nil=1"),"\u540e\uff0c\u6267\u884c",(0,r.kt)("inlineCode",{parentName:"p"},"show create table xxx"),"\u4f1a\u663e\u793a\u8868UUID\uff0c\u9ed8\u8ba4\u4e0d\u663e\u793a\u3002"),(0,r.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"\u8868UUID\u662fClickHouse\u533a\u5206\u8868\u7684\u6807\u8bc6\uff0c\u4e5f\u662f\u8868\u5143\u6570\u636e\u548c\u8868\u6570\u636e\u5173\u8054\u7684\u6865\u6881\uff0c\u5728",(0,r.kt)("inlineCode",{parentName:"p"},"ReplicatedMergeTree"),"\u8868\u5f15\u64ce\u4e2d\u53ef\u4ee5\u7528\u6765\u4f5c\u4e3a\u526f\u672c\u8def\u5f84\u540d\u3002"))),(0,r.kt)("h2",{id:"\u8868\u91cd\u547d\u540d"},"\u8868\u91cd\u547d\u540d"),(0,r.kt)("p",null,"\u901a\u8fc7",(0,r.kt)("inlineCode",{parentName:"p"},"RENAME"),"\u8bed\u53e5\u5bf9\u8868\u8fdb\u884c\u91cd\u547d\u540d\uff0c\u5b83\u4e0d\u4f1a\u4fee\u6539\u8868UUID\u6216\u8005\u79fb\u52a8\u8868\u6570\u636e\uff0c\u5e76\u4e14\u6267\u884c\u662f\u975e\u963b\u585e\u7684\uff1a\u7acb\u5373\u6267\u884c\u800c\u4e0d\u4f1a\u7b49\u5176\u4ed6\u8bed\u53e5\u6267\u884c\u5b8c\u6bd5\u3002"),(0,r.kt)("h2",{id:"dropdetach\u8868"},"DROP/DETACH\u8868"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"DROP TABLE"),"/",(0,r.kt)("inlineCode",{parentName:"p"},"DETACH TABLE"),"\u64cd\u4f5c\u5148\u5c06\u8868",(0,r.kt)("strong",{parentName:"p"},"\u5143\u6570\u636e"),"\u79fb\u52a8\u5230",(0,r.kt)("inlineCode",{parentName:"p"},"/<clickhouse_path>/metadata_dropped/"),"\u76ee\u5f55\u5e76\u901a\u77e5\u540e\u53f0\u7ebf\u7a0b\uff0c\u7ecf\u8fc7",(0,r.kt)("inlineCode",{parentName:"p"},"database_atomic_delay_before_drop_table_sec"),"\u53c2\u6570\u6307\u5b9a\u65f6\u95f4\u540e\u624d\u5c06\u8868\u6570\u636e\u5220\u9664(\u5355\u4f4d\u79d2\uff0c\u9ed8\u8ba4480\u79d2)\u3002"),(0,r.kt)("p",null,"\u5982\u679c",(0,r.kt)("inlineCode",{parentName:"p"},"DROP"),"/",(0,r.kt)("inlineCode",{parentName:"p"},"DETACH"),"\u64cd\u4f5c\u52a0\u4e0a",(0,r.kt)("inlineCode",{parentName:"p"},"SYNC"),"\u5173\u952e\u5b57\uff0c\u5219\u4f1a\u7b49\u5f85\u8be5\u8868\u5176\u4ed6\u8bed\u53e5\u6267\u884c\u5b8c\u6bd5\u540e\u5220\u9664\u6570\u636e\uff0c\u6b64\u65f6",(0,r.kt)("inlineCode",{parentName:"p"},"database_atomic_delay_before_drop_table_sec"),"\u53c2\u6570\u5931\u6548\uff0c\u4e5f\u53ef\u4ee5\u901a\u8fc7",(0,r.kt)("inlineCode",{parentName:"p"},"set database_atomic_wait_for_drop_and_detach_synchronously = 1"),"\u5168\u5c40\u5730\u7ed9",(0,r.kt)("inlineCode",{parentName:"p"},"DROP"),"/",(0,r.kt)("inlineCode",{parentName:"p"},"DETACH"),"\u8bed\u53e5\u52a0\u4e0a",(0,r.kt)("inlineCode",{parentName:"p"},"SYNC"),"\u3002"),(0,r.kt)("h3",{id:"detach\u548cdrop\u533a\u522b"},"DETACH\u548cDROP\u533a\u522b"),(0,r.kt)("p",null,"DETACH\u8ba9ClickHouse\u670d\u52a1\u201c\u6682\u65f6\u5fd8\u8bb0\u201d\u8868(\u89c6\u56fe\u3001\u8bcd\u5178)\u7684\u5b58\u5728\uff0c\u4e4b\u540e\u6267\u884c\u8be5\u8868\u7684\u67e5\u8be2\u8bed\u53e5\u4f1a\u62a5\u8868\u4e0d\u5b58\u5728\u7684\u9519\u8bef(",(0,r.kt)("strong",{parentName:"p"},"SHOW CREATE TBALE\u53ef\u4ee5\u4f46\u662fDESC TABLE\u62a5\u9519\u2753"),")\uff0c\u9664\u6b64\u4e4b\u5916",(0,r.kt)("strong",{parentName:"p"},"\u4e0d\u4f1a\u5bf9"),"\u8868\u6570\u636e\u76ee\u5f55\u548c\u5143\u6570\u636e\u76ee\u5f55\u505a\u4efb\u4f55\u64cd\u4f5c\uff0c\u53ef\u4ee5\u901a\u8fc7\u6267\u884cATTACH\u8bed\u53e5",(0,r.kt)("strong",{parentName:"p"},"\u6216\u8005\u91cd\u542fClickHouse\u670d\u52a1(",(0,r.kt)("inlineCode",{parentName:"strong"},"clickhouse restart"),")"),"\u6062\u590d\u3002\u5982\u679cDETACH\u5e26\u4e0a\u4e86",(0,r.kt)("inlineCode",{parentName:"p"},"PERMANENTLY"),"\uff0c\u90a3\u4e48\u6b64\u65f6\u53ea\u80fd\u624b\u52a8\u6267\u884cATTACH\u6062\u590d\uff0c\u91cd\u542fClickHouse\u670d\u52a1\u4e0d\u80fd\u6062\u590d\u3002"),(0,r.kt)("p",null,"DROP TABLE\u5148\u4e0d\u52a8\u8868\u6570\u636e\u76ee\u5f55\uff0c\u800c\u662f\u5c06\u8868\u5143\u6570\u636e\u76ee\u5f55\u4e0b\u7684",(0,r.kt)("inlineCode",{parentName:"p"},"<tablename>.sql"),"\u79fb\u52a8\u4e3a",(0,r.kt)("inlineCode",{parentName:"p"},"<clickhouse_path>/metadata_dropped/<database>.<tablename>.<uuid>.sql"),"\uff0c\u5e76\u5220\u9664",(0,r.kt)("inlineCode",{parentName:"p"},"/<clickhouse_path>/data/<database>"),"\u4e2d\u7684\u8868\u76ee\u5f55\u8f6f\u8fde\u63a5\uff0c\u6b64\u65f6ATTCH\u4e5f\u65e0\u529b\u56de\u5929\uff0c\u7ecf\u8fc7\u4e00\u6bb5\u65f6\u95f4\u518d\u7531\u540e\u53f0\u7ebf\u7a0b\u5220\u9664metadata_dropped\u76ee\u5f55\u548cstore\u76ee\u5f55\u4e2d\u7684\u8868\u6570\u636e\u548c\u5143\u6570\u636e\u3002"),(0,r.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"\u603b\u7ed3")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"\u5c3d\u7ba1\u4ece\u6548\u679c\u4e0a\u770b\uff0cDETACH\u548cDROP\u90fd\u8ba9\u8868\u201c\u4e0d\u5b58\u5728\u201d\uff0c\u4f46\u4e24\u8005\u4ecd\u6709\u4ee5\u4e0b\u533a\u522b\uff1a"),(0,r.kt)("ol",{parentName:"div"},(0,r.kt)("li",{parentName:"ol"},"\u5bf9\u8c61\u8303\u56f4\u4e0d\u540c\uff1aDETACH\u53ea\u80fd\u7528\u4e8e\u8868\u3001\u89c6\u56fe\u3001\u8bcd\u5178\uff0c\u800cDROP\u80fd\u7528\u4e8e\u5e93\u3001\u8868\u3001\u8bcd\u5178\u3001\u7528\u6237\u3001\u89d2\u8272\u3001\u89c6\u56fe\u548c\u51fd\u6570\u7b49\uff1b"),(0,r.kt)("li",{parentName:"ol"},"\u6709\u6548\u5468\u671f\u4e0d\u540c\uff1aDETACH\u662f\u4e34\u65f6\u7684\u53ef\u9006\u64cd\u4f5c\uff0c\u901a\u8fc7ATTCH\u6216\u8005\u91cd\u542fClickHouse\u670d\u52a1\u53ef\u4ee5\u6062\u590d\uff0c\u800cDROP\u662f\u6c38\u4e45\u7684\u4e0d\u53ef\u9006\u64cd\u4f5c\uff1b"),(0,r.kt)("li",{parentName:"ol"},"\u5b9e\u9645\u64cd\u4f5c\u4e0d\u540c\uff1aDETACH\u4e0d\u5bf9\u6570\u636e\u548c\u5143\u6570\u636e\u8fdb\u884c\u4efb\u4f55\u64cd\u4f5c\uff0c\u4f46\u662fDROP\u4f1a\u5220\u9664\u6570\u636e\u548c\u5143\u6570\u636e\u3002")))),(0,r.kt)("h2",{id:"exchange\u8868\u8bcd\u5178"},"EXCHANGE\u8868/\u8bcd\u5178"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"EXCHANGE"),"\u8bed\u53e5\u53ef\u4ee5",(0,r.kt)("strong",{parentName:"p"},"\u539f\u5b50\u6027"),"\u5730\u4ea4\u6362\u8868/\u8bcd\u5178\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sql"},"# \u975e\u539f\u5b50\u6027\u64cd\u4f5c\nRENAME TABLE new_table TO tmp, old_table TO new_table, tmp TO old_table;\n\n# \u539f\u5b50\u6027\u64cd\u4f5c\nEXCHANGE TABLES new_table AND old_table;\n")),(0,r.kt)("h2",{id:"\u642d\u914dreplicatedmergetree"},"\u642d\u914dReplicatedMergeTree"),(0,r.kt)("p",null,"\u5f53\u4f7f\u7528ReplicatedMergeTree\u8868\u5f15\u64ce\u65f6\uff0c",(0,r.kt)("strong",{parentName:"p"},"\u5efa\u8bae\u4e0d\u8981\u6307\u5b9aZooKeeper\u8def\u5f84\u53c2\u6570\u548c\u526f\u672c\u540d\u79f0"),"\uff0c\u8ba9ClickHouse\u4f7f\u7528\u5e26",(0,r.kt)("inlineCode",{parentName:"p"},"{uuid}"),"\u5b8f\u7684\u914d\u7f6e\u53c2\u6570",(0,r.kt)("inlineCode",{parentName:"p"},"default_replica_path"),"\uff0c\u53ef\u4ee5\u786e\u4fdd\u8def\u5f84\u552f\u4e00\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-xml"},"<default_replica_path>/clickhouse/tables/{uuid}/{shard}</default_replica_path>\n\n<default_replica_name>{replica}</default_replica_name>\n")),(0,r.kt)("h2",{id:"\u603b\u7ed3"},"\u603b\u7ed3"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Atomic\u662fClickHouse\u7684\u9ed8\u8ba4\u5e93\u5f15\u64ce\uff0c\u5b83\u7684\u8868\u5220\u9664\u64cd\u4f5c(DROP)\u662f\u975e\u963b\u585e\u6709\u5ef6\u8fdf\u7684\uff0c\u80fd\u591f\u652f\u6301\u539f\u5b50\u6027\u7684\u8868\u4ea4\u6362\uff1b"),(0,r.kt)("li",{parentName:"ol"},"\u4e0d\u8981\u81ea\u884c\u7ed9\u8868\u8bbe\u7f6eUUID\uff0c\u800c\u662f\u7531ClickHouse\u81ea\u52a8\u751f\u6210\uff1b"),(0,r.kt)("li",{parentName:"ol"},"DROP\u548cDETACH\u8868\u7684\u5f02\u540c\uff1b"),(0,r.kt)("li",{parentName:"ol"},"\u4f7f\u7528ReplicatedMergeTree\u7684\u6ce8\u610f\u4e8b\u9879\u3002")))}u.isMDXComponent=!0},3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return u}});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=a.createContext({}),c=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},s=function(e){var t=c(e.components);return a.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,p=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),m=c(n),u=i,k=m["".concat(p,".").concat(u)]||m[u]||d[u]||r;return n?a.createElement(k,o(o({ref:t},s),{},{components:n})):a.createElement(k,o({ref:t},s))}));function u(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,o=new Array(r);o[0]=m;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var c=2;c<r;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);