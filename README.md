# Vue3.x 新特性

# 官网

https://v3.cn.vuejs.org/

# 项目源码

https://github.com/vuejs/core

vue3 相比 vue2 所有的源码都是用 ts 书写:
优点: 引入数据类型的概念，也引入的类，接口继承，抽象类一些概念

## 1. vue3.x 六大亮点

- Performance: 性能比 Vue 2.x 快 (update 性能提高 1.3-2 倍和 ssr 服务端渲染速度快 2-3 倍，基于 bechmark)
- Tree shaking support: 按需编译，体积比 vue2.x 更小
- Composition API : 组合 API(类似 React hooks)
- Better Ts support : 更好的 Ts 支持
- Custom Renderer API : 暴露自定义渲染 API
- Fragment, Teleport(Protal), Surspense: 更先进的组件

## 2.vue3.x 是如何变快的？

https://vue-next-template-explorer.netlify.app/

- diff 算法优化
  - vue2 中的虚拟 dom 是进行全量的对比
  - vue3 中新增了静态标记（PatchFlag）, 在与上次虚拟节点进行对比的时候，只对比带有 patchflag 的节点，
    并且可以通过 flag 的信息得知当前节点要对比的具体内容
  - 根结点 div 将会被编译成 Block

```
<div>
  <p>static</p>
  <p>static</p>
  <p>{{ msg }}</p>
</div>
```

```
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    _createElementVNode("p", null, "static"),
    _createElementVNode("p", null, "static"),
    _createElementVNode("p", null, _toDisplayString(_ctx.msg), 1 /* TEXT */)
  ]))
}

// Check the console for the AST
```

## PatchFlags 枚举定义

```
export const enum PatchFlags {

  TEXT = 1,// 表示具有动态textContent的元素
  CLASS = 1 << 1,  // 表示有动态Class的元素
  STYLE = 1 << 2,  // 表示动态样式（静态如style="color: red"，也会提升至动态）
  PROPS = 1 << 3,  // 表示具有非类/样式动态道具的元素。
  FULL_PROPS = 1 << 4,  // 表示带有动态键的道具的元素，与上面三种相斥
  HYDRATE_EVENTS = 1 << 5,  // 表示带有事件监听器的元素
  STABLE_FRAGMENT = 1 << 6,   // 表示其子顺序不变的片段（没懂）。
  KEYED_FRAGMENT = 1 << 7, // 表示带有键控或部分键控子元素的片段。
  UNKEYED_FRAGMENT = 1 << 8, // 表示带有无key绑定的片段
  NEED_PATCH = 1 << 9,   // 表示只需要非属性补丁的元素，例如ref或hooks
  DYNAMIC_SLOTS = 1 << 10,  // 表示具有动态插槽的元素
  // 特殊 FLAGS -------------------------------------------------------------
  HOISTED = -1,  // 特殊标志是负整数表示永远不会用作diff,只需检查 patchFlag === FLAG.
  BAIL = -2 // 一个特殊的标志，指代差异算法（没懂）
}

```

- hoistStatic 静态提升
- vue2 中无论元素是否参与更新，每次都会重新创建，然后再渲染
- vue3 中对于不参与更新的元素，会做静态提升，只会被创建一次，再渲染时直接复用即可

- cacheHandles 事件监听缓存
- 默认情况下 onClick 会被视为动态绑定，所以每次都会去追踪它的变化，但是因为是同一个函数，所以
  没有追踪变化，直接缓存起来复用即可

```
<div>
  <p>static</p>
  <p>static</p>
  <p>{{ msg }}</p>
  <button @click="fn">点击</button>
</div>
```

## Tree shaking support(摇树)

- Tree Shaking 中文含义是摇树，在 webpack 中指的是打包时把无用的代码摇掉，以优化打包结果。
  而 webpack5 已经自带了这个功能了，当打包环境为 production 时，默认开启 tree-shaking 功能。

- Tree-shaking 是通过编译器去实现的
  其实说白了，Tree-shaking 本质并不是 Vue3 的东西，而是那些打包工具的功能。只是 Vue3 代码结构调整，当用 webpack 等打包工具打包项目时，webpack 会将那些没用用到的代码不打包到最后的项目中，这样使得项目体积更小
  主要原理：依赖 es6 的模块化的语法，将无用的代码(dead-code)进行剔除!

## Composition API（组合）

- CompositionAPI 被如果只是字面的意思可以被翻译成组合 API。本质上 CompositionAPI 就是为了更为方便的实现逻辑的组合而生的。
- 组件小的时候，用不同的 Options 比如 methods、compute、data、props 等这样分类比较清晰。大型组件中，大量的 Options 聚在一起。同一个组件可能有多个逻辑关注点，当使用 Options API 时，每一个关注点都有自己的 Options，当修改一个逻辑关注点时，就要在一个文件不断地切换和寻找。

- Vue2 如果要在组件中实现逻辑的符合，譬如所有按钮组件都要实现防抖，可选的方式大概有以下三个:

  1.Mixins 2.高阶组件
  3.Renderless Components (基于 scoped slots / 作用域插槽封装逻辑的组件)

- 但三者都不是非常的理想，主要问题存在

  模板数据来源不清晰, 譬如 mixin 光看模板很难分清一个属性是哪里来的。
  命名空间冲突
  性能问题。 产生额外的组件逻辑嵌套 会导致无谓的性能开销。

- vue3 使用 composition 的优点
  当需要复用的时候，就只需要把这个函数提取出去。然后在另一个组件中引入，这个功能就变得可复用了，Composition API 使得组件复用变得更加灵活了。另一方面，Composition API 会有更好的类型的支持，因为都是一些函数，在调用函数时，自然所有的类型就被推导出来了。不像 OptionsAPI 所有的东西使用 this。同时，Composition API 的可压缩性会更好一些。以上就是 Composition API 引入的理由。

- vue3 里面是完全兼容 vue2 的写法的

- setup 是 vue3 提供的一个新的类似生命周期的函数，自动的执行，执行是在 vue2 的 created 之前，并且没有 this

```
setup(){
  console.log(this)
  console.log('setup')
  // 需要注意，不做任何处理的话，数据默认是不具有响应式的，数据后期发生变化了，视图不会更新,视图变化了，模型也不会变化

  // 如何解决？
  // 需要借助vue3 提供的数据创建 api对数据进行包装处理，使之成为响应式数据
  // vue2.x 里面做数据响应式使用的es5，Object.defineProperty(); 做数据的劫持操作，为模型做set，get
  // vue3.x 里面做数据响应式使用的es6，提供的Proxy(); 做数据的劫持操作，为模型做set，get

  const list = [{id:0,name: 'Tom'},{id:1,name: 'Joy'},{id:2,name: 'Ming'}]
  return {list}
}

```

- 引入新的 API

  1. // reactive 是 vue3 提供的一个函数，可以对对象和数组这种复合数据类型进行包装，会返回一个新的对象，该对象可以实现响应式。
  2. // ref 可以对基本数据类型进行包装，会返回一个新的对象，该对象可以实现响应式。

  // 需要注意
  ref 底层也是使用 reactive 进行包装 {reactive({value:12})}
  所以我们在 setup 函数里面操作 ref 对象的时候，需要使用.value 方式
  视图是不需要使用.value 原因是视图会判断 当前值是 ref 还是 reactive, 如果是 ref 则会自动的获取 value 值

  vue 把这些 api 单独设计出来，需要什么，就引入什么，体现了按需引入的概念
  通过这种方式，使得我们项目依赖的 vuejs 源码足够小

## Vue3 的基础 API

const {
createApp,
reactive, // 创建响应式数据对象
ref, // 创建一个响应式的数据对象
toRefs, // 将响应式数据对象转换为单一响应式对象
isRef, // 判断某值是否是引用类型
computed, // 创建计算属性
watch, // 创建 watch 监听
// 生命周期钩子
onMounted,
onUpdated,
onUnmounted,
} = Vue

## 生命周期函数

https://www.cnblogs.com/js-liqian/p/11890209.html

- 生命周期函数需要在 setup 里面注册使用

```
onMouted(()=>{

})
onUpdated(()=>{

})
```

## Vue2 和 Vue3 响应方式对比

首先我们说说什么是响应式。通过某种方法可以达到数据变了可以自由定义对应的响应就叫响应式。具体到我们 MVVM 中 ViewModel 的需要就是数据变了需要视图作出响应。

- Object.defineProperty 实现响应式
  首先需要知道是 Object.defineProperty 只能监听对象，并且这个对象不是指对象类型(数组也是对象类型)，而是 Object 构造器对象，也就是{}。

- 结构分为三个部分：
  updateView：更新视图的函数
  defineReactive：监听对象数据改变的函数
  observer：分解数据每一项属性，以便进行深度监听

```
//设置简单的函数表示视图更新
function updateView() {
  console.log("视图更新")
}

<!-- // 重新定义数组原型
const oldArrayProperty = Array.prototype
//这样新增方法也不会影响到Array原型
const arrPrototype = Object.create(oldArrayProperty)

// 假设添加了这些方法，那么如果数组调用这些方法就会触发视图更新
["push", "pop", "unshift", "shift", "splice"].forEach(
  (method) =>
    (arrPrototype[method] = function () {
      // 如果调用以上的方法就触发视图更新
      updateView()
      oldArrayProperty[method].call(this, ...arguments)
    })
) -->

// 分解对象属性函数
function observer(target) {
  if (typeof target !== "object" || target === null) {
    // 不是对象或数组
    return target
  }

  // 为了不污染全局Array原型：需要重新定义数组原型
  if (Array.isArray(target)) {
    target.__proto__ = arrPrototype
  }

  // 监听target每一个属性
  for (let key in target) {
    defineReactive(target, key, target[key])
  }
}

function defineReactive(target, key, value) {
  // 深度监听：如果value是对象就继续分解
  observer(value)

  // 核心API：Object.defineProperty()
  Object.defineProperty(target, key, {
    get() {
      return value
    },
    set(newValue) {
      if (newValue !== value) {
        // 设置新值也要监听是否是对象和数组
        observer(newValue)
        // 设置新值
        value = newValue

        // 触发更新视图
        updateView()
      }
    },
  })
}
```

因为 Object.defineProperty 的限制，Vue2 中对数组的操作非常有限制。
Vue 不能检测以下数组的变动：

当你利用索引直接设置一个数组项时，例如：vm.items[indexOfItem] = newValue
当你修改数组的长度时，例如：vm.items.length = newLength

官方推荐最好用 splice 方法对数组进行增删操作就是因为内部改写方法时改写了 splice 方法。或者使用 Vue.set()|vm.$set()强行将数据添加到响应式里。

## Proxy

Proxy 可以理解为：在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

```
var arr = [1,2]

var arrProxy = new Proxy(
  arr,
  {
    get(target, propKey) {
      console.log(`getting ${propKey}!`)
    },
    set(target, propKey, value) {
      console.log(`setting ${propKey}!`)
    },
  }
)

//设置值
arrProxy[0] = 'change'   //setting 0!
//读取值
arrProxy[1]  //getting 1!
```

上面的代码对 arr 数组架设了一层拦截，重新定义了属性的读取（get）和设置（set）行为。

作为构造函数，Proxy 接受两个参数：
第一个参数是所要代理的目标对象（上例是一个 arr 对象），即如果没有 Proxy 的介入，操作原来要访问的就是这个 arr 对象。这里的对象是指对象类型(数组也是对象类型)。
第二个参数是一个配置对象 handler，对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作。比如，上面代码中，配置对象有一个 get 方法，用来拦截对目标对象属性的访问请求。get 方法的两个参数分别是目标对象和所要访问的属性。

https://es6.ruanyifeng.com/#docs/proxy
