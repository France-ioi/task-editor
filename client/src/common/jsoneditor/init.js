// Specify upload handler
/*
      window.JSONEditor.defaults.options.upload = function(type, file, cbs) {
        if (type === 'root.upload_fail') cbs.failure('Upload failed');
        else {
          var tick = 0;
          var tickFunction = function() {
            tick += 1;
            console.log('progress: ' + tick);
            if (tick < 100) {
              cbs.updateProgress(tick);
              window.setTimeout(tickFunction, 50)
            } else if (tick == 100) {
              cbs.updateProgress();
              window.setTimeout(tickFunction, 500)
            } else {
              cbs.success('http://www.example.com/images/' + file.name);
            }
          };
          window.setTimeout(tickFunction)
        }
      };

      */