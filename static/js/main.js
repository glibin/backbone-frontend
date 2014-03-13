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
        Auth.once('success', function() {
            var postsView = new Post.All.View({
                el: $('.content')[0]
            });
            postsView.items.fetch({reset: true});
//            var test = new Post.Collection();
//            test.fetch({
//                'success': function(collection) {
//                    var model = collection.at(0);
//                    model.save({'text': 'Good bye!'});
//                    //model.destroy();
//                }
//            });
        });
        Auth.check();
    });
})(Auth, Config);