const status = require('http-status');
const staffDb = require('../models/staffModel');
const { updateController, flattenObject } = require("../middlewares/utils/utils");


const getStaff = async (req, res) => {
    const responseData = [];
    const staff = await staffDb.find();
    if (staff) {
        for (let i = 0; i < staff.length; i++) {
            let data = flattenObject(staff[i].toObject());
            delete data.password;
            responseData.push(data);
        };
        return res.status(200).json({ message: "Success", data: responseData, status: status[200] });
    };
    return res.status(404).json({ status: status[404], message: "records not found!" });
};

const getStaffById = async (req, res) => {
    const staff = await staffDb.findOne({ staff_id: req.params.id });

    if (staff) {
        createdAt = JSON.stringify(staff.createdAt).split("T")[0].replace('"', "");
        let responseData = flattenObject(staff.toObject());
        delete responseData.password;

        return res.status(200).json({ message: "Success", data: responseData, status: status[200] });
    } else {
        return res.status(404).json({ status: status[404], message: "record not found!" });
    };
};

const updateStaff = async (req, res) => {
    let staff = await staffDb.findOneAndUpdate({ id: req.params.id }, { new: true });
    if (staff) {
        let updatedStaff = await updateController(data = req.body, obj = staff);
        await updatedStaff.save();
        createdAt = JSON.stringify(updatedStaff.createdAt).split("T")[0].replace('"', "");

        let responseData = updatedStaff.toObject();
        delete responseData.password;
        responseData = flattenObject(responseData)
        responseData = { ...responseData, createdAt };
        return res.status(200).json({ message: "Success", data: responseData, status: status[200] });
    } else return res.status(404).json({ status: status[404], message: "record not found!" });
}

const deleteStaff = async (req, res) => {
    let staffExists = await staffDb.findOne({ id: req.params.id });
    if (staffExists) {
        await staffDb.deleteOne({ id: req.params.id });
        return res.status(200).json({ message: "Success", data: responseData, status: status[200] });
    } else {
        return res.status(404).json({ status: status[404], message: "record not found!" })
    }
}


module.exports = { getStaff, getStaffById, updateStaff, deleteStaff };