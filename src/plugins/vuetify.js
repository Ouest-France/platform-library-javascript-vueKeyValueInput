import Vue from "vue";
import {
  Vuetify,
  VApp,
  VTextField,
  VBtn,
  VIcon,
  VGrid,
  transitions,
} from "vuetify";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
  components: {
    VApp,
    VTextField,
    VBtn,
    VIcon,
    VGrid,
    transitions,
  },
  iconfont: "md",
});
