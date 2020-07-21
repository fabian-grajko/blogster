const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');

const credentials = new AWS.Credentials(keys.accessKeyId, keys.secretAccessKey);

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    credentials: credentials,
    region: 'eu-central-1'
});

module.exports = app => {
    app.get('/api/upload', requireLogin, async (req, res) => {
        const key = `${req.user.id}/${uuid()}.jpeg`;

        const url = await s3.getSignedUrlPromise('putObject', {
            Bucket: 'fabiangrajko-blogster-bucket-1',
            ContentType: 'image/jpeg',
            Key: key
        });

        res.send({ key, url });
    });
}