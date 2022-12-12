<template>
  <div>
    <el-card class="box-card">
      <div class="clearfix">
        <el-tabs class="head-left" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
        <div class="head-right">
          <span @click="today">今日</span>
          <span @click="thisWeek">本周</span>
          <span @click="thisMonth">本月</span>
          <span @click="thisYear">本年</span>
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="content">
        <el-row :gutter="10">
          <el-col :span="18">
            <div class="chart" ref="chart"></div>
          </el-col>
          <el-col :span="6">
            <div class="content-right">
              <h3>销售额排行</h3>
              <ul>
                <li v-for="row in orderRank" :key="row.no">
                  <span class="li-left">{{ row.no }}</span>
                  <span class="li-middle">{{ row.name }}</span>
                  <span class="li-right">{{ row.money }}</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      chart: null,
      time: [],
    };
  },
  computed: {
    saleX() {
      return this.$store.state.home.homeResult.orderFullYearAxis;
    },
    saleY() {
      return this.$store.state.home.homeResult.orderFullYear;
    },
    visitX() {
      return this.$store.state.home.homeResult.userFullYearAxis;
    },
    visitY() {
      return this.$store.state.home.homeResult.userFullYear;
    },
    orderRank() {
      return this.$store.state.home.homeResult.orderRank;
    },
  },
  watch: {
    activeName(newValue, oldValue) {
      let title = this.activeName == "sale" ? "销售额" : "访问量";
      this.chart.setOption({
        title: {
          text: `${title}趋势`,
        },
        xAxis: [
          {
            data: this.activeName == "sale" ? this.saleX : this.visitX,
          },
        ],
        series: [
          {
            data: this.activeName == "sale" ? this.saleY : this.visitY,
          },
        ],
      });
    },
  },
  methods: {
    today() {
      let today = dayjs().format("YYYY-MM-DD");
      this.time = [today, today];
    },
    thisWeek() {
      let start = dayjs().day(1).format("YYYY-MM-DD");
      let end = dayjs().day(7).format("YYYY-MM-DD");
      this.time = [start, end];
    },
    thisMonth() {
      let start = dayjs().startOf("month").format("YYYY-MM-DD");
      let end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.time = [start, end];
    },
    thisYear() {
      let start = dayjs().startOf("year").format("YYYY-MM-DD");
      let end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.time = [start, end];
    },
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart);
    this.chart.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: this.saleX,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          color: "#fbbd08",
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: this.saleY,
        },
      ],
    });
  },
};
</script>

<style scoped>
body {
  box-sizing: border-box;
}
.clearfix {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.head-left {
  width: 100%;
}
.head-right {
  position: absolute;
  right: 0;
  /* padding-bottom: 10px; */
}
.head-right span {
  margin: 0 10px;
}
.chart {
  width: 100%;
  height: 300px;
}
.content-right {
  width: 100%;
  height: 300px;
}
.content-right ul {
  list-style: none;
  margin-top: 20px;
}
.content-right ul li {
  margin: 10px 0;
}
.content-right ul li .li-left {
  float: left;
  width: 20px;
  height: 20px;
  margin-right: 30px;
  text-align: center;
  line-height: 20px;
}
.content-right ul li:nth-child(-n + 3) .li-left {
  border-radius: 50%;
  background-color: black;
  color: #fff;
}
.content-right ul li .li-right {
  float: right;
  margin-right: 10px;
}
</style>