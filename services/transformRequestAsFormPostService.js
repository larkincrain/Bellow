(function () {
    "use strict";

    var BellowApp = angular.module('BellowApp');

    BellowApp.factory("transformRequestAsFormPostService", [transformRequestAsFormPostService])
    function transformRequestAsFormPostService() {
        // Prepare the request data for the form post
        function transformRequest(data, getHeaders) {
            var headers = getHeaders();
            headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
            return (serializeData(data));
        }
        // Return the factory value
        return (transformRequest);

        // Serialize the given Object into a key-value pair string. This
        // method expects an object and will default to the toString() method.
        // --
        // NOTE: This is an atered version of the jQuery.param() method which
        // will serialize a data collection for Form posting.
        // --
        function serializeData(data) {
            // If this is not an object, defer to native stringification
            if (!angular.isObject(data)) {
                return ((data == null) ? "" : data.toString());
            }

            var buffer = [];

            // Serialize each key in the object
            for (var name in data) {
                if (!data.hasOwnProperty(name)) {
                    continue;
                }
                var value = data[name];
                buffer.push(encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value));
            }

            // Serialize the buffer and clean it up for transportation.
            var source = buffer.join("&").replace(/%20/g, "+");

            return (source);
        }
    }
})();
