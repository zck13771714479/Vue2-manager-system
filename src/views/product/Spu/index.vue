<template>
  <div>
    <el-card shadow="always" style="margin: 20px 0">
      <CategoryThree
        @changeCategory="changeCategory"
        :show="scene == 0"
      ></CategoryThree>
    </el-card>
    <el-card shadow="always">
      <div id="SpuTable" v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="category3Id == ''"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table :data="records" border>
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="SPU名称"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="SPU描述"
            width="width"
          ></el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                title="添加sku"
                size="mini"
                style="margin: 0 10px"
                @click="addSku(row)"
              />
              <HintButton
                type="warning"
                icon="el-icon-edit"
                title="修改spu"
                size="mini"
                style="margin: 0 10px"
                @click="editSpu(row)"
              />
              <HintButton
                type="info"
                icon="el-icon-info"
                title="查看当前spu全部sku列表"
                size="mini"
                style="margin: 0 10px"
                @click="showSkuList(row)"
              />
              <el-popconfirm
                :title="`确定删除${row.spuName}吗？`"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  type="danger"
                  icon="el-icon-delete"
                  title="删除spu"
                  size="mini"
                  slot="reference"
                  style="margin: 0 10px"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page.sync="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,sizes,total "
          :total="total"
          background
        >
        </el-pagination>
      </div>

      <SpuForm v-show="scene == 1" ref="SpuFrom" @changeScene="changeScene" />
      <SkuForm
        v-show="scene == 2"
        ref="SkuForm"
        @changeSceneSku="changeSceneSku"
      />
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的SKU列表`"
      :visible.sync="dialogTableVisible"
      :before-close="closeSkuList"
    >
      <el-table :data="skuInfoList" v-loading="loading">
        <el-table-column prop="skuName" label="名称"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="weight" label="重量"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 3,
      total: 0,
      records: [],
      scene: 0, //用于切换场景 0表示显示spu列表，1表示添加或修改spu，2表示添加sku
      spu: {},
      dialogTableVisible: false,
      skuInfoList: [],
      loading: true,
    };
  },
  methods: {
    //收集分类的数据，在有三级分类时获取Spu数据
    changeCategory({ categoryId, level }) {
      if (level == 1) {
        //修改高级分类的时候清空低级分类已经做出的选择
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    //发送请求获取Spu数据
    async getSpuList() {
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
        return "ok";
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    //分页器每页展示的数据量发生变化
    sizeChange(limit) {
      this.limit = limit;
      //切换size后回到第一页重新展示
      this.page = 1;
      this.getSpuList();
    },
    //分页器切换页数
    currentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    //添加spu
    addSpu() {
      this.scene = 1;
      this.$refs["SpuFrom"].addSpu(this.category3Id);
    },
    editSpu(row) {
      this.scene = 1;
      this.$refs["SpuFrom"].initInfo(row);
    },
    //自定义事件，改变场景
    changeScene(params) {
      if (params.flag == "add") {
        this.page = 1;
      }
      this.scene = params.scene;
      this.getSpuList();
    },
    // 删除Spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        if (this.records.length < 1) {
          this.page = this.page - 1;
        }
        this.getSpuList();
      }
    },
    // 添加SKU
    addSku(row) {
      this.scene = 2;
      this.$refs.SkuForm.initInfo(this.category1Id, this.category2Id, row);
    },
    // 添加sku取消，切换场景
    changeSceneSku(scene) {
      this.scene = scene;
    },
    // 查看sku列表
    async showSkuList(row) {
      this.dialogTableVisible = true;
      this.spu = row;
      let result = await this.$API.sku.reqSkuList(this.spu.id);
      if (result.code == 200) {
        this.skuInfoList = result.data;
      }
      if (this.skuInfoList.length > 0) {
        this.loading = false;
      }
    },
    // 关闭sku列表
    closeSkuList(done) {
      done();
      this.loading = true;
      this.skuInfoList = [];
      this.spu = {};
      
    },
  },
};
</script>

<style>
</style>