(function(Config) {
    var Poller;

    if ('WebSocket' in window) {
        // WS
        var url = 'ws://' + Config.subscribeHost + '/ws';

        Poller = function() {
            this.url = url;

            this.initialize = function() {
                this.request = new WebSocket(url);

                this.request.onmessage = function(e) {
                    var msg = JSON.parse(e.data);
//                    {
//                        'event': {
//                            'type': '<тип эвента>',
//                            'data': {}
//                        },
//                        'id': 1
//                    }
                    var event = msg.event;
                    this.trigger(event.type, event.data);
                }.bind(this);
            };

            this.initialize();
        };



    } else {
        // Long polling
        alert('Not implemented');
        Poller = function() {};
    }

    _.extend(Poller.prototype, Backbone.Events);

    window.Poller = Poller;

})(Config);