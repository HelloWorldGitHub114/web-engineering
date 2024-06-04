<!-- OK -->
<template>
  <div class="musicdetail">
    <div class="musicright-wrap">
      <!-- <h2>预留歌词滚动区域</h2>

      <div class="lyrics-container">
        <div class="lyrics">
          <p>...</p>
          <p>...</p>
          <p>...</p>
        </div>
      </div> -->

      <!-- 调用评论组件 -->
      <!-- 向子组件传递： -->
      <!-- type：music MV 或者 songList -->
      <!-- id -->
      <!-- 子组件通过请求得到评论数据，父组件不管理数据 -->
      <CommentSection type="music" :id="this.$route.query.q" />
    </div>

    <div class="musicleft-wrap">
      <h2>音乐详情</h2>
      <div class="music-info">
        <div class="music-info-head">
          <img class="musicartimg" :src="musicinfos.pic" alt="" />
          <p class="music-nickname">{{ musicinfos.singerName }}</p>
        </div>
        <div class="music-name">{{ musicinfos.name }}</div>
        <div class="music-other">
          <div class="music-time">发布时间：{{ musicinfos.createTime }}</div>
          <div class="music-playcount">播放：{{ musicinfos.playCount }}次</div>
        </div>
        <p class="music-desc">{{ musicinfos.introduction }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CommentSection from "./CommentSection.vue";
export default {
  name: "MusicDetail",
  components: {
    CommentSection,
  },
  data() {
    return {
      musicinfos: {},
    };
  },
  created() {
    this.getmusicinfo();
  },
  methods: {
    getmusicinfo()
    {
      axios({
      url: `/song/detail/${this.$route.query.q}`,
      method: "get",
    }).then((res) => {
      this.musicinfos = res.data.data;
      console.log(res.data.data);
      if (this.musicinfos.playCount > 10000) {
        this.musicinfos.playCount =
          parseInt(this.musicinfos.playCount / 10000) + "w";
      }
    });
    }
  },
  watch: {
    $route() {
      this.getmusicinfo();
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
}
.musicdetail {
  display: flex;
  width: 1200px;
  padding: 20px 0;
  margin: 35px;
  box-shadow: 0 0 10px #0003;
  background-color: #fff;
}
.music-info {
  margin: 20px 0;
  align-items: center;
}
.music-info-head {
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.music-info .music-info-head .musicartimg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
}
.music-info .music-info-head .musictitle {
  font-size: 25px;
  font-weight: bold;
  margin-left: 20px;
}
.music-info .music-name {
  font-size: 30px;
  color: #000;
  font-weight: 700;
}
.music-info .music-other {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: grey;
  margin: 20px 0;
}
.music-info .music-time {
  margin-right: 20px;
}
.music-info .music-desc {
  font-size: 14px;
  margin-bottom: 20px;
}
.musicright-wrap {
  width: 800px;
  margin: 10px 30px;
  margin-bottom: 150px;
}

.lyrics-container {
  position: relative;
  width: 300px; /* 调整为合适的宽度 */
  height: 300px; /* 调整为合适的高度 */
  overflow: hidden; /* 隐藏超出的部分 */
  margin-top: 50px;
  margin-bottom: 50px;
  margin-left: 200px;
  background-color: #f8f8f8; /* 背景色可以自定义 */
  border: 1px solid #ccc; /* 边框可以自定义 */
  padding: 10px;
  box-sizing: border-box;
}

.lyrics {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: top 0.5s ease; /* 平滑滚动效果 */
}

.lyrics p {
  margin: 10px 0;
  font-size: 16px; /* 调整字体大小 */
  text-align: center; /* 居中文本 */
}

.musicleft-wrap {
  width: 450px;
  margin-left: 20px;
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 10px;
  box-sizing: border-box;
}
</style>