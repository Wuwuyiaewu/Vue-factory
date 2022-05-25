import Vue from 'vue'
// import sensors from 'sa-sdk-javascript';

Vue.directive('sa', {
  bind: function(el, binding) {
    const properties = binding.value
    el.addEventListener('click', () => {
      /* for (let i in properties) {
                sensors.track(i, properties[i]);
            }*/
    })
  }
})
// Vue.directive('ga', {
//   bind: function(el, binding) {
//     const event = binding.value
//     el.addEventListener('click', () => {
//       ga('send', 'event', event.eventCategory, event.eventAction, event.eventLabel, '1')
//     })
//   }
// })
