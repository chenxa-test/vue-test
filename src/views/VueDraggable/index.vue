<template>
  <div>
    <div class="div-class">
      <VueDraggable
        parent=".p-event"
        class-name="dragging1"
      >
        <div>You can drag me around and resize me as you wish.</div>
      </VueDraggable>
    </div>
  </div>
</template>

<script>
import VueDraggable from '@/views/VueDraggable/components/vue-draggable-resizable'
export default {
  name: 'Index',
  components: {
    VueDraggable
  }
}
</script>

<style lang="scss" scoped>
  .dragging1 {
    border: 1px solid #000;
    color: #000;
  }
  .div-class{
    height: 500px;
    width: 500px;
    border: #42b983 2px solid;
  }
</style>
