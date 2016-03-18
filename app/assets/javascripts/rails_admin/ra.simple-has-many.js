/*
 * RailsAdmin simple has many
 *
 * Based on original filtering-simplehasmany widget but modified substantially
 * to simplify it (e.g. removing the first select menu and add a destroy button)
 *
 */

(function($) {
  $.widget("ra.simpleHasMany", {
    _cache: {},

    _create: function() {
      this._build();
      this._buildCache();
      this._bindEvents();
    },

    _build: function() {
      var i;

      this.wrapper = $('<div class="ra-multiselect">');
      this.wrapper.insertAfter(this.element);
      this.header = $('<div class="ra-multiselect-header ui-helper-clearfix">');
      this.wrapper.append(this.header);

      this.columns = {
        right: $('<div class="ra-multiselect-column ra-multiselect-right">')
      };

      for (i in this.columns) {
        if (this.columns.hasOwnProperty(i)) {
          this.wrapper.append(this.columns[i]);
        }
      }

      this.collection = $('<select></select>');
      this.collection.addClass("form-control ra-multiselect-collection");
      this.collection.wrap('<div class="wrapper"/>');
      this.selection = $('<select class="form-control ra-multiselect-selection" multiple="multiple"></select>');
      this.columns.right.append(this.selection);
      this.selection.wrap('<div class="wrapper"/>');
      this.remove = $('<br/><a style="margin-left:10px; margin-top:5px;" href="#" class="ra-multiselect-item-remove btn btn-sm btn-danger"><i class=\"icon-plus icon-minus\"></i></a>');
      help_block = this.wrapper.parent().find('.help-block')[0];
      this.remove.insertBefore(help_block)
      if (this.options.sortable) {
        this.up = $('<br/><a href="#" style="margin-left:10px; margin-top:5px;" class="ra-multiselect-item-up btn btn-default btn-xs"><span class="glyphicon glyphicon-arrow-up"></span></a>');
        this.down = $('<br/><a href="#" style="margin-left:10px; margin-top:5px;" class="ra-multiselect-item-down btn btn-default btn-xs"><span class="glyphicon glyphicon-arrow-down"></span></a>');
        this.up.insertBefore(help_block)
        this.down.insertBefore(help_block)
      }

      this.element.css({display: "none"});
      this.tooManyObjectsPlaceholder = $('<option disabled="disabled" />').text(RailsAdmin.I18n.t("too_many_objects"));
      this.noObjectsPlaceholder = $('<option disabled="disabled" />').text(RailsAdmin.I18n.t("no_objects"))

      if(this.options.xhr){
        this.collection.append(this.tooManyObjectsPlaceholder);
      }
    },

    _buildCache: function(options) {
      var widget = this;

      this.element.find("option").each(function(i, option) {
        if (option.selected) {
          widget._cache['o_' + option.value] = {id: option.value, value: option.innerHTML};
          $(option).clone().appendTo(widget.selection).attr("selected", false).attr("title", $(option).text());
        } else {
          widget._cache['o_' + option.value] = {id: option.value, value: option.innerHTML};
          $(option).clone().appendTo(widget.collection).attr("selected", false).attr("title", $(option).text());
        }
      });
    },

    _bindEvents: function() {
      var widget = this;

      if(this.options.sortable) {
        /* Move selection up */
        this.up.click(function(e){
          widget._move('up', $(':selected', widget.selection));
          e.preventDefault();
        });

        /* Move selection down */
        this.down.click(function(e){
          widget._move('down', $(':selected', widget.selection));
          e.preventDefault();
        });
      }

      this.remove.click(function(e){
        if ($(':selected', widget.selection).length == 0)
          return
        selected_id = $(':selected', widget.selection)[0].value
        title = $(':selected', widget.selection)[0].title
        model_name = this.options.model_name
        delete_path = Routes.rails_admin_delete_path(model_name, selected_id)

        var answer = confirm ("Are you sure you want to delete '" + title + "' ? " +
            "\nThis will take effect immediately and CANNOT be undone");
        if (answer)
        {
          $.ajax({
              type: "POST",
              url: delete_path,
              dataType: "json",
              data: {"_method":"delete"},
              complete: function(){
                  widget._deSelect($(':selected', widget.selection));
              },
              error: function() {
                alert("Error: Could not delete dimension, please try again")
              }
          });

        }
        e.preventDefault();
      }.bind(this));
    },

    _move: function(direction, options) {
      var widget = this;
      if(direction == 'up') {
        options.each(function(i, option) {
          var prev = $(option).prev();
          if (prev.length > 0) {
            var el = widget.element.find('option[value="' + option.value + '"]');
            var el_prev = widget.element.find('option[value="' + prev[0].value + '"]');
            el_prev.before(el);
            prev.before($(option));
          }
        });
      } else {
        $.fn.reverse = [].reverse; // needed to lower last items first
        options.reverse().each(function(i, option) {
          var next = $(option).next();
          if (next.length > 0) {
            var el = widget.element.find('option[value="' + option.value + '"]');
            var el_next = widget.element.find('option[value="' + next[0].value + '"]');
            el_next.after(el);
            next.after($(option));
          }
        });
      }
    },

    _deSelect: function(options) {
      var widget = this;
      options.each(function(i, option) {
        widget.element.find('option[value="' + option.value + '"]').removeAttr("selected");
      });
      $(options).appendTo(this.collection).attr('selected', false);
    },


    selected: function(value) {
      return this.element.find('option[value="' + value + '"]').attr("selected");
    },

    destroy: function() {
      this.wrapper.remove();
      this.element.css({display: "inline"});
      $.Widget.prototype.destroy.apply(this, arguments);
    }
  });
})(jQuery);

$(document).on('rails_admin.dom_ready', function(e, content) {
  content = content ? content : $('form');
  content.find('[data-simplehasmany]').each(function() {
    $(this).simpleHasMany($(this).data('options'));
    if ($(this).parents("#modal").length) {
      return $(this).siblings('.create').each(function ()
        {
          $(this).attr('href', $(this).attr('data-link'))
          $(this).attr('target', '_new')
          $(this).removeAttr('data-link', '')
          var edit_url = $(this).parent().find('select').first().data('options') && $(this).parent().find('select').first().data('options')['edit-url'];
          if(typeof(edit_url) != 'undefined' && edit_url.length) {
            $(document).on('dblclick', '.ra-multiselect option:not(:disabled)', function(e){
              console.log(this.title)
              var win = window.open(edit_url.replace('__ID__', this.value), '_blank');
              if (win) { win.focus(); }
            });
          }


        });
    } else {
      return $(this).parents('.control-group').first().remoteForm();
    }
  });
});

