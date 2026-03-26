const { Router } = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
    getProperties,
    createProperty,
    getProperty,
    updateProperty,
    deleteProperty,
} = require('../controllers/propertyController');

const router = Router();

const propertyValidationRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('type')
        .isIn(['apartment', 'commercial', 'house'])
        .withMessage('Type must be apartment, commercial, or house'),
    body('plannedRent')
        .isFloat({ min: 0 })
        .withMessage('Planned rent must be a positive number'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('floors').optional({ nullable: true }).isInt({ min: 0 }).withMessage('Floors must be a non-negative integer'),
    body('areaSqFt').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Area must be a positive number'),
    body('amenities').optional().isArray().withMessage('Amenities must be an array'),
];

router.get('/', auth, getProperties);
router.post('/', auth, propertyValidationRules, validate, createProperty);
router.get('/:id', auth, getProperty);
router.put('/:id', auth, propertyValidationRules, validate, updateProperty);
router.delete('/:id', auth, deleteProperty);

module.exports = router;
