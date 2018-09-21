<template>
  <div id="app">
    <v-app>
      <key-value-input 
        keysLabel="Key"
        valuesLabel="Value"
        @input="v => example1 = v"
      />
      <p>{{ JSON.stringify(example1)}}</p>
      <key-value-input 
        keysLabel="Key"
        valuesLabel="Value"
        v-model="example2"
      />
      <p>{{ JSON.stringify(example2)}}</p>
      <key-value-input 
        keysLabel="Key"
        valuesLabel="Value"
        :value="{ key1: 'value1' }"
        @input="v => example3 = v"
      />
      <p>{{ JSON.stringify(example3)}}</p>
    </v-app>
  </div>
</template>

<script>
import KeyValueInput from "./key-value-input";

export default {
  name: "examples-app",
  components: {
    KeyValueInput,
  },
  data: () => ({
    example1: null,
    example2: { key1: "value1" },
    example3: null,
  }),
};
</script>
