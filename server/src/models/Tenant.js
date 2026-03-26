const mongoose = require('mongoose');

// Minimal Tenant model — used only to check for active tenants before property delete
const tenantSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
        fullName: { type: String, required: true, trim: true },
        isActive: { type: Boolean, default: true, index: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Tenant', tenantSchema);
