const adminCheck = document.getElementsByClassName("isAdminCheck")

var updateUser = async function() {
    let employeeId = this.getAttribute("data");
    let checked = this.checked ? true : false;
    try {
        const response = await fetch(`/user/${employeeId}?isAdmin=${checked}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json',},
            body: JSON.stringify({
                isAdmin: checked
            })
        });

        if (response.ok) {
            // window.location.replace("/profile")
        } else {
            // Employee removal failed, show error message
        }
    } catch (error) {
        console.error('Log out failed', error);
    }
}

for (var i = 0; i < adminCheck.length; i++) {
    adminCheck[i].addEventListener('click', updateUser);
}