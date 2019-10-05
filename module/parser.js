const  needle = require('needle');
async function GetHTML (url)
{
    let result = {status: 'err', result: ''};
    await needle('get', url)
        .then((req)=>{
            result.status = 'ok';
            result.result = req.body;
        })
        .catch(err => {
            console.log(err);
            result.result = err;
        });
    return result;
}



module.exports = {
    getHTML: GetHTML
};