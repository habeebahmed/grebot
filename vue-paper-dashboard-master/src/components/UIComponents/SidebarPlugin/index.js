import Sidebar from './SideBar.vue'

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [
    {
      name: 'Dashboard',
      icon: 'ti-panel',
      path: '/admin/overview'
    },
    {
      name: 'Broadcast',
      icon: 'ti-announcement',
      path: '/admin/stats'
    },
    {
      name: 'Users List',
      icon: 'ti-view-list-alt',
      path: '/admin/table-list'
    },
    {
      name: 'Logout',
      icon: 'ti-power-off',
      path: '/admin/notifications'
    },
    {
      name: 'Typography',
      icon: 'ti-text',
      path: '/admin/typography'
    },
    {
      name: 'Icons',
      icon: 'ti-pencil-alt2',
      path: '/admin/icons'
    },
    {
      name: 'Maps',
      icon: 'ti-map',
      path: '/admin/maps'
    }
  ],
  displaySidebar (value) {
    this.showSidebar = value
  }
}

const SidebarPlugin = {

  install (Vue) {
    Vue.mixin({
      data () {
        return {
          sidebarStore: SidebarStore
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$sidebar', {
      get () {
        return this.$root.sidebarStore
      }
    })
    Vue.component('side-bar', Sidebar)
  }
}

export default SidebarPlugin
