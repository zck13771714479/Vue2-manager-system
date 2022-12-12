<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card shadow="always">
          <div class="top">
            <el-row :gutter="5">
              <el-col :span="12"><LineChart /></el-col>
              <el-col :span="12"><LineChart /></el-col>
            </el-row>
            <div class="footer">
              <el-table style="width: 100%">
                <el-table-column type="index" label="排名" width="80">
                </el-table-column>
                <el-table-column label="搜索关键字"> </el-table-column>
                <el-table-column label="用户数" sortable> </el-table-column>
                <el-table-column label="周涨幅" sortable> </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always">
          <div slot="header">
            <PieChart/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineChart from "./LineChart.vue";
import PieChart from "./PieChart.vue";
export default {
  name: "Observer",
  components: { LineChart, PieChart },
};
</script>

<style>
</style>