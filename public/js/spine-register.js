/*jslint jquery: true, browser: true */
/*global Spine */
'use strict';


$(document).ready(function () {

    var Contact = Spine.Model.sub();
    Contact.configure('company', 'website', 'subdomain');

    // including spine validate and set it up
    Contact.include(Spine.Validate);
    Contact.include({
        rules: function(RuleFor) { return [
            RuleFor('company')
                .Required()
                .Message('Company is erquired'),

            RuleFor('website')
                .Required()
                .Matches(/^https?\:\/\/([\w-\.]+)/),

            RuleFor('terms')
                .Required()
        ];}
    });


    /*
    * create Form controller
    */
    var Form = Spine.Controller.sub({
        init : function(){

        },
        events: {
            'submit': 'register'
        },
        /* method for registration */
        register : function (e) {
            e.preventDefault(); // stop submitting

            // removing previous error indicators
            $('div.form-group', $(e.target)).removeClass('has-error');
            $('.alert', $(e.target)).addClass('hidden'); // t&c

            /* collect all data from the form and fill it to "contact" */
            var contact = Contact.fromForm(e.target);
            if (! contact.save () ) {
                var i = 0; // counter for animate
                contact.validate().forEach (function (elem) {
                    var obj = $('input[name=' + elem.property + ']', $(e.target));
                    obj.closest('div.form-group').addClass('has-error');
                    //T&C
                    if (obj.closest('div.form-group').find('.alert').length) {
                        obj.closest('div.form-group').find('.alert').removeClass('hidden');
                    }

                    //animation to the first error line
                    if (i == 0){
                        $('html body').animate({
                            scrollTop : $(e.target).find('.has-error').first().offset().top
                        }, function () {
                            $('input', $(e.target).find('.has-error').first()).focus();
                        });

                    }
                    i++;
                });
            } // end of ! save()
        } // end of register method

    }); // end of Form controller

    /* fire Form controller */
    new Form({el : $('form#register')});

});