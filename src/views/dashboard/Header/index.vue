<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card shadow="always">
          <Detail title="总销售额" :number="saleTotal">
            <template slot="chart">
              <span
                >周同比&nbsp;&nbsp;32.89%<svg
                  t="1669953812952"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4009"
                  width="16"
                  height="16"
                >
                  <path
                    d="M960 704L512 256l-448 448z"
                    fill="#d81e06"
                    p-id="4010"
                  ></path></svg
              ></span>
              <span
                >&nbsp;&nbsp; 月同比&nbsp;&nbsp;18.31%<svg
                  t="1669953834204"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5051"
                  width="16"
                  height="16"
                >
                  <path
                    d="M64 320l448 448 448-448z"
                    fill="#1afa29"
                    p-id="5052"
                  ></path></svg
              ></span>
            </template>
            <template slot="footer">
              <div>日销售额：￥ {{saleToday}}</div>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always">
          <Detail title="访问量" number="8848">
            <template slot="chart">
              <LineChart></LineChart>
            </template>
            <template slot="footer">
              <div>日访问量：1136</div>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always">
          <Detail title="支付笔数" number="1919810">
            <template slot="chart">
              <BarChart></BarChart>
            </template>
            <template slot="footer">
              <div>转化率：66%</div>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always">
          <Detail title="运营活动效果" number="78%">
            <template slot="chart">
              <Progress></Progress>
            </template>
            <template slot="footer">
              <span
                >周同比&nbsp;&nbsp;2.15%<svg
                  t="1669953812952"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4009"
                  width="16"
                  height="16"
                >
                  <path
                    d="M960 704L512 256l-448 448z"
                    fill="#d81e06"
                    p-id="4010"
                  ></path></svg
              ></span>
              <span
                >&nbsp;&nbsp; 月同比&nbsp;&nbsp;0.31%<svg
                  t="1669953834204"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="5051"
                  width="16"
                  height="16"
                >
                  <path
                    d="M64 320l448 448 448-448z"
                    fill="#1afa29"
                    p-id="5052"
                  ></path></svg
              ></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import LineChart from "./Detail/LineChart.vue";
import BarChart from "./Detail/BarChart.vue";
import Progress from "./Detail/Progress.vue";
export default {
  name: "HomeHeader",
  components: { Detail, LineChart, BarChart, Progress },
  computed:{
    saleTotal(){
      return this.$store.state.home.homeResult.salesTotal;
    },
    saleToday(){
      return this.$store.state.home.homeResult.salesToday;
    }
  },
};
</script>

<style>
</style>