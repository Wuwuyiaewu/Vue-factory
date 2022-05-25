<template>
  <div class="input-control" :class="error != '' ? 'error' : ''">
    <label :for="name">{{ label }}</label>
    <div class="input-wrap">
      <input
        :type="inputType"
        :name="name"
        :id="id"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :value="value"
        @input="_onInput"
        @change="_onChange"
      />
      <p>{{ error }}</p>
      <van-icon
        v-if="clearable && value != ''"
        class="input-clear"
        name="clear"
        size="18"
        @click="_onClear"
      />
      <div v-if="type === 'password' && showPassword" class="toggle-icon">
        <i
          v-if="inputType !== type"
          class="icon-show"
          @click="_togglePWD"
        ></i>
        <i v-else class="icon-hide" @click="_togglePWD"></i>
      </div>
      <slot name="getCode"></slot>
    </div>
    <slot name="indicator"></slot>
  </div>
</template>

<script>
require("@/assets/css/formInput.css");
export default {
  props: {
    id: {
      type: String,
      default: "",
    },
    name: {
      type: [String],
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: [String],
      default: "",
    },
    maxlength: {
      type: Number,
      default: "",
    },
    value: {
      type: [String, Number],
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    showPassword: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      inputType: this.type
    }
  },
  methods: {
    _onChange(event) {
      this.$emit("change", event.target.value);
    },
    _onInput(event) {
      this.$emit("input", event.target.value);
    },
    _onClear() {
      this.$emit("input", "");
    },
    _togglePWD() {
      const mapTypes = {
        password: "text",
        text: "password",
      };
      mapTypes[this.inputType] && (this.inputType = mapTypes[this.inputType]);
    },
  },
};
</script>

<style></style>
