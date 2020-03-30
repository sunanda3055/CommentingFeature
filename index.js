(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function(root, jQuery) {
            if (jQuery === undefined) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {

    var Comments = {

        // Instance variables
        // ==================

        $el: null,
        commentsById: {},
        dataFetched: false,
        currentSortKey: '',
        options: {},
        events: {
            // Close dropdowns
            'click': 'closeDropdowns',

            // Save comment on keydown
            'keydown [contenteditable]' : 'saveOnKeydown',

            // Listening changes in contenteditable fields (due to input event not working with IE)
            'focus [contenteditable]' : 'saveEditableContent',
            'keyup [contenteditable]' : 'checkEditableContentForChange',
            'paste [contenteditable]' : 'checkEditableContentForChange',
            'input [contenteditable]' : 'checkEditableContentForChange',
            'blur [contenteditable]' : 'checkEditableContentForChange',

            // Navigation
            'click .navigation li[data-sort-key]' : 'navigationElementClicked',
            'click .navigation li.title' : 'toggleNavigationDropdown',

            // Main comenting field
            'click .commenting-field.main .textarea': 'showMainCommentingField',
            'click .commenting-field.main .close' : 'hideMainCommentingField',

            // All commenting fields
            'click .commenting-field .textarea' : 'increaseTextareaHeight',
            'change .commenting-field .textarea' : 'increaseTextareaHeight textareaContentChanged',
            'click .commenting-field:not(.main) .close' : 'removeCommentingField',

            // Edit mode actions
            'click .commenting-field .send.enabled' : 'postComment',
            'click .commenting-field .update.enabled' : 'putComment',
            'click .commenting-field .delete.enabled' : 'deleteComment',

            // Other actions
            'click li.comment button.delete.enabled' : 'deleteComment',
            'click li.comment .hashtag' : 'hashtagClicked',
            'click li.comment .ping' : 'pingClicked',

            // Other
            'click li.comment ul.child-comments .toggle-all': 'toggleReplies',
            'click li.comment button.reply': 'replyButtonClicked',
            'click li.comment div.dropdown.actions button': 'actionButtonClicked',
            'click li.comment button.edit': 'editButtonClicked',

            //accordion
            'click li.comment div.file-title': 'accordionOpen',

            // Prevent propagating the click event into buttons under the autocomplete dropdown
            'click .dropdown.autocomplete': 'stopPropagation',
            'mousedown .dropdown.autocomplete': 'stopPropagation',
            'touchstart .dropdown.autocomplete': 'stopPropagation',
        },


        // Default options
        // ===============

        getDefaultOptions: function() {
            return {

                // User
                profilePictureURL: '',
                currentUserIsAdmin: false,
                currentUserId: null,

                // Font awesome icon overrides
                replyIconURL: '',
                uploadIconURL: '',
                noCommentsIconURL: '',

                // Strings to be formatted (for example localization)
                textareaPlaceholderText: 'Add a file',
                sendText: 'Send',
                replyText: 'Reply',
                editText: 'Edit',
                editedText: 'Edited',
                youText: 'You',
                saveText: 'Save',
                deleteText: 'Delete',
                newText: 'New',
                viewAllRepliesText: 'View all __replyCount__ replies',
                hideRepliesText: 'Hide replies',
                noCommentsText: 'No comments',
                noAttachmentsText: 'No attachments',
                attachmentDropText: 'Drop files here',
                textFormatter: function(text) {return text},

                // Functionalities
                enableReplying: true,
                enableEditing: true,
                enableUpvoting: true,
                enableDeleting: true,
                enableAttachments: false,
                enableHashtags: false,
                enablePinging: false,
                enableDeletingCommentWithReplies: false,
                enableNavigation: true,
                postCommentOnEnter: false,
                forceResponsive: false,
                readOnly: false,
                defaultNavigationSortKey: 'newest',

                // Colors
                highlightColor: '#2793e6',
                deleteButtonColor: '#C9302C',

                scrollContainer: this.$el,
                roundProfilePictures: false,
                textareaRows: 2,
                textareaRowsOnFocus: 2,
                textareaMaxRows: 5,
                maxRepliesVisible: 2,

                fieldMappings: {
                    id: 'id',
                    parent: 'parent',
                    created: 'created',
                    modified: 'modified',
                    content: 'content',
                    file: 'file',
                    // fileURL: 'file_url',
                    // fileMimeType: 'file_mime_type',
                    pings: 'pings',
                    creator: 'creator',
                    fullname: 'fullname',
                    profileURL: 'profile_url',
                    profilePictureURL: 'profile_picture_url',
                    isNew: 'is_new',
                    createdByAdmin: 'created_by_admin',
                    createdByCurrentUser: 'created_by_current_user'
                },

                searchUsers: function(term, success, error) {success([])},
                getComments: function(success, error) {success([])},
                postComment: function(commentJSON, success, error) {success(commentJSON)},
                putComment: function(commentJSON, success, error) {success(commentJSON)},
                deleteComment: function(commentJSON, success, error) {success()},
                hashtagClicked: function(hashtag) {},
                pingClicked: function(userId) {},
                refresh: function() {},
                timeFormatter: function(time) {return new Date(time).toLocaleDateString()}
            }
        },


        // Initialization
        // ==============

        init: function(options, el) {
            this.$el = $(el);
            this.$el.addClass('jquery-comments');
            this.undelegateEvents();
            this.delegateEvents();

            // Detect mobile devices
            (function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);
            if($.browser.mobile) this.$el.addClass('mobile');

            // Init options
            this.options = $.extend(true, {}, this.getDefaultOptions(), options);;

            // Read-only mode
            if(this.options.readOnly) this.$el.addClass('read-only');

            // Set initial sort key
            this.currentSortKey = this.options.defaultNavigationSortKey;

            // Create CSS declarations for highlight color
            this.createCssDeclarations();

            // Fetching data and rendering
            this.fetchDataAndRender();
        },

        delegateEvents: function() {
            this.bindEvents(false);
        },

        undelegateEvents: function() {
            this.bindEvents(true);
        },

        bindEvents: function(unbind) {
            var bindFunction = unbind ? 'off' : 'on';
            for (var key in this.events) {
                var eventName = key.split(' ')[0];
                var selector = key.split(' ').slice(1).join(' ');
                var methodNames = this.events[key].split(' ');

                for(var index in methodNames) {
                    if(methodNames.hasOwnProperty(index)) {
                        var method = this[methodNames[index]];

                        // Keep the context
                        method = $.proxy(method, this);

                        if (selector == '') {
                            this.$el[bindFunction](eventName, method);
                        } else {
                            this.$el[bindFunction](eventName, selector, method);
                        }
                    }
                }
            }
        },


        // Basic functionalities
        // =====================

        fetchDataAndRender: function () {
            var self = this;

            this.commentsById = {};

            this.$el.empty();
            this.createHTML();

            // Comments
            // ========

            this.options.getComments(function(commentsArray) {
                console.log('commentsArray----->', commentsArray);
                // Convert comments to custom data model
                var commentModels = commentsArray.map(function(commentsJSON){
                    return self.createCommentModel(commentsJSON)
                });

                $(commentModels).each(function(index, commentModel) {
                    self.addCommentToDataModel(commentModel);
                });

                // Mark data as fetched
                self.dataFetched = true;

                // Render
                self.render();
            });
        },

        createCommentModel: function(commentJSON) {
            var commentModel = this.applyInternalMappings(commentJSON);
            commentModel.childs = [];
            return commentModel;
        },

        addCommentToDataModel: function(commentModel) {
            if(!(commentModel.id in this.commentsById)) {
                this.commentsById[commentModel.id] = commentModel;

                // Update child array of the parent (append childs to the array of outer most parent)
                if(commentModel.parent) {
                    var outermostParent = this.getOutermostParent(commentModel.parent);
                    outermostParent.childs.push(commentModel.id);
                }
            }
        },

        updateCommentModel: function(commentModel) {
            $.extend(this.commentsById[commentModel.id], commentModel);
        },

        render: function() {
            var self = this;

            // Prevent re-rendering if data hasn't been fetched
            if(!this.dataFetched) return;

            // Show active container
            this.showActiveContainer();

            // Create comments
            this.createComments();

            // Remove spinner
            this.$el.find('> .spinner').remove();

            this.options.refresh();
        },

        showActiveContainer: function() {
            var activeNavigationEl = this.$el.find('.navigation li[data-container-name].active');
            var containerName = activeNavigationEl.data('container-name');
            var containerEl = this.$el.find('[data-container="' + containerName + '"]');
            containerEl.siblings('[data-container]').hide();
            containerEl.show();
        },

        createComments: function() {
            var self = this;

            // Create the list element before appending to DOM in order to reach better performance
            this.$el.find('#comment-list').remove();
            var commentList = $('<ul/>', {
                id: 'comment-list',
                'class': 'main'
            });

            // Divide commments into main level comments and replies
            var mainLevelComments = [];
            var replies = [];
            $(this.getComments()).each(function(index, commentModel) {
                if(commentModel.parent == null) {
                    mainLevelComments.push(commentModel);
                } else {
                    replies.push(commentModel);
                }
            });

            $(mainLevelComments).each(function(index, commentModel) {
                self.addComment(commentModel, commentList);
            });

            $(replies).each(function(index, commentModel) {
                self.addComment(commentModel, commentList);
            });
            // Appned list to DOM
            this.$el.find('[data-container="comments"]').prepend(commentList);
        },

        addComment: function(commentModel, commentList) {
            commentList = commentList || this.$el.find('#comment-list');
            var commentEl = this.createCommentElement(commentModel);
            // Case: reply
            if(commentModel.parent) {
                var directParentEl = commentList.find('.comment[data-id="'+commentModel.parent+'"]');

                // Re-render action bar of direct parent element
                this.reRenderCommentActionBar(commentModel.parent);

                // Force replies into one level only
                var outerMostParent = directParentEl.parents('.comment').last();
                if(outerMostParent.length == 0) outerMostParent = directParentEl;

                // Append element to DOM
                var childCommentsEl = outerMostParent.find('.child-comments');
                var commentingField = childCommentsEl.find('.commenting-field');
                if(commentingField.length) {
                    commentingField.before(commentEl)
                } else {
                    childCommentsEl.append(commentEl);
                }

                // Update toggle all -button
                this.updateToggleAllButton(outerMostParent);

                // Case: main level comment
            } else {
                if(this.currentSortKey == 'newest') {
                    commentList.prepend(commentEl);
                } else {
                    commentList.append(commentEl);
                }
            }
        },

        removeComment: function(commentId) {
            var self = this;
            var commentModel = this.commentsById[commentId];

            // Remove child comments recursively
            var childComments = this.getChildComments(commentModel.id);
            $(childComments).each(function(index, childComment) {
                self.removeComment(childComment.id);
            });

            // Update the child array of outermost parent
            if(commentModel.parent) {
                var outermostParent = this.getOutermostParent(commentModel.parent);
                var indexToRemove = outermostParent.childs.indexOf(commentModel.id);
                outermostParent.childs.splice(indexToRemove, 1);
            }

            // Remove the comment from data model
            delete this.commentsById[commentId];

            var commentElements = this.$el.find('li.comment[data-id="'+commentId+'"]');
            var parentEl = commentElements.parents('li.comment').last();

            // Remove the element
            commentElements.remove();

            // Update the toggle all button
            this.updateToggleAllButton(parentEl);
        },

        updateToggleAllButton: function(parentEl) {
            // Don't hide replies if maxRepliesVisible is null or undefined
            if (this.options.maxRepliesVisible == null) return;

            var childCommentsEl = parentEl.find('.child-comments');
            var childComments = childCommentsEl.find('.comment').not('.hidden');
            var toggleAllButton = childCommentsEl.find('li.toggle-all');
            childComments.removeClass('togglable-reply');

            // Select replies to be hidden
            if (this.options.maxRepliesVisible === 0) {
                var togglableReplies = childComments;
            } else {
                var togglableReplies = childComments.slice(0, -this.options.maxRepliesVisible);
            }

            // Add identifying class for hidden replies so they can be toggled
            togglableReplies.addClass('togglable-reply');

            // Show all replies if replies are expanded
            if(toggleAllButton.find('span.text').text() === this.options.textFormatter(this.options.hideRepliesText)) {
                togglableReplies.addClass('visible');
            }

            // Make sure that toggle all button is present
            if(childComments.length > this.options.maxRepliesVisible) {

                // Append button to toggle all replies if necessary
                if(!toggleAllButton.length) {

                    toggleAllButton = $('<li/>', {
                        'class': 'toggle-all highlight-font-bold'
                    });
                    var toggleAllButtonText = $('<span/>', {
                        'class': 'text'
                    });
                    var caret = $('<span/>', {
                        'class': 'caret'
                    });

                    // Append toggle button to DOM
                    toggleAllButton.append(toggleAllButtonText).append(caret);
                    childCommentsEl.prepend(toggleAllButton);
                }

                // Update the text of toggle all -button
                this.setToggleAllButtonText(toggleAllButton, false);

                // Make sure that toggle all button is not present
            } else {
                toggleAllButton.remove();
            }
        },

        updateToggleAllButtons: function() {
            var self = this;
            var commentList = this.$el.find('#comment-list');

            // Fold comments, find first level children and update toggle buttons
            commentList.find('.comment').removeClass('visible');
            commentList.children('.comment').each(function(index, el) {
                self.updateToggleAllButton($(el));
            });
        },

        forceResponsive: function() {
            this.$el.addClass('responsive');
        },

        // Event handlers
        // ==============

        closeDropdowns: function() {
            this.$el.find('.dropdown').hide();
        },

        saveOnKeydown: function(ev) {
            // Save comment on cmd/ctrl + enter
            if(ev.keyCode == 13) {
                var metaKey = ev.metaKey || ev.ctrlKey;
                if(this.options.postCommentOnEnter || metaKey) {
                    var el = $(ev.currentTarget);
                    el.siblings('.control-row').find('.save').trigger('click');
                    ev.stopPropagation();
                    ev.preventDefault();
                }
            }
        },

        saveEditableContent: function(ev) {
            var el = $(ev.currentTarget);
            el.data('before', el.html());
        },

        checkEditableContentForChange: function(ev) {
            var el = $(ev.currentTarget);

            // Fix jquery-textcomplete on IE, empty text nodes will break up the autocomplete feature
            $(el[0].childNodes).each(function() {
                if(this.nodeType == Node.TEXT_NODE && this.length == 0 && this.removeNode) this.removeNode();
            });

            if (el.data('before') != el.html()) {
                el.data('before', el.html());
                el.trigger('change');
            }
        },

        navigationElementClicked: function(ev) {
            var navigationEl = $(ev.currentTarget);
            var sortKey = navigationEl.data().sortKey;

            // Sort the comments if necessary
            if(sortKey) {
                this.sortAndReArrangeComments(sortKey);
            }

            // Save the current sort key
            this.currentSortKey = sortKey;
            this.showActiveSort();
        },

        toggleNavigationDropdown: function(ev) {
            // Prevent closing immediately
            ev.stopPropagation();

            var dropdown = $(ev.currentTarget).find('~ .dropdown');
            dropdown.toggle();
        },

        showMainCommentingField: function(ev) {
            var mainTextarea = $(ev.currentTarget);
            mainTextarea.siblings('.control-row').show();
            mainTextarea.parent().find('.close').show();
            mainTextarea.focus();
        },

        hideMainCommentingField: function(ev) {
            var closeButton = $(ev.currentTarget);
            var mainTextarea = this.$el.find('.commenting-field.main .textarea');
            var mainControlRow = this.$el.find('.commenting-field.main .control-row');

            this.clearTextarea(mainTextarea);
            this.adjustTextareaHeight(mainTextarea, false);

            mainControlRow.hide();
            closeButton.hide();
            mainTextarea.blur();
        },

        increaseTextareaHeight: function(ev) {
            var textarea = $(ev.currentTarget);
            this.adjustTextareaHeight(textarea, true);
        },

        textareaContentChanged: function(ev) {
            var textarea = $(ev.currentTarget);
            var saveButton = textarea.siblings('.control-row').find('.save');

            // Update parent id if reply-to tag was removed
            if(!textarea.find('.reply-to.tag').length) {
                var commentId = textarea.attr('data-comment');

                // Case: editing comment
                if(commentId) {
                    var parentComments = textarea.parents('li.comment');
                    if(parentComments.length > 1) {
                        var parentId = parentComments.last().data('id');
                        textarea.attr('data-parent', parentId);
                    }

                    // Case: new comment
                } else {
                    var parentId = textarea.parents('li.comment').last().data('id');
                    textarea.attr('data-parent', parentId);
                }
            }

            // Move close button if scrollbar is visible
            var commentingField = textarea.parents('.commenting-field').first();
            if(textarea[0].scrollHeight > textarea.outerHeight()) {
                commentingField.addClass('commenting-field-scrollable');
            } else {
                commentingField.removeClass('commenting-field-scrollable');
            }

            // Check if content or parent has changed if editing
            var contentOrParentChangedIfEditing = true;
            var content = this.getTextareaContent(textarea, true);
            if(commentModel = this.commentsById[textarea.attr('data-comment')]) {
                var contentChanged = content != commentModel.content;
                var parentFromModel;
                if(commentModel.parent) {
                    parentFromModel = commentModel.parent.toString();
                }
                var parentChanged = textarea.attr('data-parent') != parentFromModel;
                contentOrParentChangedIfEditing = contentChanged || parentChanged;
            }

            // Check whether save button needs to be enabled
            if(content.length && contentOrParentChangedIfEditing) {
                saveButton.addClass('enabled');
            } else {
                saveButton.removeClass('enabled');
            }
        },

        removeCommentingField: function(ev) {
            var closeButton = $(ev.currentTarget);

            // Remove edit class from comment if user was editing the comment
            var textarea = closeButton.siblings('.textarea');
            if(textarea.attr('data-comment')) {
                closeButton.parents('li.comment').first().removeClass('edit');
            }

            // Remove the field
            var commentingField = closeButton.parents('.commenting-field').first();
            commentingField.remove();
        },

        postComment: function(ev) {
            var self = this;
            var sendButton = $(ev.currentTarget);
            var commentingField = sendButton.parents('.commenting-field').first();
            var textarea = commentingField.find('.textarea');

            // Disable send button while request is pending
            sendButton.removeClass('enabled');

            // Create comment JSON
            var commentJSON = this.createCommentJSON(textarea);

            // Reverse mapping
            commentJSON = this.applyExternalMappings(commentJSON);

            var success = function(commentJSON) {
                self.createComment(commentJSON);
                commentingField.find('.close').trigger('click');
            };

            var error = function() {
                sendButton.addClass('enabled');
            };

            this.options.postComment(commentJSON, success, error);
        },

        createComment: function(commentJSON) {
            var commentModel = this.createCommentModel(commentJSON);
            this.addCommentToDataModel(commentModel);
            this.addComment(commentModel);
        },

        putComment: function(ev) {
            var self = this;
            var saveButton = $(ev.currentTarget);
            var commentingField = saveButton.parents('.commenting-field').first();
            var textarea = commentingField.find('.textarea');

            // Disable send button while request is pending
            saveButton.removeClass('enabled');

            // Use a clone of the existing model and update the model after succesfull update
            var commentJSON =  $.extend({}, this.commentsById[textarea.attr('data-comment')]);
            $.extend(commentJSON, {
                parent: textarea.attr('data-parent') || null,
                content: this.getTextareaContent(textarea),
                pings: this.getPings(textarea),
                modified: new Date().getTime()
            });

            // Reverse mapping
            commentJSON = this.applyExternalMappings(commentJSON);

            var success = function(commentJSON) {
                // The outermost parent can not be changed by editing the comment so the childs array
                // of parent does not require an update

                var commentModel = self.createCommentModel(commentJSON);

                // Delete childs array from new comment model since it doesn't need an update
                delete commentModel['childs'];
                self.updateCommentModel(commentModel);

                // Close the editing field
                commentingField.find('.close').trigger('click');

                // Re-render the comment
                self.reRenderComment(commentModel.id);
            };

            var error = function() {
                saveButton.addClass('enabled');
            };

            this.options.putComment(commentJSON, success, error);
        },

        deleteComment: function(ev) {
            var self = this;
            var deleteButton = $(ev.currentTarget);
            var commentEl = deleteButton.parents('.comment').first();
            var commentJSON =  $.extend({}, this.commentsById[commentEl.attr('data-id')]);
            var commentId = commentJSON.id;
            var parentId = commentJSON.parent;

            // Disable send button while request is pending
            deleteButton.removeClass('enabled');

            // Reverse mapping
            commentJSON = this.applyExternalMappings(commentJSON);

            var success = function() {
                self.removeComment(commentId);
                if(parentId) self.reRenderCommentActionBar(parentId);
            };

            var error = function() {
                deleteButton.addClass('enabled');
            };

            this.options.deleteComment(commentJSON, success, error);
        },

        hashtagClicked: function(ev) {
            var el = $(ev.currentTarget);
            var value = el.attr('data-value');
            this.options.hashtagClicked(value);
        },

        pingClicked: function(ev) {
            var el = $(ev.currentTarget);
            var value = el.attr('data-value');
            this.options.pingClicked(value);
        },

        toggleReplies: function(ev) {
            var el = $(ev.currentTarget);
            el.siblings('.togglable-reply').toggleClass('visible');
            this.setToggleAllButtonText(el, true);
        },

        actionButtonClicked: function(ev) {
            //dropdown-menu
            var actionButton = $(ev.currentTarget);
            var currentEl = actionButton.parents('.dropdown.actions').find('.dropdown-menu');
            currentEl.toggle();
        },

        replyButtonClicked: function(ev) {
            var replyButton = $(ev.currentTarget);
            var outermostParent = replyButton.parents('li.comment').last();
            var parentId = replyButton.parents('.comment').first().data().id;


            // Remove existing field
            var replyField = outermostParent.find('.child-comments > .commenting-field');
            if(replyField.length) replyField.remove();
            var previousParentId = replyField.find('.textarea').attr('data-parent');

            // Create the reply field (do not re-create)
            if(previousParentId != parentId) {
                replyField = this.createCommentingFieldElement(parentId);
                outermostParent.find('.child-comments').append(replyField);

                // Move cursor to end
                var textarea = replyField.find('.textarea');
                this.moveCursorToEnd(textarea)

                // Make sure the reply field will be displayed
                var scrollTop = this.options.scrollContainer.scrollTop();
                var endOfReply = scrollTop + replyField.position().top + replyField.outerHeight();
                var endOfScrollable = scrollTop + this.options.scrollContainer.outerHeight();
                if(endOfReply > endOfScrollable) {
                    var newScrollTop = scrollTop + (endOfReply - endOfScrollable);
                    this.options.scrollContainer.scrollTop(newScrollTop);
                }
            }
        },

        editButtonClicked: function(ev) {
            var editButton = $(ev.currentTarget);
            var commentEl = editButton.parents('li.comment').first();
            var commentModel = commentEl.data().model;
            commentEl.addClass('edit');

            // Create the editing field
            var editField = this.createCommentingFieldElement(commentModel.parent, commentModel.id);
            commentEl.find('.comment-wrapper').first().append(editField);

            // Append original content
            var textarea = editField.find('.textarea');
            textarea.attr('data-comment', commentModel.id);

            // Escaping HTML
            textarea.append(this.getFormattedCommentContent(commentModel, true));

            // Move cursor to end
            this.moveCursorToEnd(textarea);
        },

        accordionOpen: function(ev) {
            var fileClicked = $(ev.currentTarget);
            var currentEl = fileClicked.parents('li.comment').find('.issue-container');
            currentEl.toggleClass('active-file');
        },

        stopPropagation: function(ev) {
            ev.stopPropagation();
        },


        // HTML elements
        // =============

        createHTML: function() {
            var self = this;

            // Commenting field
            var mainCommentingField = this.createMainCommentingFieldElement();
            this.$el.append(mainCommentingField);

            // Hide control row and close button
            var mainControlRow = mainCommentingField.find('.control-row');
            mainControlRow.hide();
            mainCommentingField.find('.close').hide();

            // Comments container
            var commentsContainer = $('<div/>', {
                'class': 'data-container',
                'data-container': 'comments'
            });
            this.$el.append(commentsContainer);

            // "No comments" placeholder
            var noComments = $('<div/>', {
                'class': 'no-comments no-data',
                text: this.options.textFormatter(this.options.noCommentsText)
            });
            var noCommentsIcon = $('<i/>', {
                'class': 'fa fa-comments fa-2x'
            });
            if(this.options.noCommentsIconURL.length) {
                noCommentsIcon.css('background-image', 'url("'+this.options.noCommentsIconURL+'")');
                noCommentsIcon.addClass('image');
            }
            noComments.prepend($('<br/>')).prepend(noCommentsIcon);
            commentsContainer.append(noComments);
        },

        createProfilePictureElement: function(src, userId) {
            // if(src) {
            //     var profilePicture = $('<div/>').css({
            //         'background-image': 'url(' + src + ')'
            //     });
            // } else
                {
                var profilePicture = $('<i/>', {
                    'class': 'fa fa-user'
                });
            }
            profilePicture.addClass('profile-picture');
            profilePicture.attr('data-user-id', userId);
            if(this.options.roundProfilePictures) profilePicture.addClass('round');
            return profilePicture;
        },

        createMainCommentingFieldElement: function() {
            return this.createCommentingFieldElement(undefined, undefined, true);
        },

        createCommentingFieldElement: function(parentId, existingCommentId, isMain) {
            var self = this;

            // Commenting field
            var commentingField = $('<div/>', {
                'class': 'commenting-field'
            });
            if(isMain) commentingField.addClass('main');

            // Comment was modified, use existing data
            if(existingCommentId) {
                var profilePictureURL = this.commentsById[existingCommentId].profilePictureURL;
                var userId = this.commentsById[existingCommentId].creator;

                // New comment was created
            } else {
                var profilePictureURL = this.options.profilePictureURL;
                var userId = this.options.creator;
            }

            var profilePicture = this.createProfilePictureElement(profilePictureURL, userId);

            // New comment
            var textareaWrapper = $('<div/>', {
                'class': 'textarea-wrapper'
            });

            // Control row
            var controlRow = $('<div/>', {
                'class': 'control-row'
            });

            // Textarea
            var textarea = $('<div/>', {
                'class': 'textarea',
                'data-placeholder': this.options.textFormatter(this.options.textareaPlaceholderText),
                contenteditable: true
            });

            // Setting the initial height for the textarea
            this.adjustTextareaHeight(textarea, false);

            // Close button
            var closeButton = $('<span/>', {
                'class': 'close inline-button'
            }).append($('<span class="left"/>')).append($('<span class="right"/>'));

            // Save button text
            if(existingCommentId) {
                var saveButtonText = this.options.textFormatter(this.options.saveText);

                // Delete button
                var deleteButton = $('<span/>', {
                    'class': 'delete',
                    text: this.options.textFormatter(this.options.deleteText)
                }).css('background-color', this.options.deleteButtonColor);
                controlRow.append(deleteButton);

                // Enable the delete button only if the user is allowed to delete
                if(this.isAllowedToDelete(existingCommentId)) deleteButton.addClass('enabled')

            } else {
                var saveButtonText = this.options.textFormatter(this.options.sendText);
            }

            // Save button
            var saveButtonClass = existingCommentId ? 'update' : 'send';
            var saveButton = $('<span/>', {
                'class': saveButtonClass + ' save highlight-background',
                text: saveButtonText
            });

            // Populate the element
            controlRow.prepend(saveButton);
            textareaWrapper.append(closeButton).append(textarea).append(controlRow);
            commentingField.append(profilePicture).append(textareaWrapper);


            if(parentId) {

                // Set the parent id to the field if necessary
                textarea.attr('data-parent', parentId);

                // Append reply-to tag if necessary
                var parentModel = this.commentsById[parentId];
                if(parentModel.parent) {
                    textarea.html('&nbsp;');    // Needed to set the cursor to correct place

                    // Creating the reply-to tag
                    var replyToName = '@' + parentModel.fullname;
                    var replyToTag = this.createTagElement(replyToName, 'reply-to', parentModel.creator, {
                        'data-user-id': parentModel.creator
                    });
                    textarea.prepend(replyToTag);
                }
            }

            // Pinging users
            if(this.options.enablePinging) {
                textarea.textcomplete([{
                    match: /(^|\s)@([^@]*)$/i,
                    index: 2,
                    search: function (term, callback) {
                        term = self.normalizeSpaces(term);

                        // Return empty array on error
                        var error = function() {
                            callback([]);
                        };

                        self.options.searchUsers(term, callback, error);
                    },
                    template: function(user) {
                        var wrapper = $('<div/>');

                        var profilePictureEl = self.createProfilePictureElement(user.profile_picture_url);

                        var detailsEl = $('<div/>', {
                            'class': 'details',
                        });
                        var nameEl = $('<div/>', {
                            'class': 'name',
                        }).html(user.fullname);

                        var emailEl = $('<div/>', {
                            'class': 'email',
                        }).html(user.email);

                        if (user.email) {
                            detailsEl.append(nameEl).append(emailEl);
                        } else {
                            detailsEl.addClass('no-email')
                            detailsEl.append(nameEl)
                        }

                        wrapper.append(profilePictureEl).append(detailsEl);
                        return wrapper.html();
                    },
                    replace: function (user) {
                        var tag = self.createTagElement('@' + user.fullname, 'ping', user.id, {
                            'data-user-id': user.id
                        });
                        return ' ' + tag[0].outerHTML + ' ';
                    },
                }], {
                    appendTo: '.jquery-comments',
                    dropdownClassName: 'dropdown autocomplete',
                    maxCount: 5,
                    rightEdgeOffset: 0,
                    debounce: 250
                });
            }

            return commentingField;
        },

        createCommentElement: function(commentModel) {
            // Comment container element
            var sibElement = $('<div/>', {
                'class': 'file-title'
            });
            var addComment = $('<button/>', {
                'class': 'action reply add-comment',
                'type': 'button',
                text: '+'
            });
            var wrapperDiv = $('<div/>', {
                'class': 'issue-container'
            });
            var commentEl = $('<li/>', {
                'data-id': commentModel.id,
                'class': 'comment'
            }).data('model', commentModel);

            if(commentModel.createdByCurrentUser) commentEl.addClass('by-current-user');
            if(commentModel.createdByAdmin) commentEl.addClass('by-admin');

            // Child comments
            var childComments = $('<ul/>', {
                'class': 'child-comments'
            });

            // Comment wrapper
            var commentWrapper = this.createCommentWrapperElement(commentModel);

            if(commentModel.parent == null) {
                sibElement.append(addComment);
                sibElement.append(commentWrapper);
                commentEl.append(sibElement);
                // wrapperDiv.append(commentWrapper);
                wrapperDiv.append(childComments);
                commentEl.append(wrapperDiv);
            } else {
                commentEl.append(commentWrapper);
            }
            return commentEl;
        },

        createCommentWrapperElement: function(commentModel) {
            var commentWrapper = $('<div/>', {
                'class': 'comment-wrapper'
            });

            // Profile picture
            var profilePicture = this.createProfilePictureElement(commentModel.profilePictureURL, commentModel.creator);

            // Time
            var time = $('<time/>', {
                text: this.options.timeFormatter(commentModel.created),
                'data-original': commentModel.created
            });

            // Name element
            var name = $('<span/>', {
                'data-user-id': commentModel.creator,
                'text': commentModel.createdByCurrentUser ? this.options.textFormatter(this.options.youText) : commentModel.fullname
            });

            if(commentModel.profileURL) {
                name = $('<a/>', {
                    'href': commentModel.profileURL,
                    'html': name
                });
            }

            var nameEl = $('<div/>', {
                'class': 'name',
                'html': name
            });

            //comment body container
            var contentContainer = $('<div/>', {
                'class': 'comment-content'
            });

            //wrapper for time
            var divWrap = $('<div/>');

            // Highlight admin names
            if(commentModel.createdByAdmin) nameEl.addClass('highlight-font-bold');

            // Show reply-to name if parent of parent exists
            if(commentModel.parent) {
                var parent = this.commentsById[commentModel.parent];
                if(parent.parent) {
                    var replyTo = $('<span/>', {
                        'class': 'reply-to',
                        'text': parent.fullname,
                        'data-user-id': parent.creator
                    });

                    // reply icon
                    var replyIcon = $('<i/>', {
                        'class': 'fa fa-share'
                    });
                    if(this.options.replyIconURL.length) {
                        replyIcon.css('background-image', 'url("'+this.options.replyIconURL+'")');
                        replyIcon.addClass('image');
                    }

                    replyTo.prepend(replyIcon);
                    nameEl.append(replyTo);
                }
            }

            // Wrapper
            var wrapper = $('<div/>', {
                'class': 'wrapper'
            });

            // Content
            var content = $('<div/>', {
                'class': 'content'
            });
            content.html(this.getFormattedCommentContent(commentModel));

            // Edited timestamp
            if(commentModel.modified && commentModel.modified != commentModel.created) {
                var editedTime = this.options.timeFormatter(commentModel.modified);
                var edited = $('<time/>', {
                    'class': 'edited',
                    text: this.options.textFormatter(this.options.editedText) + ' ' + editedTime,
                    'data-original': commentModel.modified
                });
                content.append(edited);
            }

            //contains action button in dropdown
            var actionMenu = $('<div class="dropdown actions">\n' +
                '        <button\n' +
                '          class="btn"\n' +
                '          type="button"\n' +
                '          id="dropdownMenuLink"\n' +
                '          data-toggle="dropdown"\n' +
                '          aria-haspopup="true"\n' +
                '          aria-expanded="false">\n' +
                '          <span class="three-dots">.</span><span class="three-dots">.</span><span class="three-dots">.</span>' +
                '        </button>\n' +
                '</div>');

            var actions = $('<div class="dropdown-menu" aria-labelledby="dropdownMenuLink">');
            actionMenu.append(actions);

            // Reply
            var reply = $('<button/>', {
                'class': 'action reply dropdown-item',
                'type': 'button',
                text: this.options.textFormatter(this.options.replyText)
            });

            // Append buttons for actions that are enabled
            if(this.options.enableReplying) actions.append(reply);

            if(commentModel.createdByCurrentUser || this.options.currentUserIsAdmin) {
                if(this.options.enableEditing) {
                    var editButton = $('<button/>', {
                        'class': 'action edit dropdown-item',
                        text: this.options.textFormatter(this.options.editText)
                    });
                    actions.append(editButton);
                }
            }
            nameEl.append(divWrap.append(time));
            wrapper.append(content);
            contentContainer.append(nameEl).append(actionMenu).append(wrapper);
            commentWrapper.append(profilePicture).append(contentContainer);
            if(commentModel.parent == null) {
                return content;
            } else
                return commentWrapper;
        },

        createTagElement: function(text, extraClasses, value, extraAttributes) {
            var tagEl = $('<input/>', {
                'class': 'tag',
                'type': 'button',
                'data-role': 'none',
            });
            if(extraClasses) tagEl.addClass(extraClasses);
            tagEl.val(text);
            tagEl.attr('data-value', value);
            if (extraAttributes) tagEl.attr(extraAttributes);
            return tagEl;
        },

        reRenderComment: function(id) {
            var commentModel = this.commentsById[id];
            var commentElements = this.$el.find('li.comment[data-id="'+commentModel.id+'"]');

            var self = this;
            commentElements.each(function(index, commentEl) {
                var commentWrapper = self.createCommentWrapperElement(commentModel);
                $(commentEl).find('.comment-wrapper').first().replaceWith(commentWrapper);
            });
        },

        reRenderCommentActionBar: function(id) {
            var commentModel = this.commentsById[id];
            var commentElements = this.$el.find('li.comment[data-id="'+commentModel.id+'"]');

            var self = this;
            commentElements.each(function(index, commentEl) {
                var commentWrapper = self.createCommentWrapperElement(commentModel);
                $(commentEl).find('.actions').first().replaceWith(commentWrapper.find('.actions'));
            });
        },

        // Styling
        // =======

        createCssDeclarations: function() {

            // Remove previous css-declarations
            $('head style.jquery-comments-css').remove();

            // Navigation underline
            this.createCss('.jquery-comments ul.navigation li.active:after {background: '
                + this.options.highlightColor  + ' !important;',
                +'}');

            // Dropdown active element
            this.createCss('.jquery-comments ul.navigation ul.dropdown li.active {background: '
                + this.options.highlightColor  + ' !important;',
                +'}');

            // Background highlight
            this.createCss('.jquery-comments .highlight-background {background: '
                + this.options.highlightColor  + ' !important;',
                +'}');

            // Font highlight
            this.createCss('.jquery-comments .highlight-font {color: '
                + this.options.highlightColor + ' !important;'
                +'}');
            this.createCss('.jquery-comments .highlight-font-bold {color: '
                + this.options.highlightColor + ' !important;'
                + 'font-weight: bold;'
                +'}');
        },

        createCss: function(css) {
            var styleEl = $('<style/>', {
                type: 'text/css',
                'class': 'jquery-comments-css',
                text: css
            });
            $('head').append(styleEl);
        },


        // Utilities
        // =========

        getComments: function() {
            var self = this;
            return Object.keys(this.commentsById).map(function(id){return self.commentsById[id]});
        },

        getChildComments: function(parentId) {
            return this.getComments().filter(function(comment){return comment.parent == parentId});
        },

        getOutermostParent: function(directParentId) {
            var parentId = directParentId;
            do {
                var parentComment = this.commentsById[parentId];
                parentId = parentComment.parent;
            } while(parentComment.parent != null);
            return parentComment;
        },

        createCommentJSON: function(textarea) {
            var time = new Date().toISOString();
            var commentJSON = {
                id: 'c' +  (this.getComments().length + 1),   // Temporary id
                parent: textarea.attr('data-parent') || null,
                created: time,
                modified: time,
                content: this.getTextareaContent(textarea),
                pings: this.getPings(textarea),
                fullname: this.options.textFormatter(this.options.youText),
                profilePictureURL: this.options.profilePictureURL,
                createdByCurrentUser: true
            };
            return commentJSON;
        },

        isAllowedToDelete: function(commentId) {
            if(this.options.enableDeleting) {
                var isAllowedToDelete = true;
                if(!this.options.enableDeletingCommentWithReplies) {
                    $(this.getComments()).each(function(index, comment) {
                        if(comment.parent == commentId) isAllowedToDelete = false;
                    });
                }
                return isAllowedToDelete;
            }
            return false;
        },

        setToggleAllButtonText: function(toggleAllButton, toggle) {
            var self = this;
            var textContainer = toggleAllButton.find('span.text');
            var caret = toggleAllButton.find('.caret');

            var showExpandingText = function() {
                var text = self.options.textFormatter(self.options.viewAllRepliesText);
                var replyCount = toggleAllButton.siblings('.comment').not('.hidden').length;
                text = text.replace('__replyCount__', replyCount);
                textContainer.text(text);
            };

            var hideRepliesText = this.options.textFormatter(this.options.hideRepliesText);

            if(toggle) {

                // Toggle text
                if(textContainer.text() == hideRepliesText) {
                    showExpandingText();
                } else {
                    textContainer.text(hideRepliesText);
                }
                // Toggle direction of the caret
                caret.toggleClass('up');

            } else {

                // Update text if necessary
                if(textContainer.text() != hideRepliesText) {
                    showExpandingText();
                }
            }
        },

        adjustTextareaHeight: function(textarea, focus) {
            var textareaBaseHeight = 2.2;
            var lineHeight = 1.45;

            var setRows = function(rows) {
                var height = textareaBaseHeight + (rows - 1) * lineHeight;
                textarea.css('height', height + 'em');
            };

            textarea = $(textarea);
            var rowCount = focus == true ? this.options.textareaRowsOnFocus : this.options.textareaRows;
            do {
                setRows(rowCount);
                rowCount++;
                var isAreaScrollable = textarea[0].scrollHeight > textarea.outerHeight();
                var maxRowsUsed = this.options.textareaMaxRows == false ?
                    false : rowCount > this.options.textareaMaxRows;
            } while(isAreaScrollable && !maxRowsUsed);
        },

        clearTextarea: function(textarea) {
            textarea.empty().trigger('input');
        },

        getTextareaContent: function(textarea, humanReadable) {
            var textareaClone = textarea.clone();

            // Remove reply-to tag
            textareaClone.find('.reply-to.tag').remove();

            // Replace tags with text values
            textareaClone.find('.tag.hashtag').replaceWith(function(){
                return humanReadable ? $(this).val() : '#' + $(this).attr('data-value');
            });
            textareaClone.find('.tag.ping').replaceWith(function(){
                return humanReadable ? $(this).val() : '@' + $(this).attr('data-value');
            });

            var ce = $('<pre/>').html(textareaClone.html());
            ce.find('div, p, br').replaceWith(function() { return '\n' + this.innerHTML; });

            // Trim leading spaces
            var text = ce.text().replace(/^\s+/g, '');

            // Normalize spaces
            var text = this.normalizeSpaces(text);
            return text;
        },

        getFormattedCommentContent: function(commentModel, replaceNewLines) {
            var html = this.escape(commentModel.content);
            html = this.linkify(html);
            html = this.highlightTags(commentModel, html);
            if(replaceNewLines) html = html.replace(/(?:\n)/g, '<br>');
            return html;
        },

        // Return pings in format
        //  {
        //      id1: userFullname1,
        //      id2: userFullname2,
        //      ...
        //  }
        getPings: function(textarea) {
            var pings = {};
            textarea.find('.ping').each(function(index, el){
                var id = parseInt($(el).attr('data-value'));
                var value = $(el).val();
                pings[id] = value.slice(1);
            });
            return pings;
        },

        moveCursorToEnd: function(el) {
            el = $(el)[0];

            // Trigger input to adjust size
            $(el).trigger('input');

            // Scroll to bottom
            $(el).scrollTop(el.scrollHeight);

            // Move cursor to end
            if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != 'undefined') {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }

            // Focus
            el.focus();
        },

        escape: function(inputText) {
            return $('<pre/>').text(this.normalizeSpaces(inputText)).html();
        },

        normalizeSpaces: function(inputText) {
            return inputText.replace(new RegExp('\u00a0', 'g'), ' ');   // Convert non-breaking spaces to reguar spaces
        },

        after: function(times, func) {
            var self = this;
            return function() {
                times--;
                if (times == 0) {
                    return func.apply(self, arguments);
                }
            }
        },

        highlightTags: function(commentModel, html) {
            if(this.options.enableHashtags) html = this.highlightHashtags(commentModel, html);
            if(this.options.enablePinging) html = this.highlightPings(commentModel, html);
            return html;
        },

        highlightHashtags: function(commentModel, html) {
            var self = this;

            if(html.indexOf('#') != -1) {

                var __createTag = function(tag) {
                    var tag = self.createTagElement('#' + tag, 'hashtag', tag);
                    return tag[0].outerHTML;
                };

                var regex = /(^|\s)#([a-zäöüß\d-_]+)/gim;
                html = html.replace(regex, function($0, $1, $2){
                    return $1 + __createTag($2);
                });
            }
            return html;
        },

        highlightPings: function(commentModel, html) {
            var self = this;

            if(html.indexOf('@') != -1) {

                var __createTag = function(pingText, userId) {
                    var tag = self.createTagElement(pingText, 'ping', userId, {
                        'data-user-id': userId
                    });
                    return tag[0].outerHTML;
                };

                $(Object.keys(commentModel.pings)).each(function(index, userId) {
                    var fullname = commentModel.pings[userId];
                    var pingText = '@' + fullname;
                    html = html.replace(new RegExp(pingText, 'g'), __createTag(pingText, userId));
                });
            }
            return html;
        },

        linkify: function(inputText) {
            var replacedText, replacePattern1, replacePattern2, replacePattern3;

            // URLs starting with http://, https://, ftp:// or file://
            replacePattern1 = /(\b(https?|ftp|file):\/\/[-A-ZÄÖÅ0-9+&@#\/%?=~_|!:,.;]*[-A-ZÄÖÅ0-9+&@#\/%=~_|])/gim;
            replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

            // URLs starting with "www." (without // before it, or it would re-link the ones done above).
            replacePattern2 = /(^|[^\/f])(www\.[-A-ZÄÖÅ0-9+&@#\/%?=~_|!:,.;]*[-A-ZÄÖÅ0-9+&@#\/%=~_|])/gim;
            replacedText = replacedText.replace(replacePattern2, '$1<a href="https://$2" target="_blank">$2</a>');

            // Change email addresses to mailto: links.
            replacePattern3 = /(([A-ZÄÖÅ0-9\-\_\.])+@[A-ZÄÖÅ\_]+?(\.[A-ZÄÖÅ]{2,6})+)/gim;
            replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

            // If there are hrefs in the original text, let's split
            // the text up and only work on the parts that don't have urls yet.
            var count = inputText.match(/<a href/g) || [];

            if (count.length > 0) {
                // Keep delimiter when splitting
                var splitInput = inputText.split(/(<\/a>)/g);
                for (var i = 0 ; i < splitInput.length ; i++) {
                    if (splitInput[i].match(/<a href/g) == null) {
                        splitInput[i] = splitInput[i]
                            .replace(replacePattern1, '<a href="$1" target="_blank">$1</a>')
                            .replace(replacePattern2, '$1<a href="https://$2" target="_blank">$2</a>')
                            .replace(replacePattern3, '<a href="mailto:$1">$1</a>');
                    }
                }
                var combinedReplacedText = splitInput.join('');
                return combinedReplacedText;
            } else {
                return replacedText;
            }
        },

        waitUntil: function(condition, callback) {
            var self = this;

            if(condition()) {
                callback();
            } else {
                setTimeout(function() {
                    self.waitUntil(condition, callback);
                }, 100);
            }
        },

        applyInternalMappings: function(commentJSON) {
            // Inverting field mappings
            var invertedMappings = {};
            var mappings = this.options.fieldMappings;
            for (var prop in mappings) {
                if(mappings.hasOwnProperty(prop)) {
                    invertedMappings[mappings[prop]] = prop;
                }
            }

            return this.applyMappings(invertedMappings, commentJSON);
        },

        applyExternalMappings: function(commentJSON) {
            var mappings = this.options.fieldMappings;
            return this.applyMappings(mappings, commentJSON);
        },

        applyMappings: function(mappings, commentJSON) {
            var result = {};

            for(var key1 in commentJSON) {
                if(key1 in mappings) {
                    var key2 = mappings[key1];
                    result[key2] = commentJSON[key1];
                }
            }
            return result;
        }

    };

    $.fn.comments = function(options) {
        return this.each(function() {
            var comments = Object.create(Comments);
            $.data(this, 'comments', comments);
            comments.init(options || {}, this);
        });
    };
}));
