import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import DataConvert from '@/views/DataConvert/index'
import ResetData from '@/views/Test/ResetData'
import Index from '@/views/Test/index'
import VueDraggable from '@/views/VueDraggable/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/dataConvert',
    name: 'DataConvert',
    component: DataConvert
  },
  {
    path: '/resetData',
    name: 'ResetData',
    component: ResetData
  },
  {
    path: '/test',
    name: 'Index',
    component: Index
  },
  {
    path: '/vueDraggable',
    name: 'VueDraggable',
    component: VueDraggable
  }
]

const router = new VueRouter({
  mode: 'history',
  base: 'vueTest',
  routes
})

export default router
