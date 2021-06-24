
Vue.use(VueResource);


var app = new Vue({
  el: '#app',

  data(){
    return {
      'user'        :   {'cart':[]},
      'items'       :   [],
      'state'       :   'allbook',
      loading       :   false,
      searchQuery   :   '',
      selectedItem  :   {}
    }
  },
  created: function(){ //load data by app 
    this.fetchData();
  },
  methods: {
    /*Server give some information about user and book(s)*/
    fetchData : function(){
      var _this = this;
      _this.loading = true;
      _this.$http.get('/api/users') //session user 
      .then(response => {
        _this.user = response.body[0];
        return _this.$http.get('/api/items'); //all books
      })
      .then(response=>{
        _this.items=response.body;
        _this.smallLoadEffect();
      });
    },//fetchData

    smallLoadEffect : function(){
      var _this = this;
      _this.loading = true;
      setTimeout(function(){
          _this.loading=false;
      }, 300);
      return 'ok';
    },

    addCart : function(item) {

      /*book check*/
      if(item.db <= 0) return;
      /*Have u got enough money*/
      if(parseInt(this.user.money)<parseInt(item.ar)) return;
      /*add chart*/
      if(this.user.cart.findIndex(k => k.id==item.id) == -1){
          this.user.cart.push(item);
          this.user.money -= parseInt(item.ar);
          item.db--;

          $.ajax({
            url  : '/api/users',
            data: this.user,
            method: 'PUT'
          });
          $.ajax({
            url  : '/api/items/'+item.id,
            data: item,
            method: 'PUT'
          });
      }

    },

    removeCart : function(item) {

      /*chart  indexét*/
      var index = this.user.cart.findIndex(k => k.id==item.id);
      if(index != -1){
          this.user.cart.splice(index, 1);
          this.user.money += parseInt(item.ar);
          item.db++;

          $.ajax({
            url  : '/api/users',
            data: this.user,
            method: 'PUT'
          });
          $.ajax({
            url  : '/api/items/'+item.id,
            data: item,
            method: 'PUT'
          });
      }

    },

    saveuser: function(){
      $.ajax({
        url  : '/api/users',
        data: this.user,
        method: 'PUT'
      });
    }

  },//methods

  watch : {
    state : function(newState){
      switch(newState) {
        case 'allbook' : this.smallLoadEffect();break;
        case 'search' : this.smallLoadEffect();break;
        case 'contact' : this.smallLoadEffect();break;
        case 'settings' : this.smallLoadEffect();break;
        case 'cart' : this.smallLoadEffect();break;
        case 'details' : this.smallLoadEffect();break;
      }
    },
  },

  computed : {
    filteredItems : function(){
      var _this = this;
      return _this.items.filter(item=>{
        return JSON.stringify(item).toUpperCase().indexOf(_this.searchQuery.toUpperCase()) !== -1;
      })
    }
  }


}).mount
