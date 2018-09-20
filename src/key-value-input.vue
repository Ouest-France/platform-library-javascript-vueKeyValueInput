<template>
  <v-container fluid>
    <v-layout>
      <v-flex v-if="keysLabel" data-test="keys-label">{{ keysLabel }}</v-flex>
      <v-flex v-if="valuesLabel" data-test="values-label">{{ valuesLabel }}</v-flex>
    </v-layout>
    <v-layout 
      v-for="([k, v],i) in pairs"
      :key="i"
    >
      <v-flex>
        <v-text-field 
          :placeholder="keysLabel"
          :value="k"
          @input="key => changeKey(i, key)"
          data-test="key-input"
        />
      </v-flex>
      <v-flex>
        <v-text-field
        :placeholder="valuesLabel"
        :value="v"
        :disabled="k === ''"
        @input="value => changeValue(i, value)"
        data-test="value-input"
      />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const isString = v =>
  (v === null) | (v === undefined) | (typeof v === "string");

const objectFromPairs = pairs =>
  pairs.reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {});

function areEqualShallow(a, b) {
  for (let key in a) {
    if (!(key in b) || a[key] !== b[key]) {
      return false;
    }
  }
  for (let key in b) {
    if (!(key in a) || a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

export default {
  name: "key-value-input",
  props: {
    keysLabel: {
      type: String,
      required: false,
      default: () => null,
    },
    valuesLabel: {
      type: String,
      required: false,
      default: () => null,
    },
    value: {
      type: Object,
      required: false,
      default: () => null,
      validator: value => Object.values(value).every(isString),
    },
  },
  data: function() {
    // We store the value internally to be able to work both when a value prop is provided or not provided.
    // This value is overriden with the prop at component creation and each time value prop changes.
    // This value should only be updated and read through the "effectiveValue" computed prop.
    return {
      internalValue: this.value ? this.value : {},
    };
  },
  watch: {
    // Update the effective value when the value prop changes.
    value(newValue) {
      if (!areEqualShallow(newValue, this.internalValue)) {
        this.effectiveValue = newValue;
      }
    },
  },
  computed: {
    // This computed prop allows to safely read/write the value of the component. It handles the
    // interactions between the value prop and the internalValue data.
    effectiveValue: {
      get() {
        return this.internalValue;
      },
      set(v) {
        this.internalValue = v;
        this.$emit("input", v);
      },
    },
    pairs: {
      get() {
        return Object.entries(this.effectiveValue).concat([["", ""]]);
      },
      set(newPairs) {
        const newValue = objectFromPairs(newPairs.filter(([k]) => k));

        if (!areEqualShallow(newValue, this.effectiveValue)) {
          this.effectiveValue = newValue;
        }
      },
    },
  },
  methods: {
    changeKey(index, key) {
      const head = this.pairs.slice(0, index);
      const updatedPair = [key, this.pairs[index][1]];
      const tail = this.pairs.slice(index + 1);

      this.pairs = head.concat([updatedPair]).concat(tail);
    },
    changeValue(index, value) {
      const head = this.pairs.slice(0, index);
      const updatedPair = [this.pairs[index][0], value];
      const tail = this.pairs.slice(index + 1);

      this.pairs = head.concat([updatedPair]).concat(tail);
    },
  },
};
</script>
