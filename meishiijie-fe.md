# 菜谱发布项目



## 一、组件引入

使用 import 引入的都将打包再同一个文件中，导致文件很大

使用按需加载的方式则是访问才会加载

```js
import Home from '@/views/home/Home.vue';
const Recipe = () => import( '@/views/recipe/recipe' );
const Space = () => import( /* webpackChunkName: "space" */ '@/views/user-space/space');
const MenuList = () => import( /* webpackChunkName: "space" */ '@/views/user-space/menu-list');
const Fans = () => import( /* webpackChunkName: "space" */ '@/views/user-space/fans');
// Vue中运用import的懒加载语句以及webpack的魔法注释，在项目进行webpack打包的时候，对不同模块进行代码分割，在首屏加载时，用到哪个模块再加载哪个模块，实现懒加载进行页面的优化
```

## 二、axios 封装和 proxy 跨域配置

1. ### axios

- 拦截请求
- 拦截响应
- 跨域请求配置
- 实例化 http

2. ### proxy 跨域配置

- /api
- target
- pathRewrite

## 二、recipe

1. ### el-tabs

```html
<el-tabs v-model="activeName">
	<el-tab-pane
         :name="item.parent_type"
    ></el-tab-pane>
</el-tabs>
<!--v-model 配合 name 做到数据选中的效果-->
```

2. ### 刷新时筛选项会直接选中下拉框

```js
// propertiesAcitveName 路由里有就是有
// propertiesTypes 
```

3. ### 分页与分页间隙加载视图

```html
<el-pagination
  @current-page="changePage"
  :current-page.sync="pages.currentPage"
>
</el-pagination>
<scirpt>
  methods: {
    changePage(){
      console.log(this.pages.currentPage);
      // 本来该函数是有返回参数的，当直接在 current-page.sync 时，就不用在函数内添加参数，会默认绑定
    }  
  }
</scirpt>
```

```js
let loading = null;
this.$nextTick(() => {
    loading = this.$loading({
        target: '.filter-menus-box'.
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
})
this.list = [];
this.loading = true;
getMenus(params).then((data) => {
    this.list = data.data.list;
    this.pages.pageSize = data.data.page_size;
    this.pages.total = data.data.total;
    this.pages.currentPage = data.data.current_page;
    if(loading) loading.close();
    this.pages.totalPages = Math.ceil(this.page.total/this.pages.pageSize);
})
```

## 三、菜谱页的创建

关键：实现路由中 query 的拼接；以及监听路由变化，实时加载数据渲染；

组件一上来先拿到默认的数据进行渲染：1）第一栏  —— activeName、第二栏 —— classifyType、

​																       手风琴 —— propertiesActiveName、

​																       第三栏 —— propertiesType

​																  2）基础数据：classifies、 properties

​														          3）陷阱：执行 mounted 的同时，watch 可能还监听不到路

​																       由的变化，变化后拿到数据渲染；

#### (1) 第一栏导航 —— （el-tabs）

​	选择【家常菜谱】、【中华菜系】、【各地小吃】

#### (2) 第二栏分类

​	菜品细分

#### (3) 第三栏筛选 —— （el-collapse折叠面板）

​		【工艺】、【口味】、【难度】、【人数】

​		 当再次点及其中一种，craft 会从 params 中去掉；

#### 		(4) 第四栏分页

#### 		(5)菜谱图片渲染

1. ### 属性

```js
v-model="backData.property[item.title]" 直接绑定到选中的子项 value 数值上

:value="option.type"

getProperty().then(({data}) => {
    this.backData.property = data.reduce((o, item) => {
        o[item.title] = '';
        return o;
    }, {});
    // [ { "name": "", "specs": "" }, { "name": "", "specs": "" }, { "name": "", "specs": "" } ]
})
// 拿到数据后，直接往已有的空数组上对应位置填充
```

2. ### 菜谱分类

```js
v-model="backData.classify"
:value="item.type"
// 选中的就直接填充到 backData.classify 中
```

3. ### 成品图

```js
:image-url="backData.product_pic_url" // 拿了个假图填充
@res-url="(data) => {backData.product_pic_url = data.resImgUrl}"
```

4. ### 记录所有原材料

```js
v-model="backData.raw-material.main_material"

const raw_material_struct = {
    name: '',
    specs: ''
};
raw_material: {
    main_material: Array(3).fill(1).map(() => ({...raw_materail_struct})),
    accesories_material: Array(3).fill(1).map(() => ({...raw_materail_struct}))
}
// 下面必须使用解构语法进行浅拷贝
```

子组件

```js
remove(index) {
    const newValue = this.value.filter((item, i) => {
        return i !== index;
    })
    this.$emit('input', newValue); // 此时发出的事件会被上面的父组件给默认接收，因为 v-model
}
```

5. ### 为没有唯一标识的数据添加唯一标识 （key)

```js
:key="item.customeId"

uuid() {
    n++;
    return Date.now() + n;
},
addStep() {
    this.backData.steps.push({
        ...steps_struct,
        customeId: this.uuid()
    })
},
send() {
    // 删除上传数据中不需要的字段
    // 删除字段 删除字段后，当前页面需要用到这个字段的地方可能会有问题
    // 提取出需要的字段
    param.steps = param.steps.map((item) => {
		return {
			img_url: item.img_url,
          	 describe: item.describe,
         }
    })
}
```



## 四、components

 1. ### header

    - logout：退出弹框


2. ### menuCard

   - 栅格布局 layout

3. ### uploadImg

   - el-upload 组件： （1）上传前做检测 （2）上传后将图片数据回传给父组件渲染

4. ### waterfall

   - 瀑布流，监听下拉，刷新菜单
   - waterfall组件，当下拉到最底端，会 loading 图标；
   - 然后发出事件，给父组件监听拉取数据；
   - 此过程监听 scroll ，采用了节流方法；
   - 组件销毁后，移除监听；
   - 不足，就是数据拉到底后，没能销毁监听；

## 五、 view

1. ### login & register

   #### (1) back

   #### (2) el-form 表单验证

   #### (3) 跳转后保持 el-tabs 的activeName

2. ### detail

   注意：给视图数据，尽量给先赋为空值，特别是多层的数值

   #### (1) detailHeader

   收藏

   #### (2) detailContent

   #### (3) comment

   - 未登录，登录完后会自动跳转会该 detail 页面；
   - 评论发送，不管成不成功，伪造数据，减少请求次数；

3. ### space

   （1）点击 tab ，请求数据会出现的问题，当用户频繁点击，导致请求的数据并非当前用户最后点击像请求的数据，		 所以做一层判断，是想请求的，就赋值，不是则等最后的请求返回数据，再做判断；

   （2）el-tabs 的 v-model 绑定变量，实现改变子路由参数，请求相应数据；

   （3）子路由下的组件：

   - collections 页面和 works 页面内容极为相似，直接封装为同个组件 menu-list
   - 同理，fans 和 following 页面内容也很相似，同样封装为同个组件 fans

   ####  edit

   ​		el-upload 组件： （1）上传前做检测 （2）上传后将图片数据回传给父组件渲染

4. ### create

   1. #### 属性选择

      （1）el-select 与 el-option 的使用

   2. #### 菜谱分类

      （1）el-select 和 el-option-group 和 el-option的使用

   3. #### 图片上传

   4. #### 主料和辅料

      （1）不直接修改从父组件传过来的数据 value

      （2）通过 父组件 v-model 监听子组件的 add 事件和 remove 事件

      （3）数据浅合并

