import Vue from "vue";
import "./plugins/vuetify";
import ExamplesApp from "./ExamplesApp.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(ExamplesApp)
}).$mount("#app");
