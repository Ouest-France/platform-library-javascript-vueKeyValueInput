<template>
  <v-container fluid>
    <v-layout>
      <v-flex mr-1 v-if="keysLabel" data-test="keys-label"><span class="subheading">{{ keysLabel }}</span></v-flex><v-spacer v-else />
      <v-flex ml-1 v-if="valuesLabel" data-test="values-label"><span class="subheading">{{ valuesLabel }}</span></v-flex>
    </v-layout>
    <v-layout 
      v-for="([k, v],i) in templatePairs"
      :key="i"
    >
      <v-flex mr-1>
        <v-text-field 
          :placeholder="keysLabel"
          :value="k"
          :error="duplicates.includes(i)"
          :error-messages="duplicates.includes(i) ? duplicateKeyErrorMessage : null"
          @input="key => changeKey(i, key)"
          data-test="key-input"
        />
      </v-flex>
      <v-flex ml-1>
        <v-text-field
        :placeholder="valuesLabel"
        :value="v"
        :error="duplicates.includes(i)"
        :error-messages="duplicates.includes(i) ? duplicateValueErrorMessage : null"
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

// add a property with key/value to the given object only if the key isn't already present
const addPropIfNotPresent = (obj, [key, value]) =>
  obj.hasOwnProperty(key) ? obj : { ...obj, [key]: value };

// Transform an array of key-value arrays into an object. The array is used as
// the internal representation of data in the component.
// The generated object keeps the first pair in case of duplicate keys.
const objectFromPairs = pairs =>
  pairs.reduce((acc, curr) => addPropIfNotPresent(acc, curr), {});

// Transform an object into an array of key-value arrays, which is used as the
// internal representation of data in the component.
const pairsFromObject = object => Object.entries(object);

// function areEqualPairs(a, b) {
//   if (a.length !== b.length) {
//     return false;
//   }

//   for (let i = 0; i < a.length; ++i) {
//     // Comparing keys and values for each pair
//     if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) {
//       return false;
//     }
//   }

//   return true;
// }

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
     * Error message used to signal duplicate keys.
     */
    duplicateKeyErrorMessage: {
      type: String,
      required: false,
      default: "This key is a duplicate.",
    },
    /**
     * Error message used on the value field of a duplicate key.
     */
    duplicateValueErrorMessage: {
      type: String,
      required: false,
      default: "This value won't be used.",
    },
    /**
     * Value of the component. If not provided, the component will manage its own internal state.
     * Value must be a shallow object of string keys / string values.
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
      internalValue: this.value ? pairsFromObject(this.value) : [],
    };
  },
  watch: {
    // Update the effective value when the value prop changes.
    value(newValue) {
      const currentValueAsObject = objectFromPairs(this.effectiveValue);

      if (!areEqualShallow(newValue, currentValueAsObject)) {
        this.effectiveValue = pairsFromObject(newValue);
      }
    },
  },
  computed: {
    // This computed prop allows to safely read/write the value of the component. It checks data equality
    // and emits the "input" event when needed.
    effectiveValue: {
      get() {
        return this.internalValue;
      },
      set(v) {
        const newValueAsObject = objectFromPairs(v);
        const currentValueAsObject = objectFromPairs(this.internalValue);

        this.internalValue = v;
        if (!areEqualShallow(newValueAsObject, currentValueAsObject)) {
          /**
           * Event triggered at each value change.
           *
           * @event input
           * @type {object}
           */
          this.$emit("input", objectFromPairs(v));
        }
      },
    },
    // List of pairs to be handled in the template. It adds an empty key/value to generate the row
    // that allows to create a key, and removes any empty key before saving.
    templatePairs: {
      get() {
        return this.effectiveValue.concat([["", ""]]);
      },
      set(newPairs) {
        const newValue = newPairs.filter(([k]) => k);

        this.effectiveValue = newValue;
      },
    },
    // List of pairs indices that are duplicates.
    duplicates() {
      return this.effectiveValue
        .map(v => v[0]) // keep only keys to find duplicates.
        .map(
          // If the first element of the array is not the current element itself,
          // that means it's a duplicate.
          (value, idx, array) =>
            array.findIndex(el => el === value) < idx ? idx : null,
        )
        .filter(el => el !== null);
    },
  },
  methods: {
    // Updates the key of the pair at the given index
    changeKey(index, key) {
      const head = this.templatePairs.slice(0, index);
      const updatedPair = [key, this.templatePairs[index][1]];
      const tail = this.templatePairs.slice(index + 1);

      this.templatePairs = head.concat([updatedPair]).concat(tail);
    },
    // Updates the value of the pair at the given index
    changeValue(index, value) {
      const head = this.templatePairs.slice(0, index);
      const updatedPair = [this.templatePairs[index][0], value];
      const tail = this.templatePairs.slice(index + 1);

      this.templatePairs = head.concat([updatedPair]).concat(tail);
    },
  },
};
</script>
