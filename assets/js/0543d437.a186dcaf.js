"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[2673],{902:function(t,n,e){e.r(n),e.d(n,{assets:function(){return f},contentTitle:function(){return s},default:function(){return d},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return c}});var i=e(3117),r=e(102),a=(e(7294),e(3905)),o=["components"],l={title:"\u6bcf\u65e5\u7b97\u6cd5\u9898-\u5b57\u7b26\u4e32\u7684\u6392\u5217",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["Algorithm"],description:"\u6bcf\u65e5\u7b97\u6cd5\u9898-\u5b57\u7b26\u4e32\u7684\u6392\u5217",hide_table_of_contents:!1},s=void 0,u={permalink:"/blog/2021/10/10/CheckInclusion",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/blog/blog/2021-10-10-CheckInclusion.mdx",source:"@site/blog/2021-10-10-CheckInclusion.mdx",title:"\u6bcf\u65e5\u7b97\u6cd5\u9898-\u5b57\u7b26\u4e32\u7684\u6392\u5217",description:"\u6bcf\u65e5\u7b97\u6cd5\u9898-\u5b57\u7b26\u4e32\u7684\u6392\u5217",date:"2021-10-10T00:00:00.000Z",formattedDate:"October 10, 2021",tags:[{label:"Algorithm",permalink:"/blog/tags/algorithm"}],readingTime:6.445,truncated:!0,authors:[{name:"\u4f55\u8f72",title:"Never settle down",url:"https://github.com/kayhaw",imageURL:"https://avatars.githubusercontent.com/u/16892835?v=4"}],frontMatter:{title:"\u6bcf\u65e5\u7b97\u6cd5\u9898-\u5b57\u7b26\u4e32\u7684\u6392\u5217",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["Algorithm"],description:"\u6bcf\u65e5\u7b97\u6cd5\u9898-\u5b57\u7b26\u4e32\u7684\u6392\u5217",hide_table_of_contents:!1},prevItem:{title:"\u6bcf\u65e5\u7b97\u6cd5\u9898-\u94fe\u8868\u76f8\u5173\u603b\u7ed3",permalink:"/blog/2021/10/13/LinkedListAlogrithms"},nextItem:{title:"Random\u5bfc\u81f4\u7684\u963b\u585e\u95ee\u9898",permalink:"/blog/2021/09/21/AProblemCausedByRandom"}},f={authorsImageUrls:[void 0]},c=[{value:"\u539f\u9898\u63cf\u8ff0",id:"\u539f\u9898\u63cf\u8ff0",level:2},{value:"\u89e3\u9898\u601d\u8def",id:"\u89e3\u9898\u601d\u8def",level:2},{value:"\u65b9\u6848\u4f18\u5316",id:"\u65b9\u6848\u4f18\u5316",level:2},{value:"\u9898\u76ee\u6539\u8fdb",id:"\u9898\u76ee\u6539\u8fdb",level:2},{value:"\u603b\u7ed3",id:"\u603b\u7ed3",level:2}],p={toc:c};function d(t){var n=t.components,e=(0,r.Z)(t,o);return(0,a.kt)("wrapper",(0,i.Z)({},p,e,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"\u6bcf\u65e5\u7b97\u6cd5\u9898-\u5b57\u7b26\u4e32\u7684\u6392\u5217"),(0,a.kt)("h2",{id:"\u539f\u9898\u63cf\u8ff0"},"\u539f\u9898\u63cf\u8ff0"),(0,a.kt)("p",null,"\u7ed9\u4f60\u4e24\u4e2a\u5b57\u7b26\u4e32s1\u548cs2\uff0c\u5199\u4e00\u4e2a\u51fd\u6570\u6765\u5224\u65ads2\u662f\u5426\u5305\u542bs1\u7684\u6392\u5217\u3002\u5982\u679c\u662f\uff0c\u8fd4\u56detrue\uff1b\u5426\u5219\uff0c\u8fd4\u56defalse\u3002\u6362\u53e5\u8bdd\u8bf4\uff0cs1\u7684\u6392\u5217\u4e4b\u4e00\u662fs2\u7684\u5b50\u4e32\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash",metastring:"title=\u793a\u4f8b",title:"\u793a\u4f8b"},'\u8f93\u5165\uff1as1 = "ab" s2 = "eidbaooo"\n\u8f93\u51fa\uff1atrue\n\u89e3\u91ca\uff1as2 \u5305\u542b s1 \u7684\u6392\u5217\u4e4b\u4e00 ("ba").\n\n\u8f93\u5165\uff1as1= "ab" s2 = "eidboaoo"\n\u8f93\u51fa\uff1afalse\n')),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u63d0\u793a\uff1a1 <= s1.length, s2.length <= 10^4\uff0cs1\u548cs2\u4ec5\u5305\u542b\u5c0f\u5199\u5b57\u6bcd")),(0,a.kt)("h2",{id:"\u89e3\u9898\u601d\u8def"},"\u89e3\u9898\u601d\u8def"),(0,a.kt)("p",null,"\u9898\u76ee\u610f\u601d\u662f\u6c42\u8bc1\u662f\u5426\u5b58\u5728s2\u5b50\u4e32sub2\uff0c\u4f7f\u5f97sub2\u4e3as1\u7684\u4e00\u79cd\u6392\u5217\uff0c\u8fd9\u91cc\u53ea\u9700\u8981\u5173\u5fc3sub2\u4e2d\u5b57\u7b26\u7c7b\u578b\u548c\u4e2a\u6570\u4e0es1\u7684\u76f8\u7b49\u5373\u53ef\uff0c\u7531\u4e8e\u5df2\u7ecf\u63d0\u793as1\u548cs2\u4ec5\u5305\u542b\u5c0f\u5199\u5b57\u6bcd\uff0c\u53ef\u4ee5\u76f4\u63a5\u4f7f\u7528\u957f\u5ea6\u4e3a26\u7684int\u6570\u7ec4\u6765\u8bb0\u5f55\u6bcf\u4e2a\u5c0f\u5199\u5b57\u6bcd\u51fa\u73b0\u4e2a\u6570"),(0,a.kt)("p",null,"\u5bf9\u4e8e\u76ee\u6807\u4e32s1\u548c\u5b50\u4e32sub2\uff0c\u5206\u522b\u4f7f\u7528",(0,a.kt)("inlineCode",{parentName:"p"},"int pattern[26]"),"\u548c",(0,a.kt)("inlineCode",{parentName:"p"},"int window[26]"),"\u6765\u8bb0\u5f55\u5b57\u7b26\u51fa\u73b0\u60c5\u51b5\u3002\u5982\u679cparttern","[26]","\u6bcf\u4e2a\u5143\u7d20\u7b49\u4e8ewindow","[26]","\uff0c\u8bf4\u660e\u6b64\u65f6sub2\u662fs1\u7684\u4e00\u79cd\u6392\u5217\u3002\u63a5\u4e0b\u6765\u8fd8\u8981\u786e\u5b9asub2\u5185\u5bb9\uff0c\u7531\u4e8esub2\u957f\u5ea6\u7b49\u4e8es1\u957f\u5ea6\uff0c\u4f7f\u7528\u56fa\u5b9a\u5927\u5c0f\u7684\u6ed1\u52a8\u7a97\u53e3\u5728s2\u4e0a\u79fb\u52a8\u5f97\u5230sub2\uff0c\u5177\u4f53\u4ee3\u7801\u5982\u4e0b\u6240\u793a\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},"class Solution {\n    public boolean checkInclusion(String s1, String s2) {\n        int[] pattern = new int[26];\n        int[] window = new int[26];\n        int patternSize = s1.length(), sourceSize = s2.length();\n        if(patternSize > sourceSize)\n            return false;\n        // \u521d\u59cb\u7edf\u8ba1\n        for (int i = 0; i < patternSize; i++) {\n            pattern[s1.charAt(i)-'a']++;\n            window[s2.charAt(i)-'a']++;\n        }\n        // \u5224\u65ad\u4e00\u5f00\u59cb\u7a97\u53e3\u662f\u5426\u6ee1\u8db3\u6761\u4ef6\n        if(Arrays.equals(pattern, window)) {\n            return true;\n        }\n        // \u7a97\u53e3\u6ed1\u52a8\uff0c\u5224\u65ad\u662f\u5426\u6ee1\u8db3\u6761\u4ef6\n        for (int i = patternSize; i < sourceSize; ++i) {\n            window[s2.charAt(i)-'a']++;   // \u5de6\u4fa7\u5b57\u7b26\u4e2a\u6570\u51cf1\n            window[s2.charAt(i-patternSize)-'a']--; // \u53f3\u4fa7\u5b57\u7b26\u4e2a\u6570\u52a01\n            if(Arrays.equals(pattern, window)) {\n                return true;\n            }\n        }\n        return false;\n    }\n}\n")),(0,a.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"\u7f16\u7a0b\u4e8b\u9879")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("ul",{parentName:"div"},(0,a.kt)("li",{parentName:"ul"},"\u5f53s1\u957f\u5ea6\u5927\u4e8es2\u65f6\u76f4\u63a5\u8fd4\u56defalse"),(0,a.kt)("li",{parentName:"ul"},"\u9996\u5148\u786e\u5b9a\u7b2c\u4e00\u4e2a\u6ed1\u52a8\u7a97\u53e3\u5b57\u7b26\u60c5\u51b5\u5e76\u5224\u65ad\u6bd4\u8f83\uff0c\u7136\u540e\u624d\u6ed1\u52a8\u7a97\u53e3"),(0,a.kt)("li",{parentName:"ul"},"\u4f7f\u7528Arrays.equals(int[], int[])\u65b9\u6cd5\u8fdb\u884c\u6570\u7ec4\u6bd4\u8f83")))),(0,a.kt)("h2",{id:"\u65b9\u6848\u4f18\u5316"},"\u65b9\u6848\u4f18\u5316"),(0,a.kt)("p",null,"\u4e0a\u8ff0\u89e3\u51b3\u65b9\u6848\u6bcf\u6b21\u786e\u5b9asub2\u662f\u5426\u4e3as1\u7684\u6392\u5217\u65f6\uff0c\u90fd\u8981\u5bf9\u4e24\u4e2a\u7edf\u8ba1\u6570\u7ec4\u7684\u6bcf\u4e2a\u5143\u7d20\u4f9d\u6b21\u6bd4\u8f83\u5927\u5c0f\uff0c\u5b9e\u9645\u4e0a\u7a97\u53e3\u6ed1\u52a8\u65f6\uff0c\u53ea\u4f1a\u51fa\u53bb1\u4e2a\u5b57\u7b26\uff0c\u52a0\u51651\u4e2a\u5b57\u7b26\uff0c\u5373window\u6570\u7ec4\u53ea\u4f1a\u6539\u53d82\uff08\u62160\uff0c\u51fa\u53bb\u8fdb\u6765\u662f\u540c\u4e00\u4e2a\u5b57\u7b26\uff09\u4e2a\u5143\u7d20\u503c\uff0c\u6ca1\u6709\u5fc5\u8981\u91cd\u65b0\u6bd4\u8f83\u8fd926\u4e2a\u5143\u7d20\u5927\u5c0f"),(0,a.kt)("p",null,"\u4e3a\u6b64\uff0c\u53ea\u4f7f\u7528\u4e00\u4e2a",(0,a.kt)("inlineCode",{parentName:"p"},"int diff[26]"),"\u6570\u7ec4\u6765\u8868\u793as1\u548csub2\u4e2d\u6bcf\u4e2a\u5b57\u7b26\u7684\u4e2a\u6570\u5dee\uff0c\u518d\u7528\u53d8\u91cfdiffCount\u8868\u793adiff\u6570\u7ec4\u4e2d\u5143\u7d20\u4e0d\u4e3a0\u7684\u4e2a\u6570\uff0c\u5f53diffCount\u4e3a0\u65f6\u5373\u8868\u660esub2\u662fs1\u7684\u4e00\u79cd\u6392\u5217\uff0c\u5b9e\u73b0\u4ee3\u7801\u5982\u4e0b\u6240\u793a\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},"class Solution {\n    public boolean checkInclusion(String s1, String s2) {\n        int[] diff = new int[26];\n        int patternSize = s1.length(), sourceSize = s2.length();\n        int diffCount = 0, left, right;\n\n        if(patternSize > sourceSize)\n            return false;\n        // \u521d\u59cb\u7edf\u8ba1\n        for (int i = 0; i < patternSize; i++) {\n            diff[s1.charAt(i)-'a']++;\n            diff[s2.charAt(i)-'a']--;\n        }\n        for (int i = 0; i < 26; i++) {\n            if(diff[i] != 0) {\n                diffCount++;\n            }\n        }\n        // \u5224\u65ad\u4e00\u5f00\u59cb\u7a97\u53e3\u662f\u5426\u6ee1\u8db3\u6761\u4ef6\n        if(diffCount == 0) {\n            return true;\n        }\n        // \u6ed1\u52a8\u7a97\u53e3\uff0c\u5224\u65ad\u662f\u5426\u6ee1\u8db3\u6761\u4ef6\n        for (int i = patternSize; i < sourceSize; ++i) {\n            left = s2.charAt(i-patternSize)-'a';\n            right = s2.charAt(i)-'a';\n            if(left == right) {\n                continue;\n            }\n            if(diff[left] == 0) {\n                diffCount++;\n            }\n            ++diff[left];           // \u6ce8\u610f\u662f\u52a01\n            if(diff[left] == 0) {\n                diffCount--;\n            }\n            if(diff[right] == 0) {\n                diffCount++;\n            }\n            --diff[right];          // \u6ce8\u610f\u662f\u51cf1\n            if(diff[right] == 0) {\n                diffCount--;\n            }\n            if(diffCount == 0) {\n                return true;\n            }\n        }\n        return false;\n    }\n}\n")),(0,a.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"\u6ce8\u610f")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("ul",{parentName:"div"},(0,a.kt)("li",{parentName:"ul"},"\u9996\u5148\u9700\u8981\u5224\u65ad\u51fa\u53bb\u8fdb\u6765\u7684\u5b57\u7b26\u662f\u5426\u76f8\u540c\uff0c\u82e5\u76f8\u540c\u76f4\u63a5\u5f80\u4e0b\u6ed1"),(0,a.kt)("li",{parentName:"ul"},"\u5728\u66f4\u65b0\u5b57\u7b26\u4e2a\u6570\u5dee\u4e4b\u524d\uff0c\u5982\u679c\u5b57\u7b26\u4e2a\u6570\u5dee\u4e3a0\uff0c\u6b64\u65f6\u9700\u8981\u7ed9diffCount\u52a01(\u51fa\u73b0\u4e86\u65b0\u7684\u4e2a\u6570\u4e0d\u76f8\u540c\u5b57\u7b26)\uff0c\u5426\u5219\u4e0d\u9700\u8981"),(0,a.kt)("li",{parentName:"ul"},"\u66f4\u65b0\u5b57\u7b26\u4e2a\u6570\u5dee\uff0c\u7531\u4e8ediff\u4fdd\u5b58\u7684\u662fs1\u5b57\u7b26\u4e2a\u6570\u51cf\u53bbsub2\u5b57\u7b26\u4e2a\u6570\uff0c\u6240\u4ee5\u51fa\u53bb\u7684\u5b57\u7b26\u4f4d\u7f6eleft\u5bf9\u5e94\u5143\u7d20\u52a01\uff0c\u800c\u4e0d\u662f\u51cf1\uff0c\u76f8\u53cd\u5730\uff0c\u8fdb\u6765\u7684\u5b57\u7b26\u4f4d\u7f6eright\u5bf9\u5e94\u5143\u7d20\u51cf1"),(0,a.kt)("li",{parentName:"ul"},"\u66f4\u65b0\u5b8cleft\u548cright\u7684\u5b57\u7b26\u4e2a\u6570\u5dee\u540e\uff0c\u5982\u679c\u5b57\u7b26\u4e2a\u6570\u5dee\u4e3a0\uff0c\u9700\u8981\u5c06diffCount\u51cf1\uff0c\u6700\u540e\u770bdiffCount\u662f\u5426\u4e3a0")))),(0,a.kt)("h2",{id:"\u9898\u76ee\u6539\u8fdb"},"\u9898\u76ee\u6539\u8fdb"),(0,a.kt)("p",null,"\u5c06\u9898\u76ee\u6539\u4e3a\u8f93\u51fa\u6240\u6709\u6ee1\u8db3\u6761\u4ef6\u7684\u5b50\u4e32sub2\u7684\u8d77\u59cb\u4f4d\u7f6e\uff0c\u4f5c\u4e3a\u6570\u7ec4\u8fd4\u56de\u3002",(0,a.kt)("strong",{parentName:"p"},"\u6b64\u65f6\u9700\u8981\u6ce8\u610f\uff0c\u5f53left\u548cright\u76f8\u7b49\u65f6\u4e0d\u80fd",(0,a.kt)("inlineCode",{parentName:"strong"},"continue"),"\u8df3\u8fc7"),"\uff0c\u5426\u5219\u4f1a\u9519\u5931\u6b63\u786e\u7b54\u6848\uff0c\u6bd4\u5982s1\u4e3a\u201cab\u201d\uff0cs2\u4e3a\u201cabab\u201d\uff0c\u6b64\u65f6\u4f1a\u56e0\u4e3a\u8df3\u8fc7\u800c\u6f0f\u6389\u4e86\u4f4d\u7f6e1\uff0c2"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},"for (int i = 0; i < patternLen; i++) {\n    ++diff[s.charAt(i) - 'a'];\n    --diff[p.charAt(i) - 'a'];\n}\nfor (int i : diff) {\n    if(i != 0) {\n        ++diffCount;\n    }\n}\nif(diffCount == 0) {\n    ans.add(0);\n}\n\nfor (int i = patternLen; i < sourceLen; i++) {\n    left = s.charAt(i-patternLen) - 'a';\n    right = s.charAt(i) - 'a';\n    if(diff[left] == 0) {\n        ++diffCount;        // \u6ce8\u610f\u8fd9\u91cc\u662f+1\uff0cdiff[]\u542b\u4e49\u6539\u53d8\u4e86\n    }\n    --diff[left];\n    if(diff[left] == 0) {\n        --diffCount;\n    }\n    if(diff[right] == 0) {\n        ++diffCount;\n    }\n    ++diff[right];\n    if(diff[right] == 0) {\n        --diffCount;\n    }\n    if(diffCount == 0) {\n        ans.add(i-patternLen+1);    // \u6ce8\u610f\u7b54\u6848\u4f4d\u7f6e\u7684\u8ba1\u7b97\u8981\u52a01\n    }\n}\n")),(0,a.kt)("h2",{id:"\u603b\u7ed3"},"\u603b\u7ed3"),(0,a.kt)("p",null,"\u4f18\u5316\u65b9\u6848\u6709\u4e24\u4e2a\u5751\uff0c\u4e00\u662f\u9700\u8981\u5224\u65adleft\u548cright\u662f\u5426\u76f8\u540c(\u4e0d\u5f71\u54cd\u7ed3\u679c\u6b63\u786e\u6027\uff0c\u8df3\u8fc7\u53ef\u4ee5\u51cf\u5c11\u4e0d\u5fc5\u8981\u7684\u4ee3\u7801\u6267\u884c)\uff0c\u4e8c\u662f\u66f4\u65b0diff","[left]","\u548cdiff","[right]","\u9700\u8981\u7406\u6e05\u695a\u5230\u5e95\u662f\u52a01\u8fd8\u662f\u51cf1"))}d.isMDXComponent=!0},3905:function(t,n,e){e.d(n,{Zo:function(){return f},kt:function(){return d}});var i=e(7294);function r(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}function a(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable}))),e.push.apply(e,i)}return e}function o(t){for(var n=1;n<arguments.length;n++){var e=null!=arguments[n]?arguments[n]:{};n%2?a(Object(e),!0).forEach((function(n){r(t,n,e[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):a(Object(e)).forEach((function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}))}return t}function l(t,n){if(null==t)return{};var e,i,r=function(t,n){if(null==t)return{};var e,i,r={},a=Object.keys(t);for(i=0;i<a.length;i++)e=a[i],n.indexOf(e)>=0||(r[e]=t[e]);return r}(t,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);for(i=0;i<a.length;i++)e=a[i],n.indexOf(e)>=0||Object.prototype.propertyIsEnumerable.call(t,e)&&(r[e]=t[e])}return r}var s=i.createContext({}),u=function(t){var n=i.useContext(s),e=n;return t&&(e="function"==typeof t?t(n):o(o({},n),t)),e},f=function(t){var n=u(t.components);return i.createElement(s.Provider,{value:n},t.children)},c={inlineCode:"code",wrapper:function(t){var n=t.children;return i.createElement(i.Fragment,{},n)}},p=i.forwardRef((function(t,n){var e=t.components,r=t.mdxType,a=t.originalType,s=t.parentName,f=l(t,["components","mdxType","originalType","parentName"]),p=u(e),d=r,m=p["".concat(s,".").concat(d)]||p[d]||c[d]||a;return e?i.createElement(m,o(o({ref:n},f),{},{components:e})):i.createElement(m,o({ref:n},f))}));function d(t,n){var e=arguments,r=n&&n.mdxType;if("string"==typeof t||r){var a=e.length,o=new Array(a);o[0]=p;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=t,l.mdxType="string"==typeof t?t:r,o[1]=l;for(var u=2;u<a;u++)o[u]=e[u];return i.createElement.apply(null,o)}return i.createElement.apply(null,e)}p.displayName="MDXCreateElement"}}]);