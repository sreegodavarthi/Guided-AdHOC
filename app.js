        var records = new Bloodhound({
            datumTokenizer: function(records) {
                return Bloodhound.tokenizers.whitespace(records);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                //url: "http://localhost:8080/ibi_apps/run.bip?BIP_REQUEST_TYPE=BIP_RUN&BIP_folder=IBFS%253A%252FWFC%252FRepository%252FWIC&BIP_item=Procedure_Typeahead.fex&windowHandle=557714&IBI_random=6957.908128389036",
                url: "./data.json",
                filter: function(response) {
                    return response.records;
                }
            }
        });

        records.initialize();

        $('.typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'records',
            displayKey: function(records) {
                return records.NAME;
            },
            source: records.ttAdapter()
        });