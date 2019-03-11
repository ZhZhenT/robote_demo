<template>
  <div class="home">

    <div class="dialog-wrap">

        <vue-scroll  :ops="ops1" ref="vs" >
            <div class="content">
              <transition-group name="list" tag="p">
                <div v-for="(item, index) in chatList" :key="index + 1">
                  <div v-if="item.type == 'robote' ||item.type== 'user' "  :class="['message-item', {'message-send':item.type== 'user','message-receive':item.type== 'robote' }]">
                    <div class="avatar">
                      <img :src="item.avatar" alt="">
                    </div>
                    <div class="msg-text">
                      <div class="name">{{item.name}}</div>
                      <p>{{item.msg}}</p>
                    </div>
                  </div>
                  <div v-else-if ="item.type == 'system'" class="message-item message-system">
                    <span>system</span>
                  </div>
                </div>
              </transition-group>
            </div>
        </vue-scroll>

     </div>

    <div class="footer">
      <div class="input">
        <textarea v-model="msg" name="" id="" rows="1"></textarea>
      </div>
      <div :class="['send_btn', {canSend: msg}]" @click="addChat">
          发送
      </div>
    </div>

  </div>
</template>

<script>
let i = 0
function uuid (len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = []
  var i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    var r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}
export default {
  name: 'home',
  data () {
    return {
      ops1: {
        vuescroll: {
          mode: 'slide',
          scroller: {

            bouncing: {
              top: 100000,
              bottom: 100000
            }

          }
        },
        scrollPanel: {
          padding: false,
          scrollingX: false
        },
        rail: {

        },

        bar: {
          background: '#ddd',
          onlyShowBarOnScroll: false
        }
      },
      chatList: [
        // { type: 'robote', avatar: process.env.BASE_URL + 'images/touxiangm.png', name: '中公小鹿客服', msg: '您好，jiqiren' }
      ],
      msg: '',
      chatItem: { type: 'robote', avatar: process.env.BASE_URL + 'images/touxiangm.png', name: 'IDxxxx', msg: '您好，jiqire您好，jiqire您好，jiqireqiren' }
    }
  },
  methods: {
    scrollTo (flag) {
      this.$nextTick(() => {
        this.$refs['vs'].scrollTo({
          y: '100%'
        }, flag)
      })
    },
    addChat () {
      if (!this.msg) {
        return
      }
      // i++
      this.chatList.push({ type: i % 3 ? i % 3 === 1 ? 'robote' : 'system' : 'user', avatar: process.env.BASE_URL + 'images/touxiangm.png', name: 'IDxxxx', msg: this.msg + (i) })
      this.msg = ''
      setTimeout(() => {
        this.scrollTo(true)
      }, 50)
    },
    addChatObj (msg) {
      this.chatList.push(msg)
      setTimeout(() => {
        this.scrollTo(true)
      }, 50)
    }
  },
  mounted () {
    console.log('home')
    this.scrollTo(false)
    this.addChatObj(
      { type: 'robote', avatar: process.env.BASE_URL + 'images/touxiangm.png', name: '中公小鹿客服', msg: '您好，中公' + uuid(10, 64) }
    )
  }
}
</script>

<style lang="less">
  body {
    margin: 0 auto;
    background: #f1f1f1;
  }
  .home{
    height: 100%;
  }
  .dialog-wrap{
    background: #f1f1f1;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 80px;
    top: -20px;
    padding: 20px 0;
  }
  .message-item{
    display: flex;
    padding: 5px 20px;
  }
  .message-item .avatar{
    width: 80px;
    height: 80px;
    margin-top: 15px;
    border-radius: 5px;
  }
  .message-item .avatar img{
    width: 80px;
    height: 80px;
    border-radius: 5px;
  }
  .message-item .msg-text p{
    border-radius: 10px;
    line-height: 60px;
    background: #fff;
    padding: 10px 20px;
    margin:5px 10px 20px 40px;
    text-align: justify;
    position: relative;
  }
  .message-receive .msg-text p:after{
    content: '';
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    position: absolute;
    top: 12px;
    border-right: 40px solid #fff;
    left: -30px;
  }
  .message-item .msg-text .name{
    font-size: 22px;
    padding-left: 45px;
    color: #ccc;
  }
  .message-send{
    justify-content: flex-end;
  }
  .message-send .avatar{
    order:1
  }
  .message-send .msg-text{
    order:0
  }
  .message-send .msg-text .name{
    text-align: right;
    padding-right: 45px;
  }
  .message-send .msg-text p{
    margin:5px 40px 20px 10px;
  }
  .message-send .msg-text p:after{
    content: '';
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    position: absolute;
    top: 12px;
    border-left: 40px solid #fff;
    right: -30px;
  }
.message-system {
  text-align: center;
  justify-content: center;
  span{
    background: #ddd;
    font-size: 24px;
    display: inline-block;
    padding: 1px 10px;
    border-radius: 5px;
  }
}
.message-item {
  transition: .5s;

}
  .list-enter-active .message-send, .list-leave-active .message-send {
    transition: all 1s;
  }
  .list-enter .message-send, .list-leave-to .message-send{
    opacity: 0;
    transform: translateX(-50px);
  }
  .list-enter-active .message-receive, .list-leave-active .message-receive {
    transition: all 1s;
  }
  .list-enter .message-receive, .list-leave-to .message-receive{
    opacity: 0;
    transform: translateX(50px);
  }
  .list-enter-active .message-system, .list-leave-active .message-system {
    transition: all 1s;
  }
  .list-enter .message-system, .list-leave-to .message-system{
    opacity: 0;
    transform: translateY(30px);
  }
  .footer{
    position: absolute;
    bottom: 0;
    background-color: #fff;
    height: 100px;
    width: 100%;
    border-top: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 10px;
    .input{
      height: 70px;
      textarea{
        width: 580px;
        font-size: 32px;
        height: 70px;
        box-sizing: border-box;
        padding: 12px 0 0 10px;
        border-radius:5px;
      }
    }
    .send_btn{
      width: 120px;
      height: 70px;
      line-height: 70px;
      color: #fff;
      text-align: center;
      background-color: #ddd;
      border-radius:5px;
      transition: .2s;
    }
    .canSend{
      background: #4898fc;
    }
    /*.send_btn:active{*/
      /*background: #4898fc;*/
    /*}*/
  }

</style>
