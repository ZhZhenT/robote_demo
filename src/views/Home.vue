<template>
  <div @click="clickCb" class="home">

    <div class="dialog-wrap">

        <vue-scroll  :ops="ops1" ref="vs" >
            <div class="content">
              <transition-group name="list" tag="div">
                <div v-for="(item, index) in chatList" :key="index + 1">

                  <div >
                    <span  v-if="index">
                    <span style="text-align: center;font-size: 26px;color: #b2b2b2;padding: 20px 0 10px;display: block" v-if="item.time - chatList[index-1].time > 1*60*1000">
                     {{item.time | formatDate1}}
                    </span>
                    </span>
                    <span style="text-align: center;font-size: 26px;color: #b2b2b2;padding: 20px 0 10px;display: block" v-else>{{item.time | formatDate1}}</span>
                  </div>

                  <div v-if="item.type == 'robote' ||item.type== 'user' "  :class="['message-item', {'message-send':item.type== 'user','message-receive':item.type== 'robote' }]">
                    <div class="avatar">
                      <img :src="item.avatar" alt="">
                    </div>

                    <div class="msg-text">
                      <div class="name">{{item.name}}</div>

                      <div>
                        <p  v-if = "item.msgtype === 1">
                          <span style="display: inline-block;padding: 10px 0">您是想问这些问题吗？<br></span>
                          <span style="display: inline-block;padding: 10px 0" @click="sysChat(m)" class="blue" v-for="(m,i) in item.msg" :key="i">{{i + 1 + '.'}}{{m}}? <br></span>
                        </p>
                        <p v-else v-html="item.msg">

                        </p>
                      </div>
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
        <textarea @focus="focus($event)" @blur="fixScroll" v-model="msg" name="" id="" rows="1"></textarea>
      </div>
      <div :class="['send_btn', {canSend: msg}]" @click="addChat">
          发送
      </div>
    </div>

  </div>
</template>

<script>

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
            },
            minZoom: 1,
            maxZoom: 1
          },
          zooming: false
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
      id: uuid(6, 64),
      timer: null,
      chatItem: { type: 'robote', avatar: process.env.BASE_URL + 'images/touxiangm.png', name: 'IDxxxx', msg: '您好，jiqire您好，jiqire您好，jiqireqiren' }
    }
  },
  methods: {
    clickCb () {

    },
    focus (ev) {
      ev.target.scrollIntoView()
    },
    scrollTo (flag) {
      this.$nextTick(() => {
        this.$refs['vs'].scrollTo({
          y: '100%'
        }, flag)
      })
    },
    fixScroll () {
      window.scroll(0, 0)
    },
    search (msg) {
      this.$http({
        method: 'get',
        url: 'http://39.98.196.178:8080/robot/chat?chat=' + msg,
        headers: { 'Content-type': 'application/json' }
      })
        .then((res) => {
          if (res.data.code === 0) {
            this.addChatObj({ type: 'robote', msgtype: res.data.value.type, avatar: process.env.BASE_URL + 'images/robote_avatar.png', name: '中公小知客服', msg: res.data.value.value, time: new Date().getTime() })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    addChat () {
      if (!this.msg) {
        return
      }
      this.addChatObj({ type: 'user', avatar: process.env.BASE_URL + 'images/user_avatar.png', name: '中公' + this.id, msg: this.msg, time: new Date().getTime() })
      this.search(this.msg)
      this.msg = ''
    },
    sysChat (msg) {
      this.addChatObj({ type: 'user', avatar: process.env.BASE_URL + 'images/user_avatar.png', name: '中公' + this.id, msg: msg, time: new Date().getTime() })
      this.search(msg)
    },
    addChatObj (msg) {
      this.chatList.push(msg)
      clearInterval(this.timer)
      this.timer = setTimeout(() => {
        this.scrollTo(true)
      }, 500)
    }
  },
  filters: {
    formatDate1 (val) {
      let date = new Date(val)

      function formatNumber (n) {
        n = n.toString()
        return n[1] ? n : '0' + n
      }

      var a = formatNumber(date.getMinutes())

      // return (date.getFullYear()) + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 ' + date.getHours() + ':' + a
      return date.getHours() + ':' + a
    }
  },
  mounted () {
    console.log('home')
    this.scrollTo(false)
    this.addChatObj(
      { type: 'robote', avatar: process.env.BASE_URL + 'images/robote_avatar.png', name: '中公小知客服', msg: '您好，我是中公小知，很高兴为您服务。', time: new Date().getTime() }
    )
    // this.search('相似')
  }
}
</script>

<style lang="less">
  body {
    margin: 0 auto;
    background: #EFEFF4;
  }

  .home{
    height: 100%;
    position: relative;
  }
  .dialog-wrap{
    background: #EEEDEE;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100px;
    top: 0;
    padding: 0 0;
  }
  .message-item{
    display: flex;
    padding: 5px 20px;
  }
  .message-item .avatar{
    width: 80px;
    height: 80px;
    margin-top: 5px;
    border-radius: 5px;
  }
  .message-item .avatar img{
    width: 80px;
    height: 80px;
    border-radius: 5px;
  }
  .message-item .msg-text p{
    border-radius: 10px;
    line-height: 1.3;
    background: #fff;
    padding: 16px 24px;
    margin:5px 97px 20px 18px;
    text-align: justify;
    position: relative;
    min-height: 61px;
    display: inline-block;
    word-break:break-all
  }
  .message-send .msg-text{
    text-align: right;
  }
  .message-item .msg-text p span.blue{
    color: #4898fc;
  }
  .message-item .msg-text p a{
    color: #4898fc;
    text-decoration: underline;
  }
  .message-receive .msg-text p:after{
    content: '';
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    position: absolute;
    top: 12px;
    border-right: 10px solid #fff;
    left: -10px;
  }
  .message-item .msg-text .name{
    font-size: 24px;
    padding-left: 18px;
    color: #b2b2b2;
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
    padding-right: 18px;
  }
  .message-send .msg-text p{
    margin:5px 16px 20px 96px;
    background: #A0EA71;
  }
  .message-send .msg-text p:after{
    content: '';
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    position: absolute;
    top: 12px;
    border-left: 10px solid #A0EA71;
    right: -10px;
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
    //border-top: 1px solid #ddd;
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
        border: 1px solid #E6E6EA;
        outline: none;
        caret-color:#4898fc;
      }
    }
    .send_btn{
      width: 120px;
      height: 70px;
      line-height: 70px;
      color: #fff;
      text-align: center;
      background-color: #E6E6EA;
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
