(function ($, Backbone, Module) {
    $(function () {
        // Declarations
        var app = window.mvc,
            modalContainer = $('<div />')
                .addClass('modal fade')
                .attr({ tabindex: '-1', 'data-width': 760 });

        // Model
        Module.SessionModel = Backbone.Model.extend({
            url: '/Sessions/Manage',
            defaults: {
                SessionName: '',
                SessionDate: new Date(),
                System: ''
            }
        });

        // Collection
        Module.SessionCollection = Backbone.Collection.extend({
            model: Module.SessionModel,
            url: '/Sessions/Manage'
        });

        // Views
        // Session View
        Module.Views.SessionView = Backbone.View.extend({
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
                this.context.append(new Module.Views.SessionRowView({
                    model: model,
                    collection: self.collection
                }).render().el);
            }
        });

        // Session Row View
        Module.Views.SessionRowView = Backbone.View.extend({
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
                var form = new Module.Views.FormView({
                    collection: this.collection,
                    model: this.model
                }).render().el;
                modalContainer.html(form);
                modalContainer.modal('show');
            }
        });

        // Form View
        Module.Views.FormView = Backbone.View.extend({
            template: _.template($('#form-tmpl').html()),
            render: function () {
                this.$el.empty();

                var systems = ['SEIS', 'PROMIS', 'EDJOIN'];
                this.$el.html(this.template(
                    _.extend(this.model.toJSON(), { systems: systems })));
                this.bindUI();
                
                modalContainer.html(this.$el);
                modalContainer.modal('show');
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
                    .error(function (res) {
                        bootbox.alert(res);
                    });

            },
            bindUI: function () {
                this.$('.datepicker').datepicker();
            }
        });

        // Sessions by System View
        Module.Views.SessionsBySystemView = Backbone.View.extend({
            tagName: 'ul',
            attributes: { 'class': 'list-group' },

            initialize: function () {
                _.bindAll(this, 'renderRow');
                this.listenTo(this.collection, 'sync', this.render, this);
                this.listenTo(this.collection, 'add', this.render, this);
                this.listenTo(this.collection, 'remove', this.render, this);
            },
            render: function () {
                this.$el.empty();

                var groupedSystems = this.collection.pluck('System');

                if (groupedSystems.length > 0) {
                    var t = _.countBy(groupedSystems, function (m) {
                        return m;
                    });
                    _.each(t, this.renderRow);
                }

                return this;
            },

            renderRow: function (count, system) {
                this.$el.append(new Module.Views.SessionsBySystemRowView({
                    count: count, system: system
                }).render().el);
            }
        });

        // Sessions by System Row View
        Module.Views.SessionsBySystemRowView = Backbone.View.extend({
            tagName: 'li',
            attributes: { 'class': 'list-group-item' },
            template: _.template($('#sessionrowCount-tmpl').html()),
            initialize: function(params) {
                this.count = params.count;
                this.system = params.system;
            },
            render: function () {
                this.$el.html(this.template(
                    { System: this.system, Count: this.count }));
                return this;
            }
        });
        
    });
})(jQuery, Backbone, mvc.module('sessions'));