/* eslint-disable-next-line no-restricted-imports */
import { createLocalVue } from "@vue/test-utils";
import Vue from "vue";

/*
 * Crée une instance de Vue locale à utiliser dans les tests. Cette instance est
 * préconfigurée avec les modules à utiliser et certains warnings inutiles dans
 * les TU sont désactivés.
 */
export default function createCustomLocalVue() {
  const localVue = createLocalVue();
  Vue.config.ignoredElements = [/^v-/, /-stub$/];
  return localVue;
}
