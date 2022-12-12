<template>
  <div>
    <el-card shadow="always" style="margin: 0 0 20px 0">
      <CategoryThree
        @changeCategory="changeCategory"
        :show="isShowTable"
      ></CategoryThree>
    </el-card>

    <el-card>
      <div id="showTable" v-show="isShowTable">
        <el-button
          type="primary"
          class="el-icon-plus"
          style="margin: 10px 0px"
          @click="startAddAttr"
          :disabled="!category3Id"
          >添加属性</el-button
        >
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="200">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                class="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
                >修改</el-button
              >
              <el-button
                type="danger"
                class="el-icon-delete"
                size="mini"
                @click="deleteAttr(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div id="hideTable" v-show="!isShowTable">
        <el-form ref="form" label-width="80px">
          <el-form-item label="属性名">
            <el-input
              style="width: 500px"
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
          <el-button
            type="primary"
            class="el-icon-plus"
            @click="addAttrValue"
            :disabled="attrInfo.attrName == ''"
            >添加属性值</el-button
          >
          <el-table
            border
            style="margin: 10px 0"
            :data="attrInfo.attrValueList"
          >
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="80"
            >
            </el-table-column>
            <el-table-column label="属性值名称">
              <template slot-scope="{ row, $index }">
                <el-input
                  v-model="row.valueName"
                  placeholder="请输入属性值的名称"
                  size="mini"
                  v-if="row.flag"
                  @blur="changeAttrValue(row)"
                  @keyup.native.enter="changeAttrValue(row)"
                  :ref="$index"
                  clearable
                ></el-input>
                <span
                  v-if="!row.flag"
                  @click="toEdit(row, $index)"
                  style="display: block"
                  >{{ row.valueName }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="{ row, $index }">
                <el-popconfirm
                  :title="`确定删除吗？${row.valueName}吗?`"
                  @onConfirm="removeAttrValue($index)"
                >
                  <el-button
                    type="danger"
                    size="mini"
                    class="el-icon-delete"
                    slot="reference"
                  ></el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            type="primary"
            @click="saveAttrInfo"
            :disabled="disableSave"
            >保存</el-button
          >
          <el-button @click="isShowTable = true">取消</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowTable: true,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  computed: {
    //是否禁用保存按钮
    disableSave() {
      if (this.attrInfo.attrName.trim() == "") {
        //属性名为空，必须禁用
        return true;
      }
      if (this.attrInfo.attrValueList.length < 1) {
        //属性值起码有一个，没有则禁用
        return true;
      }
      return false;
    },
  },
  methods: {
    //收集分类的数据，在有三级分类时获取表格数据
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
        this.getAttrList();
      }
    },
    //发送获取数据请求
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
        return "ok";
      } else {
        return Promise.reject(new Error("fail"));
      }
    },
    //点击添加属性按钮，隐藏表格，清空之前输入的平台属性名和属性值
    startAddAttr() {
      this.isShowTable = false;
      //清空数据，并且绑定三级分类id
      this.attrInfo.attrName = "";
      this.attrInfo.attrValueList = [];
      this.attrInfo.categoryId = this.category3Id;
      this.attrInfo.categoryLevel = 3;
    },
    //点击添加属性值按钮，添加新的平台属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //添加时为undefined，修改时为原来的id值
        valueName: "",
        flag: true, //给每个存在的数据添加flag属性，用于编辑模式和查看模式的切换
      });
      //此处使用v-if，要渲染元素才能切换编辑和查看模式，需要渲染时间，所以要等dom渲染完成后再处理
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //点击修改按钮，更新平台属性值
    updateAttr(row) {
      //此处数据结构为对象里面套数组，数组里面再套对象，简单的浅拷贝无效，必须深拷贝，用lodash提供的方法
      this.attrInfo = cloneDeep(row);
      this.isShowTable = false;
      //给每个存在的数据添加flag属性，用于编辑模式和查看模式的切换
      //此处使用v-if，要渲染元素才能切换编辑和查看模式，需要渲染时间，所以要等dom渲染完成后再处理
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    // 删除平台属性
    async deleteAttr(row) {
      let result = await this.$API.attr.reqDeleteAttr(row.id);
      if(result.code == 200){
        this.$message({
          type:'success',
          message:'删除成功'
        });
        this.getAttrList();
      }
    },
    //点击删除属性值按钮，删除平台属性值
    removeAttrValue($index) {
      this.attrInfo.attrValueList.splice($index, 1);
    },
    //点击切换到编辑属性值模式
    toEdit(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //在输入框中更改平台属性值
    changeAttrValue(row) {
      //必须非空
      if (row.valueName.trim() == "") {
        this.$message("请输入非空属性值");
        return;
      }
      //不能和别的属性值重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        if (item !== row) {
          return item.valueName.trim() == row.valueName.trim();
        }
      });
      if (isRepeat) {
        this.$message("属性值重复，请重新输入");
        return;
      }

      row.flag = false; //切换到查看模式
    },
    //点击保存完成提交
    async saveAttrInfo() {
      //之前为了切换编辑模式和查看模式添加的flag属性在发请求时要删除
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName.trim() !== "") {
            delete item.flag;
            return true;
          }
        }
      );
      let result = await this.$API.attr.reqSubmitAttr(this.attrInfo);
      if (result.code == 200) {
        this.isShowTable = true;
        this.$message({
          message: "添加成功",
          type: "success",
        });
        this.getAttrList();
      } else {
        this.$message("添加失败");
      }
    },
  },
};
</script>

<style>
</style>