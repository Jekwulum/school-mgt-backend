
const { generateToken, generateID } = require('../middlewares/utils');


const express = require('express'),
	authRouter = express.Router(),
	studentDb = require('../models/studentModel'),
	staffDb = require('../models/staffModel');


// signin route
authRouter.post('/signin', async (req, res) => {
	const { id, password } = await req.body;
	console.log(id, password);
	if ((id.slice(0, 3) === "stf") || (id.slice(0, 5) === "admin")) {
		const staff = await staffDb.findOne({ staff_id: id });
		if (staff && (await staff.matchPassword(password))) {
			let data = staff.toObject();
			delete data.password;
			return res.status(200).json({ message: "success", data })
		};
		return res.status(400).json("Incorrect Username or Password!");
	}
	else if (id.slice(0, 3) === "stu") {
		const student = await studentDb.findOne({ student_id: id });
		if (student && await (student.matchPassword(password))) {
			let data = student.toObject();
			delete data.password;
			return res.status(200).json({ message: "success", data })
		}
		return res.status(400).json("Incorrect Username or Password!");
	} else return res.status(400).json("Incorrect Username or Password!");
})

// sign up router
authRouter.post('/create_staff', async (req, res) => {
	let admin = req.body.is_admin;
	is_admin = admin === "true" ? true : false;

	const staffExists = await staffDb.findOne({ email: req.body.email });
	if (staffExists) return res.status(400).json({ message: "email already exists!" });

	const phoneExists = await staffDb.findOne({ phone: req.body.phone });
	if (phoneExists) return res.status(400).json({ message: "phone number already exists" });

	if (req.body.password === req.body.confirmPassword) {
		if (!is_admin) {
			new_staff = await new staffDb({
				staff_id: await generateID("stf", staffDb),
				password: req.body.password,
				name: {
					first: req.body.first,
					last: req.body.last,
					other: req.body.other
				},
				photo: req.body.photo,
				gender: req.body.gender,
				phone: req.body.phone,
				email: req.body.email
			});
			new_staff.save((err, responseObj) => {
				if (err || !responseObj) return res.status(400).json({ "error": err });
				else {
					let data = new_staff.toObject();
					delete data.password;
					return res.status(201).json({ "message": "New staff added successfully", data });
				};
			});

		} else {
			newAdmin = await new staffDb({
				staff_id: await generateID("admin", staffDb),
				password: req.body.password,
				name: {
					first: req.body.first,
					last: req.body.last,
					other: req.body.other
				},
				gender: req.body.gender,
				dob: req.body.dob,
				phone: req.body.phone,
				photo: req.body.photo,
				email: req.body.email,
				is_admin: true
			});
			newAdmin.save((err, responseObj) => {
				if (err || !responseObj) {
					return res.status(400).json({ "error": err });
				} else {
					let data = newAdmin.toObject();
					delete data.password;
					return res.status(201).json({ "message": "New admin added successfully", data });
				}
			});
		}
	} else return res.status(404).json("passwords do not match!");
});



authRouter.post('/create_student', async (req, res) => {
	const studentExists = await studentDb.findOne({ email: req.body.email });
	if (studentExists) return res.status(400).json("Student Email already exists!");
	if (req.body.password === req.body.confirmPassword) {
		newStudent = await new studentDb({
			student_id: await generateID("stu", studentDb),
			password: req.body.password,
			name: {
				first: req.body.first,
				last: req.body.last,
				other: req.body.other
			},
			photo: req.body.photo,
			gender: req.body.gender,
			dob: req.body.dob,
			phone: req.body.phone,
			email: req.body.email
		});
		newStudent.save((err, responseObj) => {
			if (err || !responseObj) return res.status(400).json({ "error": err });
			else {
				let data = newStudent.toObject();
				delete data.password;
				return res.status(201).json({ "message": "New Student added successfully!", data });
			};
		});
	} else return res.status(404).json("passwords do not match!");
});


authRouter.post("/testpic", async (req, res) => {
	console.log(typeof (req.body.first));
	console.log(typeof (req.body.photo));
	res.json(req.body.photo);
});


module.exports = authRouter;