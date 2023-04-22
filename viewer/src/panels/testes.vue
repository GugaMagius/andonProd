<template>
  <div>

    <p>Drag the W3Schools image into the rectangle:</p>

    <div id="div1" v-on:drop.prevent="drop(event)" v-on:dragover.prevent="allowDrop(event)"></div>
    <br>
    <img id="drag1" src="./img_logo.gif" draggable="true"  v-on:dragstart.prevent="drag(event)" width="336" height="69">

  </div>
</template>

<style>
#div1 {
  width: 350px;
  height: 70px;
  padding: 10px;
  border: 1px solid #aaaaaa;
}
</style>

<script>
export default {
  methods: {
    allowDrop(ev) {
      alert("allow drop")
      ev.preventDefault();
    },

    drag(ev) {
      ev.dataTransfer.setData("text", ev.target.id);
    },

    drop(ev) {
      alert("Drop")
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");
      ev.target.appendChild(document.getElementById(data));
    }
  }
}

</script>

