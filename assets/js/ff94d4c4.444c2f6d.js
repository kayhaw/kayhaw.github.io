"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[5490],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),s=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=s(e.components);return r.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),p=s(n),m=a,f=p["".concat(l,".").concat(m)]||p[m]||d[m]||o;return n?r.createElement(f,i(i({ref:t},u),{},{components:n})):r.createElement(f,i({ref:t},u))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=p;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var s=2;s<o;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},3871:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return c},metadata:function(){return s},toc:function(){return d}});var r=n(3117),a=n(102),o=(n(7294),n(3905)),i=["components"],c={layout:"article",title:"\u5b58\u50a8\u6a21\u578b",slug:"/ClickHouse/StorageStruct",tags:["ClickHouse","Learning Notes"]},l=void 0,s={unversionedId:"ClickHouse/StorageStruct",id:"ClickHouse/StorageStruct",title:"\u5b58\u50a8\u6a21\u578b",description:"ClickHouse\u9ed8\u8ba4\u5b58\u50a8\u6570\u636e\u8def\u5f84\u4e3a/var/lib/clickhouse\uff0c\u5176\u76ee\u5f55\u7ed3\u6784\u5982\u4e0b\u6240\u793a\uff0c\u4e3b\u8981\u5173\u6ce8data\u548cmetadata\u4e24\u4e2a\u6587\u4ef6\u5939\uff0c\u5b83\u4eec\u5206\u522b\u662f\u6570\u636e\u548c\u5143\u6570\u636e\u7684\u5b58\u50a8\u76ee\u5f55\uff1a",source:"@site/notes/ClickHouse/02-StorageStruct.md",sourceDirName:"ClickHouse",slug:"/ClickHouse/StorageStruct",permalink:"/notes/ClickHouse/StorageStruct",tags:[{label:"ClickHouse",permalink:"/notes/tags/click-house"},{label:"Learning Notes",permalink:"/notes/tags/learning-notes"}],version:"current",sidebarPosition:2,frontMatter:{layout:"article",title:"\u5b58\u50a8\u6a21\u578b",slug:"/ClickHouse/StorageStruct",tags:["ClickHouse","Learning Notes"]},sidebar:"defaultSidebar",previous:{title:"\u5b89\u88c5\u4f7f\u7528",permalink:"/notes/ClickHouse/Installation"},next:{title:"MergeTree\u8868\u5f15\u64ce",permalink:"/notes/ClickHouse/MergeTree"}},u={},d=[{value:"\u8868\u5143\u6570\u636e\u76ee\u5f55",id:"\u8868\u5143\u6570\u636e\u76ee\u5f55",level:2},{value:"\u8868\u6570\u636e\u76ee\u5f55",id:"\u8868\u6570\u636e\u76ee\u5f55",level:2}],p={toc:d};function m(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"ClickHouse\u9ed8\u8ba4\u5b58\u50a8\u6570\u636e\u8def\u5f84\u4e3a",(0,o.kt)("inlineCode",{parentName:"p"},"/var/lib/clickhouse"),"\uff0c\u5176\u76ee\u5f55\u7ed3\u6784\u5982\u4e0b\u6240\u793a\uff0c\u4e3b\u8981\u5173\u6ce8",(0,o.kt)("inlineCode",{parentName:"p"},"data"),"\u548c",(0,o.kt)("inlineCode",{parentName:"p"},"metadata"),"\u4e24\u4e2a\u6587\u4ef6\u5939\uff0c\u5b83\u4eec\u5206\u522b\u662f\u6570\u636e\u548c\u5143\u6570\u636e\u7684\u5b58\u50a8\u76ee\u5f55\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"/var/lib/clickhouse\n\u251c\u2500\u2500 access\n\u251c\u2500\u2500 cores\n\u251c\u2500\u2500 data\n\u2502\xa0\xa0 \u251c\u2500\u2500 default\n\u2502\xa0\xa0 \u2502\xa0\xa0 \u2514\u2500\u2500 t_order_mt -> /var/lib/clickhouse/store/363/363227c2-9607-4851-b632-27c296079851/\n\u2502\xa0\xa0 \u2514\u2500\u2500 system\n\u2502\xa0\xa0     \u251c\u2500\u2500 asynchronous_metric_log -> /var/lib/clickhouse/store/d91/d91d3f42-cca2-4e72-991d-3f42cca25e72/\n\u2502\xa0\xa0     \u251c\u2500\u2500 metric_log -> /var/lib/clickhouse/store/7b8/7b88edc1-5cac-4dad-bb88-edc15caccdad/\n\u2502\xa0\xa0     \u251c\u2500\u2500 query_log -> /var/lib/clickhouse/store/985/98565903-6902-459e-9856-59036902159e/\n\u2502\xa0\xa0     \u251c\u2500\u2500 query_thread_log -> /var/lib/clickhouse/store/853/8538a360-a801-4e24-8538-a360a8013e24/\n\u2502\xa0\xa0     \u2514\u2500\u2500 trace_log -> /var/lib/clickhouse/store/eff/effebb87-ed11-410d-affe-bb87ed11810d/\n\u251c\u2500\u2500 dictionaries_lib\n\u251c\u2500\u2500 flags\n\u251c\u2500\u2500 format_schemas\n\u251c\u2500\u2500 metadata\n\u2502\xa0\xa0 \u251c\u2500\u2500 default -> /var/lib/clickhouse/store/7e7/7e7fbe9e-5da3-4c88-be7f-be9e5da33c88/\n\u2502\xa0\xa0 \u251c\u2500\u2500 default.sql\n\u2502\xa0\xa0 \u251c\u2500\u2500 system -> /var/lib/clickhouse/store/452/452c9386-1d14-4bcf-852c-93861d149bcf/\n\u2502\xa0\xa0 \u2514\u2500\u2500 system.sql\n\u251c\u2500\u2500 metadata_dropped\n\u251c\u2500\u2500 preprocessed_configs\n\u251c\u2500\u2500 status\n\u251c\u2500\u2500 store\n\u251c\u2500\u2500 tmp\n\u2514\u2500\u2500 user_files\n")),(0,o.kt)("p",null,"\u5bf9\u4e8edata\u76ee\u5f55\uff0c\u5b83\u53c8\u4ee5\u5e93\u540d\u5212\u5206\u51fa\u591a\u4e2a\u5b50\u76ee\u5f55\uff0c\u6bcf\u4e2a\u5e93\u76ee\u5f55\u4e0b\u53c8\u4ee5\u8868\u540d\u5212\u5206\u51fa\u591a\u4e2a\u5b50\u76ee\u5f55\uff0c",(0,o.kt)("strong",{parentName:"p"},"\u5e76\u4e14\u5b50\u76ee\u5f55\u5b9e\u9645\u4e0a\u662f\u6307\u5411store\u5b50\u76ee\u5f55\u7684\u8f6f\u94fe\u63a5"),"\u3002\u7c7b\u4f3c\u5730\uff0cmetadata\u76ee\u5f55\u4e0b\u4ee5\u5e93\u540d\u5212\u5206\u5b50\u76ee\u5f55\uff0c\u8be5\u5b50\u76ee\u5f55\u4e5f\u662fstore\u5b50\u76ee\u5f55\u7684\u8f6f\u94fe\u63a5\u3002"),(0,o.kt)("h2",{id:"\u8868\u5143\u6570\u636e\u76ee\u5f55"},"\u8868\u5143\u6570\u636e\u76ee\u5f55"),(0,o.kt)("p",null,"\u8fdb\u5165default\u5e93\u7684\u5143\u6570\u636e\u76ee\u5f55",(0,o.kt)("inlineCode",{parentName:"p"},"metadata/default"),"\uff0c\u8fd9\u91cc\u5b58\u653e\u4ee5\u8868\u547d\u540d\u7684sql\u6587\u4ef6\uff0c\u7c7b\u4f3cDDL\u4f46\u5e76\u4e0d\u5b8c\u5168\u76f8\u540c\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sql",metastring:"title=metadata/default/t_order_mt.sql",title:"metadata/default/t_order_mt.sql"},"ATTACH TABLE _ UUID '363227c2-9607-4851-b632-27c296079851'\n(\n    `id` UInt32,\n    `sku_id` String,\n    `total_amount` Decimal(16, 2),\n    `create_time` DateTime\n)\nENGINE = MergeTree\nPARTITION BY toYYYYMMDD(create_time)\nPRIMARY KEY id\nORDER BY (id, sku_id)\nSETTINGS index_granularity = 8192\n")),(0,o.kt)("h2",{id:"\u8868\u6570\u636e\u76ee\u5f55"},"\u8868\u6570\u636e\u76ee\u5f55"),(0,o.kt)("p",null,"\u8fdb\u5165\u8868t_order_mt\u7684\u6570\u636e\u76ee\u5f55\uff0c\u5176\u7ed3\u6784\u5982\u4e0b\u6240\u793a\uff0c\u5206\u522b\u662f\u5206\u533a\u76ee\u5f55\u3001detached\u76ee\u5f55\u548c\u7248\u672c\u4fe1\u606f\u6587\u4ef6\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"/var/lib/clickhouse/data/default/t_order_mt/\n\u251c\u2500\u2500 20200601_1_1_0\n\u251c\u2500\u2500 ...\n\u251c\u2500\u2500 20200602_2_2_0\n\u2502\xa0\xa0 \u251c\u2500\u2500 checksums.txt     # \u6570\u636e\u6821\u9a8c\u548c\u6587\u4ef6\n\u2502\xa0\xa0 \u251c\u2500\u2500 columns.txt       # \u5217\u5b9a\u4e49\u6587\u4ef6\uff0c\u5305\u542b\u5217\u540d\u548c\u7c7b\u578b\n\u2502\xa0\xa0 \u251c\u2500\u2500 count.txt         # \u5206\u533a\u8bb0\u5f55\u603b\u6570\u6587\u4ef6\n\u2502\xa0\xa0 \u251c\u2500\u2500 data.bin          # \u6570\u636e\u6587\u4ef6\n\u2502\xa0\xa0 \u251c\u2500\u2500 data.mrk3         # \u6570\u636e\u6807\u8bb0\u6587\u4ef6\uff0c\u5173\u8054primary.idx\u548cdata.bin\n\u2502\xa0\xa0 \u251c\u2500\u2500 default_compression_codec.txt   # \u538b\u7f29\u683c\u5f0f\uff0c\u9ed8\u8ba4LZ4\n\u2502\xa0\xa0 \u251c\u2500\u2500 minmax_create_time.idx          # \u6700\u5927\u6700\u5c0f\u521b\u5efa\u65f6\u95f4\u7d22\u5f15\u6587\u4ef6\n\u2502\xa0\xa0 \u251c\u2500\u2500 partition.dat     # \u5206\u533a\n\u2502\xa0\xa0 \u2514\u2500\u2500 primary.idx       # \u4e3b\u952e\u7d22\u5f15\u6587\u4ef6\n\u251c\u2500\u2500 detached              # DETACH\u8bed\u53e5\u6267\u884c\u540e\u5206\u533a\u5b58\u653e\u4f4d\u7f6e\n\u2514\u2500\u2500 format_version.txt\n")),(0,o.kt)("p",null,"\u5176\u4e2d\uff0c\u5206\u533a\u76ee\u5f55\u7684\u547d\u540d\u683c\u5f0f\u4e3a",(0,o.kt)("inlineCode",{parentName:"p"},"\u5206\u533a\u503c_\u6700\u5c0f\u5757\u53f7_\u6700\u5927\u5757\u53f7_\u5408\u5e76\u6b21\u6570"),"\uff0c\u8be5\u76ee\u5f55\u4e0b\u53c8\u5305\u542b\u5404\u4e2a\u5206\u533a\u6570\u636e\u548c\u5143\u6570\u636e\u4fe1\u606f\u3002\u6587\u672c\u6587\u4ef6count.txt\u8bb0\u5f55\u8be5\u5206\u533a\u7684\u8bb0\u5f55\u603b\u6570\uff0c\u56e0\u6b64ClickHouse\u67e5\u8be2",(0,o.kt)("inlineCode",{parentName:"p"},"select count(*)"),"\u53ef\u4ee5\u5feb\u901f\u5f97\u5230\u7ed3\u679c\u800c\u4e0d\u5fc5\u904d\u5386\u6570\u636e\u6587\u4ef6\u3002"),(0,o.kt)("ul",{className:"contains-task-list"},(0,o.kt)("li",{parentName:"ul",className:"task-list-item"},(0,o.kt)("input",{parentName:"li",type:"checkbox",checked:!1,disabled:!0})," ","\u8865\u5145mrk3\u6587\u4ef6\u662f\u5982\u4f55\u8054\u7cfbidx\u548cbin\u6587\u4ef6")))}m.isMDXComponent=!0}}]);