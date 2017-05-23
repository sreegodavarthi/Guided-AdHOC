$(function() {
    var keywords = [];
    var items = [];

    $.when(
        $.get('../data/data.json', function(data) {
            items = data.records;
        }),

        $.get('../data/data1.json', function(data) {
            keywords = data.records;
        })
    ).then(function() {
        console.log(keywords);
        configureNames(items);
        //configureTypeahead();
    })

    function configureNames(items) {
        for (var i in items) {
            if (items.hasOwnProperty(i)) {
                items[i].value = i;
            }
        }
        var mydata = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('NAME'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: $.map(items, function(item, key) {
                return {
                    value: item.value,
                    NAME: item.NAME,
                    TBNAME: item.TBNAME
                };
            })
        });

        var mydata2 = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('KEYWORD'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: $.map(keywords, function(item, key) {
                return {
                    // value: item.value,
                    KEYWORD: item.KEYWORD,
                    // TBNAME: item.TBNAME
                };
            })
        });

        mydata.initialize();

        mydata2.initialize();
        // }

        // function configureTypeahead() {
        var elt = $('input');
        elt.materialtags({
                itemValue: 'value',
                itemText: 'NAME',
                tagClass: function(item) {
                    if (item.TBNAME === 'systemkeywords') {
                        return 'chip chip_green';
                    } else if (item.TBNAME === 'employee') {
                        return 'chip chip_blue';
                    } else if (item.TBNAME === 'empdata') {
                        return 'chip chip_maroon';
                    } else {
                        return 'chip chip_yellow';
                    }
                    /*
                                        else{
                                            if(item.KEYWORD){
                                                return 'chip chip_';
                                            }
                                        }*/
                },
                typeaheadjs: {
                    name: 'mydata',
                    displayKey: 'NAME',
                    source: mydata.ttAdapter(),
                    templates: {
                        empty: [
                            '<div class="empty-message">',
                            'Unable to find any match',
                            '</div>'
                        ].join('\n'),
                        suggestion: function(data) {
                            console.log(data);
                            var _suggestion = "<div>" +
                                data.NAME +
                                " in " +
                                data.TBNAME + "</div>";
                            return _suggestion
                        }
                    }
                    // }, {
                    /*name: 'mydata2',
                    displayKey: 'KEYWORD',
                    source: mydata2.ttAdapter(),*/
                    /* templates: {
                         empty: [
                             '<div class="empty-message">',
                             'Unable to find any match',
                             '</div>'
                         ].join('\n'),
                         suggestion: function(data) {
                             console.log(data);
                             var _suggestion = "<div>" +
                                 data.KEYWORD +
                                 "</div>";
                             return _suggestion;
                         }
                     }*/
                }
                //)
            },
            // {
            //     itemValue: 'value',
            //     itemText: 'KEYWORD',
            //     /*tagClass: function(item) {
            //         if (item.TBNAME === 'systemkeywords') {
            //             return 'chip chip_green';
            //         } else if (item.TBNAME === 'employee') {
            //             return 'chip chip_blue';
            //         } else if (item.TBNAME === 'empdata') {
            //             return 'chip chip_maroon';
            //         } else {
            //             return 'chip chip_yellow';
            //         }
            //     },*/
            //     typeaheadjs: {
            //         name: 'mydata2',
            //         displayKey: 'KEYWORD',
            //         source: mydata2.ttAdapter(),
            //         templates: {
            //             empty: [
            //                 '<div class="empty-message">',
            //                 'Unable to find any match',
            //                 '</div>'
            //             ].join('\n'),
            //             suggestion: function(data) {
            //                 console.log(data);
            //                 var _suggestion = "<div>" +
            //                     data.KEYWORD +
            //                     "</div>";
            //                 return _suggestion;
            //             }
            //         }
            //     }
            // }
        );
    }


    // var txtinput = document.getElementById("text");
    // var submitButton = document.getElementById("submitBtn");
    // // submitButton.disabled = true;

    // txtinput.addEventListener("click", function() {

    //     if (txtinput.value === "") {
    //         submitButton.disabled = true;
    //     } else {
    //         submitButton.disabled = false;
    //     }
    // });

    $('input').on('itemAdded', function(event) {
        var tag = event.item;
        if (tag.TBNAME === 'systemkeywords') {
            console.log(tag.TBNAME);
            var _chip = document.getElementsByClassName("chip");
        }
        if (tag.TBNAME === 'employee') {
            console.log(tag.TBNAME);
        }
        if (tag.TBNAME === 'empdata') {
            console.log(tag.TBNAME);
        }

    });

    $('input').on('itemRemoved', function(event) {
        var tag = event.item;
        if (tag.TBNAME === 'systemkeywords') {
            console.log(tag.TBNAME);
            var _chip = document.getElementsByClassName("chip");

        }
        if (tag.TBNAME === 'employee') {
            console.log(tag.TBNAME);
        }
        if (tag.TBNAME === 'empdata') {
            console.log(tag.TBNAME);
        }

    });

    //  });



});