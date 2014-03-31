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
        });
        Auth.check();
    });
})(Auth, Config);