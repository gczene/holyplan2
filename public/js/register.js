/*jslint jquery: true*/
/* aglobal console */

'use strict';

$('document').ready( function () {
    // initialize tooltips
    $('form label i').tooltip();

    /*
    * actions on reg form submit
    */
    $('#register').bind('submit', function () {

        var $form = $(this),
            ok = true,
            // imdicate errors
            addError = function (obj) {
                obj.closest('div.form-group').addClass('has-error');
                //T&C
                if (obj.closest('div.form-group').find('.alert').length) {
                    obj.closest('div.form-group').find('.alert').removeClass('hidden');
                }
            };

        // removing errors on submit
        $('div.form-group', $form).removeClass('has-error');

        // looping through required fields to find errors
        $('.required').each ( function () {
            var type = $(this).attr('type');
            if ( (type === 'checkbox' && !$(this).is(':checked')) || (type !== 'checkbox' && $(this).val().replace(/ /g, '') === '')) {
                    ok = false;
                    addError($(this));
            }
            // lets check particular fields if previous basic checking passed
            if ( ok ) {
                if ($(this).attr('id') === 'website') {
                    var exp = new RegExp(/^https?\:\/\/([\w-\.]+)/);
                    if ( ! exp.test( $(this).val())) {
                        ok = false;
                    }
                    // console.log();
                }
            }

        });

        // hmm there is an error
        if ( ! ok ) {
            $('html body').animate({
                scrollTop : $form.find('.has-error').first().offset().top
            });
        }
        else{
            // alert('fasza');
        }
        // console.log(ok);
        return false;
    });
});