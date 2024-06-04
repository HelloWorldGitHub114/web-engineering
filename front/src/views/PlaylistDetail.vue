<template>
  <div class="playlist-detail">
    <div class="playlist-topcard">
      <div class="topcard-img">
        <img :src="playlist.pic" alt="" />
      </div>
      <div class="topcard-right">
        <div class="playlist-name">
          <div class="tag1">歌单</div>
          {{ playlist.title }}
        </div>
        <div class="user-info">
          <div class="user-avatar">
            <img :src="user.avatar" alt="" />
          </div>
          <div class="user-name" @click="userDetail(user.id)">
            {{ user.nickname }}
          </div>
          <div class="create-time">
            <span>{{ playlist.createTime }}</span> 创建
            <span>共{{ total }}首</span>
          </div>
        </div>
        <div class="playAllBtn" @click="playAllMusic()">
          <i class="iconfont icon-play-all"></i>播放全部
        </div>
        <!-- <div class="loveBtn"><i class="iconfont icon-love-all"></i>收藏</div> -->
        <div class="playlist-tags">
          <span>风格：</span>
          <span class="tags">{{ playlist.style }}</span>
        </div>
        <div class="playlist-desc">
          <span>简介：</span>
          <span :title="playlist.introduction">{{
            playlist.introduction
          }}</span>
        </div>
      </div>
    </div>
    <div class="playlist-tabwrap">
      <el-tabs v-model="activeName">
        <el-tab-pane label="歌曲列表" name="first">
          <el-table :data="musiclists" style="width: 100%">
            <el-table-column type="index" width="80"></el-table-column>
            <el-table-column width="150">
              <template slot-scope="scope">
                <div class="img-wrap" @click="playMusic(scope.row)">
                  <img :src="scope.row.pic" alt="" />
                  <p class="iconfont icon-play"></p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="音乐标题" width="200">
            </el-table-column>
            <el-table-column prop="singerName" label="歌手" width="220">
            </el-table-column>
            <el-table-column prop="albumName" label="专辑" width="300">
            </el-table-column>
            <el-table-column prop="duration" label="时长"> </el-table-column>
          </el-table>

          <div class="page-list">
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="12"
            :current-page="pageNo"
            layout="prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
        </el-tab-pane>


        <el-tab-pane label="评论" name="second">
          <CommentSection type="songList" :id="this.$route.query.q" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CommentSection from "./CommentSection.vue";

export default {
  name: "PlaylistDetail",
  components: {
    CommentSection,
  },
  data() {
    return {
      activeName: "first",
      // 歌单的详情数据
      playlist: {},
      user: {},
      musiclists: [],
      avatarUrl: "",
      nickname: "",
      pageNo: 1,
      pageSize: 12,
      total: 0,
    };
  },
  computed: {
    musicQueue() {
      return this.$store.state.musicQueue;
    },
  },
  methods: {
    playMusic(row) {
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
      };
      this.$store.commit("changeMusicInfo", musicitem);
      this.$store.commit("changeMusicQueue", musicitem);
      let ids = [];
      for (const item of this.musicQueue) {
        ids.push(item.id);
      }
      this.$store.commit("changeNowIndex", ids.indexOf(row.id));
    },
    playAllMusic() {
      let allSongs = this.musiclists;
      console.log(allSongs);
      for (const item of allSongs) {
        let musicitem = {
          id: item.id,
          name: item.name,
          musicArtist: item.singerName,
          duration: item.duration,
          picUrl: item.pic,
        };
        this.$store.commit("changeMusicQueue", musicitem);
      }
      this.$store.commit("changeNowIndex", 0);
      this.playMusic(allSongs[0]);
    },
    userDetail(userid) {
      this.$router.push(`/userdetail?q=${userid}`);
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getsongs();
    },
    getsongs() {
      axios({
        //获取歌单歌曲列表
        url: `/listSong/detail/${this.$route.query.q}/${this.pageNo}/${this.pageSize}`,
        method: "get",
      }).then((res) => {
        this.allmusic = res.data.data.total;
        this.musiclists = res.data.data.list;
      });
    },
    getListDetail() {
      //获取歌单详情
      axios({
        url: `/songList/detail/${this.$route.query.q}`,
        method: "get",
      }).then((res) => {
        this.playlist = res.data.data;
        axios({
          url: `/user/detail/${this.playlist.userId}`,
          method: "get",
        }).then((res) => {
          this.user = res.data.data;
        });
      });
    },
  },
  created() {
    this.getListDetail();
    this.getsongs();
  },
};
</script>
<style scoped>
ul {
  list-style: none;
}
.playlist-detail {
  width: 1200px;
  padding: 20px 0;
  margin: 35px;
  box-shadow: 0 0 10px #0003;
  background-color: #fff;
}
.playlist-topcard {
  padding: 135px 0 !important;
  border: 1px solid #ccc;
  position: relative;
  display: flex;
  align-items: center;
  width: 72rem;
  height: 2rem;
  margin: 0 auto;
}
.topcard-img {
  margin: 0 1.4rem;
}
.topcard-img img {
  margin-top: -20px;
  width: 15rem;
  height: 15rem;
}
.topcard-right {
  padding: 0 20px;
  flex: 1;
  margin-bottom: 40px;
}
.playlist-name {
  font-size: 25px;
  font-weight: 600;
  display: flex;
  align-items: center;
}
.img-wrap .iconfont::before {
  content: "\ea42";
  position: absolute;
  bottom: 18px;
  right: 18px;
  width: 25px;
  height: 25px;
  font-size: 25px;
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

.tag1 {
  color: palevioletred;
  border: 1px solid palevioletred;
  display: inline-block;
  font-size: 20px;
  margin-right: 10px;
  border-radius: 5px;
  padding: 0 7px;
  cursor: default;
}
.user-info {
  display: flex;
  align-items: center;
  font-size: 15px;
}
.user-avatar img {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin: 10px 0;
}
.user-name {
  margin: 0 10px;
  font-size: 18px;
  color: skyblue;
  cursor: pointer;
}
.playAllBtn {
  display: inline-block;
  margin-right: 10px;
  border-radius: 20px;
  background: #d87093;
  padding: 5px 15px;
  color: #fff;
  cursor: pointer;
}
.playAllBtn:hover {
  background: pink;
}
.icon-play-all::before {
  content: "";
  font-size: 18px;
}
.loveBtn {
  display: inline-block;
  margin-right: 10px;
  border-radius: 20px;
  border: 1px solid #d87093;
  padding: 5px 15px;
  color: #d87093;
  cursor: pointer;
}
.loveBtn:hover {
  background: #d87093;
  color: #fff;
}
.icon-love-all::before {
  content: "";
  margin-right: 10px;
}
.playlist-tags {
  margin: 10px 0;
}
.playlist-tags .tags {
  font-size: 14px;
}
.playlist-tags .tags:not(:last-of-type)::after {
  content: "/";
  margin: 0 4px;
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
.playlist-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.playlist-tabwrap {
  margin: 30px 30px 200px;
}
.page-list {
  margin: 10px;
  margin-bottom: 100px;
  text-align: center;
}
</style>