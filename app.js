var k = 0,
    i = 0,
    j = 0;
var key;


$(function() {


    var items = [];
    var keywords = [];
    var parse;
    $.when(
        $.get('/ibi_apps/run.bip?BIP_REQUEST_TYPE=BIP_RUN&BIP_folder=IBFS%253A%252FEDA%252FEDASERVE%252Ftypeahead&BIP_item=procedure_typeahead.fex&windowHandle=436960&IBI_random=4516.2870024981075', function(data) {
            parse = JSON.parse(data);
            items = parse.records;
        }),
        $.get('/ibi_apps/run.bip?BIP_REQUEST_TYPE=BIP_RUN&BIP_folder=IBFS%253A%252FEDA%252FEDASERVE%252Ftypeahead&BIP_item=procedure2.fex&windowHandle=271353&IBI_random=2165.7337772878413', function(data) {
            parse = JSON.parse(data);
            keywords = parse.records;
        })




    ).then(function() {
        var result = {};


        result = items.concat(keywords);
        var newData = renameNameToValue(result);
        configureItems(newData);
    });






    function renameNameToValue(data) {
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
    }






    function configureBkgColor(e) {
        var target = e.relatedTarget;
        var item = e.attrs;
        if (item.TBNAME === 'employee') {
            $(target).addClass('chip_blue');
            $(target).children().get(1).style.color = 'white';
            $(target).children().get(1).style.opacity = 1;
        } else if (item.TBNAME === 'empdata') {
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


                    enteredStringArr.splice(index, 1);


                    var keywordIndex = keywordPosArr.indexOf(index);


                    if (keywordIndex > -1) {


                        getKeywordPosAndDeleteTillNextKeyword(keywordIndex);
                    }
                }
            }


        })
        .on('tokenfield:removedtoken', function(event) {
            //document.getElementById("panel6").innerHTML = " ";
            var target = event.relatedTarget;
            var tag = event.attrs;


            var tokens = $('#typeahead').tokenfield('getTokens');


            var resultObj = _buildNewString(tokens);


            var enteredStringArr = resultObj.string_arr;


            //var keywordPosArr = resultObj.keyword_arr;
            // _buildNewString(enteredStringArr);


            button1_onclick();
        });
});


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


function getDOMElement(tokenAttr) {
    var $token;
    var result;
    var domElements = $('.token');
    var _len = $('.token').length;
    for (var kk = 0; kk < _len; kk++) {
        //$token = $(this);
        if ($(domElements[kk]).data('attrs').value == tokenAttr) {
            result = $(domElements[kk]);
            return result;
        }
    }
}


function removed(attrs, tokenAttr) {


    var domEl = getDOMElement(tokenAttr);
    var options = {
            attrs: attrs,
            relatedTarget: domEl.get(0)
        },
        removeEvent = $.Event('tokenfield:removetoken', options)




    $(this).trigger(removeEvent);


    if (removeEvent.isDefaultPrevented()) return;


    var removedEvent = $.Event('tokenfield:removedtoken', options),
        changeEvent = $.Event('change', {
            initiator: 'tokenfield'
        });


    domEl.remove();
}




function _buildNewString(tokens) {
    var actionVarArr = [];
    var keywordArr = [];
    var resultObj = {};
    var cc = 0;


    if (tokens) {
        if (tokens.length > 0) {
            for (var bb = 0; bb < tokens.length; bb++) {
                if (tokens[bb].TBNAME === 'employee') {
                    actionVarArr[bb] = tokens[bb].value;
                } else if (tokens[bb].TBNAME === 'empdata') {
                    return;
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
                    result_str += ' ' + 'CNT.' + ' ' + enteredVal[i + 1];
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


//Begin function button3_onclick
function button3_onclick(event) {
    //alert("clear");
    var eventObject = event ? event : window.event;
    var ctrl = eventObject.target ? eventObject.target : eventObject.srcElement;
    // TODO: Add your event handler code here
    $('#iframe2').contents().find('body').empty();
    var tokens = $('#typeahead').tokenfield('getTokens');

    //tokens.forEach(function(token,index){})

    for (var index = 0; index < tokens.length; index++) {
        //tokens.splice(index,1);
        removed(tokens[index], tokens[index].value)
    }

}
//End function button3_onclick


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


    var result_obj = buildKeywordStrings(enteredStringArr, keywordPosArr, tokens);
    if (result_obj) {
        var keywordBuilderArr = result_obj.arr;
        var modifiedTokens = result_obj.token;
        var actionVarBuilderArr = buildActionVar(modifiedTokens);
        for (var ml = 0; ml < actionVarBuilderArr.length; ml++) {
            _actionVar = _actionVar + ' ' + actionVarBuilderArr[ml].value;
        }


        for (var l = 0; l < keywordBuilderArr.length; l++) {
            if (keywordBuilderArr[l].startsWith(" BY")) {
                _byStr = keywordBuilderArr[l];
            } else if (keywordBuilderArr[l].startsWith(" WHERE")) {
                _whereStr = keywordBuilderArr[l];
            } else if (keywordBuilderArr[l].startsWith("IS EQUAL") &&
                (enteredStringArr.indexOf("IS EQUAL") === (enteredStringArr.indexOf("WHERE") + 2))) {
                _whereStr += ' EQ ' + "'" + enteredStringArr[enteredStringArr.indexOf("WHERE") + 3] + "'";
            } else if (keywordBuilderArr[l].startsWith("IS GREATER THAN") &&
                (enteredStringArr.indexOf("IS GREATER THAN") === (enteredStringArr.indexOf("WHERE") + 2))) {
                _whereStr += ' GT ' + "'" + enteredStringArr[enteredStringArr.indexOf("WHERE") + 3] + "'";
            } else if (keywordBuilderArr[l].startsWith("IS LESS THAN") &&
                (enteredStringArr.indexOf("IS LESS THAN") === (enteredStringArr.indexOf("WHERE") + 2))) {
                _whereStr += ' LT ' + "'" + enteredStringArr[enteredStringArr.indexOf("WHERE") + 3] + "'";
            } else if (keywordBuilderArr[l].startsWith("IS LESS THAN OR EQUAL TO") &&
                (enteredStringArr.indexOf("IS LESS THAN OR EQUAL TO") === (enteredStringArr.indexOf("WHERE") + 2))) {
                _whereStr += ' LE ' + "'" + enteredStringArr[enteredStringArr.indexOf("WHERE") + 3] + "'";
            } else if (keywordBuilderArr[l].startsWith("IS GREATER THAN OR EQUAL TO") &&
                (enteredStringArr.indexOf("IS GREATER THAN OR EQUAL TO") === (enteredStringArr.indexOf("WHERE") + 2))) {
                _whereStr += ' GE ' + "'" + enteredStringArr[enteredStringArr.indexOf("WHERE") + 3] + "'";
            } else if (keywordBuilderArr[l].startsWith("IS NOT EQUAL TO") &&
                (enteredStringArr.indexOf("IS NOT EQUAL TO") === (enteredStringArr.indexOf("WHERE") + 2))) {
                _whereStr += ' NE ' + "'" + enteredStringArr[enteredStringArr.indexOf("WHERE") + 3] + "'";
            } else if (keywordBuilderArr[l].startsWith(" CNT.")) {
                _action = "SUM";
                _actionVar = keywordBuilderArr[l];
            } else {
                //if ((enteredStringArr.indexOf(keywordBuilderArr[l]) === (enteredStringArr.indexOf("WHERE") + 3))) {
                //  _whereStr += keywordBuilderArr[l];
                //}
            }
        }
    } else {
        for (var kk = 0; kk < enteredStringArr.length; kk++) {
            _actionVar = _actionVar + ' ' + enteredStringArr[kk];
        }
    }


    if (_actionVar == "") {
        _action = "";
    }
    /*
    var _url = "/ibi_apps/WFServlet?IBIF_ex=";
    var _ibiapp = "dynamicfex/";
    var _procedure = "procedure_submit";*/


    var dynamicurl = "&FEXTYPE=TABLE&DATABASE=EMPLOYEE&ACTION=" + _action + "&ACTIONVARIABLE=" + _actionVar + "&BYSTRING=" + _byStr + "&WHERESTRING=" + _whereStr;
    //var dynamicurl = "&FEXTYPE=GRAPH&DATABASE=EMPLOYEE&ACTION=SUM&ACTIONVARIABLE=" + _actionVar + "&BYSTRING=" + _byStr + "&WHERESTRING=" + _whereStr;
    // document.getElementById('iframe2').src = _url + _ibiapp + _procedure + "&rnd=" + Math.random() + dynamicurl ;
    ajaxcall(dynamicurl);
}
//End function button1_onclick
var _url = "/ibi_apps/WFServlet?IBIF_ex=";
var _ibiapp = "dynamicfex/";
var _procedure = "procedure_submit";


function ajaxcall(dynamicurl) {
    alert(dynamicurl);
    $.ajax({
        type: "GET",
        url: _url + _ibiapp + _procedure + "&rnd=" + Math.random() + dynamicurl,
        dataType: "html",
        success: function(_data) {
            //document.getElementById('iframe2').src = _url + _ibiapp + _procedure + "&rnd=" + Math.random() + dynamicurl ;
            $('#iframe2').contents().find('body').empty();
            var isError = _data.indexOf('Your request did not return any output to display');
            if (isError > -1) {
                $('#iframe2').contents().find('body').append('Sorry! Results not found');
            } else {
                $('#iframe2').contents().find('body').append(_data);
            }
        },
        error: function(_data) {
            console.log(_data);
        }
    });
}