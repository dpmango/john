$(document).ready(function(){
  ////////////////
  // FORM VALIDATIONS
  ////////////////

  // jQuery validate plugin
  // https://jqueryvalidation.org


  // GENERIC FUNCTIONS
  ////////////////////

  var validateErrorPlacement = function(error, element) {
    error.addClass('ui-validation');
    error.appendTo(element.parent("div"));
  }
  var validateHighlight = function(element) {
    $(element).parent('div').addClass("has-error");
  }
  var validateUnhighlight = function(element) {
    $(element).parent('div').removeClass("has-error");
  }
  var validateSubmitHandler = function(form) {
    $(form).addClass('loading');
    $.ajax({
      type: "POST",
      url: $(form).attr('action'),
      data: $(form).serialize(),
      success: function(response) {
        $(form).removeClass('loading');
        var data = $.parseJSON(response);
        if (data.status == 'success') {
          // do something I can't test
        } else {
            $(form).find('[data-error]').html(data.message).show();
        }
      }
    });
  }

  // var validatePhone = {
  //   required: true,
  //   normalizer: function(value) {
  //       var PHONE_MASK = '+X (XXX) XXX-XXXX';
  //       if (!value || value === PHONE_MASK) {
  //           return value;
  //       } else {
  //           return value.replace(/[^\d]/g, '');
  //       }
  //   },
  //   minlength: 11,
  //   digits: true
  // }

  ////////
  // FORMS


  /////////////////////
  // REGISTRATION FORM
  ////////////////////
  $("[js-contact-form]").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: validateSubmitHandler,
    rules: {
      name: "required",
      time: "required",
      email: {
        required: true,
        email: true
      },
      message: "required"
      // phone: validatePhone
    },
    messages: {
      name: "This field is required",
      time: "This field is required",
      email: {
          required: "This field is required",
          email: "Email is invalid"
      },
      message: "This field is required",
    }
  });

});
