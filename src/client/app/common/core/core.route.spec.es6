import CoreAppModule from './core.module';
import CoreRoute from './core.route';

describe('CoreRoute', () => {
    let $rootScope, $state, module, $location, makeController, $window;

    beforeEach(window.module( CoreAppModule.name));
    beforeEach(inject((_$rootScope_, _$state_, _$location_) => {
        $rootScope = _$rootScope_;
        $state = _$state_;
        $location = _$location_;
    }));

    describe('Module', () => {
        //top-level specs: i.e., routes, injection, naming
      before(function() {
        module = angular.module("core.app");
      });

      it("fileUpload module should be registered", function() {
        expect(module).to.not.equal(null);
      });

      describe('state', function() {
        let views = {
          four0four: 'app/common/core/404.html'
        };

        it('should map state 404 to url /404 ', function() {
          expect($state.href('404', {})).to.equal('/404');
        });

        it('should map /404 route to 404 View template', function() {
          expect($state.get('404').templateUrl).to.equal(views.four0four);
        });
      });
    });
});
