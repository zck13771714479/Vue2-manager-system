<template>
  <div>
    <el-form ref="form" label-width="80px" :inline="false" size="normal">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称" size="normal">
        <el-input
          placeholder="SKU名称"
          v-model="skuInfo.skuName"
          size="normal"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="价格（元）" size="normal">
        <el-input
          placeholder="价格（元）"
          v-model="skuInfo.price"
          size="normal"
          type="number"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="重量（千克）" size="normal">
        <el-input
          placeholder="重量（千克）"
          v-model="skuInfo.weight"
          size="normal"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述" size="normal">
        <el-input
          type="textarea"
          v-model="skuInfo.skuDesc"
          rows="4"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性" size="normal">
        <el-form ref="form" label-width="80px" :inline="true" size="normal">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select
              placeholder="请选择"
              v-model="attr.attrIdAndValueId"
              clearable
              filterable
            >
              <!-- 每一个选择收集平台属性id和属性值id -->
              <el-option
                :value="`${attrValue.attrId}:${attrValue.id}`"
                :label="attrValue.valueName"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" label-width="80px" :inline="true" size="normal">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in saleAttrList"
            :key="saleAttr.id"
          >
            <el-select
              placeholder="请选择"
              v-model="saleAttr.saleAttrIdAndValueId"
              clearable
              filterable
            >
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttrValue.baseSaleAttrId}:${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表" size="normal">
        <el-table
          :data="spuImageList"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80px"> </el-table-column>
          <el-table-column prop="prop" label="图片">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="small"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-button size="small" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item size="normal">
        <el-button type="primary" size="default" @click="saveSkuForm"
          >保存</el-button
        >
        <el-button size="default" @click="cancelSave">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      selectedImageList: [],
      attrInfoList: [], //平台属性列表
      spuImageList: [], //spu图片列表
      saleAttrList: [], //销售属性列表
      spu: {}, //spu信息
      //sku信息
      skuInfo: {
        //父组件传过来的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //表单v-model收集的数据
        price: 0,
        skuDesc: "",
        skuName: "",
        weight: "",
        skuDefaultImg: "",
        skuAttrValueList: [
          //   {
          //     attrId: 0,
          //     valueId: 0,
          //   },
        ],

        skuImageList: [
          //   {
          //     imgName: "",
          //     imgUrl: "",
          //     isDefault: "",
          //   },
        ],

        skuSaleAttrValueList: [
          //   {
          //     saleAttrId: 0,
          //     saleAttrValueId: 0,
          //   },
        ],
      },
    };
  },
  methods: {
    //初始化发送请求获取数据
    async initInfo(category1Id, category2Id, spu) {
      this.spu = spu;
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.tmId = spu.tmId;
      this.skuInfo.spuId = spu.id;
      // 获取图片列表
      let imgResult = await this.$API.sku.reqSpuImageListInSkuFrom(spu.id);
      if (imgResult.code == 200) {
        let tmp = imgResult.data;
        tmp.forEach((item) => {
          item.isDefault = "0";
        });
        this.spuImageList = tmp;
      }
      //   获取销售属性
      let saleAttrResult = await this.$API.sku.reqSaleAttrInSkuForm(spu.id);
      if ((saleAttrResult.code = 200)) {
        let tmp = saleAttrResult.data;
        tmp.forEach((item) => {
          item.saleAttrIdAndValueId = "";
        });
        this.saleAttrList = tmp;
      }
      //   获取平台属性
      let attrInfoResult = await this.$API.sku.reqAttrInfo(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (attrInfoResult.code == 200) {
        let tmp = attrInfoResult.data;
        tmp.forEach((item) => {
          item.attrIdAndValueId = "";
        });
        this.attrInfoList = tmp;
      }
    },
    // 设置为默认图片
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = "0";
      });
      row.isDefault = "1";
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //选择框回调
    handleSelectionChange(selected) {
      this.selectedImageList = selected;
    },
    // 取消添加sku
    cancelSave() {
      this.$emit("changeSceneSku", 0);
      Object.assign(this._data, this.$options.data());
    },
    //保存添加sku
    async saveSkuForm() {
      // 整理平台属性数据
      this.skuInfo.skuAttrValueList = this.attrInfoList.map((item) => {
        return {
          attrId: item.attrIdAndValueId.split(":")[0],
          valueId: item.attrIdAndValueId.split(":")[1],
        };
      });
      // 整理销售属性数据
      this.skuInfo.skuSaleAttrValueList = this.saleAttrList.map((item) => {
        return {
          saleAttrId: item.saleAttrIdAndValueId.split(":")[0],
          saleAttrValueId: item.saleAttrIdAndValueId.split(":")[1],
        };
      });
      //整理图片数据
      this.skuInfo.skuImageList = this.selectedImageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
        };
      });
      let result = await this.$API.sku.reqSaveSku(this.skuInfo);
      if (result.code == 200) {
        this.$message({
            type:'success',
            message:'添加sku成功',
        })
        this.$emit("changeSceneSku", 0);
        Object.assign(this._data, this.$options.data());
      }
    },
  },
};
</script>

<style>
</style>