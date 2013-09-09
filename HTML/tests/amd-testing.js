define.amd.modules = {};

require(['tAMD/hooks'], function(hooks) {
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

  hooks.on('publish', function(id, moduleValue) {
    define.amd.modules[id] = moduleValue;
    return [id, moduleValue];
  });
});
