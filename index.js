let zipFolder = require('zip-folder');
let fs = require('fs-extra');
let spawn = require('child_process').spawn;
let express = require("express");
let bodyParser = require("body-parser");

let app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/:name', function (request, response) {
    let packageName = request["params"].name;
    let command = `package ${packageName}`;

    let ls = spawn('download-tgz', command.split(' '), {
        stdio: 'inherit',
        shell: true
    });

    ls.on('data', function (data) {
        console.log('asdasd: ' + data.toString());
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());
        if (fs.existsSync("./tarballs")) {
            console.log("done downloading");
            zipFolder("./tarballs", `${packageName}.zip`, function (err) {
                if (err) {
                    console.log('oh no!', err);
                } else {
                    fs.removeSync("./tarballs");
                    console.log('EXCELLENT');
                    response.sendFile(__dirname + `\\${packageName}.zip`);
                }
            });
        }
    });
});

app.listen(app.get('port'), function () {
    console.log('node-tgz-downloader on port ' + app.get('port'));
});

exports.handler = async(event) => {};