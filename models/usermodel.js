const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Students" }, // For students
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teachers" }
});


userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
