const generateID = (idType, dbModel) => {
    dbModel.count({}, (err, count) => {
        if (!err) {
            new_id = idType + String(count);
            return new_id;
        }
        console.log("error", err)
    })
};