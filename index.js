let zipFolder = require('zip-folder');
var fs = require('fs-extra');
let spawn = require('child_process').spawn;
exports.handler = async(event) => {

    let packageName = event['queryStringParameters']['package'];
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
                    const response = {
                        statusCode: 200,
                        body: JSON.stringify(event['queryStringParameters']['package'])
                    };
                    return response;
                }
            });
        }
    });
};