// component/lever.js
Component({
  options: {
    styleIsolation: 'shared',
  },
  properties: {
    show: Boolean,
    active: {
      type: Number,
      value: 0
    },
    position: {
      type: Boolean,
      value: true
    },
  },

  data: {

  },

  methods: {
    change(e) {
      this.setData({
        active: e.detail.name
      })
      this.triggerEvent('change', this.data.active)
    }
  }
})