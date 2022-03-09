"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[9617],{3905:function(e,t,r){r.d(t,{Zo:function(){return c},kt:function(){return d}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),p=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},v={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=p(r),d=o,m=u["".concat(l,".").concat(d)]||u[d]||v[d]||a;return r?n.createElement(m,i(i({ref:t},c),{},{components:r})):n.createElement(m,i({ref:t},c))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var p=2;p<a;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},6222:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return p},assets:function(){return c},toc:function(){return v},default:function(){return d}});var n=r(3117),o=r(102),a=(r(7294),r(3905)),i=["components"],s={title:"Spring Boot\u6e90\u7801\u5206\u6790(1)",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["Spring Boot"],description:"doDispatch",hide_table_of_contents:!1},l=void 0,p={permalink:"/blog/2021/08/01/SpringBoot\u6e90\u7801\u5206\u679001",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/blog/blog/2021-08-01-SpringBoot\u6e90\u7801\u5206\u679001.mdx",source:"@site/blog\\2021-08-01-SpringBoot\u6e90\u7801\u5206\u679001.mdx",title:"Spring Boot\u6e90\u7801\u5206\u6790(1)",description:"doDispatch",date:"2021-08-01T00:00:00.000Z",formattedDate:"August 1, 2021",tags:[{label:"Spring Boot",permalink:"/blog/tags/spring-boot"}],readingTime:3.755,truncated:!0,authors:[{name:"\u4f55\u8f72",title:"Never settle down",url:"https://github.com/kayhaw",imageURL:"https://avatars.githubusercontent.com/u/16892835?v=4"}],frontMatter:{title:"Spring Boot\u6e90\u7801\u5206\u6790(1)",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["Spring Boot"],description:"doDispatch",hide_table_of_contents:!1},prevItem:{title:"Spring Boot\u5b66\u4e60(1)",permalink:"/blog/2021/08/01/SpringBoot\u53c2\u6570\u6ce8\u89e3"},nextItem:{title:"deploy",permalink:"/blog/2021/06/22/deploy"}},c={authorsImageUrls:[void 0]},v=[],u={toc:v};function d(e){var t=e.components,s=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},u,s,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"\u7b80\u5355\u5730\u5206\u6790\u4e00\u4e0bHTTP\u8bf7\u6c42\u662f\u600e\u4e48\u843d\u5230DispatcherServlet\u7684doDispatch\u65b9\u6cd5\u5934\u4e0a"),(0,a.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"\u7248\u672c\u8bf4\u660e")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"\u57fa\u4e8eSpring Boot 2.4.3\uff0c\u5bf9\u5e94Spring MVC 5.3.4"))),(0,a.kt)("p",null,"\u9996\u5148\u7ed9\u51faDispatcherServlet\u7c7b\u7684\u7ee7\u627f\u5173\u7cfb\u56fe\uff0c\u6211\u4eec\u4e3b\u8981\u5173\u5fc3HttpServlet\u27a1\ufe0fHttpServletBean\u27a1\ufe0fFrameworkServlet\u27a1\ufe0fDispatcherServlet\u8fd9\u4e00\u6761\u7ee7\u627f\u5173\u7cfb\u7ebf"),(0,a.kt)("p",null,(0,a.kt)("img",{loading:"lazy",alt:"DispatcherServlet.png",src:r(5074).Z,width:"2378",height:"1024"})),(0,a.kt)("p",null,"HttpServlet\u4f5c\u4e3a\u62bd\u8c61\u7c7b\uff0c\u58f0\u660e\u5b9a\u4e49\u4e86doGet\u3001doPost\u3001doPut\u7b49\u65b9\u6cd5\u5904\u7406HTTP\u8bf7\u6c42(\u4ee5\u4e0b\u7edf\u79f0\u4e3adoXxx\u65b9\u6cd5)\uff0c\u7136\u800c\u5b83\u7684\u53cd\u5e94\u4e00\u5f8b\u662f\u201c\u4e0d\u597d\u610f\u601d\uff0c\u6211\u662f\u5e9f\u7269\uff0c\u4e0d\u652f\u6301\u5904\u7406xxx\u8fd9\u4e2aHTTP\u65b9\u6cd5\u201d\u3002\u56e0\u6b64\uff0c\u9700\u8981\u5176\u5b50\u7c7b\u6765\u91cd\u5199doXxx\u65b9\u6cd5\u6765\u5904\u7406\u8bf7\u6c42"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java",metastring:'title="javax/servlet/http/HttpServlet.java"',title:'"javax/servlet/http/HttpServlet.java"'},'protected void doGet(HttpServletRequest req, HttpServletResponse resp)\n  throws ServletException, IOException\n{\n  String msg = lStrings.getString("http.method_get_not_supported");\n  sendMethodNotAllowed(req, resp, msg);\n}\n\nprivate void sendMethodNotAllowed(HttpServletRequest req, HttpServletResponse resp, String msg) throws IOException {\n    String protocol = req.getProtocol();\n    // Note: Tomcat reports "" for HTTP/0.9 although some implementations\n    //       may report HTTP/0.9\n    if (protocol.length() == 0 || protocol.endsWith("0.9") || protocol.endsWith("1.0")) {\n      resp.sendError(HttpServletResponse.SC_BAD_REQUEST, msg;\n    } else {\n      resp.sendError(HttpServletResponseSC_METHOD_NOT_ALLOWED, msg);\n    }\n}\n')),(0,a.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"\u6316\u5751")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"\u6ce8\u610f\u5230javax/servlet/http/HttpServlet.java\u6765\u81eatomcat-embed-core-9.0.43-sources.jar\u5305\uff0c\u518d\u5f80\u5916\u4e00\u5c42\u601d\u8003\uff0cweb\u5bb9\u5668\u662f\u600e\u4e48\u8c03\u7528\u8fd9\u4e9bdoXxx\u65b9\u6cd5\u7684\uff1f"))),(0,a.kt)("p",null,"\u7136\u800c\u4f5c\u4e3aHttpServlet\u7684\u5b50\u7c7b\uff0cHttpServletBean\u5e76\u6ca1\u6709\u91cd\u5199doXxx\u65b9\u6cd5\uff0c\u5b83\u662fHttpServlet\u7684\u7b80\u5355\u6269\u5c55\uff0c\u7528\u4e8e\u5904\u7406web.xml\u4e2d\u7684serlvet\u914d\u7f6e\u53c2\u6570"),(0,a.kt)("p",null,"\u63a5\u7740\u6765\u5230HttpServletBean\u7684\u5b50\u7c7bFrameworkServlet\uff0c\u5b83\u7ec8\u4e8e\u91cd\u5199\u4e86\u6765\u81ea\u7237\u7237HttpServlet\u7684doXxx\u65b9\u6cd5\uff0c\u5e76\u4e14\u5b9e\u73b0\u5f88\u7b80\u5355\uff0c\u90fd\u8c03\u7528processRequest\u65b9\u6cd5\u4ee3\u4e3a\u5904\u7406"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java",metastring:'title="org/springframework/web/servlet/FrameworkServlet.java" {15}',title:'"org/springframework/web/servlet/FrameworkServlet.java"',"{15}":!0},"/**\n  * Delegate GET requests to processRequest/doService.\n  * <p>Will also be invoked by HttpServlet's default implementation of {@code doHead},\n  * with a {@code NoBodyResponse} that just captures the content length.\n  * @see #doService\n  * @see #doHead\n  */\n@Override\nprotected final void doGet(HttpServletRequest request, HttpServletResponse response)\n    throws ServletException, IOException {\n\n  processRequest(request, response);\n}\n")),(0,a.kt)("p",null,"\u5728processRequest\u65b9\u6cd5\u4e2d\uff0c\u5b83\u53c8\u901a\u8fc7doService\u65b9\u6cd5\u5904\u7406\u8bf7\u6c42\u5e76\u6355\u83b7\u5904\u7406\u65f6\u629b\u51fa\u7684\u5f02\u5e38\uff0c\u7136\u540e\u8bb0\u5f55\u7ed3\u679c\u3001\u53d1\u5e03\u4e00\u4e2a\u8bf7\u6c42\u5df2\u5904\u7406\u4e8b\u4ef6"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java",metastring:'title="org/springframework/web/servlet/FrameworkServlet.java" {5}',title:'"org/springframework/web/servlet/FrameworkServlet.java"',"{5}":!0},'protected final void processRequest(HttpServletRequest request, HttpServletResponse response)\n  throws ServletException, IOException {\n  ...   // \u4e00\u4e9b\u521d\u59cb\u5316\u4ee3\u7801\n  try {\n    doService(request, response);\n  }\n  catch (ServletException | IOException ex) {\n    failureCause = ex;\n    throw ex;\n  }\n  catch (Throwable ex) {\n    failureCause = ex;\n    throw new NestedServletException("Request processing failed", ex);\n  }\n\n  finally {\n    resetContextHolders(request, previousLocaleContext, previousAttributes);\n    if (requestAttributes != null) {\n      requestAttributes.requestCompleted();\n    }\n    logResult(request, response, failureCause, asyncManager);\n    publishRequestHandledEvent(request, response, startTime, failureCause);\n  }\n}\n')),(0,a.kt)("p",null,"\u53efdoService\u8fd8\u662f\u4e0d\u4e2d\u7528\uff0c\u5b83\u662f\u4e00\u4e2a\u62bd\u8c61\u65b9\u6cd5\uff0c\u56e0\u6b64\u8fd8\u662f\u9700\u8981FrameworkServlet\u7684\u5b50\u7c7b\u6765\u5b9e\u73b0doService\u65b9\u6cd5\u3002\u7ec8\u4e8e\uff0c\u8f6e\u5230DispatcherServlet\u51fa\u573a\u4e86"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},"protected abstract void doService(HttpServletRequest request, HttpServletResponse response)\n  throws Exception;\n")),(0,a.kt)("p",null,"\u4f5c\u4e3aFrameworkServlet\u7684\u5b50\u7c7b\uff0cDispatcherServlet\u7c7b\u5b9e\u73b0\u4e86doSerive\u65b9\u6cd5\uff0c\u5e76\u4e14\u5b83\u53c8\u5c06\u5904\u7406\u8bf7\u6c42\u53c8\u4ea4\u7ed9\u81ea\u5bb6\u7684doDispatch\u65b9\u6cd5\u53bb\u505a\u3002\u81f3\u6b64\uff0c\u8bf7\u6c42\u5904\u7406\u5230\u8fbe\u4e86\u6700\u6838\u5fc3\u7684\u4e00\u7ad9"),(0,a.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"\u603b\u7ed3")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"\u8bf7\u6c42\u5904\u7406\u4e3b\u8981\u6d89\u53ca4\u4e2a\u7c7bHttpServlet\u3001HttpServletBean\u3001FrameworkServlet\u548cDispatcherServlet\u3002\u770b\u8d77\u6765\u4e00\u5c42\u5957\u4e00\u5c42\uff0c\u53c8\u662f\u5b50\u7c7b\u91cd\u5199\u7236\u7c7b\u65b9\u6cd5\uff0c\u53c8\u662f\u5b50\u7c7b\u5b9e\u73b0\u7236\u7c7b\u62bd\u8c61\u65b9\u6cd5\uff0c\u4f46\u662f\u6bcf\u4e00\u5c42\u90fd\u5e72\u4e86\u4e00\u70b9\u4e8b\uff1a\u6bd4\u5982HttpServletBean\u7c7b\u5904\u7406web.xml\u4e2d\u7684servlet\u914d\u7f6e\u53c2\u6570\uff0cFrameworkServlet\u662f\u53d1\u5e03\u8bf7\u6c42\u5904\u7406\u7684\u7ed3\u679c\u4e8b\u4ef6\uff0c\u6700\u540eDispatcherServlet\u5e72\u6700\u91cd\u8981\u7684\u6d3b\u3002\u4e00\u4e2a\u5e9e\u5927\u590d\u6742\u7684\u7cfb\u7edf\u6846\u67b6\u4e0d\u80fd\u901a\u8fc7\u4e00\u4e2a\u7c7b\u628a\u6240\u6709\u4e8b\u90fd\u5e72\u5b8c\u4e86\uff0c\u90a3\u6837\u4ee3\u7801\u81c3\u80bf\u5e76\u4e14\u7d27\u8026\u5408\u3002\u901a\u8fc7\u7c7b\u7ee7\u627f\uff0c\u6bcf\u4e00\u5c42\u5e72\u4e00\u70b9\u4e8b\uff0c\u6700\u540e\u5f62\u6210\u4e00\u4e2a\u5b8c\u6574\u7684\u7cfb\u7edf"))))}d.isMDXComponent=!0},5074:function(e,t,r){t.Z=r.p+"assets/images/DispatcherServlet-d5326e5b6ba2d6d0784b57bd2362185f.png"}}]);