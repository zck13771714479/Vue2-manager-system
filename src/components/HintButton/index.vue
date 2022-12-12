<template>
  <a :title="title" class="margin">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
   </a>
</template>

<script>
export default {
    props:['title'],
    name:'HintButton',

}
</script>

<style scoped>
.margin{
  margin-right: 10px;
}
</style>