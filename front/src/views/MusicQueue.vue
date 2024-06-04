<!-- finished -->
<template>
  <div class="musicqueue">
    <div class="queue-top">
      <span>播放列表/{{ musicQueue.length }}</span>
      <span class="clearQueue" @click="clearMusicQueue">
        <a herf="#" class="iconfont">🗑️</a>
      </span>
    </div>
    <el-scrollbar style="height: 85%" class="queue-cont">
      <ul>
        <li
          v-for="(item, index) in musicQueue"
          :key="index"
          :class="{
            'active-song': item.id == globalMusicInfo.id,
            select: true,
          }"
          @click="changeNowIndex(index)"
        >
          <!-- 点击播放列表条目不要直接用play，会触发监听器造成二次切换，直接changeNowIndex，让监听器进行play即可 -->
          <div class="playingIcon" v-show="item.id == globalMusicInfo.id">
            <div class="playingIcon1"></div>
            <div class="playingIcon2"></div>
            <div class="playingIcon3"></div>
          </div>
          <div class="musiclist-item">
            <span class="musiclist-songname-txt">{{ item.name }}</span>
            <span class="musiclist-artist">{{ item.musicArtist }}</span>
            <span class="musiclist-time">{{ item.duration }}</span>
            <span class="musiclist-delete" @click.stop="deleteQueue(item.id)">
              <!-- 使用@click.stop阻止点击删除按钮时触发父级元素的点击事件处理器 -->
              <span class="iconfont">❌</span>
            </span>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>
  <script>
import axios from "axios";
import pubsub from "pubsub-js";
export default {
  name: "MusicQueue",
  data() {
    return {};
  },
  methods: {
    changeNowIndex(index) {
      console.log("播放列表Index变更:", index);
      this.$store.commit("changeNowIndex", index);
    },
    clearMusicQueue() {
      if (this.musicQueue.length == 0) {
        this.$message({
          message: "列表已清空",
          type: "warning",
          showClose: true,
        });
      } else {
        this.$confirm("确定清空播放列表吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$store.commit("changeNowIndex", 0);
            this.$store.commit("changeMusicInfo", {});
            setTimeout(() => {
              this.$store.commit("clearMusicQueue");
            }, 100);
            this.$router.go(0);
            this.$message({
              type: "success",
              message: "已清空!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消清空",
            });
          });
      }
    },
    deleteQueue(id) {
      this.$confirm("确定删除该歌曲吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = [];
          for (const item of this.musicQueue) {
            ids.push(item.id);
          }
          let idindex = ids.indexOf(id);
          setTimeout(() => {
            this.$store.commit("deleteMusic", id);
            if (idindex < this.nowIndex) {
              this.$store.commit("changeNowIndex", this.nowIndex - 1);
            } else if (idindex == this.nowIndex) {
              if (this.nowIndex < this.musicQueue.length)
                this.playMusic(this.musicQueue[this.nowIndex]);
              if (this.musicQueue.length == 0) {
                this.$store.commit("changeNowIndex", 0);
                this.$store.commit("changeMusicInfo", {});
                setTimeout(() => {
                  this.$store.commit("clearMusicQueue");
                }, 100);
                this.$router.go(0);
              }
              if (this.nowIndex == this.musicQueue.length) {
                this.$store.commit("changeNowIndex", 0);
              }
            }
          }, 300);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    playMusic(row) {
      // 播放音乐
      let id = row.id;
      axios({
        url: `/song/detail/${id}`,
        method: "get",
      }).then((res) => {
        console.log("发布音乐id:", id);
        console.log("音乐地址：",res.data.data.url);
        pubsub.publish("musicinfodemo", res.data.data);
        pubsub.publish("musicurldemo", res.data.data.url);
      });
      this.$store.commit("changeMusicInfo", row);
      let ids = [];
      for (const item of this.musicQueue) {
        ids.push(item.id);
      }
      this.$store.commit("changeNowIndex", ids.indexOf(row.id));
    },
  },
  computed: {
    musicQueue() {
      return this.$store.state.musicQueue;
    },
    nowIndex() {
      return this.$store.state.nowIndex;
    },
    globalMusicInfo() {
      return this.$store.state.globalMusicInfo;
    },
  },
  watch: {
    nowIndex() {
      this.playMusic(this.musicQueue[this.nowIndex]);
    },
  },
};
</script>
  <style scoped>
.musicqueue {
  display: none;
  position: absolute;
  bottom: 60px;
  overflow: hidden;
  line-height: 40px;
  right: -115px;
  width: 480px;
  height: 410px;
  background-color: rgba(255, 192, 203, 0.8);
  border-radius: 10px;
  box-shadow: 0px 0px 4px #b99ca6;
}
.queue-top {
  position: relative;
  height: 50px;
  margin: 0 auto;
  font-size: 18px;
  padding: 0px 20px;
  color: #91898b;
  line-height: 50px;
  background-color: rgb(255, 192, 203);
  border-bottom: 1px solid #fff;
}
.queue-cont li:hover {
  background-color: rgb(255, 192, 203);
}
.active-song {
  background-color: rgb(255, 192, 203);
}
.select {
  cursor: pointer;
}
.iconfont {
  cursor: pointer;
  padding: 5px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 24px;
}
.iconfont:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.queue-cont .musiclist-number {
  float: left;
  width: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  color: #7c898e;
}
.queue-cont .musiclist-songname-txt {
  float: left;
  width: 120px;
  height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ffffff;
  margin-left: 50px;
}
.queue-cont .musiclist-artist {
  float: left;
  font-size: 14px;
  width: 75px;
  height: 40px;
  margin-left: 80px;
  margin-right: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #7c898e;
}
.queue-cont .musiclist-time {
  font-size: 14px;
  float: left;
  margin-left: 30px;
  width: 60px;
  color: #7c898e;
}
.playingIcon {
  width: 14px;
  height: 14px;
  overflow: hidden;
  display: flex;
  position: absolute;
  left: 20px;
  margin-top: 10px;
  font-weight: bold;
}

.playingIcon div {
  background-color: palevioletred;
  width: 4px;
  margin: 0 1px;
  height: 100%;
}

.playingIcon1 {
  /* transform: translate3d(0,0,0); */
  animation: playingIcon;
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
  animation-direction: alternate-reverse;
}

.playingIcon2 {
  /* transform: translate3d(0,4px,0); */
  animation: playingIcon;
  animation-duration: 0.5s;
  animation-delay: 0.2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
  animation-direction: alternate-reverse;
}

.playingIcon3 {
  /* transform: translate3d(0,8px,0); */
  animation: playingIcon;
  animation-duration: 0.5s;
  animation-delay: 0.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-out;
  animation-direction: alternate-reverse;
}

@keyframes playingIcon {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, 80%, 0);
  }
}
</style>