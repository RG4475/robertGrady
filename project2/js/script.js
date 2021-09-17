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

    $('#addLocation').click(function() {
        addLocationModal.show();
    });

    $('#addDepartment').click(function() {
        addDepartmentModal.show();
    });

    $('#addPersonnel').click(function() {
        addPersonnelModal.show();
    });

    $('#modifyLocation').click(function() {
        modifyLocationModal.show();
    });

    $('#modifyDepartment').click(function() {
        modifyDepartmentModal.show();
    });

    $('#modifyPersonnel').click(function() {
        modifyPersonnelModal.show();
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

                /*
                var hiddenDepartmentID = document.createElement("input");
                var hiddenDeptIDText = document.createAttribute("type");
                */


                var departmentTable = document.getElementById("departmentTable");
                departmentTable.getElementsByTagName("tbody")[0].appendChild(newDepartmentRow);
                }
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
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {

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
                $('#errorMessage').html(result['data'].length);
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {

        }
    })
});