<!-- finished -->
<template>
  <div class="mvdetail">
    <div class="mvright-wrap">
      <h2>MV详情</h2>
      <div class="mvplay-wrap">
        <video :src="mvinfos.url" controls autoplay></video>
      </div>
      <div class="mv-info">
        <div class="mv-info-head">
          <img class="mvartimg" :src="mvinfos.cover" alt="" />
          <p class="mv-nickname">{{ mvinfos.artistName }}</p>
        </div>
        <div class="mv-name">{{ mvinfos.name }}</div>
        <div class="mv-other">
          <div class="mv-time">发布时间：{{ mvinfos.publishTime }}</div>
          <div class="mv-playcount">播放：{{ mvinfos.playCount }}次</div>
        </div>
        <p class="mv-desc">{{ mvinfos.introduction }}</p>
      </div>
      <CommentSection type="MV" :id="this.$route.query.q" />
    </div>
    <div class="mvleft-wrap">
      <h2>相关推荐</h2>
      <ul class="mv-list">
        <li
          v-for="(item, index) in simiMvs"
          :key="index"
          @click="toMvdetail(item.id)"
        >
          <div class="mvlist-img">
            <img :src="item.cover" alt=""/>
            <p class="iconfont icon-play"></p>
          </div>
          <div class="mvlist-info">
            <p class="mvlist-name">{{ item.name }}</p>
            <p class="mvlist-singer">{{ item.artistName }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CommentSection from "./CommentSection.vue";
export default {
  name: "MvDetail",
  components: {
    CommentSection,
  },
  data() {
    return {
      mvUrl: "",
      simiMvs: [],
      mvinfos: {},
    };
  },
  created() {
    //MV相关推荐
    axios({
      url: "/mv/simi",
      method: "get",
      params: { mvid: this.$route.query.q },
    }).then((res) => {
      this.simiMvs = res.data.data.slice(0,4);
    });
    //MV信息
    axios({
      url: "/mv/detail",
      method: "get",
      params: { mvid: this.$route.query.q },
    }).then((res) => {
      this.mvinfos = res.data.data;
      if (this.mvinfos.playCount > 10000) {
        this.mvinfos.playCount = parseInt(this.mvinfos.playCount / 10000) + "w";
      }
    });
  },
  methods: {
    toMvdetail(id) {
      this.$router.push(`/mvdetail?q=${id}`);
      this.$router.go(0);
    },
    userDetail(username) {
      this.$router.push(`/userdetail?q=${username}`);
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
}
.mvdetail {
  display: flex;
  width: 1200px;
  padding: 20px 0;
  margin: 35px;
  box-shadow: 0 0 10px #0003;
  background-color: #fff;
}
.mv-info {
  margin: 20px 0;
  align-items: center;
}
.mv-info-head {
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.mv-info .mv-info-head .mvartimg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
}
.mv-info .mv-info-head .mvtitle {
  font-size: 25px;
  font-weight: bold;
  margin-left: 20px;
}
.mv-info .mv-name {
  font-size: 30px;
  color: #000;
  font-weight: 700;
}
.mv-info .mv-other {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: grey;
  margin: 20px 0;
}
.mv-info .mv-time {
  margin-right: 20px;
}
.mv-info .mv-desc {
  font-size: 14px;
  margin-bottom: 20px;
}
.mvright-wrap {
  width: 800px;
  margin: 10px 30px;
  margin-bottom: 150px;
}
.mvplay-wrap {
  width: 100%;
  height: 390px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.mvplay-wrap video {
  width: 100%;
  height: 100%;
  outline: none;
  object-fit: fill;
}

.mv-list li {
  display: flex;
  padding: 10px;
  box-sizing: border-box;
}
.mv-list li:hover {
  background-image: linear-gradient(
    to right,
    rgba(255, 192, 203, 0.5),
    rgba(255, 192, 203, 0)
  );
  border-radius: 5px;
}
.mv-list .icon-play::before {
  content: "\ea42";
  position: absolute;
  top: 50%;
  left: 45%;
  transform: translate(-50%, -50%);
  width: 35px;
  height: 35px;
  font-size: 35px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: palevioletred;
  opacity: 0;
  transition: 0.3s;
  cursor: pointer;
}
.mv-list li:hover p::before {
  opacity: 1;
}
.mvleft-wrap {
  width: 450px;
  margin-left: 20px;
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 10px;
  box-sizing: border-box;
}
.mvlist-img {
  position: relative;
  cursor: pointer;
}
.mvlist-img img {
  width: 150px;
  height: 150px;
  margin-right: 20px;
}
.mvlist-info {
  overflow: hidden;
}
.mvlist-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 10px;
}
.mvlist-singer {
  color: #a5a1a1;
  font-size: 12px;
}
</style>