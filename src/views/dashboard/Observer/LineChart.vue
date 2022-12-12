<template>
  <div>
    <div class="title">
      <span>搜索用户数</span>
      <svg
        t="1669952458993"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2675"
        width="24"
        height="24"
      >
        <path
          d="M512 958.016C266.08 958.016 65.984 757.952 65.984 512 65.984 266.08 266.08 65.984 512 65.984c245.952 0 446.016 200.064 446.016 446.016C958.016 757.952 757.952 958.016 512 958.016zM512 129.984C301.344 129.984 129.984 301.344 129.984 512c0 210.624 171.36 382.016 382.016 382.016 210.624 0 382.016-171.36 382.016-382.016C894.016 301.344 722.624 129.984 512 129.984z"
          p-id="2676"
          fill="#707070"
        ></path>
        <path
          d="M512 304m-48 0a1.5 1.5 0 1 0 96 0 1.5 1.5 0 1 0-96 0Z"
          p-id="2677"
          fill="#707070"
        ></path>
        <path
          d="M512 768c-17.664 0-32-14.304-32-32l0-288c0-17.664 14.336-32 32-32s32 14.336 32 32l0 288C544 753.696 529.664 768 512 768z"
          p-id="2678"
          fill="#707070"
        ></path>
      </svg>
    </div>
    <div class="content">
      <span>12321</span>
      <span>17.1</span
      ><svg
        t="1669953812952"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4009"
        width="16"
        height="16"
      >
        <path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="4010"></path>
      </svg>
      <svg
        t="1669953834204"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="5051"
        width="16"
        height="16"
      >
        <path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="5052"></path>
      </svg>
    </div>
    <div class="chart" ref="chart"></div>


  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "LineChart",
  mounted() {
    let chart = echarts.init(this.$refs.chart);
    chart.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      series: [
        {
          type: "line",
          data: [15, 25, 31, 23, 25, 44, 37],
          itemStyle: {
            opacity: 0,
          },
          color: "#00CCFF",
          smooth: true,
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#00CCFF", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    });
  },
};
</script>

<style scoped>
.title {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.title span {
  margin-right: 20px;
}
.content span:nth-child(1) {
  margin-right: 20px;
}
.chart {
  width: 100%;
  height: 200px;
  margin-bottom: 10px;
}
</style>