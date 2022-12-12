<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "PieChart",
  mounted() {
    let chart = echarts.init(this.$refs.chart);
    chart.setOption({
      title: {
        text: "Search Engine",
        subtext: "1048",
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "outside",
          },
          labelLine: {
            show: true,
          },
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    chart.on("mouseover", (params) => { 
        const {name,value} = params.data;
        chart.setOption({
            title:{
                text:name,
                subtext:value,
            }
        })
    });
  },
};
</script>

<style scoped>
.chart {
  width: 100%;
  height: 500px;
}
</style>