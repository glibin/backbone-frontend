(function(Config) {
    var Author = {};

    Author.Model = Backbone.Model;

    Author.Collection = Backbone.Collection.extend({
        model: Author.Model,
        url: function() {
            return Config.baseUrl + '/authors';
        },
        parse: function(resp) {
            return resp.data;
        }
    });

    window.Author = Author;

})(Config);