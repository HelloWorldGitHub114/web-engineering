<!-- FIN -->
<template>
  <div class="discover">
    <!-- 推荐歌单 -->
    <div class="songs-warp">
      <h3>推荐歌单</h3>
      <div class="list">
        <ul>
          <li
            class="iconfont icon-play"
            v-for="(item, index) in musiclists"
            :key="index"
            @click="playListDetail(item.id)"
          >
            <p class="first-p">{{ item.userId }}</p>
            <img :src="item.pic" alt="recommd" class="songListPic"/>
            <p class="last-p" :title="item.title">{{ item.title }}</p>
          </li>
        </ul>
      </div>
    </div>

    <!-- 最新音乐 -->
    <div class="songs-warp">
      <h3>最新音乐</h3>
      <ul class="new-songs">
        <li
          v-for="(item, index) in newsmusic"
          :key="index"
          @click="playMusic(item)"
        >
          <div class="music-img-warp">
            <img :src="item.pic" alt="newSongs" />
            <p class="iconfont icon-play"></p>
          </div>
          <div class="music-info">
            <p class="music-name">{{ item.name }}</p>
            <p class="music-singer">{{ item.singerName }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- 最新M V -->
    <div class="songs-warp mv-warp">
      <h3>推荐MV</h3>
      <ul class="mv-list">
        <li
          v-for="(item, index) in newsmv"
          :key="index"
          @click="toMvdetail(item.id)"
        >
          <div class="mv-img-warp">
            <img class="mvPic" alt="newMvs" :src="item.cover" />
            <p class="iconfont icon-play play"></p>
            <p class="play-count iconfont icon-play">{{ item.playCount }}</p>
          </div>
          <div class="mv-info">
            <p class="title">{{ item.name }}</p>
            <p class="author">{{ item.artistName }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "FindMusic",
  data() {
    return {
      // 推荐歌单
      musiclists: [],
      // 最新音乐
      newsmusic: [],
      // 最新mv
      newsmv: [],
    };
  },
  computed: {
    musicQueue() {
      return this.$store.state.musicQueue;
    },
  },
  created() {
    // 推荐歌单
    axios({
      url: `/songList/getRandomSongList/${4}`,
      method: "get",
    }).then((res) => {
      this.musiclists = res.data.data;
    });
    // 最新音乐
    axios({
      url: `/song/allSong/${1}/${5}`,
      method: "get",
    }).then((res) => {
      this.newsmusic = res.data.data;
    });
    // 最新MV
    axios({
      url: "/mv/personalized",
      method: "get",
      params: {
        limit: 4,
      },
    }).then((res) => {
      this.newsmv = res.data.data;
    });
  },
  methods: {
    // 播放音乐
    playMusic(item) {
      let id = item.id;
      axios({
        url: `/song/detail/${id}`,
        method: "get",
      }).then((res) => {
        console.log("音乐地址：", res.data.data.url);
        this.$parent.$data.musicinfo = item;
        this.$parent.$data.musicurl = res.data.data.url;
      });
      let musicitem = {
        id: item.id,
        name: item.name,
        musicArtist: item.singerName,
        duration: item.duration,
        picUrl: item.pic,
        lyric: item.lyric
      };
      this.$store.commit("changeMusicInfo", musicitem);
      this.$store.commit("changeMusicQueue", musicitem);
      let ids = [];
      for (const row of this.musicQueue) {
        ids.push(row.id);
      }
      this.$store.commit("changeNowIndex", ids.indexOf(item.id));
    },
    playListDetail(id) {
      this.$router.push(`/playlistdetail?q=${id}`);
    },
    toMvdetail(id) {
      this.$router.push(`/mvdetail?q=${id}`);
    },
  },
};
</script>

<style scoped>
@import "../assets/icomoon/style.css";
.discover {
  z-index: 12;
  margin: 0 auto;
  padding: 20px;
  max-width: 1600px;
}
.el-carousel--horizontal {
  overflow-x: hidden;
}
.el-carousel {
  position: relative;
  width: 850px;
  margin: 0 auto; /* 水平居中 */
}
.el-carousel__item--card {
  border-radius: 20px;
}

.songs-warp {
  margin-bottom: 20px;
}
.songs-warp h3 {
  color: rgb(145, 137, 139);
  margin-bottom: 20px;
}
/* 推荐歌单 */
.songs-warp .list ul {
  list-style: none;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.list ul li {
  width: 140px;
  height: 180px;
  margin-right: 50px;
  position: relative;
  overflow-y: hidden;
}
.songListPic
{
  width: 140px;
  height: 140px;
  cursor: pointer;
}

.list li .first-p {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background-image: linear-gradient(
    rgba(255, 192, 203, 0.5),
    rgba(255, 192, 203, 0)
  );
  color: #fff;
  font-size: 12px;
  padding: 5px;
  box-sizing: border-box;
  transform: translateY(-100%);
  transition: 0.5s;
}

.list li:hover .first-p {
  transform: translateY(0);
}
.list li:hover .last-p {
  color: palevioletred;
}
.list li:hover::before {
  opacity: 1;
}

ul img {
  width: 100%;
  border-radius: 5px;
  /* opacity: 1; */
}

ul .last-p {
  cursor: pointer;
  font-size: 14px;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 5px;
}
ul .last-p:hover {
  color: palevioletred;
}
/* 最新音乐  */
.new-songs {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.new-songs li {
  width: 50%;
  display: flex;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
}

.new-songs li:hover {
  background-image: linear-gradient(
    to right,
    rgba(255, 192, 203, 0.5),
    rgba(255, 192, 203, 0)
  );
  border-radius: 5px;
}

.new-songs li:hover::before {
  opacity: 1;
}

.new-songs .music-img-warp {
  position: relative;
  width: 100px;
  height: 100px;
  cursor: pointer;
  overflow: hidden;
}

.new-songs .music-img-warp img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.new-songs .music-img-warp:hover p::before {
  opacity: 1;
}

.new-songs .music-img-warp p::before {
  content: "\ea42";
  position: absolute;
  top: 50%;
  left: 50%;
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

.music-info {
  flex: 1;
  padding: 0 10px;
}

.new-songs li p:first-child {
  margin-bottom: 20px;
}

.music-singer {
  color: rgb(145, 137, 139);
  font-size: 12px;
}
/* 最新MV */

.mv-list {
  display: flex;
  justify-content: flex-start;
  list-style: none;
  flex-wrap: wrap;
}

.mv-list li {
  width: 150px;
  height: 150px;
  padding: 0 10px;
  margin-right: 40px;
}

.mv-img-warp {
  position: relative;
  cursor: pointer;
}

.mvPic
{
  width: 150px;
  height: 150px;
}

.mv-img-warp:hover .play::before {
  opacity: 1;
}

.mv-img-warp .play::before {
  content: "\ea42";
  position: absolute;
  top: 50%;
  left: 50%;
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

.play-count {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #fff;
  text-shadow: 0 0 2px rgb(255, 192, 203);
}

.play-count::before {
  margin-right: 5px;
}

.mv-info p {
  margin: 5px 0;
}

.mv-info .author {
  color: #a5a1a1;
  font-size: 12px;
}
.mv-warp {
  margin-bottom: 200px;
}
</style>