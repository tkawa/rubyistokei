jQuery(document).ready(function() {
  var TokeiViewModel = function(data) {
    var self = this;

    self.url = ko.observable();
    self.tokei = ko.observable();

    self.fontSize = ko.computed(function() {
      return self.tokei().size() + 'px';
    }, self);

    self.top = ko.computed(function() {
      return self.tokei().top() + 'px';
    }, self);

    self.left = ko.computed(function() {
      return self.tokei().left() + 'px';
    }, self);

    self.color = ko.computed(function() {
      return self.tokei().color();
    }, self);

    ko.mapping.fromJS(data, {}, self);
  };

  var ViewModel = function() {
    var self = this;
    var mapping = {
      info: {
        create: function(options) {
          return new TokeiViewModel(options.data);
        },
        key: function(data) {
          return ko.utils.unwrapObservable(data.id);
        }
      }
    };

    self.moment = ko.observable(moment());
    setInterval(function() {
      self.moment(moment());
    }, 1000);

    self.hour = ko.computed(function() {
      return self.moment().local().format('HH');
    }, self);

    self.minute = ko.computed(function() {
      return self.moment().local().format('mm');
    }, self);

    self.colonVisibility = ko.computed(function() {
      return self.moment().local().second() % 2 === 0 ? 'visible' : 'hidden';
    }, self);

    self.info = ko.observableArray();

    self.current = ko.computed(function() {
      if (self.info().length === 0) {
        return null;
      }
      var number = self.moment().local().minute() % self.info().length;
      return self.info()[number];
    }, self);

    self.set = function(data) {
      ko.mapping.fromJS({info: data}, mapping, self);
    };
  };

  var boxWidth = 1024;
  var boxHeight = 768;

  var box = $('.tokei-box');
  box.width(boxWidth).height(boxHeight);

  var img = $('.tokei-image');
  img.imagesLoaded(function() {
    var scaleX = boxWidth / img.width();
    var scaleY = boxHeight / img.height();
    var scale = (scaleX > scaleY) ? scaleY : scaleX;
    var fitX = img.width() * scale;
    var fitY = img.height() * scale;
    img.width(fitX);
    img.height(fitY);
  });

  var resized = function() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var scaleX = windowWidth / boxWidth;
    var scaleY = windowHeight / boxHeight;
    var scale = (scaleX > scaleY) ? scaleY : scaleX;
    var wrapperHeight = boxHeight * scale;
    var wrapperWidth = boxWidth * scale;
    var offsetX = (windowWidth - wrapperWidth) / scale;
    var offsetY = (windowHeight - wrapperHeight) / scale;
    box.css({
      zoom: scale,
      '-moz-transform': 'translate(-50%,-50%) scale(' + scale + ') translate(50%,50%)'
    });
    var top  = (windowHeight - wrapperHeight) / 2;
    var left = (windowWidth  - wrapperWidth ) / 2;
    $('.tokei-wrapper').css({
      top: top,
      left: left,
      height: wrapperHeight,
      width: wrapperWidth
    });
  };

  resized();
  $(window).resize(function() {
    resized();
  });

  var viewModel = new ViewModel();
  var info = [{
    id: 'june29-1',
    url: 'http://farm9.staticflickr.com/8048/8376938968_167939e595_b.jpg',
    tokei: {
      top: 160,
      left: 200,
      size: 128,
      color: '#333'
    }
  }, {
    id: 'june29-2',
    url: 'http://farm9.staticflickr.com/8224/8376931924_f3a3c61179_b.jpg',
    tokei: {
      top: 100,
      left: 500,
      size: 128,
      color: '#eee'
    }
  }];

  viewModel.set(info);
  window.vm = viewModel;

  ko.applyBindings(viewModel);
});
