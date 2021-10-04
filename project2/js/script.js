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
        for(let key in element) {

            let cell;

            if(table != "table#personnelTable tbody" && key != "firstName")
            {
                cell = row.insertCell();
            }
            let text = document.createTextNode(element[key]);

            if(table != "table#personnelTable tbody" && key != "firstName")
            {
                cell.appendChild(text);
            }
            else
            {
                let tableID = document.getElementById('personnelTable');
                let tableBody = tableID.getElementsByTagName('tbody')[0];
                let tableRows = tableBody.getElementsByTagName('tr');

                for(let i = 0; i < tableRows.length; i++)
                {
                    let chosenRow = tableRows[i].getElementsByTagName('td')[1];

                    let space = document.createTextNode(" ");

                    chosenRow.appendChild(space);
                    chosenRow.appendChild(text);
                }
            }

        }
    }
}

function generateChosenTable(table, data) {

    let chosenData = data;

    let chosenTable = document.querySelector(table);
    let chosenKeys = Object.keys(chosenData[0]);
    generateTable(chosenTable, chosenData);
}

function deleteTableRows(table) {
    $('#' + table).find("tr").remove();
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

    var confirmModifyingLocation = new bootstrap.Modal(document.getElementById('confirmModifyLocation'), {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    var confirmModifyingDepartment = new bootstrap.Modal(document.getElementById('confirmModifyDepartment'), {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    var confirmModifyingPersonnel = new bootstrap.Modal(document.getElementById('confirmModifyPersonnel'), {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    var confirmDeletingPersonnel = new bootstrap.Modal(document.getElementById('confirmDeletePersonnel'), {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    var confirmDeletingDepartment = new bootstrap.Modal(document.getElementById('confirmDeleteDepartment'), {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    var confirmDeletingLocation = new bootstrap.Modal(document.getElementById('confirmDeleteLocation'), {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    var preventDeletingDepartment = new bootstrap.Modal(document.getElementById('preventDeleteDepartment'), {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    var preventDeletingLocation = new bootstrap.Modal(document.getElementById('preventDeleteLocation'), {
        backdrop: true,
        keyboard: true,
        focus: true
    });

    $.ajax({
        url: "libs/php/getAll.php",
        type: 'GET',
        dataType: 'json',

        success: function(result, status, xhr) {
            console.log(JSON.stringify(result));

            if(result.status.name == "ok")
            {

                generateChosenTable("table#personnelTable tbody", result['data']);
                $('table#personnelTable tbody tr td:nth-child(1)').hide();

                let findHighestID = result['data'].length - 1;
                $('#newPersonnelID').val(parseInt(result['data'][findHighestID]['id']) + 1);

                $('#newPersonnel').click(function() {
                    addPersonnelModal.show();
                });

                $('#personnelTable tbody tr').on("click", function() {

                    let chosenPersonID = $(this).find('td:nth-child(1)').html();
                    let chosenPersonLastName;
                    let chosenPersonFirstName;
                    let chosenJobTitle;
                    let chosenEmail;
                    let chosenDepartment;

                    $.ajax({
                        url: "libs/php/getPersonnelByID.php",
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            id: chosenPersonID
                        },

                        success: function(result, status, xhr) {
                            console.log(JSON.stringify(result));

                            if(result.status.name == "ok")
                            {
                                chosenPersonID = result['data']['personnel'][0]['id'];
                                chosenPersonLastName = result['data']['personnel'][0]['lastName'];
                                chosenPersonFirstName = result['data']['personnel'][0]['firstName'];
                                chosenJobTitle = result['data']['personnel'][0]['jobTitle'];
                                chosenEmail = result['data']['personnel'][0]['email'];
                                chosenDepartment = result['data']['personnel'][0]['departmentID'];

                                for(let i = 0; i < result['data']['department'].length; i++)
                                {
                                    let noOfDeptOptions = $('#departmentIDSelectModify option').length;
                                    let deptsReturnedFromDatabase = result['data']['department'].length;

                                    if(noOfDeptOptions < deptsReturnedFromDatabase)
                                    {
                                        $('#departmentIDSelectModify').append('<option value=' + result['data']['department'][i]['id'] + '>' + result['data']['department'][i]['name'] + '</option>');
                                    }
                                }

                                $('#modifyPersonnelID').val(chosenPersonID);
                                $('#modifyPersonnelFirstName').val(chosenPersonFirstName);
                                $('#modifyPersonnelLastName').val(chosenPersonLastName);
                                $('#modifyPersonnelJobTitle').val(chosenJobTitle);
                                $('#modifyPersonnelEmail').val(chosenEmail);
                                $('#departmentIDSelectModify').val(chosenDepartment)

                                modifyPersonnelModal.show();
                            }
                        },

                        error: function(jqXHR, textStatus, errorThrown){
                            JSON.stringify(jqXHR);
                            JSON.stringify(errorThrown);
                
                            $('#errorMessage').html(jqXHR + errorThrown);
                        }
                    });
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
        url: "libs/php/getAllDepartments.php",
        type: 'GET',
        dataType: 'json',

        success: function(result, status, xhr) {
            console.log(JSON.stringify(result));

            if(result.status.name == "ok")
            {

                generateChosenTable("table#departmentTable tbody", result['data']);
                $('table#departmentTable tbody tr td:nth-child(1)').hide();

                for(let i = 0; i < result['data'].length; i++)
                {
                    let noOfDeptOptions = $('#departmentIDSelectAdd option').length;
                    let deptsReturnedFromDatabase = result['data'].length;

                    if(noOfDeptOptions < deptsReturnedFromDatabase)
                    {
                        $('#departmentIDSelectAdd').append('<option value=' + result['data'][i]['id'] + '>' + result['data'][i]['name'] + '</option>');
                    }
                }

                let findHighestID = result['data'].length - 1;
                $('#newDepartmentID').val(parseInt(result['data'][findHighestID]['id']) + 1);

                $('#newDepartment').click(function() {
                    addDepartmentModal.show();
                });

                $('#departmentTable tbody tr').on("click", function() {

                    let chosenDeptID = $(this).find('td:nth-child(1)').html();
                    let chosenDeptName;
                    let chosenLocID;

                    $.ajax({
                        url: "libs/php/getDepartmentByID.php",
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            id: chosenDeptID
                        },

                        success: function(result, status, xhr) {
                            console.log(JSON.stringify(result));

                            if(result.status.name == "ok")
                            {
                                chosenDeptID = result['data']['department'][0]['id'];
                                chosenDeptName = result['data']['department'][0]['name'];
                                chosenLocID = result['data']['department'][0]['locationID'];

                                for(let i = 0; i < result['data']['location'].length; i++)
                                {
                                    let noOfLocOptions = $('#locationIDSelectModify option').length;
                                    let locsReturnedFromDatabase = result['data']['location'].length;

                                    if(noOfLocOptions < locsReturnedFromDatabase)
                                    {
                                        $('#locationIDSelectModify').append('<option value=' + result['data']['location'][i]['id'] + '>' + result['data']['location'][i]['name'] + '</option>');
                                    }
                                }

                                $('#modifyDepartmentID').val(chosenDeptID);
                                $('#modifyDepartmentName').val(chosenDeptName);
                                $('#locationIDSelectModify').val(chosenLocID)

                                $.ajax({
                                    url: "libs/php/findDepartment.php",
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {
                                        id: chosenDeptID
                                    },
                
                                    success: function(result, status, xhr) {
                                        console.log(JSON.stringify(result));
                
                                        if(result.status.name == "ok")
                                        {
                                            if(result['data'][0]['personnelInDepartment'] != 0)
                                            {
                                                $('#modifyDepartmentError strong').html("This department has personnel working here");
                                            }
                                            else
                                            {
                                                $('#modifyDepartmentError strong').html("");
                                            }
                                        }
                                    },

                                    error: function(jqXHR, textStatus, errorThrown){
                                        JSON.stringify(jqXHR);
                                        JSON.stringify(errorThrown);
                            
                                        $('#errorMessage').html(jqXHR + errorThrown);
                                    }
                                });
            
                                modifyDepartmentModal.show();
                            }
                        }
                    });


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
        url: "libs/php/getAllLocations.php",
        type: 'GET',
        dataType: 'json',

        success: function(result, status, xhr) {
            console.log(JSON.stringify(result));

            if(result.status.name == "ok")
            {

                generateChosenTable("table#locationTable tbody", result['data']);
                $('table#locationTable tbody tr td:nth-child(1)').hide();

                for(let i = 0; i < result['data'].length; i++)
                {
                    let noOfLocOptions = $('#locationIDSelectAdd option').length;
                    let locsReturnedFromDatabase = result['data'].length;

                    if(noOfLocOptions < locsReturnedFromDatabase)
                    {
                        $('#locationIDSelectAdd').append('<option value=' + result['data'][i]['id'] + '>' + result['data'][i]['name'] + '</option>');
                    }

                }

                let findHighestID = result['data'].length - 1;
                $('#newLocationID').val(parseInt(result['data'][findHighestID]['id']) + 1);

                $('#newLocation').click(function() {
                    addLocationModal.show();
                });

                $('#locationTable tbody tr').on("click", function() {

                    let chosenLocationID = $(this).find('td:nth-child(1)').html();
                    let chosenLocationName;

                    $.ajax({
                        url: "libs/php/getLocationByID.php",
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            id: chosenLocationID
                        },

                        success: function(result, status, xhr) {
                            console.log(JSON.stringify(result));

                            if(result.status.name == "ok") {

                                chosenLocationID = result['data'][0]['id'];
                                chosenLocationName = result['data'][0]['name'];

                                $('#modifyLocationID').val(chosenLocationID);
                                $('#modifyLocationName').val(chosenLocationName);

                                $.ajax({
                                    url: "libs/php/findLocation.php",
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {
                                        id: chosenLocationID
                                    },
                
                                    success: function(result, status, xhr) {
                                        console.log(JSON.stringify(result));
                
                                        if(result.status.name == "ok")
                                        {
                                            if(result['data'][0]['departmentsInLocation'] != 0)
                                            {
                                                $('#modifyLocationError strong').html("This location has departments assigned to it.");
                                            }
                                            else
                                            {
                                                $('#modifyLocationError strong').html("");
                                            }
                                        }
                                    },

                                    error: function(jqXHR, textStatus, errorThrown) {
                                        JSON.stringify(jqXHR);
                                        JSON.stringify(errorThrown);
                                
                                        $('#errorMessage').html(jqXHR + errorThrown);
                                    }
                                });

                                modifyLocationModal.show();
                            }
                        }
                    });
                    
                });
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            JSON.stringify(jqXHR);
            JSON.stringify(errorThrown);

            $('#errorMessage').html(jqXHR + errorThrown);
        }
    });

    $('#addDepartment').submit(function(e) {

        e.preventDefault();

        let departmentID = $('#newDepartmentID').val();
        let departmentName = $('#newDepartmentName').val();
        let chosenLocationID = $('#locationIDSelectAdd').val();

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
    });

    $('#addLocation').submit(function(e) {

        e.preventDefault();

        let locationID = $('#newLocationID').val();
        let locationName = $('#newLocationName').val();

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
    });

    $('#addPersonnel').submit(function(e) {

        e.preventDefault();

        let personnelID = $('#newPersonnelID').val();
        let personnelFirstName = $('#newPersonnelFirstName').val();
        let personnelLastName = $('#newPersonnelLastName').val();
        let personnelJobTitle = $('#newPersonnelJobTitle').val();
        let personnelEmail = $('#newPersonnelEmail').val();
        let personnelDepartment = $('#departmentIDSelectAdd').val();

        $.ajax({
            url: "libs/php/insertPersonnel.php",
            type: 'POST',
            dataType: 'json',
            data: {
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
    });

    $('#modifyLocation').submit(function(e) {

        e.preventDefault();

        let selectedLocationID = $('#modifyLocationID').val();
        let modifiedLocationName = $('#modifyLocationName').val();

        confirmModifyingLocation.show();

        $('#confirmLocationModification').click(function() {
            
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
                        window.location.href = window.location.href;
                    }
                },
                    
                error: function(jqXHR, textStatus, errorThrown) {
                    JSON.stringify(jqXHR);
                    JSON.stringify(errorThrown);
            
                    $('#errorMessage').html(jqXHR + errorThrown);
                }
            });
        });

        $('#noconfirmLocationModification').click(function() {
            
            confirmModifyingLocation.hide();
            $('#modifyLocationError strong').html("LOCATION NOT UPDATED");
        }); 
    });

    $('#modifyDepartment').submit(function(e) {

        e.preventDefault();
        let selectedDepartmentID = $('#modifyDepartmentID').val();
        let modifiedDepartmentName = $('#modifyDepartmentName').val();
        let modifiedLocationID = $('#locationIDSelectModify').val();

        confirmModifyingDepartment.show();

        $('#confirmDepartmentModification').click(function() {

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
                        window.location.href = window.location.href;
                    }
                },

                error: function(jqXHR, textStatus, errorThrown) {
                    JSON.stringify(jqXHR);
                    JSON.stringify(errorThrown);
            
                    $('#errorMessage').html(jqXHR + errorThrown);
                }
            });
        });

        $('#noconfirmDepartmentModification').click(function() {
            
            confirmModifyingDepartment.hide();
            $('#modifyDepartmentError strong').html("DEPARTMENT NOT UPDATED");
        });

    });

    $('#modifyPersonnel').submit(function(e) {

        e.preventDefault();

        let selectedPersonnelID = $('#modifyPersonnelID').val();
        let modifiedPersonnelFirstName = $('#modifyPersonnelFirstName').val();
        let modifiedPersonnelLastName = $('#modifyPersonnelLastName').val();
        let modifiedPersonnelJobTitle = $('#modifyPersonnelJobTitle').val();
        let modifiedPersonnelEmail = $('#modifyPersonnelEmail').val();
        let modifiedDepartmentID = $('#departmentIDSelectModify').val();

        confirmModifyingPersonnel.show();

        $('#confirmPersonnelModification').click(function() {

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
                        window.location.href = window.location.href;
                    }
                },

                error: function(jqXHR, textStatus, errorThrown) {
                    JSON.stringify(jqXHR);
                    JSON.stringify(errorThrown);
            
                    $('#errorMessage').html(jqXHR + errorThrown);
                }
            });
        });
        
        $('#noconfirmPersonnelModification').click(function() {

            confirmModifyingPersonnel.hide();
            $('#modifyPersonnelError strong').html("PERSONNEL NOT UPDATED");

        });
    });

    $('#deletePersonnel').submit(function(e) {

        e.preventDefault();

        let deletePersonnel = $('#modifyPersonnelID').val();

        confirmDeletingPersonnel.show();

        $('#confirmPersonnelDeletion').click(function() {

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
        });

        $('#noconfirmPersonnelDeletion').click(function() {

            confirmDeletingPersonnel.hide();
            $('#modifyPersonnelError strong').html("PERSONNEL NOT DELETED");
        });
    });

    $('#deleteDepartment').submit(function(e) {

        e.preventDefault();
        let checkDepartmentDeletion = $('#modifyDepartmentError strong').html();
        let deleteDepartment = $('#modifyDepartmentID').val();
    

        if(checkDepartmentDeletion != "This department has personnel working here")
        {
            confirmDeletingDepartment.show();

            $('#confirmDepartmentDeletion').click(function() {

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
            });

            $('#noconfirmDepartmentDeletion').click(function() {

                confirmDeletingDepartment.hide();
                $('#modifyDepartmentError strong').html("DEPARTMENT NOT DELETED");
            })
        }
        else
        {
            preventDeletingDepartment.show();
        }
    });

    $('#deleteLocation').submit(function(e) {
        
        e.preventDefault();

        let checkLocationDeletion = $('#modifyLocationError strong').html();
        let deleteLocation = $('#modifyLocationID').val();

        if(checkLocationDeletion != "This location has departments assigned to it.")
        {
            confirmDeletingLocation.show();

            $('#confirmLocationDeletion').click(function() {

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
            });

            $('#noconfirmLocationDeletion').click(function() {

                confirmDeletingLocation.hide();
                $('#modifyLocationError strong').html("LOCATION NOT DELETED");
            }); 
        }
        else
        {
            preventDeletingLocation.show();
        }
        

    });


    $('#personnelSearcher').change(function() {

        deleteTableRows("personnelTable tbody");

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

                    generateChosenTable("table#personnelTable tbody", result['data']);
                    $('table#personnelTable tbody tr td:nth-child(1)').hide();

                    $('#personnelTable tbody tr').on("click", function() {

                        let chosenPersonID = $(this).find('td:nth-child(1)').html();
                        let chosenPersonLastName;
                        let chosenPersonFirstName;
                        let chosenJobTitle;
                        let chosenEmail;
                        let chosenDepartment;
    
                        $.ajax({
                            url: "libs/php/getPersonnelByID.php",
                            type: 'GET',
                            dataType: 'json',
                            data: {
                                id: chosenPersonID
                            },
    
                            success: function(result, status, xhr) {
                                console.log(JSON.stringify(result));
    
                                if(result.status.name == "ok")
                                {
                                    chosenPersonID = result['data']['personnel'][0]['id'];
                                    chosenPersonLastName = result['data']['personnel'][0]['lastName'];
                                    chosenPersonFirstName = result['data']['personnel'][0]['firstName'];
                                    chosenJobTitle = result['data']['personnel'][0]['jobTitle'];
                                    chosenEmail = result['data']['personnel'][0]['email'];
                                    chosenDepartment = result['data']['personnel'][0]['departmentID'];
    
                                    for(let i = 0; i < result['data']['department'].length; i++)
                                    {
                                        let noOfDeptOptions = $('#departmentIDSelectModify option').length;
                                        let deptsReturnedFromDatabase = result['data']['department'].length;
    
                                        if(noOfDeptOptions < deptsReturnedFromDatabase)
                                        {
                                            $('#departmentIDSelectModify').append('<option value=' + result['data']['department'][i]['id'] + '>' + result['data']['department'][i]['name'] + '</option>');
                                        }
                                    }
    
                                    $('#modifyPersonnelID').val(chosenPersonID);
                                    $('#modifyPersonnelFirstName').val(chosenPersonFirstName);
                                    $('#modifyPersonnelLastName').val(chosenPersonLastName);
                                    $('#modifyPersonnelJobTitle').val(chosenJobTitle);
                                    $('#modifyPersonnelEmail').val(chosenEmail);
                                    $('#departmentIDSelectModify').val(chosenDepartment)
    
                                    modifyPersonnelModal.show();
                                }
                            },
    
                            error: function(jqXHR, textStatus, errorThrown){
                                JSON.stringify(jqXHR);
                                JSON.stringify(errorThrown);
                    
                                $('#errorMessage').html(jqXHR + errorThrown);
                            }
                        });
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
        deleteTableRows("departmentTable tbody");

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

                    generateChosenTable("table#departmentTable tbody", result['data']);
                    $('table#departmentTable tbody tr td:nth-child(1)').hide();

                    $('#departmentTable tbody tr').on("click", function() {

                        let chosenDeptID = $(this).find('td:nth-child(1)').html();
                        let chosenDeptName;
                        let chosenLocID;
    
                        $.ajax({
                            url: "libs/php/getDepartmentByID.php",
                            type: 'GET',
                            dataType: 'json',
                            data: {
                                id: chosenDeptID
                            },
    
                            success: function(result, status, xhr) {
                                console.log(JSON.stringify(result));
    
                                if(result.status.name == "ok")
                                {
                                    chosenDeptID = result['data']['department'][0]['id'];
                                    chosenDeptName = result['data']['department'][0]['name'];
                                    chosenLocID = result['data']['department'][0]['locationID'];
    
                                    for(let i = 0; i < result['data']['location'].length; i++)
                                    {
                                        let noOfLocOptions = $('#locationIDSelectModify option').length;
                                        let locsReturnedFromDatabase = result['data']['location'].length;
    
                                        if(noOfLocOptions < locsReturnedFromDatabase)
                                        {
                                            $('#locationIDSelectModify').append('<option value=' + result['data']['location'][i]['id'] + '>' + result['data']['location'][i]['name'] + '</option>');
                                        }
                                    }
    
                                    $('#modifyDepartmentID').val(chosenDeptID);
                                    $('#modifyDepartmentName').val(chosenDeptName);
                                    $('#locationIDSelectModify').val(chosenLocID)
    
                                    $.ajax({
                                        url: "libs/php/findDepartment.php",
                                        type: 'GET',
                                        dataType: 'json',
                                        data: {
                                            id: chosenDeptID
                                        },
                    
                                        success: function(result, status, xhr) {
                                            console.log(JSON.stringify(result));
                    
                                            if(result.status.name == "ok")
                                            {
                                                if(result['data'][0]['personnelInDepartment'] != 0)
                                                {
                                                    $('#modifyDepartmentError strong').html("This department has personnel working here");
                                                }
                                                else
                                                {
                                                    $('#modifyDepartmentError strong').html("");
                                                }
                                            }
                                        },
    
                                        error: function(jqXHR, textStatus, errorThrown){
                                            JSON.stringify(jqXHR);
                                            JSON.stringify(errorThrown);
                                
                                            $('#errorMessage').html(jqXHR + errorThrown);
                                        }
                                    });
                
                                    modifyDepartmentModal.show();
                                }
                            }
                        });
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
        deleteTableRows("locationTable tbody");

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

                    generateChosenTable("table#locationTable tbody", result['data']);
                    $('table#locationTable tbody tr td:nth-child(1)').hide();

                    $('#locationTable tbody tr').on("click", function() {

                        let chosenLocationID = $(this).find('td:nth-child(1)').html();
                        let chosenLocationName;
    
                        $.ajax({
                            url: "libs/php/getLocationByID.php",
                            type: 'GET',
                            dataType: 'json',
                            data: {
                                id: chosenLocationID
                            },
    
                            success: function(result, status, xhr) {
                                console.log(JSON.stringify(result));
    
                                if(result.status.name == "ok") {
    
                                    chosenLocationID = result['data'][0]['id'];
                                    chosenLocationName = result['data'][0]['name'];
    
                                    $('#modifyLocationID').val(chosenLocationID);
                                    $('#modifyLocationName').val(chosenLocationName);
    
                                    $.ajax({
                                        url: "libs/php/findLocation.php",
                                        type: 'GET',
                                        dataType: 'json',
                                        data: {
                                            id: chosenLocationID
                                        },
                    
                                        success: function(result, status, xhr) {
                                            console.log(JSON.stringify(result));
                    
                                            if(result.status.name == "ok")
                                            {
                                                if(result['data'][0]['departmentsInLocation'] != 0)
                                                {
                                                    $('#modifyLocationError strong').html("This location has departments assigned to it.");
                                                }
                                                else
                                                {
                                                    $('#modifyLocationError strong').html("");
                                                }
                                            }
                                        },
    
                                        error: function(jqXHR, textStatus, errorThrown) {
                                            JSON.stringify(jqXHR);
                                            JSON.stringify(errorThrown);
                                    
                                            $('#errorMessage').html(jqXHR + errorThrown);
                                        }
                                    });
    
                                    modifyLocationModal.show();
                                }
                            }
                        });
                      
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