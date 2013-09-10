require(['tAMD/hooks'], function(hooks) {
  define.amd.modules = {'tAMD/hooks': hooks};

  hooks.on('publish', function(id, moduleValue) {
    define.amd.modules[id] = moduleValue;
    return [id, moduleValue];
  });
});
