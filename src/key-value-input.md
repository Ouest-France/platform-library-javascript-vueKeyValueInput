Basic example:

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

Overriding error messages (type a duplicate to test): 
```vue
<template>
  <div>
    <key-value-input
    keysLabel="K"
    valuesLabel="V"
    duplicateKeyErrorMessage="Dup key error"
    duplicateValueErrorMessage=""
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
    example: { duplicate: "Value" }
  })
}
</script>
```

Two way binding: 
```vue
<template>
  <div>
    <key-value-input
    keysLabel="K"
    valuesLabel="V"
    v-model="example"
    />
    Write some json : <br/>
    <textarea v-model="exampleString">
    </textarea>
  </div>
</template>

<script>
// Vuetify is needed to use this component. the the plugins/vuetify file of the repo if you need an example.
require('./plugins/vuetify.js')

export default {
  data: () => ({
    example: {}
  }),
  computed: {
    exampleString: {
      get() {
        return JSON.stringify(this.example)
      },
      set(v) {
        try {
          this.example = JSON.parse(v)
        }
        catch(e) {
          // Do not update if the object is invalid
        }
      }
    }
  }
}
</script>

<style scoped>
  textarea {
    border: 1px solid black
  }
</style>
```