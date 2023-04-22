<template>
  Teste Drag and Drop
  <div>
    <div class="drop-zone">

      <div v-for="item in listOne" :key="item.title" class="drag-el">
        {{ item.title }}
      </div>
    </div>
    <div class="drop-zone">
      <!-- <div v-for="item in listTwo" :key="item.title" class="drag-el">
        {{ item.title }}
      </div> -->
      <div class="drag-el" v-for="item in listTwo" :key="item.title" draggable @dragstart="startDrag($event, item)">
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    startDrag(evt, item) {
      alert("Iniciado o Drag")
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('itemID', item.id)
    },
    onDrop(evt, list) {
      const itemID = evt.dataTransfer.getData('itemID')
      const item = this.items.find((item) => item.id == itemID)
      item.list = list
    },
  },
  computed: {
    listOne() {
      return this.items.filter((item) => item.list === 1)
    },
    listTwo() {
      return this.items.filter((item) => item.list === 2)
    },
  },
  data() {
    return {
      items: [
        {
          id: 0,
          title: 'Item A',
          list: 1,
        },
        {
          id: 1,
          title: 'Item B',
          list: 1,
        },
        {
          id: 2,
          title: 'Item C',
          list: 2,
        },
      ],
    }
  },
}
</script>


<style scoped>
.drop-zone {
  background-color: #eee;
  margin-bottom: 10px;
  padding: 10px;
}

.drag-el {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 5px;
}
</style>