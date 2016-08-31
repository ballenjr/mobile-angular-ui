/**
 * @module mobile-angular-ui.components.navbars
 * @description
 *
 * Bootstrap default navbars are awesome for responsive websites, but are not the
 * best with a small screen. Also fixed positioning is yet not an option to create
 * navbars standing in top or bottom of the screen.
 *
 * Mobile Angular Ui offers an alternative to bootstrap navbars that is more
 * suitable for mobile.
 *
 * It uses scrollable areas to avoid scroll issues. In the following figure you can
 * see the difference between fixed navbars and navbars with absolute positioning.
 *
 * <figure class="full-width-figure">
 *   <img src="/assets/img/figs/fixed-overflow.png" alt=""/>
 * </figure>
 *
 * Here is the basic markup to achieve this.
 *
 * ``` html
 * <div class="app">
 *   <div class="navbar navbar-app navbar-absolute-top">
 *     <!-- ... -->
 *   </div>
 *
 *   <div class="navbar navbar-app navbar-absolute-bottom">
 *     <!-- ... -->
 *   </div>
 *
 *   <div class="app-body">
 *     <ng-view></ng-view>
 *   </div>
 * </div>
 * ```
 *
 * As you can notice the base class is `.navbar-app` while the positioning is
 * obtained adding either `.navbar-absolute-top` or `.navbar-absolute-bottom`
 * class.
 *
 * ### Mobile Navbar Layout
 *
 * Top navbar in mobile design most of the times follows a clear pattern: a
 * centered title surrounded by one or two action buttons, the _back_ or the
 * _menu_ buttons are two common examples.
 *
 * Twitter Bootstrap ships with a different arrangement of components for navbars
 * since they are supposed to host an horizontal navigation menu.
 *
 * `.navbar-app` is specifically designed to support this different type of
 * `.interaction and arrangement.
 *
 * Consider the following example:
 *
 * ``` html
 * <div class="navbar navbar-app navbar-absolute-top">
 *
 *   <div class="navbar-brand navbar-brand-center">
 *     Navbar Brand
 *   </div>
 *
 *   <div class="btn-group pull-left">
 *     <div class="btn btn-navbar">
 *       Left Action
 *     </div>
 *   </div>
 *
 *   <div class="btn-group pull-right">
 *     <div class="btn btn-navbar">
 *       Right Action
 *     </div>
 *   </div>
 * </div>
 *
 * ```
 *
 * `.navbar-brand-center` is a specialization of BS3's `.navbar-brand`.  It will
 * render the title centered and below the two button groups. Note that `.navbar-
 * brand-center` will position the title with absolute positioning ensuring that
 * it will never cover the buttons, which would cause interaction problems.
 *
 */

(function() {
  'use strict';

  var module = angular.module('mobile-angular-ui.components.navbars', []);

  var global;

  /**
  * @directive navController
  * @restrict C
  * @description
  *
  * Directive to bind controller to navbar
  *
  * ``` html
  *  <div class="navbar navbar-app navbar-absolute-top" nav-controller>
  *    <!-- ... -->
  *  </div>
  * ```
  */
  module.directive("navController", function() {
    return {
      restrict: "A",
      controller: function() {
        this.registerController = function(name, ctrl) {
          this[name] = ctrl;
        };
      },
      link: function(scope){}
    };
  });

 /**
  * @directive navbarAbsoluteTop
  * @restrict C
  * @description
  *
  * Setup absolute positioned top navbar.
  *
  * ``` html
  *  <div class="navbar navbar-app navbar-absolute-top">
  *    <!-- ... -->
  *  </div>
  * ```
  */

 /**
  * @directive navbarAbsoluteBottom
  * @restrict C
  * @description
  *
  * Setup absolute positioned bottom navbar.
  *
  * ``` html
  *  <div class="navbar navbar-app navbar-absolute-bottom">
  *    <!-- ... -->
  *  </div>
  * ```
  */
  angular.forEach(['top', 'bottom'], function(side) {
    var directiveName = 'navbarAbsolute' + side.charAt(0).toUpperCase() + side.slice(1);
    module.directive(directiveName, [
      '$rootElement',
      function($rootElement) {
        return {
          restrict: 'C',
          require: "navController",
          link: function(scope, elem, attr, ctrl) {
            $rootElement.addClass('has-navbar-' + side);
            scope.$on('$destroy', function() {
              $rootElement.removeClass('has-navbar-' + side);
            });
            if (!global) global = ctrl;
            global.registerController(side, new (function() {
              this.hide = function() {
                $rootElement.removeClass("has-navbar-" + side);
                elem.addClass("ng-hide");
              };
              this.show = function() {
                elem.removeClass("ng-hide");
                $rootElement.addClass("has-navbar-" + side);
              };
              this.slideout = function() {
                $rootElement.removeClass("has-navbar-" + side);
                elem.addClass("ng-hide");
              };
              this.slidein = function() {
                elem.removeClass("ng-hide");
                $rootElement.addClass("has-navbar-" + side);
              };
            })());
          }
        };
      }
    ]);
  });

  /**
   * @directive [hide|show|slidein|slideout][Top|Bottom|Both][Nav]
   * @restrict C
   * @description
   *
   * Toggle each(or both) nabar(s) with or without animations
   *
   * ``` html
   *  <view class="[hide|show|slidein|slideout]-[top|bottom|both]-[nav]">
   *    <!-- ... -->
   *  </view>
   * ```
   */
  angular.forEach(['Top', 'Bottom', 'Both'], function(nav) {
    angular.forEach(['hide', 'show', 'slidein', 'slideout'], function(method) {
      var name = method + nav + "Nav";
      module.directive(name, function() {
        return {
          restrict: "C",
          link: function(scope, elem, attr) {
            if (global)
              if (nav === 'Both') {
                global.bottom[method]();
                global.top[method]();
              } else
                global[nav.toLowerCase()][method]();
          }
        };
      });
    });
  });
})();
