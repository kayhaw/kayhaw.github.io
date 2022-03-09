"use strict";(self.webpackChunkkayhaw_github_io=self.webpackChunkkayhaw_github_io||[]).push([[6891],{3905:function(e,r,t){t.d(r,{Zo:function(){return d},kt:function(){return m}});var n=t(7294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function l(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=n.createContext({}),u=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):l(l({},r),e)),t},d=function(e){var r=u(e.components);return n.createElement(s.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},c=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),c=u(t),m=o,v=c["".concat(s,".").concat(m)]||c[m]||p[m]||a;return t?n.createElement(v,l(l({ref:r},d),{},{components:t})):n.createElement(v,l({ref:r},d))}));function m(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=t.length,l=new Array(a);l[0]=c;var i={};for(var s in r)hasOwnProperty.call(r,s)&&(i[s]=r[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,l[1]=i;for(var u=2;u<a;u++)l[u]=t[u];return n.createElement.apply(null,l)}return n.createElement.apply(null,t)}c.displayName="MDXCreateElement"},1291:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return i},contentTitle:function(){return s},metadata:function(){return u},assets:function(){return d},toc:function(){return p},default:function(){return m}});var n=t(3117),o=t(102),a=(t(7294),t(3905)),l=["components"],i={title:"\u4e8c\u53c9\u6811\u904d\u5386",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["BiTree","Traversal"],description:"\u4e8c\u53c9\u6811\u524d\u3001\u4e2d\u3001\u540e\u3001\u5c42\u5e8f\u904d\u5386",hide_table_of_contents:!1},s=void 0,u={permalink:"/blog/2021/09/04/BiTreeTraversal",editUrl:"https://github.com/kayhaw/kayhaw.github.io/edit/master/website/blog/blog/2021-09-04-BiTreeTraversal.mdx",source:"@site/blog/2021-09-04-BiTreeTraversal.mdx",title:"\u4e8c\u53c9\u6811\u904d\u5386",description:"\u4e8c\u53c9\u6811\u524d\u3001\u4e2d\u3001\u540e\u3001\u5c42\u5e8f\u904d\u5386",date:"2021-09-04T00:00:00.000Z",formattedDate:"September 4, 2021",tags:[{label:"BiTree",permalink:"/blog/tags/bi-tree"},{label:"Traversal",permalink:"/blog/tags/traversal"}],readingTime:8.255,truncated:!0,authors:[{name:"\u4f55\u8f72",title:"Never settle down",url:"https://github.com/kayhaw",imageURL:"https://avatars.githubusercontent.com/u/16892835?v=4"}],frontMatter:{title:"\u4e8c\u53c9\u6811\u904d\u5386",author:"\u4f55\u8f72",author_title:"Never settle down",author_url:"https://github.com/kayhaw",author_image_url:"https://avatars.githubusercontent.com/u/16892835?v=4",tags:["BiTree","Traversal"],description:"\u4e8c\u53c9\u6811\u524d\u3001\u4e2d\u3001\u540e\u3001\u5c42\u5e8f\u904d\u5386",hide_table_of_contents:!1},prevItem:{title:"\u4e8c\u53c9\u6811\u57fa\u672c\u7b97\u6cd5",permalink:"/blog/2021/09/06/BiTreeBasicAlgorithms"},nextItem:{title:"Spring Boot\u5b66\u4e60(1)",permalink:"/blog/2021/08/01/SpringBoot\u53c2\u6570\u6ce8\u89e3"}},d={authorsImageUrls:[void 0]},p=[{value:"\u524d\u5e8f\u904d\u5386",id:"\u524d\u5e8f\u904d\u5386",level:2},{value:"\u9012\u5f52\u65b9\u5f0f",id:"\u9012\u5f52\u65b9\u5f0f",level:3},{value:"\u8fed\u4ee3\u65b9\u5f0f",id:"\u8fed\u4ee3\u65b9\u5f0f",level:3},{value:"\u4e2d\u5e8f\u904d\u5386",id:"\u4e2d\u5e8f\u904d\u5386",level:2},{value:"\u9012\u5f52\u65b9\u5f0f",id:"\u9012\u5f52\u65b9\u5f0f-1",level:3},{value:"\u8fed\u4ee3\u65b9\u5f0f",id:"\u8fed\u4ee3\u65b9\u5f0f-1",level:3},{value:"\u540e\u5e8f\u904d\u5386",id:"\u540e\u5e8f\u904d\u5386",level:2},{value:"\u9012\u5f52\u65b9\u5f0f",id:"\u9012\u5f52\u65b9\u5f0f-2",level:3},{value:"\u8fed\u4ee3\u65b9\u5f0f",id:"\u8fed\u4ee3\u65b9\u5f0f-2",level:3},{value:"\u5c42\u5e8f\u904d\u5386",id:"\u5c42\u5e8f\u904d\u5386",level:2}],c={toc:p};function m(e){var r=e.components,t=(0,o.Z)(e,l);return(0,a.kt)("wrapper",(0,n.Z)({},c,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"\u4e8c\u53c9\u6811\u76844\u79cd\u904d\u5386\u65b9\u5f0f\uff0c\u5c06\u904d\u5386\u7ed3\u679c\u4ee5\u5217\u8868\u5f62\u5f0f\u8fd4\u56de"),(0,a.kt)("h2",{id:"\u524d\u5e8f\u904d\u5386"},"\u524d\u5e8f\u904d\u5386"),(0,a.kt)("p",null,"\u6309\u7167\u8bbf\u95ee\u6839\u8282\u70b9-\u5de6\u5b50\u6811-\u53f3\u5b50\u6811\u7684\u987a\u5e8f\u904d\u5386\u4e8c\u53c9\u6811"),(0,a.kt)("h3",{id:"\u9012\u5f52\u65b9\u5f0f"},"\u9012\u5f52\u65b9\u5f0f"),(0,a.kt)("p",null,"\u9012\u5f52\u65b9\u6cd5\u6d41\u7a0b"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"\u5148\u5224\u65adroot\u662f\u5426\u4e3anull\uff0c\u662f\u5219\u76f4\u63a5\u8fd4\u56de"),(0,a.kt)("li",{parentName:"ol"},"root\u6dfb\u52a0\u5230\u7ed3\u679c\u5217\u8868res"),(0,a.kt)("li",{parentName:"ol"},"\u9012\u5f52\u8c03\u7528preorder\u65b9\u6cd5\uff0c\u5c06",(0,a.kt)("strong",{parentName:"li"},"\u5de6"),"\u8282\u70b9\u3001res\u4f5c\u4e3a\u53c2\u6570"),(0,a.kt)("li",{parentName:"ol"},"\u9012\u5f52\u8c03\u7528preorder\u65b9\u6cd5\uff0c\u5c06",(0,a.kt)("strong",{parentName:"li"},"\u53f3"),"\u8282\u70b9\u3001res\u4f5c\u4e3a\u53c2\u6570\n\u6ce8\u610f\u9012\u5f52\u65b9\u6cd5\u9700\u8981\u628a\u7ed3\u679c\u5217\u8868res\u4f5c\u4e3a\u53c2\u6570\u5e26\u4e0a\uff0c\u5e76\u4e14res\u5fc5\u987b\u4f5c\u4e3a\u5f15\u7528\u4f20\u5165\uff0c\u800c\u4e0d\u662f\u590d\u5236\u503c")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},"class Solution {\n    public List<Integer> preorderTraversal(TreeNode root) {\n        List<Integer> res = new ArrayList<Integer>();\n        preorder(root, res);\n        return res;\n    }\n\n    public void preorder(TreeNode root, List<Integer> res) {\n        if (root == null) {\n            return;\n        }\n        res.add(root.val);\n        preorder(root.left, res);\n        preorder(root.right, res);\n    }\n}\n")),(0,a.kt)("h3",{id:"\u8fed\u4ee3\u65b9\u5f0f"},"\u8fed\u4ee3\u65b9\u5f0f"),(0,a.kt)("p",null,"\u672c\u8d28\u4e0a\u81ea\u5df1\u4f7f\u7528\u6808\u91cd\u65b0\u8d70\u4e00\u904d\u9012\u5f52\u65b9\u6cd5"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"\u5f53\u6808\u4e0d\u4e3a\u7a7a",(0,a.kt)("strong",{parentName:"li"},"\u6216\u8005"),"\u5f53\u524d\u8fbe\u5230\u8282\u70b9node\u4e0d\u4e3anull\u65f6"),(0,a.kt)("li",{parentName:"ol"},"\u5f53node\u4e0d\u4e3a\u7a7a\u65f6\uff0c\u4e00\u76f4\u5f80\u5de6\u5b50\u8282\u70b9\u8d70\u5230\u5e95\uff0c\u6bcf\u8d70\u4e00\u6b65\u5c31\u628anode\u4fdd\u5b58\u5230res\u5217\u8868\uff0c\u5e76\u4e14\u538b\u5165\u6808"),(0,a.kt)("li",{parentName:"ol"},"node\u4e3a\u7a7a\u8868\u793a\u5df2\u7ecf\u8d70\u5230\u4e86\u67d0\u68f5\u5b50\u6811\u7684\u6700\u5de6\u8282\u70b9\uff0c\u5c06\u8be5\u5b50\u6811\u7684root\u8282\u70b9\u4ece\u6808\u4e2d\u5f39\u51fa\uff0c\u7136\u540e\u8bbf\u95ee\u8be5\u5b50\u6811\u7684\u53f3\u5b50\u6811\uff0c\u56de\u5230\u6b65\u9aa41")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},"class Solution {\n    public List<Integer> preorderTraversal(TreeNode root) {\n        List<Integer> res = new ArrayList<Integer>();\n        if (root == null) {\n            return res;\n        }\n\n        Deque<TreeNode> stack = new LinkedList<TreeNode>();\n        TreeNode node = root;\n        while (!stack.isEmpty() || node != null) {\n            while (node != null) {\n                res.add(node.val);\n                stack.push(node);\n                node = node.left;\n            }\n            node = stack.pop();\n            node = node.right;\n        }\n        return res;\n    }\n}\n")),(0,a.kt)("h2",{id:"\u4e2d\u5e8f\u904d\u5386"},"\u4e2d\u5e8f\u904d\u5386"),(0,a.kt)("p",null,"\u6309\u7167\u8bbf\u95ee\u5de6\u5b50\u6811-\u6839\u8282\u70b9-\u53f3\u5b50\u6811\u7684\u987a\u5e8f\u904d\u5386\u4e8c\u53c9\u6811"),(0,a.kt)("h3",{id:"\u9012\u5f52\u65b9\u5f0f-1"},"\u9012\u5f52\u65b9\u5f0f"),(0,a.kt)("p",null,"\u6839\u636e\u8bbf\u95ee\u987a\u5e8f\u903b\u8f91\u4fee\u6539\u4ee3\u7801\uff0c\u628a\u52a0\u5165res\u5217\u8868\u7684\u90a3\u4e00\u884c\u4ee3\u7801\u632a\u5230\u9012\u5f52\u8bbf\u95ee\u5de6\u3001\u53f3\u5b50\u6811\u7684\u4e2d\u95f4\u5373\u53ef"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java",metastring:"{12,14}","{12,14}":!0},"class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        List<Integer> res = new ArrayList<Integer>();\n        preorder(root, res);\n        return res;\n    }\n\n    public void preorder(TreeNode root, List<Integer> res) {\n        if (root == null) {\n            return;\n        }\n        // res.add(root.val);     \u8fd9\u662f\u524d\u5e8f\u904d\u5386\n        preorder(root.left, res);\n        res.add(root.val);        // \u8fd9\u662f\u4e2d\u5e8f\u904d\u5386\n        preorder(root.right, res);\n    }\n}\n")),(0,a.kt)("h3",{id:"\u8fed\u4ee3\u65b9\u5f0f-1"},"\u8fed\u4ee3\u65b9\u5f0f"),(0,a.kt)("p",null,"\u5728\u524d\u5e8f\u904d\u5386\u8fed\u4ee3\u65b9\u5f0f\u7684\u57fa\u7840\u4e0a\u4fee\u6539\u4e5f\u5f88\u7b80\u5355\uff0c\u5f53\u8d70\u5b8c\u67d0\u68f5\u5b50\u6811\u7684\u5de6\u5b50\u6811\u540e\uff0c\u4ece\u6808\u4e2d\u5f39\u51fa\u7684root\u8282\u70b9\u5c31\u662f\u8981\u8bbf\u95ee\u7684\u8282\u70b9\uff0c\u5c06\u5176\u52a0\u5165res\u5217\u8868\u5373\u53ef"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java",metastring:"{12,17}","{12,17}":!0},"class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        List<Integer> res = new ArrayList<Integer>();\n        if (root == null) {\n            return res;\n        }\n\n        Deque<TreeNode> stack = new LinkedList<TreeNode>();\n        TreeNode node = root;\n        while (!stack.isEmpty() || node != null) {\n            while (node != null) {\n                // res.add(node.val);   // \u8fd9\u662f\u524d\u5e8f\u904d\u5386\u7684\u4f4d\u7f6e\n                stack.push(node);\n                node = node.left;\n            }\n            node = stack.pop();\n            res.add(node.val);    // \u8fd9\u662f\u4e2d\u5e8f\u904d\u5386\u7684\u4f4d\u7f6e\n            node = node.right;\n        }\n        return res;\n    }\n}\n")),(0,a.kt)("h2",{id:"\u540e\u5e8f\u904d\u5386"},"\u540e\u5e8f\u904d\u5386"),(0,a.kt)("p",null,"\u6309\u7167\u8bbf\u95ee\u5de6\u5b50\u6811-\u53f3\u5b50\u6811-\u6839\u8282\u70b9\u7684\u987a\u5e8f\u904d\u5386\u4e8c\u53c9\u6811"),(0,a.kt)("h3",{id:"\u9012\u5f52\u65b9\u5f0f-2"},"\u9012\u5f52\u65b9\u5f0f"),(0,a.kt)("p",null,"\u6839\u636e\u8bbf\u95ee\u987a\u5e8f\u903b\u8f91\u4fee\u6539\u4ee3\u7801\uff0c\u628a\u52a0\u5165res\u5217\u8868\u7684\u90a3\u4e00\u884c\u4ee3\u7801\u632a\u5230\u9012\u5f52\u8bbf\u95ee\u5de6\u3001\u53f3\u5b50\u6811\u7684\u4e2d\u95f4\u5373\u53ef"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java",metastring:"{12,14,16}","{12,14,16}":!0},"class Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        List<Integer> res = new ArrayList<Integer>();\n        preorder(root, res);\n        return res;\n    }\n\n    public void preorder(TreeNode root, List<Integer> res) {\n        if (root == null) {\n            return;\n        }\n        // res.add(root.val);     \u8fd9\u662f\u524d\u5e8f\u904d\u5386\n        preorder(root.left, res);\n        // res.add(root.val);     \u8fd9\u662f\u4e2d\u5e8f\u904d\u5386\n        preorder(root.right, res);\n        res.add(root.val);        // \u8fd9\u662f\u540e\u5e8f\u904d\u5386\n    }\n}\n")),(0,a.kt)("h3",{id:"\u8fed\u4ee3\u65b9\u5f0f-2"},"\u8fed\u4ee3\u65b9\u5f0f"),(0,a.kt)("p",null,"\u540e\u5e8f\u904d\u5386\u7684\u8fed\u4ee3\u65b9\u5f0f\u53ef\u4e0d\u662f\u50cf\u4e4b\u524d\u90a3\u6837\u628a\u8bbf\u95ee\u4ee3\u7801\u632a\u5230\u6700\u540e\u3002\u76f8\u6bd4\u4e0e\u524d\u5e8f\u3001\u4e2d\u5e8f\u904d\u5386\uff0c\u540e\u5e8f\u904d\u5386\u8981\u6c42\u8bbf\u95ee\u5b8c\u5de6\u53f3\u5b50\u6811\u540e\u8bbf\u95eeroot\u8282\u70b9\uff0c\u5728\u8fed\u4ee3\u65b9\u5f0f\u4e2d\uff0c\u6808\u5f39\u51faroot\u8282\u70b9\u540e\uff0c\u5e76\u4e0d\u80fd\u786e\u5b9a\u8fd9\u4e2aroot\u8282\u70b9\u7684\u53f3\u5b50\u6811\u662f\u4e0d\u662f\u88ab\u8bbf\u95ee\u5b8c\u4e86\uff0c\u6b64\u65f6\u53ef\u4ee5\u7ec6\u5206\u4e3a3\u79cd\u60c5\u51b5\uff1a"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"root.right\u4e3a\u7a7a\uff0c\u76f4\u63a5\u5c06root\u8282\u70b9\u6dfb\u52a0\u5230res\u5217\u8868"),(0,a.kt)("li",{parentName:"ol"},"root.right\u4e0d\u4e3a\u7a7a\uff0c\u4f46\u662f\u6211\u4eec\u5df2\u7ecf\u4ece\u53f3\u5b50\u6811\u8bbf\u95ee\u56de\u6765\u4e86\uff0c\u6b64\u65f6\u4e5f\u5c06root\u8282\u70b9\u6dfb\u52a0\u5230res\u5217\u8868"),(0,a.kt)("li",{parentName:"ol"},"root.right\u4e0d\u4e3a\u7a7a\uff0c\u5e76\u4e14\u8fd8\u6ca1\u6709\u8bbf\u95ee\u8fc7\u53f3\u5b50\u6811\uff0c\u6b64\u65f6root\u5165\u6808\u7136\u540e\u8bbf\u95ee\u53f3\u5b50\u6811\n\u4e3a\u4e86\u5224\u65ad\u662f\u5426\u5df2\u7ecf\u4ece\u53f3\u5b50\u6811\u8bbf\u95ee\u56de\u6765\uff0c\u4f7f\u7528prev\u8868\u793a\u4e0a\u6b21\u4e00\u904d\u5386\u5b8c\u5b50\u6811\u7684root\u8282\u70b9\u3002")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java",metastring:"{16-23}","{16-23}":!0},"class Solution {\n    public List<Integer> postorderTraversal(TreeNode root) {\n        List<Integer> res = new ArrayList<Integer>();\n        if (root == null) {\n            return res;\n        }\n\n        Deque<TreeNode> stack = new LinkedList<TreeNode>();\n        TreeNode prev = null;\n        while (root != null || !stack.isEmpty()) {\n            while (root != null) {\n                stack.push(root);\n                root = root.left;\n            }\n            root = stack.pop();       // \u5de6\u5b50\u6811\u904d\u5386\u5b8c\uff0c\u5f39\u51fa\u6839\u8282\u70b9\n            if (root.right == null || root.right == prev) {\n                res.add(root.val);\n                prev = root;\n                root = null;          // root\u5de6\u53f3\u5b50\u6811\u904d\u5386\u5b8c\uff0c\u7f6e\u4e3anull\u540eroot\u4f1a\u6210\u4e3a\u5176\u4e0a\u4e00\u5c42\u6839\u8282\u70b9\n            } else {                  // \u904d\u5386\u53f3\u5b50\u6811\uff0c\u6ce8\u610froot\u8282\u70b9\u91cd\u65b0\u5165\u6808\n                stack.push(root);\n                root = root.right;\n            }\n        }\n        return res;\n    }\n}\n")),(0,a.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"\u540e\u5e8f\u904d\u5386\u8fd8\u6709\u4e00\u79cd\u501f\u9274\u4e24\u6b21\u7ffb\u8f6c\u601d\u60f3\u7684\u65b9\u5f0f\uff0c\u4ee5\u524d\u5e8f\u904d\u5386\u8fed\u4ee3\u4e3a\u57fa\u7840\u8fdb\u884c\u955c\u50cf\u7ffb\u8f6c\uff0c\u5373\u8bbf\u95ee\u987a\u5e8f\u4e3a\u6839\u8282\u70b9-\u53f3\u5b50\u6811-\u5de6\u5b50\u6811\uff0c\u5c06\u8fd4\u56de\u7ed3\u679c\u518d\u4e00\u6b21\u7ffb\u8f6c\u5373\u4e3a\u540e\u5e8f\u904d\u5386\u7684\u8bbf\u95ee\u7ed3\u679c\uff0c\u867d\u7136\u7ed3\u679c\u4e00\u6837\u4f46\u662f\u672c\u8d28\u4e0a\u8fd8\u662f\u4e00\u79cd\u524d\u5e8f\u904d\u5386"))),(0,a.kt)("h2",{id:"\u5c42\u5e8f\u904d\u5386"},"\u5c42\u5e8f\u904d\u5386"),(0,a.kt)("p",null,"\u5c42\u5e8f\u904d\u5386\u6309\u7167\u6bcf\u4e00\u5c42\u4ece\u5de6\u5230\u53f3\uff0c\u4ece\u4e0a\u5230\u4e0b\u904d\u5386\u5e76\u8fd4\u56de\u4e00\u4e2a\u4e8c\u7ef4\u6570\u7ec4\uff0c\u672c\u8d28\u601d\u60f3\u662f\u4f7f\u7528\u961f\u5217\u8fdb\u884c\u5e7f\u5ea6\u4f18\u5148\u641c\u7d22\uff0c\u6bcf\u6b21\u4ece\u961f\u5217\u53d6\u51fa\u4e00\u4e2a\u8282\u70b9\u540e\uff0c\u5c06\u5176\u975e\u7a7a\u5de6\u53f3\u5b50\u8282\u70b9\u52a0\u5165\u961f\u5217\u3002\u4e3a\u4e86\u533a\u5206\u5c42\u4e0e\u5c42\uff0c\u4e00\u5f00\u59cb\u6dfb\u52a0\u4e00\u4e2a\u989d\u5916null\u8282\u70b9\u4f5c\u4e3a\u6807\u8bc6"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java",metastring:"{21-23}","{21-23}":!0},"public List<List<Integer>> levelOrder(TreeNode root) {\n    List<List<Integer>> res = new ArrayList();\n\n    if(root == null)\n        return res;\n\n    Queue<TreeNode> queue = new LinkedList<>();\n    queue.offer(root);\n    queue.offer(null);\n\n    while(!queue.isEmpty()) {\n        List<Integer> level = new ArrayList<>();\n        while(queue.peek() != null) {\n            TreeNode node = queue.poll();\n            level.add(node.val);\n            if(node.left != null)\n                queue.offer(node.left);\n            if(node.right != null)\n                queue.offer(node.right);\n        }\n        queue.poll();             // \u5220\u9664null\u6807\u5fd7\u7136\u540e\u961f\u5c3e\u91cd\u65b0\u52a0\u4e0a\n        if(!queue.isEmpty())      // \u4e00\u5f00\u59cb\u76f4\u63a5\u91cd\u65b0\u63d2\u5165null\u5bfc\u81f4\u6b7b\u5faa\u73af\n            queue.offer(null);\n        res.add(level);\n    }\n    return res;\n}\n")),(0,a.kt)("p",null,"\u4e00\u79cd\u66f4\u7b80\u6d01\u7684\u65b9\u5f0f\u662f\u904d\u5386\u4e4b\u524d\u4f7f\u7528\u5f53\u524d\u961f\u5217\u957f\u5ea6\uff0c",(0,a.kt)("strong",{parentName:"p"},"\u6ce8\u610f\u4e0d\u80fd\u4f7f\u7528isEmpty\u6765\u5224\u65ad\u662f\u5426\u5c42\u5e8f\u904d\u5386\u5b8c\uff0c\u56e0\u4e3a\u904d\u5386\u8fc7\u7a0b\u4e2d\u4f1a\u6dfb\u52a0\u4e0b\u4e00\u5c42\u8282\u70b9")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-java"},"public List<List<Integer>> levelOrder(TreeNode root) {\n    List<List<Integer>> res = new ArrayList();\n\n    if(root == null)\n        return res;\n\n    Queue<TreeNode> queue = new LinkedList<>();\n    queue.offer(root);\n\n    while(!queue.isEmpty()) {\n        int levelSize = queue.size();\n        List<Integer> level = new ArrayList<>(levelSize);\n        for (int i = 0; i < levelSize; i++) {\n            TreeNode node = queue.poll();\n            level.add(node.val);\n            if(node.left != null)\n                queue.offer(node.left);\n            if(node.right != null)\n                queue.offer(node.right);\n        }\n        res.add(level);\n    }\n    return res;\n}\n")),(0,a.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"\u603b\u7ed3")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"\u4e8c\u53c9\u6811\u524d\u3001\u4e2d\u3001\u540e\u5e8f\u9012\u5f52\u904d\u5386\u5f88\u7b80\u5355\uff0c\u4e3b\u8981\u662f\u8981\u8bb0\u4f4f\u8fed\u4ee3\u904d\u5386\u601d\u8def\u3002\u524d\u3001\u4e2d\u5e8f\u8fed\u4ee3\u904d\u5386\u53ea\u662f\u8bbf\u95ee\u4ee3\u7801\u632a\u4e86\u4e0b\u4f4d\u7f6e\uff0c\u540e\u5e8f\u8fed\u4ee3\u904d\u5386\u4f1a\u66f4\u590d\u6742\u4e9b\uff0c\u7406\u6e05\u601d\u8def\u540e\u8981\u628a\u8fd9\u4e9b\u4ee3\u7801\u6a21\u677f\u90fd\u523b\u5728\u9aa8\u5b50\u91cc\uff0c\u4ee5\u4e0b\u662f\u529b\u6263\u9898\u76ee\u5730\u5740\uff0c\u8981\u6c42\u50cf\u80cc\u4e66\u4e00\u6837\u9a6c\u4e0a\u5199\u51fa\u6765\ud83d\udc4a"),(0,a.kt)("ul",{parentName:"div"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://leetcode-cn.com/problems/binary-tree-preorder-traversal/"},"\u524d\u5e8f\u904d\u5386")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://leetcode-cn.com/problems/binary-tree-inorder-traversal/"},"\u4e2d\u5e8f\u904d\u5386")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://leetcode-cn.com/problems/binary-tree-postorder-traversal/"},"\u540e\u5e8f\u904d\u5386")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://leetcode-cn.com/problems/binary-tree-level-order-traversal/"},"\u5c42\u5e8f\u904d\u5386"))))))}m.isMDXComponent=!0}}]);