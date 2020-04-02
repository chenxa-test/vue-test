import Model from '@/utils/tadpole'

export const form = new Model({
  name: {
    type: String,
    property: 'testName'
  },
  itemName: {
    type: String,
    property: 'itemName2'
  }
})
