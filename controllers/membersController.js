'use strict';

var memberService = require("../services/memberService");
var memberValidator = require("../lib/memberValidator");

var newMemberHandler = (req, res) => {
    let dbError = (error) => {
        res.status(500).json({errors: [error]});
    };

    let residentialAddress = {
        address: req.body.residentialAddress.address,
        suburb: req.body.residentialAddress.suburb,
        postcode: req.body.residentialAddress.postcode,
        state: req.body.residentialAddress.state,
        country: req.body.residentialAddress.country
    };

    let postalAddress = isPostalAddressEmpty(req.body.postalAddress) ? residentialAddress :
        {
            address: req.body.postalAddress.address,
            suburb: req.body.postalAddress.suburb,
            postcode: req.body.postalAddress.postcode,
            state: req.body.postalAddress.state,
            country: req.body.postalAddress.country
        };

    let newMember = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        primaryPhoneNumber: req.body.primaryPhoneNumber,
        secondaryPhoneNumber: req.body.secondaryPhoneNumber,
        dateOfBirth: req.body.dateOfBirth,
        residentialAddress: residentialAddress,
        postalAddress: postalAddress,
        membershipType: req.body.membershipType
    };

    let validationErrors = memberValidator.isValid(newMember);

    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors});
    }

    return memberService.createMember(newMember)
        .then(() => {
            res.status(200).json({ newMember: newMember});
        })
        .catch(dbError);
};

function isPostalAddressEmpty(postalAddress){
    return  postalAddress.address == "" &&
            postalAddress.suburb == "" &&
            postalAddress.postcode == "";
};

module.exports = {
    newMemberHandler: newMemberHandler
};
