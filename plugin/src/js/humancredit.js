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
    signatureRegEx: 'sg=',

    /**
     *
     */
    checkForSignature: function(context, result) {
        // :TODO: Humancredit Signature check using the certificate and split URL
        //console.debug('humancredit.js > checkForSignature');
        if (context.requestURL.indexOf(this.signatureRegEx) > -1) {
            //console.debug("Humancredit signature found!");
            //console.debug(" > requestURL: ", context.requestURL);
            //console.debug(" > result: ", result.replace("sb:||", ""));
            //console.debug(" > BLOCK? ", context.requestURL.toLowerCase() == result.replace("sb:||", "").toLowerCase());
            if (context.requestURL.toLowerCase() != result.replace("sb:||", "").toLowerCase()) {
                result = "";
            }
        }

        return result;
    }
};
