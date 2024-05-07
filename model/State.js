const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statesSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },

    funFacts: {
        type: [String]
    }
});

const States = mongoose.model("States", statesSchema);

module.exports = States;