<template>
  <div style="display:flex;align-items: center;justify-content: center;height: 300px;">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号" prop="username">
      <el-input v-model.number="ruleForm.username"></el-input>
    </el-form-item>
        <el-form-item label="密码" prop="pass">
      <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
    </el-form-item>
    <!-- <el-form-item label="确认密码" prop="checkPass">
      <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
    </el-form-item> -->

    <el-form-item>
      <el-button style="background-color:skyblue;border: skyblue" type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
    <div style="display: flex;justify-content: center;">
    还没有账号？请<router-link to="/register" style="color:skyblue;cursor: pointer;">注册</router-link>
  </div>
  </el-form>

  </div>
    
</template>

  <script>
  import axios from 'axios';
  //登录页面
    export default {
      data() {
        var checkusername = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('账号不能为空'));
          }
        //   setTimeout(() => {
        //     if (!Number.isInteger(value)) {
        //       callback(new Error('请输入数字值'));
        //     } else {
        //       if (value < 18) {
        //         callback(new Error('必须年满18岁'));
        //       } else {
        //         callback();
        //       }
        //     }
        //   }, 1000);
        callback();
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
        // var validatePass2 = (rule, value, callback) => {
        //   if (value === '') {
        //     callback(new Error('请再次输入密码'));
        //   } else if (value !== this.ruleForm.pass) {
        //     callback(new Error('两次输入密码不一致!'));
        //   } else {
        //     callback();
        //   }
        // };
        return {
          ruleForm: {
            pass: '',
            // checkPass: '',
            username: ''
          },
          rules: {
            pass: [
              { validator: validatePass, trigger: 'blur' }
            ],
            // checkPass: [
            //   { validator: validatePass2, trigger: 'blur' }
            // ],
            username: [
              { validator: checkusername, trigger: 'blur' }
            ]
          }
        };
      },
      methods: {
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              // console.log(this.ruleForm.username)
              // console.log(this.ruleForm.pass)
              this.$http({
                method:'post',
                url:'user/login',
                params:{
                  username:this.ruleForm.username,
                  password:this.ruleForm.pass
                }
              }).then(res =>{
                // console.log(res)
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
                  this.$router.push({name:'home'})
                  
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
