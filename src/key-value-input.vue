<template>
  <v-container fluid>
    <v-layout>
      <v-flex mr-1 v-if="keysLabel" data-test="keys-label"><span class="subheading">{{ keysLabel }}</span></v-flex><v-spacer v-else />
      <v-flex ml-1 v-if="valuesLabel" data-test="values-label"><span class="subheading">{{ valuesLabel }}</span></v-flex>
    </v-layout>
    <v-layout 
      v-for="([k, v],i) in pairs"
      :key="i"
    >
      <v-flex mr-1>
        <v-text-field 
          :placeholder="keysLabel"
          :value="k"
          @input="key => changeKey(i, key)"
          data-test="key-input"
        />
      </v-flex>
      <v-flex ml-1>
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

/**
 * This component allows the user to input a shallow key/value map. The values can only be strings, and the
 * @author [BenoitAverty](https://github.com/BenoitAverty)
 */
export default {
  name: "key-value-input",
  props: {
    /**
     * Label of the "keys" column
     */
    keysLabel: {
      type: String,
      required: false,
      default: null,
    },
    /**
     * Label of the "values" column
     */
    valuesLabel: {
      type: String,
      required: false,
      default: null,
    },
    /**
     * Value of the component. If not provided, the component will manage its own internal state.
     */
    value: {
      type: Object,
      required: false,
      default: null,
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

        /**
         * Event triggered at each value change.
         *
         * @event input
         * @type {object}
         */
        this.$emit("input", v);
      },
    },
    // The value as a list of pairs. Each pair is an array of the shape [key, value].
    // This is easier to manipulate from the template.
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
    // Updates the key of the pair at the given index
    changeKey(index, key) {
      const head = this.pairs.slice(0, index);
      const updatedPair = [key, this.pairs[index][1]];
      const tail = this.pairs.slice(index + 1);

      this.pairs = head.concat([updatedPair]).concat(tail);
    },
    // Updates the value of the pair at the given index
    changeValue(index, value) {
      const head = this.pairs.slice(0, index);
      const updatedPair = [this.pairs[index][0], value];
      const tail = this.pairs.slice(index + 1);

      this.pairs = head.concat([updatedPair]).concat(tail);
    },
  },
};
</script>
