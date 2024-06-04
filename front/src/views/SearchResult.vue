<!-- finished -->
<template>
  <div class="searchresult">
    <div class="result-top-info">
      <h2>{{ reqmusic }}</h2>
      <span>共找到{{ total }}个结果</span>
    </div>
    <!-- tab切换 -->
    <div class="tab-wrap">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick(activeName)"
        class="eltab"
      >
        <el-tab-pane label="歌曲" name="first">
          <div class="songs-table">
            <el-table
              :data="songList"
              style="width: 100%"
              @row-dblclick="playMusic"
            >
              <el-table-column type="index" width="100"></el-table-column>
              <el-table-column prop="name" label="音乐标题" width="200">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="singerName" label="歌手" width="200">
              </el-table-column>
              <el-table-column prop="albumName" label="专辑" width="250">
              </el-table-column>
              <el-table-column prop="duration" label="时长" width="250">
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="歌单" name="second">
          <div class="songs-wrap">
            <div class="list">
              <ul>
                <li
                  class="iconfont icon-play"
                  v-for="(item, index) in playList"
                  :key="index"
                  @click="playListDetail(item.id)"
                >
                  <p class="first-p">风格：{{ item.style }}</p>
                  <img :src="item.pic" alt="recommend" class="songListPic"/>
                  <p class="last-p" :title="item.title">{{ item.title }}</p>
                </li>
              </ul>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="MV" name="third">
          <ul class="mv-list">
            <li
              v-for="(item, index) in mvList"
              :key="index"
              @click="toMvdetail(item.id)"
            >
              <div class="mv-img-wrap">
                <img :src="item.cover" alt="newMvs" />
                <p class="iconfont icon-play play"></p>
                <p class="play-count iconfont icon-play">
                  {{ item.playCount }}
                </p>
                <p class="mv-duration">{{ item.duration }}</p>
              </div>
              <div class="mv-info">
                <p class="title" :title="item.name">{{ item.name }}</p>
                <p class="author">{{ item.artistName }}</p>
              </div>
            </li>
          </ul>
        </el-tab-pane>

        <!-- <el-tab-pane label="歌手" name="fourth">
          <ul class="mv-list">
            <li
              v-for="(item, index) in mvList"
              :key="index"
              @click="toMvdetail(item.id)"
            >
              <div class="mv-img-wrap">
                <img :src="item.cover" alt="newMvs" />
                <p class="iconfont icon-play play"></p>
                <p class="play-count iconfont icon-play">
                  {{ item.playCount }}
                </p>
                <p class="mv-duration">{{ item.duration }}</p>
              </div>
              <div class="mv-info">
                <p class="title" :title="item.name">{{ item.name }}</p>
                <p class="author">{{ item.artistName }}</p>
              </div>
            </li>
          </ul>
        </el-tab-pane> -->
      </el-tabs>
      <el-pagination
        class="page-list"
        @current-change="handleCurrentChange"
        :current-page="page"
        layout="prev, pager, next"
        :total="total"
        :page-size="20"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "SearchResult",
  data() {
    return {
      activeName: "first",
      page: 1,
      // 歌曲列表
      songList: [],
      // 歌单列表
      playList: [],
      // MV列表
      mvList: [],
      total: 0,
      tag: 1,
      reqmusic: "",
    };
  },
  computed: {
    musicQueue() {
      return this.$store.state.musicQueue;
    },
  },
  methods: {
    handleClick(name) {
      if (name == "first") {
        this.tag = 1;
      } else if (name == "second") {
        this.tag = 1000;
      } else if (name == "third") {
        this.tag = 1004;
      }
    },
    playMusic(row) {
      let id = row.id;
      axios({
        url: `/song/detail/${id}`,
        method: "get",
      }).then((res) => {
        console.log("音乐地址：", res.data.data.url);
        this.$parent.$data.musicinfo = row;
        this.$parent.$data.musicurl = res.data.data.url;
        let musicitem = {
          id: row.id,
          name: row.name,
          musicArtist: row.singerName,
          duration: row.duration,
          picUrl: row.pic,
        };
        this.$store.commit("changeMusicInfo", musicitem);
        this.$store.commit("changeMusicQueue", musicitem);
        let ids = [];
        for (const item of this.musicQueue) {
          ids.push(item.id);
        }
        this.$store.commit("changeNowIndex", ids.indexOf(row.id));
      });
    },
    musicLists() {
      //歌曲搜索
      if (this.tag == 1) {
        axios({
          url: `/song/song-name/detail/${this.reqmusic}/${this.page}/${20}`,
          method: "get",
        }).then((res) => {
          this.songList = res.data.data;
          this.total = this.songList.length;
        });
      }
      //歌单搜索
      else if (this.tag == 1000) {
        axios({
          url: `/songList/title/detail/${this.reqmusic}/${this.page}/${20}`,
          method: "get",
        }).then((res) => {
          this.playList = res.data.data;
          this.total = this.playList.length;
        });
        for (let i = 0; i < this.playList.length; i++) {
          if (this.playList[i].playCount > 10000) {
            this.playList[i].playCount =
              parseInt(this.playList[i].playCount / 10000) + "w";
          }
        }
      }
      //MV搜索
      else if (this.tag == 1004) {
        axios({
          url: `/mv/title/detail/${this.reqmusic}/${this.page}/${20}`,
          method: "get",
        }).then((res) => {
          this.mvList = res.data.data;
          this.total = this.mvList.length;
        });
        for (let i = 0; i < this.mvList.length; i++) {
          if (this.mvList[i].playCount > 10000) {
            this.mvList[i].playCount =
              parseInt(this.mvList[i].playCount / 10000) + "w";
          }
        }
      }
    },
    handleCurrentChange(val) {
      console.log(`当前页:${val}`);
      this.page = val;
      this.musicLists();
    },
    playListDetail(id) {
      this.$router.push(`/playlistdetail?q=${id}`);
    },
    toMvdetail(id) {
      this.$router.push(`/mvdetail?q=${id}`);
    },
  },
  created() {
    this.reqmusic = this.$route.query.q;
    this.musicLists();
  },
  watch: {
    tag() {
      console.log("tag变化，发送请求");
      this.musicLists();
    },
    $route(newVal) {
      this.reqmusic = newVal.query.q;
      this.total = 0;
      this.page = 1;
      this.musicLists();
    },
  },
};
</script>

<style scoped>
@import "../assets/common/tab.css";
ul {
  list-style: none;
}
.searchresult {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
}
.result-top-info {
  margin-bottom: 20px;
  display: flex;
  align-items: flex-end;
}

.result-top-info span {
  margin-left: 10px;
  font-size: 12px;
  color: grey;
}
.el-tabs {
  margin: 20px;
  width: 100%;
}
.tab-wrap {
  margin-bottom: 200px;
  width: 100%;
}
.el-tab-pane {
  width: 1000px;
}
.mvIcon {
  margin-left: 5px;
  cursor: pointer;
}

/* 歌单Tab */
.songs-wrap .list ul {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.songs-wrap .list li {
  width: 180px;
  height: 220px;
  margin: 10px 0;
  margin-right: 60px;
  margin-bottom: 60px;
  position: relative;
  overflow-y: hidden;
}

.songListPic
{
  width: 180px;
  height: 180px;
}

.list li .first-p {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 12px;
  padding: 5px;
  box-sizing: border-box;
  transform: translateY(-100%);
  transition: 0.5s;
}

.list li::before {
  content: "\ea42";
  position: absolute;
  bottom: 45px;
  right: 10px;
  width: 25px;
  height: 25px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  color: palevioletred;
  opacity: 0;
  transition: 0.3s;
  cursor: pointer;
}

.list li:hover .first-p {
  transform: translateY(0);
}

.list li:hover::before {
  opacity: 1;
}

.songs-wrap ul img {
  width: 100%;
  border-radius: 5px;
}

.songs-wrap ul .last-p {
  font-size: 14px;
  overflow: hidden;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 10px auto;
}

/* MVTabs */
.mv-list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.mv-list li {
  width: 16%;
  margin-bottom: 20px;
  margin-right: 60px;
}

.mv-img-wrap {
  position: relative;
  cursor: pointer;
}

.mv-img-wrap img {
  width: 165px;
  height: 165px;
  border-radius: 5px;
}

.mv-img-wrap:hover .play::before {
  opacity: 1;
}

.mv-img-wrap .play::before {
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
  font-size: 12px;
  -webkit-text-stroke: 1px blue;
}

.play-count::before {
  margin-right: 5px;
}

.mv-duration {
  position: absolute;
  bottom: 10px;
  right: 5px;
  color: #fff;
  font-size: 12px;
  -webkit-text-stroke: 1px blue;
}

.mv-info p {
  margin: 5px 0;
}

.mv-info p.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mv-info .author {
  color: #a5a1a1;
  font-size: 12px;
}
.page-list {
  text-align: center;
}
</style>