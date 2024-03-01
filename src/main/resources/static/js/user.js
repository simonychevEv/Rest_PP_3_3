const userEmail = document.getElementById('userEmail');
const userRole = document.getElementById('userRole');
const userInfo = document.getElementById('userInfo');
getUserInfo()
showUser(user)
function getUserInfo() {
    fetch("/api/user")
        .then(res => res.json())
        .then(data => {
            let userInfoHeader = data;
            showUser(userInfoHeader);
            userEmail.innerText = userInfoHeader.email;
            userRole.innerText = userInfoHeader.roles.map(role => role.name.substring(5, role.length)).join(", ");
        });
}

function showUser(user) {
    userInfo.innerHTML = `
        <tr class="text-center align-middle">
            <td>` + user.id + `</td>
            <td>` + user.username + `</td>
            <td>` + user.lastName + `</td>
            <td>` + user.age + `</td>
            <td>` + user.email + `</td>
            <td>` + user.roles.map(role => role.name.substring(5, role.length)).join(", ") + `</td>
        </tr>     
    `;
}
