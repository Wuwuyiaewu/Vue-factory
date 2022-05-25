import SocketIO from 'socket.io-client'
import Store from '@/store'

// 交易socket
if (Store.state.user.loginname) {
  if (String(Store.state.user.loginname).startsWith('68')) Store.dispatch('setTradeSocket', SocketIO('http://192.168.35.153:7041'))// 真实
  else Store.dispatch('setTradeSocket', SocketIO('http://192.168.35.153:9081'))// 模拟
}
Store.dispatch('setQuoteSocket', SocketIO('http://218.253.75.135:7035'))// 外网

// 行情socket
// Store.dispatch("setQuoteSocket",SocketIO('http://218.253.75.135:7035'));//http://192.168.35.17:9000/webui_gts2_pm行情
// Store.dispatch("setQuoteSocket",SocketIO('http://192.168.75.87:7035'));//内网

