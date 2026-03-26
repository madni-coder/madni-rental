const Property = require('../models/Property');
const Tenant = require('../models/Tenant');

const MAX_SEARCH_LENGTH = 100;

// Escape special regex characters to prevent regex injection / ReDoS
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
}

// GET /api/properties
async function getProperties(req, res) {
    const { search, type } = req.query;
    const filter = { userId: req.user.id };

    if (type) filter.type = type;
    if (search) {
        if (search.length > MAX_SEARCH_LENGTH) {
            return res.status(400).json({ message: `Search query must not exceed ${MAX_SEARCH_LENGTH} characters` });
        }
        const safeSearch = escapeRegex(search);
        filter.$or = [
            { name: { $regex: safeSearch, $options: 'i' } },
            { address: { $regex: safeSearch, $options: 'i' } },
        ];
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.json(properties);
}

// POST /api/properties
async function createProperty(req, res) {
    const { name, type, floors, areaSqFt, plannedRent, address, amenities, notes } = req.body;

    const property = await Property.create({
        userId: req.user.id,
        name,
        type,
        floors,
        areaSqFt,
        plannedRent,
        address,
        amenities: amenities || [],
        notes,
    });

    res.status(201).json(property);
}

// GET /api/properties/:id
async function getProperty(req, res) {
    const property = await Property.findOne({ _id: req.params.id, userId: req.user.id });

    if (!property) {
        return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
}

// PUT /api/properties/:id
async function updateProperty(req, res) {
    const { name, type, floors, areaSqFt, plannedRent, address, amenities, notes } = req.body;

    const property = await Property.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { name, type, floors, areaSqFt, plannedRent, address, amenities, notes },
        { new: true, runValidators: true }
    );

    if (!property) {
        return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
}

// DELETE /api/properties/:id
async function deleteProperty(req, res) {
    const property = await Property.findOne({ _id: req.params.id, userId: req.user.id });

    if (!property) {
        return res.status(404).json({ message: 'Property not found' });
    }

    // Guard: block delete if active tenants exist
    const hasActiveTenant = await Tenant.exists({ propertyId: property._id, isActive: true });
    if (hasActiveTenant) {
        return res.status(409).json({ message: 'Cannot delete property with active tenants' });
    }

    await property.deleteOne();
    res.json({ message: 'Property deleted' });
}

module.exports = {
    getProperties,
    createProperty,
    getProperty,
    updateProperty,
    deleteProperty,
};
