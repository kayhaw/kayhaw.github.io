"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[6582],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return k}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),c=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),m=c(n),k=r,d=m["".concat(s,".").concat(k)]||m[k]||u[k]||l;return n?a.createElement(d,i(i({ref:t},p),{},{components:n})):a.createElement(d,i({ref:t},p))}));function k(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,i=new Array(l);i[0]=m;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var c=2;c<l;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},9695:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return o},contentTitle:function(){return s},metadata:function(){return c},toc:function(){return p},default:function(){return m}});var a=n(7462),r=n(3366),l=(n(7294),n(3905)),i=["components"],o={layout:"article",title:"Actors and Concurrency",permalink:"/learning-akka/chap02",tags:["Akka","ReadingNotes"]},s=void 0,c={unversionedId:"Learning Akka/LearningAkka-Chap02",id:"Learning Akka/LearningAkka-Chap02",isDocsHomePage:!1,title:"Actors and Concurrency",description:"\u300aLearning Akka\u300b\u7b2c\u4e8c\u7ae0\u8bfb\u4e66\u7b14\u8bb0",source:"@site/docs/Learning Akka/LearningAkka-Chap02.md",sourceDirName:"Learning Akka",slug:"/Learning Akka/LearningAkka-Chap02",permalink:"/docs/Learning Akka/LearningAkka-Chap02",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/docs/Learning Akka/LearningAkka-Chap02.md",tags:[{label:"Akka",permalink:"/docs/tags/akka"},{label:"ReadingNotes",permalink:"/docs/tags/reading-notes"}],version:"current",frontMatter:{layout:"article",title:"Actors and Concurrency",permalink:"/learning-akka/chap02",tags:["Akka","ReadingNotes"]},sidebar:"tutorialSidebar",previous:{title:"Starting Life as an Actor",permalink:"/docs/Learning Akka/LearningAkka-Chap01"},next:{title:"Getting the Message Across",permalink:"/docs/Learning Akka/LearningAkka-Chap03"}},p=[{value:"Reactive\u7cfb\u7edf\u8bbe\u8ba1",id:"reactive\u7cfb\u7edf\u8bbe\u8ba1",children:[]},{value:"Actor\u5256\u6790",id:"actor\u5256\u6790",children:[]},{value:"\u521b\u5efaActor",id:"\u521b\u5efaactor",children:[]},{value:"Promises, Futures\u548c\u4e8b\u4ef6\u9a71\u52a8\u7f16\u7a0b\u6a21\u578b",id:"promises-futures\u548c\u4e8b\u4ef6\u9a71\u52a8\u7f16\u7a0b\u6a21\u578b",children:[{value:"\u963b\u585evs\u4e8b\u4ef6\u9a71\u52a8",id:"\u963b\u585evs\u4e8b\u4ef6\u9a71\u52a8",children:[]},{value:"\u4f7f\u7528Future\u83b7\u53d6Actor Response",id:"\u4f7f\u7528future\u83b7\u53d6actor-response",children:[]},{value:"\u7406\u89e3Futures\u548cPromises",id:"\u7406\u89e3futures\u548cpromises",children:[]},{value:"\u5206\u89e3\u5206\u5e03\u5f0f\u7cfb\u7edf",id:"\u5206\u89e3\u5206\u5e03\u5f0f\u7cfb\u7edf",children:[]}]},{value:"\u51c6\u5907DB\u548cMessage\u7c7b",id:"\u51c6\u5907db\u548cmessage\u7c7b",children:[]},{value:"\u542f\u52a8\u8fdc\u7a0b\u529f\u80fd",id:"\u542f\u52a8\u8fdc\u7a0b\u529f\u80fd",children:[]},{value:"\u521b\u5efa\u5ba2\u6237\u7aef",id:"\u521b\u5efa\u5ba2\u6237\u7aef",children:[{value:"client\u4ee3\u7801",id:"client\u4ee3\u7801",children:[]},{value:"\u6d4b\u8bd5\u4ee3\u7801",id:"\u6d4b\u8bd5\u4ee3\u7801",children:[]}]},{value:"\u603b\u7ed3\u8981\u70b9",id:"\u603b\u7ed3\u8981\u70b9",children:[]}],u={toc:p};function m(e){var t=e.components,n=(0,r.Z)(e,i);return(0,l.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("p",{parentName:"div"},"\u300aLearning Akka\u300b\u7b2c\u4e8c\u7ae0\u8bfb\u4e66\u7b14\u8bb0"))),(0,l.kt)("h2",{id:"reactive\u7cfb\u7edf\u8bbe\u8ba1"},"Reactive\u7cfb\u7edf\u8bbe\u8ba1"),(0,l.kt)("p",null,"\u5173\u4e8eAkka\u7684\u4e66\u7c4d\u4e00\u5b9a\u4f1a\u63d0\u5230\u672f\u8bed",(0,l.kt)("strong",{parentName:"p"},"Reactive(\u54cd\u5e94\u5f0f)"),"\uff0c\u8fd9\u4e2a\u8bcd\u56e0\u4e3a",(0,l.kt)("a",{parentName:"p",href:"https://www.reactivemanifesto.org/"},"Reactive Manifesto(\u54cd\u5e94\u5f0f\u5ba3\u8a00)"),"\u800c\u53d8\u5f97\u8d8a\u6765\u8d8a\u6d41\u884c\u3002\u54cd\u5e94\u5f0f\u5ba3\u8a00\u662f\u4e00\u4efd\u8bd5\u56fe\u63d0\u70bc\u51faweb\u5e94\u7528\u7a0b\u5e8f\u5728\u6ee1\u8db3\u7528\u6237\u9700\u6c42\u7684\u540c\u65f6\u6210\u529f\u53d1\u5c55\u6240\u9700\u8981\u7684\u54c1\u8d28\u7684\u6587\u6863\uff0c\u5b83\u4e3a\u54cd\u5e94\u5f0f\u7cfb\u7edf\u5b9a\u4e49\u4e864\u70b9\u539f\u5219\uff1a"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"Responsive(\u654f\u6377\u7684)\uff1a\u5e94\u7528\u9700\u8981\u5bf9\u8bf7\u6c42\u505a\u51fa\u5feb\u901f\u53cd\u5e94"),(0,l.kt)("li",{parentName:"ol"},"Elastic(\u7075\u6d3b\u7684)\uff1a\u5e94\u7528\u80fd\u591f\u5728\u4e0d\u540c\u8d1f\u8f7d\u4e0b\u6269\u5c55"),(0,l.kt)("li",{parentName:"ol"},"Resilient(\u6709\u97e7\u6027\u7684)\uff1a\u5e94\u7528\u5728\u9047\u5230\u9519\u8bef\u65f6\u80fd\u591f\u4f18\u96c5\u5730\u5904\u7406"),(0,l.kt)("li",{parentName:"ol"},"Message Driven(\u6d88\u606f\u9a71\u52a8)\uff1a\u901a\u8fc7\u5f02\u540c\u7684\u6d88\u606f\u9a71\u52a8\u7cfb\u7edf\u5229\u7528\u8d44\u6e90\uff0c\u6ee1\u8db3\u524d3\u70b9")),(0,l.kt)("h2",{id:"actor\u5256\u6790"},"Actor\u5256\u6790"),(0,l.kt)("p",null,'\u4ee5\u4e00\u4e2aJavas\u5b9e\u73b0\u7684Actor\u4e3a\u4f8b\uff0c\u5b83\u63a5\u6536"Ping"\u5b57\u7b26\u4e32\u540e\u8fd4\u56de"Pong"\uff1a'),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},'public class PongActor extends AbstractActor {\n    public PartialFunction receive() {\n        return ReceiveBuilder.matchEquals("Ping", s->{\n            sender().tell("Pong", ActorRef.noSender());\n        }).matchAny(x -> {\n            sender().tell(new Status.Failure(new Exception("unknown message")), self());\n        }).build();\n    }\n}\n')),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"PongActor\u7ee7\u627f\u81eaAbstractActor\uff0c\u8868\u793a\u5b83\u662f\u4e00\u79cdActor"),(0,l.kt)("li",{parentName:"ol"},"AbstractActor\u7684receive\u65b9\u6cd5\u5fc5\u987b\u88ab\u91cd\u5199\u6216\u8005\u5728\u6784\u9020\u5668\u4e2d\u8c03\u7528\uff0c\u8fd4\u56de\u4e00\u4e2aPartialFunction\u5bf9\u8c61"),(0,l.kt)("li",{parentName:"ol"},"\u7531\u4e8ePartialFunction\u4f7f\u7528Scala\u7f16\u5199\u5b9a\u4e49\uff0cAkka\u4f7f\u7528Builder\u8bbe\u8ba1\u6a21\u5f0f\u901a\u8fc7ReceiverBuilder\u7c7b\u6765\u521b\u5efaPartialFunction\u5bf9\u8c61"),(0,l.kt)("li",{parentName:"ol"},"\u901a\u8fc7ReceiverBuilder\u7c7b\u63d0\u4f9b\u5404\u79cdmatch\u65b9\u6cd5\u5bf9\u6d88\u606f\u8fdb\u884c\u5339\u914d\u5904\u7406\uff0c\u6700\u540e\u8c03\u7528build\u65b9\u6cd5\u751f\u6210PartialFunction\u5bf9\u8c61"),(0,l.kt)("li",{parentName:"ol"},"\u901a\u8fc7\u8c03\u7528sender()\u65b9\u6cd5\u5f97\u5230ActorRef\u5bf9\u8c61\uff0c\u5b83\u53ef\u80fd\u662f\u53d1\u9001\u6d88\u606f\u7684\u53e6\u4e00\u4e2aActor\u6216\u8005Actor System"),(0,l.kt)("li",{parentName:"ol"},"\u901a\u8fc7ActorRef\u7684tell()\u65b9\u6cd5\u56de\u590d\u6d88\u606f\uff0c\u7b2c\u4e00\u4e2a\u53c2\u6570\u662f\u6d88\u606f\uff0c\u7b2c\u4e8c\u4e2a\u53c2\u6570\u662f\u56de\u590d\u6d88\u606f\u7684Actor\uff0c\u901a\u8fc7",(0,l.kt)("inlineCode",{parentName:"li"},"ActorRef.noSender()"),"\u544a\u8bc9\u5bf9\u65b9\u4e0d\u9700\u8981\u56de\u6d88\u606f"),(0,l.kt)("li",{parentName:"ol"},"\u5f53\u5904\u7406\u5f02\u5e38\u65f6\uff0c\u8fd4\u56de\u4e00\u4e2aStatus.Failure\u6d88\u606f\uff0c\u6b64\u65f6\u4f1a\u89e6\u53d1supervisor\u673a\u5236")),(0,l.kt)("h2",{id:"\u521b\u5efaactor"},"\u521b\u5efaActor"),(0,l.kt)("p",null,"\u548c\u666e\u901a\u5bf9\u8c61\u4e0d\u540c\uff0c\u4f60\u6c38\u8fdc\u4e0d\u80fd\u5f97\u5230actor\u5b9e\u4f8b\u5bf9\u8c61\uff0c\u4e5f\u4e0d\u80fd\u901a\u8fc7\u5bf9\u8c61\u65b9\u6cd5\u76f4\u63a5\u6216\u8005\u95f4\u63a5\u5730\u6539\u53d8\u72b6\u6001\uff0c\u5b83\u53ea\u80fd\u901a\u8fc7\u6d88\u606f\u9a71\u52a8\u3002\u5982\u679c\u53ea\u901a\u8fc7\u6d88\u606f\u901a\u4fe1\uff0c\u6ca1\u6709\u5fc5\u8981\u83b7\u53d6actor\u5b9e\u4f8b\uff0c\u53ea\u9700\u8981\u4e00\u5957\u53d1\u9001\u6d88\u606f\u548c\u83b7\u53d6\u6d88\u606f\u7684\u673a\u5236\uff0c\u5728Akka\u4e2d\uff0c\u901a\u8fc7\u5bf9actor\u7684\u5f15\u7528\u7c7bActorRef\u5b9e\u73b0\u3002\u4ee5\u4e0b\u4ee3\u7801\u521b\u5efa\u4e00\u4e2aactor\u5bf9\u8c61\u5e76\u8fd4\u56de\u5176\u5f15\u7528\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},"ActorRef actor = actorSystem.actorOf(Props.create(PongActor.class));\n")),(0,l.kt)("p",null,"\u4f7f\u7528Props.create(Class class, arg1, arg2)\u751f\u6210Props\u5b9e\u4f8b\uff0c\u786e\u4fddPongActor\u5bf9\u8c61\u88ab\u5c01\u88c5\u4e0d\u53ef\u8bbf\u95ee\u3002\u5982\u679c\u9700\u8981\u6784\u9020\u53c2\u6570\uff0c\u63a8\u8350\u4f7f\u7528\u5de5\u5382\u65b9\u6cd5\u751f\u6210Props\u5b9e\u4f8b\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},'public static Props props(String response) {\n  return Props.create(this.class, response);\n}\nActorRef actor = actorSystem.actorOf(PongActor.props("PongFoo"));\n')),(0,l.kt)("p",null,"\u53e6\u4e00\u79cd\u83b7\u53d6actor\u5f15\u7528\u7684\u65b9\u6cd5\u65f6actorSelection\uff0c\u901a\u8fc7url\u83b7\u53d6\u672c\u5730\u6216\u8005\u8fdc\u7a0bactor\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},'ActorSelection selection = system.actorSelection("akka.tcp://actorSystem@kayhaw.github.io:5678/user/kayhaw");\n')),(0,l.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"\u603b\u7ed3")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("ol",{parentName:"div"},(0,l.kt)("li",{parentName:"ol"},"\u901a\u8fc7system.actorOf(Props.create(...))\u521b\u5efaactor\u5b9e\u4f8b\u5e76\u83b7\u53d6\u5305\u88c5\u5f15\u7528"),(0,l.kt)("li",{parentName:"ol"},"\u901a\u8fc7system.actorSelection(String url)\u83b7\u53d6\u7cfb\u7edf\u4e2d\u5df2\u6709\u7684actor\u5b9e\u4f8b\u5305\u88c5\u5f15\u7528")))),(0,l.kt)("h2",{id:"promises-futures\u548c\u4e8b\u4ef6\u9a71\u52a8\u7f16\u7a0b\u6a21\u578b"},"Promises, Futures\u548c\u4e8b\u4ef6\u9a71\u52a8\u7f16\u7a0b\u6a21\u578b"),(0,l.kt)("p",null,"\u5728Chap 1\u4e2d\u7684actor\u63a5\u6536\u6d88\u606f\u5e76\u4fdd\u5b58\u952e\u503c\u5bf9\uff0c\u90a3\u5982\u679c\u8981\u4ece\u63a5\u6536actor\u83b7\u53d6\u4e00\u4e9b\u8fd4\u56de\u503c\u5462\uff1f\u6bd4\u5982\u8bf4\u4eceAkkademyDb Actor\u4e2d\u83b7\u53d6\u4e00\u4e2a\u952e\u503c\u5bf9\u3002"),(0,l.kt)("h3",{id:"\u963b\u585evs\u4e8b\u4ef6\u9a71\u52a8"},"\u963b\u585evs\u4e8b\u4ef6\u9a71\u52a8"),(0,l.kt)("p",null,"\u4ee5\u4e0b\u9762\u4e00\u6bb5jdbc\u4ee3\u7801\u4e3a\u4f8b\uff0c\u6267\u884cexecuteQuery\u65b9\u6cd5\u662f\u963b\u585e\u5f0f\u7684\uff0c\u5fc5\u987b\u7b49\u5230\u6570\u636e\u5e93\u54cd\u5e94\u7ed3\u679c(",(0,l.kt)("strong",{parentName:"p"},"\u5ef6\u8fdf"),")\uff0c\u4ee3\u7801\u624d\u80fd\u7ee7\u7eed\u5f80\u4e0b\u6267\u884c\uff0c\u8fd9\u8fd8\u6ca1\u8003\u8651\u56e0\u4e3a\u7f51\u7edc\u5f02\u5e38\u7b49\u5bfc\u81f4\u6267\u884c\u5931\u8d25\u7684\u60c5\u51b5(",(0,l.kt)("strong",{parentName:"p"},"\u5bb9\u9519"),")\u3002\u5bf9\u4e8e\u4e00\u4e2aweb\u5e94\u7528\uff0c\u53ef\u80fd\u51fa\u73b0\u7ebf\u7a0b\u6c60\u88ab\u6d88\u8d39\u5927\u91cf\u7ebf\u7a0b\u4f46\u662f\u90fd\u5728\u963b\u585e\u72b6\u6001\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},'stmt = conn.createStatement();\nString sql = "select name from users where id=\'123\'";\nResultSet rs = stmt.executeQuery(sql);\nrs.next();\nString name  = rs.getString("name");\n')),(0,l.kt)("p",null,"\u603b\u7ed3\u8d77\u6765\u963b\u585e\u5f0fIO\u7684\u7f3a\u70b9\uff1a"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u4ee3\u7801\u6ca1\u6709\u5728\u8fd4\u56de\u7c7b\u578b\u4e2d\u660e\u663e\u8868\u8fbe\u9519\u8bef"),(0,l.kt)("li",{parentName:"ol"},"\u4ee3\u7801\u6ca1\u6709\u5728\u8fd4\u56de\u7c7b\u578b\u4e2d\u660e\u663e\u8868\u8fbe\u5ef6\u8fdf"),(0,l.kt)("li",{parentName:"ol"},"\u7531\u4e8e\u7ebf\u7a0b\u6c60\u5927\u5c0f\u9650\u5236\u4e86\u541e\u5410\u91cf"),(0,l.kt)("li",{parentName:"ol"},"\u8fc7\u591a\u4f7f\u7528\u7ebf\u7a0b\u4f1a\u7531\u4e8e\u4e0a\u4e0b\u6587\u5207\u6362\u6765\u5e26\u8d1f\u8f7d")),(0,l.kt)("p",null,"\u975e\u963b\u585e\u5f0fIO\u6d41\u7a0b\u5982\u4e0b\u6240\u793a\uff0c\u65b9\u6cd5\u8c03\u7528\u8fd4\u56deFuture\u5bf9\u8c61\uff0c\u91cc\u9762\u6ca1\u6709\u8fd4\u56de\u503c\uff0c\u800c\u662f\u6ce8\u518c\u4e00\u4e2a\u56de\u8c03\u65b9\u6cd5\uff0c\u5f53\u65b9\u6cd5\u8c03\u7528\u5b8c\u6210\u540e\u6fc0\u6d3b\u8c03\u7528\u8be5\u56de\u8c03\u65b9\u6cd5\u3002"),(0,l.kt)("p",null,"\u975e\u963b\u585e\u5f0fIO\u7f3a\u70b9\uff1a\u4e0d\u80fd\u83b7\u5f97\u8be6\u7ec6\u7684\u5806\u6808\u6253\u5370\u4fe1\u606f"),(0,l.kt)("h3",{id:"\u4f7f\u7528future\u83b7\u53d6actor-response"},"\u4f7f\u7528Future\u83b7\u53d6Actor Response"),(0,l.kt)("p",null,"\u8fd9\u91cc\u4f7f\u7528Java8 API\u63d0\u4f9b\u7684Future\u63a5\u6536Actor\u54cd\u5e94\uff0c\u4f46Akka\u8fd4\u56deScala\u5b9a\u4e49\u7684Future\u63a5\u53e3\uff0c\u4e3a\u6b64\u9700\u8981\u6dfb\u52a0\u5982\u4e0b\u4f9d\u8d56\u8fdb\u884c\u8f6c\u6362\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-xml"},"<dependency>\n    <groupId>org.scala-lang.modules</groupId>\n    <artifactId>scala-java8-compat_2.11</artifactId>\n    <version>0.6.0</version>\n</dependency>\n")),(0,l.kt)("p",null,"\u5b9e\u73b0\u4ee3\u7801\u5982\u4e0b\u6240\u793a\uff0c\u5206\u522b\u6d4b\u8bd5\u8fd4\u56de\u6210\u529f\u548c\u5931\u8d25\u7684\u60c5\u51b5\u3002\u4f7f\u7528",(0,l.kt)("inlineCode",{parentName:"p"},"Patterns.ask()"),"\u65b9\u6cd5\u53d1\u9001\u6d88\u606f\u5e76\u8bbe\u7f6e\u54cd\u5e94\u8d85\u65f6\u65f6\u95f4\u4e3a1000ms\uff0c\u8be5\u65b9\u6cd5\u8fd4\u56deFuture\u5bf9\u8c61\uff0c\u4f7f\u7528toJava\u65b9\u6cd5\u5c06\u5176\u8f6c\u4e3aJava API\u65b9\u6cd5\uff0c\u7136\u540e\u8c03\u7528get\u65b9\u6cd5\u83b7\u53d6\u7ed3\u679c\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},'public class PongActorTest {\n    ActorSystem system = ActorSystem.create();\n    ActorRef actorRef = system.actorOf(Props.create(PongActor.class));\n\n    @Test\n    public void shouldReplyToPingWithPong() throws Exception {\n        Future sFuture = Patterns.ask(actorRef, "Ping", 1000);\n        // \u628aScala\u7248Future\u8f6c\u4e3aJava\u7248\u7684\n        final CompletionStage<String> cs = FutureConverters.toJava(sFuture);\n        final CompletableFuture<String> jFuture = (CompletableFuture<String>) cs;\n        // get\u65b9\u6cd5\u7684\u8d85\u65f6\u65f6\u95f4\u597d\u50cf\u591a\u4f59\u4e86\uff1f\n        assert(jFuture.get(1000, TimeUnit.MILLISECONDS).equals("Pong"));\n    }\n\n    @Test\n    public void shouldReplyToUnknownMsgWithFailure() throws Exception {\n        Future sFuture = Patterns.ask(actorRef, "KayHaw", 1000);\n        final CompletionStage<String> cs = FutureConverters.toJava(sFuture);\n        final CompletableFuture<String> jFuture = (CompletableFuture<String>) cs;\n        jFuture.get(1000, TimeUnit.MILLISECONDS);\n    }\n}\n')),(0,l.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"tell\u548cask\u533a\u522b")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("ul",{parentName:"div"},(0,l.kt)("li",{parentName:"ul"},"ask\uff1a\u5f02\u6b65api\uff0c\u8fd4\u56de\u4e00\u4e2a\u6d88\u606f"),(0,l.kt)("li",{parentName:"ul"},"tell\uff1a\u4e0d\u8fd4\u56de\u6d88\u606f")))),(0,l.kt)("h3",{id:"\u7406\u89e3futures\u548cpromises"},"\u7406\u89e3Futures\u548cPromises"),(0,l.kt)("p",null,"\u5f02\u6b65\u8c03\u7528ask\u4ee5Future\u7c7b\u5f62\u5f0f\u8fd4\u56de\u4f5c\u4e3a\u7ed3\u679c\u5360\u4f4d\u7b26\uff0c\u5982\u4e0b\u6240\u793a\u4ee3\u7801\u3002askPong\u65b9\u6cd5\u8fd4\u56de\u4e00\u4e2a",(0,l.kt)("inlineCode",{parentName:"p"},"Future<T>"),"\uff0c\u5b83\u8981\u4e48\u5305\u542b\u7c7b\u578b\u4e3aT\u7684\u7684\u7ed3\u679c\u6216\u8005\u7c7b\u578b\u4e3aThrowable\u7684\u9519\u8bef\u3002\u4f7f\u7528thenAccept\u65b9\u6cd5\u6267\u884c\u4e00\u4e2aConsumer\u56de\u8c03\uff0c\u8868\u793a\u5bf9\u8fd4\u56de\u6d88\u606f\u8fdb\u884c\u6d88\u8d39\u5904\u7406(\u6253\u5370)\uff0c\u82e5\u8981\u4ea7\u751f\u8f6c\u6362\u6d88\u606f\u751f\u6210\u65b0\u6d88\u606f\u4f7f\u7528thenApply\u65b9\u6cd5\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},'public CompletionStage<String> askPong(String message) {\n    Future sFuture = Patterns.ask(actorRef, "Ping", 1000);\n    return FutureConverters.toJava(sFuture);\n}\n\n@Test\npublic void printToConsole() throws Exception {\n    // thenAccept\u63a5\u6536Consumer\u63a5\u53e3\uff0c\u6d88\u8d39\u6d88\u606f\u4f46\u662f\u6ca1\u6709\u8fd4\u56de\u503c\n    askPong("Ping").thenAccept(x -> System.out.println("Replied with" + x));\n    // thenApply\u63a5\u6536Function\u63a5\u53e3\uff0c\u6d88\u8d39\u6d88\u606f\u5e76\u4e14\u4ea7\u751f\u65b0\u6d88\u606f\n    askPong("Ping").thenApply(x -> x.charAt(0));\n    // \u5d4c\u5957\u5f02\u6b65\u56de\u8c03\n    CompletionStage<CompletionStage<String>> futureFuture = askPong("Ping").thenApply(x -> askPong(x));\n    // \u5d4c\u5957\u5f02\u6b65\u56de\u8c03\u7b80\u5316\u5199\u6cd5\n    CompletionStage<String> cs = askPong("Ping").thenCompose(x -> askPong(x));\n    Thread.sleep(1000);\n}\n')),(0,l.kt)("p",null,"\u53ef\u4ee5\u770b\u5230\u5f02\u6b65\u8c03\u7528\u4e2d\u8fd8\u53ef\u4ee5\u5d4c\u5957\u6267\u884c\u53e6\u4e00\u4e2a\u5f02\u6b65\u56de\u8c03\uff0c\u5e76\u4e14\u53ef\u4ee5\u4f7f\u7528thenCompose\u65b9\u6cd5\u7b80\u5316\u5199\u6cd5\uff0c\u5f62\u6210\u8c03\u7528\u94fe\u3002\u5982\u679c\u4e0d\u5e78\u7684\u8bdd\uff0c\u8c03\u7528\u94fe\u5176\u4e2d\u4e00\u4e2aaskPong\u65b9\u6cd5\u8fd4\u56de\u5f02\u5e38\u5462\uff1f\u4f7f\u7528handle\u65b9\u6cd5\u6765\u5904\u7406\u6b63\u786e\u6216\u5f02\u5e38\u4e24\u60c5\u51b5\uff0c\u4f7f\u7528exceptionally\u65b9\u6cd5\u5355\u72ec\u5904\u7406\u5f02\u5e38\u3002Future\u8c03\u7528\u94fe\u53ef\u4ee5\u5c06\u5f02\u5e38\u5904\u7406\u653e\u5728\u672b\u5c3e\u5904\u7406\uff0c\u4ee3\u7801\u5982\u4e0b\u6240\u793a\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},'@Test\npublic void handleException() {\n    askPong("Error Msg").handle((x, t) -> {\n        if(t != null) {\n            log.error("Error: {}", t);\n        }\n        return null;\n    });\n\n    // \u540c\u6b65\u5904\u7406\u5f02\u5e38\n    CompletionStage<String> cs = askPong("Error Msg").exceptionally(t -> "default");\n    // \u5f02\u6b65\u5904\u7406\u5f02\u5e38\n    askPong("Error Msg").handle((x, t) -> t == null ? CompletableFuture.completedFuture(x) : askPong("Ping")).thenCompose(x -> x);\n    // \u8c03\u7528\u94fe\n    askPong("Ping").thenCompose(x -> askPong("Ping"+x)).handle(\n        (x, t) -> t != null ? "default" : x\n    );\n}\n')),(0,l.kt)("p",null,"\u6b64\u5916\u4f60\u8fd8\u53ef\u4ee5\u4f7f\u7528thenCombine\u65b9\u6cd5\u83b7\u53d6\u4e24\u4e2aFuture\u7684\u7ed3\u679c\uff0cScala\u8fd8\u63d0\u4f9b\u4e86sequence\u65b9\u6cd5\u7528\u4e8e\u5c06",(0,l.kt)("inlineCode",{parentName:"p"},"Future"),"\u5217\u8868\u7ed3\u679c\u8f6c\u4e3a\u5355\u4e2a\u7684",(0,l.kt)("inlineCode",{parentName:"p"},"Future<List<T>>"),"\uff0c\u4f46Java\u672a\u76f4\u63a5\u63d0\u4f9b\u7b49\u6548API\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},'askPong("Ping").thenCombine(askPong("Ping"), (a, b) -> a+b);\n')),(0,l.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"Future API\u5bf9\u7167\u8868")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("table",{parentName:"div"},(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"\u64cd\u4f5c"),(0,l.kt)("th",{parentName:"tr",align:null},"Scala Future API"),(0,l.kt)("th",{parentName:"tr",align:null},"Java Scala API"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"\u8f6c\u5316\u7ed3\u679c"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},".map(x=>y)")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},".thenApply(x->y)"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"\u5f02\u6b65\u5904\u7406\u7ed3\u679c"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},".flatMap(x=>futureOfY)")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},".thenApply(x->futureOfY)"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"\u5904\u7406\u5f02\u5e38"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},".recover(t=>y)")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},".exceptionally(t->y)"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"\u5f02\u6b65\u5904\u7406\u5f02\u5e38"),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},".recoverWith(t=>futureOfY)")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},".handle(t,x->futureOfY).thenCompose(x->x)"))))))),(0,l.kt)("h3",{id:"\u5206\u89e3\u5206\u5e03\u5f0f\u7cfb\u7edf"},"\u5206\u89e3\u5206\u5e03\u5f0f\u7cfb\u7edf"),(0,l.kt)("p",null,"\u4eceFuture API\u77e5\u8bc6\u4e2d\u56de\u6765\uff0c\u524d\u6587\u63d0\u5230\u8981\u6784\u5efa\u4e00\u4e2a\u5206\u5e03\u5f0f\u6570\u636e\u5e93\u7cfb\u7edf\uff0c\u4e3a\u6b64\u5206\u522b\u8981\u521b\u5efa\u4e00\u4e2a\u5ba2\u6237\u7aef\u5de5\u7a0b\u548c\u670d\u52a1\u7aef\u5de5\u7a0b\u3002\u4e3a\u4e86\u8ba9\u5ba2\u6237\u7aef\u548c\u670d\u52a1\u7aef\u4e4b\u95f4\u4f7f\u7528message\u901a\u4fe1\uff0c\u9700\u8981\u5728\u4e24\u4e2a\u5de5\u7a0b\u4e4b\u95f4\u5171\u4eabmessage\u7c7b\uff0c\u4e3a\u4e86\u8ba9\u5de5\u7a0b\u4ee3\u7801\u66f4\u5c0f\uff0c\u8fd9\u91cc\u5c06message\u7c7b\u653e\u5728\u670d\u52a1\u7aef\u5de5\u7a0b\u4e2d\u5e76\u5c06\u5176\u5bfc\u5165\u5230\u5ba2\u6237\u7aef\u5de5\u7a0b\u4e2d\u3002"),(0,l.kt)("h2",{id:"\u51c6\u5907db\u548cmessage\u7c7b"},"\u51c6\u5907DB\u548cMessage\u7c7b"),(0,l.kt)("p",null,"\u9996\u5148\u5bf9\u5e94\u5206\u5e03\u5f0fDB\uff0c\u5b9a\u4e49\u5982\u4e0b\u6d88\u606f\uff1a"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\u83b7\u53d6\u6d88\u606f\uff1a\u5f53key\u5b58\u5728\u65f6\u8fd4\u56de\u503c"),(0,l.kt)("li",{parentName:"ul"},"key\u4e0d\u5b58\u5728\u5f02\u5e38\uff1a\u5f53key\u4e0d\u5b58\u5728\u65f6\u8fd4\u56de\u8be5\u6d88\u606f"),(0,l.kt)("li",{parentName:"ul"},"\u8bbe\u7f6e\u6d88\u606f\uff1a\u5c06key\u8bbe\u7f6e\u4e3a\u6307\u5b9a\u503c\u5e76\u8fd4\u56de\u54cd\u5e94\u72b6\u6001")),(0,l.kt)("p",null,"\u4ee3\u7801\u5982\u4e0b\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},"public class GetRequest implements Serializable {\n    public final String key;\n    public GetRequest(String key) {\n        this.key = key;\n    }\n}\n\npublic class KeyNotFoundException extends Exception implements Serializable {\n    public final String key;\n    public KeyNotFoundException(String key) {\n        this.key = key;\n    }\n}\n")),(0,l.kt)("p",null,"\u65b0\u7684receive\u65b9\u6cd5\u548c\u5165\u53e3\u65b9\u6cd5\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java",metastring:"title=AkkademyDb.java",title:"AkkademyDb.java"},'private AkkademyDb() {\n    receive(\n        // \u5339\u914dSet\u6d88\u606f\n        ReceiveBuilder.match(SetRequest.class, msg -> {\n            log.info("Received Set request: {}", msg);\n            map.put(msg.key, msg.value);\n            sender().tell(new Status.Success(msg.key), self());\n        })\n        // \u5339\u914dGet\u6d88\u606f\n        .match(GetRequest.class, msg -> {\n            log.info("Received Get request: {}", msg);\n            Object value = map.get(msg.key);\n            Object response = (value != null) ? value : new Status.Failure(new KeyNotFoundException(msg.key));\n            sender().tell(response, self());\n            sender().tell(new Status.Success(msg.key), self());\n        })\n        // \u6d88\u606f\u4e0d\u5339\u914d\n        .matchAny(o -> {\n            sender().tell(new Status.Failure(new ClassNotFoundException()), self());\n        })\n        .build());\n}\n')),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java",metastring:"title=Main.java",title:"Main.java"},'public class Main {\n    public static void main(String[] args) {\n        // akkademy\u662f\u5f53\u524d\u670d\u52a1\u7aefActor System\u540d\u79f0\uff0cclient\u8fde\u63a5\u65f6\u9700\u8981\u7528\u5230\n        ActorSystem system = ActorSystem.create("akkademy");\n        // akkademy-db\u662f\u5f53\u524d\u670d\u52a1\u7aefActor\u540d\u79f0\n        system.actorOf(Props.create(AkkademyDb.class), "akkademy-db");\n    }\n}\n')),(0,l.kt)("h2",{id:"\u542f\u52a8\u8fdc\u7a0b\u529f\u80fd"},"\u542f\u52a8\u8fdc\u7a0b\u529f\u80fd"),(0,l.kt)("p",null,"\u4e3a\u4e86\u4f7f\u8fdc\u7a0b\u8282\u70b9\u95f4\u4ea4\u6362\u6d88\u606f\uff0c\u5f15\u5165\u5982\u4e0b\u4f9d\u8d56\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-xml"},"<dependency>\n    <groupId>com.typesafe.akka</groupId>\n    <artifactId>akka-remote_2.11</artifactId>\n    <version>2.3.6</version>\n</dependency>\n")),(0,l.kt)("p",null,"\u5728resource\u6587\u4ef6\u5939\u4e0b\u6dfb\u52a0\u914d\u7f6e\u6587\u4ef6application.conf\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-hocon"},'akka {\n  actor {\n    provider = "akka.remote.RemoteActorRefProvider"\n  }\n  remote {\n    enabled-transports = ["akka.remote.netty.tcp"]\n    netty.tcp {\n      hostname = "127.0.0.1"\n      port = 2552\n    }\n  }\n}\n')),(0,l.kt)("h2",{id:"\u521b\u5efa\u5ba2\u6237\u7aef"},"\u521b\u5efa\u5ba2\u6237\u7aef"),(0,l.kt)("p",null,"\u5de5\u7a0b\u65b0\u5efa\u6a21\u5757akkademy-db-client\uff0c\u6dfb\u52a0\u4f9d\u8d56\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-xml"},"<dependency>\n    <groupId>org.example</groupId>\n    <artifactId>akkademy-db</artifactId>\n    <version>1.0-SNAPSHOT</version>\n</dependency>\n\n<dependency>\n    <groupId>org.scala-lang.modules</groupId>\n    <artifactId>scala-java8-compat_2.11</artifactId>\n    <version>0.6.0</version>\n</dependency>\n")),(0,l.kt)("p",null,"\u53e6\u5916\u9700\u8981\u914d\u7f6e\u5e94\u7528\u6587\u4ef6\uff1a"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},'akka {\n  actor {\n    provider = "akka.remote.RemoteActorRefProvider"\n  }\n  remote.netty.tcp.port = 0\n}\n')),(0,l.kt)("h3",{id:"client\u4ee3\u7801"},"client\u4ee3\u7801"),(0,l.kt)("p",null,"client\u4ee3\u7801\u903b\u8f91\u5f88\u7b80\u5355\uff0c\u901a\u8fc7actorSelection\u65b9\u6cd5\u83b7\u53d6\u670d\u52a1\u7aefactor\u7684\u5f15\u7528\uff0c\u7136\u540e\u5bf9\u5176\u65b9\u6cd5\u8fdb\u884c\u5c01\u88c5\u4ee5\u63d0\u4f9b\u6570\u636e\u8bbf\u95ee\u3002\u6ce8\u610factorSelection\u7b2c\u4e00\u4e2a\u5730\u5740\u53c2\u6570\u4e2d",(0,l.kt)("inlineCode",{parentName:"p"},"akkademy"),"\u5bf9\u5e94\u670d\u52a1\u7aef\u4ee3\u7801\u521b\u5efaActor System\u65f6\u8bbe\u7f6e\u7684\u540d\u79f0\uff0c",(0,l.kt)("inlineCode",{parentName:"p"},"akkademy-db"),"\u5bf9\u5e94\u521b\u5efa\u7684\u670d\u52a1\u7aefActor\u540d\u79f0\u3002"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java",metastring:"{6}","{6}":!0},'public class JClient {\n    private final ActorSystem system = ActorSystem.create("LocalSystem");\n    private final ActorSelection remoteDb;\n\n    public JClient(String remoteAddress) {\n        remoteDb = system.actorSelection("akka.tcp://akkademy@" + remoteAddress + "/user/akkademy-db");\n    }\n\n    public CompletionStage set(String key, Object value) {\n        return FutureConverters.toJava(Patterns.ask(remoteDb, new SetRequest(key, value), 2000));\n    }\n\n    public CompletionStage get(String key) {\n        return FutureConverters.toJava(Patterns.ask(remoteDb, new GetRequest(key), 2000));\n    }\n}\n')),(0,l.kt)("h3",{id:"\u6d4b\u8bd5\u4ee3\u7801"},"\u6d4b\u8bd5\u4ee3\u7801"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-java"},'public class JClientIntegrationTest {\n    JClient client = new JClient("127.0.0.1:2552");\n    @Test\n    public void itShouldSetRecord() throws Exception {\n        client.set("123", 123);\n        Integer result = (Integer)((CompletableFuture) client.get("123")).get();\n        System.out.println(result);\n        assert (result == 123);\n    }\n}\n')),(0,l.kt)("p",null,"\u9996\u5148\u8fd0\u884c\u670d\u52a1\u7aefMain\u65b9\u6cd5\uff0c\u7136\u540e\u70b9\u51fb\u8fd0\u884c\u6d4b\u8bd5\u4ee3\u7801JClientIntegrationTest\u3002"),(0,l.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,l.kt)("div",{parentName:"div",className:"admonition-heading"},(0,l.kt)("h5",{parentName:"div"},(0,l.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,l.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,l.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"\u4ee3\u7801\u5730\u5740")),(0,l.kt)("div",{parentName:"div",className:"admonition-content"},(0,l.kt)("p",{parentName:"div"},(0,l.kt)("a",{parentName:"p",href:"https://github.com/kayhaw/akkademy-db"},"https://github.com/kayhaw/akkademy-db")))),(0,l.kt)("h2",{id:"\u603b\u7ed3\u8981\u70b9"},"\u603b\u7ed3\u8981\u70b9"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},"\u83b7\u53d6Actor\u5bf9\u8c61\u5f15\u7528\u7684\u4e24\u79cd\u65b9\u5f0f\uff1aactorOf\u548cactorSelection"),(0,l.kt)("li",{parentName:"ol"},"Future\u7f16\u7a0b\u5e38\u7528API"),(0,l.kt)("li",{parentName:"ol"},"\u83b7\u53d6\u5e76\u4f7f\u7528\u8fdc\u7a0bActor\u5bf9\u8c61\u5f15\u7528")))}m.isMDXComponent=!0}}]);