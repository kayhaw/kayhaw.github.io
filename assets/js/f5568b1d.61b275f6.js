"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[2306],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return u}});var i=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=i.createContext({}),m=function(e){var t=i.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=m(e.components);return i.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},d=i.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,s=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),d=m(n),u=a,k=d["".concat(s,".").concat(u)]||d[u]||c[u]||r;return n?i.createElement(k,l(l({ref:t},p),{},{components:n})):i.createElement(k,l({ref:t},p))}));function u(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,l=new Array(r);l[0]=d;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var m=2;m<r;m++)l[m]=n[m];return i.createElement.apply(null,l)}return i.createElement.apply(null,n)}d.displayName="MDXCreateElement"},5792:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return o},contentTitle:function(){return s},metadata:function(){return m},toc:function(){return p},default:function(){return d}});var i=n(7462),a=n(3366),r=(n(7294),n(3905)),l=["components"],o={layout:"article",title:"Time-Based and Window Operators",permalink:"/Stream-Processing-with-Apache-Flink/Chap06",tags:["Stream Processing","Apache Flink","ReadingNotes"]},s=void 0,m={unversionedId:"Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap06",id:"Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap06",isDocsHomePage:!1,title:"Time-Based and Window Operators",description:"Stream Processing with Apache Flink \u7b2c6\u7ae0\u8bfb\u4e66\u7b14\u8bb0",source:"@site/docs/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap06.md",sourceDirName:"Stream Processing with Apache Flink",slug:"/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap06",permalink:"/docs/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap06",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/docs/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap06.md",tags:[{label:"Stream Processing",permalink:"/docs/tags/stream-processing"},{label:"Apache Flink",permalink:"/docs/tags/apache-flink"},{label:"ReadingNotes",permalink:"/docs/tags/reading-notes"}],version:"current",frontMatter:{layout:"article",title:"Time-Based and Window Operators",permalink:"/Stream-Processing-with-Apache-Flink/Chap06",tags:["Stream Processing","Apache Flink","ReadingNotes"]},sidebar:"tutorialSidebar",previous:{title:"DataStream API(v.14.0)",permalink:"/docs/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap05"},next:{title:"drift",permalink:"/docs/Stream Processing with Apache Flink/drift"}},p=[{value:"\u8bbe\u7f6e\u65f6\u95f4\u8bed\u4e49",id:"\u8bbe\u7f6e\u65f6\u95f4\u8bed\u4e49",children:[]},{value:"\u6307\u5b9atimestamp\u548c\u751f\u6210\u6c34\u5370",id:"\u6307\u5b9atimestamp\u548c\u751f\u6210\u6c34\u5370",children:[{value:"<del>\u5468\u671f\u6027\u6c34\u5370</del>",id:"\u5468\u671f\u6027\u6c34\u5370",children:[]},{value:"<del>\u95f4\u65ad\u6027\u6c34\u5370</del>",id:"\u95f4\u65ad\u6027\u6c34\u5370",children:[]},{value:"\u6c34\u5370\uff0c\u5ef6\u8fdf\u548c\u5b8c\u6574\u5ea6",id:"\u6c34\u5370\u5ef6\u8fdf\u548c\u5b8c\u6574\u5ea6",children:[]}]},{value:"\u5904\u7406\u51fd\u6570",id:"\u5904\u7406\u51fd\u6570",children:[{value:"TimerService\u548cTimer",id:"timerservice\u548ctimer",children:[]},{value:"\u53d1\u9001\u5230Side Outputs",id:"\u53d1\u9001\u5230side-outputs",children:[]},{value:"CoProcessFunction",id:"coprocessfunction",children:[]}]},{value:"\u7a97\u53e3\u64cd\u4f5c",id:"\u7a97\u53e3\u64cd\u4f5c",children:[{value:"\u5b9a\u4e49\u7a97\u53e3\u7b97\u5b50",id:"\u5b9a\u4e49\u7a97\u53e3\u7b97\u5b50",children:[]},{value:"\u5185\u7f6eWindow Assigner",id:"\u5185\u7f6ewindow-assigner",children:[]}]}],c={toc:p};function d(e){var t=e.components,n=(0,a.Z)(e,l);return(0,r.kt)("wrapper",(0,i.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},(0,r.kt)("em",{parentName:"p"},"Stream Processing with Apache Flink")," \u7b2c6\u7ae0\u8bfb\u4e66\u7b14\u8bb0\n\u793a\u4f8b\u4ee3\u7801\u89c1",(0,r.kt)("a",{parentName:"p",href:"https://github.com/kayhaw/flink-example"},"flink-example")))),(0,r.kt)("h2",{id:"\u8bbe\u7f6e\u65f6\u95f4\u8bed\u4e49"},"\u8bbe\u7f6e\u65f6\u95f4\u8bed\u4e49"),(0,r.kt)("p",null,"Flink\u5e94\u7528\u7684\u65f6\u95f4\u8bed\u4e49\u7531StreamExecutionEnvironment\u7684\u5c5e\u6027timeCharacteristic\u786e\u5b9a\uff0c\u5b83\u53ef\u4ee5\u8bbe\u7f6e\u5982\u4e0b\u679a\u4e3e\u503c\uff1a"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"TimeCharacteristic.ProcessingTime"),"\uff1a\u8bbe\u7f6e\u65f6\u95f4\u8bed\u4e49\u4e3a\u5904\u7406\u65f6\u95f4\uff0c\u8ba1\u7b97\u7ed3\u679c\u5feb\u4f46\u662f\u4e0d\u51c6\u786e\uff0c\u4f1a\u6f0f\u6389\u5ef6\u8fdf\u6570\u636e\u3002")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"TimeCharacteristic.EventTime"),"\uff1a\u8bbe\u7f6e\u65f6\u95f4\u8bed\u4e49\u4e3a\u4e8b\u4ef6\u65f6\u95f4\uff0c\u6570\u636e\u81ea\u8eab\u63d0\u4f9btimestamp\u3002Timestamp\u53ef\u4ee5\u662f\u6570\u636e\u672c\u8eab\u7684\u4e00\u4e2a\u5b57\u6bb5\uff0c\u4e5f\u53ef\u4ee5\u5728source\u7b97\u5b50\u4e0a\u8d4b\u503c\u3002\u8ba1\u7b97\u7ed3\u679c\u51c6\u786e\uff0c\u4e3a\u4e86\u5904\u7406\u4e71\u5e8f\u6570\u636e\u4f1a\u6709\u5ef6\u8fdf\u3002")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"TimeCharacteristic.IngestionTime"),"\uff1a\u6307\u5b9asource\u7b97\u5b50\u7684\u5904\u7406\u65f6\u95f4\u4e3a\u4e8b\u4ef6\u65f6\u95f4\uff0c\u53ef\u4ee5\u89c6\u4e3aProcessingTime\u548cEventTime\u7684\u7ed3\u5408\u4f53\u3002"))),(0,r.kt)("p",null,"\u901a\u8fc7",(0,r.kt)("del",{parentName:"p"},(0,r.kt)("inlineCode",{parentName:"del"},"env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)")),"\u6307\u5b9a\u5e94\u7528\u65f6\u95f4\u8bed\u4e49\uff0c\u4f46\u4eceFlink 1.12\u8d77\u5e94\u7528\u7684\u9ed8\u8ba4\u65f6\u95f4\u8bed\u4e49\u5c31\u662f",(0,r.kt)("strong",{parentName:"p"},"EventTime"),"\uff0c\u56e0\u6b64setStreamTimeCharacteristic\u5df2\u7ecf\u8fc7\u65f6\uff0c\u4e0d\u63a8\u8350\u4f7f\u7528\u3002"),(0,r.kt)("h2",{id:"\u6307\u5b9atimestamp\u548c\u751f\u6210\u6c34\u5370"},"\u6307\u5b9atimestamp\u548c\u751f\u6210\u6c34\u5370"),(0,r.kt)("p",null,"\u5f53\u8bbe\u7f6e\u65f6\u95f4\u8bed\u4e49\u4e3a\u4e8b\u4ef6\u65f6\u95f4\u540e\uff0c\u9700\u8981\u6307\u5b9atimestamp\u548c\u751f\u6210\u6c34\u5370\uff0c\u8fd9\u91cc\u67092\u79cd\u65b9\u5f0f\u5b9e\u73b0\uff1a"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"\u5728SourceFunction\u4e2d\u8bbe\u7f6e")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"\u8c03\u7528",(0,r.kt)("del",{parentName:"p"},"assignTimestampsAndWatermarks(TimestampAssigner)"),"\u65b9\u6cd5"))),(0,r.kt)("p",null,"\u6839\u636e",(0,r.kt)("strong",{parentName:"p"},"\u6c34\u5370\u751f\u6210\u79bb\u6570\u636e\u6e90\u8d8a\u8fd1\u8d8a\u5b89\u5168"),"\u7684\u539f\u5219\uff0c\u8c03\u7528assignTimestampsAndWatermarks\u5e94\u8be5\u7d27\u8ddf\u7740source\u65b9\u6cd5\u4e4b\u540e\uff0c\u4f4d\u4e8e\u6240\u6709\u57fa\u4e8e\u4e8b\u4ef6\u65f6\u95f4\u7684function\u4e4b\u524d\uff0c\u6700\u597d\u76f4\u63a5\u5728SourceFunction\u4e2d\u751f\u6210\u6c34\u5370\u3002"),(0,r.kt)("p",null,"TimestampAssigner\u63a5\u53e3\u8fd8\u6d3e\u751f\u51faAssignerWithPeriodicWatermarks\u548cAssignerWithPunctuatedWatermarks\uff0c\u8868\u793a\u4e0d\u540c\u7684\u751f\u6210\u7b56\u7565\u3002"),(0,r.kt)("h3",{id:"\u5468\u671f\u6027\u6c34\u5370"},(0,r.kt)("del",{parentName:"h3"},"\u5468\u671f\u6027\u6c34\u5370")),(0,r.kt)("p",null,"\u5468\u671f\u6027\u6c34\u5370\u9ed8\u8ba4\u6bcf200ms\u53d1\u9001\u4e00\u6b21\u6c34\u5370\uff0c\u901a\u8fc7",(0,r.kt)("inlineCode",{parentName:"p"},"StreamExecutionEnvironment.getConfig.setAutoWatermarkInterval(int)"),"\u8bbe\u7f6e\u53d1\u9001\u95f4\u9694\uff0c\u6216\u8005\u5b9e\u73b0AssignerWithPeriodicWatermarks\u63a5\u53e3\u7684getCurrentWatermark\u65b9\u6cd5\u3002DataStream API\u8fd8\u63d0\u4f9b\u5982\u4e0b2\u4e2a\u5feb\u6377\u9879\uff1a"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"\u5982\u679c\u786e\u8ba4\u8f93\u5165\u6570\u636e\u7684\u65f6\u95f4\u6233\u5355\u8c03\u9012\u589e\uff0c\u4f7f\u7528\u5feb\u6377\u65b9\u6cd5assignAscendingTimeStamps\u8bbe\u7f6etimestamp\u548c\u6c34\u5370\u3002")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"\u5982\u679c\u6570\u636e\u4e71\u5e8f\u5230\u8fbe\uff0c\u4f7f\u7528BoundedOutOfOrdernessTimeStampExtractor\u8bbe\u7f6etimestamp\u548c\u6c34\u5370\u3002"))),(0,r.kt)("h3",{id:"\u95f4\u65ad\u6027\u6c34\u5370"},(0,r.kt)("del",{parentName:"h3"},"\u95f4\u65ad\u6027\u6c34\u5370")),(0,r.kt)("p",null,'\u95f4\u65ad\u6027\u6c34\u5370\u7684\u751f\u6210\u7531\u8f93\u5165\u6570\u636e\u7684\u67d0\u4e9b\u5c5e\u6027\u786e\u5b9a\uff0cAssignerWithPunctuatedWatermarks\u63a5\u53e3\u5b9a\u4e49\u4e86checkAndGetNextWatermark()\u65b9\u6cd5\uff0c\u8be5\u65b9\u6cd5\u5728\u6bcf\u6b21\u7684extractTimestamp()\u8c03\u7528\u540e\u6267\u884c\uff0c\u5982\u4e0b\u6240\u793a\u4ee3\u7801\u5728id\u5305\u542b"sensor_1"\u65f6\u4ea7\u751f\u6c34\u5370\uff1a'),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java"},'public class SensorTimeAssigner implements AssignerWithPunctuatedWatermarks<SensorReading> {\n    @Nullable\n    @Override\n    public Watermark checkAndGetNextWatermark(SensorReading lastElement, long extractedTimestamp) {\n        if("sensor_1".equals(lastElement.id)) {\n            return new Watermark(extractedTimestamp - 60*1000);\n        } else {\n            return null\n        }\n    }\n\n    @Override\n    public long extractTimestamp(SensorReading element, long recordTimestamp) {\n        return element.timestamp;\n    }\n}\n')),(0,r.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"\u6ce8\u610f")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"AssignerWithPeriodicWatermarks\u548cAssignerWithPunctuatedWatermarks\u63a5\u53e3\u5df2\u7ecf\u8fc7\u65f6\uff0c\u4f7f\u7528WatermarkStrategy\u4ee3\u66ff\u3002"))),(0,r.kt)("h3",{id:"\u6c34\u5370\u5ef6\u8fdf\u548c\u5b8c\u6574\u5ea6"},"\u6c34\u5370\uff0c\u5ef6\u8fdf\u548c\u5b8c\u6574\u5ea6"),(0,r.kt)("p",null,"\u6c34\u5370\u7528\u4e8e\u8c03\u6574\u5ef6\u8fdf\u548c\u7ed3\u679c\u5b8c\u6574\u5ea6\u7684\u5e73\u8861\uff0c\u5373\u7b97\u5b50\u5728\u7b49\u5f85\u591a\u4e45\u540e\u89e6\u53d1\u8ba1\u7b97\u3002\u73b0\u5b9e\u4e2d\u65e0\u6cd5\u8bbe\u7f6e\u5b8c\u7f8e\u7684\u6c34\u5370\uff0c\u56e0\u4e3a\u7f51\u7edc\u7b49\u5404\u79cd\u56e0\u7d20\u5f71\u54cd\u7740\u7ed3\u679c\u3002\u6c34\u5370\u8bbe\u7f6e\u8fc7\u5927\uff0c\u7b49\u5f85\u65f6\u95f4\u589e\u52a0\uff0c\u72b6\u6001\u53d8\u91cf\u589e\u5927\uff0c\u4f46\u7ed3\u679c\u66f4\u51c6\u786e\u3002\u6c34\u5370\u8bbe\u7f6e\u8fc7\u5c0f\uff0c\u7b49\u5f85\u65f6\u95f4\u7f29\u51cf\u4f46\u7ed3\u679c\u4e0d\u51c6\u786e\u3002"),(0,r.kt)("h2",{id:"\u5904\u7406\u51fd\u6570"},"\u5904\u7406\u51fd\u6570"),(0,r.kt)("p",null,"DataStream API\u63d0\u4f9b\u4e86\u6bd4\u8f6c\u6362\u51fd\u6570\u66f4\u5e95\u5c42\u7684\u5904\u7406\u51fd\u6570(Process Function)\uff0c\u5176\u529f\u80fd\u66f4\u52a0\u4e30\u5bcc\uff0c\u6bd4\u5982\u53ef\u4ee5\u8bbf\u95eetimestamp\u548c\u6c34\u5370\u3002Flink\u63d0\u4f9b\u7684\u5904\u7406\u51fd\u6570\u6709\uff1a"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"ProcessFunction"),(0,r.kt)("li",{parentName:"ul"},"KeyedProcessFunction"),(0,r.kt)("li",{parentName:"ul"},"CoProcessFunction"),(0,r.kt)("li",{parentName:"ul"},"ProcessJoinFunction"),(0,r.kt)("li",{parentName:"ul"},"BroadcastProcessFunction"),(0,r.kt)("li",{parentName:"ul"},"KeyedBroadcastProcessFunction"),(0,r.kt)("li",{parentName:"ul"},"ProcessWindowFunction")),(0,r.kt)("p",null,"\u7531\u4e8e\u8fd9\u4e9b\u63a5\u53e3\u7c7b\u4f3c\uff0c\u4ee5KeyedProcessFunction\u4e3a\u4f8b\u4ecb\u7ecd\uff0c\u8be5\u63a5\u53e3\u63d0\u4f9b\u5982\u4e0b\u65b9\u6cd5\uff1a"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"processElement(I value, Context ctx, Collector<O> out)"),"\uff1a\u5904\u7406\u6d41\u4e0a\u7684\u6bcf\u4e2a\u8bb0\u5f55value\uff0c\u5c06\u7ed3\u679c\u8f93\u51fa\u5230out\u3002Context\u5bf9\u8c61\u63d0\u4f9btimestamp\u548cTimerService\u3002"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("inlineCode",{parentName:"li"},"onTimer(long timestamp, OnTimerContext ctx, Collector<O> out)"),"\uff1a\u8bbe\u7f6e\u5b9a\u65f6\u5668\u7684\u56de\u8c03\u65b9\u6cd5\u3002")),(0,r.kt)("h3",{id:"timerservice\u548ctimer"},"TimerService\u548cTimer"),(0,r.kt)("p",null,"Context\u548cOnTimerContext\u90fd\u5305\u542bTimerService\u5bf9\u8c61\uff0c\u5b83\u63d0\u4f9b\u5982\u4e0b\u65b9\u6cd5\uff1a"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"long currentProcessingTime()"),"\uff1a\u8fd4\u56de\u5f53\u524d\u5904\u7406\u65f6\u95f4"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"long currentWatermark()"),"\uff1a\u8fd4\u56de\u5f53\u524d\u6c34\u5370"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"void registerProcessingTimeTimer(long time)"),"\uff1a\u6ce8\u518c\u4e00\u4e2a\u5904\u7406\u65f6\u95f4\u5b9a\u65f6\u5668"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"void registerEventTimeTimer(long time)"),"\uff1a\u6ce8\u518c\u4e00\u4e2a\u4e8b\u4ef6\u65f6\u95f4\u5b9a\u65f6\u5668"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"void deleteProcessingTimeTimer(long timestamp)"),"\uff1a\u5220\u9664\u4e00\u4e2a\u5904\u7406\u65f6\u95f4\u5b9a\u65f6\u5668\uff0c\u5982\u679c\u4e0d\u5b58\u5728\u5219\u4ec0\u4e48\u4e5f\u4e0d\u505a"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"void deleteEventTimeTimer(long timestamp)"),"\uff1a\u5220\u9664\u4e00\u4e2a\u4e8b\u4ef6\u65f6\u95f4\u5b9a\u65f6\u5668\uff0c\u5982\u679c\u4e0d\u5b58\u5728\u5219\u4ec0\u4e48\u4e5f\u4e0d\u505a")),(0,r.kt)("p",null,"\u5b9a\u65f6\u5668\u89e6\u53d1\u540e\u6267\u884c",(0,r.kt)("inlineCode",{parentName:"p"},"onTimer()"),"\u56de\u8c03\uff0c\u5b83\u548c",(0,r.kt)("inlineCode",{parentName:"p"},"processElement()"),"\u662f\u540c\u6b65\u7684\uff0c\u907f\u514d\u5e76\u53d1\u8bbf\u95ee\u72b6\u6001\u3002\u5b9a\u65f6\u5668\u4f1a\u548c\u5176\u4ed6\u72b6\u6001\u4e00\u8d77\u88ab\u68c0\u67e5\u70b9\u4fdd\u5b58\u3002"),(0,r.kt)("h3",{id:"\u53d1\u9001\u5230side-outputs"},"\u53d1\u9001\u5230Side Outputs"),(0,r.kt)("p",null,"\u901a\u5e38\u60c5\u51b5\u4e0bDataStream API\u4e2d\u7b97\u5b50\u53ea\u8f93\u51fa\u5355\u4e2a\u6d41\uff0c\u53ea\u6709split\u7b97\u5b50\u8f93\u51fa\u591a\u4e2a\u6d41(\u4e14\u57fa\u672c\u7c7b\u578b\u4e0d\u53d8)\u3002\u4f46\u5904\u7406\u51fd\u6570\u7279\u6b8a\u4e4b\u5904\u5728\u4e8e\u5b83\u4eec\u6709\u4fa7\u8f93\u51fa(Side Output)\uff0c\u5e76\u4e14\u57fa\u672c\u7c7b\u578b\u53ef\u53d8\uff0c\u5982\u4e0b\u6240\u793a\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java"},'DataStream<SensorReading> monitoredReadings = readings.process(new FreezingMonitor());\n// \u83b7\u53d6\u4fa7\u8f93\u51fa\u6d41\u5e76\u6253\u5370\nmonitorReadings.getSideOutput(new OutputTag<String>("freezing-alarms")).print();\n\npublic static class FreezingMonitor extends ProcessFunction<SensorReading, SensorReading> {\n    OutputTag<String> freezingAlarmOutput = new OutputTag<>("freezing-alarms");\n\n    @Override\n    public void processElement(SensorReading value, Context ctx, Collector<SensorReading> out) throws Exception {\n        if(value.temperature < 32.0) {\n            ctx.output(freezingAlarmOutput, "Freezing Alarm for " + value.id);\n        }\n        out.collect(value);\n    }\n}\n')),(0,r.kt)("p",null,"\u5728processElement\u65b9\u6cd5\u4e2d\u901a\u8fc7Context.output()\u53d1\u9001\u4fa7\u8f93\u51fa\u6570\u636e\uff0c\u4fa7\u8f93\u51fa\u7531OutputTag\u5bf9\u8c61\u6807\u8bb0\u8bc6\u522b\u3002"),(0,r.kt)("h3",{id:"coprocessfunction"},"CoProcessFunction"),(0,r.kt)("p",null,"\u5bf9\u4e8e\u5904\u74062\u4e2a\u6d41\u7684\u5e95\u5c42\u64cd\u4f5c\uff0cDataStream API\u63d0\u4f9bCoProcessFunction\u3002\u548cCoMapFunction\u7c7b\u4f3c\uff0c\u5b83\u63d0\u4f9bprocessElement1()\u548cprocessElement2()\u4e24\u4e2a\u65b9\u6cd5\u5206\u522b\u5904\u7406\u6bcf\u4e2a\u6d41\u7684\u8f93\u5165\u3002"),(0,r.kt)("h2",{id:"\u7a97\u53e3\u64cd\u4f5c"},"\u7a97\u53e3\u64cd\u4f5c"),(0,r.kt)("p",null,"\u7a97\u53e3\u64cd\u4f5c\u4f7f\u5f97\u5728\u65e0\u754c\u7684\u6d41\u4e0a\u8fdb\u884c\u805a\u5408\u51fd\u6570\u8ba1\u7b97\u79f0\u4e3a\u53ef\u80fd\uff0c\u672c\u8282\u4ecb\u7ecd\u5982\u4f55\u5b9a\u4e49\u7a97\u53e3\u7b97\u5b50\u3001\u5185\u7f6e\u7a97\u53e3\u7c7b\u578b\u3001\u7a97\u53e3\u53ef\u7528\u51fd\u6570\u548c\u5982\u4f55\u81ea\u5b9a\u4e49\u7a97\u53e3\u903b\u8f91\u3002"),(0,r.kt)("h3",{id:"\u5b9a\u4e49\u7a97\u53e3\u7b97\u5b50"},"\u5b9a\u4e49\u7a97\u53e3\u7b97\u5b50"),(0,r.kt)("p",null,"KeyedStream\u6216\u8005\u975eKeyedStream\u90fd\u53ef\u4ee5\u4f7f\u7528\u7a97\u53e3\u7b97\u5b50\uff0c\u521b\u5efa\u7a97\u53e3\u7b97\u5b50\u9700\u8981\u6307\u5b9a\u5982\u4e0b\u4e24\u4e2a\u7ec4\u4ef6\uff1a"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Window Assigner\uff1a\u51b3\u5b9a\u5143\u7d20\u5982\u4f55\u7ec4\u6210\u7a97\u53e3\uff0c\u5373\u751f\u6210WindowedStream\u6216\u8005AllWindowedStream(\u5728\u975eKeyedStream\u4e0a)\u3002")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Window Function\uff1a\u5904\u7406WindowedStream\u6216\u8005AllWindowedStream\u7684\u5143\u7d20"))),(0,r.kt)("p",null,"\u5982\u4e0b\u6240\u793a\u4e3a\u7a97\u53e3\u64cd\u4f5c\u548c\u7a97\u53e3\u51fd\u6570\u4f7f\u7528\u7684\u4f2a\u4ee3\u7801\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java"},"// define a keyed window operator\nstream\n  .keyBy(...)                 \n  .window(...)                   // specify the window assigner\n  .reduce/aggregate/process(...) // specify the window function\n\n// define a nonkeyed window-all operator\nstream\n  .windowAll(...)                // specify the window assigner\n  .reduce/aggregate/process(...) // specify the window function\n")),(0,r.kt)("h3",{id:"\u5185\u7f6ewindow-assigner"},"\u5185\u7f6eWindow Assigner"),(0,r.kt)("p",null,"Flink\u5185\u7f6e\u4e86\u8bb8\u591aWindow Assigner\u6ee1\u8db3\u4e0d\u540c\u4f7f\u7528\u573a\u666f\uff0c\u672c\u8282\u8ba8\u8bba\u57fa\u4e8e\u65f6\u95f4\u7684\u7a97\u53e3\u64cd\u4f5c(\u57fa\u4e8e\u8ba1\u6570\u7684\u7a97\u53e3\u64cd\u4f5c\u7ed3\u679c\u4e0d\u51c6\u786e)\u3002\u6bcf\u4e2a\u7a97\u53e3\u90fd\u6709\u4e00\u4e2a\u5f00\u59cb\u65f6\u95f4\u548c\u4e00\u4e2a\u7ed3\u675f\u65f6\u95f4\uff0c\u7a97\u53e3\u7684\u8303\u56f4\u662f",(0,r.kt)("strong",{parentName:"p"},"\u5de6\u95ed\u53f3\u5f00"),"\u3002\u4ee5\u4e0b\u4ecb\u7ecd\u5185\u7f6e\u7684\u5f00\u7a97\u7b97\u5b50\uff1a"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u6eda\u52a8\u7a97\u53e3")),(0,r.kt)("p",null,"\u6eda\u52a8\u7a97\u53e3\u7b97\u5b50\u5c06\u5143\u7d20\u5206\u4e3a\u56fa\u5b9a\u5927\u5c0f\uff0c\u4e92\u4e0d\u91cd\u53e0\u7684\u7a97\u53e3\uff0c\u5982\u4e0b\u56fe\u6240\u793a\uff1a"),(0,r.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap06/A-Tumbling-Window-Assigner-Example.png",title:"A Tumbling Window Assigner Example"}),(0,r.kt)("p",null,"\u5bf9\u4e8e\u4e8b\u4ef6\u65f6\u95f4\u8bed\u4e49\u548c\u5904\u7406\u65f6\u95f4\u8bed\u4e49\uff0cDataStream API\u5206\u522b\u63d0\u4f9bTumblingEventTimeWindows\u548cTumblingProcessingTimeWindows\u3002\u4f7f\u7528\u5176\u9759\u6001\u65b9\u6cd5",(0,r.kt)("inlineCode",{parentName:"p"},"of(Time size, Time offset)"),"\u6307\u5b9a\u7a97\u53e3\u5927\u5c0f\u548c\u504f\u79fb\u91cf\uff0c\u4ee3\u7801\u5982\u4e0b\u6240\u793a\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java"},"sensorData.keyBy(r -> r.id)\n          // timeWindow(Time.seconds(1))\u5df2\u8fc7\u65f6\uff0c\u5b83\u5b9e\u9645\u4e0a\u662f\u4e0b\u9762\u4ee3\u7801\u7684\u5c01\u88c5\n          .window(TumblingEventTimeWindows.of(Time.hours(1), Time.minutes(15)))\n          .process(new TemperatureAverager());\n")),(0,r.kt)("p",null,"\u6eda\u52a8\u7a97\u53e3\u9ed8\u8ba4\u548c1970-01-01 00:00:00\u5bf9\u9f50\uff0c\u4ee5\u4e0a\u793a\u4f8b\u4ee3\u7801\u5b9a\u4e49\u4e86[00:15:00-01:15:00)\uff0c[00:15:00-02:15:00)...\u7a97\u53e3\u3002"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u6ed1\u52a8\u7a97\u53e3")),(0,r.kt)("p",null,"\u6ed1\u52a8\u7a97\u53e3\u7b97\u5b50\u5c06\u5143\u7d20\u5206\u4e3a\u56fa\u5b9a\u5927\u5c0f\uff0c\u504f\u79fb\u6307\u5b9a\u5927\u5c0f\u7684\u7a97\u53e3\uff0c\u5982\u4e0b\u56fe\u6240\u793a\uff1a"),(0,r.kt)("img",{style:{width:"80%",height:"80%"},src:"/img/doc/Stream-Processing-with-Apache-Flink/chap06/A-Sliding-Window-Assigner-Example.png",title:"A Sliding Window Assigner Example"}),(0,r.kt)("p",null,"\u6eda\u52a8\u7a97\u53e3\u9700\u8981\u6307\u5b9a\u7a97\u53e3\u5927\u5c0fsize\u548c\u6ed1\u52a8\u6b65\u957fslide\u3002",(0,r.kt)("strong",{parentName:"p"},"\u5982\u679cslide\u5c0f\u4e8esize\uff0c\u90a3\u4e48\u4f1a\u6709\u4e00\u4e9b\u5143\u7d20\u5c5e\u4e8e\u4e24\u4e2a\u7a97\u53e3\uff0c\u5982\u679cslide\u5927\u4e8esize\uff0c\u90a3\u4e48\u4f1a\u6709\u4e00\u4e9b\u5143\u7d20\u6ca1\u6709\u5305\u542b\u5728\u7a97\u53e3\u4e2d\u3002"),"\u5982\u4e0b\u4ee3\u7801\u6f14\u793a\u5927\u5c0f\u4e3a1\u4e2a\u5c0f\u65f6\uff0c\u6b65\u957f\u4e3a15\u5206\u949f\u7684\u6ed1\u52a8\u7a97\u53e3\u64cd\u4f5c\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-java"},"sensorData.keyBy(r -> r.id)\n          .window(SlidingEventTimeWindows.of(Time.hours(1), Time.minutes(15)))\n          .process(new TemperatureAverager());\n")))}d.isMDXComponent=!0}}]);