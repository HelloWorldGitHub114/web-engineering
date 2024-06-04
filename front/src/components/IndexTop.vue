<!-- finished -->
<template>
  <div id="index-top">
    <router-link to="/findmusic" class="title">XD音乐</router-link>
    <input
      type="text"
      placeholder="搜索歌曲"
      class="index-top-search"
      v-model="inputValue"
      @keyup.enter="toSearch()"
      @focus="getSearchHot"
      @blur="showHot = false"
    />
    <div
      class="search-hot"
      v-show="showHot"
      ref="hot"
      @mousedown.stop="prevent"
    >
      <el-scrollbar style="height: 100%">
        <div class="history" v-if="history.length">
          <span
            class="hot-title"
            style="display: inline-block; margin-right: 5px"
            >搜索历史</span
          >
          <span
            class="iconfont icon-lajitong"
            style="cursor: pointer"
            title="清空搜索历史"
            @mousedown="deleteHistory(0, true)"
          ></span>
          <div class="history-wrap">
            <div
              class="history-item"
              v-for="(item, index) in history"
              :key="index"
              @mousedown="toHot(item)"
            >
              {{ item }}
              <span
                class="delete-btn"
                title="删除"
                @mousedown.stop="deleteHistory(index, false)"
                >×</span
              >
            </div>
          </div>
        </div>

        <!-- <div class="hot-title">热搜榜</div>
        <ul>
          <li
            class="hot-item"
            v-for="(item, index) in hotData"
            :key="index"
            @mousedown.prevent="toHot(item.searchWord)"
          >
            <div class="hot-index">{{ index + 1 }}</div>
            <div class="hot-info">
              <div class="hot-top">
                <div class="hot-name">{{ item.searchWord }}</div>
                <div class="hot-score">{{ item.score }}</div>
                <img
                  class="hot-icon"
                  v-show="item.iconUrl && item.iconType != 5"
                  :src="item.iconUrl"
                />
              </div>
              <div class="hot-content">{{ item.content }}</div>
            </div>
          </li>
        </ul> -->
      </el-scrollbar>
    </div>
    <div
      style="display: flex; margin-left: auto"
      v-if="this.$store.state.userid == -1"
    >
      <RouterLink to="/login" class="login">登录</RouterLink>
      <RouterLink to="/register" class="register">注册</RouterLink>
    </div>
    <div style="display: flex; margin-left: auto" v-else>
      <div class="login">{{ this.$store.state.username }}，你好</div>
      <div style="" v-if="this.$store.state.userid != -1">
      <el-button type="primary" round class="space" @click="userDetail()">个人空间</el-button>
    </div>
    </div>
    
  </div>
</template>
  
  <script>
import axios from "axios";
export default {
  name: "IndexTop",
  data() {
    return {
      // 搜索框内容
      inputValue: "",
      // 热搜榜数据
      hotData: [],
      // 历史记录
      history: [],
      // 是否展示热搜榜
      showHot: false,
      username: "",
    };
  },
  methods: {
    toSearch() {
      // 跳转搜索内容的界面
      if (this.inputValue == "") {
        this.inputValue = "请输入内容";
      } else {
        this.$router.push({ path: `/searchresult?q=${this.inputValue}` });
        if (!this.history.includes(this.inputValue)) {
          this.history.push(this.inputValue);
        }
        this.$forceUpdate();
      }
      this.inputValue = "";
    },
    getSearchHot() {
      // 获取热搜榜数据
      this.showHot = true;
      // if (this.hotData.length == 0) {
      //   axios({
      //     url: "/search/hot/detail",
      //     method: "get",
      //   }).then((res) => {
      //     this.hotData = res.data.data;
      //   });
      // }
    },
    toHot(value) {
      this.inputValue = value;
      this.toSearch();
      //阻止blur事件 也可以用@mousedown.prevent; mousedown的优先级高于blur
      // event.preventDefault();
    },
    deleteHistory(index, all) {
      if (all) this.history = [];
      else
        for (let i = 0; i < this.history.length; i++) {
          if (i == index) this.history.splice(i, 1);
        }
      // 防止点击x删除的时候，导致热搜榜消失，也可以通过.prevent修饰符
      event.preventDefault();
    },
    prevent() {
      event.preventDefault();
    },
    go(n) {
      this.$router.go(n);
    },
    userDetail() {
      this.$router.push(`/userdetail?q=${this.$store.state.userid}`);
      this.go(0)
    },
  },
  created() {
    if (window.localStorage.getItem("isLogin") === "true") {
      let user = JSON.parse(window.localStorage.getItem("user"));
      this.$store.commit("changeUserid", user.id);
      this.$store.commit("changeUsername", user.nickname);
      // console.log(this.$store.state.userid)
    }
  },
};
</script>
  <style scoped>
#index-top {
  position: relative;
  display: flex;
  width: 100%;
  height: 70px;
  background-color: SkyBlue;
  box-shadow: 0px 0px 6px #b99ca6;
}
#index-top .title {
  cursor: pointer;
  font-size: 30px;
  line-height: 70px;
  font-weight: bold;
  margin: 0px 50px;
  letter-spacing: 0.3rem;
  color: #fff;
  text-shadow: 0px 0px 6px #b99ca6;
}
#index-top .index-top-search {
  position: absolute;
  right: 0;
  width: 380px;
  height: 15px;
  margin: 17px 300px 15px;
  padding: 10px;
  border: 1px solid SkyBlue;
  border-radius: 2px;
  font-size: 16px;
  color: palevioletred;
  box-shadow: 0px 0px 6px #b99ca6;
}
#index-top .index-top-search::-webkit-input-placeholder {
  font-size: 16px;
  color: rgb(240, 216, 220);
}
.login {
  color: palevioletred;
  margin: 23px 10px 15px;
  font-size: 16px;
}
.space{
  color: palevioletred;
  margin: 13px 10px 15px;
  font-size: 16px;
  cursor: pointer;
  background-color: SkyBlue;
}
.register {
  color: palevioletred;
  margin: 23px 35px 25px;
  font-size: 16px;
}
.btns {
  margin-right: auto;
}
.btns i {
  color: #fff;
  border-radius: 50%;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
  line-height: 70px;
}
.btns i:hover path {
  fill: palevioletred;
}
.search-hot {
  width: 400px;
  height: 300px;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #fff;
  position: absolute;
  top: 65px;
  right: 300px;
  z-index: 1;
  padding: 10px 10px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.hot-title {
  margin: 10px 0;
  font-weight: bold;
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: default;
}

.hot-item:hover {
  background-color: seashell;
}

.hot-index {
  font-size: 20px;
  color: palevioletred;
  margin-right: 15px;
}

.hot-info {
  flex: 1;
  font-size: 12px;
  color: slategray;
}

.hot-top {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.hot-name {
  font-size: 16px;
  margin-right: 15px;
  color: #000;
}

.hot-icon {
  width: 30px;
  margin-left: 5px;
}
.icon-lajitong::before {
  content: "";
}
.history-wrap {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.history-item {
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 13px;
  display: inline-block;
  cursor: pointer;
  margin: 5px;
}

.history-item:hover {
  background-color: #f5f7fa;
}

.history-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn {
  cursor: pointer;
  opacity: 0;
}
</style>