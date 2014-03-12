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

        });
        Auth.check();
    });
})(Auth, Config);