/*******************************************************************************

 Humancredit Plugin
 Copyright (C) 2015 Humancredit gGmbH

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see {http://www.gnu.org/licenses/}.

 Home: https://www.humancredit.cc
 */

/* global µBlock */

/******************************************************************************/
µBlock.Humancredit = µBlock.Humancredit || {

    /**
     *
     */
    signatureParam: 'hc_ad_sg=',

    /**
     *
     */
    certificate: "-----BEGIN CERTIFICATE-----MIIFEjCCAvoCCQCZqsU+DTCIbTANBgkqhkiG9w0BAQsFADBLMQswCQYDVQQGEwJERTEPMA0GA1UECAwGQmVybGluMQ8wDQYDVQQHDAZCZXJsaW4xGjAYBgNVBAoMEUh1bWFuY3JlZGl0IGdHbWJIMB4XDTE1MDIwMTE1NDM0MloXDTE2MDIwMTE1NDM0MlowSzELMAkGA1UEBhMCREUxDzANBgNVBAgMBkJlcmxpbjEPMA0GA1UEBwwGQmVybGluMRowGAYDVQQKDBFIdW1hbmNyZWRpdCBnR21iSDCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAMK4002BHaY3YVs9pbZjAQVmIfocpn5h9/fEHOiZGW5CA6Nmp9+Fn4qAovNv3YItpvfM0v3104EZSKA7E0A9KKyNh5mICnc/MqLvSbGOu+Fd7ur4C1mluB6+PvWOSYkvmkycjradXTzo5rpfeM7p+yS1rbAx8BBvthkFby6b0c7bwt0tcjGXEeGNOsWDValTsY1dYLif8HAtzXkJ3GS9O/4QWVw3Fzr7TMuOP38XmJkfaS4f4Mv738qyM9MmhFqS1KY8vRyxNJczOLL1vyVTC7Cp+zQOhbCQIxVpbtbMTSUQjAD2pbIRTTjuOwxbID6N1sxfb7c10pu3XYHrSskJsRDFNHxEw6nsfk0eNaZEG34zbBo6njKiJhCukLLePkRE8EnsWs/dm7lRu1dFZlmw+zTSNF2UzRE1rC1wA6dBrXMSDYjMh+UxkkJp01m+oA/rByzLgNjY2oa3w727+4e79f4kns4VRPsLajYkS/HqJZGTC4KjlP9VDJRyUbb/e3cp6RZUKltUHDuLLottx5DLaRJo4v9OiB52flSHpL8EO/nEUtkbit2MuO2oJy+7BBeXtA0pm+vahWfjvi8SDyPyBRRRDJwjRDOtfNzyVMQsffHx42ImTurficNRxH3x1tXM3NL33I6GQSEzgKVWbIPOU1Th5dgz6Q7dqG7lQywN0i2HAgMBAAEwDQYJKoZIhvcNAQELBQADggIBAAMx0jdWrI9i6bn1FMbFg55ViYafW/HSMhTem1hzGKtIECB+uf1wmyKQX+vvfeffSiA1n7K632v9lEcNL+FiqhFxJrk9OsNzfbmifxA7xsTXhuAIKiUFCAQbLNwg9L16+k9rWabMHZd+9xL9UHK+oOlZvLDAnUzMn1XHCAToMyCCAJQ2N9tAeQ4B+8ULaNuue3u1MHMBZw5z/qsWeJcY8LDAhfsl9h9WzISRmRP0LpI5T7ERoGoV05/sforMdl6KQ7lB8tiYHONGql4jI0MbSjlah6/yjQ9h14ExaMzn6YJ3eyiYMeZJJv4y/EsrIGBIN79RpsJ6b1/BwjL5f2uRIF5J+KSjx9dQ5QHWUQe/SYSnpwGTQg1WO5f6Arj4wgBsOMPf/1oLN47N0pzRN25w36ZXoOqR4RrIJX4/tsW8qY4QUpLIs9yYNN3Wddqs3DotRgEG4PcGsQVdc3CYeHOYh7oojBVlnfL6oT01f/T+Pxu9ILn7JTs76p0oLAVdCCYjbrN1PJtfYeJHHoFL/hdOMGtSpNZZEfQJ9LNTQ2zzs4zqt7+3F2BWcKbRf5HagXit75dTGrdzavU5vlnSMnvMdIPCnyvgKHpkqolhptqJj8nsXs/5H3nJiBJDpyrTgTOLF4/0431L6waxxxVFunBG7OK2OuvtMLAFNbcWaHNqli7V-----END CERTIFICATE-----",

    /**
     *
     */
    checkForSignature: function(context, tabId, result) {
        // :TODO: Humancredit Signature check using the certificate and split URL
        //console.debug('humancredit.js > checkForSignature');

        // hcLevel: 0 - disabled filter, 0 - block everything, 1 + 2 allow filtering
        //console.debug(context);
        //console.debug(context.rootHostname, "/", context.requestHostname);
        var hcLevel = vAPI.localStorage.getItem('hcLevel' + context.rootHostname);
        if (hcLevel > 1 && context.requestURL.indexOf(this.signatureParam) > -1) {
            //console.debug("Humancredit signature found!");

            var parts = context.requestURL.split(this.signatureParam);
            var sMsg = parts[0].substring(0, parts[0].length - 1);
            var hSig = parts[1];
            var x509 = new X509();
            x509.readCertPEM(this.certificate);
            var validSignature = x509.subjectPublicKeyRSA.verifyString(sMsg, hSig);

            //console.debug(' > verified: ', validSignature);
            //console.debug(" > requestURL: ", context.requestURL);
            //console.debug(" > result: ", result.replace("sb:||", ""));
            if (validSignature) {
                if (context.requestURL.toLowerCase() != result.replace("sb:||", "").toLowerCase()) {
                    result = "";
                }
            }
            //console.debug(" > BLOCK? ", result);
        }

        return result;
    },

    /**
     *
     * @param {Object} request
     * @param {Object} sender
     * @param {Object} callback
     */
    onMessage: function(request, sender, callback) {
        // Async
        switch ( request.what ) {
            case 'getHcLevel':
                //console.log(request.url);
                if (vAPI.localStorage.getItem('hcLevel' + sender.tab.id) === null) {
                    vAPI.localStorage.setItem('hcLevel' + sender.tab.id, 2);
                }
                //console.log(vAPI.localStorage.getItem('hcLevel' + sender.tab.id));
                callback(vAPI.localStorage.getItem('hcLevel' + sender.tab.id));
                return;

            case 'clearCache':
                µBlock.pageStores[request.tabId].reuse();
                µBlock.cosmeticFilteringEngine.reset();
                return;

        }
    }
};

vAPI.messaging.listen('humancredit.js', µBlock.Humancredit.onMessage);
