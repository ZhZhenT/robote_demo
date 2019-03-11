<template>
    <div>
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
  name: 'panel',
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
        { type: 'robote', avatar: process.env.BASE_URL + 'images/touxiangm.png', name: 'IDxxxx', msg: '您好，jiqiren' },
        { type: 'user', avatar: process.env.BASE_URL + 'images/touxiangm.png', name: 'IDxxxx', msg: 'user，sss' },
        { type: 'system', avatar: process.env.BASE_URL + 'images/touxiangm.png', name: 'IDxxxx', msg: '您好，sss' },
        { type: 'robote', avatar: process.env.BASE_URL + 'images/touxiangm.png', name: 'IDxxxx', msg: '您好，jiqiren' },
        { type: 'robote', avatar: process.env.BASE_URL + 'images/touxiangm.png', name: 'IDxxxx', msg: '您好，jiqiren' },
        { type: 'robote', avatar: process.env.BASE_URL + 'images/touxiangm.png', name: 'IDxxxx', msg: '您好，jiqiren' }
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
      i++
      this.chatList.push({ type: i % 3 ? i % 3 === 1 ? 'robote' : 'system' : 'user', avatar: process.env.BASE_URL + 'images/touxiangm.png', name: 'IDxxxx', msg: this.msg + (i) })
      this.msg = ''
      setTimeout(() => {
        this.scrollTo(true)
      }, 50)
    }
  },
}
</script>

<style scoped>

</style>
