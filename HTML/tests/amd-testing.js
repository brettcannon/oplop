require(['tAMD/hooks', 'jasmine'], function(hooks, jasmine) {
  hooks.on('define', function(id, dependencies, factory) {
    describe('Dependency resolution for ' + id, function() {
      dependencies.forEach(function(dependency) {
        it(dependency + ' exists', function() {
          expect(define.amd.modules[dependency]).toBeDefined();
        });
      });
    });

    return [id, dependencies, factory];
  });
});
