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

function deleteTableRows(table) {
    document.getElementById(table).deleteTHead();
    $('#' + table).find("tbody").remove();
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

                generateChosenTable("table#departmentTable", result['data']);

                for(let i = 0; i < result['data'].length; i++)
                {
                    $('.departmentIDSelect').append('<option value=' + result['data'][i]['id'] + '>' + result['data'][i]['id'] + ' - ' + result['data'][i]['name'] + '</option>');
                }

                let findHighestID = result['data'].length - 1;
                $('#newDepartmentID').val(parseInt(result['data'][findHighestID]['id']) + 1);

                $('#newDepartment').click(function() {
                    addDepartmentModal.show();
                });

                $('#departmentTable tbody tr').on("click", function() {

                    let chosenDeptId = $(this).find('td:nth-child(1)').html();
                    let chosenDeptName = $(this).find('td:nth-child(2)').html();
                    let chosenLocID = $(this).find('td:nth-child(3)').html();

                    $('#modifyDepartmentID').val(chosenDeptId);
                    $('#modifyDepartmentName').val(chosenDeptName);
                    $('#currentLocationID').html(chosenLocID);

                    modifyDepartmentModal.show();
                });

            }
        },

        error: function(jqXHR, textStatus, errorThrown){
            JSON.stringify(jqXHR);
            JSON.stringify(errorThrown);

            $('#errorMessage').html(jqXHR + errorThrown);
        }

    });

    $.ajax({
        url: "libs/php/getAll.php",
        type: 'GET',
        dataType: 'json',

        success: function(result, status, xhr) {
            console.log(JSON.stringify(result));

            if(result.status.name == "ok")
            {

                generateChosenTable("table#personnelTable", result['data']);

                let findHighestID = result['data'].length - 1;
                $('#newPersonnelID').val(parseInt(result['data'][findHighestID]['id']) + 1);

                $('#newPersonnel').click(function() {
                    addPersonnelModal.show();
                });

                $('#personnelTable tbody tr').on("click", function() {

                    let chosenPersonID = $(this).find('td:nth-child(1)').html();
                    let chosenPersonLastName = $(this).find('td:nth-child(2)').html();
                    let chosenPersonFirstName = $(this).find('td:nth-child(3)').html();
                    let chosenJobTitle = $(this).find('td:nth-child(4)').html();
                    let chosenEmail = $(this).find('td:nth-child(5)').html();
                    let chosenDepartment = $(this).find('td:nth-child(6)').html();

                    $('#modifyPersonnelID').val(chosenPersonID);
                    $('#modifyPersonnelFirstName').val(chosenPersonFirstName);
                    $('#modifyPersonnelLastName').val(chosenPersonLastName);
                    $('#modifyPersonnelJobTitle').val(chosenJobTitle);
                    $('#modifyPersonnelEmail').val(chosenEmail);
                    $('#currentDepartment').html(chosenDepartment);

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

                generateChosenTable("table#locationTable", result['data']);

                for(let i = 0; i < result['data'].length; i++)
                {
                    $('.locationIDSelect').append('<option value=' + result['data'][i]['id'] + '>' + result['data'][i]['id'] + ' - ' + result['data'][i]['name'] + '</option>');
                }

                let findHighestID = result['data'].length - 1;
                $('#newLocationID').val(parseInt(result['data'][findHighestID]['id']) + 1);

                $('#newLocation').click(function() {
                    addLocationModal.show();
                });

                $('#locationTable tbody tr').on("click", function() {

                    let chosenLocationID = $(this).find('td:nth-child(1)').html();
                    let chosenLocationName = $(this).find('td:nth-child(2)').html();

                    $('#modifyLocationID').val(chosenLocationID);
                    $('#modifyLocationName').val(chosenLocationName);
                    
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

        let departmentID = $('#newDepartmentID').val();
        let departmentName = $('#newDepartmentName').val();
        let chosenLocationID = $('#locationIDSelectAdd').val();

        if(departmentName && chosenLocationID)
        {

            $.ajax({
                url: "libs/php/insertDepartment.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    id: departmentID,
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
            
            $('#addDepartmentError strong').html("The new Department details were not sent because you were missing the Department Name or Location ID");
        }
    });

    $('#addLocation').click(function() {

        let locationID = $('#newLocationID').val();
        let locationName = $('#newLocationName').val();

        if(locationName)
        {
            $.ajax({
                url: "libs/php/insertLocation.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    id: locationID,
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
            $('#addLocationError strong').html("The new Location details were not sent because you were missing the Location Name");
        }
    });

    $('#addPersonnel').click(function() {

        let personnelID = $('#newPersonnelID').val();
        let personnelFirstName = $('#newPersonnelFirstName').val();
        let personnelLastName = $('#newPersonnelLastName').val();
        let personnelJobTitle = $('#newPersonnelJobTitle').val();
        let personnelEmail = $('#newPersonnelEmail').val();
        let personnelDepartment = $('#departmentIDSelectAdd').val();

        if(personnelFirstName && personnelLastName && personnelEmail && personnelDepartment)
        {
            $.ajax({
                url: "libs/php/insertPersonnel.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    id: personnelID,
                    firstName: personnelFirstName,
                    lastName: personnelLastName,
                    jobTitle: personnelJobTitle,
                    email: personnelEmail,
                    departmentID: personnelDepartment
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
            $('#addPersonnelError strong').html("The new Personnel details were not sent because you were missing some bits of information. Everything but the Job Title is required");
        }
    });

    $('#modifyLocation').click(function() {
        let selectedLocationID = $('#modifyLocationID').val();
        let modifiedLocationName = $('#modifyLocationName').val();

        if(selectedLocationID && modifiedLocationName)
        {
            let confirmLocationModify = confirm("Are you sure you wish to proceed modifying this location?");

            if(confirmLocationModify)
            {
                $.ajax({
                    url: "libs/php/modifyLocation.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        name: modifiedLocationName,
                        id: selectedLocationID
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
                $('#modifyLocationError strong').html("LOCATION ID " + selectedLocationID + " NOT UPDATED");
            }
        }
        else
        {
            $('#modifyLocationError strong').html("Location ID " + selectedLocationID + " was not updated because you were missing the Location Name");
        }
    });

    $('#modifyDepartment').click(function() {
        let selectedDepartmentID = $('#modifyDepartmentID').val();
        let modifiedDepartmentName = $('#modifyDepartmentName').val();
        let modifiedLocationID = $('#locationIDSelectModify').val();

        if(selectedDepartmentID && modifiedDepartmentName && modifiedLocationID)
        {
            let confirmDepartmentModify = confirm("Are you sure you wish to proceed modifying this department?");

            if(confirmDepartmentModify)
            {
                $.ajax({
                    url: "libs/php/modifyDepartment.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        name: modifiedDepartmentName,
                        locationID: modifiedLocationID,
                        id: selectedDepartmentID
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
                $('#modifyDepartmentError strong').html("DEPARTMENT ID " + selectedDepartmentID + " NOT UPDATED");
            }
        }
        else
        {
            $('#modifyDepartmentError strong').html("Department ID " + selectedDepartmentID + " was not updated because you were missing either the department name or location ID");
        }
    });

    $('#modifyPersonnel').click(function() {
        let selectedPersonnelID = $('#modifyPersonnelID').val();
        let modifiedPersonnelFirstName = $('#modifyPersonnelFirstName').val();
        let modifiedPersonnelLastName = $('#modifyPersonnelLastName').val();
        let modifiedPersonnelJobTitle = $('#modifyPersonnelJobTitle').val();
        let modifiedPersonnelEmail = $('#modifyPersonnelEmail').val();
        let modifiedDepartmentID = $('#departmentIDSelectModify').val();

        if(selectedPersonnelID && modifiedPersonnelFirstName && modifiedPersonnelLastName && modifiedPersonnelEmail && modifiedDepartmentID)
        {
            let confirmPersonnelModify = confirm("Are you sure you wish to proceed modifying this personnel?");

            if(confirmPersonnelModify)
            {
                $.ajax({
                    url: "libs/php/modifyPersonnel.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        firstName: modifiedPersonnelFirstName,
                        lastName: modifiedPersonnelLastName,
                        jobTitle: modifiedPersonnelJobTitle,
                        email: modifiedPersonnelEmail,
                        departmentID: modifiedDepartmentID,
                        id: selectedPersonnelID
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
                $('#modifyPersonnelError strong').html("PERSONNEL ID " + selectedPersonnelID + " NOT UPDATED");
            }
        }
        else
        {
            $('#modifyPersonnelError strong').html("Personnel ID " + selectedPersonnelID + " was not updated because you were missing some information. All fields except for Job Title are required");
        }
    });

    $('#deletePersonnel').click(function() {
        let deletePersonnel = $('#modifyPersonnelID').val();

        if(deletePersonnel)
        {
            let confirmPersonnelDeletion = confirm("Are you sure you wish to delete this personnel?");

            if(confirmPersonnelDeletion)
            {
                $.ajax({
                    url: "libs/php/deletePersonnelByID.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id: deletePersonnel
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
                $('#modifyPersonnelError strong').html("PERSONNEL ID " + deletePersonnel + " NOT DELETED");
            }
        }
        else
        {
            $('#modifyPersonnelError strong').html("No personnel deleted because you have forgotten the personnel ID");
        }
    });

    $('#deleteDepartment').click(function() {
        let deleteDepartment = $('#modifyDepartmentID').val();

        if(deleteDepartment)
        {
            let confirmDepartmentDeletion = confirm("Are you sure you wish to delete this department?");

            if(confirmDepartmentDeletion)
            {
                $.ajax({
                    url: "libs/php/findDepartment.php",
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        id: deleteDepartment
                    },

                    success: function(result, status, xhr) {
                        console.log(JSON.stringify(result));

                        if(result.status.name == "ok")
                        {
                            if(result['data'].length == 0)
                            {
                                $.ajax({
                                    url: "libs/php/deleteDepartmentByID.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        id: deleteDepartment
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
                                $('#modifyDepartmentError strong').html("Department ID " + deleteDepartment + " cannot be deleted as there are still some personnel who work at this department");
                            }
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
                $('#modifyDepartmentError strong').html("DEPARTMENT ID " + deleteDepartment + " NOT DELETED");
            }
        }
        else
        {
            $('#modifyDepartmentError strong').html("No department deleted because you have forgotten the Department ID");
        }
    });

    $('#deleteLocation').click(function() {
        let deleteLocation = $('#modifyLocationID').val();

        if(deleteLocation)
        {
            let confirmLocationDeletion = confirm("Are you sure you wish to delete this location?");

            if(confirmLocationDeletion)
            {
                $.ajax({
                    url: "libs/php/findLocation.php",
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        id: deleteLocation
                    },

                    success: function(result, status, xhr) {
                        console.log(JSON.stringify(result));

                        if(result.status.name == "ok")
                        {
                            if(result['data'].length == 0)
                            {
                                $.ajax({
                                    url: "libs/php/findPersonnelInLocation.php",
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {
                                        locationId: deleteLocation
                                    },

                                    success: function(result, status, xhr) {
                                        console.log(JSON.stringify(result));

                                        if(result.status.name == "ok")
                                        {
                                            if(result['data'].length == 0)
                                            {
                                                $.ajax({
                                                    url: "libs/php/deleteLocationByID.php",
                                                    type: 'POST',
                                                    dataType: 'json',
                                                    data: {
                                                        id: deleteLocation
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
                                                $('#modifyLocationError strong').html("Location ID " + deleteLocation + " cannot be deleted as there are still some personnel who work at this location");
                                            }
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
                                $('#modifyLocationError strong').html("Location ID " + deleteLocation + " cannot be deleted as there are still some departments at this location");
                            }
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
                $('#modifyLocationError strong').html("LOCATION ID " + deleteLocation + " NOT DELETED");
            }
        }
        else
        {
            $('#modifyLocationError strong').html("No location deleted because you have forgotten the Location ID");
        }
    });

    $('#personnelSearcher').change(function() {

        deleteTableRows("personnelTable");

        let personnelSearchCondition = $('#personnelSearcher').val();

        if(personnelSearchCondition)
        {
            $.ajax({
                url: "libs/php/searchPersonnel.php",
                type: 'GET',
                dataType: 'json',
                data: {
                    id: personnelSearchCondition,
                    lastName: personnelSearchCondition,
                    firstName: personnelSearchCondition,
                    jobTitle: personnelSearchCondition,
                    email: personnelSearchCondition,
                    dName: personnelSearchCondition,
                    lName: personnelSearchCondition
                },

                success: function(result, status, xhr) {
                    console.log(JSON.stringify(result));

                    generateChosenTable("table#personnelTable", result['data']);

                    $('#personnelTable tbody tr').on("click", function() {

                        let chosenPersonID = $(this).find('td:nth-child(1)').html();
                        let chosenPersonLastName = $(this).find('td:nth-child(2)').html();
                        let chosenPersonFirstName = $(this).find('td:nth-child(3)').html();
                        let chosenJobTitle = $(this).find('td:nth-child(4)').html();
                        let chosenEmail = $(this).find('td:nth-child(5)').html();
                        let chosenDepartment = $(this).find('td:nth-child(6)').html();
    
                        $('#modifyPersonnelID').val(chosenPersonID);
                        $('#modifyPersonnelFirstName').val(chosenPersonFirstName);
                        $('#modifyPersonnelLastName').val(chosenPersonLastName);
                        $('#modifyPersonnelJobTitle').val(chosenJobTitle);
                        $('#modifyPersonnelEmail').val(chosenEmail);
                        $('#currentDepartment').html(chosenDepartment);
    
                        modifyPersonnelModal.show();
                    });
                },

                error: function(jqXHR, textStatus, errorThrown) {
                    JSON.stringify(jqXHR);
                    JSON.stringify(errorThrown);
        
                    $('#errorMessage').html(jqXHR + errorThrown);
                }
            });
        }

    });

    $('#departmentSearcher').change(function() {
        deleteTableRows("departmentTable");

        let departmentSearchCondition = $('#departmentSearcher').val();

        if(departmentSearchCondition)
        {
            $.ajax({
                url: "libs/php/searchDepartment.php",
                type: 'GET',
                dataType: 'json',
                data: {
                    id: departmentSearchCondition,
                    dName: departmentSearchCondition,
                    lName: departmentSearchCondition
                },

                success: function(result, status, xhr) {
                    console.log(JSON.stringify(result));

                    generateChosenTable("table#departmentTable", result['data']);

                    $('#departmentTable tbody tr').on("click", function() {

                        let chosenDeptId = $(this).find('td:nth-child(1)').html();
                        let chosenDeptName = $(this).find('td:nth-child(2)').html();
                        let chosenLocID = $(this).find('td:nth-child(3)').html();
    
                        $('#modifyDepartmentID').val(chosenDeptId);
                        $('#modifyDepartmentName').val(chosenDeptName);
                        $('#currentLocationID').html(chosenLocID);
    
                        modifyDepartmentModal.show();
                    });
                },

                error: function(jqXHR, textStatus, errorThrown) {
                    JSON.stringify(jqXHR);
                    JSON.stringify(errorThrown);
        
                    $('#errorMessage').html(jqXHR + errorThrown);
                }
            });
        }
    });

    $('#locationSearcher').change(function() {
        deleteTableRows("locationTable");

        let locationSearchCondition = $('#locationSearcher').val();

        if(locationSearchCondition)
        {
            $.ajax({
                url: "libs/php/searchLocation.php",
                type: 'GET',
                dataType: 'json',
                data: {
                    id: locationSearchCondition,
                    name: locationSearchCondition
                },

                success: function(result, status, xhr) {
                    console.log(JSON.stringify(result));

                    generateChosenTable("table#locationTable", result['data']);

                    $('#locationTable tbody tr').on("click", function() {

                        let chosenLocationID = $(this).find('td:nth-child(1)').html();
                        let chosenLocationName = $(this).find('td:nth-child(2)').html();
    
                        $('#modifyLocationID').val(chosenLocationID);
                        $('#modifyLocationName').val(chosenLocationName);
                        
                        modifyLocationModal.show();
                    });

                },

                error: function(jqXHR, textStatus, errorThrown) {
                    JSON.stringify(jqXHR);
                    JSON.stringify(errorThrown);
        
                    $('#errorMessage').html(jqXHR + errorThrown);
                }
            });
        }
    });

    $('#clearPersonnelSearch').click(function() {
        location.reload();
    });

    $('#clearDepartmentSearch').click(function() {
        location.reload();
    });

    $('#clearLocationSearch').click(function() {
        location.reload();
    });


});