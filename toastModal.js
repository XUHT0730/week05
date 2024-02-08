export default {
  data() {
    return {
      toastModal: null,
    };
  },
  props: ["message"],
  template: `<div aria-live="polite" aria-atomic="true" class="d-flex justify-content-center align-items-center w-100"> 
    <div ref="toastModal" class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">
        {{message}}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
  </div> `,
  mounted() {
    // 初始化 Bootstrap Toasts 組件
    this.toastModal = new bootstrap.Toast(this.$refs.toastModal);
  },
  methods: {
    showToast() {
      // 顯示 Toast
      this.toastModal.show();
    },
  },
};
