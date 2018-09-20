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
  });

  describe("updating a row", () => {
    let wrapper;
    beforeEach(() => {
      // Mount an empty key-value-input
      wrapper = mountKeyValueInput({ value: { key1: "value1" } });
    });

    it('fires a "input" event with the correct object when a key is set in the first field', () => {
      // simulate input event on the v-text-field
      const keyInput = wrapper.find('v-text-field-stub[data-test="key-input"]');
      keyInput.vm.$emit("input", "key2");

      expect(wrapper.emitted().input).toHaveLength(1);
      expect(wrapper.emitted().input[0]).toEqual([{ key2: "value1" }]);
    });

    it('fires a "input" event with the correct object when a value is set in the first field', () => {
      // simulate input event on the v-text-field
      const valueInput = wrapper.find(
        'v-text-field-stub[data-test="value-input"]',
      );
      valueInput.vm.$emit("input", "value2");

      expect(wrapper.emitted().input).toHaveLength(1);
      expect(wrapper.emitted().input[0]).toEqual([{ key1: "value2" }]);
    });

    it("doesn't fire an event if the value wouldn't change", () => {
      // simulate input event on the v-text-field
      const valueInput = wrapper.find(
        'v-text-field-stub[data-test="value-input"]',
      );
      valueInput.vm.$emit("input", "value1");

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
      expect(wrapper.emitted().input[0]).toEqual([{ key1: "value2" }]);
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
});
