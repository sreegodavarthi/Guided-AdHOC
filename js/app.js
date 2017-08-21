var k = 0,
    i = 0,
    j = 0;
var key;
var reportAction;
var tempurl;
var resultArr = [];
var fexTypeRadioBtn;
var dbname = 'EMPLOYEE';
var filteredNames = [];


function window_onload() {


    UpdateData();


    // TODO: Add your event handler code here
    //add onInitialUpdate() function to make changes before initial run of the reports
}


function UpdateData() {




    var items = [];
    var keywords = [];
    var parse;
    var dataset;
    var procedure = '';
    var segdesc = '';
    if (dbname === 'EMPLOYEE') {
        procedure = 'procedure_employee.fex';
        segdesc = "'employee'";
    } else if (dbname === 'AWV_PRODUCT') {
        procedure = 'procedure_empdata.fex';
        segdesc = "'product'";
    } else {
        procedure = 'procedure_typeahead.fex';
        segdesc = "'employee'" + " " + "OR" + " " + "'product'";
    }
    $.when(
        $.get("/ibi_apps/run.bip?BIP_REQUEST_TYPE=BIP_RUN&BIP_folder=IBFS%253A%252FEDA%252FEDASERVE%252Ftypeahead&BIP_item=" + procedure + "&windowHandle=436960&IBI_random=4516.2870024981075&SEGDESC=" + segdesc, function(data) {
            parse = JSON.parse(data);
            items = parse.records;
        }),
        $.get('/ibi_apps/run.bip?BIP_REQUEST_TYPE=BIP_RUN&BIP_folder=IBFS%253A%252FEDA%252FEDASERVE%252Ftypeahead&BIP_item=procedure2.fex&windowHandle=271353&IBI_random=2165.7337772878413', function(data) {
            parse = JSON.parse(data);
            keywords = parse.records;
        })




    ).then(function() {
        var result = {};
        var _items = {};
        var _keywords = {};
        filteredNames = filterOutKeywords(items);
        result = items.concat(keywords);
        var newData = renameToValue(result);
        configureData(newData);




        _items = renameToValue(items);
        configureItems(_items);
        _keywords = renameToValue(keywords);
        //  configureKeywords(_keywords);
    });




    //function to retrieve names
    function filterOutKeywords(data) {
        var names = [];



    }


    //rename NAME and KEYWORD properties to VALUE
    function renameToValue(data) {
        data.forEach(function(e) {
            if (e.NAME) {
                e.value = e.NAME;
                delete e.NAME;
            }
            if (e.KEYWORD) {
                e.value = e.KEYWORD;
                delete e.KEYWORD;
            }
        });
        return data;
    }




    //setup typeahead functionality
    function configureData(items) {
        var config = new Bloodhound({
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.value);
            },
            //datumTokenizer: Bloodhound.tokenizers.obj.whitespace('NAME', 'KEYWORD'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: $.map(items, function(item, key) {




                return {
                    // value: item.value || '',
                    //NAME: item.NAME || '',
                    TBNAME: item.TBNAME || '',
                    // KEYWORD: item.KEYWORD || '',
                    value: item.value || ''
                };
            })
        });






        config.initialize();




        $('#typeahead').tokenfield('destroy');
        $('#typeahead').tokenfield({
            typeahead: [null, {
                name: 'config',
                displayKey: function(item) {
                    if (item) {
                        if (item.value) {
                            return item.value;
                        } else {
                            return item.KEYWORD;
                        }
                    }
                },
                source: config.ttAdapter(),
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'Unable to find any match',
                        '</div>'
                    ].join('\n'),
                    suggestion: function(data) {
                        var _suggestion = '';
                        if (data.TBNAME) {
                            _suggestion = "<div>" +
                                data.value +
                                " in " +
                                data.TBNAME + "</div>";
                        } else {
                            _suggestion = "<div>" +
                                data.value + "</div>";
                        }
                        return _suggestion;
                    }
                }
            }]
        });




        $('#wherefield').tokenfield({
            typeahead: [null, {
                name: 'config',
                displayKey: function(item) {
                    if (item) {
                        if (item.value) {
                            return item.value;
                        } else {
                            return item.KEYWORD;
                        }
                    }
                },
                source: config.ttAdapter(),
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'Unable to find any match',
                        '</div>'
                    ].join('\n'),
                    suggestion: function(data) {
                        var _suggestion = '';
                        if (data.TBNAME) {
                            _suggestion = "<div>" +
                                data.value +
                                " in " +
                                data.TBNAME + "</div>";
                        } else {
                            _suggestion = "<div>" +
                                data.value + "</div>";
                        }
                        return _suggestion;
                    }
                }
            }]
        });
    }




    //setup typeahead functionality
    function configureItems(items) {




        var config = new Bloodhound({
            datumTokenizer: function(d) {
                return Bloodhound.tokenizers.whitespace(d.value);
            },
            //datumTokenizer: Bloodhound.tokenizers.obj.whitespace('NAME', 'KEYWORD'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: $.map(items, function(item, key) {




                return {
                    // value: item.value || '',
                    //NAME: item.NAME || '',
                    TBNAME: item.TBNAME || '',
                    // KEYWORD: item.KEYWORD || '',
                    value: item.value || ''
                };
            })
        });




        config.initialize();




        $('#actionvar').tokenfield({
            typeahead: [null, {
                name: 'config',
                displayKey: function(item) {
                    if (item) {
                        if (item.value) {
                            return item.value;
                        }
                    }
                },
                source: config.ttAdapter(),
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'Unable to find any match',
                        '</div>'
                    ].join('\n'),
                    suggestion: function(data) {
                        var _suggestion = '';
                        if (data.TBNAME) {
                            _suggestion = "<div>" +
                                data.value +
                                " in " +
                                data.TBNAME + "</div>";
                        } else {
                            _suggestion = "<div>" +
                                data.value + "</div>";
                        }
                        return _suggestion;
                    }
                }
            }]
        });
        $('#byfield').tokenfield({
            typeahead: [null, {
                name: 'config',
                displayKey: function(item) {
                    if (item) {
                        if (item.value) {
                            return item.value;
                        }
                    }
                },
                source: config.ttAdapter(),
                templates: {
                    empty: [
                        '<div class="empty-message">',
                        'Unable to find any match',
                        '</div>'
                    ].join('\n'),
                    suggestion: function(data) {
                        var _suggestion = '';
                        if (data.TBNAME) {
                            _suggestion = "<div>" +
                                data.value +
                                " in " +
                                data.TBNAME + "</div>";
                        } else {
                            _suggestion = "<div>" +
                                data.value + "</div>";
                        }
                        return _suggestion;
                    }
                }
            }]
        });
    }




    //to change the background-color of chips
    function configureBkgColor(e) {
        var target = e.relatedTarget;
        var item = e.attrs;
        if (item.TBNAME === 'employee') {
            $(target).addClass('chip_blue');
            $(target).children().get(1).style.color = 'white';
            $(target).children().get(1).style.opacity = 1;
        } else if (item.TBNAME === 'awv_product') {
            $(target).addClass('chip_maroon');
            $(target).children().get(1).style.color = 'white';
            $(target).children().get(1).style.opacity = 1;
        } else if (item.TBNAME === '') {
            $(target).addClass('chip_green');
            $(target).children().get(1).style.color = 'white';
            $(target).children().get(1).style.opacity = 1;
        } else {
            $(target).addClass('chip_red');
            $(target).children().get(0).style.color = 'white';
            $(target).children().get(1).style.color = 'white';
            $(target).children().get(1).style.opacity = 1;
        }
    }








    $('#typeahead')
        .on('tokenfield:createtoken', function(e) {})
        .on('tokenfield:createdtoken', function(event) {
            configureBkgColor(event);
            button1_onclick();
        })
        .on('tokenfield:edittoken', function(e) {})
        .on('tokenfield:removetoken', function(event) {
            var tag = event.attrs;
            var tokens = $('#typeahead').tokenfield('getTokens');




            var resultObj = _buildNewString(tokens);




            if (resultObj) {
                var enteredStringArr = resultObj.string_arr;
                var keywordPosArr = resultObj.keyword_arr;
                var index = enteredStringArr.indexOf(tag.value);
                if (index > -1) {
                    //enteredStringArr.splice(index, 1);








                    var keywordIndex = keywordPosArr.indexOf(index);
                    if (keywordIndex > -1) {
                        getKeywordPosAndDeleteTillNextKeyword(keywordIndex);
                    } else {
                        removed(tag, tag.value);
                    }
                }
            }




        })
        .on('tokenfield:removedtoken', function(event) {
            //document.getElementById("panel6").innerHTML = " ";
            var tokens = $('#typeahead').tokenfield('getTokens');
            var resultObj = _buildNewString(tokens);
            button1_onclick();
        });




    $('#actionvar')
        .on('tokenfield:createdtoken', function(event) {
            configureBkgColor(event);
            //   clearAllMainTypeaheadTokens();
        });




    $('#byfield')
        .on('tokenfield:createdtoken', function(event) {
            configureBkgColor(event);




            // clearAllMainTypeaheadTokens();




        });




    $('#wherefield')
        .on('tokenfield:createdtoken', function(event) {
            configureBkgColor(event);




            //clearAllMainTypeaheadTokens();




        });
}








function clearAllMainTypeaheadTokens() {
    var tokens = $('#typeahead').tokenfield('getTokens');
    for (var index = 0; index < tokens.length; index++) {
        removed(tokens[index], tokens[index].value)
    }
}








//to delete the keyword and associated string
function getKeywordPosAndDeleteTillNextKeyword(keywordIndex) {
    var tokens = $('#typeahead').tokenfield('getTokens');
    var from = 0;
    var to = 0;
    if (tokens.length > 0) {








        var resultObj = _buildNewString(tokens);
        var enteredStringArr = resultObj.string_arr;
        var keywordPosArr = resultObj.keyword_arr;
        if (keywordPosArr.length >= 1) {








            from = keywordPosArr[keywordIndex];
            to = keywordPosArr[keywordIndex + 1] ? keywordPosArr[keywordIndex + 1] : (tokens.length);
            if (from === (to - 1)) {
                removed(tokens[from], tokens[from].value);
            } else {
                for (var me = from; me < to; me++) {
                    removed(tokens[me], tokens[me].value);
                }
            }




        }




    }




}








//get the object based on its value
function getDOMElement(tokenAttr) {
    var $token;
    var result = [];
    var domElements = $('.token');
    var _len = $('.token').length;
    for (var kk = 0; kk < _len; kk++) {
        //$token = $(this);
        if ($(domElements[kk]).data('attrs').value == tokenAttr) {
            //if($(domElements[kk]).parent().get(0).querySelector("#typeahead")){
            result.push($(domElements[kk]));
            // }
        }
    }
    return result;
}








//to remove the chip from UI
function removed(attrs, tokenAttr) {




    var domEl = getDOMElement(tokenAttr);
    for (var domElIndex = 0; domElIndex < domEl.length; domElIndex++) {
        var options = {
                attrs: attrs,
                relatedTarget: domEl[domElIndex].get(0)
            },
            removeEvent = $.Event('tokenfield:removetoken', options);




        $(this).trigger(removeEvent);




        if (removeEvent.isDefaultPrevented()) return;




        var removedEvent = $.Event('tokenfield:removedtoken', options),
            changeEvent = $.Event('change', {
                initiator: 'tokenfield'
            });




        domEl[domElIndex].remove();
        //return;
    }




}








//to build query string when the user enters a value
function _buildNewString(tokens) {
    var actionVarArr = [];
    var keywordArr = [];
    var resultObj = {};
    var cc = 0;
    var actionTokens = $('#actionvar').tokenfield('getTokens');




    if (tokens) {
        if (tokens.length > 0) {
            for (var bb = 0; bb < tokens.length; bb++) {
                if (tokens[bb].TBNAME === 'employee') {
                    actionVarArr[bb] = tokens[bb].value;
                } else if (tokens[bb].TBNAME === 'awv_product') {
                    actionVarArr[bb] = tokens[bb].value;
                    //return;
                } else {
                    actionVarArr[bb] = tokens[bb].value;
                    keywordArr[cc] = bb;
                    cc++;
                }
            }
        }
    }
    resultObj = {
        string_arr: actionVarArr,
        keyword_arr: keywordArr
    };
    return resultObj;
}








//to build keyword string
function buildKeywordStrings(enteredVal, keywrdPosArr, tokens) {
    var result_keywrd_Arr = [];
    var result_str = '';
    var resultObj = {};
    if (keywrdPosArr.length === 0) {
        return;
    }
    if (keywrdPosArr.length === 1) {
        if (keywrdPosArr[0] === (tokens.length - 1)) {
            result_str = tokens[tokens.length - 1].value;
            tokens[tokens.indexOf(tokens[tokens.length - 1])].isKeyStr = true;
        } else {
            for (var i = keywrdPosArr[0]; i < tokens.length - 1; i++) {
                if (tokens[keywrdPosArr[0]].value === 'COUNT OF') {
                    result_str += ' ' + 'CNT.' + enteredVal[i + 1];
                } else {
                    result_str += ' ' + tokens[keywrdPosArr[0]].value + ' ' + enteredVal[i + 1];
                }




                tokens[keywrdPosArr[0]].isKeyStr = true;
                tokens[enteredVal.indexOf(enteredVal[i + 1])].isKeyStr = true;
            }
        }




        result_keywrd_Arr.push(result_str);
    } else {
        for (var k = 0; k < keywrdPosArr.length; k++) {
            result_str = '';
            var from = keywrdPosArr[k];
            var to = keywrdPosArr[k + 1] ? keywrdPosArr[k + 1] : (tokens.length);
            if (from === (to - 1)) {
                result_str = tokens[from].value;
                tokens[tokens.indexOf(tokens[from])].isKeyStr = true;
            } else {
                for (var j = from; j < to - 1; j++) {
                    if (tokens[from].value === 'COUNT OF') {
                        result_str += ' ' + 'CNT.' + enteredVal[j + 1];
                    } else {
                        result_str += ' ' + tokens[from].value + ' ' + enteredVal[j + 1];
                    }
                    tokens[tokens.indexOf(tokens[from])].isKeyStr = true;
                    tokens[tokens.indexOf(tokens[j + 1])].isKeyStr = true;
                }
            }
            result_keywrd_Arr.push(result_str);
        }
    }
    resultObj = {
        token: tokens,
        arr: result_keywrd_Arr
    };
    return resultObj;
}








//to build action variable
function buildActionVar(tokenObj) {
    var filteredArr = [];
    if (tokenObj) {
        for (var x = 0; x < tokenObj.length; x++) {
            if (!tokenObj[x].isKeyStr) {
                filteredArr.push(tokenObj[x]);
            } else {




            }
        }
    }
    return filteredArr;
}












//Begin function image4_onclick
function image4_onclick(event) {
    var eventObject = event ? event : window.event;
    var ctrl = eventObject.target ? eventObject.target : eventObject.srcElement;
    // TODO: Add your event handler code here
    $('#iframe2').contents().find('body').empty();
    var tokens = $('#typeahead').tokenfield('getTokens');
    // var tokensVerbs = $('#actionvar').tokenfield('getTokens');
    // var tokensBy = $('#byfield').tokenfield('getTokens');
    //var tokensWhere = $('#wherefield').tokenfield('getTokens');




    IbComposer_triggerExecution("hideerror", 1);
    IbComposer_triggerExecution("Hideiframe", 1);




    for (var index = 0; index < tokens.length; index++) {
        removed(tokens[index], tokens[index].value)
    }




    //removeVerbs(tokensVerbs);
    //removeBy(tokensBy);
    //removeWhere(tokensWhere);




}
//End function image4_onclick








//Begin function image1_onclick
function image1_onclick(event) {
    var eventObject = event ? event : window.event;
    var ctrl = eventObject.target ? eventObject.target : eventObject.srcElement;
    // TODO: Add your event handler code here
    var tokensVerbs = $('#actionvar').tokenfield('getTokens');
    var tokensBy = $('#byfield').tokenfield('getTokens');
    var tokensWhere = $('#wherefield').tokenfield('getTokens');




    $('#iframe2').contents().find('body').empty();
    var tokens = $('#typeahead').tokenfield('getTokens');




    IbComposer_triggerExecution("hideerror", 1);
    IbComposer_triggerExecution("Hideiframe", 1);




    for (var index = 0; index < tokens.length; index++) {
        removed(tokens[index], tokens[index].value)
    }




    removeVerbs(tokensVerbs);
    removeBy(tokensBy);
    removeWhere(tokensWhere);




}
//End function image1_onclick




function removeVerbs(tokensVerbs) {
    for (var index = 0; index < tokensVerbs.length; index++) {
        removed(tokensVerbs[index], tokensVerbs[index].value);
    }
}












function removeBy(tokensBy) {
    for (var index = 0; index < tokensBy.length; index++) {
        removed(tokensBy[index], tokensBy[index].value);
    }
}








function removeWhere(tokensWhere) {
    for (var index = 0; index < tokensWhere.length; index++) {
        removed(tokensWhere[index], tokensWhere[index].value);
    }
}








//Begin function button1_onclick
function button1_onclick(event) {




    var _actionVar = '';
    var _byStr = '';
    var _action = 'PRINT';
    var _whereStr = '';
    var keyword = [];
    var tokens = $('#typeahead').tokenfield('getTokens');
    var resultObj = _buildNewString(tokens);
    var enteredStringArr = resultObj.string_arr;
    var keywordPosArr = resultObj.keyword_arr;
    var isCountOfExist = false;
    var filtersArr = ["IS EQUAL", "IS GREATER THAN OR EQUAL TO", "IS LESS THAN OR EQUAL TO", "IS GREATER THAN", "IS LESS THAN"];
    var actionvarTokensList = $('#actionvar').tokenfield('getTokensList');
    var byTokensList = $('#byfield').tokenfield('getTokensList');
    var whereTokensList = $('#wherefield').tokenfield('getTokensList');




    var result_obj = buildKeywordStrings(enteredStringArr, keywordPosArr, tokens);
    if (result_obj) {
        var keywordBuilderArr = result_obj.arr;
        var modifiedTokens = result_obj.token;
        var actionVarBuilderArr = buildActionVar(modifiedTokens);
        for (var ml = 0; ml < actionVarBuilderArr.length; ml++) {
            _actionVar = _actionVar + ' ' + actionVarBuilderArr[ml].value;
        }
        /*  var actionArrTemp = _actionVar.split(" ");
        for(var avTempIndex=0;avTempIndex<actionArrTemp.length;avTempIndex++){
            if(actionArrTemp[avTempIndex] === 'CNT'){
                    isCountOfExist = true;
                    break;
            }
        }*/
        if (isCountOfExist) {
            $('#actionvar').tokenfield('setTokens', []);
        }




        $('#byfield').tokenfield('setTokens', []);
        $('#wherefield').tokenfield('setTokens', []);
        for (var l = 0; l < keywordBuilderArr.length; l++) {
            if (keywordBuilderArr[l].startsWith(" BY")) {
                _byStr = keywordBuilderArr[l];
                var tempBy = [];
                var splittedArr = keywordBuilderArr[l].split(" ");
                if (splittedArr.includes("BY")) {
                    for (var _index = 0; _index < splittedArr.length; _index++) {
                        if (splittedArr[_index] !== "" && splittedArr[_index] !== "BY") {
                            tempBy.push({
                                TBNAME: "employee",
                                value: splittedArr[_index]
                            });
                        }
                    }
                }








                for (var tempIndex = 0; tempIndex < tempBy.length; tempIndex++) {
                    $('#byfield').tokenfield('createToken', tempBy[tempIndex]);
                }








            } else if (keywordBuilderArr[l].startsWith(" WHERE")) {
                _whereStr = keywordBuilderArr[l];
                var tempWhere = [];
                var splittedWhereArr = keywordBuilderArr[l].split(" ");
                if (splittedWhereArr.includes("WHERE")) {
                    for (var _whereindex = 0; _whereindex < splittedWhereArr.length; _whereindex++) {
                        if (splittedWhereArr[_whereindex] !== "" && splittedWhereArr[_whereindex] !== "WHERE") {
                            tempWhere.push({
                                TBNAME: "employee",
                                value: splittedWhereArr[_whereindex]
                            });
                        }
                    }
                }








                for (var tempWhereIndex = 0; tempWhereIndex < tempWhere.length; tempWhereIndex++) {
                    $('#wherefield').tokenfield('createToken', tempWhere[tempWhereIndex]);
                }
            } else if (keywordBuilderArr[l].startsWith("IS EQUAL")) {
                var tempWhereEQ = {
                    TBNAME: "",
                    value: keywordBuilderArr[l].replace(/WHERE/g, " ")
                };
                if ((enteredStringArr.indexOf("IS EQUAL") === (enteredStringArr.indexOf("WHERE") + 2))) {
                    _whereStr += ' EQ ' + "'" + enteredStringArr[enteredStringArr.indexOf("WHERE") + 3] + "'";
                    $('#wherefield').tokenfield('createToken', tempWhereEQ);
                } else {
                    $('#wherefield').tokenfield('createToken', tempWhereEQ);
                }








            }
            // else if (keywordBuilderArr[l].startsWith("IS GREATER THAN")) {
            else if (keywordBuilderArr[l] === "IS GREATER THAN") {
                var tempWhereGT = {
                    TBNAME: "",
                    value: keywordBuilderArr[l].replace(/WHERE/g, " ")
                };
                if ((enteredStringArr.indexOf("IS GREATER THAN") === (enteredStringArr.indexOf("WHERE") + 2))) {
                    _whereStr += ' GT ' + "'" + enteredStringArr[enteredStringArr.indexOf("WHERE") + 3] + "'";
                    $('#wherefield').tokenfield('createToken', tempWhereGT);
                } else {
                    $('#wherefield').tokenfield('createToken', tempWhereGT);
                }








            }
            //else if (keywordBuilderArr[l].startsWith("IS LESS THAN")) {
            else if (keywordBuilderArr[l] === "IS LESS THAN") {
                var tempWhereLT = {
                    TBNAME: "",
                    value: keywordBuilderArr[l].replace(/WHERE/g, " ")
                };
                if ((enteredStringArr.indexOf("IS LESS THAN") === (enteredStringArr.indexOf("WHERE") + 2))) {
                    _whereStr += ' LT ' + "'" + enteredStringArr[enteredStringArr.indexOf("WHERE") + 3] + "'";








                    $('#wherefield').tokenfield('createToken', tempWhereLT);
                } else {
                    $('#wherefield').tokenfield('createToken', tempWhereLT);
                }
            }
            //else if (keywordBuilderArr[l].startsWith("IS LESS THAN OR EQUAL TO")) {
            else if (keywordBuilderArr[l] === "IS LESS THAN OR EQUAL TO") {
                var tempWhereLE = {
                    TBNAME: "",
                    value: keywordBuilderArr[l].replace(/WHERE/g, " ")
                };
                if ((enteredStringArr.indexOf("IS LESS THAN OR EQUAL TO") === (enteredStringArr.indexOf("WHERE") + 2))) {
                    _whereStr += ' LE ' + "'" + enteredStringArr[enteredStringArr.indexOf("WHERE") + 3] + "'";








                    $('#wherefield').tokenfield('createToken', tempWhereLE);
                } else {
                    $('#wherefield').tokenfield('createToken', tempWhereLE);
                }
            }
            //else if (keywordBuilderArr[l].startsWith("IS GREATER THAN OR EQUAL TO")) {
            else if (keywordBuilderArr[l] === "IS GREATER THAN OR EQUAL TO") {
                var tempWhereGE = {
                    TBNAME: "",
                    value: keywordBuilderArr[l].replace(/WHERE/g, " ")
                };
                if ((enteredStringArr.indexOf("IS GREATER THAN OR EQUAL TO") === (enteredStringArr.indexOf("WHERE") + 2))) {
                    _whereStr += ' GE ' + "'" + enteredStringArr[enteredStringArr.indexOf("WHERE") + 3] + "'";








                    $('#wherefield').tokenfield('createToken', tempWhereGE);
                } else {
                    $('#wherefield').tokenfield('createToken', tempWhereGE);
                }
            } else if (keywordBuilderArr[l].startsWith("IS NOT EQUAL TO")) {
                var tempWhereNE = {
                    TBNAME: "",
                    value: keywordBuilderArr[l].replace(/WHERE/g, " ")
                };
                if ((enteredStringArr.indexOf("IS NOT EQUAL TO") === (enteredStringArr.indexOf("WHERE") + 2))) {
                    _whereStr += ' NE ' + "'" + enteredStringArr[enteredStringArr.indexOf("WHERE") + 3] + "'";








                    $('#wherefield').tokenfield('createToken', tempWhereNE);
                } else {
                    $('#wherefield').tokenfield('createToken', tempWhereNE);
                }
            } else if (keywordBuilderArr[l].startsWith(" CNT.")) {
                $('#actionvar').tokenfield('setTokens', []);
                _action = "SUM";
                _actionVar = keywordBuilderArr[l];
                var tempCNT = [];
                var splittedCNTArr = keywordBuilderArr[l].split(/[\s.]+/);
                if (splittedCNTArr.includes("CNT")) {
                    for (var _CNTindex = 0; _CNTindex < splittedCNTArr.length; _CNTindex++) {
                        if (splittedCNTArr[_CNTindex] !== "" && splittedCNTArr[_CNTindex] !== "CNT") {
                            tempCNT.push({
                                TBNAME: "employee",
                                value: splittedCNTArr[_CNTindex]
                            });
                        }
                    }
                }
                for (var tempCNTIndex = 0; tempCNTIndex < tempCNT.length; tempCNTIndex++) {
                    $('#actionvar').tokenfield('createToken', tempCNT[tempCNTIndex]);
                }
            } else {
                //$('#wherefield').tokenfield('createToken', keywordBuilderArr[l]);
                if (enteredStringArr.indexOf("WHERE") > -1) {
                    if (((enteredStringArr.indexOf(keywordBuilderArr[l])) === (enteredStringArr.indexOf("WHERE") + 3)) ||
                        (filtersArr.indexOf(enteredStringArr[l - 1]) > -1)) {
                        $('#wherefield').tokenfield('createToken', keywordBuilderArr[l]);
                    } else {
                        if (keywordBuilderArr[l] !== "WHERE") {
                            $('#wherefield').tokenfield('createToken', keywordBuilderArr[l]);
                        }
                    }




                } else {
                    if (enteredStringArr.indexOf("BY") === -1) {
                        $('#wherefield').tokenfield('createToken', keywordBuilderArr[l]);
                    }
                }
            }
        }
    } else {








        $('#actionvar').tokenfield('setTokens', []);
        for (var kk = 0; kk < enteredStringArr.length; kk++) {
            _actionVar = _actionVar + ' ' + enteredStringArr[kk];
            //it creates the chip
            var tempActCnt = {
                TBNAME: "employee",
                value: enteredStringArr[kk]
            }
            $('#actionvar').tokenfield('createToken', tempActCnt);
        }
    }












    if (_actionVar === "") {
        _action = "";
    }








    if ((_actionVar === "") && (_byStr === "") && (_whereStr === "")) {
        IbComposer_triggerExecution("hideerror", 1);
        $('#iframe2').contents().find('body').empty();
        IbComposer_triggerExecution("Hideiframe", 1);
        return;
    }








    var _url = "/ibi_apps/run.bip?BIP_REQUEST_TYPE=BIP_RUN&BIP_folder=IBFS%253A%252FWFC%252FRepository%252Ftypeahead&BIP_item=procedure_submit_2.fex&windowHandle=639047&IBI_random=1158.9034483962823";
    var _ibiapp = "typeahead/";
    var _procedure = "procedure_submit_2";


    var _n = calculateN();








    var dynamicurl = "&FEXTYPE=GRAPH&DATABASE=" + dbname + "&FORMATTYPE=JSCHART&ACTION=" + _action + "&ACTIONVARIABLE=" + _actionVar + "&BYSTRING=" + _byStr + "&WHERESTRING=" + _whereStr + "&N=" + _n;
    // alert(dynamicurl);
    // var dynamicurl = "&FEXTYPE=GRAPH&DATABASE=EMPLOYEE&ACTION=SUM&ACTIONVARIABLE=" + _actionVar + "&BYSTRING=" + _byStr + "&WHERESTRING=" + _whereStr;
    document.getElementById('iframe2').src = _url + dynamicurl;
    //ajaxcall(dynamicurl);
}
//End function button1_onclick


function calculateN() {
    var actionVarLen = $('#actionvar').tokenfield('getTokens').length;
    var byStrLen = $('#byfield').tokenfield('getTokens').length;
    var whereStrLen = $('#wherefield').tokenfield('getTokens').length;


    return actionVarLen + byStrLen + whereStrLen;


}








//Begin function action_onchange
function action_onchange(event) {
    var eventObject = event ? event : window.event;
    var ctrl = eventObject.target ? eventObject.target : eventObject.srcElement;
    // TODO: Add your event handler code here
    //var defaultAction = 'Detail';
    //reportAction =  defaultAction ;
    if (event) {
        reportAction = event.currentTarget.defaultValue;
    }
    // console.log(event.currentTarget.defaultValue);
    // return reportAction;
}
//End function action_onchange








//Begin function button8_onclick
function button8_onclick(event) {
    var eventObject = event ? event : window.event;
    var ctrl = eventObject.target ? eventObject.target : eventObject.srcElement;
    // TODO: Add your event handler code here








    var _fexType = 'GRAPH';
    var _dataBase = dbname;
    var _action = '';
    var _actionVar = '';
    var _byField = '';
    var _whereField = '';












    //get the selected value in detail/summary
    var getActionVar = reportAction;
    if (getActionVar === 'Detail') {
        _action = 'PRINT';
    } else if (getActionVar === 'Summary') {
        _action = 'SUM';




    } else {
        _action = 'PRINT';




    }








    var actTokens = $('#actionvar').tokenfield('getTokens');
    var byTokens = $('#byfield').tokenfield('getTokens');
    var whereTokens = $('#wherefield').tokenfield('getTokens');




    _actionVar = _buildAVString(actTokens, _action);
    _byField = _buildByString(byTokens);
    _whereField = _buildWhereString(whereTokens);








    if (_actionVar === "") {
        _action = "";
    }








    if ((_actionVar === "") && (_byField === "") && (_whereField === "")) {
        IbComposer_triggerExecution("hideerror", 1);
        $('#iframe2').contents().find('body').empty();
        IbComposer_triggerExecution("Hideiframe", 1);
        return;
    }








    var dynamicurl = "&FEXTYPE=GRAPH&DATABASE=" + dbname + "&ACTION=" + _action + "&ACTIONVARIABLE=" + _actionVar + "&BYSTRING=" + _byField + "&WHERESTRING=" + _whereField;








    //alert(dynamicurl);
    ajaxcall(dynamicurl);




}
//End function button8_onclick
function _buildAVString(av_tokens, action) {
    var result = [];
    var resultStr = '';
    if (av_tokens) {
        if (av_tokens.length > 0) {
            for (var av = 0; av < av_tokens.length; av++) {
                result.push(av_tokens[av]);
                if (action === 'SUM') {
                    resultStr += ' ' + 'CNT.' + av_tokens[av].value;
                } else {




                    resultStr += av_tokens[av].value + ' ';
                }
            }
        }
    }
    return resultStr;
}








function _buildByString(by_tokens) {
    var result = [];
    var resultStr = '';
    if (by_tokens) {
        if (by_tokens.length > 0) {
            for (var b = 0; b < by_tokens.length; b++) {
                result.push(by_tokens[b]);
                resultStr += ' ' + 'BY' + ' ' + by_tokens[b].value;
            }
        }
    }
    return resultStr;
}












function _buildWhereString(where_tokens) {
    var result = [];
    var resultStr = '';
    var _where = ' WHERE';
    if (where_tokens) {
        if (where_tokens.length > 0) {
            for (var w = 0; w < where_tokens.length; w++) {
                result.push(where_tokens[w].value);
                if (where_tokens[w].value === 'IS EQUAL') {
                    resultStr += ' EQ ' + "'" + where_tokens[w + 1].value + "'";
                } else if (where_tokens[w].value === 'IS GREATER THAN') {
                    resultStr += ' GT ' + "'" + where_tokens[w + 1].value + "'";
                } else if (where_tokens[w].value === 'IS GREATER THAN OR EQUAL TO') {
                    resultStr += ' GE ' + "'" + where_tokens[w + 1].value + "'";
                } else if (where_tokens[w].value === 'IS LESS THAN') {
                    resultStr += ' LT ' + "'" + where_tokens[w + 1].value + "'";
                } else if (where_tokens[w].value === 'IS LESS THAN OR EQUAL TO') {
                    resultStr += ' LE ' + "'" + where_tokens[w + 1].value + "'";
                } else if (where_tokens[w].value === 'IS NOT EQUAL TO') {
                    resultStr += ' NE ' + "'" + where_tokens[w + 1].value + "'";
                } else if (where_tokens[w].value && (where_tokens[w].TBNAME === 'employee' || where_tokens[w].TBNAME === '') && (where_tokens[w].TBNAME !== undefined)) {
                    resultStr += ' ' + where_tokens[w].value;
                }
                /*else {
                    if ((where_tokens.indexOf(where_tokens[w]) === (where_tokens[w].indexOf("WHERE") + 3))) {
                        resultStr += where_tokens[w];
                    }
                }*/




            }
            resultStr = _where + resultStr;
        }
    }




    return resultStr;
}








var _url = "/ibi_apps/run.bip?BIP_REQUEST_TYPE=BIP_RUN&BIP_folder=IBFS%253A%252FWFC%252FRepository%252Ftypeahead&BIP_item=procedure_submit_2.fex&windowHandle=410540&IBI_random=1639.8353503362162";
var _ibiapp = "typeahead/";
var _procedure = "procedure_submit_1";








function ajaxcall(dynamicurl) {
    //alert(dynamicurl);
    tempurl = _url + dynamicurl + '&FORMATTYPE';
    $.ajax({
        type: "GET",
        url: _url + dynamicurl + '&FORMATTYPE=JSCHART',
        dataType: "html",
        success: function(_data) {
            //document.getElementById('iframe2').src = _url + _ibiapp + _procedure + "&rnd=" + Math.random() + dynamicurl ;
            $('#iframe2').contents().find('body').empty();
            var isError = _data.indexOf('Your request did not return any output to display');
            if (isError > -1) {
                $('#iframe2').contents().find('body').append('Sorry! Results not found');
                IbComposer_triggerExecution("Hideiframe", 1);
                IbComposer_triggerExecution("showerror", 1);
            } else {
                // $('#iframe2').contents().find('body').append(_data);
                // $('#iframe2').src.append(_data);
                IbComposer_triggerExecution("showiframe", 1);
                IbComposer_triggerExecution("hideerror", 1);
            }
        },
        error: function(_data) {
            console.log(_data);
        }
    });
}








//Begin function downloadBtn_onclick
function downloadBtn_onclick(event) {
    var eventObject = event ? event : window.event;
    var ctrl = eventObject.target ? eventObject.target : eventObject.srcElement;
    // TODO: Add your event handler code here


    // alert("download");


    var _fexType = 'GRAPH';
    var _dataBase = dbname;
    var _action = '';
    var _actionVar = '';
    var _byField = '';
    var _whereField = '';






    var actTokens = $('#actionvar').tokenfield('getTokens');
    var byTokens = $('#byfield').tokenfield('getTokens');
    var whereTokens = $('#wherefield').tokenfield('getTokens');






    _action = "PRINT";
    _actionVar = _buildAVString(actTokens, _action);
    _byField = _buildByString(byTokens);
    _whereField = _buildWhereString(whereTokens);


    fexTypeRadioBtn = "HTML";
    //Begin function radio1_onchange
    function radio1_onchange(event) {
        var eventObject = event ? event : window.event;
        var ctrl = eventObject.target ? eventObject.target : eventObject.srcElement;
        // TODO: Add your event handler code here
        if (event) {
            fexTypeRadioBtn = event.currentTarget.defaultValue;
        }


    }
    //End function radio1_onchange


    document.getElementById("fextypeEditbox").value = "TABLE";
    document.getElementById("databaseEdit").value = dbname;
    document.getElementById("actionEdit").value = _action;
    document.getElementById("actionvarEdit").value = _actionVar;
    document.getElementById("bystrEdit").value = _byField;
    document.getElementById("wherestrEdit").value = _whereField;


    IbComposer_triggerExecution("downloadBtnclick", 1);


}
//End function downloadBtn_onclick




//Begin function datasetBtn_onclick
function datasetBtn_onclick(event) {


    var eventObject = event ? event : window.event;
    var ctrl = eventObject.target ? eventObject.target : eventObject.srcElement;
    var index;
    // TODO: Add your event handler code here
    var selectedDB = $('#listbox2').val();
    if (selectedDB) {
        if (selectedDB.length === 1) {
            dbname = selectedDB[0];
        } else {
            dbname = [];
            for (index = 0; index < selectedDB.length; index++) {
                dbname.push(selectedDB[index]);
            }
        }
        UpdateData();
    }




    IbComposer_triggerExecution("datasetPanelHide", 1);




}
//End function datasetBtn_onclick






















/*
//Begin function submitsavepopup_onclick
function submitsavepopup_onclick(event) {
var eventObject = event ? event : window.event;
var ctrl = eventObject.target ? eventObject.target : eventObject.srcElement;
// TODO: Add your event handler code here
var nameVal = $('#inputsavepopup').val();
var resultObj = {
    name: nameVal,
    value: tempurl
}




console.log(resultObj);
resultArr.push(resultObj);
console.log(resultArr);
}
//End function submitsavepopup_onclick












//Begin function image11_onclick
function image11_onclick(event) {
var eventObject = event ? event : window.event;
var ctrl = eventObject.target ? eventObject.target : eventObject.srcElement;
// TODO: Add your event handler code here
var _result = resultArr;
var names = [];
var iframeEl = $('#scheduleiconpopuppanel');
if (resultArr && resultArr.length > 0) {
    for (var arrIndex = 0; arrIndex < resultArr.length; arrIndex++) {
        names.push(resultArr[arrIndex].name);
    }
}








if (names && names.length > 0) {
    //get the iframe element and append input elements
    for (var nameIndex = 0; nameIndex < names.length; nameIndex++) {
        // iframeEl.contents().find('body').append('<input type="text" value= "'+names[nameIndex]+'" /><br/>');
        iframeEl.append('<input type="text" class="form-control" value= "' + names[nameIndex] + '" /><br/>');
    }
}




}
//End function image11_onclick */