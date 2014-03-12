(function(Config) {
    var auth = {
        'check': function() {
            $.ajax({
                url: Config.baseUrl + '/status',
                dataType: 'json',
                xhrFields: {
                    'withCredentials': true
                },
                success: function(data) {
                    console.log(data);
                    if (!data.authed) {
                        window.location.href = Config.baseUrl + '/?backurl=' + encodeURI(Config.selfUrl);
                    } else {
                        this.trigger('success');
                    }
                }.bind(this),
                error: function() {
                    this.trigger('fail');
                }
            })
        }
    };
    _.extend(auth, Backbone.Events);
    window.Auth = auth;
})(Config);