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

/* global vAPI */

/******************************************************************************/

// Injected into content pages
(function() {

    'use strict';

    // https://github.com/chrisaljoudi/uBlock/issues/464
    if ( document instanceof HTMLDocument === false) {
        //console.debug('humancredit-ui.js > not a HTLMDocument');
        return;
    }

    // I've seen this happens on Firefox
    if (window.location === null) {
        return;
    }

    // This can happen
    if (!vAPI) {
        //console.debug('humancredit-ui.js > vAPI not found');
        return;
    }

    // https://github.com/chrisaljoudi/uBlock/issues/587
    // Pointless to execute without the start script having done its job.
    if (!vAPI.contentscriptStartInjected) {
        return;
    }

    var messager = vAPI.messaging.channel('humancredit-ui.js');

    /******************************************************************************/

    // HC START
    // :TODO: lot's of refactoring
    var humancreditButton = function() {
        if (document.body === null) {
            return;
        }
        var images = document.querySelectorAll("img[src*='sg=']");
        var bodyRect = document.body.getBoundingClientRect();

        for (var i in images) {
            if (images[i].src && images[i].style.display != "none") {
                images[i].className = 'humancredit-ad';
                var rect = images[i].getBoundingClientRect();
                var hc = null;
                var theId = "humancredit-ad-" + i;

                if (!document.getElementById(theId)) {

                    // container
                    hc = document.createElement("div");
                    hc.id = theId;
                    hc.style.position = "absolute";
                    hc.style.zIndex = "99999";
                    hc.style.top = (rect.top - bodyRect.top).toString() + "px";
                    hc.style.left = (rect.left - bodyRect.left + rect.width - 28).toString() + "px";

                    // icon
                    var hcImg = document.createElement("img");
                    hcImg.id = theId + "-img";
                    hcImg.className = 'humancredit-ad';
                    hcImg.src = chrome.extension.getURL("/img/icon_128.png");
                    hcImg.title = "Humancredit: " + images[i].alt || images[i].title;
                    hcImg.style.width = "24px";
                    hcImg.style.height = "24px";
                    hcImg.style.position = "absolute";
                    hcImg.style.top = "2px";
                    hcImg.style.left = "2px";
                    hcImg.style.cursor = "pointer";
                    hcImg.addEventListener("click", function(event) {
                        var ul = document.getElementById(event.target.parentElement.id + "-ul");
                        var hcMenus = document.getElementsByClassName("hc_sg-ul");
                        for (var i in hcMenus) {
                            if (hcMenus[i].style && hcMenus[i] != ul) {
                                hcMenus[i].style.display = "none";
                            }
                        }
                        if (ul) {
                            ul.style.display = (ul.style.display == "block" ? "none" : "block");
                        }
                    });
                    hc.appendChild(hcImg);

                    // menu
                    var hcMenu = document.createElement("ul");
                    hcMenu.id = theId + "-ul";
                    hcMenu.className = "hc_sg-ul";
                    hcMenu.style.position = "relative";
                    hcMenu.style.listStyle = "none";
                    hcMenu.style.display = "none";
                    hcMenu.style.top = "28px";
                    hcMenu.style.left = "auto";
                    hcMenu.style.right = "109px";
                    hcMenu.style.padding = "0 2px";
                    hcMenu.style.margin = "0";
                    hcMenu.style.background = "#1593FF";
                    hcMenu.style.border = "1px solid #FFF";
                    hcMenu.style.color = "#FFF";
                    hcMenu.style.width = "130px";
                    hcMenu.style.boxShadow = "0 0 2px #000";
                    hc.appendChild(hcMenu);

                    // like button
                    var hcLikeItem = document.createElement("li");
                    hcLikeItem.id = theId + "-like";
                    hcLikeItem.style.position = "relative";
                    hcLikeItem.style.height = "15px";
                    hcLikeItem.style.lineHeight = "15px";
                    hcLikeItem.style.fontSize = "11px";
                    hcLikeItem.style.padding = "2px";
                    hcLikeItem.style.margin = "0";
                    hcLikeItem.style.cursor = "pointer";
                    hcLikeItem.innerHTML = "I like this";
                    hcLikeItem.addEventListener("click", function(event) {
                        if (prompt("Do you want to add feedback?", "")) {
                            alert("Feedback sent.");
                        }
                        // hide menu
                        event.target.parentElement.style.display = "none";
                    });
                    hcMenu.appendChild(hcLikeItem);

                    // generic block button
                    var hcBlockItem = document.createElement("li");
                    hcBlockItem.id = theId + "-block";
                    hcBlockItem.sourceImage = images[i].src;
                    hcBlockItem.style.position = "relative";
                    hcBlockItem.style.height = "15px";
                    hcBlockItem.style.fontSize = "11px";
                    hcBlockItem.style.lineHeight = "15px";
                    hcBlockItem.style.padding = "2px";
                    hcBlockItem.style.margin = "0";
                    hcBlockItem.style.cursor = "pointer";
                    hcBlockItem.style.borderTop = "1px solid #FFF";
                    hcBlockItem.innerHTML = "Block this";
                    hcBlockItem.addEventListener("click", function(event) {

                        var localMessager = vAPI.messaging.channel('element-picker.js');
                        localMessager.send({
                            what: 'createUserFilter',
                            filters: "||" + event.target.sourceImage
                        });
                        localMessager.close();

                        // disable ad
                        var images = document.querySelectorAll("img.humancredit-ad");
                        for (var i in images) {
                            if (images[i] && images[i].src && images[i].style) {
                                images[i].style.display = 'none';
                            }
                        }

                        // close menu
                        event.target.parentElement.parentElement.style.display = "none";

                        if (prompt("Ad blocked! Do you want to add feedback?", "")) {
                            alert("Feedback sent.");
                        }
                    });

                    hcMenu.appendChild(hcBlockItem);

                    // dislike button
                    var hcDislikeItem = document.createElement("li");
                    hcDislikeItem.id = theId + "-dislike";
                    hcDislikeItem.sourceImage = images[i].src;
                    hcDislikeItem.style.position = "relative";
                    hcDislikeItem.style.height = "15px";
                    hcDislikeItem.style.lineHeight = "15px";
                    hcDislikeItem.style.fontSize = "11px";
                    hcDislikeItem.style.padding = "2px";
                    hcDislikeItem.style.margin = "0";
                    hcDislikeItem.style.cursor = "pointer";
                    hcDislikeItem.style.borderTop = "1px solid #FFF";
                    hcDislikeItem.innerHTML = "Not relevant";
                    hcDislikeItem.addEventListener("click", function(event) {

                        var localMessager = vAPI.messaging.channel('element-picker.js');
                        localMessager.send({
                            what: 'createUserFilter',
                            filters: "||" + event.target.sourceImage
                        });
                        localMessager.close();

                        // disable ad
                        var images = document.querySelectorAll("img.humancredit-ad");
                        for (var i in images) {
                            if (images[i] && images[i].src && images[i].style) {
                                images[i].style.display = 'none';
                            }
                        }

                        // close menu
                        event.target.parentElement.parentElement.style.display = "none";

                        if (prompt("Ad blocked! Do you want to add feedback?", "")) {
                            alert("Feedback sent.");
                        }
                    });
                    hcMenu.appendChild(hcDislikeItem);

                    // add to dom
                    document.body.appendChild(hc);
                }
            }
        }
    };

    //console.debug("humancredit-ui.js > start!");
    setInterval(humancreditButton, 500);
})();
