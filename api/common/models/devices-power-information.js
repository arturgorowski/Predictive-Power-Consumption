'use strict';

module.exports = function (Devicespowerinformation) {
    //  full text search
    //     //{ "where": {"$text": { "search": "sony"} } }
    //     if (search !== undefined) {
    //         //search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    //         let regQuery = new RegExp(search, "i");
    //         query.where = { "$text": { "search": search } };
    //     }


    /**
     * metoda zdalna do wysukiwania informacji o produkcie w bazie 
     */
    Devicespowerinformation.findAll = function (search, time, req, cb) {

        let query = { where: [] };

        if (req.query.per_page) query.limit = req.query.per_page;
        if (req.query.per_page && req.query.page) query.skip = (req.query.per_page * (req.query.page - 1));
        if (req.query.sort && req.query.order) query.order = req.query.sort + " " + req.query.order;

        if (search !== undefined) {
            //search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let regQuery = new RegExp(search, "i");
            query.where = { "$or": [{ "producent": regQuery }, { "model": regQuery }, { "productName": regQuery }] };
        }

        try {
            req.query.filter = JSON.parse(req.query.filter);
            // merge filters
            if (typeof req.query.filter === "object") {
                query = merge(query, req.query.filter);
            }

        } catch (err) { }

        Devicespowerinformation.count(query.$or).then(function (count) {
            return Devicespowerinformation.find(query).then(function (results) {

                if (time !== undefined) {
                    results.forEach(device => {
                        switch (device.deviceType) {
                            case 'fridge':
                                return cb(null, { type: 'fridge', total: count, result: results });

                            case 'washingMachine':
                                device.powerConsumption = device.powerConsumption * time
                                device.powerConsumption = Math.round(device.powerConsumption * 100) / 100;
                                return cb(null, { type: 'washingMachine', total: count, result: results, time: time });

                            case 'oven':
                                return cb(null, { type: 'oven', total: count, result: results });

                            case 'soundbar':
                                return cb(null, { type: 'soundbar', total: count, result: results, time: time });

                            case 'washer':
                                return cb(null, { type: 'washer', total: count, result: results });

                            case 'tv':
                                return cb(null, { type: 'tv', total: count, result: results });

                            case 'dryer':
                                return cb(null, { type: 'dryer', total: count, result: results });

                            case 'washerDryer':
                                return cb(null, { type: 'washerDryer', total: count, result: results });

                            case 'cooker':
                                return cb(null, { type: 'cooker', total: count, result: results });

                            case 'homeTheaterSet':
                                return cb(null, { type: 'homeTheaterSet', total: count, result: results, time: time });

                            case 'bluRay':
                                return cb(null, { type: 'bluRay', total: count, result: results });

                        }
                    })
                }

                else return cb(null, { total: count, result: results });

            });
        }).catch(function (err) {
            return cb(err, null);
        });
    };

    /**
     * metoda zdalna do zwracania zagregowanej tablicy wszystkich typów urządzeń w bazie
     */
    Devicespowerinformation.getAllDeviceType = function (req, cb) {

        const DevicePowerInformationCollection = Devicespowerinformation.getDataSource().connector.collection("devicesPowerInformation");

        let pipeline = [
            {
                $group:
                {
                    _id: { deviceType: "$deviceType" },
                    count: { $sum: 1 }
                }
            },
            { $project: { _id: 1, count: 1 } },
            { $sort: { count: -1 } }
        ];

        let cursor = DevicePowerInformationCollection.aggregate(pipeline)
        cursor.get(function (err, data) {
            if (!err) {
                //console.log(">>>>>data", data);
                return cb(null, data)
            } else {
                return cb(err, null);
            }
        });
    };

    /**
     * metoda zdalna do zwracania zagregowanej tablicy wszystkich producentów w bazie
     */
    Devicespowerinformation.getAllProducent = function (req, cb) {

        const DevicePowerInformationCollection = Devicespowerinformation.getDataSource().connector.collection("devicesPowerInformation");

        let pipeline = [
      
            { $group:
                {
                    _id: { producent: {$toLower: "$producent"}},
                    count: { $sum: 1 }
                }
            },
            { $project: { _id: 1, count: 1 } },
            { $sort: { count: -1 } }
        ]

        let cursor = DevicePowerInformationCollection.aggregate(pipeline)
        cursor.get(function (err, data) {
            if (!err) {
                //console.log(">>>>>data", data);
                return cb(null, data)
            } else {
                return cb(err, null);
            }
        });
    };

    Devicespowerinformation.findByDeviceType = function (search, req, cb) {
        let query;
        query = { where: {} }

        if (search !== undefined) {
            //search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            //let regQuery = new RegExp(search, "i");
            query.where = { "deviceType": search };
        }

        try {
            req.query.filter = JSON.parse(req.query.filter);
            // merge filters
            if (typeof req.query.filter === "object") {
                query = merge(query, req.query.filter);
            }

        } catch (err) { }

        Devicespowerinformation.count(query.$or).then(function (count) {
            return Devicespowerinformation.find(query).then(function (results) {

                return cb(null, { total: count, result: results });

            });
        }).catch(function (err) {
            return cb(err, null);
        });
    }

    Devicespowerinformation.findByProducent = function (search, req, cb) {
        let query;
        query = { where: {} }

        if (search !== undefined) {
            //search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let regQuery = new RegExp(search, "i");
            query.where = { "producent": regQuery };
        }

        try {
            req.query.filter = JSON.parse(req.query.filter);
            // merge filters
            if (typeof req.query.filter === "object") {
                query = merge(query, req.query.filter);
            }

        } catch (err) { }

        Devicespowerinformation.count(query.$or).then(function (count) {
            return Devicespowerinformation.find(query).then(function (results) {

                return cb(null, { total: count, result: results });

            });
        }).catch(function (err) {
            return cb(err, null);
        });
    }


    // --------------------------------- REMOTE METHODS ----------------------------------

    /**
     *
     *
     */
    Devicespowerinformation.remoteMethod("findAll", {
        http: { path: "/all", verb: "get" },
        accepts: [{ arg: "search", type: "string" }, { arg: "time", type: "string" }, { arg: "req", type: "object", http: { source: "req" } }],
        returns: [{ arg: "data", type: "any", description: "Get all matching objects", root: true }],
        description: "It search database for all matching word."
    });

    Devicespowerinformation.remoteMethod("getAllDeviceType", {
        http: { path: "/allDeviceType", verb: "get" },
        accepts: [{ arg: "filter", type: "object", http: { source: "req" } }],
        returns: [{ arg: "data", type: "array", description: "Get all device type", root: true }],
        description: "It return all device type from database."
    });

    Devicespowerinformation.remoteMethod("getAllProducent", {
        http: { path: "/allProducent", verb: "get" },
        accepts: [{ arg: "filter", type: "object", http: { source: "req" } }],
        returns: [{ arg: "data", type: "array", description: "Get all producent", root: true }],
        description: "It return all producent from database."
    });

    Devicespowerinformation.remoteMethod("findByDeviceType", {
        http: { path: "/findByDeviceType", verb: "get" },
        accepts: [{ arg: "search", type: "string" }, { arg: "req", type: "object", http: { source: "req" } }],
        returns: [{ arg: "data", type: "any", description: "Get all matching objects to device type", root: true }],
        description: "It return all device power information by device type."
    });

    Devicespowerinformation.remoteMethod("findByProducent", {
        http: { path: "/findByProducent", verb: "get" },
        accepts: [{ arg: "search", type: "string" }, { arg: "req", type: "object", http: { source: "req" } }],
        returns: [{ arg: "data", type: "any", description: "Get all matching objects to producent", root: true }],
        description: "It return all device power information by producent."
    });
};