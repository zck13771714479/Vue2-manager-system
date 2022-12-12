<template>
  <el-form :inline="true" :model="cForm" class="demo-form-inline">
    <el-form-item label="一级分类">
      <el-select
        placeholder="请选择"
        v-model="cForm.category1Id"
        @change="updateCategory1"
        :disabled="!show"
      >
        <el-option
          :label="c1.name"
          :value="c1.id"
          v-for="c1 in list1"
          :key="c1.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select
        placeholder="请选择"
        v-model="cForm.category2Id"
        @change="updateCategory2"
        :disabled="!show"
      >
        <el-option
          :label="c2.name"
          :value="c2.id"
          v-for="c2 in list2"
          :key="c2.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select
        placeholder="请选择"
        v-model="cForm.category3Id"
        @change="updateCategory3"
        :disabled="!show"
      >
        <el-option
          :label="c3.name"
          :value="c3.id"
          v-for="c3 in list3"
          :key="c3.id"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CategoryThree",
  props:['show'],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
        return "ok";
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    async updateCategory1() {
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      this.$emit("changeCategory", {
        categoryId: this.cForm.category1Id,
        level: 1,
      });
      let result = await this.$API.attr.reqCategory2List(
        this.cForm.category1Id
      );
      if (result.code == 200) {
        this.list2 = result.data;
        return "ok";
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    async updateCategory2() {
      this.cForm.category3Id = "";
      this.$emit("changeCategory", {
        categoryId: this.cForm.category2Id,
        level: 2,
      });
      let result = await this.$API.attr.reqCategory3List(
        this.cForm.category2Id
      );
      if (result.code == 200) {
        this.list3 = result.data;
        return "ok";
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    updateCategory3() {
      this.$emit("changeCategory", {
        categoryId: this.cForm.category3Id,
        level: 3,
      });
    },
  },
  mounted() {
    this.getCategory1List();
  },
};
</script>

<style>
</style>