<!-- FIN. -->
<template>
  <div class="userdetail">
    <div class="user-wrap">
      <h1 style="display: flex; align-items: center; justify-content: space-between;">
      用户详情
      <div v-if="this.user.id === LoginUserId" class="title" style="display: flex; align-items: center;">
        <router-link :to="{ name: 'userupdate', query: { from: $route.fullPath } }" class="buttons" style="flex-grow: 10;">
          <el-button type="primary" round class="changeinfo" size='mini'>修改用户信息</el-button>
        </router-link>
        <div class="buttons" style="flex-grow: 1;">
          <el-button type="primary" @click="open" round class="logout" size='mini'>登出</el-button>
        </div>
      </div>
    </h1>
      <div class="user-info">
        <div class="user-info-head">
          <img class="userpicture" :src="user.avatar" alt="头像失效" />
          <div class="user-name">{{ user.nickname }}</div>
        </div>
        <div class="user-other">
          <div class="user-location">地 区：{{ user.location }}</div>
        </div>
        <p class="user-desc">个性签名：{{ user.introduction }}</p>
      </div>

      <h2 v-if="this.user.id === LoginUserId">我创建的歌单</h2>
      <h2 v-else>TA创建的歌单</h2>

      <div class="list-content">
        <div class="songs-wrap">
          <div class="list">
            <ul>
              <li class="newsonglist">
                <img class="newSonglistpic" @click="createVisible = true"
                  src="https://img.icons8.com/nolan/1600/add-list.png" alt="" />
                <p>创建新歌单</p>
              </li>
              <li class="iconfont icon-play songsli" v-for="(item, index) in list" :key="index"
                @click="playListDetail(item.id)">
                <p class="first-p">风格：{{ item.style }}</p>
                <img class="newSonglistpic" :src="item.pic" alt="" />
                <p class="last-p">{{ item.title }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <el-dialog title="创建歌单" :visible.sync="createVisible" width="50%" :modal-append-to-body="false"
        @close="handleClose" :before-close="handleClose">
        <!-- 防止遮罩层遮挡 -->
        <el-form ref="newlist" :model="newlist" label-width="80px">
          <el-form-item label="歌单名称">
            <el-input v-model="newlist.title"></el-input>
          </el-form-item>
          <el-form-item label="歌单简介">
            <el-input v-model="newlist.introduction"></el-input>
          </el-form-item>
          <el-form-item label="风格">
            <el-select v-model="newlist.style" placeholder="请选择歌单风格">
              <el-option v-for="style in style" :key="style" :label="style" :value="style">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="onsubmit()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "UserDetail",
  data() {
    return {
      list: [],
      style: [
        "欧美",
        "华语",
        "流行",
        "说唱",
        "摇滚",
        "民谣",
        "电子",
        "轻音乐",
        "影视原声",
        "ACG",
        "怀旧",
      ],
      user: {},
      createVisible: false,
      newlist: {
        introduction: "",
        style: "",
        title: "",
        pic: "https://s21.ax1x.com/2024/06/01/pkGCCyq.jpg",
        //默认歌单图片
      },
    };
  },
  created() {
    this.listData();
  },
  methods: {
    listData() {
      //获取用户对象
      axios({
        url: `/user/detail/${this.$route.query.q}`,
        method: "get",
      }).then((res) => {
        this.user = res.data.data;
      });
      //获取用户创建的歌单
      axios({
        url: `/songList/detail-userId/${this.$route.query.q}`,
        method: "get",
      }).then((res) => {
        this.list = res.data.data;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.listData();
    },
    handleCurrentChangeLike(val) {
      this.pagelike = val;
      this.listData();
    },
    playListDetail(id) {
      this.$router.push(`/playlistdetail?q=${id}`);
    },
    handleClose() {
      this.createVisible = false;
      this.newlist = {};
    },
    onsubmit() {
      axios({
        url: "/songList/add",
        method: "post",
        data: {
          pic: this.newlist.pic,
          style: this.newlist.style,
          title: this.newlist.title,
          introduction: this.newlist.introduction,
          userId: this.LoginUserId,
        },
      }).then((res) => {
        this.$message({
          message: res.data.msg,
          type: "info",
        });
      });
      setTimeout(() => {
        this.listData();
      }, 500);
      this.createVisible = false;
    },
    open() {
      this.$confirm("确定要登出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "登出成功!",
          });
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("isLogin");
          window.localStorage.removeItem("user");
          this.$router.push({ name: "login" });
          setTimeout(() => {
            this.$router.go(0);
          }, 500);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消登出",
          });
        });
    },
  },
  computed: {
    LoginUserId() {
      return this.$store.state.userid;
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
}

.userdetail {
  display: flex;
  width: 1200px;
  padding: 20px 0;
  margin: 35px;
  box-shadow: 0 0 10px #0003;
  background-color: #fff;
}

.user-info {
  margin: 20px 0;
  align-items: center;
}

.user-info-head {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.user-info .user-info-head .userpicture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info .user-name {
  font-size: 20px;
  color: #000;
  font-weight: 700;
}

.user-info .user-other {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: grey;
  margin: 20px 0;
}

.user-info .user-location {
  margin-right: 20px;
}

.user-info .user-desc {
  font-size: 14px;
  margin-bottom: 20px;
}

.user-wrap {
  width: 100%;
  margin: 10px 30px;
  margin-bottom: 150px;
}

.list-content {
  margin-top: 20px;
}

.songs-wrap .list ul {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.newsonglist {
  cursor: pointer;
  width: 150px;
  height: 190px;
  margin: 10px 0;
  position: relative;
  overflow-y: hidden;
  margin-right: 40px;
  margin-bottom: 25px;
}

.newSonglistpic {
  width: 150px;
  height: 150px;
}

.songsli {
  width: 150px;
  height: 190px;
  margin: 10px 0;
  position: relative;
  overflow-y: hidden;
  margin-right: 40px;
  margin-bottom: 25px;
}

.songsli .first-p {
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

.songsli::before {
  content: "\ea42";
  position: absolute;
  bottom: 40px;
  right: 5px;
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

.songsli:hover .first-p {
  transform: translateY(0);
}

.songsli:hover::before {
  opacity: 1;
}

.songs-wrap ul img {
  width: 100%;
  border-radius: 5px;
}

.songs-wrap ul .last-p {
  line-height: 20px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 5px 0;
}

.page-list {
  margin: 10px;
  margin-bottom: 100px;
  text-align: center;
}

.changeinfo {
  background-color: skyblue;
  border-color: skyblue;

}

.title {
  display: flex;
}

.logout {
  background-color: red;
  border-color: red;

}

.buttons {
  font-weight: normal;
  font-size: medium;
  align-self: flex-end;
}
</style>