var app = angular.module("myapp", ["ngRoute"]);
app.config(function ($routeProvider) {
  $routeProvider
    .when("/home", {
      templateUrl: "home.html",
    })
    .when("/list", {
      templateUrl: "product-list.html",
    })
    .when("/info/:id", {
      templateUrl: "product-info.html",
      controller: "infoCtrl",
    })
    .when("/cart", {
      templateUrl: "shopping-cart.html",
      controller: "cartCtrl",
    })
    .when("/checkout", {
      templateUrl: "checkout.html",
    })
    .otherwise({
      redirectTo: "/home",
    });
});

app.controller("myctrl", function ($scope, $rootScope, $http) {
  $rootScope.products = [];
  // $rootScope.products2 = [];
  $http.get("products.json").then(function (reponse) {
    $rootScope.products = reponse.data;
    // var a = $rootScope.products.map((sp) => sp.brand);
    // $rootScope.products2 = Array.from(new Set(a));
    // $rootScope.products2 = $rootScope.products.map((sp) => ({
    //   category: sp,
    //   brand:
    //     sp === "Adidas"
    //       ? "Adidas"
    //       : sp === "Nike"
    //       ? "Nike"
    //       : sp === "Vans"
    //       ? "Vans"
    //       : sp === "New Balance"
    //       ? "New Balance"
    //       : sp === "Sneaker"
    //       ? "Giày Sneaker"
    //       : sp === "Slide-On"
    //       ? "Dép"
    //       : "",
    // }));
    $scope.page = 1;
    $scope.limit = 12;
    $scope.np = function (n) {
      $scope.page = n;
      $scope.start = ($scope.page - 1) * $scope.limit;
    };
    $rootScope.totalPage = Math.ceil($rootScope.products.length / $scope.limit);
    $rootScope.numPage = Array.from(Array($rootScope.totalPage).keys());
  });
});
app.controller("infoCtrl", function ($scope, $routeParams, $rootScope) {
  $scope.id = $routeParams.id === undefined ? "" : $routeParams.id;
  $scope.list = $scope.$parent.products.find((p) => p.name === $scope.id);
  console.log($scope.list);
  $rootScope.carts = [];
  $scope.buy = function (prod) {
    var status = true;
    var prod = {
      list: $scope.list,
      quantity: $scope.quantity,
    };
    for (const item of $rootScope.carts) {
      if (item.id == prod.id) {
        item.quantity++;
        status = false;
        break;
      }
    }
    if (status) {
      prod.quantity = 1;
      $rootScope.carts.push(prod);
    }
  };
  console.log($rootScope.carts);
});

app.controller("cartCtrl", function ($scope, $rootScope) {
  $rootScope.totalCart = function () {
    var total = 0;
    for (const item of $rootScope.carts) {
      total = total + item.list.price * item.quantity;
    }
    return total;
  };
  $scope.clear = function () {
    $rootScope.carts = [];
  };
  $scope.remove = function (id) {
    $rootScope.carts = $rootScope.carts.filter((prod) => prod.id != id);
  };
});

app.run(function ($rootScope) {
  $rootScope.$on("$routeChangeStart", function () {
    $rootScope.loading = true;
  });
  $rootScope.$on("$routeChangeSuccess", function () {
    $rootScope.loading = false;
  });
  $rootScope.$on("$routeChangeError", function () {
    $rootScope.loading = false;
    alert("Lỗi, không tải được template");
  });
});
