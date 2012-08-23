// Generated by CoffeeScript 1.3.3
(function() {

  $.fn.flip = function() {
    return this.css('visibility', this.css('visibility') === 'hidden' ? '' : 'hidden');
  };

  $(function() {
    setInterval((function() {
      return $('#cursor').flip();
    }), 500);
    $('#editor span').live('mousedown', function() {
      $('#cursor').insertAfter(this);
      return false;
    });
    $('.key').live('mousedown', function() {
      var _this = this;
      $(this).addClass('down').trigger('aplkeypress');
      return setTimeout((function() {
        return $(_this).removeClass('down');
      }), 500);
    });
    return $('.key').live('aplkeypress', function() {
      if ($(this).hasClass('enter')) {
        $('<br>').insertBefore('#cursor');
      } else if ($(this).hasClass('backspace')) {
        $('#cursor').prev().remove();
      } else {
        $('<span>').text($(this).text().replace(/[\ \t\r\n]+/g, '')).insertBefore('#cursor');
      }
      return false;
    });
  });

}).call(this);