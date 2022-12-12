<template>
  <div>
    <el-form label-width="80px" :model="spu" :inline="false" size="normal">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌" size="normal">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tradeMark.tmName"
            :value="tradeMark.id"
            v-for="(tradeMark, index) in tradeMarkList"
            :key="tradeMark.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" size="normal">
        <el-input
          placeholder="SPU描述"
          size="normal"
          clearable
          type="textarea"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片" size="normal">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" size="normal">
        <el-select
          :placeholder="`还有${userNotSelectList.length}项未选择`"
          v-model="attrIdAndName"
        >
          <el-option
            v-for="(noSelect, index) in userNotSelectList"
            :label="noSelect.name"
            :key="noSelect.id"
            :value="`${noSelect.id}:${noSelect.name}`"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="default"
          @click="addSaleAttr"
          :disabled="attrIdAndName==''"
          >添加销售属性</el-button
        >
        <el-table :data="spu.spuSaleAttrList" border>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
          ></el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="width"
          ></el-table-column>
          <el-table-column label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                style="margin-right: 10px"
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
                closable
                :disable-transitions="false"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 不能在keyup处写同一个回调，会触发2次blur，重复调用会出错 -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="$event.target.blur()"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="danger"
                size="mini"
                icon="el-icon-delete"
                title="删除本销售属性"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="" size="normal">
        <el-button
          type="primary"
          size="default"
          style="margin-right: 15px"
          @click="saveAttr"
          >保存</el-button
        >
        <el-button size="default" @click="cancelSubmit">取消</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      spu: {
        category3Id: 0,
        description: "",
        tmId: 0,
        spuName: "",
        spuImageList: [
          {
            id: 0,
            imgName: "",
            imgUrl: "",
            spuId: 0,
          },
        ],
        spuSaleAttrList: [],
      },
      attrIdAndName: "",
      spuImageList: [],
      tradeMarkList: [],
      saleAttrs: [],
    };
  },
  computed: {
    //还有几项销售属性没有选择
    userNotSelectList() {
      let result = this.saleAttrs.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName;
        });
      });
      return result;
    },
  },
  methods: {
    //修改时，初始化数据
    async initInfo(row) {
      // 获取spu
      let spuResult = await this.$API.spu.reqSpu(row.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      // 获取品牌列表
      let tradeMarkList = await this.$API.spu.reqtradeMark();
      if (tradeMarkList.code == 200) {
        this.tradeMarkList = tradeMarkList.data;
      }
      // 获取图片列表
      let spuImageList = await this.$API.spu.reqSpuImageList(row.id);
      if (spuImageList.code == 200) {
        let tmp = spuImageList.data;
        tmp.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = tmp;
      }
      //   获取销售属性
      let saleAttrs = await this.$API.spu.reqSaleAttr();
      if (saleAttrs.code == 200) {
        this.saleAttrs = saleAttrs.data;
      }
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 图片删除
    handleRemove(file, fileList) {
      // flie:删除的图片
      // fileList：s剩余的图片
      this.spuImageList = fileList;
    },
    //图片上传成功
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    // 切换查看模式，将输入的内容放入数组
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue, saleAttrName } = row;
      if (inputValue.trim() == "") {
        this.$message("请输入非空属性值");
        return;
      }
      let isRepeat = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName == inputValue;
      });
      if (isRepeat) {
        return this.$message("请不要输入重复属性值");
      }
      let newAttrValue = {
        baseSaleAttrId,
        saleAttrName,
        saleAttrValueName: inputValue,
      };
      row.spuSaleAttrValueList.push(newAttrValue);
      row.inputVisible = false;
    },
    // 切换编辑模式，对于每一行，只需要一个这样的属性，因为同一时间只有一个属性值可以进行修改
    showInput(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    //添加销售属性
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      let newAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };
      this.spu.spuSaleAttrList.push(newAttr);
      //清空选择框内容
      this.attrIdAndName = "";
    },
    //点击保存按钮，提交数据
    async saveAttr() {
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          //本地上传的图片用响应的地址，原来网路上请求获取的图片用属性值里面的地址
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });

      this.spu.spuSaleAttrList.forEach((item) => {
        delete item.inputValue;
        delete item.inputVisible;
      });
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "update" : "add",
        });
        Object.assign(this._data, this.$options.data()); //清空数据，防止回显
        this.$message({
          type: "success",
          message: "保存成功",
        });
      }
    },
    //取消提交
    cancelSubmit() {
      this.$emit("changeScene", { scene: 0, flag: "update" });
      Object.assign(this._data, this.$options.data()); //清空数据，防止回显
    },
    //添加时，发请求初始化数据
    async addSpu(category3Id) {
      this.spu.category3Id = category3Id;
      // 获取品牌列表
      let tradeMarkList = await this.$API.spu.reqtradeMark();
      if (tradeMarkList.code == 200) {
        this.tradeMarkList = tradeMarkList.data;
      }
      //   获取销售属性
      let saleAttrs = await this.$API.spu.reqSaleAttr();
      if (saleAttrs.code == 200) {
        this.saleAttrs = saleAttrs.data;
      }
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
