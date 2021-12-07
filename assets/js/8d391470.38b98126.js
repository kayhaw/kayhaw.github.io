"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[7749],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return d}});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var l=a.createContext({}),s=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):c(c({},n),e)),t},p=function(e){var n=s(e.components);return a.createElement(l.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},m=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),m=s(t),d=r,v=m["".concat(l,".").concat(d)]||m[d]||u[d]||i;return t?a.createElement(v,c(c({ref:n},p),{},{components:t})):a.createElement(v,c({ref:n},p))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=t.length,c=new Array(i);c[0]=m;var o={};for(var l in n)hasOwnProperty.call(n,l)&&(o[l]=n[l]);o.originalType=e,o.mdxType="string"==typeof e?e:r,c[1]=o;for(var s=2;s<i;s++)c[s]=t[s];return a.createElement.apply(null,c)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},8518:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return o},contentTitle:function(){return l},metadata:function(){return s},toc:function(){return p},default:function(){return m}});var a=t(7462),r=t(3366),i=(t(7294),t(3905)),c=["components"],o={layout:"article",title:"\u7ebf\u7a0b\u5b89\u5168\u6027",permalink:"/java-concurrency-in-practice/chap02",tags:["Java Concurrency","ReadingNotes"]},l=void 0,s={unversionedId:"Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218/Java-Concurrency-in-Practice-Chap02",id:"Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218/Java-Concurrency-in-Practice-Chap02",isDocsHomePage:!1,title:"\u7ebf\u7a0b\u5b89\u5168\u6027",description:"\u300aJava\u5e76\u53d1\u7f16\u7a0b\u300b\u7b2c\u4e8c\u7ae0\u8bfb\u4e66\u7b14\u8bb0",source:"@site/docs\\Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218\\Java-Concurrency-in-Practice-Chap02.md",sourceDirName:"Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218",slug:"/Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218/Java-Concurrency-in-Practice-Chap02",permalink:"/docs/Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218/Java-Concurrency-in-Practice-Chap02",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/docs/Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218\\Java-Concurrency-in-Practice-Chap02.md",tags:[{label:"Java Concurrency",permalink:"/docs/tags/java-concurrency"},{label:"ReadingNotes",permalink:"/docs/tags/reading-notes"}],version:"current",frontMatter:{layout:"article",title:"\u7ebf\u7a0b\u5b89\u5168\u6027",permalink:"/java-concurrency-in-practice/chap02",tags:["Java Concurrency","ReadingNotes"]},sidebar:"tutorialSidebar",previous:{title:"Apache Flink\u67b6\u6784",permalink:"/docs/Stream Processing with Apache Flink/Stream-Processing-with-Apache-Flink-Chap03"},next:{title:"\u5bf9\u8c61\u7684\u5171\u4eab",permalink:"/docs/Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218/Java-Concurrency-in-Practice-Chap03"}},p=[{value:"\u4ec0\u4e48\u662f\u7ebf\u7a0b\u5b89\u5168\u6027",id:"\u4ec0\u4e48\u662f\u7ebf\u7a0b\u5b89\u5168\u6027",children:[]},{value:"\u539f\u5b50\u6027",id:"\u539f\u5b50\u6027",children:[{value:"\u793a\u4f8b\uff1a\u5ef6\u8fdf\u521d\u59cb\u5316\u4e2d\u7684\u7ade\u6001\u6761\u4ef6",id:"\u793a\u4f8b\u5ef6\u8fdf\u521d\u59cb\u5316\u4e2d\u7684\u7ade\u6001\u6761\u4ef6",children:[]},{value:"\u590d\u5408\u64cd\u4f5c",id:"\u590d\u5408\u64cd\u4f5c",children:[]}]},{value:"\u52a0\u9501\u673a\u5236",id:"\u52a0\u9501\u673a\u5236",children:[{value:"\u5185\u7f6e\u9501",id:"\u5185\u7f6e\u9501",children:[]},{value:"\u91cd\u5165\u9501",id:"\u91cd\u5165\u9501",children:[]}]},{value:"\u7528\u9501\u6765\u4fdd\u62a4\u72b6\u6001",id:"\u7528\u9501\u6765\u4fdd\u62a4\u72b6\u6001",children:[]},{value:"\u6d3b\u8dc3\u6027\u4e0e\u6027\u80fd",id:"\u6d3b\u8dc3\u6027\u4e0e\u6027\u80fd",children:[]}],u={toc:p};function m(e){var n=e.components,t=(0,r.Z)(e,c);return(0,i.kt)("wrapper",(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"\u300aJava\u5e76\u53d1\u7f16\u7a0b\u300b\u7b2c\u4e8c\u7ae0\u8bfb\u4e66\u7b14\u8bb0"))),(0,i.kt)("h2",{id:"\u4ec0\u4e48\u662f\u7ebf\u7a0b\u5b89\u5168\u6027"},"\u4ec0\u4e48\u662f\u7ebf\u7a0b\u5b89\u5168\u6027"),(0,i.kt)("p",null,"\u5b9a\u4e49\uff1a\u5f53\u591a\u4e2a\u7ebf\u7a0b\u8bbf\u95ee\u67d0\u4e2a\u7c7b\u65f6\uff0c\u8be5\u7c7b\u59cb\u7ec8\u53ef\u4ee5\u8868\u73b0\u51fa\u6b63\u786e\u7684\u884c\u4e3a\u3002\u7ebf\u7a0b",(0,i.kt)("strong",{parentName:"p"},"\u4e0d\u5b89\u5168"),"\u7684\u4e24\u4e2a\u5fc5\u8981\u6761\u4ef6\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u591a\u7ebf\u7a0b\u5171\u4eab\u72b6\u6001"),(0,i.kt)("li",{parentName:"ul"},"\u72b6\u6001\u53ef\u53d8")),(0,i.kt)("p",null,"\u56e0\u6b64\uff0c",(0,i.kt)("strong",{parentName:"p"},"\u4e0d\u53ef\u53d8\u6216\u8005\u6ca1\u6709\u72b6\u6001\u7684\u5bf9\u8c61\u4e00\u5b9a\u662f\u7ebf\u7a0b\u5b89\u5168\u7684"),"\u3002"),(0,i.kt)("h2",{id:"\u539f\u5b50\u6027"},"\u539f\u5b50\u6027"),(0,i.kt)("p",null,"\u5728\u5e76\u53d1\u7f16\u7a0b\u4e2d\uff0c\u7531\u4e8e\u4e0d\u6070\u5f53\u7684\u6267\u884c\u987a\u5e8f\u5bfc\u81f4\u4e0d\u6b63\u786e\u7684\u7ed3\u679c\u79f0\u4e4b\u4e3a",(0,i.kt)("em",{parentName:"p"},"\u7ade\u6001\u6761\u4ef6(Race Condition)"),"\u3002\u6bd4\u5982\u591a\u4e2a\u7ebf\u7a0b\u6267\u884c\u4ee3\u7801",(0,i.kt)("inlineCode",{parentName:"p"},"++count"),"\u7edf\u8ba1\u65b9\u6cd5\u88ab\u8c03\u7528\u6b21\u6570\uff0c\u8fd9\u662f\u5178\u578b\u7684",(0,i.kt)("em",{parentName:"p"},"\u5148\u68c0\u67e5\u540e\u6267\u884c"),"\u64cd\u4f5c(\u5148\u83b7\u53d6\u5f53\u524dcount\u503c\uff0c\u7136\u540e\u52a01\u5199\u56de)\uff0c\u5728\u591a\u7ebf\u7a0b\u73af\u5883\u4e0b\u68c0\u67e5\u7684\u7ed3\u679c\u53ef\u80fd\u4e0d\u6b63\u786e(\u5df2\u7ecf\u88ab\u5176\u4ed6\u7ebf\u7a0b\u4fee\u6539\u4f46\u672a\u5199\u56de)\u3002"),(0,i.kt)("h3",{id:"\u793a\u4f8b\u5ef6\u8fdf\u521d\u59cb\u5316\u4e2d\u7684\u7ade\u6001\u6761\u4ef6"},"\u793a\u4f8b\uff1a\u5ef6\u8fdf\u521d\u59cb\u5316\u4e2d\u7684\u7ade\u6001\u6761\u4ef6"),(0,i.kt)("p",null,"\u5bf9\u4e8e\u5982\u4e0b\u5ef6\u8fdf\u521d\u59cb\u5316\u7684\u4ee3\u7801\uff0c\u5148\u68c0\u67e5\u5f15\u7528instance\u662f\u5426\u4e3a\u7a7a\uff0c\u7136\u540e\u624d\u6784\u9020\u5bf9\u8c61\u3002\u5f53\u7ebf\u7a0bA\u548cB\u540c\u65f6\u6267\u884c\uff0c\u6700\u7ec8\u7ed3\u679c\u53d6\u51b3\u4e8e\u4e0d\u53ef\u9884\u6d4b\u7684\u6267\u884c\u65f6\u5e8f\u3002\u82e5A\u3001B\u5206\u522b\u6267\u884c\u90fd\u68c0\u67e5instance\u4e3a\u7a7a\uff0c\u5219getInstance\u8fd4\u56de\u4e24\u4e2a\u4e0d\u540c\u5bf9\u8c61\uff0c\u8fd9\u8fdd\u80cc\u4e86\u5ef6\u8fdf\u521d\u59cb\u5316\u7684\u521d\u5fc3\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},"public class LazyInitRace {\n    private ExpensiveObject instance = null;\n\n    public ExpensiveObject getInstance() {\n        if(instance == null) {\n          instance = new ExpensiveObject();\n        }\n        return instance;\n    }\n}\n")),(0,i.kt)("h3",{id:"\u590d\u5408\u64cd\u4f5c"},"\u590d\u5408\u64cd\u4f5c"),(0,i.kt)("p",null,"\u4e3a\u4e86\u9632\u6b62\u4ee5\u4e0a\u7ade\u6001\u6761\u4ef6\u7684\u51fa\u73b0\uff0c\u9700\u8981\u786e\u4fdd\u5176\u4ed6\u7ebf\u7a0b\u5728\u4fee\u6539\u64cd\u4f5c\u4e4b\u524d\u6216\u4e4b\u540e\u8bfb\u53d6\u548c\u4fee\u6539\u72b6\u6001\uff0c\u800c\u4e0d\u662f\u5728\u4fee\u6539\u8fc7\u7a0b\u4e2d\u3002\u7531\u6b64\u5f15\u51fa",(0,i.kt)("strong",{parentName:"p"},"\u539f\u5b50\u64cd\u4f5c"),"\u5b9a\u4e49\uff1a\u8bbe\u6709\u64cd\u4f5cA\u548cB\uff0c\u4ece\u6267\u884cA\u7684\u7ebf\u7a0b\u770b\uff0c\u53e6\u4e00\u4e2a\u7ebf\u7a0b\u6267\u884cB\u65f6\uff0c\u8981\u4e48B\u64cd\u4f5c\u5168\u90e8\u6267\u884c\u5b8c\uff0c\u8981\u4e48\u5b8c\u5168\u4e0d\u6267\u884c\u3002\u800c\u5982\u4e0a\u7684\u201c\u5148\u68c0\u67e5\u540e\u6267\u884c\u201d\u3001\u201c\u8bfb\u53d6-\u4fee\u6539-\u5199\u5165\u201d\u7684\u64cd\u4f5c\u79f0\u4e4b\u4e3a",(0,i.kt)("strong",{parentName:"p"},"\u590d\u5408\u64cd\u4f5c"),"\uff1a\u5305\u542b\u4e86\u4e00\u7ec4\u5fc5\u987b\u4ee5\u539f\u5b50\u65b9\u5f0f\u6267\u884c\u7684\u64cd\u4f5c\u3002\u6bd4\u5982\u4e3a\u4e86\u4fee\u6539",(0,i.kt)("inlineCode",{parentName:"p"},"++count"),"\u5bfc\u81f4\u7684\u7ade\u6001\u6761\u4ef6\uff0c\u5c06count\u7531Long\u7c7b\u578b\u6539\u4e3aAtomicLong\u3002"),(0,i.kt)("h2",{id:"\u52a0\u9501\u673a\u5236"},"\u52a0\u9501\u673a\u5236"),(0,i.kt)("p",null,"\u8003\u8651\u5982\u4e0b\u4ee3\u7801\uff0c\u4f7f\u7528AtomicReference\u4fdd\u5b58\u6700\u8fd1\u5206\u89e3\u8d28\u56e0\u6570\u7684\u6570\u503c\u53ca\u5176\u7ed3\u679c\uff0c\u8fd9\u610f\u5473\u7740\u5b83\u662f\u7ebf\u7a0b\u5b89\u5168\u7684\u5417\uff1f"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},"public class CachedFactorizer {\n    private final AtomicReference<BigInteger> lastNumber = new AtomicReference<>();\n    private final AtomicReference<BigInteger[]> lastFactors = new AtomicReference<>();\n\n    public BigInteger[] getFactors(BigInteger i) {\n        if(i.equals(lastNumber.get())) {\n            return lastFactors.get();\n        } else {\n            BigInteger[] factors = factor(i);\n            lastNumber.set(i);\n            lastFactors.set(factors);\n            return factors;\n        }\n    }\n}\n")),(0,i.kt)("p",null,"\u7b54\u6848\u662f\u5426\u5b9a\u7684\u3002\u5c3d\u7ba1lastNumber\u548clastFactors\u5404\u81ea\u662f\u7ebf\u7a0b\u5b89\u5168\u7684\uff0c\u4f46\u662f\u5b83\u4eec\u4e0d\u662f\u4e92\u76f8\u72ec\u7acb\u7684\uff08\u5728lastFactors\u4e2d\u7684\u56e0\u6570\u4e4b\u79ef\u5e94\u8be5\u7b49\u4e8elastNumber\u4e2d\u6570\u503c\uff09\uff0c\u9700\u8981\u4fdd\u8bc1\u5728\u540c\u4e00\u4e2a\u539f\u5b50\u64cd\u4f5c\u5185\u540c\u65f6\u66f4\u65b0\u4e24\u8005\uff0c\u5426\u5219\u53ef\u80fd\u7ebf\u7a0bA\u5728\u83b7\u53d6\u8fd9\u4e24\u4e2a\u503c\u7684\u8fc7\u7a0b\u4e2d\uff0c\u7ebf\u7a0bB\u4fee\u6539\u4e86\u5b83\u4eec\u3002"),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"\u603b\u7ed3")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"\u8981\u4fdd\u6301\u72b6\u6001\u4e00\u81f4\u6027\uff0c\u9700\u8981\u5728\u539f\u5b50\u64cd\u4f5c\u4e2d\u66f4\u65b0",(0,i.kt)("strong",{parentName:"p"},"\u6240\u6709\u76f8\u5173\u7684"),"\u72b6\u6001\u53d8\u91cf\u3002"))),(0,i.kt)("h3",{id:"\u5185\u7f6e\u9501"},"\u5185\u7f6e\u9501"),(0,i.kt)("p",null,"\u4e3a\u4e86\u89e3\u51b3\u4e0a\u8ff0\u95ee\u9898\uff0cJava\u63d0\u4f9b\u5185\u7f6e\u9501\u673a\u5236\u6765\u652f\u6301\u539f\u5b50\u6027\uff0c\u5373\u540c\u6b65\u4ee3\u7801\u5757\u3002\u5b83\u5305\u542b\u4e24\u90e8\u5206\uff1a"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"\u4f5c\u4e3a\u9501\u7684\u5bf9\u8c61\u5f15\u7528"),(0,i.kt)("li",{parentName:"ol"},"\u4f5c\u4e3a\u7531\u8be5\u9501\u4fdd\u62a4\u7684\u4ee3\u7801\u5757")),(0,i.kt)("p",null,"\u5bf9\u4e8e\u5982\u4e0agetFactors\u65b9\u6cd5\uff0c\u53ea\u9700\u8981\u4f7f\u7528synchronized\u5173\u952e\u5b57\u4fee\u9970\u4f7f\u5176\u6210\u4e3a\u540c\u6b65\u65b9\u6cd5\u3002\u6bcf\u4e2aJava\u5bf9\u8c61\u90fd\u53ef\u4ee5\u4f5c\u4e3a\u9501\uff08\u88ab\u79f0\u4e3a",(0,i.kt)("strong",{parentName:"p"},"\u5185\u7f6e\u9501\u3001\u76d1\u89c6\u9501\u6216\u8005\u9690\u5f0f\u9501"),"\uff09\uff0c\u7ebf\u7a0b\u8fdb\u5165\u540c\u6b65\u4ee3\u7801\u5757\u65f6\u81ea\u52a8\u83b7\u5f97\u9501\uff0c\u9000\u51fa\u65f6\u81ea\u52a8\u91ca\u653e\u9501\u3002\u5185\u7f6e\u9501\u662f\u4e92\u65a5\u7684\uff0c\u8fd9\u610f\u5473\u7740\u6700\u591a\u53ea\u6709\u4e00\u6761\u7ebf\u7a0b\u80fd\u6301\u6709\u9501\uff0c\u5bfc\u81f4\u6027\u80fd\u964d\u4f4e\u3002"),(0,i.kt)("h3",{id:"\u91cd\u5165\u9501"},"\u91cd\u5165\u9501"),(0,i.kt)("p",null,"\u201c\u91cd\u5165\u201d\u610f\u5473\u7740\u83b7\u53d6\u9501\u7684\u64cd\u4f5c\u7684\u7c92\u5ea6\u662f\u201c\u7ebf\u7a0b\u201d\u800c\u4e0d\u662f\u201c\u8c03\u7528\u201d\uff0c\u5373\u83b7\u53d6\u9501\u7684\u7ebf\u7a0b\u53ef\u4ee5\u518d\u6b21\u8fdb\u5165\u9501\u4fdd\u62a4\u7684\u4ee3\u7801\u5757\uff0c\u5185\u7f6e\u9501\u662f\u53ef\u91cd\u5165\u7684\uff08\u6216\u8005\u8bf4\u5df2\u83b7\u5f97\u9501\u7684\u7ebf\u7a0b\u518d\u8bf7\u6c42\u83b7\u53d6\u540c\u4e00\u4e2a\u9501\u65f6\u4f1a\u6210\u529f\uff09\u3002\u91cd\u5165\u8fdb\u4e00\u6b65\u63d0\u5347\u52a0\u9501\u7684\u5c01\u88c5\u6027\uff0c\u7b80\u5316\u4ee3\u7801\u5f00\u53d1\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},'public class Widget {\n    public synchronized void doSomething() {...}\n}\n\npublic class LoggingWidget extends Widget {\n    public synchronized void doSomething() {\n        System.out.println("Call doSomething");\n        super.doSomething();\n    }\n}\n')),(0,i.kt)("p",null,"\u5982\u679c\u5185\u7f6e\u9501\u4e0d\u53ef\u91cd\u5165\uff0c\u5b50\u7c7bdoSomething\u65b9\u6cd5\u8c03\u7528super.doSomething()\u65f6\u65e0\u6cd5\u83b7\u5f97\u9501\u5bfc\u81f4\u6b7b\u9501\u3002"),(0,i.kt)("h2",{id:"\u7528\u9501\u6765\u4fdd\u62a4\u72b6\u6001"},"\u7528\u9501\u6765\u4fdd\u62a4\u72b6\u6001"),(0,i.kt)("p",null,"\u5f53\u7528\u9501\u6765\u4fdd\u62a4\u72b6\u6001\u65f6\uff0c\u9700\u8981",(0,i.kt)("strong",{parentName:"p"},"\u786e\u4fdd\u5171\u4eab\u548c\u53ef\u53d8\u7684\u53d8\u91cf\u90fd\u53ea\u7531\u540c\u4e00\u4e2a\u9501\u6765\u4fdd\u62a4"),"\u3002\u56e0\u6b64\uff0c\u5e38\u7528\u7684\u7f16\u7a0b\u6a21\u677f\u662f\u5c06\u6240\u6709\u53ef\u53d8\u72b6\u6001\u5c01\u88c5\u5728\u67d0\u4e2a\u7c7b\u4e2d\uff0c\u7136\u540e\u63d0\u4f9b\u4f7f\u7528synchronized\u4fee\u9970\u7684\u65b9\u6cd5\u63d0\u4f9b\u8bbf\u95ee\u548c\u4fee\u6539\uff0c\u8fd9\u6837\u5bf9\u4e8e\u8be5\u7c7b\u5bf9\u8c61\u6765\u8bf4\uff0c\u9501\u90fd\u662f\u5bf9\u8c61\u672c\u8eab\u3002\u540c\u65f6\u4e5f\u4e0d\u8981\u6ee5\u7528\u9501\uff0c\u5e76\u975e\u6240\u6709\u6570\u636e\u90fd\u9700\u8981\u52a0\u9501\u3002"),(0,i.kt)("h2",{id:"\u6d3b\u8dc3\u6027\u4e0e\u6027\u80fd"},"\u6d3b\u8dc3\u6027\u4e0e\u6027\u80fd"),(0,i.kt)("p",null,"\u5728CachedFactorizer\u7684\u4f8b\u5b50\u4e2d\uff0c\u5c06\u6574\u4e2agetFactors\u65b9\u6cd5\u90fd\u8bbe\u7f6e\u4e3a\u540c\u6b65\u4ee3\u7801\u5757\uff0c\u8fd9\u6781\u5927\u964d\u4f4e\u4e86\u7a0b\u5e8f\u6027\u80fd\u3002\u5f53\u591a\u4e2a\u7ebf\u7a0bA\u3001B\u3001C\u8c03\u7528getFactors\u65b9\u6cd5\u65f6\uff0c\u53ea\u80fd\u4f9d\u6b21\u7b49\u5f85\u83b7\u53d6\u9501\u7684\u7ebf\u7a0b\u6267\u884c\u5b8c\u6bd5\uff0c\u8fd9\u79f0\u4e3a\u4e0d\u826f\u5e76\u53d1(Poor Concurrency)\u7684\u7a0b\u5e8f\u3002\u4e3a\u6b64\uff0c\u9700\u8981\u5c3d\u91cf\u7f29\u5c0f\u540c\u6b65\u4ee3\u7801\u5757\u7684\u8303\u56f4\uff0c\u540c\u65f6\u7ef4\u62a4\u7ebf\u7a0b\u5b89\u5168\u6027\uff0c\u6539\u8fdb\u540e\u4ee3\u7801\u5982\u4e0b\u6240\u793a\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},"public class CachedFactorizer {\n    private BigInteger lastNumber;\n    private private BigInteger[] lastFactors;\n\n    public BigInteger[] getFactors(BigInteger i) {\n        BigInteger[] factors = null;\n        synchronized (this) {\n            if(i.equals(lastNumber)) {\n                factors = lastFactors.clone();\n            }\n        }\n        if(factors == null) {\n            factors = factor(i);\n            synchronized (this) {\n                lastNumber = i;\n                lastFactors = factors.clone();\n            }\n        }\n        return factors;\n    }\n}\n")),(0,i.kt)("p",null,"\u6539\u9020\u540e\u7684\u4ee3\u7801\u53bb\u9664\u4e86\u539f\u5b50\u53d8\u91cf\u7684\u4f7f\u7528\uff0c\u5728\u8bbf\u95ee\u72b6\u6001\u6216\u8005\u590d\u5408\u64cd\u4f5c\u6267\u884c\u65f6\u52a0\u9501\u5b9e\u73b0\u7ebf\u7a0b\u5b89\u5168\uff0c\u540c\u65f6\u786e\u4fdd\u5c3d\u91cf\u5c0f\u5730\u5f71\u54cd\u5e76\u53d1\u3002"),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"\u603b\u7ed3")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("ol",{parentName:"div"},(0,i.kt)("li",{parentName:"ol"},"\u5b9e\u73b0\u540c\u6b65\u7b56\u7565\u7684\u4ee3\u7801\u5b58\u5728\u7b80\u5355\u6027(\u6574\u4e2a\u65b9\u6cd5\u5757\u540c\u6b65)\u548c\u6027\u80fd\u7684\u4e92\u76f8\u5236\u7ea6\uff0c\u4e0d\u8981\u76f2\u76ee\u5730\u4e3a\u4e86\u6027\u80fd\u800c\u727a\u7272\u7b80\u5355\u6027"),(0,i.kt)("li",{parentName:"ol"},"\u6267\u884c\u65f6\u95f4\u8fc7\u957f\u7684\u4ee3\u7801\u4e0d\u8981\u52a0\u9501")))))}m.isMDXComponent=!0}}]);