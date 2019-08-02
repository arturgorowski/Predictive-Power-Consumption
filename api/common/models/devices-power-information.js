'use strict';

module.exports = function(Devicespowerinformation) {

    Devicespowerinformation.findAll = function(search, req, cb) {

        let query = { where: {} };

        if (req.query.per_page) query.limit = req.query.per_page;
        if (req.query.per_page && req.query.page) query.skip = (req.query.per_page * (req.query.page - 1));
        if (req.query.sort && req.query.order) query.order = req.query.sort + " " + req.query.order;

        //{ "where": {"$text": { "search": "sony"} } }
        if (search !== undefined) {
            //search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let regQuery = new RegExp(search, "i");
            query.where = { "$text": { "search": search } };
        }

        try {
            req.query.filter = JSON.parse(req.query.filter);
            // merge filters
            if (typeof req.query.filter === "object") {
                query = merge(query, req.query.filter);
            }

        } catch (err) {}

        Devicespowerinformation.count(query.where).then(function(count) {
            return Devicespowerinformation.find(query).then(function(results) {

                return cb(null, { total: count, result: results });

            });
        }).catch(function(err) {
            return cb(err, null);
        });
    };

    // --------------------------------- REMOTE METHODS ----------------------------------

    /**
     *
     *
     */
    Devicespowerinformation.remoteMethod("findAll", {
        http: { path: "/all", verb: "get" },
        accepts: [{ arg: "search", type: "string" }, { arg: "req", type: "object", http: { source: "req" } }],
        returns: [{ arg: "data", type: "any", description: "Get all matching objects", root: true }],
        description: "It search  database for all matching word."
    });
};