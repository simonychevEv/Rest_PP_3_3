const userEmail = document.getElementById('userEmail');
const userRole = document.getElementById('userRole');
const showAllUser = document.getElementById('showAllUser');
const userInfo = document.getElementById('userInfo');
const addNewUserBtn = document.getElementById('newUser');
const homeTab = document.querySelector('#home-tab');

const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const idEdit = document.getElementById('idEdit');
const firstNameEdit = document.getElementById('firstNameEdit');
const lastNameEdit = document.getElementById('lastNameEdit');
const ageEdit = document.getElementById('ageEdit');
const emailEdit = document.getElementById('emailEdit');
const passwordEdit = document.getElementById('passwordEdit');
const rolesAdminEdit = document.getElementById('rolesAdminEdit');
const rolesUserEdit = document.getElementById('rolesUserEdit');
const editUser = document.getElementById('editUser');

const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const idDelete = document.getElementById('idDelete');
const firstNameDelete = document.getElementById('firstNameDelete');
const lastNameDelete = document.getElementById('lastNameDelete');
const ageDelete = document.getElementById('ageDelete');
const emailDelete = document.getElementById('emailDelete');
const rolesAdminDelete = document.getElementById('rolesAdminDelete');
const rolesUserDelete = document.getElementById('rolesUserDelete');
const deleteUser = document.getElementById('deleteUser');

addNewUserBtn.addEventListener('submit', addNewUser);

showUsers()
getUserInfo()

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

function showUsers() {
    fetch("/api/admin")
        .then(res => res.json())
        .then(users => {
            let usersTable = [];
            if (users.length > 0) {
                users.forEach(user => {
                    usersTable.push(user);
                })
            } else {
                usersTable = [];
            }
            showAllUsers(usersTable);
        })
}

function showAllUsers(users) {
    let text = "";
    users.forEach(user => {
        text += `
        <tr class= "text-center align-middle">
        <td>` + user.id + `</td>
        <td>` + user.username + `</td>
        <td>` + user.lastName + `</td>
        <td>` + user.age + `</td>
        <td>` + user.email + `</td>
        <td>` + user.roles.map(role => role.name.substring(5, role.length)).join(", ") + `</td>
        <td>
            <button type="button" class="btn btn-info" data-bs-toggle="modal" onclick="editModalUser(${user.id})"
                data-bs-target="#editModal">Edit
            </button>
        </td>
        <td>
            <button type="button" class="btn btn-danger" data-bs-toggle="modal" onclick="deleteModalUser(${user.id})"
                data-bs-target="#deleteModal">Delete
            </button>
        </td>
        </tr>`
    })
    showAllUser.innerHTML = text;
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

function addNewUser(event) {
    event.preventDefault();
    let formNewUser = new FormData(event.target);
    let user = {
        username: formNewUser.get('username'),
        lastName: formNewUser.get('lastName'),
        age: formNewUser.get('age'),
        email: formNewUser.get('email'),
        password: formNewUser.get('password'),
        roles: rolesUser('#roles'),
    };
    let request = new Request('/api/admin/new', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    fetch(request).then(() =>
        showUsers());
    event.target.reset();
    homeTab.click();
}

function createRole(id, name) {
    return {
        id,
        name,
    };
}

function rolesUser(event) {
    const rolesAdmin = createRole(1, "ROLE_ADMIN");
    const rolesUser = createRole(2, "ROLE_USER");
    let roles = [];
    let allRoles = [];
    let sel = document.querySelector(event);
    for (let i = 0, n = sel.options.length; i < n; i++) {
        if (sel.options[i].selected) {
            roles.push(sel.options[i].value);
        }
    }
    if (roles.includes('1')) {
        allRoles.push(rolesAdmin);
    }
    if (roles.includes('2')) {
        allRoles.push(rolesUser);
    } else if (roles.length === 0) {
        allRoles.push(rolesUser)
    }
    return allRoles;
}

function editModalUser(id) {
    fetch("/api/admin/" + id).then(res => res.json()).then(user => {
        idEdit.setAttribute('value', user.id);
        firstNameEdit.setAttribute('value', user.username);
        lastNameEdit.setAttribute('value', user.lastName);
        ageEdit.setAttribute('value', user.age);
        emailEdit.setAttribute('value', user.email);
        passwordEdit.setAttribute('value', user.password);

        if ((user.roles.length === 2)) {
            rolesAdminEdit.setAttribute('selected', true);
            rolesUserEdit.setAttribute('selected', true);
        }
        if ((user.roles.length < 2)) {
            if ((user.roles.find(role => role.id === 1))) {
                rolesAdminEdit.setAttribute('selected', true);
                rolesUserEdit.setAttribute('selected', false);
            }
            if ((user.roles.find(role => role.id === 2))) {
                rolesAdminEdit.setAttribute('selected', false);
                rolesUserEdit.setAttribute('selected', true);
            }
        }
    });
    editUser.addEventListener('submit', submitFormEditUser);
}

function submitFormEditUser(event) {
    event.preventDefault();
    let userUpdate = new FormData(event.target);
    let user = {
        id: userUpdate.get('id'),
        username: userUpdate.get('username'),
        lastName: userUpdate.get('lastName'),
        age: userUpdate.get('age'),
        email: userUpdate.get('email'),
        password: userUpdate.get('password'),
        roles: rolesUser('#roleEdit'),
    };
    let request = new Request("/api/admin/update/", {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    fetch(request).then(
        () => {
            showUsers();
            event.target.reset();
            editModal.hide();
        });
}

async function deleteModalUser(id) {
    await fetch("/api/admin/" + id).then(res => res.json()).then(user => {
        idDelete.setAttribute('value', user.id);
        firstNameDelete.setAttribute('value', user.username);
        lastNameDelete.setAttribute('value', user.lastName);
        ageDelete.setAttribute('value', user.age);
        emailDelete.setAttribute('value', user.email);

        if ((user.roles.map(role => role.name.includes("ADMIN"))) && ((user.roles.map(role => role.name.includes("USER"))))) {
            rolesAdminEdit.setAttribute('selected', 'true');
            rolesUserEdit.setAttribute('selected', 'true');
        }
        if ((user.roles.map(role => role.name.includes("ADMIN")))) {
            rolesAdminEdit.setAttribute('selected', 'true');
        }
        if ((user.roles.map(role => role.name.includes("USER")))) {
            rolesUserEdit.setAttribute('selected', 'true');
        }
    });

    deleteUser.addEventListener('submit', event => {
        event.preventDefault();
        let request = new Request("/api/admin/delete/" + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        fetch(request).then(
            () => {
                showUsers();
                deleteModal.hide();
            });
    });
}
