<!-- OK -->
<template>
  <div class="comment-wrap">
    <div class="comment-container">
      <h2>评论</h2>
      <textarea
        v-model="newComment"
        name="comment"
        id="comment"
        cols="200"
        rows="1"
        placeholder="写下你的评论"
      ></textarea>
      <button class="submit-text" @click="submitComment">发送</button>
    </div>
    <h3 class="comment-title">评论({{ total }})</h3>
    <ul>
      <li class="item" v-for="(item, index) in Comments" :key="index">
        <img :src="item.avatar" alt="" class="comment-avatar" />
        <div class="comment-info">
          <div class="comment">
            <span class="comment-user" @click="userDetail(item.userId)"
              >{{ item.nickname }}:</span
            >
            <span class="comment-content">{{ item.content }}</span>
          </div>
          <!-- 评论楼中楼 无接口 -->
          <!-- <div
            class="re-comment"
            v-for="(reply, Rindex) in item.beReplied"
            :key="Rindex"
          >
            <span class="comment-user" @click="userDetail(reply.user.nickname)"
              >{{ reply.user.nickname }}:</span
            >
            <span class="comment-content">{{ reply.content }}</span>
          </div> -->
          <div class="comment-bottom">
            <p class="comment-time">{{ item.createTime }}</p>
            <span class="comment-time iconfont icon-dianzan">{{
              item.up
            }}</span>
          </div>
        </div>
      </li>
    </ul>
    <el-pagination
      class="page-list"
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      :current-page="page"
      layout="prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
  
  <script>
import axios from "axios";
export default {
  name: "CommentSection",
  props: {
    type: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      total: 0,
      page: 1,
      pageSize: 15,
      Comments: [],
      newComment: "",
    };
  },
  methods: {
    userDetail(userid) {
      this.$router.push(`/userdetail?q=${userid}`);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.topCommpent();
    },
    submitComment() {
      //需要根据type的类型进行评论
      if (this.userid == -1) {
        this.$message({
          type: "error",
          message: "请先登陆再发表评论",
        });
      } else if (!this.newComment) {
        this.$message({
          type: "error",
          message: "请不要发表空评论",
        });
      } else {
        if (this.type == "music") {
          axios({
            url: `/comment/add`,
            method: "post",
            data: {
              content: this.newComment,
              songId: this.id,
              userId: this.userid,
              // createTime: createTime,
            },
          }).then((res) => {
            if (res.data.code == "200") {
              this.$message({
                type: "info",
                message: "评论发表成功",
              });
            } else {
              this.$message({
                type: "error",
                message: "发表失败，请稍后再试",
              });
            }
          });
        } else if (this.type == "MV") {
          axios({
            url: `/comment/add`,
            method: "post",
            data: {
              content: this.newComment,
              mvId: this.id,
              userId: this.userid,
              // createTime: createTime,
            },
          }).then((res) => {
            if (res.data.code == "200") {
              this.$message({
                type: "info",
                message: "评论发表成功",
              });
            } else {
              this.$message({
                type: "error",
                message: "发表失败，请稍后再试",
              });
            }
          });
        } else if (this.type == "songList") {
          axios({
            url: `/comment/add`,
            method: "post",
            data: {
              content: this.newComment,
              songListId: this.id,
              userId: this.userid,
              // createTime: createTime,
            },
          }).then((res) => {
            if (res.data.code == "200") {
              this.$message({
                type: "info",
                message: "评论发表成功",
              });
            } else {
              this.$message({
                type: "error",
                message: "发表失败，请稍后再试",
              });
            }
          });
        }
        this.newComment = "";
        setTimeout(() => {
          this.topCommpent();
        }, 500);
        //获取最新数据
      }
    },
    topCommpent() {
      //需要根据type的类型获取评论
      let axiosurl = "";
      if (this.type == "music") {
        axiosurl = `/comment/detail-songId/${this.id}/${this.page}/${this.pageSize}`;
      } else if (this.type == "MV") {
        axiosurl = `/comment/detail-mvId/${this.id}/${this.page}/${this.pageSize}`;
      } else if (this.type == "songList") {
        axiosurl = `/comment/detail-songListId/${this.id}/${this.page}/${this.pageSize}`;
      }
      axios({
        url: axiosurl,
        method: "get",
      }).then((res) => {
        this.Comments = res.data.data;
      });
      let totalurl = "";
      if (this.type == "music") {
        totalurl = `/comment/count-songId/${this.id}`;
      } else if (this.type == "MV") {
        totalurl = `/comment/count-mvId/${this.id}`;
      } else if (this.type == "songList") {
        totalurl = `/comment/count-songListId/${this.id}`;
      }
      axios({
        url: totalurl,
        method: "get",
      }).then((res) => {
        this.total = res.data.data;
      });
    },
  },
  created() {
    this.topCommpent();
  },
  computed: {
    userid() {
      return this.$store.state.userid;
    },
  },
};
</script>
  
<style scoped>
.comment-container {
  margin-top: 10px;
  width: 60%;
}
.comment-container h2 {
  margin-left: 15px;
}
.comment-container #comment {
  margin-top: 20px;
  font-size: 18px;
  padding: 10px;
  border: 1px solid grey;
  width: 700px;
  overflow: hidden;
  resize: none;
}
.comment-container #comment::-webkit-input-placeholder {
  font-size: 14px;
  color: grey;
  font-family: sans-serif;
}
.submit-text {
  width: 100px;
  height: 35px;
  background-color: palevioletred;
  border: 1px solid palevioletred;
  font-size: 18px;
  color: #fff;
  border-radius: 10px;
  margin-top: 10px;
}
.submit-text:hover {
  background-color: pink;
  border: 1px solid pink;
}

.comment-title {
  margin: 30px 15px 20px;
}

.comment-wrap ul li {
  display: flex;
  margin: 10px 0 30px 0;
}

.comment-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.comment-info {
  flex: 1;
  font-size: 14px;
  margin-left: 10px;
}

.comment {
  margin-bottom: 5px;
}

.comment-user {
  color: palevioletred;
  margin-right: 10px;
  cursor: pointer;
  font-size: 16px;
}

.comment-content {
  display: inline;
}

.comment-time {
  color: grey;
  margin-right: 20px;
  margin-top: 5px;
}

.comment-bottom {
  display: flex;
  align-items: center;
  font-size: 14px !important;
}
.re-comment {
  background-color: #f3f1f3;
  padding: 5px 10px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 5px;
}
.icon-dianzan::before {
  content: "";
  font-size: 10px;
}
.el-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>