<template>
    Teste drag and drop
    <span
      @dragover="handleOnDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
    <div v-for="item in lista" :key="item">{{item}}</div>
    </span>
  </template>
  
  <script>
  export default {
    name: 'DroppableItem',
    props: [
      'onDragOver',
      'onDragLeave',
      'onDrop'
    ],
    data() {
        return {
            lista: ['primeiro Item', 'segundo item', 'terceiro item']

        }
    },
    setup(props) {
      const handleOnDragOver = event => {
        event.preventDefault()
        props.onDragOver && props.onDragOver(event)
      }
  
      return { handleOnDragOver }
    }
  }
  </script>