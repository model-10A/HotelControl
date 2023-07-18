<template>
  <el-dialog v-model="VisibleForCoordinate" width="50%" @close="cancelHandle">
    <div>
      <div id="container" class="map"></div>
      <div class="input-card">
        <h4>左击获取经纬度：</h4>
        <div class="input-item">
          <input type="text" readonly="true" v-model="lnglat">
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, onMounted, withDefaults, defineProps, reactive} from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader'
const VisibleForCoordinate = ref(false)
const init = () =>{
  VisibleForCoordinate.value = true
}
const cancelHandle = () => {
  VisibleForCoordinate.value = false
}

const state = reactive({
  path: [],
  current_position: [],
});
function initMap() {
  AMapLoader.load({
    key: "bc7e543ab9ee7d7ecc211ca17a83d46c", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  })
      .then((AMap) => {
        const map = new AMap.Map("container", {
          viewMode: "2D", //是否为3D地图模式
          //设置地图容器id
          zoom: 10, //初始化地图级别
          center: [120.374926, 30.310678], //初始化地图中心点位置
        });
        //添加插件
        AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.HawkEye"], function () {
          //异步同时加载多个插件
          map.addControl(new AMap.HawkEye()); //显示缩略图
          map.addControl(new AMap.Scale()); //显示当前地图中心的比例尺
        });
        // 单击
        map.on("click", (e) => {
          // console.log(e);
          state.current_position = [e.lnglat.KL, e.lnglat.kT];
          state.path.push([e.lnglat.KL, e.lnglat.kT]);
          addMarker();

          addPolyLine();
          // 地图按照适合展示图层内数据的缩放等级展示
          // map.setFitView();
        });

        // 实例化点标记
        function addMarker() {
          const marker = new AMap.Marker({
            icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
            position: state.current_position,
            offset: new AMap.Pixel(-26, -54),
          });
          marker.setMap(map);
        }

        // 折线
        function addPolyLine() {
          const polyline = new AMap.Polyline({
            path: state.path,
            isOutline: true,
            outlineColor: "#ffeeff",
            borderWeight: 1,
            strokeColor: "#3366FF",
            strokeOpacity: 0.6,
            strokeWeight: 5,
            // 折线样式还支持 'dashed'
            strokeStyle: "solid",
            // strokeStyle是dashed时有效
            // strokeDasharray: [10, 5],
            lineJoin: "round",
            lineCap: "round",
            zIndex: 50,
          });
          map.add([polyline]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
}
onMounted(()=>{
  initMap();
})

defineExpose({
  init
})
</script>

<style >
#container {
  width:500;
  height: 400px;
  margin-left:auto;
  margin-right:auto;
}
</style>