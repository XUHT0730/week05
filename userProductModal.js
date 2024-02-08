export default {
  props: ["product", "addToCart"],

  data() {
    return {
      userProductModal: null,
      status: {},
      qty: 1,
    };
  },
  template: `<div
    class="modal fade"
    id="userProductProductModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="userProductModal"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>{{ product.title }}</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6">
              <img class="img-fluid" :src="product.imageUrl" alt="">
            </div>
            <div class="col-sm-6">
              <span class="badge bg-primary rounded-pill">{{ product.category }}</span>
              <p>商品描述：{{ product.description }}</p>
              <p>商品內容：{{ product.content }}</p>
              <div class="h5" v-if="product.origin_price === product.price">{{ product.price }} 元</div>
              <div v-else>
                <del class="h6"> 原價 {{ product.origin_price }} 元</del>
                <div class="h5"> 現在只要 {{ product.price }} 元</div>
              </div>
              <div>
                <div class="input-group">
                  <input type="number" class="form-control" min="1"
                   v-model.number="qty" />
                  <button type="button" class="btn btn-primary" @click="addToCart(product.id, qty)">
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
            <!-- col-sm-6 end -->
          </div>
        </div>
      </div>
    </div>
  </div>`,
  methods: {
    openModal() {
      this.userProductModal.show();
    },
    closeModal() {
      this.userProductModal.hide();
    },
  },
  // 每當 product 的 qty 有變動時，下次開 Modal 時自動條回 1
  watch: {
    product() {
      this.qty = 1;
    },
  },
  mounted() {
    this.userProductModal = new bootstrap.Modal(this.$refs.userProductModal, {
      // 禁止使用者使用 ESC 鍵關閉互動視窗
      keyboard: false,
      // 禁止使用者點擊 modal 以外的地方來關閉視窗，避免資料輸入到一半遺失
      backdrop: "static",
    });
  },
};
