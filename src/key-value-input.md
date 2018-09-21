key-value-input example:

```vue
<template>
  <div>
    <key-value-input
    keysLabel="K"
    valuesLabel="V"
    v-model="example"
    />
    <p>
      {{ JSON.stringify(example) }}
    </p>
  </div>
</template>

<script>
// Vuetify is needed to use this component. the the plugins/vuetify file of the repo if you need an example.
require('./plugins/vuetify.js')

export default {
  data: () => ({
    example: {}
  })
}
</script>
```