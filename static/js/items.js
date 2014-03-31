$(function() {
    var Pagination = {};

    Pagination.Model = Backbone.Model.extend({
        defaults: {
            'page': 1,
            'count': 10,
            'pages': 1
        },
        validate: function(attrs) {
            if (attrs.page > attrs.pages) {
                return "Bad pages";
            }
            if (attrs.page < 1) {
                return "Bad pages";
            }
        }
    });

    Pagination.View = Backbone.View.extend({
        events: {
            'click .prev': 'prev',
            'click .next': 'next'
        },
        template: _.template($('#paging').html()),
        initialize: function() {
            _.bindAll(this, 'render', 'next', 'prev');
            this.listenTo(this.model, 'change', this.render);
        },
        next: function() {
            var m = this.model;
            m.set({'page': m.get('page') + 1}, {validate: true});
        },
        prev: function() {
            var m = this.model;
            m.set({'page': m.get('page') - 1}, {validate: true});
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
        }
    });

    var paging = new Pagination.Model();

    window.paging = paging;

    var Post = {};

    Post.Model = Backbone.Model.extend({
        urlRoot: Config.baseUrl + '/items',
        defaults: {
            'type': 'text',
            'editing': false
        }
    });

    Post.Collection = Backbone.Collection.extend({
        model: Post.Model,
        url: function() {
            return Config.baseUrl + '/items?page=' + this.paging.get('page') + '&count=' + this.paging.get('count');
        },
        paging: paging,
        initialize: function() {
            this.paging.bind('change:page', function() {
                this.fetch({
                    reset: true
                });
            }.bind(this));
        },
        parse: function(data) {
            this.paging.set({
                'page': data.page,
                'count': data.count,
                'pages': data.pages
            }, {silent: true});
            return data.data;
        },
        comparator: function(a, b) {
            return a.get('date') > b.get('date') ? -1 : 1;
        }
    });

    Post.View = Backbone.View.extend({
        tagName: 'li',
        className: 'post-item',
        events: {
            'click .post-item__remove': 'removeItem',
            'dblclick': 'edit'
        },
        template: _.template($('#post-item').html()),
        initialize: function(options) {
            _.bindAll(this, 'removeItem', 'remove', 'edit', 'changeText');
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'change:text', this.changeText);
            this.userId = options.userId;
        },
        changeText: function(model, value) {
            this.$('.post-item__text').text(value);
        },
        edit: function() {
            this.model.set({'editing': true});
        },
        removeItem: function() {
            this.model.destroy({wait: true});
        },
        render: function() {
            var data = this.model.toJSON();
            data.userId = this.userId;
            this.$el.html(this.template(data));
            this.$el.css('background-image', 'url(https://graph.facebook.com/' + this.model.get('author_id') + '/picture)');
            return this;
        }
    });

    Post.All = {};

    Post.All.View = Backbone.View.extend({
        items: null,
        template: _.template($('#posts').html()),
        events: {
            'submit .add-post': 'addPost',
            'reset .add-post': 'resetPost'
        },
        initialize: function(options) {
            this.items = new Post.Collection();
            _.bindAll(this, 'render', 'addOne', 'addPost', 'resetPost');
            this.items.bind("all", this.render);
            this.userId = options.userId;
        },
        getEditing: function() {
            return this.items.find(function(item) {
                return item.get('editing');
            });
        },
        resetPost: function() {
            var m = this.getEditing();
            if (m) {
                m.set({'editing': false});
            }
        },
        addPost: function(e) {
            var text = this.$('[name=post_text]').val();
            var m = this.getEditing();
            if (m) {
                m.save({
                    'text': text,
                    'editing': false
                }, {
                    'wait': true,
                    'success': function() {
                        this.$form[0].reset();
                    }.bind(this)
                });
            } else {
                this.items.create({
                    'text': text
                }, {
                    'wait': true,
                    'success': function() {
                        this.$form[0].reset();
                    }.bind(this),
                    'at': 0
                });
            }
            return false;
        },
        addOne: function(model) {
            //console.log(model.get('text'));
            var view = new Post.View({
                model: model,
                userId: this.userId
            });
            //console.log(this.items.models);
            if (this.items.indexOf(model) === 0) {
                this.$posts.prepend(view.render().$el);
            } else {
                this.$posts.append(view.render().$el);
            }
        },
        render: function(eventName, model, value) {
            console.log(eventName);
            if (eventName === 'reset') {
                this.$el.html(this.template({}));
                this.$posts = this.$('.posts');
                this.$form = this.$('.add-post');
                new Pagination.View({
                    model: paging,
                    el: this.$('.paging')
                }).render();
                model.each(this.addOne);
            } else if (eventName === 'add') {
                this.addOne(model);
            } else if (eventName === 'change:editing') {
                if (value) {
                    var m = this.items.find(function(item) {
                        return item.get('editing') && item.get('id') !== model.get('id');
                    });
                    if (m) {
                        m.set({'editing': false});
                    }
                    this.$('[name=post_text]').val(model.get('text')).focus();
                }

            }
        }
    });

    window.Post = Post;
});