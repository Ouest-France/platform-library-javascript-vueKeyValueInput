import Vue from "vue";
import { Vuetify, VTextField, VBtn, VIcon, VGrid, transitions } from "vuetify";
import "vuetify/src/stylus/app.styl";

Vue.use(Vuetify, {
  components: {
    VTextField,
    VBtn,
    VIcon,
    VGrid,
    transitions
  },
  iconfont: "md"
});
