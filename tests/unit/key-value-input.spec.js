import { shallowMount } from "@vue/test-utils";
import KeyValueInput from "@/key-value-input.vue";

import createCustomLocalVue from "./createCustomLocalVue";

// utility method that stubs a v-tect-field-component. This allows to make it fire an event in the tests.
const stubVTextField = () => ({
  name: "v-text-field",
  template: "<v-text-field-stub />",
});

describe("HelloWorld.vue", () => {
  let localVue;
  let mountKeyValueInput;
  beforeEach(() => {
    localVue = createCustomLocalVue();
    mountKeyValueInput = props =>
      shallowMount(KeyValueInput, {
        propsData: props,
        localVue,
        stubs: {
          "v-text-field": stubVTextField(),
        },
      });
  });

  describe("Initial rendering of the component", () => {
    it("renders given key / values labels", () => {
      const wrapper = mountKeyValueInput({
        keysLabel: "key",
        valuesLabel: "val",
      });

      expect(wrapper.find('[data-test="keys-label"]').text()).toEqual("key");
      expect(wrapper.find('[data-test="values-label"]').text()).toEqual("val");
    });

    it("does not render labels if they are not given", () => {
      const wrapper = mountKeyValueInput({
        propsData: {},
        localVue,
      });

      expect(wrapper.find('[data-test="keys-label"]').exists()).toBe(false);
      expect(wrapper.find('[data-test="values-label"]').exists()).toBe(false);
    });

    test.each([null, undefined, {}])(
      "renders a single key/value row when value is null, unset or empty (%j)",
      value => {
        const wrapper = mountKeyValueInput(
          value === undefined ? {} : { value },
        );
        expect(
          wrapper.findAll('v-text-field-stub[data-test="key-input"]'),
        ).toHaveLength(1);
        expect(
          wrapper.findAll('v-text-field-stub[data-test="value-input"]'),
        ).toHaveLength(1);
      },
    );

    it("Renders a row if there is a single key/value pair in the value prop", () => {
      const wrapper = mountKeyValueInput({
        value: { key1: "value1" },
      });

      const keysInputs = wrapper.findAll('[data-test="key-input"]');
      const valuesInputs = wrapper.findAll('[data-test="value-input"]');
      expect(keysInputs).toHaveLength(2);
      expect(valuesInputs).toHaveLength(2);
      expect(keysInputs.at(0).attributes()).toHaveProperty("value", "key1");
      expect(valuesInputs.at(0).attributes()).toHaveProperty("value", "value1");
    });

    it("Renders a row with the value field disabled when the object is empty", () => {
      const wrapper = mountKeyValueInput({});

      const valueInput = wrapper.find('[data-test="value-input"]');
      expect(valueInput.attributes()).toHaveProperty("disabled");
    });
  });

  describe("creating a row", () => {
    let wrapper;
    beforeEach(() => {
      // Mount an empty key-value-input
      wrapper = mountKeyValueInput({});
    });

    it('fires a "input" event with the correct object when a key is set in the first field', () => {
      // simulate input event on the v-text-field
      const keyInput = wrapper.find('v-text-field-stub[data-test="key-input"]');
      keyInput.vm.$emit("input", "test");

      expect(wrapper.emitted().input).toHaveLength(1);
      expect(wrapper.emitted().input[0]).toEqual([{ test: "" }]);
    });

    it("enables the value field when a key is set in the first field", () => {
      // simulate input event on the v-text-field
      const keyInput = wrapper.find('v-text-field-stub[data-test="key-input"]');
      keyInput.vm.$emit("input", "test");

      const valueInput = wrapper.find('[data-test="value-input"]');
      expect(valueInput.attributes()).not.toHaveProperty("disabled");
    });

    it("adds a row when a key is set in the last field", () => {
      // set a key in the key input
      const keyInput = wrapper.find('v-text-field-stub[data-test="key-input"]');
      keyInput.vm.$emit("input", "test");

      // Check that we now have 2 rows
      const keysInputs = wrapper.findAll('[data-test="key-input"]');
      const valuesInputs = wrapper.findAll('[data-test="value-input"]');
      expect(keysInputs).toHaveLength(2);
      expect(valuesInputs).toHaveLength(2);
      expect(keysInputs.at(0).attributes()).toHaveProperty("value", "test");
      expect(valuesInputs.at(0).attributes()).toHaveProperty("value", "");
    });

    it('fires an "input" event with the correct object when a key and value are set in the first row', () => {
      // simulate input events on the v-text-field
      wrapper
        .findAll('v-text-field-stub[data-test="key-input"]')
        .at(0)
        .vm.$emit("input", "key1");
      wrapper
        .findAll('v-text-field-stub[data-test="value-input"]')
        .at(0)
        .vm.$emit("input", "value1");

      expect(wrapper.emitted().input).toHaveLength(2);
      expect(wrapper.emitted().input).toEqual([
        [{ key1: "" }],
        [{ key1: "value1" }],
      ]);
    });
  });

  describe("changing the value with the prop", () => {
    let wrapper;
    beforeEach(() => {
      // Mount an empty key-value-input
      wrapper = mountKeyValueInput({ value: { key1: "value1" } });
    });

    it("adds a row if a new key is provided", () => {
      wrapper.setProps({ value: { key1: "value1", key2: "value2" } });
      // Check that we now have 3 rows
      const keysInputs = wrapper.findAll('[data-test="key-input"]');
      const valuesInputs = wrapper.findAll('[data-test="value-input"]');
      expect(keysInputs).toHaveLength(3);
      expect(valuesInputs).toHaveLength(3);
      expect(keysInputs.at(0).attributes()).toHaveProperty("value", "key1");
      expect(valuesInputs.at(0).attributes()).toHaveProperty("value", "value1");
      expect(keysInputs.at(1).attributes()).toHaveProperty("value", "key2");
      expect(valuesInputs.at(1).attributes()).toHaveProperty("value", "value2");
    });

    it("fires an input event if a new key is provided", () => {
      wrapper.setProps({ value: { key1: "value1", key2: "value2" } });
      // Check the emitted event
      expect(wrapper.emitted().input).toHaveLength(1);
      expect(wrapper.emitted().input[0]).toEqual([
        { key1: "value1", key2: "value2" },
      ]);
    });
  });

  describe("updating a row", () => {
    let wrapper;
    beforeEach(() => {
      // Mount an empty key-value-input
      wrapper = mountKeyValueInput({
        value: { key1: "value1", key2: "value2" },
      });
    });

    it('fires a "input" event with the correct object when a key is set in the first field', () => {
      // simulate input event on the v-text-field
      const keyInput = wrapper.find('v-text-field-stub[data-test="key-input"]');
      keyInput.vm.$emit("input", "key3");

      expect(wrapper.emitted().input).toHaveLength(1);
      expect(wrapper.emitted().input[0]).toEqual([
        { key3: "value1", key2: "value2" },
      ]);
    });

    it('fires a "input" event with the correct object when a value is set in the first field', () => {
      // simulate input event on the v-text-field
      const valueInput = wrapper.find(
        'v-text-field-stub[data-test="value-input"]',
      );
      valueInput.vm.$emit("input", "value2");

      expect(wrapper.emitted().input).toHaveLength(1);
      expect(wrapper.emitted().input[0]).toEqual([
        { key1: "value2", key2: "value2" },
      ]);
    });

    it('fires a "input" event with the correct object when a value is set in the second field', () => {
      // simulate input event on the v-text-field
      const valueInput = wrapper
        .findAll('v-text-field-stub[data-test="value-input"]')
        .at(1);
      valueInput.vm.$emit("input", "testValue");

      expect(wrapper.emitted().input).toHaveLength(1);
      expect(wrapper.emitted().input[0]).toEqual([
        { key1: "value1", key2: "testValue" },
      ]);
    });

    it("doesn't fire an event if the value wouldn't change", () => {
      // simulate input event on the second row value input
      const valueInput = wrapper
        .findAll('v-text-field-stub[data-test="value-input"]')
        .at(1);
      valueInput.vm.$emit("input", "value2");

      expect(wrapper.emitted().input).toBeUndefined();
    });

    it("doesn't fire an event if the value changes to the value we just got from the event", () => {
      // simulate input event on the v-text-field
      const valueInput = wrapper.find(
        'v-text-field-stub[data-test="value-input"]',
      );
      valueInput.vm.$emit("input", "value2");

      // We receive an input event and update the value accordingly (classic behavior of a controlled component)
      expect(wrapper.emitted().input).toHaveLength(1);
      expect(wrapper.emitted().input[0]).toEqual([
        { key1: "value2", key2: "value2" },
      ]);
      wrapper.setProps({ value: wrapper.emitted().input[0][0] });

      // Check that we have no new events
      expect(wrapper.emitted().input).toHaveLength(1);
    });
  });

  describe("removing a row", () => {
    let wrapper;
    beforeEach(() => {
      // Mount an empty key-value-input
      wrapper = mountKeyValueInput({ value: { key1: "value1" } });
    });

    it('fires a "input" event with the correct object when a key is removed', () => {
      // simulate input event on the v-text-field
      const keyInput = wrapper.find('v-text-field-stub[data-test="key-input"]');
      keyInput.vm.$emit("input", "");

      expect(wrapper.emitted().input).toHaveLength(1);
      expect(wrapper.emitted().input[0]).toEqual([{}]);
    });

    it("removes the corresponding row when a key is removed", () => {
      // simulate input event on the v-text-field
      const keyInput = wrapper.find('v-text-field-stub[data-test="key-input"]');
      keyInput.vm.$emit("input", "");

      // Check that we now have only 1 row
      const keysInputs = wrapper.findAll('[data-test="key-input"]');
      const valuesInputs = wrapper.findAll('[data-test="value-input"]');

      expect(keysInputs).toHaveLength(1);
      expect(valuesInputs).toHaveLength(1);
      expect(keysInputs.at(0).attributes()).toHaveProperty("value", "");
      expect(valuesInputs.at(0).attributes()).toHaveProperty("value", "");
    });
  });

  describe("Handling duplicate", () => {
    let wrapper;
    beforeEach(() => {
      // Mount an empty key-value-input
      wrapper = mountKeyValueInput({
        value: { key1: "value1", key2: "value2" },
      });
    });

    it("Keeps the first value when a key is in duplicate", () => {
      // simulate input event on the last v-text-field
      const keyInput = wrapper
        .findAll('v-text-field-stub[data-test="key-input"]')
        .at(2);
      keyInput.vm.$emit("input", "key2");

      expect(wrapper.emitted().input).toBeUndefined(); // Doesn't emit because the value would be unchanged
    });

    it("shows an error on a row with a duplicate key", () => {
      // simulate input event on the last v-text-field
      const keyInput = wrapper
        .findAll('v-text-field-stub[data-test="key-input"]')
        .at(2);
      keyInput.vm.$emit("input", "key2");
      const valueInput = wrapper
        .findAll('v-text-field-stub[data-test="value-input"]')
        .at(2);

      expect(keyInput.attributes()).toHaveProperty("error");
      expect(valueInput.attributes()).toHaveProperty("error");
      expect(keyInput.attributes()).toHaveProperty(
        "error-messages",
        "This key is a duplicate.",
      );
      expect(valueInput.attributes()).toHaveProperty(
        "error-messages",
        "This value won't be used.",
      );
    });

    it("Uses custom error messages if given.", () => {
      // Mount an empty key-value-input
      wrapper = mountKeyValueInput({
        value: { key1: "value1" },
        duplicateKeyErrorMessage: "Cette propriété est un doublon.",
        duplicateLabelErrorMessage: "",
      });

      // simulate input event on the last v-text-field
      const keyInput = wrapper
        .findAll('v-text-field-stub[data-test="key-input"]')
        .at(1);
      keyInput.vm.$emit("input", "key1");
      const valueInput = wrapper
        .findAll('v-text-field-stub[data-test="value-input"]')
        .at(2);

      expect(keyInput.attributes()).toHaveProperty(
        "error-messages",
        "Cette propriété est un doublon.",
      );
      expect(valueInput.attributes()).not.toHaveProperty("error-messages");
    });

    it("keeps duplicates in memory when prop is updated (case of not changing data)", () => {
      // simulate input event on the v-text-field
      const keyInput = wrapper.find('v-text-field-stub[data-test="key-input"]');
      // First and second row become duplicates
      keyInput.vm.$emit("input", "key2");

      // We receive an input event and update the value accordingly (classic behavior of a controlled component)
      expect(wrapper.emitted().input).toHaveLength(1);
      expect(wrapper.emitted().input[0]).toEqual([{ key2: "value1" }]);
      wrapper.setProps({ value: wrapper.emitted().input[0][0] });

      // Check that the second row is still present in error
      const keyInputs = wrapper.findAll(
        'v-text-field-stub[data-test="key-input"]',
      );
      expect(keyInputs).toHaveLength(3);
      expect(keyInputs.at(1).attributes()).toHaveProperty("error");
    });

    it("Resets duplicates when value is updated from outside the component", () => {
      const keyInput = wrapper
        .findAll('v-text-field-stub[data-test="key-input"]')
        .at(1);
      // First and second row become duplicates by changing the second row
      keyInput.vm.$emit("input", "key1");

      // Add a row through props
      wrapper.setProps({ value: { key1: "value1", key3: "value3" } });

      // Check that the second row is not in error and contains the new value
      const keyInputs = wrapper.findAll(
        'v-text-field-stub[data-test="key-input"]',
      );
      const valueInputs = wrapper.findAll(
        'v-text-field-stub[data-test="value-input"]',
      );
      expect(keyInputs).toHaveLength(3);
      expect(keyInputs.at(1).attributes()).not.toHaveProperty("error");
      expect(keyInputs.at(1).attributes()).toHaveProperty("value", "key3");
      expect(valueInputs.at(1).attributes()).not.toHaveProperty("error");
      expect(valueInputs.at(1).attributes()).toHaveProperty("value", "value3");
    });
  });
});
