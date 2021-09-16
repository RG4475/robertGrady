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

    $('#addLocation').click(function() {
        addLocationModal.show();
    });

    $('#addDepartment').click(function() {
        addDepartmentModal.show();
    });

    $('#addPersonnel').click(function() {
        addPersonnelModal.show();
    });
    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: 'GET',
        dataType: 'json',

        success: function(result, status, xhr) {
            console.log(JSON.stringify(result));

            if(result.status.name == "ok")
            {
                $('#errorMessage').html(result['data'].length);
                
                for(let i = 0; i < result['data'].length; i++)
                {
                var newDepartmentRow = document.createElement("tr");
                var newDepartmentID = document.createElement("th");
                var IDtext = document.createTextNode(result['data'][i]['id']);
                newDepartmentID.appendChild(IDtext);
                newDepartmentRow.appendChild(newDepartmentID);

                var newDepartmentName = document.createElement("td");
                var departmentNameText = document.createTextNode(result['data'][i]['name']);
                newDepartmentName.appendChild(departmentNameText);
                newDepartmentRow.appendChild(newDepartmentName);

                var newDepartmentlocationID = document.createElement("td");
                var locationIDText = document.createTextNode(result['data'][i]['locationID']);
                newDepartmentlocationID.appendChild(locationIDText);
                newDepartmentRow.appendChild(newDepartmentlocationID);

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
        }

    })
});