(function(Auth, Config) {
    Backbone.ajax = function(request) {
        request.xhrFields = {
            'withCredentials': true
        };
        delete request.contentType;
        console.log(request);
        return Backbone.$.ajax.apply(Backbone.$, arguments);
    };

    $(function() {
        Auth.once('success', function(userId) {
            var authors = new Author.Collection();
            authors.fetch({'success': function() {
                var postsView = new Post.All.View({
                    el: $('.content')[0],
                    userId: userId,
                    authors: authors,
                    poller: new Poller()
                });
                postsView.items.fetch({reset: true});
            }});

//            poller.on('new', function(data) {
//                if (data.author_id != userId) {
//
//                }
//            });
        });
        Auth.check();
    });
})(Auth, Config);