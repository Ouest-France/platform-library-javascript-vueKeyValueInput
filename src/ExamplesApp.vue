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
        v-model="example3"
      />
      <p>Write some json : <br/>
      <textarea v-model="example3String">
      </textarea></p>
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
  computed: {
    example3String: {
      get() {
        return JSON.stringify(this.example3);
      },
      set(v) {
        try {
          this.example3 = JSON.parse(v);
        } catch (e) {
          // Do not update if the object is invalid
        }
      },
    },
  },
};
</script>
