'use strict';
 
  function activateAjaxFormsHrefButtons(){
    $('.hrefButton, .hrefAnchor').off('click');
    $('.hrefButton, .hrefAnchor').one('click', function() {
      $.ajax( {
        type: $(this).data('method'),
        url: $(this).data('url'),
        success: function( response ) {
          $('#scene1').toggle('fast', function(){
            $(this).html(response).toggle('fast');
            activateAjaxElements();
          });
        }
      } );
    });
  }

  function activateAjaxForms(){
    $('.form').find('a.submit').off('click');
    $('.form').find('a.submit').one('click', function() {
      var $form = $(this).parents('form');
      var $submitButton = $form.find('a.submit');
      $form.find('.okSign').hide();
      $form.find('a.submit').addClass('active');
      $form.find('a.submit').addClass('disabled');
      $.ajax( {
        type: $form.attr( 'method' ),
        url: $form.attr( 'action' ),
        data: $form.serialize(),
        success: function(response) {
          _.each(Object.keys(response), function(key){
            $form.find('input[name="'+key+'"], textarea[name="'+key+'"], select[name="'+key+'"], checkbox[name="'+key+'"], radio[name="'+key+'"]').attr('disabled','disabled');
          });
          savedFormVisualize($form);
        },
        error: function (xhr, error) {
          console.log(error, Object.keys(xhr.responseJSON.invalidAttributes));
          _.each(Object.keys(xhr.responseJSON.invalidAttributes), function(key){
            $form.find('input[name="'+key+'"]').parents('.form-group').addClass('has-error');
          });
        }
      });
    });
    function savedFormVisualize($form) {
        $form.find('a.submit').removeClass('active');
        $form.find('.editFormButton').show();
        $form.find('.okSign').removeClass('text-muted').addClass('text-success').show();
    }
  }

  function activateAjaxFormsEditButtons () {
    $('.editFormButton').off('click');
    $('.editFormButton').one('click', function () {
      var $form = $(this).parents('form');
      $form.find('input, textarea, select, checkbox, radio').removeAttr('disabled');
      $form.find('.editFormButton').hide();
      $form.find('a.submit').removeClass('disabled');
      $form.find('.okSign').removeClass('text-success').addClass('text-muted');
      activateAjaxElements();
    });
  }

  function activateAjaxElements (argument) {
    activateAjaxForms();
    activateAjaxFormsHrefButtons();
    activateAjaxFormsEditButtons();
    bindTableInputsDoubleClick();
  }

  function bindTableFormSaveDelete($inputElement){
    var $formButtons = $inputElement.parents('tr').find('.saveButton, .deleteButton');
    $formButtons.removeClass('hidden').on('click', function () {
      var $this = $(this);
      if ($this.hasClass('saveButton')){
        submitRow($this);
      }else if ($this.hasClass('deleteButton')){

      }
    });

    function submitRow($button){
      var $formElements = $button.parents('tr').find('input, textarea, select, checkbox, radio');
      var $formButtons = $button.parents('tr').find('.saveButton, .deleteButton');
      var formdata = $formElements.serialize();

      $button.removeClass('glyphicon-save').removeClass('glyphicon-saved').addClass('glyphicon-refresh').addClass('spin');
      $.ajax({
        type: $button.data().method,
        url: $button.data().url,
        data: formdata,
        success: function( response ) {
          console.log(response);
          $button.removeClass('glyphicon-refresh').removeClass('spin').addClass('glyphicon-saved').addClass('text-success');
          setTimeout(function(){
            $formElements.attr('readonly', true);
            $formButtons.addClass('hidden');
          }, 300);
        },
        error: function (xhr, error) {
          console.log(error);
          console.log(xhr);
          
        }
      });
    }
  }

  function bindTableInputsDoubleClick () {
    $('table').find('input').on('dblclick', function(){
      var $this = $(this);
      bindTableFormSaveDelete($this);
      $this.parents('tr').find('input').removeAttr('readonly');
    });
  }
  function activateAjaxLogin (argument) {
    $('#loginFormSubmit').on('click', function() {
      $.ajax( {
        type: "POST",
        url: $('#loginForm').attr( 'action' ),
        data: $('#loginForm').serialize(),
        success: function( response ) {
          $('#loginDiv').fadeOut();
          setTimeout(function(){$('#logoutDiv').fadeIn();}, 1000);
        }
      } );
    });
  }

  $(document).on('ready', function(){
    activateAjaxLogin();
    activateAjaxElements();
   
  });
  $(document).ajaxError(function( event, jqxhr, settings, thrownError ) {
    $('#scene1').html(thrownError);
    console.log(thrownError);
    activateAjaxElements();

    $('input, radio, checkbox, textarea, select').on('focus', function () {
      $(this).parents('.form-group').removeClass('has-error');
      var $form = $(this).parents('form');
      $form.find('a.submit').removeClass('disabled').removeClass('active');
      $form.find('.okSign').removeClass('text-success').addClass('text-muted').show();
    });
  });