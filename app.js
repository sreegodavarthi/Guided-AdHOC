var emparray = [];
var k = 0,
    i = 0,
    j = 0,
    count = 0;
var key, m;
var syskey;
var temparray = [];
var _itemArr = [];
var keywordArr = [];
var array = [];
var isKeywordEntered = false;


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
        //get json from first record
        /* $.get('data/data.json', function (data) {
             //store records in items array
             items = data.records;
         }),


         //get json from second record
         $.get('data/data1.json', function (data) {
             //store records in keywords array
             keywords = data.records;
         }) */
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








        //var elt = $('#typeahead');
        /*  elt.materialtags({
              itemValue: 'value',
              itemText: function(item) {




                  if (item) {
                      if (item.NAME) {
                          return item.NAME;
                      } else {
                          return item.KEYWORD;
                      }
                  }
              },




              tagClass: function(item) {
                  if (item.KEYWORD) {
                      return 'chip chip_green';
                  } else if (item.TBNAME === 'employee') {
                      return 'chip chip_blue';
                  } else if (item.TBNAME === 'empdata') {
                      return 'chip chip_maroon';
                  } else {
                      return 'chip chip_yellow';
                  }
              },
              typeaheadjs: {
                  name: 'config',




                  displayKey: function(item) {
                      if (item) {
                          if (item.NAME) {
                              return item.NAME;
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




                          if (data.TBNAME) {
                              var _suggestion = "<div>" +
                                  data.NAME +
                                  " in " +
                                  data.TBNAME + "</div>";
                          } else {
                              var _suggestion = "<div>" +
                                  data.KEYWORD + "</div>";
                          }




                          return _suggestion;
                      }
                  }
              }
          });*/
    }




    $('#typeahead')


    .on('tokenfield:createtoken', function(e) {
        var data = e.attrs.value.split('|')
        e.attrs.value = data[1] || data[0]
        e.attrs.label = data[1] ? data[0] + ' (' + data[1] + ')' : data[0]
    })


    .on('tokenfield:createdtoken', function(event) {
        // Über-simplistic e-mail validation
        /* var re = /\S+@\S+\.\S+/;
         var valid = re.test(e.attrs.value);
         if (!valid) {
             $(e.relatedTarget).addClass('invalid');
         }*/
        var tag = event.attrs;
        if (!isKeywordEntered) {
            if (tag.TBNAME === 'employee') {
                emparray[i] = tag.value;
                temparray[i] = emparray[i];
                i++;
                _itemArr.push(tag);
            } else {
                emparray[i] = tag.value;
                temparray[i] = emparray[i];
                array[j] = i;
                i++;
                j++;
                _itemArr.push(tag);
            }
        }
    })


    .on('tokenfield:edittoken', function(e) {
            if (e.attrs.label !== e.attrs.value) {
                var label = e.attrs.label.split(' (');
                e.attrs.value = label[0] + '|' + e.attrs.value;
            }
        })
        .on('tokenfield:removetoken', function(event) {
            var target = event.relatedTarget;
            console.log(target);
        })
        .on('tokenfield:removedtoken', function(event) {
            var target = event.relatedTarget;
            //  alert('Token removed! Token value was: ' + event.attrs.value);
            document.getElementById("panel6").innerHTML = " ";
            var tag = event.attrs;
            var index, index1;
            var empremove = [];
            var indexOfBY = emparray.indexOf('BY');
            var indexOfCOUNT = emparray.indexOf('COUNT OF');
            var indexOfCOUNTONE = emparray.indexOf('COUNT OF' + 1);


            console.log(_itemArr);
            if (tag) {
                if (tag.TBNAME) {
                    index = emparray.indexOf(tag.value);
                } else {
                    index = emparray.indexOf(tag.value);
                }
                if (index >= indexOfBY) {
                    if (indexOfBY !== -1) {
                        for (var _index = 0; _index < emparray.length; _index++) {
                            if (_index >= indexOfBY) {
                                emparray.splice(_index, 1, 0);
                                temparray.splice(_index, 1, 0);
                                var options = { attrs: _itemArr[_index], relatedTarget: $(target).closest('.token') }
                                $('#typeahead').tokenfield('tokenfield:removetoken', options);
                            }
                        }
                    } else {
                        if (index > -1) {
                            emparray.splice(index, 1, 0);
                            temparray.splice(index, 1, 0);
                        }
                        //  console.log(i);
                    }
                } else {
                    if (index > -1) {
                        emparray.splice(index, 1, 0);
                        temparray.splice(index, 1, 0);
                    }
                    console.log(i);
                }
            }



        })








    /*$('#typeahead').on('itemAdded', function (event) {
        var tag = event.item;
        if (!isKeywordEntered) {
            if (tag.TBNAME === 'employee') {
                emparray.push(tag.NAME);
            } else if (tag.KEYWORD) {
                temparray.push(tag.KEYWORD);
                isKeywordEntered = true;
            }
        } else {
            if (tag.TBNAME === 'employee') {
                temparray.push(tag.NAME);
            } else if (tag.KEYWORD) {
                temparray.push(tag.KEYWORD);
            }
        }


    });




    $('input').on('itemRemoved', function (event) {
        document.getElementById("panel6").innerHTML = "";
    });*/
});




//Begin function button1_onclick
function button1_onclick(event) {
    var eventObject = event ? event : window.event;
    var ctrl = eventObject.target ? eventObject.target : eventObject.srcElement;
    //TODO: Add your event handler code here


    //alert("click");
    console.log(emparray);
    console.log(array);
    var _actionVar = '';
    var _byStr = '';
    var _print = 'PRINT';
    var _whereStr = '';
    var bykey;
    var wherekey;
    var countkey;
    var keyword = [];




    for (var l = 0; l < array.length; l++) {




        key = array[l];
        temparray[key] = 0;
        keyword = emparray[key];
        keywordArr.push(keyword);


        syskeyword(keyword);
    }




    function syskeyword(keywrd) {




        if (keywrd == "COUNT OF") {
            _print = "SUM";
            _actionVar = " " + "CNT." + emparray[key + 1];
            temparray[key + 1] = 0;
        }








        if (keywrd == "BY") {
            var bypos = emparray.indexOf('BY');
            var _tempByPos = bypos + 1;
            var byarray;
            var numberOfVarAfterBy = 0;
            numberOfVarAfterBy = emparray.length - _tempByPos;
            for (var xy = 0; xy < array.length; xy++) {
                if (array[xy] == bypos) {
                    byarray = xy;
                }
            }
            if (byarray == array.length - 1) {
                for (var x = 0; x < numberOfVarAfterBy; x++) {
                    _byStr += ' BY ' + emparray[bypos + 1];
                    temparray[bypos + 1] = 0;
                    bypos++;
                }


            }
        }








        if (keywrd == "WHERE") {
            wherekey = emparray[key + 1];
            temparray[key + 1] = 0;
            //  alert(wherekey);
            if (emparray[key + 2] == "IS EQUAL") {
                temparray[key + 2] = 0;
                temparray[key + 3] = 0;
                wherekey = wherekey + ' EQ ';
            }
            if (emparray[key + 2] == "IS LESS THAN") {
                temparray[key + 2] = 0;
                temparray[key + 3] = 0;
                wherekey = wherekey + ' LT ';
            }
            if (emparray[key + 2] == "IS GREATER THAN") {
                temparray[key + 2] = 0;
                temparray[key + 3] = 0;
                wherekey = wherekey + ' GT ';
            }
            if (emparray[key + 2] == "IS NOT EQUAL TO") {
                temparray[key + 2] = 0;
                temparray[key + 3] = 0;
                wherekey = wherekey + ' NQ ';
            }




            _whereStr = 'WHERE ' + wherekey + "'" + emparray[key + 3] + "'";
        }








    }






    for (m = 0; m < temparray.length; m++) {
        console.log(temparray[m]);
        if (isNaN(temparray[m])) {
            _actionVar += " " + temparray[m];
        }
    }




    var dynamicurl = "&FEXTYPE=TABLE&DATABASE=EMPLOYEE&ACTION=" + _print + "&ACTIONVARIABLE=" + _actionVar + "&BYSTRING=" + _byStr + "&WHERESTRING=" + _whereStr;
    //alert(dynamicurl);
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
            $("#panel6").empty();
            $("#panel6").append(_data);
        }
    });
}