<template>
  <div style="display:flex;align-items: center;justify-content: center;height: 300px;margin: 40px auto">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="昵称" prop="nickname">
      <el-input v-model="ruleForm.nickname"></el-input>
    </el-form-item>
      <el-form-item label="账号" prop="username">
      <el-input v-model.number="ruleForm.username"></el-input>
    </el-form-item>
      <el-form-item label="密码" prop="pass">
      <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button style="background-color:skyblue;border: skyblue" type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
    <div style="display: flex;justify-content: center;">
    已有账号？请<router-link to="/login" style="color:skyblue;cursor: pointer;">登录</router-link>
  </div>
  </el-form>
</div>
</template>


<script>
//注册页面
  export default {
    data() {
      var checkusername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('账号不能为空'));
        }else {
          this.$http({
            method: 'get',
            url: `/user/check/${value}`
          }).then(res => {
            let flag = res.data.data;
            if (flag) {
              return callback(new Error('账号已存在'));
            } else {
              return callback();
            }
          }).catch(err => {
            console.log(err);
            return callback(new Error('验证账号时出错'));
          });
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var checknickname = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('昵称不能为空'));
        }
        callback();
      };
      return {
        ruleForm: {
          pass: '',
          checkPass: '',
          username: '',
          nickname:'',
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          username: [
            { validator: checkusername, trigger: 'blur' }
          ],
          nickname: [
            { validator: checknickname, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http({
                method:'post',
                url:'user/register',
                data:{
                  username:this.ruleForm.username,
                  password:this.ruleForm.pass,
                  nickname:this.ruleForm.nickname,
                  avatar:"https://s21.ax1x.com/2024/06/01/pkG9kPH.jpg",
                  introduction:"暂时没有个性签名，设置一个吧",
                  location:"还没有设置地区，设置一个吧"
                }
              }).then(res =>{
                // console.log(res)
                if(res.status === 200){
                  // console.log(res)
                  this.$router.push('/')
                  this.$message.success("注册成功")
                  this.$http({
                    method:'post',
                    url:'user/login',
                    params:{
                      username:this.ruleForm.username,
                      password:this.ruleForm.pass,
                    }
                  }).then(res=>{
                    if(res.status === 200){
                    console.log(res)
                    this.$router.push('/')
                    this.$message.success("登录成功")
                    let user = res.data.data.user
                    this.$store.commit("changeUser",user)
                    this.$store.commit("changeUserid",user.id)
                    this.$store.commit("changeUsername",user.nickname)
                    window.localStorage.setItem("token",res.data.data.token)
                    window.localStorage.setItem("isLogin",true)
                    window.localStorage.setItem("user",JSON.stringify(res.data.data.user))
                    
                  }else{
                    this.$message.error(res.meg)
                  }
                  }).catch(err=>{

                  })
                  // let user = res.data.data.user
                  // this.$store.commit("changeUser",user)
                  // this.$store.commit("changeUserid",user.id)
                  // this.$store.commit("changeUsername",user.nickname)
                  // window.localStorage.setItem("token",res.data.data.token)
                  // window.localStorage.setItem("isLogin",true)
                  // window.localStorage.setItem("user",JSON.stringify(res.data.data))
                  
                }else{
                  this.$message.error(res.meg)
                }
                
              }).catch(err =>{
                console.log(err)
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>