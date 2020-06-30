var product = "socks"
Vue.config.devtools = true

var eventBus = new Vue();

Vue.component('product', {
    props: {
        premium:{
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img :src="image" >
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-show="onSale">On Sale!</p>
            <p v-if="inventory > 10">In Stock</p>
            <p v-else-if="inventory <= 10 && inventory > 0">Low Inventory</p>
            <p v-else > Out Of Stock</p>
            <p>{{description}}</p>
            <p>Shipping: {{ shipping }}</p>

            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>

            <div v-for="(variant, index) in variants" 
                :key="variant.variantId"
                class="color-box"
                :style="{backgroundColor: variant.variantColor}"
                @mouseover="updateProduct(index)">
            </div>

            <ul>
                <li v-for="size in sizes">
                    {{ size }}
                </li>
            </ul>

            <div>
                <button v-on:click="addToCart" 
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock}">
                    Add To Cart
                </button>
            </div>
            <div>

            <product-tabs :reviews="reviews"></product-tabs>

       

        </div>
    </div>`,
    data(){
        return{
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm fuzzy socks",
            selectedVariant: 0,
            onSale: false,
            details: ["80% cotten", "20% polyester", "Gender-neutral"],
            sizes: ["small", "medium", "large"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/socks-green.png",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/socks-blue.png",
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
            console.log(this.variants[this.selectedVariant].variantId);
        },
        updateProduct( index ){
            this.selectedVariant = index
        }
    },
    computed: {
        title(){
            return this.brand + ' ' + this.product
        },
        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        inventory(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping(){
            return this.premium ? "Free" : "2.99" 
        }
    },
    mounted(){
        eventBus.$on('review-submitted', productReview =>{
            this.reviews.push(productReview)
            console.log('BUS reviews', this.reviews);

        })
    }
    
})

Vue.component('product-review',{
    template:`
    <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
        <li v-for="error in errors">{{ error }}</li>
        </ul>
    </p>
    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name" required>
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
        
    <p>
      <input type="submit" value="Submit">  
    </p>    
  
  </form>
    `,
    props: {

    },
    data() {
        return {
            name: null,
            review: null,
            rating: 5,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                  name: this.name,
                  review: this.review,
                  rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
              } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
              }
        }
    }
})


Vue.component('product-tabs', {
    template: `
    <div>
        <span class="tab"
              :class=" { activeTab: selectedTab === tab }"
              v-for="(tab, index) in tabs"
              :key="index"
              @click="selectedTab = tab">
              {{tab}}</span>

            <div v-show="selectedTab === 'Reviews'">
              <p v-if="!reviews.length">There are no reviews yet.</p>
              <ul>
                <li v-for="review in reviews">
                <p>{{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>{{ review.review }}</p>
                </li>
              </ul>
             </div>

             <div v-show="selectedTab === 'Make a Review'">
              <product-review 
              ></product-review>    
            </div>
    </div>
    `,
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    data(){
        return{
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

var app = new Vue({
    el: '#app',
    data:{
        premium: true,
        cart: []
    },
    methods:{
        updateCart(id){
            this.cart.push(id)
        }
    }
})