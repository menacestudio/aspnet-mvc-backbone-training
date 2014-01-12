(function ($, Backbone, app) {
    $(function () {
        // Declarations
        app.Vent = _.extend({}, Backbone.Events);
        var modalContainer = $('#modal-container');

        // Model
        app.SessionModel = Backbone.Model.extend({
            url: '/Sessions/Manage',
            defaults: {
                SessionName: '',
                SessionDate: new Date(),
                System: ''
            }
        });

        // Collection
        app.SessionCollection = Backbone.Collection.extend({
            model: app.SessionModel,
            url: '/Sessions/Manage'
        });

        // Views
        // Session View
        app.SessionView = Backbone.View.extend({
            el: '#tblSessions',
            initialize: function () {
                this.collection.fetch();
                this.context = this.$el.find('tbody');

                this.listenTo(this.collection, 'sync', this.render, this);
                this.listenTo(this.collection, 'add', this.renderRow);
            },

            render: function () {
                this.context.empty();
                this.collection.each(this.renderRow, this);
                return this;
            },

            renderRow: function (model) {
                var self = this;
                this.context.append(new app.SessionRowView({
                    model: model,
                    collection: self.collection
                }).render().el);
            }
        });

        // Session Row View
        app.SessionRowView = Backbone.View.extend({
            tagName: 'tr',
            template: _.template($('#sessionrow-tmpl').html()),
            events: {
                'click .delete': 'deleteSession',
                'click .edit': 'editSession'
            },
            render: function () {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },
            deleteSession: function (e) {
                e.preventDefault();
                var self = this;

                bootbox.confirm('Are you sure?', function (response) {
                    if (response) {
                        self.model.destroy({
                            url: self.model.url + '/' + self.model.id,
                            wait: true,
                            success: function () {
                                self.remove();
                            }
                        });
                    }

                });
            },
            editSession: function (e) {
                var form = new app.FormView({
                    collection: this.collection,
                    model: this.model
                }).render().el;
                modalContainer.html(form);
                modalContainer.modal('show');
            }
        });

        // Form View
        app.FormView = Backbone.View.extend({
            template: _.template($('#form-tmpl').html()),
            render: function () {
                this.$el.empty();

                var systems = ['SEIS', 'PROMIS', 'EDJoin'];
                this.$el.html(this.template(
                    _.extend(this.model.toJSON(), { systems: systems})));
                this.bindUI();
                return this;
            },
            events: {
                'click #saveSession': 'saveSession'
            },
            saveSession: function (e) {
                e.preventDefault();
                var self = this;

                var data = Backbone.Syphon.serialize(this),
                    isNew = this.model.isNew();
                
                this.model.set(data);
                
               // Push back to the server
                this.model.save({ wait: true })
                    .success(function (res) {           
                        if (isNew) {
                            self.collection.add(self.model);
                        }
                    })
                    .complete(function (res) {
                        modalContainer.modal('hide');
                    })
                    .error(function(res) {
                        bootbox.alert(res);
                    });

            },
            bindUI: function () {
                this.$('.datepicker').datepicker();
            }
        });

        // Instantiate the views and collections
        var sessions = new app.SessionCollection();
        $('#session').on('click', '#addSession', function (e) {
            e.preventDefault();

            var form = new app.FormView({
                model: new app.SessionModel(),
                collection: sessions
            }).render().el;
            modalContainer.html(form);
            modalContainer.modal('show');
        });

        $('.sessions-grid').html(new app.SessionView({
            collection: sessions
        }).render().el);

    });
})(jQuery, Backbone, window.app = window.app || {});