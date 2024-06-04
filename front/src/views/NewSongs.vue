<!-- OK -->
<template>
  <!-- 最新音乐 -->
  <div class="new-songs" :style="backgroundDiv">
    <!-- <div class="tab-bar">
      <span class="item" @click="tag = 0" :class="{ active: tag == 0 }"
        >全部</span
      >
      <span class="item" @click="tag = 7" :class="{ active: tag == 7 }"
        >华语</span
      >
      <span class="item" @click="tag = 96" :class="{ active: tag == 96 }"
        >欧美</span
      >
      <span class="item" @click="tag = 8" :class="{ active: tag == 8 }"
        >日本</span
      >
      <span class="item" @click="tag = 16" :class="{ active: tag == 16 }"
        >韩文</span
      >
    </div> -->
    <div class="songs-table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column width="180">
          <template slot-scope="scope">
            <div class="img-wrap" @click="playMusic(scope.row)">
              <img :src="scope.row.pic" alt="" />
              <p class="iconfont icon-play"></p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="音乐标题" width="250">
        </el-table-column>
        <el-table-column prop="singerName" label="歌手" width="250">
        </el-table-column>
        <el-table-column prop="albumName" label="专辑" width="250">
        </el-table-column>
        <el-table-column prop="duration" label="时长" width="250">
        </el-table-column>
      </el-table>

      <div class="page-list">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="10"
          :current-page="page"
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "NewSongs",
  data() {
    return {
      tableData: [],
      tag: "0",
      page: 1,
      total: 0,
      backgroundDiv: {},
    };
  },
  created() {
    this.getNewSongs();
  },
  computed: {
    musicQueue() {
      return this.$store.state.musicQueue;
    },
  },
  methods: {
    getNewSongs() {
      // 获取最新音乐数据
      axios({
        url: `song/allSong/${this.page}/${10}`,
        method: "get",
      }).then((res) => {
        this.tableData = res.data.data;
      });
      axios({
        url: `/song/count`,
        method: "get",
      }).then((res) => {
        this.total = res.data.data;
      });
    },
    playMusic(row) {
      // 播放音乐
      let id = row.id;
      axios({
        url: `/song/detail/${id}`,
        method: "get",
      }).then((res) => {
        console.log("音乐地址：", res.data.data.url);
        this.$parent.$data.musicinfo = row;
        this.$parent.$data.musicurl = res.data.data.url;
      });
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
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getNewSongs();
    }
  },
  // watch: {
  //   tag() {
  //     console.log("tag改变，重新发送请求");
  //     this.getNewSongs();
  //   },
  // },
};
</script>
<style scoped>
@import "../assets/common/tab.css";
ul {
  list-style: none;
}
.new-songs {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
}

.new-songs >>> .el-loading-spinner {
  top: 50%;
}

.el-table td,
.el-table th.is-leaf {
  border-bottom: none;
}

.el-table::before {
  opacity: 0;
}

.songs-table {
  width: 100%;
}

.img-wrap {
  width: 60px;
  height: 60px;
  position: relative;
}

.img-wrap img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.img-wrap .iconfont::before {
  content: "\ea42";
  position: absolute;
  bottom: 12px;
  right: 12px;
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
.img-wrap:hover .iconfont::before {
  opacity: 1;
}
.page-list {
  margin: 10px;
  margin-bottom: 150px;
}
.songs-table {
  margin-bottom: 200px;
}
.tab-bar span {
  height: 25px;
  margin-left: 20px;
  cursor: pointer;
  font-size: 15px;
  color: grey;
}

.tab-bar .item.active {
  color: palevioletred;
  font-weight: bold;
}

.page-list {
  margin: 10px;
  margin-bottom: 100px;
  text-align: center;
}

</style>