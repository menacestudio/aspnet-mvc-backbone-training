(function ($, Backbone, app) {
    $(function () {
        var $authPlaceholder = $('#authPlaceholder');

        app.AccountModel = Backbone.Model.extend({
            url: '/Account/AuthenticateUser'
        });
        
        // Set the global account model
        app.UserAccount = new app.AccountModel({ Email: app.Auth.Email });

        // Views declaration
        app.AccountViewLoggedOut = Backbone.View.extend({
            tagName: 'form',
            attributes: { 'class': 'navbar-form navbar-right' },

            template: _.template($('#authTemplateLoggedOut').html()),
            initialize: function () {

            },
            events: {
                'click #btnLogin': 'logIn'
            },
            render: function () {
                this.$el.html(this.template({}));
                return this;
            },
            logIn: function (e) {
                var self = this;
                e.preventDefault();

                var data = Backbone.Syphon.serialize(this);

                $.post('/Account/AuthenticateUser', data, function (response) {
                    if (response.isValid) {
                        self.model.set({
                            Email: response.user.Email,
                            IsAuthenticated: true
                        });

                        $authPlaceholder.html(new app.AccountViewLoggedIn({
                            model: self.model
                        }).render().el);
                    } else {
                        bootbox.alert(response.message);
                    }
                });

            }
        });

        app.AccountViewLoggedIn = Backbone.View.extend({
            template: _.template($('#authTemplateLoggedIn').html()),

            events: {
                'click #btnProfile': 'manageProfile',
                'click #btnLogout': 'logOut'
            },
            render: function () {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },
            manageProfile: function (e) {
                e.preventDefault();

            },
            logOut: function (e) {
                var self = this;
                e.preventDefault();

                $.post('/Account/LogOut', function (response) {
                    self.model.clear();
                    $authPlaceholder.html(new app.AccountViewLoggedOut({
                        model: self.model
                    }).render().el);
                });

            }
        });


        // Create new view instances
        if (app.Auth.IsAuthenticated) {
            $authPlaceholder.html(new app.AccountViewLoggedIn({
                model: app.UserAccount
            }).render().el);
        } else {
            $authPlaceholder.html(new app.AccountViewLoggedOut({
                model: app.UserAccount
            }).render().el);
        }

    });

})(jQuery, Backbone, window.app = window.app || {});