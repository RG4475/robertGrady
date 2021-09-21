function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();

    for(let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for(let element of data) {
        let row = table.insertRow();
        for(key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

function generateChosenTable(table, data) {

    let chosenData = data;

    let chosenTable = document.querySelector(table);
    let chosenKeys = Object.keys(chosenData[0]);
    generateTable(chosenTable, chosenData);
    generateTableHead(chosenTable, chosenKeys);
}

function generateButton(att1, val1, att2, val2, att3, val3, nodeText, tableSelect) {
    let addButton = document.createElement("button");
    let attributeType = document.createAttribute(att1);
    attributeType.value = val1;
    addButton.setAttributeNode(attributeType);

    attributeType = document.createAttribute(att2);
    attributeType.value = val2;
    addButton.setAttributeNode(attributeType);

    attributeType = document.createAttribute(att3);
    attributeType.value = val3;
    addButton.setAttributeNode(attributeType);

    let buttonText = document.createTextNode(nodeText);
    addButton.appendChild(buttonText);

    let findTable = document.getElementById(tableSelect);
    let headerRow = findTable.getElementsByTagName("tr")[0];
    let firstHeader = headerRow.getElementsByTagName("th")[0].appendChild(addButton);
}

$(window).on('load', function() {
    if($('#preloader').length) {
        $('#preloader').delay(500).fadeOut('slow', function() {
            $(this).remove();
        });
    }

    var addLocationModal = new bootstrap.Modal(document.getElementById('addLocationModal'), {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    var addDepartmentModal = new bootstrap.Modal(document.getElementById('addDepartmentModal'), {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    var addPersonnelModal = new bootstrap.Modal(document.getElementById('addPersonnelModal'), {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    var modifyLocationModal = new bootstrap.Modal(document.getElementById('modifyLocationModal'), {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    var modifyDepartmentModal = new bootstrap.Modal(document.getElementById('modifyDepartmentModal'), {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    var modifyPersonnelModal = new bootstrap.Modal(document.getElementById('modifyPersonnelModal'), {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: 'GET',
        dataType: 'json',

        success: function(result, status, xhr) {
            console.log(JSON.stringify(result));

            if(result.status.name == "ok")
            {
                //$('#errorMessage').html(result['data'].length);

                generateChosenTable("table#departmentTable", result['data']);

                generateButton("type", "button", "class", "btn btn-success", "id", "addDepartment", "Add", "departmentTable");
                generateButton("type", "button", "class", "btn btn-success", "id", "modifyDepartment", "Modify", "departmentTable");

                for(let i = 0; i < result['data'].length; i++)
                {
                    $('.departmentIDSelect').append('<option value=' + result['data'][i]['id'] + '>' + result['data'][i]['id'] + ' - ' + result['data'][i]['name'] + '</option>');
                }

                /*
                let highestid = result['data'][result['data'].length - 1]['id'];

                if(highestid < 20)
                {
                    $('#newDepartmentID').val(20);
                }
                else
                {
                    highestid = parseInt(result['data'][result['data'].length - 1]['id'], 10);
                    $('#newDepartmentID').val(highestid + 1);
                }
                */


                $('#addDepartment').click(function() {
                    addDepartmentModal.show();
                });

                $('#modifyDepartment').click(function() {
                    modifyDepartmentModal.show();
                });
                /*
                let addButton = document.createElement("button");
                let attributeType = document.createAttribute("type");
                attributeType.value = "button";
                addButton.setAttributeNode(attributeType);

                attributeType = document.createAttribute("class");
                attributeType.value = "btn btn-success";
                addButton.setAttributeNode(attributeType);

                attributeType = document.createAttribute("id");
                attributeType.value = "addDepartment";
                addButton.setAttributeNode(attributeType);

                let buttonText = document.createTextNode("Add");
                addButton.appendChild(buttonText);

                let departmentTable = document.getElementById("departmentTable");
                deptTableFirstRow = departmentTable.getElementsByTagName("tr")[0];
                let firstHeader = deptTableFirstRow.getElementsByTagName("th")[0].appendChild(addButton);

                */

                /*
                for(let i = 0; i < result['data'].length; i++)
                {
                var newDepartmentRow = document.createElement("tr");
                var insertDepartmentID = document.createElement("th");
                var IDtext = document.createTextNode(result['data'][i]['id']);
                insertDepartmentID.appendChild(IDtext);
                newDepartmentRow.appendChild(insertDepartmentID);

                var insertDepartmentName = document.createElement("td");
                var departmentNameText = document.createTextNode(result['data'][i]['name']);
                insertDepartmentName.appendChild(departmentNameText);
                newDepartmentRow.appendChild(insertDepartmentName);

                var insertDepartmentlocationID = document.createElement("td");
                var locationIDText = document.createTextNode(result['data'][i]['locationID']);
                insertDepartmentlocationID.appendChild(locationIDText);
                newDepartmentRow.appendChild(insertDepartmentlocationID);

                */

                /*
                var departmentTable = document.getElementById("departmentTable");
                departmentTable.getElementsByTagName("tbody")[0].appendChild(newDepartmentRow);
                */
                //}

                /*PLACE THE CODE IN THIS COMMENT INSIDE THE FOR LOOP IF UNCOMMENTING
                var hiddenDepartmentID = document.createElement("input");
                var hiddenDeptIDText = document.createAttribute("type");
                */

                /*
                for(let i = 0; i < result['data'].length; i++)
                {
                    dept = i + 1;
                    $("#departmentTable tbody").append($("tr"));
                    $("#departmentTable tbody tr:nth-child(1)").append($("th"));
                    $("#departmentTable tbody tr:nth-child(1) th:nth-child(1)").html("Yellow Pages");
                }
                */
            }
        },

        error: function(jqXHR, textStatus, errorThrown){
            JSON.stringify(jqXHR);
            JSON.stringify(errorThrown);

            $('#errorMessage').html(jqXHR + errorThrown);
        }

    });

    $.ajax({
        url: "libs/php/getAllPersonnel.php",
        type: 'GET',
        dataType: 'json',

        success: function(result, status, xhr) {
            console.log(JSON.stringify(result));

            if(result.status.name == "ok")
            {
                //$('#errorMessage').html(result['data'].length);

                generateChosenTable("table#personnelTable", result['data']);

                generateButton("type", "button", "class", "btn btn-success", "id", "addPersonnel", "Add", "personnelTable");
                generateButton("type", "button", "class", "btn btn-success", "id", "modifyPersonnel", "Modify", "personnelTable");

                $('#newPersonnelID').val(result['data'].length + 1);

                $('#addPersonnel').click(function() {
                    addPersonnelModal.show();
                });

                $('#modifyPersonnel').click(function() {
                    modifyPersonnelModal.show();
                });


            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            JSON.stringify(jqXHR);
            JSON.stringify(errorThrown);

            $('#errorMessage').html(jqXHR + errorThrown);
        }
    });

    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: 'GET',
        dataType: 'json',

        success: function(result, status, xhr) {
            console.log(JSON.stringify(result));

            if(result.status.name == "ok")
            {
                //('#errorMessage').html(result['data'].length);

                generateChosenTable("table#locationTable", result['data']);

                generateButton("type", "button", "class", "btn btn-success", "id", "addLocation", "Add", "locationTable");
                generateButton("type", "button", "class", "btn btn-success", "id", "modifyLocation", "Modify", "locationTable");

                for(let i = 0; i < result['data'].length; i++)
                {
                    $('.locationIDSelect').append('<option value=' + result['data'][i]['id'] + '>' + result['data'][i]['id'] + ' - ' + result['data'][i]['name'] + '</option>');
                }

                $('#newLocationID').val(result['data'].length + 1);

                /*

                let addToLocationDropDowns = document.createElement("option");

                let locationOptionAttr = document.createAttribute("value");
                locationOptionAttr.value = "London";
                addToLocationDropDowns.setAttributeNode(locationOptionAttr);

                let locationTextNode = document.createTextNode("London");
                addToLocationDropDowns.appendChild(locationTextNode);

                locationSelectDropDowns.appendChild(addToLocationDropDowns);

                addToLocationDropDowns = document.createElement("option");

                locationOptionAttr = document.createAttribute("value");
                locationOptionAttr.value = "Paris";
                addToLocationDropDowns.setAttributeNode(locationOptionAttr);

                locationTextNode = document.createTextNode("Paris");
                addToLocationDropDowns.appendChild(locationTextNode);

                locationSelectDropDowns.appendChild(addToLocationDropDowns);

                */

                $('#addLocation').click(function() {
                    addLocationModal.show();
                });

                $('#modifyLocation').click(function() {
                    modifyLocationModal.show();
                });
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            JSON.stringify(jqXHR);
            JSON.stringify(errorThrown);

            $('#errorMessage').html(jqXHR + errorThrown);
        }
    });

    $('#addDepartment').click(function() {

        let departmentName = $('#newDepartmentName').val();
        let chosenLocationID = $('#locationIDSelectAdd').val();

        if(departmentName && chosenLocationID)
        {

            $.ajax({
                url: "libs/php/insertDepartment.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    name: departmentName,
                    locationID: chosenLocationID
                },

                success: function(result, status, xhr) {
                    console.log(JSON.stringify(result));

                    if(result.status.name == "ok") {
                        location.reload();
                    }
                },

                error: function(jqXHR, textStatus, errorThrown) {
                    JSON.stringify(jqXHR);
                    JSON.stringify(errorThrown);
        
                    $('#errorMessage').html(jqXHR + errorThrown);
                }
            });
        }
        else
        {
            
            $('#errorMessage strong').html("The new Department details were not sent because you were missing the Department Name or Location ID");
            addDepartmentModal.show();
        }
    });

    $('#addLocation').click(function() {

        let locationName = $('#newLocationName').val();

        if(locationName)
        {
            $.ajax({
                url: "libs/php/insertLocation.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    name: locationName
                },

                success: function(result, status, xhr) {
                    console.log(JSON.stringify(result));

                    if(result.status.name == "ok")
                    {
                        location.reload();
                    }
                },

                error: function(jqXHR, textStatus, errorThrown) {
                    JSON.stringify(jqXHR);
                    JSON.stringify(errorThrown);
        
                    $('#errorMessage').html(jqXHR + errorThrown);
                }
            });
        }
        else
        {
            $('#errorMessage strong').html("The new Location details were not sent because you were missing the Location Name");
        }
    });
});