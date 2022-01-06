//let MM_Environment = 'production';
let MM_Environment = 'integration';

const superagent = require('superagent');

// =====================================

setEnvironment(MM_Environment);

function setEnvironment(anEnvironment) {
    urlBase = 'https://integration.mercadomype.com';
    if(anEnvironment == 'production') urlBase = 'https://secure.mercadomype.com';
}

// SECURITY
// =================================================

async function getToken(aHash) {
    try {
        if(!aHash) {
            return { success: false, message: 'Missing APIKEY' };
        }

        let token = "Basic " + aHash;
        urlWS = urlBase + '/auth/realms/akka/protocol/openid-connect/token';
        rawdata = await superagent
            .post(urlWS)
            .send('grant_type=client_credentials')
            .set({'Authorization': token, "Content-Type": "application/x-www-form-urlencoded"})
        token = 'Bearer ' + rawdata.body.access_token;
        return { success: true, result: token };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// BUYER
// =================================================

async function getBuyerInformation(aToken) {
    try {
        urlWS = urlBase + '/membership/api/company';
        rawdata = await superagent
            .get(urlWS)
            .set({'Authorization': aToken, "Content-Type": "application/json"});
        if (rawdata.body.parties) delete rawdata.body.parties;
        return { success: true, result: rawdata.body };
    } catch (error) {
        return { success: false, message: error.message };
    }    
}

// SELLERS
// =================================================

async function getSellers(aToken) {
    try {
        urlWS = urlBase + '/membership/api/company';
        rawdata = await superagent
            .get(urlWS)
            .set({'Authorization': aToken, "Content-Type": "application/json"});        
        return { success: true, result: rawdata.body.parties };
    } catch (error) {
        return { success: false, message: error.message };
    }    
}

async function addSellerToNetwork(aToken, aSellerData, checkInsertion) {
    try {
        urlWS = urlBase + '/membership/api/company/parties/'+aSellerData.ruc;
        rawdata = await superagent
            .post(urlWS)
            .set({'Authorization': aToken, "Content-Type": "application/json"})
            .send(aSellerData);

        let result = { success: true };

        if(checkInsertion) {
            try {
                urlWS = urlBase + '/membership/api/company';
                rawdata = await superagent
                    .get(urlWS)
                    .set({'Authorization': aToken, "Content-Type": "application/json"})
                // Review if present
                let sellers = rawdata.body.parties;
                let ok = false;
                for(let s of sellers) if(s.ruc == aSellerData.ruc) { ok = true; break; }
                if (!ok) result = { success: false, message: 'Company was not present in DB after service call' };
                
            } catch (error) {
                return { success: false, message: error.message };
            }
        }

        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }  
}

async function addMultipleSellersToNetwork(aToken, aSellerData) {

    try {
        for(let o of aSellerData) {
            await addSellerToNetwork(aToken,o,false);
        }
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function removeSellerFromNetwork(aToken, aSellerData) {

    try {
        urlWS = urlBase + '/membership/api/company/parties/'+aSellerData.ruc+'_'+aSellerData.email;
        rawdata = await superagent
            .delete(urlWS)
            .set({'Authorization': aToken, "Content-Type": "application/json"});

        let result = { success: true };

        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }  
}

// DOCUMENTS
// =================================================

async function getProgrammedDocuments(aToken) {

    try {
        urlWS = urlBase + '/system/api/billfold?filter=programado';
        rawdata = await superagent.get(urlWS)
            .set({'Authorization': aToken, "Content-Type": "application/json"});    

        let result = { success: true, result: rawdata.body };

        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }  
}

async function getAdvanceRequestedDocuments(aToken) {

    try {
        urlWS = urlBase + '/system/api/billfold?filter=solicitado';
        rawdata = await superagent.get(urlWS)
            .set({'Authorization': aToken, "Content-Type": "application/json"});    

        let result = { success: true, result: rawdata.body };

        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }  
}

async function addDocuments(aToken,aDocumentArray) {

    try {
        urlWS = urlBase + '/system/api/billfold/batch';
        rawdata = await superagent.post(urlWS)
            .set({'Authorization': aToken, "Content-Type": "application/json"})
            .send(aDocumentArray);

        let result = { success: rawdata.status == 200, result: rawdata.body };

        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }  
}

async function deleteDocument(aToken,aSellerID,aDocumentID) {

    try {
        urlWS = urlBase + '/system/api/billfold/'+aSellerID+'::'+aDocumentID;
        rawdata = await superagent.delete(urlWS)
            .set({'Authorization': aToken, "Content-Type": "application/json"});    

        let result = { success: rawdata.status == 200, result: rawdata.body };

        return result;
    } catch (error) {
        return { success: false, message: error.message };
    }  
}

// UTILITIES
// =================================================

function formatDTCustom(aDate) {
    var day = twoDigitPad(aDate.getDate()), month = twoDigitPad(aDate.getMonth()+1), year = aDate.getFullYear(), hour = twoDigitPad(aDate.getHours()), minute = twoDigitPad(aDate.getMinutes()), second = twoDigitPad(aDate.getSeconds()), miliseconds = aDate.getMilliseconds();
    return String(year) + '.' + String(month) + '.' + String(day) + ' ' + String(hour) + ':' + String(minute) + ':' + String(second) + '.' + String(miliseconds);
}

function timestamp() {
    return formatDTCustom(new Date())
};

function twoDigitPad(num) {
    return num < 10 ? "0" + num : String(num);
}

module.exports = { setEnvironment,
                   getToken,
                   getBuyerInformation,
                   getSellers, addSellerToNetwork, addMultipleSellersToNetwork, removeSellerFromNetwork,
                   getProgrammedDocuments, getAdvanceRequestedDocuments, addDocuments, deleteDocument,
                   formatDTCustom, timestamp
                };