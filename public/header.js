const signoutbtn = document.getElementById("signout")

signoutbtn && signoutbtn.addEventListener("click", async () => {
    try {
        const response = await fetch(`/logout`, {
            method: 'get',
        });

        if (response.ok) {
            window.location.replace("/")
        } else {
            // Employee removal failed, show error message
        }
    } catch (error) {
        console.error('Log out failed', error);
    }
})