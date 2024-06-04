<!-- finished -->
<template>
  <div id="index-cont">
    <!-- 导航区域 -->
    <div class="nav">
      <ul>
        <li>
          <router-link to="/findmusic"> 🎵发现音乐 </router-link>
        </li>
        <li>
          <router-link to="/playlists"> 🎶推荐歌单 </router-link>
        </li>
        <li>
          <router-link to="/newsongs"> 💿全部音乐 </router-link>
        </li>
        <li>
          <router-link to="/newmvs"> 📺最新MV </router-link>
        </li>
      </ul>
    </div>
    <!-- 主体区域 -->
    <div class="main">
      <!-- 路由的出口 地址命中之后，把组件显示的位置 -->
      <router-view></router-view>
    </div>
    <!-- 播放标签 -->
    <div class="player">
      <MusicProcess :musicurl="musicurl" :musicinfo="musicinfo"></MusicProcess>
    </div>
  </div>
</template>

<script>
import MusicProcess from "../views/MusicProcess.vue";
import pubsub from "pubsub-js";
export default {
  name: "IndexCont",
  data() {
    return {
      // 歌曲播放地址
      musicurl: "",
      // 歌曲播放信息
      musicinfo: "",
    };
  },
  mounted() {
    pubsub.subscribe("musicurldemo", (msgName, data) => {
      this.musicurl = data;
    });
    this.musicinfo = pubsub.subscribe("musicinfodemo", (msgName, data) => {
      this.musicinfo = data;
    });
  },
  components: {
    MusicProcess,
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
#index-cont {
  position: fixed;
  display: flex;
  height: 100%;
  overflow-y: auto;
}
#index-cont .nav {
  z-index: 100;
  font-size: 18px;
  position: fixed;
  width: 200px;
  height: 100%;
  background-color: #f8f8f8;
  padding: 20px;
  box-sizing: border-box;
  cursor: pointer;
}
#index-cont .nav ul {
  list-style: none;
}
#index-cont .nav ul li {
  text-align: center;
  margin-top: 30px;
}
#index-cont .nav ul li a {
  text-decoration: none;
  color: LightSkyBlue;
}
#index-cont .nav ul li:hover path {
  fill: DeepSkyBlue;
}
#index-cont .nav ul li a:hover {
  color: DeepSkyBlue;
}
#index-cont .nav ul li .router-link-active {
  color: DeepSkyBlue;
}
#index-cont .nav ul li .router-link-active path {
  fill: DeepSkyBlue;
}
#index-cont .main {
  margin-left: 200px;
  padding: 20px;
  height: 100%;
  width: calc(100% - 200px);
}
.player {
  z-index: 10;
  position: fixed;
  bottom: 0;
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
  background-color: LightSkyBlue;
  box-shadow: 0px 0px 10px DeepSkyBlue;
}
.player {
  z-index: 100;
}
</style>