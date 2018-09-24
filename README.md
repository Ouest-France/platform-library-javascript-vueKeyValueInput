# vue-key-value-input

[![CircleCI](https://img.shields.io/circleci/project/github/Ouest-France/platform-library-javascript-vueKeyValueInput.svg?logo=circleci&style=for-the-badge)](https://circleci.com/gh/OuestFrance/platform-library-javascript-vueKeyValueInput) [![codecov.io](https://img.shields.io/codecov/c/github/Ouest-France/platform-library-javascript-vueKeyValueInput.svg?style=for-the-badge)](https://codecov.io/gh/Ouest-France/platform-library-javascript-vueKeyValueInput) [![npmjs.org](https://img.shields.io/npm/v/vue-key-value-input.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/vue-key-value-input) 

Vuetify-based component that allows users to input a simple key/value map. Values can only be strings.

## **[Documentation](https://vue-key-value-input.now.sh)**

## Usage

```
<template>
  <key-value-input v-model="example" />
</template>

<script>
import KeyValueInput from 'vue-key-value-input';

export default {
  name: 'Component',
  components: { VueKeyValueInput },
  data: () => ({
    example: {}
  })
}
</script>
```