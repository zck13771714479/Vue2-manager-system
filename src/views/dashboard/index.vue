<template>
  <div>
    <HomeHeader></HomeHeader>
    <Sale></Sale>
    <Observer></Observer>
  </div>
</template>

<script>
import HomeHeader from "./Header";
import Sale from "./sale";
import Observer from "./Observer";
export default {
  name: "Dashboard",
  components: { HomeHeader, Sale, Observer },
  mounted(){
    this.$store.dispatch('home/getData');
  }
};
</script>

<style scoped>
</style>
