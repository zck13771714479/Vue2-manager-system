<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name:'Progress',
    mounted(){
        let progress = echarts.init(this.$refs.chart);
        progress.setOption({
            xAxis:{
                show:false,
                min:0,
                max:100,
            },
            yAxis:{
                show:false,
                type:'category',
            },
            series:[{
                type:'bar',
                data:[78],
                color:'#67C23A',
                barWidth:20,
                showBackground:true,
                backgroundStyle: {
                    color:'#eee'
                },
                label:{
                    show:true,
                    formatter: '78',
                    position: 'right',
                }
            }]
        })
    }
}
</script>

<style scoped>
.chart{
    width:100%;
    height: 100%;
}
</style>