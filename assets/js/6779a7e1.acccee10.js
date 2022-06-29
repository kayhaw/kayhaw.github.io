"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[9430],{8950:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return p},default:function(){return d},frontMatter:function(){return o},metadata:function(){return c},toc:function(){return m}});var a=n(3117),r=n(102),i=(n(7294),n(3905)),l=["components"],o={layout:"article",title:"\u6742\u5f55",permalink:"/Effective-C++-Note/chap9",sidebar:{nav:"effective-c++-reading-notes"},tags:["Effective-C++","ReadingNotes","C++"]},p=void 0,c={unversionedId:"EffectiveC++/Effective-C++-Chap9",id:"EffectiveC++/Effective-C++-Chap9",title:"\u6742\u5f55",description:"\u300aEffective C++\u300b\u82f1\u6587\u7b2c\u4e09\u7248\u8bfb\u4e66\u7b14\u8bb0\u7b2c\u4e5d\u7ae0",source:"@site/docs/EffectiveC++/Effective-C++-Chap9.md",sourceDirName:"EffectiveC++",slug:"/EffectiveC++/Effective-C++-Chap9",permalink:"/docs/EffectiveC++/Effective-C++-Chap9",draft:!1,editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/docs/EffectiveC++/Effective-C++-Chap9.md",tags:[{label:"Effective-C++",permalink:"/docs/tags/effective-c"},{label:"ReadingNotes",permalink:"/docs/tags/reading-notes"},{label:"C++",permalink:"/docs/tags/c"}],version:"current",frontMatter:{layout:"article",title:"\u6742\u5f55",permalink:"/Effective-C++-Note/chap9",sidebar:{nav:"effective-c++-reading-notes"},tags:["Effective-C++","ReadingNotes","C++"]},sidebar:"tutorialSidebar",previous:{title:"\u81ea\u5b9a\u4e49new\u548cdelete",permalink:"/docs/EffectiveC++/Effective-C++-Chap8"},next:{title:"\u7ebf\u7a0b\u5b89\u5168\u6027",permalink:"/docs/Java\u5e76\u53d1\u7f16\u7a0b\u5b9e\u6218/Java-Concurrency-in-Practice-Chap02"}},s={},m=[{value:"Item53:\u6ce8\u610f\u7f16\u8bd1\u5668\u7684\u8b66\u544a",id:"item53\u6ce8\u610f\u7f16\u8bd1\u5668\u7684\u8b66\u544a",level:2},{value:"Item54:\u719f\u6089\u6807\u51c6\u5e93\uff0c\u5305\u62ecTR1",id:"item54\u719f\u6089\u6807\u51c6\u5e93\u5305\u62ectr1",level:2},{value:"Item55:\u719f\u6089Boost",id:"item55\u719f\u6089boost",level:2}],u={toc:m};function d(e){var t=e.components,n=(0,r.Z)(e,l);return(0,i.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"\u300aEffective C++\u300b\u82f1\u6587\u7b2c\u4e09\u7248\u8bfb\u4e66\u7b14\u8bb0\u7b2c\u4e5d\u7ae0"))),(0,i.kt)("h2",{id:"item53\u6ce8\u610f\u7f16\u8bd1\u5668\u7684\u8b66\u544a"},"Item53:\u6ce8\u610f\u7f16\u8bd1\u5668\u7684\u8b66\u544a"),(0,i.kt)("p",null,"\u8bb8\u591a\u7a0b\u5e8f\u5458\u4e60\u60ef\u6027\u5730\u5ffd\u7565\u7f16\u8bd1\u5668\u8b66\u544a\uff0c\u6bd5\u7adf\u8981\u662f\u95ee\u9898\u4e25\u91cd\u7684\u8bdd\u5b83\u5c31\u662f\u4e2aerror\uff0c\u662f\u5427\uff1f\u5728\u5176\u4ed6\u7684\u7f16\u7a0b\u8bed\u8a00\u4e2d\uff0c\u8fd9\u79cd\u60f3\u6cd5\u7684\u5371\u5bb3\u53ef\u80fd\u4f1a\u76f8\u5bf9\u66f4\u5c0f\u4e9b\uff0c\u4f46\u662f\u5bf9\u4e8eC++\u6765\u8bf4\uff0c\u7f16\u8bd1\u5668\u4f5c\u8005\u6bd4\u4f60\u66f4\u5177\u6709\u7ecf\u9a8c\uff0c\u6bd4\u5982\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"class B {\n    public:\n        virtual void f() const;\n};\n\nclass D: public B {\n    public:\n        virtual void f();\n};\n")),(0,i.kt)("p",null,"\u672c\u6765\u7684\u60f3\u6cd5\u662fD::f\u91cd\u5b9a\u4e49B::f\uff0c\u4f46\u662f\u6709\u4e2a\u9519\u8bef\uff0cB::f\u662fconst\u65b9\u6cd5\u800cD::f\u4e0d\u662f\uff0c\u56e0\u6b64\u7f16\u8bd1\u5668\u63d0\u793a",(0,i.kt)("inlineCode",{parentName:"p"},"warning: D::f() hides virtual B::f()"),"{:.warning}\uff0c\u5f88\u591a\u4e0d\u719f\u7ec3\u7684\u7a0b\u5e8f\u5458\u5bf9\u6b64\u7684\u53cd\u5e94\u662f\u201c\u5f53\u7136D::f\u4f1a\u8986\u76d6B::f\uff0c\u8fd9\u5c31\u662f\u5b83\u5e94\u8be5\u505a\u7684\uff01\u201d\uff0c\u9519\u8bef\uff01\u7f16\u8bd1\u5668\u662f\u5728\u544a\u8bc9\u4f60B::f\u6ca1\u6709\u5728D\u4e2d\u91cd\u65b0\u58f0\u660e\u800c\u88ab\u5b8c\u5168\u8986\u76d6\uff0c\u5ffd\u7565\u8fd9\u4e2a\u8b66\u544a\u4f1a\u5e26\u6765\u9519\u8bef\u7684\u7a0b\u5e8f\u884c\u4e3a\uff0c\u82b1\u8d39\u5927\u91cf\u65f6\u95f4\u53bb\u8c03\u8bd5\u5728\u4e00\u5f00\u59cb\u7f16\u8bd1\u5668\u5c31\u68c0\u6d4b\u5230\u7684\u95ee\u9898\u3002",(0,i.kt)("br",{parentName:"p"}),"\n","\u5f53\u5bf9\u7f16\u8bd1\u5668\u8b66\u544a\u6709\u8db3\u591f\u591a\u7684\u7ecf\u9a8c\u540e\uff0c\u4f60\u5c06\u4f1a\u4f1a\u7406\u89e3\u4e0d\u540c\u4fe1\u606f\u7684\u771f\u6b63\u542b\u4e49\uff0c\u4e00\u65e6\u7ecf\u9a8c\u6210\u719f\uff0c\u4f60\u53ef\u4ee5\u9009\u62e9\u5ffd\u7565\u4e00\u7cfb\u5217\u7684\u8b66\u544a\uff0c\u5f53\u7136\u6700\u597d\u4e0d\u8981\u6709\u8b66\u544a\uff0c\u5373\u4f7f\u662f\u5728\u6700\u9ad8\u7ea7\u522b\u7684\u8b66\u544a\uff0c\u65e0\u8bba\u5982\u4f55\uff0c\u5728\u5ffd\u7565\u8b66\u544a\u4e4b\u524d\uff0c\u4f60\u8981\u7cbe\u51c6\u5730\u7406\u89e3\u5176\u80cc\u540e\u7684\u542b\u4e49\uff0c\u8b66\u544a\u548c\u4ee3\u7801\u5b9e\u73b0\u662f\u4e0d\u76f8\u5173\u7684\uff0c\u56e0\u6b64\u7f16\u7a0b\u4e0d\u80fd\u7c97\u5fc3\uff0c\u5355\u9760\u7f16\u8bd1\u5668\u5e2e\u4f60\u6307\u51fa\u9519\u8bef"),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"\u603b\u7ed3")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"\u8ba4\u771f\u5bf9\u5f85\u7f16\u8bd1\u5668\u8b66\u544a\uff0c\u52aa\u529b\u5728\u6700\u9ad8\u7ea7\u522b\u4e0b\u5b9e\u73b0\u7f16\u8bd1\u5668\u96f6\u8b66\u544a\uff1b\u4e0d\u8981\u4f9d\u8d56\u7f16\u8bd1\u5668\u8b66\u544a\uff0c\u4e0d\u540c\u7684\u7f16\u8bd1\u5668\u5bf9\u8b66\u544a\u5b9e\u73b0\u4e0d\u540c\uff0c\u79fb\u690d\u5230\u65b0\u7684\u7f16\u8bd1\u5668\u4e5f\u8bb8\u4f1a\u6d88\u9664\u4f60\u4f9d\u8d56\u7684\u8b66\u544a\u4fe1\u606f"))),(0,i.kt)("h2",{id:"item54\u719f\u6089\u6807\u51c6\u5e93\u5305\u62ectr1"},"Item54:\u719f\u6089\u6807\u51c6\u5e93\uff0c\u5305\u62ecTR1"),(0,i.kt)("p",null,"C++\u8bed\u8a00\u6807\u51c6\u6587\u6863\u548c\u6807\u51c6\u5e93\u57281998\u5e74\u63d0\u4ea4\u901a\u8fc7\uff0c\u57282003\u5e74\uff0c\u53d1\u884c\u4e86\u5c0f\u7684bug\u6539\u52a8\uff0c\u6807\u51c6\u59d4\u5458\u4f1a\u7ee7\u7eed\u7740\u5b83\u7684\u5de5\u4f5c\uff0c\u4f46\u662f2.0\u7248\u672c\u7684C++\u9884\u8ba1\u57282008\u5de6\u53f3\u53d1\u5e03\uff0c\u56e0\u4e3a\u65f6\u95f4\u7684\u4e0d\u786e\u5b9a\uff0c\u4e0b\u4e2a\u7248\u672c\u7684C++\u88ab\u79f0\u4e3a\u201cC++ 0x\u201d\uff0c\u56e0\u4e3a\u5b83\u662f200x\u7248\u672c\u7684C++\u3002C++ 0x\u7684\u65b0\u7279\u6027\u5c06\u6807\u51c6\u5e93\u7684\u8865\u5145\u7684\u5f62\u5f0f\u51fa\u73b0\uff0c\u4e00\u4e9b\u65b0\u589e\u7684\u529f\u80fd\u5728TR1\u6587\u6863(Technical Report1)\u4e2d\u8bf4\u660e\uff0c\u5728\u63a2\u7d22TR1\u7684\u5185\u5bb9\u4e4b\u524d\uff0c\u6211\u4eec\u5148\u56de\u987e\u4e0bC++98\u6807\u51c6\u5e93\u7684\u4e3b\u8981\u90e8\u5206\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u6807\u51c6\u6a21\u677f\u5e93(STL)\uff0c\u5b83\u5305\u62ec\u5bb9\u5668(vector\uff0clist\uff0cmap\u7b49)\uff0c\u8fed\u4ee3\u5668\uff0c\u7b97\u6cd5(find\uff0csort\u7b49)\uff0c\u51fd\u6570\u5bf9\u8c61(less\uff0cgreater\u7b49)\uff0c\u4ee5\u53ca\u5404\u79cd\u5bb9\u5668\u548c\u51fd\u6570\u5bf9\u8c61\u7684\u9002\u914d\u5668(stack\uff0cpriority_queue\uff0cmem_fun\u7b49)"),(0,i.kt)("li",{parentName:"ul"},"Iostream\uff0c\u5305\u62ec\u7528\u6237\u81ea\u5b9a\u4e49\u7f13\u51b2\u533a\uff0c\u56fd\u9645\u5316IO\uff0c\u4ee5\u53ca\u9884\u5b9a\u4e49\u7684\u5bf9\u8c61cin\uff0ccout\uff0ccerr\u548cclog"),(0,i.kt)("li",{parentName:"ul"},"\u652f\u6301\u56fd\u9645\u5316\uff0c\u6bd4\u5982wchar_t(\u901a\u5e38\u662f16\u4f4d)\u548cwstring(\u7531wchar_t\u7ec4\u6210\u7684\u5b57\u7b26\u4e32)\u8ba9\u652f\u6301Unicode\u53d8\u5f97\u7b80\u5355"),(0,i.kt)("li",{parentName:"ul"},"\u652f\u6301\u6570\u503c\u5904\u7406\uff0c\u6bd4\u5982\u590d\u6570\u6a21\u677fcomplex\u548c\u6570\u7ec4\u6a21\u677fvalarray"),(0,i.kt)("li",{parentName:"ul"},"\u5f02\u5e38\u7ee7\u627f\u4f53\u7cfb\uff0c\u5305\u62ec\u57fa\u7c7bexception\uff0c\u5b83\u7684\u6d3e\u751f\u7c7blogic_error\uff0cruntime_error\u4ee5\u53ca\u5176\u4ed6\u4e0d\u540c\u7684\u6d3e\u751f\u7c7b"),(0,i.kt)("li",{parentName:"ul"},"C89\u6807\u51c6\u5e93\uff0c1989\u53d1\u5e03\u7684C\u8bed\u8a00\u6807\u51c6\u5e93\u4e5f\u5305\u542b\u5728C++\u4e2d")),(0,i.kt)("p",null,"TR1\u5217\u4e3e\u4e8614\u4e2a\u65b0\u7ec4\u4ef6\uff0c\u90fd\u5305\u542b\u5728std\u547d\u540d\u7a7a\u95f4\u4e2d\uff0c\u672c\u4e66\u7684\u4f8b\u5b50\u5c55\u793a\u4e86\u4ee5\u4e0bTR1\u7ec4\u4ef6\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u667a\u80fd\u6307\u9488\uff0ctr1::shared_ptr\u548ctr1::weak_ptr\uff0cshared_ptr\u4f7f\u7528\u5f15\u7528\u8ba1\u6570\uff0c\u4f46\u662f\u5f53\u5bf9\u8c61\u4e92\u76f8\u5f15\u7528\u65f6\u5c31\u4f1a\u5931\u6548\uff0c\u8fd9\u65f6weak_ptr\u6d3e\u4e0a\u7528\u573a\uff0c\u672c\u4e66\u591a\u6b21\u7528\u5230shared_ptr(Item13)\uff0c\u4f46\u662f\u6ca1\u6709\u63d0\u5230\u8fc7weak_ptr"),(0,i.kt)("li",{parentName:"ul"},"tr1::function\uff0c\u8868\u793a\u4efb\u4f55\u53ef\u8c03\u7528\u7684\u5bf9\u8c61\uff0c\u5b83\u7684\u7b7e\u540d\u548c\u76ee\u6807\u7b7e\u540d\u4e00\u81f4\uff0c\u5982\u679c\u6211\u4eec\u60f3\u767b\u8bb0\u4e00\u4e2a\u56de\u8c03\u51fd\u6570\uff0c\u8be5\u51fd\u6570\u53c2\u6570\u4e3aint\u8fd4\u56de\u4e3astring\uff0c\u4ee3\u7801\u4e3a")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"void registerCallback(std::string func(int));\n")),(0,i.kt)("p",null,"\u53c2\u6570\u540dfunc\u662f\u53ef\u9009\u7684\uff0c\u56e0\u6b64\u4e5f\u53ef\u4ee5\u5199\u6210"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"void registerCallback(std::string (int));\n")),(0,i.kt)("p",null,"\u6ce8\u610f",(0,i.kt)("inlineCode",{parentName:"p"},"std::string (int)"),"\u5b9e\u8d28\u662f\u4e2a\u51fd\u6570\u7b7e\u540d\uff0ctr1::function\u8ba9registerCallback\u66f4\u52a0\u7075\u6d3b\uff0c\u63a5\u53d7\u7684\u53c2\u6570\u53ef\u4ee5\u662f\u4efb\u4f55\u6ee1\u8db3\u5982\u4e0b\u6761\u4ef6\u7684\u53ef\u8c03\u7528\u5b9e\u4f53\uff1a\u53c2\u6570\u7c7b\u578b\u662fint\u6216\u8005\u53ef\u8f6c\u6362\u4e3aint\uff0c\u8fd4\u56de\u7c7b\u578b\u662fstring\u6216\u8005\u53ef\u8f6c\u6362\u4e3astring\uff0ctr1::function\u4f7f\u7528\u51fd\u6570\u6a21\u677f\u6765\u5b9e\u73b0\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-cpp"},"void registerCallback(std::tr1::function<std::string (int)> func);\n")),(0,i.kt)("p",null,"\u5bf9\u5e94\u7684\u4f8b\u5b50\u89c1Item35"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"tr1::bind\uff0c\u5728bind1st\u548cbind2nd\u7684\u57fa\u7840\u4e0a\u6539\u8fdb\uff0c\u652f\u6301const\u548c\u975econst\u65b9\u6cd5\uff0c\u652f\u6301\u5f15\u7528\u53c2\u6570\uff0c\u5bf9\u5e94\u7684\u4f8b\u5b50\u89c1Item35")),(0,i.kt)("p",null,"\u6211\u628a\u5269\u4e0b\u7684TR1\u7ec4\u4ef6\u5206\u4e3a\u4e24\u4e2a\u96c6\u5408\uff0c\u7b2c\u4e00\u4e2a\u96c6\u5408\u662f\u4e0d\u76f8\u5173\u7684\u72ec\u7acb\u529f\u80fd\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Hash\u8868\uff0cTr1\u7684hash\u8868\u6709tr1::unordered_set\uff0ctr1::unordered_multiset\uff0ctr1::unordered_map\uff0ctr1::unordered_multimap\uff0c\u8fd9\u4e9bhash\u8868\u7684\u5143\u7d20\u6ca1\u6709\u7279\u5b9a\u987a\u5e8f"),(0,i.kt)("li",{parentName:"ul"},"\u6b63\u5219\u8868\u8fbe\u5f0f\uff0c\u63d0\u4f9b\u57fa\u4e8e\u6b63\u5219\u8868\u8fbe\u5f0f\u7684\u641c\u7d22\uff0c\u66ff\u6362\uff0c\u914d\u5bf9\u7b49"),(0,i.kt)("li",{parentName:"ul"},"\u5143\u7ec4\uff0cpair\u6a21\u677f\u53ea\u80fd\u5305\u542b\u4e24\u4e2a\u5143\u7d20\uff0ctr1::tuple\u80fd\u591f\u5305\u542b\u4efb\u610f\u6570\u76ee\u7684\u5143\u7d20"),(0,i.kt)("li",{parentName:"ul"},"tr1::array\uff0c\u652f\u6301begin\u548cend\u65b9\u6cd5\u7684\u6570\u7ec4\uff0ctr1::array\u7684\u5927\u5c0f\u5728\u7f16\u8bd1\u671f\u662f\u56fa\u5b9a\u7684\uff0c\u5e76\u4e0d\u4f7f\u7528\u52a8\u6001\u5185\u5b58\u5206\u914d"),(0,i.kt)("li",{parentName:"ul"},"tr1::mem_fn\uff0c\u6d88\u5316\u5e76\u6269\u5c55\u4e86C++98\u7684mem_fun\u548cmem_fun_ref"),(0,i.kt)("li",{parentName:"ul"},"tr1::reference_wrapper\uff0c\u8ba9\u5f15\u7528\u8868\u73b0\u7684\u50cf\u5bf9\u8c61\uff0c\u4f7f\u5f97\u5bb9\u5668\u53ef\u4ee5\u5305\u542b\u5f15\u7528(\u5b9e\u9645\u4e0a\u53ea\u80fd\u5305\u542b\u5bf9\u8c61\u6216\u6307\u9488)"),(0,i.kt)("li",{parentName:"ul"},"\u968f\u673a\u6570\u751f\u6210\u5de5\u5177\uff0c\u4f18\u4e8e\u4eceC\u6807\u51c6\u5e93\u7ee7\u627f\u7684rand\u51fd\u6570\u7684\u5de5\u5177"),(0,i.kt)("li",{parentName:"ul"},"\u6570\u5b66\u7279\u5b9a\u51fd\u6570\uff0c\u5305\u62ecLaguerre\u591a\u9879\u5f0f\uff0cBessel\u51fd\u6570\uff0c\u5b8c\u5168\u692d\u5706\u79ef\u5206\u7b49\u7b49"),(0,i.kt)("li",{parentName:"ul"},"C99\u517c\u5bb9\u6269\u5c55\uff0c\u4e00\u7cfb\u5217\u51fd\u6570\u548c\u6a21\u677f\u7528\u4e8e\u5c06C99\u65b0\u7279\u6027\u52a0\u5165\u5230C++")),(0,i.kt)("p",null,"\u7b2c\u4e8c\u4e2a\u96c6\u5408\u5305\u542b\u5bf9\u66f4\u9ad8\u5c16\u7684\u6a21\u677f\u7f16\u7a0b\u6280\u672f\u7684\u652f\u6301\uff0c\u6bd4\u5982\u6a21\u677f\u5143\u7f16\u7a0b(\u89c1Item48)\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\u7279\u6027\uff0c\u7279\u6027\u7c7b\u63d0\u4f9b\u7f16\u8bd1\u65f6\u7c7b\u578b\u4fe1\u606f(\u89c1Item47)\uff0c\u7ed9\u5b9a\u7c7b\u578bT\uff0cTR1\u7279\u6027\u7c7b\u63ed\u9732T\u662f\u5426\u4e3a\u5185\u5efa\u7c7b\u578b\uff0c\u662f\u5426\u63d0\u4f9b\u865a\u6784\u51fd\u6570\uff0c\u662f\u5426\u662f\u7a7a\u7c7b(\u89c1Item39)\uff0c\u662f\u5426\u9690\u5f0f\u8f6c\u6362\u4e3a\u5176\u4ed6\u7c7b\u578bU\u7b49\u7b49\uff0c\u53e6\u5916TR1\u7279\u6027\u7c7b\u544a\u8bc9\u7c7b\u578b\u5408\u9002\u7684\u5bf9\u9f50\u65b9\u5f0f\uff0c\u8fd9\u5728\u7f16\u5199\u81ea\u5b9a\u4e49\u5185\u5b58\u5206\u914d\u51fd\u6570\u4e2d\u662f\u5341\u5206\u91cd\u8981\u7684\u4fe1\u606f"),(0,i.kt)("li",{parentName:"ul"},"tr::result_of\uff0c\u5b83\u662f\u4e00\u4e2a\u6a21\u677f\uff0c\u7528\u4e8e\u63a8\u5bfc\u51fd\u6570\u8c03\u7528\u7684\u8fd4\u56de\u7c7b\u578b\uff0c\u5f53\u7f16\u5199\u6a21\u677f\u65f6\uff0c\u80fd\u591f\u63a8\u6d4b\u51fa\u8c03\u7528\u51fd\u6570\u6a21\u677f\u7684\u8fd4\u56de\u7c7b\u578b\u5341\u5206\u91cd\u8981\uff0c\u4f46\u662f\u8fd4\u56de\u7c7b\u578b\u901a\u8fc7\u5404\u79cd\u590d\u6742\u65b9\u5f0f\u4f9d\u8d56\u4e8e\u51fd\u6570\u53c2\u6570\u7c7b\u578b\uff0ctr1::result_of\u8ba9\u5f15\u7528\u51fd\u6570\u8fd4\u56de\u7c7b\u578b\u53d8\u5f97\u7b80\u5355")),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"\u603b\u7ed3")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"C++\u6807\u51c6\u5e93\u4e3b\u8981\u5305\u542bSTL\uff0ciostream\uff0cC99\u6807\u51c6\u5e93\u7b49\uff1bTR1\u6dfb\u52a0\u4e86\u667a\u80fd\u6307\u9488\uff0c\u901a\u7528\u51fd\u6570\u6307\u9488(tr1::function)\uff0c\u57fa\u4e8ehash\u7684\u5bb9\u5668\uff0c\u6b63\u5219\u8868\u8fbe\u5f0f\u4ee5\u53ca\u5176\u4ed610\u4e2a\u7ec4\u4ef6\uff1bTR1\u672c\u8eab\u53ea\u662f\u89c4\u8303\u6587\u6863\uff0c\u53ef\u4ee5\u4f7f\u7528Boost\u63d0\u4f9b\u7684\u5b9e\u73b0"))),(0,i.kt)("h2",{id:"item55\u719f\u6089boost"},"Item55:\u719f\u6089Boost"),(0,i.kt)("p",null,"\u8fd8\u5728\u5bfb\u627e\u9ad8\u8d28\u91cf\uff0c\u5f00\u6e90\u7684\uff0c\u5e73\u53f0/\u7f16\u8bd1\u5668\u65e0\u5173\u7684\u5e93\uff1f\u770b\u770bBoost\u3002\u60f3\u8981\u52a0\u5165\u4e00\u7fa4\u6709\u62b1\u8d1f\u7684\u5929\u624dC++\u5f00\u53d1\u8005\uff0c\u81f4\u529b\u4e8e\u6700\u65b0\u7684\u5e93\u8bbe\u8ba1\u548c\u5b9e\u73b0\uff1f\u770b\u4e0bBoost\u3002\u60f3\u8981\u7784\u4e0bC++\u5c06\u6765\u957f\u4ec0\u4e48\u6837\uff1f\u77a7\u77a7Boost\uff01Boost\u65e2\u662f\u4e00\u4e2aC++\u5f00\u53d1\u793e\u533a\uff0c\u4e5f\u662f\u4e00\u4e2a\u514d\u8d39\u4e0b\u8f7dC++\u5e93\u7684\u96c6\u5408\uff0c\u5b98\u65b9\u7f51\u5740",(0,i.kt)("a",{parentName:"p",href:"https://www.boost.org%EF%BC%8C%E5%AE%83%E6%9C%89%E7%9D%80%E4%B8%A4%E7%82%B9%E5%85%B6%E4%BB%96C++%E7%A4%BE%E5%8C%BA%E5%92%8C%E7%BD%91%E7%AB%99%E6%97%A0%E6%B3%95%E6%AF%94%E6%8B%9F%E7%9A%84%E7%89%B9%E5%BE%81%EF%BC%9A"},"https://www.boost.org\uff0c\u5b83\u6709\u7740\u4e24\u70b9\u5176\u4ed6C++\u793e\u533a\u548c\u7f51\u7ad9\u65e0\u6cd5\u6bd4\u62df\u7684\u7279\u5f81\uff1a")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Boost\u7531C++\u6807\u51c6\u59d4\u5458\u4f1a\u6210\u5458\u6210\u7acb\uff0c\u548cC++\u6807\u51c6\u59d4\u5458\u4f1a\u6709\u7740\u4eb2\u5bc6\u7684\u8054\u7cfb\uff0cBoost\u7684\u76ee\u6807\u4e4b\u4e00\u4f5c\u4e3aC++\u6807\u51c6\u65b0\u7279\u6027\u7684\u8bd5\u9a8c\u573a\uff0cTR1\u5f15\u5165\u768414\u4e2a\u65b0\u5e93\u4e2d\u8d85\u8fc72/3\u7531Boost\u5b9e\u73b0"),(0,i.kt)("li",{parentName:"ul"},"\u516c\u5171\u5e73\u7b49\u7684\u4ee3\u7801\u5ba1\u67e5")),(0,i.kt)("p",null,"Boost\u4e30\u5bcc\u7684\u5e93\u5904\u7406\u5404\u79cd\u5404\u6837\u7684\u8bdd\u9898\uff0c\u53ef\u4ee5\u5206\u4e3a\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u5b57\u7b26\u4e32\u548c\u6587\u672c\u5904\u7406"),(0,i.kt)("li",{parentName:"ul"},"\u5bb9\u5668"),(0,i.kt)("li",{parentName:"ul"},"\u51fd\u6570\u5bf9\u8c61\u548c\u9ad8\u9636\u7f16\u7a0b\uff0c\u5176\u4e2d\u4e4b\u4e00\u5c31\u662flambda\u8868\u8fbe\u5f0f\uff1a"),(0,i.kt)("li",{parentName:"ul"},"\u6cdb\u578b\u7f16\u7a0b"),(0,i.kt)("li",{parentName:"ul"},"\u6a21\u677f\u5143\u7f16\u7a0b(\u89c1Item48)"),(0,i.kt)("li",{parentName:"ul"},"\u6570\u5b66\u548c\u6570\u503c"),(0,i.kt)("li",{parentName:"ul"},"\u6b63\u786e\u6027\u548c\u6d4b\u8bd5"),(0,i.kt)("li",{parentName:"ul"},"\u6570\u636e\u7ed3\u6784"),(0,i.kt)("li",{parentName:"ul"},"\u4e2d\u4ecb\u8bed\u652f\u6301"),(0,i.kt)("li",{parentName:"ul"},"\u5185\u5b58"),(0,i.kt)("li",{parentName:"ul"},"\u5176\u4ed6\u6742\u9879\uff0c\u5982CRC\u6821\u9a8c")),(0,i.kt)("p",null,"Boost\u5e93\u5305\u542b\u5f88\u591a\u4e1c\u897f\uff0c\u4f46\u4e0d\u5305\u542b\u6240\u6709\uff0c\u6bd4\u5982\u5b83\u6ca1\u6709\u63d0\u4f9bGUI\u5f00\u53d1\u5e93\uff0c\u6570\u636e\u5e93\u8fde\u63a5\u5e93\uff0c\u81f3\u5c11\u5728\u5199\u8fd9\u672c\u4e66\u65f6\u6ca1\u6709"),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"\u603b\u7ed3")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Boost\u662f\u5f00\u53d1\u5f00\u6e90\u7684\uff0c\u5e73\u7b49\u8bc4\u4f30\u7684C++\u5e93\u7684\u793e\u533a\u548c\u7f51\u7ad9\uff0c\u5bf9C++\u6807\u51c6\u6709\u7740\u91cd\u8981\u5f71\u54cd\uff1bBoost\u63d0\u4f9b\u8bb8\u591aTR1\u7ec4\u4ef6\u7684\u5b9e\u73b0\uff0c\u540c\u65f6\u8fd8\u6709\u5176\u4ed6\u66f4\u591a\u5e93"))),(0,i.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Effective C++\u82f1\u6587\u7248\u51fa\u7248\u65e5\u671f\u4e3a2005\u5e74\uff0c\u73b0\u5728\u6211\u770b\u8fd9\u672c\u4e66\u65f6\u662f2020\u5e74\uff0c\u4e66\u4e2d\u6240\u63d0\u5230\u7684\u667a\u80fd\u6307\u9488shared_ptr\uff0cweak_ptr\u548cfunction\u65e9\u57282011\u5e74\u5f00\u59cb\u5c31\u5df2\u7ecf\u5e76\u5165\u5230C++11\u4e2d\uff0c\u6210\u4e3aC++\u6807\u51c6\u5e93\u7684\u4e00\u90e8\u5206\uff0c\u56e0\u6b64\u5728\u524d\u9762\u6d89\u53ca\u5230\u7684\u4ee3\u7801\u6211\u90fd\u6539\u4e3a\u4e86",(0,i.kt)("inlineCode",{parentName:"p"},"std::shared_ptr"),"\uff0c",(0,i.kt)("inlineCode",{parentName:"p"},"std::function"),"\u800c\u4e0d\u662f\u539f\u4e66\u4e2d\u7684",(0,i.kt)("inlineCode",{parentName:"p"},"tr1::shared_ptr"),"\uff0c\u7b2c\u4e5d\u7ae0\u5e76\u4e0d\u50cf\u524d\u9762\u5185\u5bb9\u6709\u7740\u7279\u6b8a\u7684\u6280\u5de7\u6216\u8005\u6ce8\u610f\u4e8b\u9879\uff0c\u8fd9\u91cc\u603b\u7ed3\u4e3a\u4e09\u70b9\uff1a1.\u91cd\u89c6\u7f16\u8bd1\u5668\u8b66\u544a\uff1b2.\u719f\u6089",(0,i.kt)("strong",{parentName:"p"},"\u73b0\u5728"),"C++\u7248\u672c\u7684\u6807\u51c6\u5e93\uff1b3.\u4e86\u89e3",(0,i.kt)("strong",{parentName:"p"},"\u73b0\u5728\u7684"),"Boost\u4ee5\u7aa5\u89c6\u672a\u6765C++\u7684\u7279\u6027"))))}d.isMDXComponent=!0},3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return d}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),c=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},s=function(e){var t=c(e.components);return a.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,p=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),u=c(n),d=r,f=u["".concat(p,".").concat(d)]||u[d]||m[d]||i;return n?a.createElement(f,l(l({ref:t},s),{},{components:n})):a.createElement(f,l({ref:t},s))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,l=new Array(i);l[0]=u;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var c=2;c<i;c++)l[c]=n[c];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);