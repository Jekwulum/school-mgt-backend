const status = require('http-status');
const cloudinary = require('../middlewares/utils/cloudinary');
const staffDb = require('../models/staffModel');
const { updateController, flattenObject, generateID, generateToken } = require("../middlewares/utils/utils");


const getStaff = async (req, res) => {
	const responseData = [];
	const staff = await staffDb.find();
	if (staff) {
		for (let i = 0; i < staff.length; i++) {
			let data = flattenObject(staff[i].toObject());
			delete data.password;
			delete data.token;
			responseData.push(data);
		};
		return res.status(200).json({ status: "SUCCESS", data: responseData });
	};
	return res.status(404).json({ status: "FAILED", message: "records not found!" });
};

const getStaffById = async (req, res) => {
	const staff = await staffDb.findOne({ staff_id: req.params.id });

	if (staff) {
		createdAt = JSON.stringify(staff.createdAt).split("T")[0].replace('"', "");
		let responseData = flattenObject(staff.toObject());
		delete responseData.password;
		delete responseData.token;

		return res.status(200).json({ status: "SUCCESS", data: responseData });
	} else {
		return res.status(404).json({ status: "FAILED", message: "record not found!" });
	};
};

const updateStaff = async (req, res) => {
	let staff = await staffDb.findOne({ staff_id: req.params.id }, { new: true });
	if (staff) {
		let updatedStaff = await updateController(data = req.body, obj = staff);
		await updatedStaff.save();
		return res.status(200).json({ message: "record updated", status: "SUCCESS" });
	}
	// staffDb.findOneAndUpdate({id: req.params});
	return res.status(404).json({ status: "FAILED", message: "record not found!" });
}

const updatePhoto = async (req, res) => {
	let staff = await staffDb.findOne({ staff_id: req.params.id }, { new: true });
	if (staff) {
		try {
			if (req.body.photo) {
				cloudinary.uploader.upload(req.body.photo, { folder: "mySchool" }, (err, result) => {
					if (err) return res.status(500).json({ "message": "Internal Server Error", status: "FAILED" });
					req.body.photo = result.secure_url;
				});
			}
		} catch (error) {
			return res.status(500).json({ status: "FAILED", message: "Internal Server Error" });
		}
		let updatedStaff = await updateController(data = req.body, obj = staff);
		await updatedStaff.save();
		return res.status(200).json({ message: "record updated", status: "SUCCESS" });
	}
	// staffDb.findOneAndUpdate({id: req.params});
	return res.status(404).json({ status: "FAILED", message: "record not found!" });
}

const deleteStaff = async (req, res) => {
	const staffExists = await staffDb.findOne({ staff_id: req.params.id });
	if (staffExists) {
		staffDb.deleteOne({ staff_id: req.params.id })
			.then(() => {
				console.log("deleted");
				return res.status(200).json({ status: "SUCCESS", message: "Successful" });
			})
			.catch(error => {
				console.log(error);
				res.status(400).json({ status: "FAILED", message: error })
			});
	} else {
		return res.status(404).json({ message: "Record not found", status: "FAILED" });
	};
};

const create = async (req, res) => {
	const is_admin = req.body.is_admin == true ? true : false;
	const staffExists = await staffDb.findOne({ email: req.body.email });
	if (staffExists) return res.status(400).json({ status: "FAILED", message: "email already exists!" });

	const phoneExists = await staffDb.findOne({ phone: req.body.phone });
	if (phoneExists) return res.status(400).json({ status: "FAILED", message: "phone number already exists" });

	try {
		const cloudinary_response = await cloudinary.uploader.upload(req.body.photo, {
			folder: "mySchool"
		});

		const staff_prefix = is_admin ? "admin" : "stf";
		const staff_id = await generateID(staff_prefix, staffDb);

		const new_staff = await new staffDb({
			staff_id,
			password: req.body.password,
			name: {
				first: req.body.first,
				last: req.body.last,
				other: req.body.other
			},
			gender: req.body.gender,
			phone: req.body.phone,
			email: req.body.email,
			photo: cloudinary_response.secure_url
		});
		if (is_admin) new_staff.is_admin = true;
		new_staff.token = generateToken(new_staff._id, new_staff.staff_id);
		new_staff.save((err, responseObj) => {
			if (err || !responseObj) return res.status(400).json({ status: "FAILED", message: err, "error": err });
			else {
				return res.status(201).json({ status: "SUCCESS", "message": "New Staff added successfully!", access: new_staff.token });
			};
		});
	} catch (error) {
		console.log("error for try-catch: ", error);
		return res.status(500).json({ status: "FAILED", "message": "Internal Server Error" });
	}
};


module.exports = { getStaff, getStaffById, updateStaff, deleteStaff, create, updatePhoto };