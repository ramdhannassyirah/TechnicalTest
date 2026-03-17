import { mount } from "@vue/test-utils";
import ProductForm from "@/components/ProductForm.vue";
import { describe, it, expect, beforeEach } from "vitest";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/products/:id?",
      component: { template: "<div />" },
    },
  ],
});

describe("Product Form", () => {
  let wrapper;

  beforeEach(async () => {
    router.push("/products");
    await router.isReady();

    wrapper = mount(ProductForm, {
      global: {
        plugins: [router],
        stubs: {
          ConfirmDialog: true,
        },
      },
    });
  });

  it("renders form fields", () => {
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="number"]').exists()).toBe(true);
    expect(wrapper.find("textarea").exists()).toBe(true);
    expect(wrapper.find("select").exists()).toBe(true);
  });

  it("shows validation errors when form is empty", async () => {
    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.text()).toContain("Title is required");
    expect(wrapper.text()).toContain("Price is required");
    expect(wrapper.text()).toContain("Description is required");
    expect(wrapper.text()).toContain("Category is required");
  });
});
