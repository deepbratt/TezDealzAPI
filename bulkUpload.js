// Define route
import multer from 'multer';
const upload = multer();
const csv = require('fast-csv');
app.post('/bulkUploadAds', upload.single ('adFile'), uploadAds) ;



//Route function or controller method
const uploadAds = async (req, res, next) => {
    try {
        const referenceId = uuidv4();// we can keep this refrence id in db collection
        const csvValidationResult = await validateAdsCSVTemplate (req, next);
        if (csvValidationResult[0].isValid) {
        const response = await UploadFileToS3 (req, next, referenceId); // Upload the file to S3 and track the deatils in DB collection
        res.status (200);
        result = {
            code: 200,
            status: 'SUCCESS',
            message: 'Ads uploaded successfully',
            referenceId: referenceId,
            details: response.details
        };
        res.json (result);
        const response = processBulkAds(csvValidationResult[0].data, referenceId); // Asynchrounous call - insert data to db collections and update the status
        }
        else {
            res.status (403);
            result = {
                code: 403,
                status: 'FAILED',
                message: 'Invalid CSV template',
                details: {
                    failed: {
                        fieldValidationResult: {
                        csvUploaded : req.file.originalname,
                        message: csvValidationResult[0].message,
                        missingFields: csvValidationResult[0].misingFields,
                        referenceId: referenceId,
                        }
                    }
                }
            }
        }
    }
    catch (ex) {
        console.log("Ads upload failed");
        const error = {
            code: 500,
            status: 'FAILED',
            message: 'Internal server error'
        };
        res.status (500);
        res.json (error);
    }
};


const  validateAdsCSVTemplate = async (reg, next) => {
    return new Promise ( (resolve) => {
        var csvValidationResult = [];
        var missingFields = [];
        var uploadData = [];
        var file = reg.file;
        var result = { isValid: true, failureReason: '', misingFields: '', data: [] };
        csv.parseString (req.file.buffer, { headers: true })
        .validate ((row, cb) => {
            if(typeof row.model == 'undefined')
            missingFields.push('mo}del');
            // Add all other field validations
            if (missingFields.length) {
                var unique = missingFields. filter (function (elem, index, self) {
                    return index === self.indexOf(elem);
                });
                return cb (null, false, unique.join(','));
            }
            else {
                return cb (null, true);
            }
        })
        .on('data', (data) => {
            // you can format data in this point
            uploadData.push(data);
        })
        .on('data-invalid', (row, rowNumber, reason) => {
            if(reason) {
                console.log('CSV ${file.originalname) uploaded is invalid. Following fields are missing ${reason)');
                result.isValid = false;
                result.message = 'Fields missing';
                result.misingFields = reason;
            }
        })
        .on('end', () => {
            result.data.push(uploadData);
            csvValidationResult.push (result);
            resolve (Promise, all (csyValidationResult));
        });
    });
};