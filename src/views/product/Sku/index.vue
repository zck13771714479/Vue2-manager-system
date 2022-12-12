<template>
  <div>
    <el-table :data="records" border>
      <el-table-column type="index" label="序号" align="center" width="80">
      </el-table-column>
      <el-table-column prop="skuName" label="名称"> </el-table-column>
      <el-table-column prop="skuDesc" label="描述"> </el-table-column>
      <el-table-column label="默认图片">
        <template slot-scope="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量"> </el-table-column>
      <el-table-column prop="price" label="价格"> </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="{ row }">
          <!-- 上架 -->
          <HintButton
            title="上架"
            type="success"
            icon="el-icon-top"
            size="mini"
            style="margin-right: 5px"
            v-if="row.isSale == 0"
            @click="onSale(row)"
          ></HintButton>
          <!-- 下架 -->
          <HintButton
            title="下架"
            type="success"
            icon="el-icon-bottom"
            size="mini"
            style="margin-right: 5px"
            v-else
            @click="cancelSale(row)"
          ></HintButton>
          <!-- 修改 -->
          <HintButton
            title="修改"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            style="margin-right: 5px"
            @click="edit"
          ></HintButton>
          <!-- 详情 -->
          <HintButton
            title="详情"
            type="info"
            icon="el-icon-info"
            size="mini"
            style="margin-right: 5px"
            @click="showDetail(row)"
          ></HintButton>
          <!-- 删除 -->
          <HintButton
            title="删除"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            style="margin-right: 5px"
            @click="deleteSku(row)"
          ></HintButton>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="page"
      :page-sizes="[10, 20, 30]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes, total "
      :total="total"
      style="text-align: center"
    >
    </el-pagination>

    <el-drawer size="50%" :show-close="false" :visible.sync="drawer">
      <el-row>
        <el-col :span="5" class="el-col-left"><div>名称：</div></el-col>
        <el-col :span="16"
          ><div>{{ skuInfo.skuName }}</div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="5" class="el-col-left"><div>描述：</div></el-col>
        <el-col :span="16"
          ><div>{{ skuInfo.skuDesc }}</div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="5" class="el-col-left"><div>价格：</div></el-col>
        <el-col :span="16"
          ><div>{{ skuInfo.price }}</div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="5" class="el-col-left"><div>平台属性：</div></el-col>
        <el-col :span="16">
          <el-tag
            style="margin-right: 10px"
            type="success"
            size="mini"
            v-for="tag in skuInfo.skuAttrValueList"
            :key="tag.id"
            >{{ tag.attrName }}-{{ tag.valueName }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="el-col-left"><div>商品图片：</div></el-col>
        <el-col :span="16">
          <el-carousel :autoplay="false" arrow="always" trigger="click">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img
                :src="item.imgUrl"
                alt=""
                style="width: 100%; height: 100%"
              />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      records: [],
      skuInfo: {},
      drawer: false,
    };
  },
  methods: {
    async getSkuList() {
      let result = await this.$API.sku.reqPageSkuList(this.page, this.limit);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //改变每页展示的数据量
    sizeChange(pageSize) {
      this.limit = pageSize;
      this.page = 1;
      this.getSkuList();
    },
    // 换页
    currentChange(page) {
      this.page = page;
      this.getSkuList();
      this.$nextTick(() => {
        window.scroll(0, 0);
      });
    },
    //上架
    async onSale(row) {
      let result = await this.$API.sku.reqOnSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({
          type: "success",
          message: "上架成功",
        });
      }
    },
    // 下架
    async cancelSale(row) {
      let result = await this.$API.sku.reqCancelSale(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({
          type: "success",
          message: "下架成功",
        });
      }
    },
    //修改
    edit() {
      this.$message("此功能正在开发中");
    },
    // 删除sku
    async deleteSku(row) {
      let result = await this.$API.sku.reqDeleteSku(row.id);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        if (this.records.length < 1) {
          this.page = this.page - 1;
        }
        this.getSkuList();
      }
    },
    // 展示sku详情
    async showDetail(row) {
      this.drawer = true;
      let result = await this.$API.sku.reqSkuDetail(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
  mounted() {
    this.getSkuList();
  },
};
</script>

<style scoped>
.el-col-left {
  text-align: right;
  font-size: 18px;
  margin-bottom: 30px;
}
>>> .el-carousel__button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
}
</style>