"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[2113],{3905:function(e,n,t){t.d(n,{Zo:function(){return m},kt:function(){return k}});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var p=a.createContext({}),u=function(e){var n=a.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},m=function(e){var n=u(e.components);return a.createElement(p.Provider,{value:n},e.children)},s={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},c=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,i=e.originalType,p=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),c=u(t),k=r,d=c["".concat(p,".").concat(k)]||c[k]||s[k]||i;return t?a.createElement(d,l(l({ref:n},m),{},{components:t})):a.createElement(d,l({ref:n},m))}));function k(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=t.length,l=new Array(i);l[0]=c;var o={};for(var p in n)hasOwnProperty.call(n,p)&&(o[p]=n[p]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var u=2;u<i;u++)l[u]=t[u];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}c.displayName="MDXCreateElement"},7979:function(e,n,t){t.r(n),t.d(n,{assets:function(){return m},contentTitle:function(){return p},default:function(){return k},frontMatter:function(){return o},metadata:function(){return u},toc:function(){return s}});var a=t(3117),r=t(102),i=(t(7294),t(3905)),l=["components"],o={title:"Java\u5b9e\u73b0LRU\u548cLFU",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["LRU","LFU"],description:"Java\u5b9e\u73b0LRU\u548cLFU",hide_table_of_contents:!1},p=void 0,u={permalink:"/blog/2022/04/06/Java_Implement_of_LRU&LFU",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/blog/blog/2022/04/06-Java_Implement_of_LRU&LFU.md",source:"@site/blog/2022/04/06-Java_Implement_of_LRU&LFU.md",title:"Java\u5b9e\u73b0LRU\u548cLFU",description:"Java\u5b9e\u73b0LRU\u548cLFU",date:"2022-04-06T00:00:00.000Z",formattedDate:"April 6, 2022",tags:[{label:"LRU",permalink:"/blog/tags/lru"},{label:"LFU",permalink:"/blog/tags/lfu"}],readingTime:16.215,truncated:!0,authors:[{name:"\u4f55\u8f72",title:"Never settle down",url:"https://github.com/kayhaw",imageURL:"https://avatars.githubusercontent.com/u/16892835?v=4"}],frontMatter:{title:"Java\u5b9e\u73b0LRU\u548cLFU",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["LRU","LFU"],description:"Java\u5b9e\u73b0LRU\u548cLFU",hide_table_of_contents:!1},nextItem:{title:"HashMap\u77e5\u8bc6\u70b9\u603b\u7ed3",permalink:"/blog/2022/03/12/HashMapSummary"}},m={authorsImageUrls:[void 0]},s=[{value:"LRU",id:"lru",level:2},{value:"\u54c8\u5e0c\u8868\u52a0\u53cc\u5411\u94fe\u8868",id:"\u54c8\u5e0c\u8868\u52a0\u53cc\u5411\u94fe\u8868",level:3},{value:"\u7ee7\u627fLinkedHashMap",id:"\u7ee7\u627flinkedhashmap",level:3},{value:"LFU",id:"lfu",level:2},{value:"\u54c8\u5e0c\u8868\u52a0\u5e73\u8861\u4e8c\u53c9\u6811",id:"\u54c8\u5e0c\u8868\u52a0\u5e73\u8861\u4e8c\u53c9\u6811",level:3},{value:"\u53cc\u54c8\u5e0c\u8868",id:"\u53cc\u54c8\u5e0c\u8868",level:3},{value:"\u603b\u7ed3",id:"\u603b\u7ed3",level:2}],c={toc:s};function k(e){var n=e.components,t=(0,r.Z)(e,l);return(0,i.kt)("wrapper",(0,a.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"\ud83d\udcdd\u5982\u4f55\u7528Java\u6765\u5b9e\u73b0LRU\u548cLFU\u4e24\u79cd\u7b97\u6cd5"),(0,i.kt)("h2",{id:"lru"},"LRU"),(0,i.kt)("p",null,"\u6700\u8fd1\u6700\u5c11\u4f7f\u7528\u7b97\u6cd5(Least Recently Used, LRU)\u662f\u6700\u5e38\u7528\u7684\u7f13\u5b58\u6dd8\u6c70\u7b97\u6cd5\uff1a\u5f53\u7f13\u5b58\u7a7a\u95f4\u4e0d\u591f\u65f6\uff0c\u5c06\u4e0a\u4e00\u6b21\u8bbf\u95ee\u65f6\u95f4\u6700\u65e9\u7684\u8bb0\u5f55\u6dd8\u6c70\u540e\u52a0\u5165\u65b0\u8bb0\u5f55\u3002",(0,i.kt)("a",{parentName:"p",href:"https://leetcode-cn.com/problems/lru-cache/"},"Leetcode 146. LRU \u7f13\u5b58"),"\u8981\u6c42\u5b9e\u73b0\u5305\u542b\u5982\u4e0b\u65b9\u6cd5\u7684LRUCache\u7c7b\u6765\u6a21\u62dfLRU\u7f13\u5b58\uff1a"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},"LRUCache(int capacity)"),"\uff1a\u4ee5\u6b63\u6574\u6570capacity\u4f5c\u4e3a\u5bb9\u91cf\u521d\u59cb\u5316LRU\u7f13\u5b58\uff1b"),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},"int get(int key)"),"\uff1a\u5982\u679c\u5173\u952e\u5b57key\u5b58\u5728\u4e8e\u7f13\u5b58\u4e2d\uff0c\u5219\u8fd4\u56de\u5bf9\u5e94\u503c\uff0c\u5426\u5219\u8fd4\u56de-1\uff1b"),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},"void put(int key, int value)"),"\uff1a\u5982\u679c\u5173\u952e\u5b57key\u5df2\u7ecf\u5b58\u5728\uff0c\u5219\u66f4\u65b0\u5bf9\u5e94\u503c\u4e3avalue\uff1b\u5982\u679ckey\u4e0d\u5b58\u5728\u5219\u5411\u7f13\u5b58\u4e2d\u63d2\u5165key-value\uff0c\u5982\u679c\u63d2\u5165\u540e\u952e\u503c\u5bf9\u4e2a\u6570\u8d85\u8fc7capacity\uff0c\u5219\u6dd8\u6c70\u6700\u4e45\u672a\u4f7f\u7528\u7684\u952e\u503c\u5bf9\u3002")),(0,i.kt)("h3",{id:"\u54c8\u5e0c\u8868\u52a0\u53cc\u5411\u94fe\u8868"},"\u54c8\u5e0c\u8868\u52a0\u53cc\u5411\u94fe\u8868"),(0,i.kt)("p",null,"\u53ef\u4ee5\u901a\u8fc7\u54c8\u5e0c\u8868\u6765\u7ef4\u62a4\u952e\u503c\u5bf9\u7684\u552f\u4e00\u6027\u3001\u53cc\u5411\u94fe\u8868\u6765\u7ef4\u62a4\u5143\u7d20\u8bbf\u95ee\u987a\u5e8f\u4ece\u800c\u5b9e\u73b0LRU\u7f13\u5b58\u3002\u8bbe\u8ba1\u53cc\u5411\u94fe\u8868\u7684\u9996\u8282\u70b9\u662f\u6700\u65b0\u521a\u88ab\u8bbf\u95ee\u7684\u8282\u70b9\uff0c\u5c3e\u8282\u70b9\u662f\u6700\u4e45\u672a\u88ab\u8bbf\u95ee\u7684\u8282\u70b9\uff0c\u6ce8\u610f\u201c",(0,i.kt)("strong",{parentName:"p"},"\u8bbf\u95ee"),"\u201d\u5305\u542b\u67e5\u8be2\u3001\u66f4\u65b0\u3001\u65b0\u589e3\u79cd\u64cd\u4f5c\uff0c\u56e0\u6b64\u6bcf\u6b21\u8fdb\u884c\u5982\u4e0a\u64cd\u4f5c\u65f6\u90fd\u9700\u8981\u5c06\u5bf9\u5e94\u8282\u70b9\u4ece\u53cc\u5411\u94fe\u8868\u4e2d\u5220\u9664\u5e76\u632a\u52a8\u4e3a\u5934\u8282\u70b9\u3002\u5177\u4f53\u5730\uff0c\u5bf9\u4e8eget\u3001put\u65b9\u6cd5\uff0c\u8bbe\u8ba1\u903b\u8f91\u5982\u4e0b\uff1a"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"get\u65b9\u6cd5\u5148\u5224\u65adkey\u662f\u5426\u5b58\u5728\uff1b",(0,i.kt)("ol",{parentName:"li"},(0,i.kt)("li",{parentName:"ol"},"key\u4e0d\u5b58\u5728\uff0c\u8fd4\u56de-1\uff1b"),(0,i.kt)("li",{parentName:"ol"},"key\u5b58\u5728\uff0c\u8fd4\u56devalue\u3002",(0,i.kt)("strong",{parentName:"li"},"\u6b64\u65f6key\u662f\u6700\u8fd1\u88ab\u4f7f\u7528\u7684\u8282\u70b9\uff0c\u5c06\u5176\u632a\u5230\u53cc\u5411\u94fe\u8868\u7684\u5934\u90e8"),"\u3002"))),(0,i.kt)("li",{parentName:"ol"},"put\u65b9\u6cd5\u5148\u5224\u65adkey\u662f\u5426\u5b58\u5728\uff1a",(0,i.kt)("ol",{parentName:"li"},(0,i.kt)("li",{parentName:"ol"},"key\u4e0d\u5b58\u5728\uff0c\u76f4\u63a5\u63d2\u5165\u5230\u54c8\u5e0c\u8868\uff0c",(0,i.kt)("strong",{parentName:"li"},"\u63a5\u7740\u5224\u65ad\u662f\u5426\u8d85\u8fc7\u7f13\u5b58\u5927\u5c0f\uff0c\u662f\u7684\u8bdd\u5c31\u6dd8\u6c70\u94fe\u8868\u5c3e\u90e8\u7684\u952e\u503c\u5bf9"),"\uff1b"),(0,i.kt)("li",{parentName:"ol"},"key\u5b58\u5728\uff0c\u5219\u66f4\u65b0\u54c8\u5e0c\u8868\u4e2d\u5bf9\u5e94value\uff0c\u5e76\u5c06\u5176\u632a\u5230\u94fe\u8868\u5934\u90e8\uff1b"),(0,i.kt)("li",{parentName:"ol"},"\u5c06\u65b0\u589ekey\u5bf9\u5e94\u8282\u70b9\u79fb\u5230\u94fe\u8868\u5934\u90e8\u3002")))),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"\u603b\u7ed3")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"\u9664\u4e86get\u65b9\u6cd5key\u4e0d\u5b58\u5728\u5916\uff0c\u5176\u4ed6\u60c5\u51b5\u90fd\u9700\u8981\u66f4\u65b0key\u4e3a\u53cc\u5411\u4fe9\u8868\u7684\u5934\u8282\u70b9(\u522b\u5fd8\u4e86\u8fd9\u4e2a\u903b\u8f91)\u3002\u5f53\u63d2\u5165key\u5b58\u5728\u65f6\u8fd8\u9700\u8981\u5224\u65ad\u662f\u5426\u9700\u8981\u6dd8\u6c70key\u3002"))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},"public class LRUCache {\n    private Map<Integer, Integer> map;\n    private Deque<Integer> queue;\n    private int capacity;\n\n    public LRUCache(int capacity) {\n        this.map = new HashMap<>();\n        this.queue = new LinkedList<>();\n        this.capacity = capacity;\n    }\n\n    public int get(int key) {\n        if(map.containsKey(key)) {\n            removeToFirst(key);\n            return map.get(key);\n        } else {\n            return -1;\n        }\n    }\n\n    public void put(int key, int value) {\n        if(map.containsKey(key)) {\n            removeToFirst(key);\n            map.put(key, value);\n        } else {\n            queue.addFirst(key);\n            map.put(key, value);\n            if(map.size() > capacity) {\n                int last = queue.removeLast();\n                map.remove(last);\n            }\n        }\n    }\n\n    public void removeToFirst(int key) {\n        queue.remove(key);\n        queue.addFirst(key);\n    }\n\n}\n")),(0,i.kt)("h3",{id:"\u7ee7\u627flinkedhashmap"},"\u7ee7\u627fLinkedHashMap"),(0,i.kt)("p",null,"\u5b9e\u9645\u4e0a\uff0cJava\u5185\u7f6e\u7684LinkedHashMap\u7c7b\u5df2\u7ecf\u5c06\u5176\u6240\u6709\u952e\u503c\u5bf9\u7ef4\u62a4\u6210\u53cc\u5411\u94fe\u8868\uff0c\u56e0\u6b64\u53ef\u4ee5\u901a\u8fc7\u7ee7\u627fLinkedHashMap\u6765\u5feb\u901f\u5730\u5b9e\u73b0LRUCache\u7c7b\u3002LinkedHashMap\u901a\u8fc7\u5982\u4e0b3\u4e2a\u56de\u8c03\u51fd\u6570\u7ef4\u62a4\u53cc\u5411\u94fe\u8868\u7684\u987a\u5e8f\uff1a"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},"void afterNodeAccess(Node<K,V> e)"),"\uff1a\u8bbf\u95ee\u8282\u70b9e\u540e\uff0c\u5c06\u8282\u70b9e\u632a\u81f3\u53cc\u5411\u94fe\u8868\u5c3e\u90e8\uff1b")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},"void afterNodeAccess(Node<K,V> e) { // move node to last\n    LinkedHashMap.Entry<K,V> last;\n    if (accessOrder && (last = tail) != e) {\n        LinkedHashMap.Entry<K,V> p =\n            (LinkedHashMap.Entry<K,V>)e, b = p.before, a = p.after;\n        p.after = null;\n        if (b == null)\n            head = a;\n        else\n            b.after = a;\n        if (a != null)\n            a.before = b;\n        else\n            last = b;\n        if (last == null)\n            head = p;\n        else {\n            p.before = last;\n            last.after = p;\n        }\n        tail = p;\n        ++modCount;\n    }\n}\n")),(0,i.kt)("ol",{start:2},(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},"void afterNodeRemoval(Node<K,V> e)"),"\uff1a\u5220\u9664\u8282\u70b9e\u540e\uff0c\u5c06\u8282\u70b9e\u4ece\u53cc\u5411\u94fe\u8868\u4e2d\u5220\u9664\uff1b")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},"void afterNodeRemoval(Node<K,V> e) { // unlink\n    LinkedHashMap.Entry<K,V> p =\n        (LinkedHashMap.Entry<K,V>)e, b = p.before, a = p.after;\n    p.before = p.after = null;\n    if (b == null)\n        head = a;\n    else\n        b.after = a;\n    if (a == null)\n        tail = b;\n    else\n        a.before = b;\n}\n")),(0,i.kt)("ol",{start:3},(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},"void afterNodeInsertion(boolean evict)"),"\uff1a\u63d2\u5165\u8282\u70b9e\u540e\uff0c\u5224\u65ad\u662f\u5426\u5c06\u5934\u8282\u70b9\u4ece\u53cc\u5411\u94fe\u8868\u4e2d\u5220\u9664\u3002")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},"void afterNodeInsertion(boolean evict) { // possibly remove eldest\n    LinkedHashMap.Entry<K,V> first;\n    if (evict && (first = head) != null && removeEldestEntry(first)) {\n        K key = first.key;\n        removeNode(hash(key), key, null, false, true);\n    }\n}\n\nprotected boolean removeEldestEntry(Map.Entry<K,V> eldest) {\n    return false;\n}\n")),(0,i.kt)("p",null,"\u53ef\u4ee5\u770b\u5230\uff0c\u6210\u5458\u53d8\u91cfaccessOrder\u548c\u65b9\u6cd5removeEldestEntry\u5f71\u54cd\u7740\u8bbf\u95ee\u548c\u63d2\u5165\u8282\u70b9\u540e\u7684\u56de\u8c03\u51fd\u6570\u884c\u4e3a\u3002\u5176\u4e2daccessOrder\u9ed8\u8ba4\u4e3afalse\uff0c\u8868\u793a\u5143\u7d20\u8bbf\u95ee\u4e0d\u5f71\u54cd\u5b83\u5728\u53cc\u5411\u94fe\u8868\u4e2d\u7684\u4f4d\u7f6e(\u6309\u7167\u63d2\u5165\u987a\u5e8f\u6392\u5e8f\u800c\u4e0d\u662f\u8bbf\u95ee\u987a\u5e8f)\uff0c\u800cLRU\u7b97\u6cd5\u8981\u6c42\u6309\u7167\u8bbf\u95ee\u987a\u5e8f\u7ef4\u62a4\u53cc\u5411\u94fe\u8868\uff0c",(0,i.kt)("strong",{parentName:"p"},"\u56e0\u6b64\u9700\u8981\u5c06\u5176\u8bbe\u7f6e\u4e3atrue"),"\uff0c\u6b64\u65f6\u53ea\u80fd\u901a\u8fc7",(0,i.kt)("inlineCode",{parentName:"p"},"public LinkedHashMap(int initialCapacity,float loadFactor,boolean accessOrder)"),"\u6784\u9020\u51fd\u6570\u6765\u8bbe\u7f6e\u3002"),(0,i.kt)("p",null,"\u53e6\u5916\uff0cremoveEldestEntry\u65b9\u6cd5\u9ed8\u8ba4\u8fd4\u56defalse\uff0c\u8868\u793a\u5143\u7d20\u63d2\u5165\u540e\u4e0d\u6dd8\u6c70\u6700\u8001\u7684\u8282\u70b9\uff0c\u800cLRU\u7b97\u6cd5\u8981\u6c42\u7f13\u5b58\u5bb9\u91cf\u6ee1\u65f6\u5220\u9664\u6700\u8001\u8282\u70b9\uff0c\u56e0\u6b64\u9700\u8981\u91cd\u5199\u8be5\u65b9\u6cd5\u3002\u7efc\u4e0a\u6240\u8ff0\uff0c\u5b9e\u73b0\u7ee7\u627f\u81eaLinkedHashMap\u7684LRUCache\u7c7b\u4ee3\u7801\u5982\u4e0b\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},"class LRUCache extends LinkedHashMap<Integer, Integer>{\n    private int capacity;\n    \n    public LRUCache(int capacity) {\n        super(capacity, 0.75F, true);\n        this.capacity = capacity;\n    }\n\n    public int get(int key) {\n        return super.getOrDefault(key, -1);\n    }\n\n    // \u8fd9\u4e2a\u53ef\u4e0d\u5199\n    public void put(int key, int value) {\n        super.put(key, value);\n    }\n\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n        return size() > capacity; \n    }\n}\n")),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"\u6ce8\u610f")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"\u5728LinkHashMap\u4e2d\uff0c\u53cc\u5411\u94fe\u8868\u7684\u5934\u8282\u70b9\u8868\u793a\u6700\u8001\u7684\u8282\u70b9\uff0c\u800c\u5c3e\u8282\u70b9\u624d\u8868\u793a\u6700\u65b0\u7684\u8282\u70b9\u3002"))),(0,i.kt)("h2",{id:"lfu"},"LFU"),(0,i.kt)("p",null,"\u6700\u4e0d\u7ecf\u5e38\u4f7f\u7528(Least Recently Used, LRU)\u7b97\u6cd5\uff1a\u5f53\u7f13\u5b58\u7a7a\u95f4\u4e0d\u591f\u65f6\uff0c\u5c06\u8bbf\u95ee\u9891\u7387\u6700\u4f4e\u7684\u8bb0\u5f55\u6dd8\u6c70\u540e\u52a0\u5165\u65b0\u8bb0\u5f55\u3002",(0,i.kt)("a",{parentName:"p",href:"https://leetcode-cn.com/problems/lfu-cache/"},"Leetcode 460. LFU\u7f13\u5b58"),"\u8981\u6c42\u5b9e\u73b0\u5305\u542b\u5982\u4e0b\u65b9\u6cd5\u7684LFUCache\u7c7b\u6765\u6a21\u62dfLFU\u7f13\u5b58\uff1a"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},"LFUCache(int capacity)"),"\uff1a\u4ee5\u6b63\u6574\u6570capacity\u4f5c\u4e3a\u5bb9\u91cf\u521d\u59cb\u5316LFU\u7f13\u5b58\uff1b"),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},"int get(int key)"),"\uff1a\u5982\u679c\u5173\u952e\u5b57key\u5b58\u5728\u4e8e\u7f13\u5b58\u4e2d\uff0c\u5219\u8fd4\u56de\u5bf9\u5e94\u503c\uff0c\u5426\u5219\u8fd4\u56de-1\uff1b"),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("inlineCode",{parentName:"li"},"void put(int key, int value)"),"\uff1a\u5982\u679c\u5173\u952e\u5b57key\u5df2\u7ecf\u5b58\u5728\uff0c\u5219\u66f4\u65b0\u5bf9\u5e94\u503c\u4e3avalue\uff1b\u5982\u679ckey\u4e0d\u5b58\u5728\u5219\u5411\u7f13\u5b58\u4e2d\u63d2\u5165key-value\uff0c\u5982\u679c\u63d2\u5165\u540e\u952e\u503c\u5bf9\u4e2a\u6570\u8d85\u8fc7capacity\uff0c\u5219\u6dd8\u6c70\u6700\u4e0d\u7ecf\u5e38\u4f7f\u7528\u7684\u952e\u503c\u5bf9\uff0c",(0,i.kt)("strong",{parentName:"li"},"\u5982\u679c\u4f7f\u7528\u9891\u7387\u76f8\u540c\uff0c\u5219\u6dd8\u6c70\u6700\u8fd1\u6700\u4e45\u672a\u4f7f\u7528\u7684\u952e\u503c\u5bf9"),"\u3002")),(0,i.kt)("h3",{id:"\u54c8\u5e0c\u8868\u52a0\u5e73\u8861\u4e8c\u53c9\u6811"},"\u54c8\u5e0c\u8868\u52a0\u5e73\u8861\u4e8c\u53c9\u6811"),(0,i.kt)("p",null,"\u4e0e\u5b9e\u73b0LRU\u7b97\u6cd5\u4ec5\u9760\u53cc\u5411\u94fe\u8868\u5c31\u53ef\u4ee5\u5b9e\u73b0\u6309\u7167\u8bbf\u95ee\u65f6\u95f4\u5148\u540e\u6392\u5e8f\u540c\u6b65\uff0cLFU\u7b97\u6cd5\u9700\u8981\u5148\u6bd4\u9891\u7387\u518d\u6bd4\u8bbf\u95ee\u65f6\u95f4\uff0c\u8fd9\u91cc\u9009\u62e9\u5e73\u8861\u4e8c\u53c9\u6811\u6309\u7167\u8be5\u6bd4\u8f83\u903b\u8f91\u6765\u7ef4\u62a4\u952e\u503c\u5bf9\u7684\u987a\u5e8f\u3002\u5bf9\u4e8e\u6bcf\u4e2a\u8282\u70b9\uff0c\u6dfb\u52a0\u5c5e\u6027freq\u548ctime\u5206\u522b\u8868\u793a\u5bf9\u5e94key\u7684\u8bbf\u95ee\u6b21\u6570\u548c\u8bbf\u95ee\u65f6\u95f4\uff1afreq\u8d8a\u5927\u8868\u793a\u8bbf\u95ee\u9891\u7387\u8d8a\u9ad8\uff0ctime\u8d8a\u5927\u8868\u793a\u8bbf\u95ee\u65f6\u95f4\u6700\u65b0\u3002\u5177\u4f53\u5730\uff0c\u5bf9\u4e8eget\u3001put\u65b9\u6cd5\uff0c\u8bbe\u8ba1\u903b\u8f91\u5982\u4e0b\uff1a"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"get\u65b9\u6cd5\u5148\u5224\u65adkey\u662f\u5426\u5b58\u5728\uff1b",(0,i.kt)("ol",{parentName:"li"},(0,i.kt)("li",{parentName:"ol"},"key\u4e0d\u5b58\u5728\uff0c\u8fd4\u56de-1\uff1b"),(0,i.kt)("li",{parentName:"ol"},"key\u5b58\u5728\uff0c\u8fd4\u56devalue\u3002",(0,i.kt)("strong",{parentName:"li"},"\u6b64\u65f6key\u8bbf\u95ee\u6b21\u6570\u52a01\uff0c\u8bbf\u95ee\u65f6\u95f4\u52a01"),"\uff0c\u5e76\u4e14\u7531\u4e8e\u8fd9\u4e24\u4e2a\u5c5e\u6027\u503c\u6539\u53d8\uff0c\u9700\u8981\u91cd\u65b0\u5c06\u5176\u4ece\u5e73\u8861\u4e8c\u53c9\u6811\u4e2d\u5220\u9664\u518d\u63d2\u5165\uff0c\u4ee5\u7ef4\u6301\u4e8c\u53c9\u6811\u7684\u6709\u5e8f\u6027\u3002"))),(0,i.kt)("li",{parentName:"ol"},"put\u65b9\u6cd5\u5148\u5224\u65adkey\u662f\u5426\u5b58\u5728\uff1a",(0,i.kt)("ol",{parentName:"li"},(0,i.kt)("li",{parentName:"ol"},"key\u4e0d\u5b58\u5728\uff0c",(0,i.kt)("strong",{parentName:"li"},"\u5148\u5224\u65ad\u662f\u5426\u7f13\u5b58\u662f\u5426\u5df2\u6ee1\uff0c\u662f\u7684\u8bdd\u5c31\u6dd8\u6c70\u4e8c\u53c9\u6811\u4e2d\u6700\u5c0f\u7684\u8282\u70b9"),"\uff0c\u63a5\u7740\u8bbe\u7f6e\u65b0\u8282\u70b9freq=1\uff0ctime=1\u540e\u63d2\u5165\u5230\u5e73\u8861\u4e8c\u53c9\u6811\u4e2d\uff1b"),(0,i.kt)("li",{parentName:"ol"},"key\u5b58\u5728\uff0c\u5219\u66f4\u65b0\u54c8\u5e0c\u8868\u4e2d\u5bf9\u5e94value\uff0c\u540c\u65f6\u8bbf\u95ee\u6b21\u6570\u52a01\uff0c\u8bbf\u95ee\u65f6\u95f4\u52a01\uff0c\u66f4\u65b0\u4e8c\u53c9\u6811(\u5148\u5220\u9664\u518d\u63d2\u5165)\uff1b")))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},"public class LFUCache {\n    private Map<Integer, Node> map;\n    private SortedSet<Node> avl;\n    private int capacity;\n    // \u53ea\u6709\u65b0\u589e\u8bb0\u5f55\u65f6time\u624d\u4f1a\u52a01\n    private int time;\n\n    public LFUCache(int capacity) {\n        this.map = new HashMap<>();\n        this.avl = new TreeSet<>();\n        this.capacity = capacity;\n        this.time = 0;\n    }\n\n    public int get(int key) {\n        if(capacity == 0 || !map.containsKey(key)) {\n            return -1;\n        }\n        // \u901a\u8fc7\u54c8\u5e0c\u8868\u627e\u5230Node\uff0c\u66f4\u65b0\u5176\u9891\u7387\u548c\u8bbf\u95ee\u65f6\u95f4\uff0c\u8c03\u6574\u8282\u70b9\u5728TreeSet\u4e2d\u4f4d\u7f6e(\u5148\u5220\u9664\u540e\u52a0\u5165)\n        Node node = map.get(key);\n        avl.remove(node);\n        node.freq += 1;\n        node.time = ++time;\n        avl.add(node);\n        return node.value;\n    }\n\n    public void put(int key, int value) {\n        if(capacity == 0) {\n            return;\n        }\n        // 1. \u5df2\u7ecf\u5b58\u5728\u5219\u66f4\u65b0\u9891\u7387\u548c\u8bbf\u95ee\u65f6\u95f4\uff0c\u903b\u8f91\u540cget\u547d\u4e2d\n        if(map.containsKey(key)) {\n            Node node = map.get(key);\n            avl.remove(node);\n            node.freq += 1;\n            node.time = ++time;\n            node.value = value;\n            avl.add(node);\n            map.put(key, node);      // put\u548creturn\u522b\u6f0f\u4e86\uff01\n            return;\n        }\n        // 2. \u5982\u679c\u7f13\u5b58\u5df2\u6ee1\uff0c\u5148\u4ece\u4ece\u54c8\u5e0c\u8868\u548c\u5e73\u8861\u4e8c\u53c9\u6811\u4e2d\u5220\u9664\u6700\u4e0d\u5e38\u8bbf\u95ee\u8282\u70b9\n        if(map.size() == capacity) {\n            Node exile = avl.first();\n            map.remove(exile.key);\n            avl.remove(exile);\n        }\n        // 3. \u6784\u9020\u65b0\u8282\u70b9\u52a0\u5165\u5230\u54c8\u5e0c\u8868\u548c\u5e73\u8861\u4e8c\u53c9\u6811\u4e2d\n        Node node = new Node(1, ++time, key, value);\n        map.put(key, node);\n        avl.add(node);\n    }\n\n    private class Node implements Comparable<Node> {\n        private int freq;\n        private int time;\n        private int key;\n        private int value;\n\n        private Node(int freq, int time, int key, int value) {\n            this.freq = freq;\n            this.time = time;\n            this.key = key;\n            this.value = value;\n        }\n\n        // \u7531\u4e8eNode\u4f5c\u4e3aTreeSet\u7684\u5143\u7d20\uff0c\u5fc5\u987b\u91cd\u5199equals\u548chashcode\u65b9\u6cd5\n        public boolean equals(Object object) {\n            if(this == object) {\n                return true;\n            }\n            if(object instanceof Node) {\n                Node node = (Node) object;\n                return this.freq == node.freq && this.time == node.time;\n            }\n            return false;\n        }\n\n        public int hashCode() {\n            return freq * 1000000007 + time;\n        }\n\n        @Override\n        public int compareTo(Node another) {\n            return (this.freq == another.freq) ? this.time - another.time : this.freq - another.freq;\n        }\n    }\n}\n")),(0,i.kt)("p",null,"\u5728\u7f16\u7a0b\u65f6\u8981\u6ce8\u610f\u5982\u4e0b\u51e0\u70b9\uff1a"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Node\u5fc5\u987b\u91cd\u5199equals\u548chashCode\u65b9\u6cd5\uff0c\u5b9e\u73b0comparable\u63a5\u53e3\uff1b"),(0,i.kt)("li",{parentName:"ol"},"\u8282\u70b9\u8bbf\u95ee\u65f6\u95f4\u5e94\u8be5\u4f7f\u7528LFUCache\u7edf\u4e00\u7ef4\u62a4\u7684\u65f6\u949f\uff0c\u5c24\u5176\u6ce8\u610f\u66f4\u65b0\u8282\u70b9\u7684time\u4e0d\u80fd\u7b80\u5355\u5199\u6210",(0,i.kt)("inlineCode",{parentName:"li"},"node.time += 1"),"\uff1b"),(0,i.kt)("li",{parentName:"ol"},"\u5220\u9664\u3001\u66f4\u65b0\u4e8c\u53c9\u6811\u8282\u70b9\u65f6\u4e0d\u8981\u5fd8\u8bb0\u5bf9\u54c8\u5e0c\u8868\u8fdb\u884c\u76f8\u540c\u64cd\u4f5c\uff1b"),(0,i.kt)("li",{parentName:"ol"},"\u8be5\u4ee3\u7801\u5b9e\u73b0\u7684\u65f6\u95f4\u590d\u6742\u5ea6\u4e3aO(logN)\uff0c\u6ca1\u80fd\u8fbe\u5230\u539f\u9898\u8981\u6c42\u7684O(1)\u3002")),(0,i.kt)("h3",{id:"\u53cc\u54c8\u5e0c\u8868"},"\u53cc\u54c8\u5e0c\u8868"),(0,i.kt)("p",null,"\u5bf9\u4e8eLRU\u548cLFU\u7b97\u6cd5\u4e0d\u96be\u53d1\u73b0\uff1a",(0,i.kt)("strong",{parentName:"p"},"\u5f53\u4f7f\u7528\u9891\u7387\u76f8\u540c\u65f6\uff0cLFU\u5c31\u9000\u5316\u6210\u4e86LRU\uff1b\u5f53\u4f7f\u7528\u9891\u7387\u4e0d\u540c\u65f6\uff0c\u53ea\u5173\u5fc3\u4f7f\u7528\u9891\u7387\u6700\u4f4e\u7684"),"\u3002\u501f\u9274LRU\u7684\u601d\u8def\uff0c\u8bbe\u8ba1\u4e24\u4e2a\u54c8\u5e0c\u8868freqMap\u548ckeyMap\uff0c\u524d\u8005key\u4e3a\u4f7f\u7528\u9891\u7387\u800cvalue\u4e3a\u53cc\u5411\u94fe\u8868\u8282\u70b9\uff0c\u540e\u8005\u7528\u4e8e\u5b58\u50a8\u7f13\u5b58\uff0c\u5e76\u4e14\u4f7f\u7528minFreq\u4fdd\u5b58\u5f53\u524d\u6700\u4f4e\u7684\u4f7f\u7528\u9891\u7387\u3002\u5177\u4f53\u5730\uff0c\u5bf9\u4e8eget\u3001put\u65b9\u6cd5\uff0c\u8bbe\u8ba1\u903b\u8f91\u5982\u4e0b\uff1a"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"get\u65b9\u6cd5\u5148\u5224\u65adkey\u662f\u5426\u5b58\u5728\u4e8ekeyMap\u4e2d\uff1b",(0,i.kt)("ol",{parentName:"li"},(0,i.kt)("li",{parentName:"ol"},"key\u4e0d\u5b58\u5728\uff0c\u8fd4\u56de-1\uff1b"),(0,i.kt)("li",{parentName:"ol"},"key\u5b58\u5728\uff0c\u8fd4\u56devalue\u3002",(0,i.kt)("strong",{parentName:"li"},"\u6b64\u65f6key\u8bbf\u95ee\u6b21\u6570\u52a01"),"\uff0c\u5e76\u4e14\u9700\u8981\u5c06\u5176\u632a\u52a8\u5230\u5bf9\u5e94freq\u7684\u53cc\u5411\u94fe\u8868\u7684\u5934\u90e8\uff1b"),(0,i.kt)("li",{parentName:"ol"},"\u66f4\u65b0minFreq\u3002"))),(0,i.kt)("li",{parentName:"ol"},"put\u65b9\u6cd5\u5148\u5224\u65adkey\u662f\u5426\u5b58\u5728\uff1a",(0,i.kt)("ol",{parentName:"li"},(0,i.kt)("li",{parentName:"ol"},"key\u4e0d\u5b58\u5728\uff0c",(0,i.kt)("strong",{parentName:"li"},"\u5148\u5224\u65ad\u662f\u5426\u7f13\u5b58\u662f\u5426\u5df2\u6ee1\uff0c\u662f\u7684\u8bdd\u5c31\u6dd8\u6c70freqMap\u4e2dfreq\u5bf9\u5e94\u94fe\u8868\u7684\u5c3e\u8282\u70b9"),"\uff0c\u63a5\u7740\u8bbe\u7f6e\u65b0\u8282\u70b9freq=1\uff0c\u63d2\u5165\u5230freqMap\u548ckeyMap\uff1b"),(0,i.kt)("li",{parentName:"ol"},"key\u5b58\u5728\uff0c\u5219\u66f4\u65b0keyMap\u4e2d\u5bf9\u5e94value\uff0c\u5269\u4f59\u64cd\u4f5c\u540cget\u65b9\u6cd5\u547d\u4e2d\uff1b"),(0,i.kt)("li",{parentName:"ol"},"\u66f4\u65b0minFreq\u3002")))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-java"},"public class LFUCache {\n    private Map<Integer, Deque<Node>> freqMap;\n    private Map<Integer, Node> keyMap;\n    private int minFreq;\n    private int capacity;\n\n    public LFUCache(int capacity) {\n        freqMap = new HashMap<>();\n        keyMap = new HashMap<>();\n        minFreq = 0;\n        this.capacity = capacity;\n    }\n\n    public int get(int key) {\n        if(capacity == 0 || !keyMap.containsKey(key)) {\n            return -1;\n        }\n        /**\n         * \u7f13\u5b58\u547d\u4e2d\n         * 1. \u4ecekeyMap\u548cfreqMap\u4e2d\u5220\u9664\u5bf9\u5e94node\n         * 2. \u5982\u679cfreqMap\u5220\u9664node\u540e\u7684\u961f\u5217\u4e3a\u7a7a\u8868\u793a\u5df2\u7ecf\u6ca1\u6709\u8be5\u9891\u7387\u7684\u7f13\u5b58\uff0c\u6b64\u65f6\u8fdb\u4e00\u6b65\u5224\u65ad\u66f4\u65b0minFreq\n         * 3. \u66f4\u65b0freqMap\uff0c\u5c06node\u9891\u7387\u52a01\uff0c\u63d2\u5165\u5230\u5bf9\u5e94\u961f\u5217\u4e2d\n         */\n        Node node = keyMap.get(key);\n        int val = node.value, freq = node.freq;\n        Deque<Node> originQueue = freqMap.get(freq);\n        originQueue.remove(node);\n        if(originQueue.isEmpty()) {\n            freqMap.remove(freq);\n            if(minFreq == freq) {\n                minFreq += 1;\n            }\n        }\n        Deque<Node> currentQueue = freqMap.getOrDefault(freq+1, new LinkedList<>());\n        Node newNode = new Node(key, val, freq+1);\n        currentQueue.offerFirst(newNode);\n        keyMap.put(key, newNode);\n        freqMap.put(freq+1, currentQueue);\n        return node.value;\n    }\n\n    public void put(int key, int value) {\n        if(capacity == 0)   return;\n        // \u547d\u4e2d\u7f13\u5b58\u5219\u66f4\u65b0value\u503c\uff0c\u5176\u4ed6\u903b\u8f91\u540cget\u547d\u4e2d\uff0c\n        if(keyMap.containsKey(key)) {\n            Node node = keyMap.get(key);\n            Deque<Node> originQueue = freqMap.get(node.freq);\n            originQueue.remove(node);\n            if(originQueue.isEmpty()) {\n                freqMap.remove(node.freq);\n                if(minFreq == node.freq) {\n                    minFreq += 1;\n                }\n            }\n            node.value = value;\n            node.freq++;\n            Deque<Node> newQueue = freqMap.getOrDefault(node.freq, new LinkedList<>());\n            newQueue.offerFirst(node);\n            freqMap.put(node.freq, newQueue);\n        } else {\n            /**\n             * \u589e\u52a0\u7f13\u5b58\u4e4b\u524d\u5148\u5224\u65ad\u662f\u5426\u5df2\u6ee1\uff0c\u6dd8\u6c70\u903b\u8f91\n             * 1. \u627e\u5230minFreq\u5bf9\u5e94\u7684queue\n             * 2. queue\u5220\u9664\u5176\u5c3e\u8282\u70b9\n             * 3. keyMap\u5220\u9664\u8282\u70b9\n             * 4. \u5982\u679cqueue\u5220\u9664\u540e\u4e3a\u7a7a\u9700\u8981\u79fb\u9664\u6574\u4e2a\u961f\u5217\n             * 5. \u91cd\u65b0\u8bbe\u7f6eminFreq\u4e3a1\n             */\n            if(keyMap.size() == capacity) {\n                Deque<Node> minQueue = freqMap.get(minFreq);\n                Node exile = minQueue.getLast();\n                keyMap.remove(exile.key);\n                minQueue.removeLast();\n                // \u4e0d\u9700\u8981\u79fb\u9664\uff0c\u590d\u7528\u961f\u5217\n                // if(minQueue.isEmpty()) {\n                //    freqMap.remove(minFreq);\n                // }\n            }\n            /**\n             * \u65b0\u589e\u8282\u70b9\u903b\u8f91\n             * 1. \u521d\u59cbfreq\u4e3a1\n             * 2. keyMap\u548cqueue\u6dfb\u52a0\u8282\u70b9\n             * 3. \u8bbe\u7f6eminFreq\u4e3a1\n             */\n            Node node = new Node(key, value, 1);\n            Deque<Node> minQueue = freqMap.getOrDefault(1, new LinkedList<>());\n            minQueue.addFirst(node);\n            keyMap.put(key, node);\n            freqMap.put(1, minQueue);\n            minFreq = 1;\n        }\n    }\n\n    private class Node {\n        public int key;\n        public int value;\n        public int freq;\n\n        public Node(int key, int value, int freq) {\n            this.key = key;\n            this.value = value;\n            this.freq = freq;\n        }\n    }\n\n}\n")),(0,i.kt)("p",null,"\u5728\u7f16\u7a0b\u65f6\u8981\u6ce8\u610f\u5982\u4e0b\u51e0\u70b9\uff1a"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Map\u63a5\u53e3\u7684getOrDefault\u65b9\u6cd5\u4e0d\u4f1a\u5c06\u9ed8\u8ba4\u8fd4\u56de\u503c\u52a0\u5165\u5230\u54c8\u5e0c\u8868\uff0c\u4e00\u5f00\u59cb\u81ea\u8ba4\u4e3a\u4f1a\u81ea\u52a8\u52a0\u5165\u5bfc\u81f4\u4ee3\u7801\u62a5\u7a7a\u6307\u9488\u5f02\u5e38\ud83e\udd21\uff1b"),(0,i.kt)("li",{parentName:"ol"},"freqMap\u7684key\u4e3a\u9891\u7387\u5927\u5c0f\u800c\u4e0d\u662f\u7f13\u5b58key\uff0c\u624b\u5feb\u5199\u6210freqMap.put(key, queue)\uff0c\u6b63\u786e\u5e94\u4e3afreqMap.put(freq, queue)\uff1b"),(0,i.kt)("li",{parentName:"ol"},"put\u65b9\u6cd5\u6ca1\u6709\u8003\u8651capacity=0\u60c5\u51b5\uff0c\u5bfc\u81f4\u4e00\u4e0a\u6765\u5c31\u662fput\u64cd\u4f5c\u65f6\u51fa\u73b0\u7a7a\u6307\u9488\u5f02\u5e38\u3002")),(0,i.kt)("h2",{id:"\u603b\u7ed3"},"\u603b\u7ed3"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"LinkHashMap\u5728\u5143\u7d20\u8bbf\u95ee\u3001\u5220\u9664\u3001\u63d2\u5165\u5206\u522b\u5bf9\u5e943\u4e2a\u56de\u8c03\u51fd\u6570\uff0c\u901a\u8fc7\u4fee\u6539\u5f71\u54cd\u8fd93\u4e2a\u56de\u8c03\u51fd\u6570\u7684\u53d8\u91cf\u548c\u65b9\u6cd5\u6765\u5b9e\u73b0\u81ea\u5b9a\u4e49LRU\u7c7b\uff1b"),(0,i.kt)("li",{parentName:"ol"},"LinkHashMap\u7684\u53cc\u5411\u94fe\u8868\u5934\u8282\u70b9\u662f\u6700\u8001\u7684\u8282\u70b9\uff0c\u800c\u5c3e\u8282\u70b9\u624d\u662f\u6700\u65b0\u7684\u8282\u70b9\uff0c\u6216\u8005\u76f8\u53cd\uff0c\u4f46\u603b\u4e4b\u4e00\u5b9a\u8981\u5220\u9664\u6700\u65e7\u8282\u70b9\uff1b"),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"\u672a\u6765\u5f00\u53d1sourcesflow\u65f6\uff0c\u5404\u79cd\u8bfb\u5199\u63d2\u4ef6\u52a0\u8f7d\u540e\u7684\u7ef4\u62a4\u4e5f\u9700\u8981\u7528\u5230LRU\u7b97\u6cd5"),"\uff1b"),(0,i.kt)("li",{parentName:"ol"},"\u4f7f\u7528\u54c8\u5e0c\u8868\u52a0FIFO\u961f\u5217\u5b9e\u73b0LRU\uff0c\u4f7f\u7528\u54c8\u5e0c\u8868\u52a0AVL\u6216\u8005\u53cc\u54c8\u5e0c\u8868(\u522b\u5fd8\u4e86minFreq)\u5b9e\u73b0LFU\u3002\u5b9e\u73b0\u7b97\u6cd5\u90fd\u662f\u7c7b\u4f3c\u7684\uff1a\u7528\u4e00\u4e2a\u54c8\u5e0c\u8868\u7ef4\u62a4\u7f13\u5b58\u66f4\u65b0\uff0c\u7528\u53e6\u4e00\u79cd\u6570\u636e\u7ed3\u6784\u7ef4\u62a4\u7f13\u5b58\u6392\u5e8f\uff1b"),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("strong",{parentName:"li"},"\u65e0\u8bba\u662fget\u8fd8\u662fput\u65b9\u6cd5\uff0c\u90fd\u8981\u89c6\u4e3a\u201c\u8bbf\u95ee\u201d\u6b21\u6570\u52a01"),"\u3002")))}k.isMDXComponent=!0}}]);