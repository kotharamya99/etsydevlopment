const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        uase_name: { type: DataTypes.STRING, allowNull: false },
        gender: { type: DataTypes.STRING, allowNull: false },
        city: { type: DataTypes.STRING, allowNull: false },
        dob: { type: DataTypes.STRING, allowNull: false },
        about: { type: DataTypes.STRING, allowNull: false },
        active: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        defaultScope: {
            // exclude password hash by default
            attributes: { exclude: ['gender'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('User', attributes, options);
}