const mongoose = require('mongoose');
const { STATUS, STATUS_CODE, SUCCESS_MSG, ERRORS } = require('@constants/tdb-constants');

const bodyTypesSchema = new mongoose.Schema({
    bodyType: {
        type: String,
        unique: true,
        required: [true, 'Body Type is required'],
    },
    image: {
        type: String,
        required: true,
    },
});

const BodyType = mongoose.model('BodyType', bodyTypesSchema);
module.exports = BodyType;
