const { createApp } = Vue;
import userProductModal from "./userProductModal.js";
import toastModal from "./toastModal.js";
import confirmDeleteModal from "./confirmDeleteModal.js";
// 3.定義規則，全部加入(CDN 版本)
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 4. 設定語言環境
VeeValidateI18n.loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.12.4/dist/locale/zh_TW.json"
);
// 使用 VeeValidate.configure 將回饋訊息的語言設定為繁體中文，並且在輸入內容時就即時驗證
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true,
});

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "hedy-api-path";
const app = createApp({
  data() {
    return {
      //處理 loading 載入效果
      loadingStatus: {
        loadingItem: "",
      },
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
      products: [],
      product: {},
      cart: {},
      toastMessage: "",
    };
  },
  methods: {
    getProducts() {
      const getProductsUrl = `${apiUrl}/api/${apiPath}/products/all`;
      axios
        .get(getProductsUrl)
        .then((res) => {
          this.products = res.data.products;
          this.isLoading = false;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getProduct(id) {
      const getProductUrl = `${apiUrl}/api/${apiPath}/product/${id}`;
      // 當執行取得產品函式時，將 id 設定到 loadingItem 中，
      // 當 loadingItem 有值的情況會被自動轉型為 true，而 true 的時候畫面就會顯示轉圈圈動畫
      this.loadingStatus.loadingItem = id;
      axios
        .get(getProductUrl)
        .then((res) => {
          // 當 axios 串接完成後再將 loadingItem 改回空字串，移除轉圈圈動畫，以此實現 loading 載入效果
          this.loadingStatus.loadingItem = "";
          this.product = res.data.product;
          this.$refs.pModal.openModal();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getCart() {
      const getCartUrl = `${apiUrl}/api/${apiPath}/cart`;
      axios
        .get(getCartUrl)
        .then((res) => {
          this.cart = res.data.data;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    addToCart(id, qty = 1) {
      const addToCartUrl = `${apiUrl}/api/${apiPath}/cart`;
      this.loadingStatus.loadingItem = id;
      const cart = {
        product_id: id,
        qty,
      };
      // 關閉 userProductModal，若使用者是從 userProductModal 中加入購物車，加上這段才能關閉 modal
      this.$refs.pModal.closeModal();
      axios
        .post(addToCartUrl, { data: cart })
        .then((res) => {
          //alert(res.data.message);
          // console.log("Response data:", res.data);
          // console.log("Toast modal:", this.$refs.tModal);
          this.toastMessage = res.data.message; // 將消息賦值給 toastMessage
          this.$refs.tModal.showToast(); // 顯示 toastModal
          this.loadingStatus.loadingItem = "";
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    updateCart(data) {
      this.loadingStatus.loadingItem = data.id;
      const updateCartUrl = `${apiUrl}/api/${apiPath}/cart/${data.id}`;
      const cart = {
        product_id: data.product_id,
        qty: data.qty,
      };
      axios
        .put(updateCartUrl, { data: cart })
        .then((res) => {
          // console.log("Response data:", res.data);
          // console.log("Toast modal:", this.$refs.tModal);
          this.toastMessage = res.data.message; // 將消息賦值給 toastMessage
          this.$refs.tModal.showToast(); // 顯示 toastModal
          this.loadingStatus.loadingItem = "";
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
          this.loadingStatus.loadingItem = "";
        });
    },
    deleteCartItem(id) {
      const deleteCartItemUrl = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      axios
        .delete(deleteCartItemUrl)
        .then((res) => {
          // alert(res.data.message);
          this.toastMessage = res.data.message;
          this.$refs.tModal.showToast();
          this.loadingStatus.loadingItem = "";
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    createOrder() {
      // 檢查購物車是否為空
      if (this.cart.carts && this.cart.carts.length === 0) {
        // 如果購物車為空，顯示通知訊息
        alert("購物車為空");
        // 不執行後續的 API 請求
        return;
      }
      const createOrderUrl = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios
        .post(createOrderUrl, { data: order })
        .then((res) => {
          alert(res.data.message);
          // 在成功後使用 resetForm() 語法來清除表單欄位的內容
          // https://vee-validate.logaretm.com/v4/api/form#props:~:text=native%20form%20elements.-,resetForm,-%3A%20(state%3F%3A%20Partial%3CFormState
          this.$refs.form.resetForm();
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    openModal(){
      this.$refs.cModal.showModal();
    },
    deleteAllCartItems() {
      const deleteAllCartItemsUrl = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(deleteAllCartItemsUrl)
        .then((res) => {
          // alert(res.data.message);
          this.getCart();
          this.$refs.cModal.closeModal();
          this.toastMessage = res.data.message;
          this.$refs.tModal.showToast();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
  components: {
    userProductModal,
    toastModal,
    confirmDeleteModal,
  },
});
// 2. 註冊表單驗證元件
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);
app.mount("#app");
