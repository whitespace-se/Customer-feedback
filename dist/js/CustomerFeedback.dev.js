var CustomerFeedback = {};

CustomerFeedback.Form = CustomerFeedback.Form || {};
CustomerFeedback.Form = (function ($) {

    function Form() {
        this.handleEvents();
    }

    Form.prototype.handleEvents = function () {
        // Yes or no click
        $('[data-action="customer-feedback-submit-response"]').on('click', function (e) {
            e.preventDefault();

            $target = $(e.target).parents('.customer-feedback-container');
            $(e.target).html('<i class="spinner spinner-dark"></i>');

            var responsePostId = $target.find('[name="customer-feedback-post-id"]').val();
            var responseValue = $(e.target).val();

            this.submitInitialResponse($target, responsePostId, responseValue);
        }.bind(this));

        // Comment submit click
        $('[data-action="customer-feedback-submit-comment"]').on('click', function (e) {
            e.preventDefault();

            $(e.target).html('<i class="spinner spinner-dark"></i>');
            $target = $(e.target).parents('.customer-feedback-container');

            $target.find('[name="customer-feedback-comment-text"]').removeClass('invalid');

            var commentType = 'comment';
            var answerId = $target.find('[name="customer-feedback-answer-id"]').val();
            var postId = $target.find('[name="customer-feedback-post-id"]').val();
            var comment = $target.find('[name="customer-feedback-comment-text"]').val();
            var email = $target.find('[name="customer-feedback-comment-email"]').val();

            if (comment.length === 0) {
                $target.find('[name="customer-feedback-comment-text"]').addClass('invalid');
                $target.find('[name="customer-feedback-comment-text"]').after('<div class="clearfix"></div><div style="margin-top: 5px;" class="notice notice-sm danger">You need to write a comment before posting it.</div>');
                return false;
            }

            this.submitComment($target, answerId, postId, commentType, comment, email);

        }.bind(this));
    };

    Form.prototype.submitComment = function (target, answerId, postId, commentType, comment, email) {
        var data = {
            action: 'submit_comment',
            postid: postId,
            comment: comment,
            answerid: answerId,
            commenttype: commentType,
            email: email
        };

        var $target = target;

        $.post(ajaxurl, data, function (response) {
            if (response == 'true') {
                $target.find('.customer-feedback-comment').remove();
                $target.find('.customer-feedback-thanks').show();
            }
        });
    };

    /**
     * Submits the initail yes or no response
     * @param  {integer} postId Post id
     * @param  {string}  answer Yes or no
     * @return {void}
     */
    Form.prototype.submitInitialResponse = function (target, postId, answer) {
        var $target = target;

        var data = {
            action: 'submit_response',
            postid: postId,
            answer: answer
        };

        $.post(ajaxurl, data, function (response) {
            if (data.answer == 'yes' && !isNaN(parseFloat(response)) && isFinite(response)) {
                $('.customer-feedback-container').find('.customer-feedback-answers').hide();
                $('.customer-feedback-container').find('.customer-feedback-thanks').show();
            }

            if (data.answer == 'no' && !isNaN(parseFloat(response)) && isFinite(response)) {
                $target.find('[name="customer-feedback-post-id"]').after('<input type="hidden" name="customer-feedback-answer-id" value="' + response + '">');

                $target.find('.customer-feedback-answers').remove();
                $target.find('.customer-feedback-comment').show();
            }
        });
    };

    return new Form();

})(jQuery);
