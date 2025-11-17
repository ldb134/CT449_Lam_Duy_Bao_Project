const Counter = require('../models/counter.model');

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } }, 
        { new: true, upsert: true }
    );
    
    return sequenceDocument.seq;
}

module.exports = getNextSequenceValue;